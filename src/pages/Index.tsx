import { motion } from "framer-motion";
import { useEvents } from "@/hooks/useData";
import HeroEventCard from "@/components/HeroEventCard";
import { staggerContainer, fadeUp, smoothTransition } from "@/hooks/useScrollReveal";

export default function Index() {
  const { data: events = [] } = useEvents();

  return (
    <div>
      {/* Hero placeholder — video coming soon */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-gradient mb-4">ONE BIG PARTY</h1>
          <p className="text-muted-foreground text-lg">Prague's premier nightlife experience</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
      </section>

      {/* Horizontal scrolling event cards */}
      <section className="relative -mt-32 md:-mt-48 z-10 pb-20">
        <div className="px-4 md:px-8 mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Upcoming <span className="text-gradient">Events</span>
          </h2>
        </div>
        <motion.div
          className="overflow-x-auto scrollbar-hide"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="flex gap-3 md:gap-4 px-4 md:px-8 min-w-max">
            {events.length > 0
              ? events.map((e: any, i: number) => (
                  <motion.div
                    key={e.id}
                    variants={fadeUp}
                    transition={{ ...smoothTransition, delay: i * 0.08 }}
                  >
                    <HeroEventCard event={e} />
                  </motion.div>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    transition={{ ...smoothTransition, delay: i * 0.08 }}
                    className="w-64 h-80 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground text-sm"
                  >
                    Coming Soon
                  </motion.div>
                ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
