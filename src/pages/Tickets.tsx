import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, Mail, Shield, Ticket } from "lucide-react";
import { events, faqs } from "@/data/mockData";

export default function Tickets() {
  const ticketFaqs = faqs.filter((f) => f.q.toLowerCase().includes("ticket") || f.q.toLowerCase().includes("qr") || f.q.toLowerCase().includes("refund"));

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-6xl font-bold"
        >
          Your <span className="text-gradient">Tickets</span>
        </motion.h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
          Buy online, get a unique QR code, show it at the door. It's that simple.
        </p>
      </section>

      {/* How tickets work */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: Ticket, title: "Choose Your Tier", desc: "Early Bird, Regular, or VIP — pick what suits you." },
              { icon: QrCode, title: "Get Your QR", desc: "Unique QR code sent instantly to your email." },
              { icon: Shield, title: "Verified Entry", desc: "Scan at the door. Fast, secure, no paper tickets." },
            ].map((s) => (
              <div key={s.title} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <s.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events with tickets */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-display text-3xl font-bold mb-8">Buy <span className="text-gradient">Tickets</span></h2>
        <div className="space-y-4">
          {events.map((e) => (
            <Link
              key={e.id}
              to={`/events/${e.slug}`}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl bg-card neon-border neon-border-hover gap-4 transition-all"
            >
              <div className="flex items-center gap-4">
                <img src={e.poster} alt={e.title} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="font-display font-semibold">{e.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {e.venue}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">From {e.ticketTiers[0]?.price} {e.ticketTiers[0]?.currency}</span>
                <span className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                  Get Tickets
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Resend ticket */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4 max-w-md text-center">
          <Mail size={32} className="text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Resend My Ticket</h2>
          <p className="text-sm text-muted-foreground mb-6">Lost your QR? Enter your email and order ID to get it again.</p>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm" />
            <input type="text" placeholder="Order ID" className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm" />
            <button type="submit" className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:glow-blue">
              Resend Ticket
            </button>
          </form>
        </div>
      </section>

      {/* Ticket FAQ */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-display text-2xl font-bold text-center mb-8">Ticket <span className="text-gradient">FAQ</span></h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {ticketFaqs.map((f, i) => (
            <details key={i} className="rounded-xl bg-card neon-border p-5 group">
              <summary className="font-semibold cursor-pointer text-foreground group-open:text-primary transition-colors">{f.q}</summary>
              <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
