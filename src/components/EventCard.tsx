import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";

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
    <div className="group rounded-xl overflow-hidden bg-card neon-border neon-border-hover transition-all duration-300 hover:-translate-y-1">
      <Link to={`/events/${event.slug}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          {event.poster_url ? (
            <img
              src={event.poster_url}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-muted-foreground">🎵</div>
          )}
        </div>
        <div className="p-5">
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            {event.category}
          </span>
          <h3 className="font-display text-lg font-bold mt-1 text-foreground group-hover:text-gradient transition-all">
            {event.title}
          </h3>
          {event.tagline && <p className="text-sm text-muted-foreground mt-1">{event.tagline}</p>}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {event.venue_name}
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            {lowestPrice ? (
              <span className="text-sm font-semibold text-foreground">From {lowestPrice} CZK</span>
            ) : (
              <span className="text-sm text-muted-foreground">TBA</span>
            )}
            <span className="text-xs font-medium text-primary">Details →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
