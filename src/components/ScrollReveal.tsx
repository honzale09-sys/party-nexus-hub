import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { useScrollReveal, fadeUp, smoothTransition } from "@/hooks/useScrollReveal";

interface Props {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, variants = fadeUp, className, delay = 0 }: Props) {
  const { ref, isInView } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ ...smoothTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
