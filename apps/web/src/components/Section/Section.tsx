"use client";

/**
 * A chakra-themed section, floating over the light tunnel.
 *
 * - Sets the anchor `id` and the `data-chakra-section` index that drives the
 *   journey (the chakra in the middle of the screen commands the tunnel).
 * - Exposes the chakra colors as CSS variables (`--accent` for text,
 *   `--glow` for light, `--deep` for dark surfaces) to its children.
 * - Header: the chakra lotus, a Sanskrit eyebrow that "focuses" its letters
 *   into place, a title crossed by a beam of light, and the chakra's
 *   attributes popping in one by one — all scroll-driven, no hover needed.
 * - A giant seed syllable floats behind the content with a gentle parallax
 *   (CSS scroll-driven animation; static where unsupported).
 */

import { motion } from "motion/react";
import type { Chakra } from "@/lib/chakras";
import { CHAKRAS, chakraVars } from "@/lib/chakras";
import { ChakraGlyph } from "@/components/ChakraGlyph/ChakraGlyph";
import { Reveal } from "@/components/Reveal/Reveal";
import { Shimmer } from "@/components/Shimmer/Shimmer";

interface SectionProps {
  chakra: Chakra;
  children: React.ReactNode;
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Section({ chakra, children }: SectionProps) {
  const index = CHAKRAS.findIndex((c) => c.id === chakra.id);
  const attributes = [`${chakra.petals} petali`, chakra.element, chakra.place];

  return (
    <section
      id={chakra.section}
      data-chakra-section={index}
      style={chakraVars(chakra)}
      className="chakra-section relative flex min-h-[100svh] scroll-mt-16 flex-col justify-center overflow-hidden px-5 py-28 sm:px-8"
    >
      {/* Seed syllable watermark; its parallax is a CSS scroll-driven
          animation (globals.css), run by the browser off the main thread. */}
      <span
        aria-hidden
        style={{ color: chakra.light }}
        className="watermark-drift pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[40vw] leading-none opacity-[0.08] md:text-[22vw]"
      >
        {chakra.bija}
      </span>

      <div className="relative mx-auto w-full max-w-4xl">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <Reveal className="shrink-0">
            <ChakraGlyph chakra={chakra} size={116} />
          </Reveal>
          <div>
            <motion.p
              className="text-xs font-medium uppercase"
              style={{ color: "var(--accent)" }}
              initial={{ opacity: 0, letterSpacing: "0.9em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.2, ease: easeOut }}
            >
              {chakra.sanskrit} · {chakra.bija}
            </motion.p>
            <Reveal index={1}>
              <h2 className="mt-2 text-balance font-display text-4xl sm:text-5xl">
                <Shimmer text={chakra.label} />
              </h2>
              <p className="text-glow mt-3 max-w-prose text-pretty text-white/80">
                {chakra.intention}
              </p>
            </Reveal>
            <ul className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.15em] text-white/80">
              {attributes.map((attribute, i) => (
                <motion.li
                  key={attribute}
                  className="chakra-chip"
                  initial={{ opacity: 0, scale: 0.6, y: 8 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.35 + i * 0.12, ease: easeOut }}
                >
                  {attribute}
                </motion.li>
              ))}
            </ul>
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
