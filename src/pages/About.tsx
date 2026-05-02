import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-6xl font-bold"
        >
          About <span className="text-gradient">ONE BIG PARTY</span>
        </motion.h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          We exist to create unforgettable nightlife experiences across Prague. From intimate rooftop sessions to warehouse raves — we bring people together through music, energy, and community.
        </p>
      </section>

      {/* Story */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-6">Our <span className="text-gradient">Story</span></h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>Founded in 2023, ONE BIG PARTY started as a small crew of music lovers who wanted more from Prague's nightlife scene. We were tired of overpriced, underwhelming events. So we decided to build our own.</p>
            <p>What began as a single 200-person event has grown into a movement. Today, we host thousands of guests across multiple venues, with a reputation for quality production, incredible sound, and a crowd that comes to dance.</p>
            <p>Every event is meticulously planned — from the lineup to the lighting, the sound system to the security. We believe nightlife should be safe, inclusive, and absolutely unforgettable.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
