import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useData";

const cats = ["all", "tees", "hoodies", "accessories"] as const;

export default function Merch() {
  const [category, setCategory] = useState<string>("all");
  const { data: products = [], isLoading } = useProducts();

  const filtered = useMemo(
    () => (category === "all" ? products : products.filter((p: any) => p.category === category)),
    [category, products]
  );

  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-20">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-6xl font-bold text-center">
          Official <span className="text-gradient">Merch</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mt-3">Wear the night. Rep the party.</p>

        <div className="flex items-center justify-center gap-3 mt-10">
          {cats.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading products...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {filtered.map((p: any) => {
              const totalStock = p.product_variants?.reduce((s: number, v: any) => s + v.stock, 0) || 0;
              return (
                <motion.div key={p.id} whileHover={{ y: -4 }} className="rounded-xl bg-card neon-border neon-border-hover transition-all overflow-hidden">
                  <Link to={`/merch/${p.slug}`}>
                    <div className="aspect-square bg-muted flex items-center justify-center text-5xl text-muted-foreground">
                      {p.category === "tees" ? "👕" : p.category === "hoodies" ? "🧥" : "🧢"}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-semibold">{p.price} {p.currency}</span>
                        {totalStock <= 0 && <span className="text-xs text-destructive font-medium">Sold Out</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
