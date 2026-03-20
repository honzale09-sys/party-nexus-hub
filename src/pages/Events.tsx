import { useMemo } from "react";
import { motion } from "framer-motion";
import { useEvents } from "@/hooks/useData";
import EventCard from "@/components/EventCard";
import ScrollReveal from "@/components/ScrollReveal";
import { staggerContainer, fadeUp, smoothTransition } from "@/hooks/useScrollReveal";

export default function Events() {
  const { data: events = [], isLoading } = useEvents();

  const sorted = useMemo(() => {
    return [...events].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-20">
        <ScrollReveal>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-center">
            Upcoming <span className="text-gradient">Parties</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-center text-muted-foreground mt-3">Discover what's next. Grab your tickets before they're gone.</p>
        </ScrollReveal>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading events...</div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {sorted.map((e: any) => (
              <motion.div key={e.id} variants={fadeUp} transition={smoothTransition}>
                <EventCard event={e} />
              </motion.div>
            ))}
          </motion.div>
        )}
        {!isLoading && sorted.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No events found.</p>
        )}
      </section>
    </div>
  );
}
