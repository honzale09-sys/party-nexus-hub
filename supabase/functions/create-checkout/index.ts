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

    const { items, customer_email, customer_name, origin, promo_code } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "items array is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!customer_email) {
      return new Response(JSON.stringify({ error: "customer_email is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const metadata: Record<string, string> = {
      customer_email,
      customer_name: customer_name || "",
    };

    let subtotal = 0; // in CZK (or item currency, assumed uniform)
    let hasTickets = false;
    let hasProducts = false;

    // Process each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type === "ticket") {
        // Look up ticket tier
        const { data: tier, error } = await supabase
          .from("ticket_tiers")
          .select("*, events(title)")
          .eq("id", item.ticket_tier_id)
          .single();

        if (error || !tier) {
          return new Response(JSON.stringify({ error: `Ticket tier not found: ${item.ticket_tier_id}` }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Check availability
        const remaining = tier.quantity_total - tier.quantity_sold;
        if (item.quantity > remaining) {
          return new Response(JSON.stringify({ error: `Only ${remaining} tickets remaining for ${tier.name}` }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        lineItems.push({
          price_data: {
            currency: tier.currency.toLowerCase(),
            product_data: {
              name: `${(tier as any).events?.title || "Event"} — ${tier.name}`,
              description: `Ticket for ${(tier as any).events?.title}`,
            },
            unit_amount: tier.price * 100, // Convert CZK to hellers
          },
          quantity: item.quantity,
        });

        metadata[`item_${i}_type`] = "ticket";
        metadata[`item_${i}_ticket_tier_id`] = item.ticket_tier_id;
        metadata[`item_${i}_quantity`] = String(item.quantity);
        metadata[`item_${i}_unit_price`] = String(tier.price);
        metadata[`item_${i}_event_id`] = tier.event_id;
        subtotal += tier.price * item.quantity;
        hasTickets = true;

      } else if (item.type === "product") {
        // Look up product variant
        const { data: variant, error } = await supabase
          .from("product_variants")
          .select("*, products(name, price, currency, category)")
          .eq("id", item.product_variant_id)
          .single();

        if (error || !variant) {
          return new Response(JSON.stringify({ error: `Product variant not found: ${item.product_variant_id}` }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (variant.stock < item.quantity) {
          return new Response(JSON.stringify({ error: `Only ${variant.stock} in stock for ${(variant as any).products?.name}` }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const product = (variant as any).products;
        const sizePart = variant.size ? ` (${variant.size})` : "";
        const colorPart = variant.color ? ` — ${variant.color}` : "";

        lineItems.push({
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: `${product.name}${sizePart}${colorPart}`,
            },
            unit_amount: product.price * 100,
          },
          quantity: item.quantity,
        });

        metadata[`item_${i}_type`] = "product";
        metadata[`item_${i}_product_variant_id`] = item.product_variant_id;
        metadata[`item_${i}_quantity`] = String(item.quantity);
        metadata[`item_${i}_unit_price`] = String(product.price);
        subtotal += product.price * item.quantity;
        hasProducts = true;
      }
    }

    // Process promo code if provided
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (promo_code && typeof promo_code === "string" && promo_code.trim()) {
      const codeUpper = promo_code.trim().toUpperCase();
      const { data: promo, error: promoErr } = await supabase
        .from("promo_codes")
        .select("*")
        .ilike("code", codeUpper)
        .eq("active", true)
        .maybeSingle();

      if (promoErr || !promo) {
        return new Response(JSON.stringify({ error: `Invalid promo code: ${codeUpper}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const now = new Date();
      if (promo.valid_from && new Date(promo.valid_from) > now) {
        return new Response(JSON.stringify({ error: "Promo code is not yet active" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (promo.valid_until && new Date(promo.valid_until) < now) {
        return new Response(JSON.stringify({ error: "Promo code has expired" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
        return new Response(JSON.stringify({ error: "Promo code usage limit reached" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (promo.minimum_spend && subtotal < promo.minimum_spend) {
        return new Response(JSON.stringify({ error: `Minimum spend of ${promo.minimum_spend} CZK required` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Check applies_to
      if (promo.applies_to === "tickets" && !hasTickets) {
        return new Response(JSON.stringify({ error: "This code only applies to tickets" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (promo.applies_to === "merch" && !hasProducts) {
        return new Response(JSON.stringify({ error: "This code only applies to merch" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create a single-use Stripe coupon to apply at checkout
      const couponParams: Stripe.CouponCreateParams = {
        name: `Promo: ${promo.code}`,
        duration: "once",
        metadata: { promo_code_id: promo.id, code: promo.code },
      };
      if (promo.discount_type === "percentage") {
        couponParams.percent_off = promo.discount_value;
      } else {
        couponParams.amount_off = promo.discount_value * 100; // CZK -> hellers
        couponParams.currency = "czk";
      }

      const coupon = await stripe.coupons.create(couponParams);
      discounts = [{ coupon: coupon.id }];

      metadata.promo_code_id = promo.id;
      metadata.promo_code = promo.code;
      metadata.promo_discount_type = promo.discount_type;
      metadata.promo_discount_value = String(promo.discount_value);
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancelled`,
      metadata,
      ...(discounts ? { discounts } : { allow_promotion_codes: false }),
    });

    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
