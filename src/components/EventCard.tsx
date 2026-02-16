import { Link } from "react-router-dom";
import { Event } from "@/data/mockData";
import { Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function EventCard({ event }: { event: Event }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group rounded-xl overflow-hidden bg-card neon-border neon-border-hover transition-all duration-300"
    >
      <Link to={`/events/${event.slug}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-5">
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            {event.category}
          </span>
          <h3 className="font-display text-lg font-bold mt-1 text-foreground group-hover:text-gradient transition-all">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{event.tagline}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {event.venue}
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-semibold text-foreground">
              From {event.ticketTiers[0]?.price} {event.ticketTiers[0]?.currency}
            </span>
            <span className="text-xs font-medium text-primary">Details →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
