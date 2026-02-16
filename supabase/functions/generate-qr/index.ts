import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple QR code SVG generator (no external deps)
function generateQRCodeSVG(data: string): string {
  // We'll use a Google Charts API URL for QR generation stored as a URL,
  // but for the actual QR code value we generate a unique token
  // The QR SVG is not generated server-side; instead we store the unique code
  // and the client/email can render it via any QR library or API
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get order items that are tickets
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("id, item_type, quantity, ticket_tier_id, order_id")
      .eq("order_id", order_id)
      .eq("item_type", "ticket");

    if (itemsError) throw itemsError;
    if (!orderItems || orderItems.length === 0) {
      return new Response(JSON.stringify({ message: "No ticket items in this order" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the order to find the event
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id")
      .eq("id", order_id)
      .single();

    if (orderError) throw orderError;

    const ticketInstances = [];

    for (const item of orderItems) {
      if (!item.ticket_tier_id) continue;

      // Get the event_id from the ticket tier
      const { data: tier, error: tierError } = await supabase
        .from("ticket_tiers")
        .select("event_id")
        .eq("id", item.ticket_tier_id)
        .single();

      if (tierError) throw tierError;

      // Generate one ticket instance per quantity
      for (let i = 0; i < item.quantity; i++) {
        const qrCode = crypto.randomUUID();

        ticketInstances.push({
          order_id: order_id,
          order_item_id: item.id,
          ticket_tier_id: item.ticket_tier_id,
          event_id: tier.event_id,
          qr_code: qrCode,
          status: "valid",
        });
      }
    }

    if (ticketInstances.length === 0) {
      return new Response(JSON.stringify({ message: "No tickets to generate" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if tickets already exist for this order (idempotency)
    const { data: existing } = await supabase
      .from("ticket_instances")
      .select("id")
      .eq("order_id", order_id)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ message: "Tickets already generated for this order" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert all ticket instances
    const { data: inserted, error: insertError } = await supabase
      .from("ticket_instances")
      .insert(ticketInstances)
      .select();

    if (insertError) throw insertError;

    // Build response with QR URLs
    const tickets = inserted.map((t: any) => ({
      id: t.id,
      qr_code: t.qr_code,
      qr_url: generateQRCodeSVG(t.qr_code),
      status: t.status,
      event_id: t.event_id,
      ticket_tier_id: t.ticket_tier_id,
    }));

    return new Response(JSON.stringify({ tickets, count: tickets.length }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating QR codes:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
