import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { useEvents } from "@/hooks/useData";
import HeroEventCard from "@/components/HeroEventCard";

export default function Index() {
  const { data: events = [] } = useEvents();

  return (
    <div>
      {/* Full-bleed hero — dark concert vibe */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background" />
      </section>

      {/* Horizontal scrolling event cards — overlapping hero bottom */}
      <section className="relative -mt-48 z-10 pb-20">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 md:px-8 min-w-max">
            {events.length > 0
              ? events.map((e: any) => (
                  <HeroEventCard key={e.id} event={e} />
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-64 h-80 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground text-sm"
                  >
                    Coming Soon
                  </div>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
