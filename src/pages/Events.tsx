import { useMemo } from "react";
import { motion } from "framer-motion";
import { useEvents } from "@/hooks/useData";
import EventCard from "@/components/EventCard";
import ScrollReveal from "@/components/ScrollReveal";
import { staggerContainer, fadeUp, smoothTransition } from "@/hooks/useScrollReveal";
import { Calendar, Sparkles } from "lucide-react";

export default function Events() {
  const { data: events = [], isLoading } = useEvents();

  const sorted = useMemo(() => {
    return [...events].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const nextEvent = sorted[0];

  return (
    <div className="pt-20">
      {/* Hero banner */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-neon-pink/8 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={16} className="text-primary" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Don't miss out</span>
              <Sparkles size={16} className="text-primary" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-center leading-[0.9]">
              Upcoming<br />
              <span className="text-gradient">Parties</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-center text-muted-foreground mt-5 max-w-md mx-auto text-sm md:text-base">
              Discover what's next. Grab your tickets before they're gone.
            </p>
          </ScrollReveal>

          {/* Next event highlight */}
          {nextEvent && (
            <ScrollReveal delay={0.15}>
              <div className="mt-8 flex items-center justify-center">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface neon-border text-sm">
                  <Calendar size={14} className="text-primary" />
                  <span className="text-muted-foreground">Next up:</span>
                  <span className="font-display font-semibold text-foreground">{nextEvent.title}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-primary font-medium">
                    {new Date(nextEvent.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Events grid */}
      <section className="container mx-auto px-4 pb-24">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-card neon-border aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={staggerContainer}
          >
            {sorted.map((e: any) => (
              <motion.div key={e.id} variants={fadeUp} transition={smoothTransition}>
                <EventCard event={e} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface mb-4">
              <Calendar size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No events scheduled yet. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
