"use client";

/**
 * Orchestrates the chakra journey:
 *
 * 1. Tracks which chakra section crosses the middle of the viewport.
 * 2. Drives the WebGL light tunnel (ChakraJourney) with it — the chakra
 *    commands every color transition.
 * 3. On each change shows the "portal": the new chakra's seed syllable rushes
 *    out of the vanishing point and past the visitor (with a tiny haptic tick
 *    on phones that support it).
 * 4. Renders the energy channel: a vertical line on desktop / a pill on mobile
 *    that fills with the chakra colors as you scroll, with the active chakra's
 *    name and syllable.
 *
 * Sections opt in by rendering `data-chakra-section="<index>"`.
 */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { CHAKRAS } from "@/lib/chakras";
import { ChakraJourney } from "@/components/ChakraJourney/ChakraJourney";

const CHANNEL_GRADIENT_Y = `linear-gradient(to bottom, ${CHAKRAS.map((c) => c.light).join(", ")})`;
const CHANNEL_GRADIENT_X = `linear-gradient(to right, ${CHAKRAS.map((c) => c.light).join(", ")})`;

interface JourneyState {
  active: number;
  /** Number of chakra changes so far; keys the portal animation. */
  jumps: number;
}

function useChakraJourney(): JourneyState {
  const [state, setState] = useState<JourneyState>({ active: 0, jumps: 0 });
  const lastRef = useRef(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chakra-section]"));
    if (sections.length === 0) return;

    // Whichever section crosses a thin band in the middle of the viewport is
    // the active chakra — deterministic even for very tall sections.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.getAttribute("data-chakra-section"));
          if (index === lastRef.current) continue;
          lastRef.current = index;
          // A soft haptic tick when crossing into a new chakra (Android).
          if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(12);
          setState((prev) => ({ active: index, jumps: prev.jumps + 1 }));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return state;
}

function Portal({ active, jumps }: JourneyState) {
  const reduce = useReducedMotion();
  const chakra = CHAKRAS[active] ?? CHAKRAS[0];
  if (reduce || jumps === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={jumps}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 grid place-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.6, times: [0, 0.35, 1], ease: "easeOut" }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.4, filter: "blur(14px)" }}
          animate={{
            scale: [0.4, 1, 2.2],
            filter: ["blur(14px)", "blur(0px)", "blur(18px)"],
          }}
          transition={{ duration: 1.6, times: [0, 0.4, 1], ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="block font-display text-[26vw] leading-none tracking-[0.12em] md:text-[11vw]"
            style={{
              color: "#fff",
              textShadow: `0 0 2px rgba(0,0,0,0.45), 0 0 28px ${chakra.light}, 0 0 80px ${chakra.light}`,
            }}
          >
            {chakra.bija}
          </span>
          <span className="mt-3 block text-[11px] uppercase tracking-[0.6em] text-white/80">
            {chakra.sanskrit}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ChakraBackground() {
  const journey = useChakraJourney();
  const { active } = journey;
  const current = CHAKRAS[active] ?? CHAKRAS[0];

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  // Reveal the channel with a clip (not a scale) so each chakra color stays at
  // its own position along the line.
  const clipY = useTransform(progress, (p) => `inset(0 0 ${(1 - p) * 100}% 0)`);
  const clipX = useTransform(progress, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);

  const scrollTo = (section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <ChakraJourney active={active} />
      <Portal {...journey} />

      {/* Energy channel — desktop: vertical on the right */}
      <nav
        aria-label="Chakra — sezioni"
        className="fixed right-6 top-1/2 z-40 hidden h-[56vh] -translate-y-1/2 md:block"
      >
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full"
          style={{ clipPath: clipY, backgroundImage: CHANNEL_GRADIENT_Y }}
        />
        <ol className="relative flex h-full flex-col justify-between">
          {CHAKRAS.map((chakra, index) => {
            const lit = index <= active;
            const isActive = index === active;
            return (
              <li key={chakra.id} className="relative flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => scrollTo(chakra.section)}
                  aria-label={`${chakra.label} — ${chakra.sanskrit}`}
                  aria-current={isActive ? "step" : undefined}
                  className="relative grid h-7 w-7 place-items-center"
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="chakra-pulse absolute inset-0 rounded-full"
                      style={{ backgroundColor: chakra.light }}
                    />
                  )}
                  <motion.span
                    className="relative block rounded-full ring-2 ring-black/40"
                    animate={{
                      backgroundColor: lit ? chakra.light : "rgba(255,255,255,0.25)",
                      scale: isActive ? 1.35 : 1,
                      boxShadow: lit ? `0 0 16px 3px ${chakra.light}aa` : "0 0 0 0 rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ width: 11, height: 11 }}
                  />
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key={chakra.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.35 }}
                      className="pointer-events-none absolute right-full mr-4 whitespace-nowrap text-right"
                    >
                      <span
                        className="block font-display text-sm tracking-[0.3em]"
                        style={{ color: chakra.soft }}
                      >
                        {chakra.bija}
                      </span>
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-white/60">
                        {chakra.sanskrit}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Energy channel — mobile: pill at the bottom */}
      <nav
        aria-label="Chakra — sezioni"
        className="glass-dark fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full py-2 pl-4 pr-4 md:hidden"
      >
        <div className="relative flex items-center gap-3">
          <div className="absolute left-1 right-1 top-1/2 h-px -translate-y-1/2 bg-white/15" />
          <motion.div
            aria-hidden
            className="absolute left-1 right-1 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
            style={{ clipPath: clipX, backgroundImage: CHANNEL_GRADIENT_X }}
          />
          {CHAKRAS.map((chakra, index) => {
            const lit = index <= active;
            const isActive = index === active;
            return (
              <button
                key={chakra.id}
                type="button"
                onClick={() => scrollTo(chakra.section)}
                aria-label={`${chakra.label} — ${chakra.sanskrit}`}
                aria-current={isActive ? "step" : undefined}
                className="relative grid h-6 w-6 place-items-center"
              >
                <motion.span
                  className="block rounded-full ring-2 ring-black/40"
                  animate={{
                    backgroundColor: lit ? chakra.light : "rgba(255,255,255,0.25)",
                    scale: isActive ? 1.45 : 1,
                    boxShadow: isActive ? `0 0 14px 3px ${chakra.light}` : "0 0 0 0 rgba(0,0,0,0)",
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{ width: 10, height: 10 }}
                />
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="min-w-[3.2rem] font-display text-xs tracking-[0.25em]"
            style={{ color: current.soft }}
          >
            {current.bija}
          </motion.span>
        </AnimatePresence>
      </nav>
    </>
  );
}
