"use client";

/**
 * The signature visual, made of three layers:
 *
 * 1. Aurora — soft drifting light orbs that take the color of the chakra
 *    currently crossing the middle of the viewport, over a fine film grain.
 * 2. Energy channel — a vertical line (horizontal pill on mobile) that fills
 *    as you scroll, its gradient rising from root red to throat blue. The five
 *    chakra dots sit along it; passed chakras stay lit, the active one glows
 *    and shows its name and seed syllable.
 * 3. Cursor light — on precise pointers only, a faint glow of the active
 *    chakra's color follows the cursor.
 *
 * Sections opt in by rendering `data-chakra-section="<index>"` (see Section).
 * Without JS the background simply stays on the first chakra.
 */

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { CHAKRAS } from "@/lib/chakras";

const SPINE_GRADIENT = `linear-gradient(to bottom, ${CHAKRAS.map((c) => c.light).join(", ")})`;
const SPINE_GRADIENT_X = `linear-gradient(to right, ${CHAKRAS.map((c) => c.light).join(", ")})`;

function useActiveChakra(): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chakra-section]"));
    if (sections.length === 0) return;

    // A thin band across the middle of the viewport: whichever section
    // crosses it is the active one. Deterministic even for very tall sections.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.getAttribute("data-chakra-section")));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}

function CursorLight({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      setEnabled(true);
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ x: sx, y: sy }}
      animate={{ background: `radial-gradient(circle, ${color}33 0%, transparent 65%)` }}
      transition={{ duration: 0.8 }}
    />
  );
}

export function ChakraBackground() {
  const active = useActiveChakra();
  const current = CHAKRAS[active] ?? CHAKRAS[0];
  const next = CHAKRAS[Math.min(active + 1, CHAKRAS.length - 1)];

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  // Reveal the channel with a clip (not a scale) so each chakra color stays at
  // its own position along the line instead of being squeezed together.
  const clipY = useTransform(progress, (p) => `inset(0 0 ${(1 - p) * 100}% 0)`);
  const clipX = useTransform(progress, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);

  const scrollTo = (section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ease = { duration: 1.4, ease: [0.22, 1, 0.36, 1] } as const;

  return (
    <>
      {/* 1 — Aurora */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
        animate={{ backgroundColor: current.tint }}
        transition={ease}
      >
        <motion.div
          className="aurora-a absolute -left-[15%] top-[5%] h-[70vmax] w-[70vmax] rounded-full blur-[90px]"
          animate={{ backgroundColor: current.light, opacity: 0.32 }}
          transition={ease}
        />
        <motion.div
          className="aurora-b absolute -right-[20%] top-[35%] h-[60vmax] w-[60vmax] rounded-full blur-[100px]"
          animate={{ backgroundColor: next.light, opacity: 0.18 }}
          transition={ease}
        />
        <motion.div
          className="aurora-c absolute bottom-[-25%] left-[20%] h-[50vmax] w-[50vmax] rounded-full blur-[110px]"
          animate={{ backgroundColor: current.light, opacity: 0.16 }}
          transition={ease}
        />
        <div className="grain absolute inset-0" />
      </motion.div>

      <CursorLight color={current.light} />

      {/* 2a — Energy channel, desktop: vertical on the right */}
      <nav
        aria-label="Chakra — sezioni"
        className="fixed right-6 top-1/2 z-40 hidden h-[56vh] -translate-y-1/2 md:block"
      >
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-neutral-900/10" />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full"
          style={{ clipPath: clipY, backgroundImage: SPINE_GRADIENT }}
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
                  className="group relative grid h-7 w-7 place-items-center"
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="chakra-pulse absolute inset-0 rounded-full"
                      style={{ backgroundColor: chakra.light }}
                    />
                  )}
                  <motion.span
                    className="relative block rounded-full ring-2 ring-white/80"
                    animate={{
                      backgroundColor: lit ? chakra.light : "#ffffff",
                      scale: isActive ? 1.35 : 1,
                      boxShadow: lit ? `0 0 14px 2px ${chakra.light}99` : "0 0 0 0 rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ width: 11, height: 11 }}
                  />
                  <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-white/80 px-2 py-1 text-xs text-neutral-700 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100">
                    {chakra.label}
                  </span>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key={chakra.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.35 }}
                      className="pointer-events-none absolute right-full mr-10 whitespace-nowrap text-right"
                    >
                      <span
                        className="block font-display text-sm tracking-[0.3em]"
                        style={{ color: chakra.ink }}
                      >
                        {chakra.bija}
                      </span>
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">
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

      {/* 2b — Energy channel, mobile: horizontal pill at the bottom */}
      <nav
        aria-label="Chakra — sezioni"
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/60 bg-white/70 py-2 pl-4 pr-4 shadow-lg shadow-black/5 backdrop-blur-xl md:hidden"
      >
        <div className="relative flex items-center gap-3">
          <div className="absolute left-1 right-1 top-1/2 h-px -translate-y-1/2 bg-neutral-900/10" />
          <motion.div
            aria-hidden
            className="absolute left-1 right-1 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
            style={{ clipPath: clipX, backgroundImage: SPINE_GRADIENT_X }}
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
                  className="block rounded-full ring-2 ring-white"
                  animate={{
                    backgroundColor: lit ? chakra.light : "#e5e5e5",
                    scale: isActive ? 1.4 : 1,
                    boxShadow: isActive
                      ? `0 0 12px 2px ${chakra.light}aa`
                      : "0 0 0 0 rgba(0,0,0,0)",
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
            style={{ color: current.ink }}
          >
            {current.bija}
          </motion.span>
        </AnimatePresence>
      </nav>
    </>
  );
}
