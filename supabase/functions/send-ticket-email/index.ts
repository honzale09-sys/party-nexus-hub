import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          error: "Email delivery not configured. RESEND_API_KEY is missing.",
          hint: "Add RESEND_API_KEY secret to enable email delivery.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_email, customer_name")
      .eq("id", order_id)
      .single();

    if (orderError) throw orderError;

    // Get ticket instances for this order
    const { data: tickets, error: ticketsError } = await supabase
      .from("ticket_instances")
      .select("id, qr_code, event_id, ticket_tier_id, status")
      .eq("order_id", order_id)
      .eq("status", "valid");

    if (ticketsError) throw ticketsError;

    if (!tickets || tickets.length === 0) {
      return new Response(JSON.stringify({ error: "No valid tickets found for this order" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get event details for the first ticket (all tickets in an order are typically for the same event)
    const { data: event } = await supabase
      .from("events")
      .select("title, date, time, venue_name, venue_address")
      .eq("id", tickets[0].event_id)
      .single();

    // Build QR code image URLs
    const qrSections = tickets
      .map(
        (t: any, i: number) =>
          `<div style="margin-bottom:24px;text-align:center;">
            <p style="font-weight:bold;margin-bottom:8px;">Ticket ${i + 1}</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(t.qr_code)}" alt="QR Code" width="250" height="250" />
            <p style="font-size:12px;color:#888;margin-top:4px;">Code: ${t.qr_code}</p>
          </div>`
      )
      .join("");

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h1 style="color:#7c3aed;">Your Tickets Are Ready! 🎉</h1>
        <p>Hey ${order.customer_name || "there"},</p>
        <p>Thanks for your purchase! Here are your tickets${event ? ` for <strong>${event.title}</strong>` : ""}.</p>
        ${event ? `
        <div style="background:#f4f4f5;padding:16px;border-radius:12px;margin:16px 0;">
          <p style="margin:0;"><strong>📅 ${new Date(event.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong></p>
          <p style="margin:4px 0 0;">⏰ ${event.time} · 📍 ${event.venue_name}</p>
        </div>
        ` : ""}
        ${qrSections}
        <p style="font-size:14px;color:#666;">Show the QR code(s) at the door for entry. Each code is valid for one scan only.</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />
        <p style="font-size:12px;color:#999;">One Big Party · Prague</p>
      </div>
    `;

    // Send via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "One Big Party <tickets@onebigparty.cz>",
        to: [order.customer_email],
        subject: event ? `Your tickets for ${event.title}` : "Your tickets are ready!",
        html: emailHtml,
      }),
    });

    const emailResult = await emailRes.json();

    if (!emailRes.ok) {
      console.error("Resend error:", emailResult);
      return new Response(JSON.stringify({ error: "Failed to send email", details: emailResult }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, email_id: emailResult.id, tickets_sent: tickets.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending ticket email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
