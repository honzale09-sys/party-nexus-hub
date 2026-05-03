import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function fetchBytes(url: string): Promise<Uint8Array | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return new Uint8Array(await r.arrayBuffer());
  } catch {
    return null;
  }
}

async function generateTicketPDF(opts: {
  logoBytes: Uint8Array | null;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  customerName: string;
  customerEmail: string;
  tierName: string;
  orderId: string;
  qrCode: string;
  qrPngBytes: Uint8Array | null;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4
  const { width, height } = page;
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const purple = rgb(0.486, 0.227, 0.929);
  const dark = rgb(0.08, 0.08, 0.1);
  const gray = rgb(0.4, 0.4, 0.45);

  // Header band
  page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: dark });

  if (opts.logoBytes) {
    try {
      let img;
      try { img = await pdf.embedPng(opts.logoBytes); }
      catch { img = await pdf.embedJpg(opts.logoBytes); }
      const scale = 70 / img.height;
      page.drawImage(img, { x: 40, y: height - 90, width: img.width * scale, height: 70 });
    } catch { /* ignore */ }
  }

  page.drawText("EVENT TICKET", {
    x: width - 200, y: height - 60, size: 20, font: bold, color: rgb(1, 1, 1),
  });
  page.drawText("ONE BIG PARTY", {
    x: width - 200, y: height - 82, size: 10, font, color: rgb(0.8, 0.8, 0.85),
  });

  // Event title
  let y = height - 160;
  page.drawText(opts.eventTitle, { x: 40, y, size: 22, font: bold, color: dark });
  y -= 30;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: purple });
  y -= 30;

  const fields: [string, string][] = [
    ["Date", opts.eventDate],
    ["Time", opts.eventTime],
    ["Venue", opts.venueName],
    ["Address", opts.venueAddress],
    ["Ticket Type", opts.tierName],
    ["Name", opts.customerName || "—"],
    ["Email", opts.customerEmail],
    ["Order ID", opts.orderId],
  ];

  for (const [label, value] of fields) {
    page.drawText(label.toUpperCase(), { x: 40, y, size: 8, font: bold, color: gray });
    page.drawText(String(value), { x: 40, y: y - 14, size: 12, font, color: dark });
    y -= 36;
  }

  // QR code box
  const qrSize = 180;
  const qrX = width - qrSize - 50;
  const qrY = 220;
  page.drawRectangle({ x: qrX - 10, y: qrY - 10, width: qrSize + 20, height: qrSize + 20, color: rgb(1, 1, 1), borderColor: purple, borderWidth: 2 });
  if (opts.qrPngBytes) {
    try {
      const qrImg = await pdf.embedPng(opts.qrPngBytes);
      page.drawImage(qrImg, { x: qrX, y: qrY, width: qrSize, height: qrSize });
    } catch { /* ignore */ }
  }
  page.drawText("Scan at entrance", { x: qrX + 30, y: qrY - 25, size: 10, font, color: gray });
  page.drawText(opts.qrCode, { x: qrX, y: qrY - 40, size: 7, font, color: gray });

  // Instructions
  const instrY = 130;
  page.drawText("ENTRANCE INSTRUCTIONS", { x: 40, y: instrY, size: 9, font: bold, color: purple });
  const instructions = [
    "• Arrive at least 15 minutes before the event start time.",
    "• Show this QR code at the door (printed or on your phone).",
    "• Each QR code is valid for ONE entry only.",
    "• Bring a valid photo ID matching the booking.",
    "• Tickets are non-refundable and non-transferable.",
  ];
  let iy = instrY - 16;
  for (const line of instructions) {
    page.drawText(line, { x: 40, y: iy, size: 9, font, color: dark });
    iy -= 13;
  }

  // Footer
  page.drawRectangle({ x: 0, y: 0, width, height: 30, color: dark });
  page.drawText("ONE BIG PARTY · Prague · onebigparty.net", {
    x: 40, y: 11, size: 9, font, color: rgb(0.8, 0.8, 0.85),
  });

  return await pdf.save();
}

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
      .select("id, customer_email, customer_name, payment_status")
      .eq("id", order_id)
      .single();

    if (orderError) throw orderError;

    if (order.payment_status !== "paid") {
      return new Response(JSON.stringify({ error: "Order not paid; refusing to send tickets" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    // Get event details
    const { data: event } = await supabase
      .from("events")
      .select("title, date, time, venue_name, venue_address")
      .eq("id", tickets[0].event_id)
      .single();

    // Get tier names
    const tierIds = [...new Set(tickets.map((t: any) => t.ticket_tier_id))];
    const { data: tiers } = await supabase
      .from("ticket_tiers")
      .select("id, name")
      .in("id", tierIds);
    const tierMap = new Map((tiers || []).map((t: any) => [t.id, t.name]));

    // Logo (fetched from published site)
    const logoBytes = await fetchBytes("https://onebigparty.net/logo.png");

    const formattedDate = event
      ? new Date(event.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : "TBA";

    // Generate one PDF per ticket
    const attachments: { filename: string; content: string }[] = [];
    for (let i = 0; i < tickets.length; i++) {
      const t: any = tickets[i];
      const qrPng = await fetchBytes(
        `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(t.qr_code)}`
      );
      const pdfBytes = await generateTicketPDF({
        logoBytes,
        eventTitle: event?.title || "Event",
        eventDate: formattedDate,
        eventTime: event?.time || "",
        venueName: event?.venue_name || "",
        venueAddress: event?.venue_address || "",
        customerName: order.customer_name || "",
        customerEmail: order.customer_email,
        tierName: tierMap.get(t.ticket_tier_id) || "Standard",
        orderId: order.id,
        qrCode: t.qr_code,
        qrPngBytes: qrPng,
      });
      attachments.push({
        filename: `ticket-${i + 1}.pdf`,
        content: bytesToBase64(pdfBytes),
      });
    }

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h1 style="color:#7c3aed;">Your Tickets Are Ready! 🎉</h1>
        <p>Hey ${order.customer_name || "there"},</p>
        <p>Thanks for your purchase! Your ticket${tickets.length > 1 ? "s are" : " is"} attached as PDF${tickets.length > 1 ? "s" : ""}${event ? ` for <strong>${event.title}</strong>` : ""}.</p>
        ${event ? `
        <div style="background:#f4f4f5;padding:16px;border-radius:12px;margin:16px 0;">
          <p style="margin:0;"><strong>📅 ${formattedDate}</strong></p>
          <p style="margin:4px 0 0;">⏰ ${event.time} · 📍 ${event.venue_name}</p>
        </div>` : ""}
        <p style="font-size:14px;color:#666;">Show the QR code on your ticket at the door. Each ticket is valid for one scan only.</p>
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
        attachments,
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
