import { motion } from "framer-motion";
import { useEvents } from "@/hooks/useData";
import HeroEventCard from "@/components/HeroEventCard";
import { staggerContainer, fadeUp, smoothTransition } from "@/hooks/useScrollReveal";

export default function Index() {
  const { data: events = [] } = useEvents();

  return (
    <div>
      {/* Full-bleed hero with looping video */}
      <section className="relative h-[85vh] md:h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%] md:object-center"
          src="/videos/hero-loop.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
      </section>

      {/* Horizontal scrolling event cards */}
      <section className="relative -mt-32 md:-mt-48 z-10 pb-20">
        <motion.div
          className="overflow-x-auto scrollbar-hide"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
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
