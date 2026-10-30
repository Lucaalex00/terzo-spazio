"use client";

/**
 * Global motion settings. `reducedMotion="user"` makes every motion component
 * honor the visitor's "reduce motion" OS setting (transforms are skipped,
 * fades are kept), complementing the CSS rule in globals.css.
 */

import { MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
