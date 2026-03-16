import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const leftLinks = [
  { label: "Events", to: "/events" },
  { label: "Gallery", to: "/gallery" },
];

const centerRightLinks = [
  { label: "Merch", to: "/merch" },
];

const rightLinks = [
  { label: "Contact", to: "/contact" },
  { label: "About Us", to: "/about" },
];

const allLinks = [...leftLinks, ...centerRightLinks, ...rightLinks];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const linkClass = (to: string) =>
    `text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:text-primary ${
      location.pathname === to ? "text-primary" : "text-foreground"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-center h-20 px-4 relative">
        {/* Desktop left links */}
        <div className="hidden md:flex items-center gap-10 absolute left-4 lg:left-8">
          {leftLinks.map((l) => (
            <Link key={l.to} to={l.to} className={linkClass(l.to)}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Center logo */}
        <Link to="/" className="flex items-center">
          <div className="border border-border p-2">
            <img src={logo} alt="ONE BIG PARTY" className="h-10 w-auto" />
          </div>
        </Link>

        {/* Desktop right links */}
        <div className="hidden md:flex items-center gap-10 absolute right-4 lg:right-8">
          {rightLinks.map((l) => (
            <Link key={l.to} to={l.to} className={linkClass(l.to)}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground absolute right-4"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col items-center gap-5">
              {allLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-sm font-semibold uppercase tracking-[0.15em] ${
                    location.pathname === l.to ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
