import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Shield } from "lucide-react";
import { useEvent } from "@/hooks/useData";
import TicketCheckoutDialog from "@/components/TicketCheckoutDialog";
import ScrollReveal from "@/components/ScrollReveal";
import { fadeUp, scaleIn, slideInLeft, slideInRight, staggerContainer, smoothTransition } from "@/hooks/useScrollReveal";

export default function EventDetail() {
  const { slug } = useParams();
  const { data: event, isLoading } = useEvent(slug || "");
  const [checkoutTier, setCheckoutTier] = useState<any>(null);

  if (isLoading) return <div className="pt-20 min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!event) return (
    <div className="pt-20 container mx-auto px-4 py-40 text-center">
      <h1 className="font-display text-3xl font-bold">Event not found</h1>
      <Link to="/events" className="text-primary mt-4 inline-block">← Back to events</Link>
    </div>
  );

  const capacityPercent = event.capacity_total ? Math.round((event.capacity_sold / event.capacity_total) * 100) : 0;

  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...smoothTransition, duration: 0.4 }}
        >
          <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} /> Back to events
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Poster */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            transition={{ ...smoothTransition, duration: 0.8 }}
            className="lg:col-span-2 rounded-xl overflow-hidden glow-purple"
          >
            {event.poster_url ? (
              <img src={event.poster_url} alt={event.title} className="w-full aspect-[3/4] object-cover" />
            ) : (
              <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center text-8xl">🎵</div>
            )}
          </motion.div>

          {/* Details */}
          <div className="lg:col-span-3">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.1 }}
              className="text-xs uppercase tracking-widest text-primary inline-block"
            >
              {event.category}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ ...smoothTransition, delay: 0.15 }}
              className="font-display text-4xl md:text-5xl font-bold mt-2"
            >
              {event.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.2 }}
              className="text-lg text-muted-foreground mt-3"
            >
              {event.tagline}
            </motion.p>

            <motion.div
              className="grid sm:grid-cols-2 gap-4 mt-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {[
                { icon: Calendar, main: new Date(event.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }), sub: "Date" },
                { icon: Clock, main: `${event.time} CET`, sub: "Doors open" },
                { icon: MapPin, main: event.venue_name, sub: event.venue_address },
                { icon: Shield, main: event.age_restriction, sub: event.dress_code || "No dress code" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} transition={smoothTransition} className="flex items-center gap-3 text-sm">
                  <item.icon size={18} className="text-primary flex-shrink-0" />
                  <div><p className="font-semibold">{item.main}</p><p className="text-muted-foreground">{item.sub}</p></div>
                </motion.div>
              ))}
            </motion.div>

            {event.capacity_total > 0 && (
              <ScrollReveal delay={0.1}>
                <div className="mt-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-semibold text-primary">{capacityPercent}% sold</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${capacityPercent}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    />
                  </div>
                </div>
              </ScrollReveal>
            )}

            {event.lineup && event.lineup.length > 0 && (
              <ScrollReveal delay={0.15}>
                <div className="mt-8">
                  <h3 className="font-display font-semibold text-lg mb-3">Lineup</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.lineup.map((dj: string, i: number) => (
                      <motion.span
                        key={dj}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...smoothTransition, delay: 0.3 + i * 0.05 }}
                        className="px-4 py-2 rounded-lg bg-muted text-sm font-medium"
                      >
                        {dj}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.2}>
              <div className="mt-8">
                <h3 className="font-display font-semibold text-lg mb-3">About This Event</h3>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <div className="mt-8">
                <h3 className="font-display font-semibold text-lg mb-4">Tickets</h3>
                <div className="space-y-3">
                  {event.ticket_tiers?.map((tier: any, i: number) => {
                    const remaining = tier.quantity_total - tier.quantity_sold;
                    const soldOut = remaining <= 0;
                    return (
                      <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...smoothTransition, delay: 0.4 + i * 0.08 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-card neon-border"
                      >
                        <div>
                          <p className="font-semibold">{tier.name}</p>
                          <p className="text-xs text-muted-foreground">{soldOut ? "Sold out" : `${remaining} remaining`} · Max {tier.max_per_order} per order</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-display font-bold text-lg">{tier.price} {tier.currency}</span>
                          <button
                            disabled={soldOut}
                            onClick={() => !soldOut && setCheckoutTier(tier)}
                            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all duration-200 hover:glow-purple active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {soldOut ? "Sold Out" : "Buy"}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            <motion.div
              className="grid sm:grid-cols-3 gap-4 mt-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              {[
                { title: "Entry Rules", text: "Valid ID required. No re-entry. No outside drinks." },
                { title: "Refund Policy", text: "Full refund 48+ hours before event. No refunds after." },
                { title: "Need Help?", text: "Email support@onebigparty.cz or use the Contact page." },
              ].map((b) => (
                <motion.div key={b.title} variants={fadeUp} transition={smoothTransition} className="p-4 rounded-xl bg-muted">
                  <h4 className="text-sm font-semibold mb-1">{b.title}</h4>
                  <p className="text-xs text-muted-foreground">{b.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {checkoutTier && (
        <TicketCheckoutDialog
          open={!!checkoutTier}
          onOpenChange={(open) => !open && setCheckoutTier(null)}
          tier={checkoutTier}
          eventTitle={event?.title || ""}
        />
      )}
    </div>
  );
}
