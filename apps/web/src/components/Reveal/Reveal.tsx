"use client";

/**
 * Calm entrance for content blocks: rises a little and resolves from a soft
 * blur into focus the first time it scrolls into view. `index` staggers
 * siblings so lists unfold one card after another.
 *
 * It also marks itself `data-focus="true"` while it sits in the middle band
 * of the viewport, so cards light up as the visitor scrolls past them — the
 * phone-friendly replacement for hover.
 */

import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  index?: number;
  as?: "div" | "li";
  className?: string;
  style?: React.CSSProperties;
}

export function Reveal({ children, index = 0, as = "div", className, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const centered = useInView(ref, { margin: "-38% 0px -38% 0px" });
  const Component = as === "li" ? motion.li : motion.div;

  return (
    <Component
      ref={ref as never}
      data-focus={centered ? "true" : "false"}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      // The filter is dropped once settled: a lingering blur(0px) would keep an
      // extra render pass on every card (and break the glass blur behind it).
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
