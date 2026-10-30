"use client";

/**
 * A chakra-themed section. Sets the anchor id and the `data-chakra-section`
 * index the background observer tracks, exposes the chakra accent color as a
 * `--accent` CSS variable for its children, and fades/rises its content in on
 * first view with a minimal, calm motion.
 */

import { motion } from "motion/react";
import type { Chakra } from "@/lib/chakras";
import { CHAKRAS } from "@/lib/chakras";

interface SectionProps {
  chakra: Chakra;
  children: React.ReactNode;
}

export function Section({ chakra, children }: SectionProps) {
  const index = CHAKRAS.findIndex((c) => c.id === chakra.id);

  return (
    <section
      id={chakra.section}
      data-chakra-section={index}
      style={{ ["--accent" as string]: chakra.color }}
      className="relative flex min-h-screen scroll-mt-16 flex-col justify-center px-5 py-20 sm:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto w-full max-w-3xl"
      >
        <header className="mb-8">
          <span
            className="text-xs font-medium uppercase tracking-[0.25em]"
            style={{ color: "var(--accent)" }}
          >
            {chakra.sanskrit}
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-neutral-900 sm:text-4xl">
            {chakra.label}
          </h2>
          <p className="mt-2 max-w-prose text-neutral-600">{chakra.intention}</p>
        </header>
        {children}
      </motion.div>
    </section>
  );
}
