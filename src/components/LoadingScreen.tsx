import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.jpg";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2400;
    const interval = 16;
    const step = 100 / (duration / interval);
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return 100;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Logo reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <img src={logo} alt="ONE BIG PARTY" className="h-16 md:h-20 w-auto" />
        </motion.div>

        {/* Brand text */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-10 font-display"
        >
          Prague's Premium Nightlife
        </motion.p>

        {/* Progress bar — thin line like AP */}
        <div className="w-48 md:w-64">
          <div className="h-[1px] w-full bg-border overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
