import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useEvents } from "@/hooks/useData";
import { Camera } from "lucide-react";

export default function Gallery() {
  const { data: events = [], isLoading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  // Collect events that have gallery images or posters
  const eventsWithMedia = useMemo(
    () => events.filter((e: any) => e.poster_url || (e.gallery_urls && e.gallery_urls.length > 0)),
    [events]
  );

  const allImages = useMemo(() => {
    const imgs: { url: string; eventTitle: string; eventId: string }[] = [];
    const source = selectedEvent === "all" ? eventsWithMedia : eventsWithMedia.filter((e: any) => e.id === selectedEvent);
    source.forEach((e: any) => {
      if (e.poster_url) imgs.push({ url: e.poster_url, eventTitle: e.title, eventId: e.id });
      if (e.gallery_urls) {
        e.gallery_urls.forEach((url: string) => imgs.push({ url, eventTitle: e.title, eventId: e.id }));
      }
    });
    return imgs;
  }, [eventsWithMedia, selectedEvent]);

  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-6xl font-bold text-center"
        >
          Event <span className="text-gradient">Gallery</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mt-3">
          Relive the best moments from our events.
        </p>

        {/* Filter by event */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setSelectedEvent("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedEvent === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Events
          </button>
          {eventsWithMedia.map((e: any) => (
            <button
              key={e.id}
              onClick={() => setSelectedEvent(e.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedEvent === e.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {e.title}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading gallery...</div>
        ) : allImages.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No event photos yet. Check back after our next party!</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-10 space-y-4">
            {allImages.map((img, i) => (
              <motion.div
                key={`${img.url}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid rounded-xl overflow-hidden neon-border neon-border-hover group"
              >
                <div className="relative">
                  <img
                    src={img.url}
                    alt={`Photo from ${img.eventTitle}`}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-sm font-medium text-foreground">{img.eventTitle}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
