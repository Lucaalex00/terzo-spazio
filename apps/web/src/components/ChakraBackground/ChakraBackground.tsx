"use client";

/**
 * The signature visual. A fixed, full-screen ambient background that drifts
 * toward the color of whichever chakra section is currently in view, plus a
 * rail of five chakra dots that "light up" progressively as you scroll down.
 *
 * Sections opt in by rendering with `data-chakra-section="<index>"` (the
 * <Section> component does this). We track the most visible one with an
 * IntersectionObserver — cheap and smooth, and it degrades gracefully if JS
 * is disabled (background simply stays on the first chakra).
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CHAKRAS } from "@/lib/chakras";

export function ChakraBackground() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chakra-section]"));
    if (sections.length === 0) return;

    const visibility = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number(entry.target.getAttribute("data-chakra-section"));
          visibility.set(index, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        // Pick the section with the greatest visible ratio.
        let best = 0;
        let bestRatio = -1;
        for (const [index, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = index;
          }
        }
        setActive(best);
      },
      { threshold: [0.1, 0.25, 0.5, 0.75] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const current = CHAKRAS[active] ?? CHAKRAS[0];

  const scrollTo = (section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Ambient background, behind all content. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        animate={{ backgroundColor: current.tint }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 rounded-full blur-3xl"
          animate={{ backgroundColor: current.color, opacity: 0.18 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Chakra rail: vertical on desktop, horizontal bottom on mobile. */}
      <nav
        aria-label="Sezioni"
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-3 rounded-full bg-white/70 px-4 py-2 shadow-sm backdrop-blur md:bottom-auto md:left-auto md:right-5 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:flex-col md:bg-transparent md:px-0 md:py-0 md:shadow-none"
      >
        {CHAKRAS.map((chakra, index) => {
          const lit = index <= active;
          const isActive = index === active;
          return (
            <button
              key={chakra.id}
              type="button"
              onClick={() => scrollTo(chakra.section)}
              aria-label={`Vai a ${chakra.label}`}
              aria-current={isActive ? "true" : undefined}
              className="group relative grid place-items-center p-1"
            >
              <motion.span
                className="block rounded-full"
                animate={{
                  backgroundColor: lit ? chakra.color : "#d4d4d4",
                  scale: isActive ? 1.5 : 1,
                  opacity: lit ? 1 : 0.5,
                  boxShadow: isActive ? `0 0 12px 2px ${chakra.color}` : "0 0 0 0 transparent",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ width: 12, height: 12 }}
              />
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-neutral-900/90 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 md:block">
                {chakra.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
