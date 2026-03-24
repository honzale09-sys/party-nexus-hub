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
      <section className="container mx-auto px-4 py-12 md:py-16">
        <ScrollReveal>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center text-foreground">
            Events
          </h1>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-card aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
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
          <p className="text-center text-muted-foreground py-20">No events scheduled yet.</p>
        )}
      </section>
    </div>
  );
}
