"use client";

/**
 * Calm entrance for content blocks: rises a little and resolves from a soft
 * blur into focus the first time it scrolls into view. `index` staggers
 * siblings so lists unfold one card after another.
 */

import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  index?: number;
  as?: "div" | "li";
  className?: string;
  style?: React.CSSProperties;
}

export function Reveal({ children, index = 0, as = "div", className, style }: RevealProps) {
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
