import { motion } from "framer-motion";
import { faqs } from "@/data/mockData";
import ScrollReveal from "@/components/ScrollReveal";
import { staggerContainer, fadeUp, smoothTransition } from "@/hooks/useScrollReveal";

export default function FAQ() {
  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-20">
        <ScrollReveal>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-center">
            Frequently <span className="text-gradient">Asked</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-center text-muted-foreground mt-3 mb-12">
            Everything you need to know about ONE BIG PARTY.
          </p>
        </ScrollReveal>

        <motion.div
          className="max-w-2xl mx-auto space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {faqs.map((f, i) => (
            <motion.details
              key={i}
              variants={fadeUp}
              transition={smoothTransition}
              className="rounded-xl bg-card neon-border p-5 group"
            >
              <summary className="font-semibold cursor-pointer text-foreground group-open:text-primary transition-colors">
                {f.q}
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
            </motion.details>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
