import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    title: string;
    date: string;
    venue_name: string;
    category: string;
    tagline: string | null;
    poster_url: string | null;
    ticket_tiers: { price: number; currency: string }[];
  };
}

export default function EventCard({ event }: EventCardProps) {
  const lowestPrice = event.ticket_tiers?.length
    ? Math.min(...event.ticket_tiers.map((t) => t.price))
    : null;

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group block rounded-xl overflow-hidden bg-card neon-border neon-border-hover transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(var(--neon-purple)/0.25)]"
    >
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {event.poster_url ? (
          <img
            src={event.poster_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl text-muted-foreground/50">🎵</div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-primary/20 text-primary backdrop-blur-md border border-primary/20">
            {event.category}
          </span>
        </div>

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-display text-xl md:text-2xl font-bold text-foreground leading-tight group-hover:text-gradient transition-all duration-300">
            {event.title}
          </h3>
          {event.tagline && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{event.tagline}</p>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-primary" />
              {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-primary" />
              {event.venue_name}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            {lowestPrice ? (
              <span className="text-sm font-semibold text-foreground">
                From <span className="text-primary">{lowestPrice} CZK</span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">TBA</span>
            )}
            <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-300">
              Details <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
