"use client";

/**
 * A chakra-themed section.
 *
 * - Sets the anchor `id` and the `data-chakra-section` index that the
 *   background observer tracks.
 * - Exposes the chakra colors as CSS variables (`--accent` for text/buttons,
 *   `--glow` for light, `--tint` for surfaces) to its children.
 * - Header shows the chakra lotus, Sanskrit name, seed syllable and its
 *   traditional attributes, so each section reads clearly as "a chakra".
 * - A giant seed syllable floats behind the content with a gentle parallax.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Chakra } from "@/lib/chakras";
import { CHAKRAS, chakraVars } from "@/lib/chakras";
import { ChakraGlyph } from "@/components/ChakraGlyph/ChakraGlyph";
import { Reveal } from "@/components/Reveal/Reveal";

interface SectionProps {
  chakra: Chakra;
  children: React.ReactNode;
}

export function Section({ chakra, children }: SectionProps) {
  const index = CHAKRAS.findIndex((c) => c.id === chakra.id);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bijaY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);

  return (
    <section
      ref={ref}
      id={chakra.section}
      data-chakra-section={index}
      style={chakraVars(chakra)}
      className="relative flex min-h-[100svh] scroll-mt-16 flex-col justify-center overflow-hidden px-5 py-24 sm:px-8"
    >
      {/* Seed syllable watermark */}
      <motion.span
        aria-hidden
        style={{ y: bijaY, color: chakra.light }}
        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-display text-[38vw] leading-none opacity-[0.09] md:text-[22vw]"
      >
        {chakra.bija}
      </motion.span>

      <div className="relative mx-auto w-full max-w-4xl">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <Reveal className="shrink-0">
            <ChakraGlyph chakra={chakra} size={112} />
          </Reveal>
          <Reveal index={1}>
            <p
              className="text-xs font-medium uppercase tracking-[0.3em]"
              style={{ color: "var(--accent)" }}
            >
              {chakra.sanskrit} · {chakra.bija}
            </p>
            <h2 className="mt-2 text-balance font-display text-4xl text-neutral-900 sm:text-5xl">
              {chakra.label}
            </h2>
            <p className="mt-3 max-w-prose text-pretty text-neutral-600">{chakra.intention}</p>
            <ul className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.15em] text-neutral-600">
              <li className="chakra-chip">{chakra.petals} petali</li>
              <li className="chakra-chip">{chakra.element}</li>
              <li className="chakra-chip">{chakra.place}</li>
            </ul>
          </Reveal>
        </header>
        {children}
      </div>
    </section>
  );
}
