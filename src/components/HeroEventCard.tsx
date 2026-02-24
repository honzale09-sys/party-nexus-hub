import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface HeroEventCardProps {
  event: {
    id: string;
    slug: string;
    title: string;
    date: string;
    venue_name: string;
    category: string;
    tags?: string[] | null;
    poster_url: string | null;
  };
}

const tagColors: Record<string, string> = {
  club: "bg-destructive text-destructive-foreground",
  rooftop: "bg-primary text-primary-foreground",
  warehouse: "bg-accent text-accent-foreground",
  theme: "bg-secondary text-secondary-foreground",
};

export default function HeroEventCard({ event }: HeroEventCardProps) {
  const tags = event.tags?.length
    ? event.tags
    : [event.category];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="w-64 md:w-72 flex-shrink-0"
    >
      <Link to={`/events/${event.slug}`} className="block group">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-card border border-border">
          {/* Poster image */}
          {event.poster_url ? (
            <img
              src={event.poster_url}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-4xl text-muted-foreground">
              🎵
            </div>
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

          {/* Genre tags — top left */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  tagColors[tag.toLowerCase()] || "bg-destructive text-destructive-foreground"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title at bottom */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display text-sm font-bold text-foreground leading-tight uppercase tracking-wide">
              {event.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(event.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
              {" · "}
              {event.venue_name}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
