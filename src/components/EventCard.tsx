import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    title: string;
    date: string;
    time: string;
    venue_name: string;
    venue_address: string;
    category: string;
    tags: string[] | null;
    tagline: string | null;
    poster_url: string | null;
    ticket_tiers: { price: number; currency: string }[];
  };
}

export default function EventCard({ event }: EventCardProps) {
  const tags = event.tags?.length ? event.tags : [event.category];

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const displayTime = event.time
    ? event.time.slice(0, 5).replace(":", ":") + (parseInt(event.time) >= 12 ? "PM" : "AM")
    : "";

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group block transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Poster with tags overlay */}
      <div className="relative rounded-lg overflow-hidden bg-muted">
        {/* Tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-destructive text-destructive-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {event.poster_url ? (
          <img
            src={event.poster_url}
            alt={event.title}
            className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[3/4] flex items-center justify-center text-6xl text-muted-foreground/40">
            🎵
          </div>
        )}
      </div>

      {/* Info below poster */}
      <div className="mt-4 space-y-2">
        <h3 className="font-display text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-foreground/80">
          <Calendar size={14} className="text-primary shrink-0" />
          <span>{formattedDate}{displayTime ? ` ${displayTime}` : ""}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-foreground/80">
          <MapPin size={14} className="text-primary shrink-0" />
          <span>{event.venue_name}</span>
        </div>
        <p className="text-xs text-foreground/60">{event.venue_address}</p>
      </div>
    </Link>
  );
}
