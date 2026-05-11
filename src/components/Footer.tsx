import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { fadeUp, staggerContainer, smoothTransition } from "@/hooks/useScrollReveal";

const footerLinks = [
  { label: "FAQ", to: "/faq" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Refund Policy", to: "/refund-policy" },
];

const socials = [
  { icon: Instagram, href: "https://www.instagram.com/1big.party/", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <motion.div
        className="container mx-auto px-4 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={fadeUp} transition={smoothTransition}>
            <img src={logo} alt="ONE BIG PARTY" className="h-12 w-auto mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prague's wildest nightlife experience. Curated events, unforgettable nights.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} transition={smoothTransition}>
            <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} transition={smoothTransition}>
            <h4 className="text-sm font-semibold text-foreground mb-3">Follow Us</h4>
            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200 active:scale-[0.95]"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © {new Date().getFullYear()} ONE BIG PARTY. All rights reserved.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}
