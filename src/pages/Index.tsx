import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { useEvents } from "@/hooks/useData";
import HeroEventCard from "@/components/HeroEventCard";
import ScrollReveal from "@/components/ScrollReveal";
import { staggerContainer, fadeUp, smoothTransition } from "@/hooks/useScrollReveal";

export default function Index() {
  const { data: events = [] } = useEvents();

  return (
    <div>
      {/* Full-bleed hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background" />
      </section>

      {/* Horizontal scrolling event cards */}
      <section className="relative -mt-48 z-10 pb-20">
        <motion.div
          className="overflow-x-auto scrollbar-hide"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="flex gap-4 px-4 md:px-8 min-w-max">
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
