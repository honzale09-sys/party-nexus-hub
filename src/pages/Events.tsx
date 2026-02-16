import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { events } from "@/data/mockData";
import EventCard from "@/components/EventCard";

const categories = ["all", "club", "rooftop", "warehouse", "theme"] as const;

export default function Events() {
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("soonest");

  const filtered = useMemo(() => {
    let list = category === "all" ? [...events] : events.filter((e) => e.category === category);
    if (sort === "soonest") list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sort === "price") list.sort((a, b) => (a.ticketTiers[0]?.price || 0) - (b.ticketTiers[0]?.price || 0));
    return list;
  }, [category, sort]);

  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-6xl font-bold text-center"
        >
          Upcoming <span className="text-gradient">Parties</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mt-3">
          Discover what's next. Grab your tickets before they're gone.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm bg-muted text-foreground border-none outline-none cursor-pointer"
          >
            <option value="soonest">Soonest</option>
            <option value="price">Price: Low → High</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No events found in this category.</p>
        )}
      </section>
    </div>
  );
}
