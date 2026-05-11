import { motion } from "framer-motion";
import { Mail, Instagram, Clock, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-6xl font-bold text-center"
        >
          Get In <span className="text-gradient">Touch</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mt-3">We'd love to hear from you.</p>

        <div className="grid md:grid-cols-2 gap-12 mt-16 max-w-4xl mx-auto">
          {/* Form */}
          <div>
            <h2 className="font-display text-xl font-bold mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm" />
              <input type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm" />
              <select className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm">
                <option value="">Subject</option>
                <option value="tickets">Ticket issue</option>
                <option value="merch">Merch order</option>
                <option value="events">Event inquiry</option>
                <option value="other">Other</option>
              </select>
              <textarea placeholder="Your message" rows={5} className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm resize-none" />
              <button type="submit" className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:glow-purple">
                Send Message
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-xl font-bold mb-4">Contact Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary" />
                  <span className="text-sm">info@onebigparty.net</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-primary" />
                  <span className="text-sm">Support: Mon-Fri, 10:00 - 18:00 CET</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/1big.party/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Quick Help</h3>
              <div className="space-y-2">
                {[
                  { label: "Lost my ticket QR", to: "/tickets" },
                  { label: "Merch order status", to: "/contact" },
                  { label: "Refund request", to: "/refund-policy" },
                ].map((l) => (
                  <a key={l.label} href={l.to} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <MessageSquare size={14} /> {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
