import { motion } from "framer-motion";
import { Shield, Music, Users, HeartHandshake } from "lucide-react";

const values = [
  { icon: Music, title: "Curated Lineups", desc: "We handpick every DJ and performer to deliver world-class sets." },
  { icon: Shield, title: "Safe Experiences", desc: "Professional security, verified tickets, and zero tolerance for bad behavior." },
  { icon: Users, title: "Premium Venues", desc: "The best clubs, rooftops, and warehouses Prague has to offer." },
  { icon: HeartHandshake, title: "Customer First", desc: "24/7 support, hassle-free refunds, and smooth QR entry every time." },
];

const team = [
  { name: "Martin V.", role: "Founder & Creative Director" },
  { name: "Petra K.", role: "Head of Events" },
  { name: "David L.", role: "Operations Manager" },
  { name: "Zuzana N.", role: "Marketing Lead" },
];

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

      {/* Values */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12">Our <span className="text-gradient">Values</span></h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <v.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">The <span className="text-gradient">Team</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((t) => (
              <div key={t.name} className="rounded-xl bg-background neon-border p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-2xl text-muted-foreground">
                  👤
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners placeholder */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-8">Partners & <span className="text-gradient">Press</span></h2>
        <div className="flex items-center justify-center gap-12 flex-wrap text-muted-foreground">
          {["ROXY", "SaSaZu", "Lucerna", "Chapeau Rouge", "MeetFactory"].map((p) => (
            <span key={p} className="text-lg font-display font-semibold opacity-40 hover:opacity-100 transition-opacity">
              {p}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
