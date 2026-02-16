import { motion } from "framer-motion";
import { faqs } from "@/data/mockData";

export default function FAQ() {
  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-6xl font-bold text-center"
        >
          Frequently <span className="text-gradient">Asked</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mt-3 mb-12">
          Everything you need to know about ONE BIG PARTY.
        </p>

        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="rounded-xl bg-card neon-border p-5 group">
              <summary className="font-semibold cursor-pointer text-foreground group-open:text-primary transition-colors">
                {f.q}
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
