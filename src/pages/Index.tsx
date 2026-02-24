import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, QrCode, CreditCard, PartyPopper, Ticket, Camera } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useEvents, useProducts } from "@/hooks/useData";
import EventCard from "@/components/EventCard";
import { testimonials, faqs } from "@/data/mockData";

const steps = [
  { icon: PartyPopper, title: "Choose Event", desc: "Browse upcoming parties & pick your night" },
  { icon: CreditCard, title: "Pay Securely", desc: "Quick checkout via Stripe" },
  { icon: QrCode, title: "Get QR Ticket", desc: "Unique QR code sent to your email" },
  { icon: Ticket, title: "Show at Entry", desc: "Scan & enter — no waiting" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

export default function Index() {
  const { data: events = [] } = useEvents();
  const { data: products = [] } = useProducts();

  const featured = events.find((e: any) => e.featured) || events[0];
  const upcoming = events.slice(0, 3);
  const featuredProducts = products.filter((p: any) => p.featured).slice(0, 3);

  const lowestPrice = (tiers: any[]) =>
    tiers?.length ? Math.min(...tiers.map((t: any) => t.price)) : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="relative z-10 container mx-auto px-4 text-center py-32">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-sm font-medium uppercase tracking-[0.3em] text-primary mb-4">Prague, Czech Republic</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Prague's Biggest Nights.<br /><span className="text-gradient">ONE BIG PARTY.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg md:text-xl text-muted-foreground mt-6 max-w-xl mx-auto">Limited capacity. Verified tickets. No second chances.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/events" className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base transition-all hover:glow-purple hover:scale-105">View Parties</Link>
            <Link to="/tickets" className="px-8 py-3.5 rounded-lg border border-border text-foreground font-semibold text-base transition-all hover:border-primary hover:text-primary">Buy Tickets</Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Event */}
      {featured && (
        <section className="container mx-auto px-4 py-20">
          <h2 className="font-display text-3xl font-bold mb-8">Next <span className="text-gradient">Event</span></h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl overflow-hidden glow-purple aspect-video bg-muted">
              {featured.poster_url ? <img src={featured.poster_url} alt={featured.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-6xl">🎵</div>}
            </motion.div>
            <div>
              <span className="text-xs uppercase tracking-widest text-primary">{featured.category}</span>
              <h3 className="font-display text-3xl font-bold mt-2">{featured.title}</h3>
              <p className="text-muted-foreground mt-3">{featured.tagline}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span>📅 {new Date(featured.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span>🕐 {featured.time}</span>
                <span>📍 {featured.venue_name}</span>
              </div>
              {lowestPrice(featured.ticket_tiers) && <p className="text-lg font-semibold mt-4">From {lowestPrice(featured.ticket_tiers)} CZK</p>}
              <Link to={`/events/${featured.slug}`} className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:glow-purple hover:scale-105">
                Get Tickets <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold">Upcoming <span className="text-gradient">Parties</span></h2>
          <Link to="/events" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((e: any) => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">How It <span className="text-gradient">Works</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4"><s.icon size={28} className="text-primary" /></div>
                <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Merch teaser */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold">Official <span className="text-gradient">Merch</span></h2>
          <Link to="/merch" className="text-sm text-primary hover:underline">Shop all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p: any) => (
            <motion.div key={p.id} whileHover={{ y: -4 }} className="rounded-xl bg-card neon-border neon-border-hover p-6 transition-all">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center mb-4">
                <span className="text-4xl text-muted-foreground">{p.category === "tees" ? "👕" : p.category === "hoodies" ? "🧥" : "🧢"}</span>
              </div>
              <h3 className="font-display font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="font-semibold">{p.price} {p.currency}</span>
                <Link to={`/merch/${p.slug}`} className="text-xs text-primary">View →</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 justify-center mb-3">
            <Camera size={20} className="text-primary" />
            <h2 className="font-display text-3xl font-bold text-center">Party <span className="text-gradient">Gallery</span></h2>
          </div>
          <p className="text-center text-muted-foreground text-sm max-w-md mx-auto">Moments from our unforgettable nights in Prague</p>
        </div>
        {(() => {
          const allImages = events.flatMap((e: any) => (e.gallery_urls || []).map((url: string) => ({ url, title: e.title })));
          const galleryImages = allImages.length > 0 ? allImages.slice(0, 8) : [
            { url: "/placeholder.svg", title: "Coming Soon" },
            { url: "/placeholder.svg", title: "Coming Soon" },
            { url: "/placeholder.svg", title: "Coming Soon" },
            { url: "/placeholder.svg", title: "Coming Soon" },
            { url: "/placeholder.svg", title: "Coming Soon" },
            { url: "/placeholder.svg", title: "Coming Soon" },
          ];
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 px-2 md:px-4">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <div className={`${i === 0 ? "aspect-square" : "aspect-square"} bg-muted`}>
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-sm font-display font-semibold text-foreground">{img.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* Testimonials */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">What People <span className="text-gradient">Say</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-xl bg-background neon-border p-6">
                <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, j) => <span key={j} className="text-primary">★</span>)}</div>
                <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                <p className="text-sm font-semibold mt-3 text-foreground">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12">Frequently <span className="text-gradient">Asked</span></h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.slice(0, 4).map((f, i) => (
            <details key={i} className="rounded-xl bg-card neon-border p-5 group">
              <summary className="font-semibold cursor-pointer text-foreground group-open:text-primary transition-colors">{f.q}</summary>
              <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="text-center mt-8"><Link to="/faq" className="text-sm text-primary hover:underline">View all FAQs →</Link></div>
      </section>
    </div>
  );
}
