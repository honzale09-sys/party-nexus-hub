import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Shield } from "lucide-react";
import { events } from "@/data/mockData";

export default function EventDetail() {
  const { slug } = useParams();
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return (
      <div className="pt-20 container mx-auto px-4 py-40 text-center">
        <h1 className="font-display text-3xl font-bold">Event not found</h1>
        <Link to="/events" className="text-primary mt-4 inline-block">← Back to events</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-10">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={14} /> Back to events
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 rounded-xl overflow-hidden glow-blue"
          >
            <img src={event.poster} alt={event.title} className="w-full aspect-[3/4] object-cover" />
          </motion.div>

          {/* Details */}
          <div className="lg:col-span-3">
            <span className="text-xs uppercase tracking-widest text-primary">{event.category}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">{event.title}</h1>
            <p className="text-lg text-muted-foreground mt-3">{event.tagline}</p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={18} className="text-primary" />
                <div>
                  <p className="font-semibold">{new Date(event.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  <p className="text-muted-foreground">Date</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={18} className="text-primary" />
                <div>
                  <p className="font-semibold">{event.time} CET</p>
                  <p className="text-muted-foreground">Doors open</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={18} className="text-primary" />
                <div>
                  <p className="font-semibold">{event.venue}</p>
                  <p className="text-muted-foreground">{event.venueAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={18} className="text-primary" />
                <div>
                  <p className="font-semibold">{event.ageRestriction}</p>
                  <p className="text-muted-foreground">{event.dressCode || "No dress code"}</p>
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-semibold text-primary">{event.capacityPercent}% sold</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${event.capacityPercent}%` }} />
              </div>
            </div>

            {/* Lineup */}
            {event.lineup && (
              <div className="mt-8">
                <h3 className="font-display font-semibold text-lg mb-3">Lineup</h3>
                <div className="flex flex-wrap gap-2">
                  {event.lineup.map((dj) => (
                    <span key={dj} className="px-4 py-2 rounded-lg bg-muted text-sm font-medium">{dj}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-8">
              <h3 className="font-display font-semibold text-lg mb-3">About This Event</h3>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            {/* Tickets */}
            <div className="mt-8">
              <h3 className="font-display font-semibold text-lg mb-4">Tickets</h3>
              <div className="space-y-3">
                {event.ticketTiers.map((tier) => (
                  <div key={tier.id} className="flex items-center justify-between p-4 rounded-xl bg-card neon-border">
                    <div>
                      <p className="font-semibold">{tier.name}</p>
                      <p className="text-xs text-muted-foreground">{tier.remaining} remaining · Max {tier.maxPerOrder} per order</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display font-bold text-lg">{tier.price} {tier.currency}</span>
                      <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all hover:glow-blue hover:scale-105">
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info blocks */}
            <div className="grid sm:grid-cols-3 gap-4 mt-10">
              {[
                { title: "Entry Rules", text: "Valid ID required. No re-entry. No outside drinks." },
                { title: "Refund Policy", text: "Full refund 48+ hours before event. No refunds after." },
                { title: "Need Help?", text: "Email support@onebigparty.cz or use the Contact page." },
              ].map((b) => (
                <div key={b.title} className="p-4 rounded-xl bg-muted">
                  <h4 className="text-sm font-semibold mb-1">{b.title}</h4>
                  <p className="text-xs text-muted-foreground">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
