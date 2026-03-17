import { useMemo } from "react";
import { motion } from "framer-motion";
import { useEvents } from "@/hooks/useData";
import EventCard from "@/components/EventCard";

export default function Events() {
  const { data: events = [], isLoading } = useEvents();

  const sorted = useMemo(() => {
    return [...events].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-20">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-6xl font-bold text-center">
          Upcoming <span className="text-gradient">Parties</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mt-3">Discover what's next. Grab your tickets before they're gone.</p>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading events...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {sorted.map((e: any) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
        {!isLoading && sorted.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No events found.</p>
        )}
      </section>
    </div>
  );
}
