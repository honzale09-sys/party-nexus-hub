import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useData";
import ScrollReveal from "@/components/ScrollReveal";
import { staggerContainer, fadeUp, smoothTransition } from "@/hooks/useScrollReveal";

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
        <ScrollReveal>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-center">
            Official <span className="text-gradient">Merch</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-center text-muted-foreground mt-3">Wear the night. Rep the party.</p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex items-center justify-center gap-3 mt-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                  category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading products...</div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {filtered.map((p: any) => {
              const totalStock = p.product_variants?.reduce((s: number, v: any) => s + v.stock, 0) || 0;
              return (
                <motion.div
                  key={p.id}
                  variants={fadeUp}
                  transition={smoothTransition}
                  className="rounded-xl bg-card neon-border neon-border-hover transition-all overflow-hidden group"
                >
                  <Link to={`/merch/${p.slug}`}>
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-5xl text-muted-foreground transition-transform duration-500 group-hover:scale-110">
                          {p.category === "tees" ? "👕" : p.category === "hoodies" ? "🧥" : "🧢"}
                        </span>
                      )}
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
          </motion.div>
        )}
      </section>
    </div>
  );
}
