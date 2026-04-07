import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { session_id } = await req.json();

    if (!session_id) {
      return new Response(JSON.stringify({ error: "session_id is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if order already exists for this session
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session_id)
      .maybeSingle();

    if (existingOrder) {
      return new Response(JSON.stringify({ success: true, order_id: existingOrder.id, already_processed: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ error: "Payment not completed" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const meta = session.metadata || {};
    const customerEmail = meta.customer_email || session.customer_email || "";
    const customerName = meta.customer_name || "";

    // Calculate total from metadata
    let totalAmount = 0;
    const orderItems: any[] = [];
    let i = 0;

    while (meta[`item_${i}_type`]) {
      const itemType = meta[`item_${i}_type`];
      const quantity = parseInt(meta[`item_${i}_quantity`] || "1");
      const unitPrice = parseInt(meta[`item_${i}_unit_price`] || "0");
      const totalPrice = unitPrice * quantity;
      totalAmount += totalPrice;

      const orderItem: any = {
        item_type: itemType,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
      };

      if (itemType === "ticket") {
        orderItem.ticket_tier_id = meta[`item_${i}_ticket_tier_id`];
      } else if (itemType === "product") {
        orderItem.product_variant_id = meta[`item_${i}_product_variant_id`];
      }

      orderItems.push(orderItem);
      i++;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_email: customerEmail,
        customer_name: customerName || null,
        total_amount: totalAmount,
        currency: session.currency?.toUpperCase() || "CZK",
        payment_status: "paid",
        fulfillment_status: "confirmed",
        stripe_session_id: session_id,
        stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    for (const item of orderItems) {
      item.order_id = order.id;
    }

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // For ticket items, generate QR codes
    const hasTickets = orderItems.some(item => item.item_type === "ticket");
    let tickets: any[] = [];

    if (hasTickets) {
      // Call the generate-qr function internally
      const ticketInstances: any[] = [];

      for (const item of orderItems) {
        if (item.item_type !== "ticket" || !item.ticket_tier_id) continue;

        const { data: tier } = await supabase
          .from("ticket_tiers")
          .select("event_id")
          .eq("id", item.ticket_tier_id)
          .single();

        if (!tier) continue;

        // Find the order_item_id
        const { data: orderItemData } = await supabase
          .from("order_items")
          .select("id")
          .eq("order_id", order.id)
          .eq("ticket_tier_id", item.ticket_tier_id)
          .single();

        for (let q = 0; q < item.quantity; q++) {
          const qrCode = crypto.randomUUID();
          ticketInstances.push({
            order_id: order.id,
            order_item_id: orderItemData?.id || order.id,
            ticket_tier_id: item.ticket_tier_id,
            event_id: tier.event_id,
            qr_code: qrCode,
            status: "valid",
          });
        }

        // Update quantity_sold
        await supabase.rpc("has_role", { _user_id: order.id, _role: "admin" }).then(() => {});
        // Direct update via service role
        const { data: currentTier } = await supabase
          .from("ticket_tiers")
          .select("quantity_sold")
          .eq("id", item.ticket_tier_id)
          .single();

        if (currentTier) {
          await supabase
            .from("ticket_tiers")
            .update({ quantity_sold: currentTier.quantity_sold + item.quantity })
            .eq("id", item.ticket_tier_id);
        }
      }

      if (ticketInstances.length > 0) {
        const { data: inserted } = await supabase
          .from("ticket_instances")
          .insert(ticketInstances)
          .select();

        tickets = (inserted || []).map((t: any) => ({
          id: t.id,
          qr_code: t.qr_code,
          qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(t.qr_code)}`,
        }));
      }
    }

    // For product items, decrement stock
    for (const item of orderItems) {
      if (item.item_type !== "product" || !item.product_variant_id) continue;

      const { data: variant } = await supabase
        .from("product_variants")
        .select("stock")
        .eq("id", item.product_variant_id)
        .single();

      if (variant) {
        await supabase
          .from("product_variants")
          .update({ stock: Math.max(0, variant.stock - item.quantity) })
          .eq("id", item.product_variant_id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      order_id: order.id,
      tickets,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
