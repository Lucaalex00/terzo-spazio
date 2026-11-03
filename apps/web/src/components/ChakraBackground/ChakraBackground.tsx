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

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
import { JUMP } from "@/components/ChakraJourney/journeyWorker";

const CHANNEL_GRADIENT_Y = `linear-gradient(to bottom, ${CHAKRAS.map((c) => c.light).join(", ")})`;
const CHANNEL_GRADIENT_X = `linear-gradient(to right, ${CHAKRAS.map((c) => c.light).join(", ")})`;

const noopSubscribe = () => () => {};
const supportsScrollTimeline = () =>
  typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");

/**
 * The chakra bar's fill, growing with page scroll. Where the browser supports
 * scroll-driven animations it is pure CSS (compositor, no JS per frame; see
 * globals.css); otherwise a JS spring drives a clip.
 */
function ChannelFill({ axis, className }: { axis: "x" | "y"; className: string }) {
  const cssDriven = useSyncExternalStore(noopSubscribe, supportsScrollTimeline, () => false);
  const gradient = axis === "y" ? CHANNEL_GRADIENT_Y : CHANNEL_GRADIENT_X;
  if (cssDriven) {
    return (
      <div aria-hidden className={`${className} overflow-hidden bar-fill-${axis}`}>
        <div className="h-full w-full" style={{ backgroundImage: gradient }} />
      </div>
    );
  }
  return <ChannelFillJs axis={axis} className={className} gradient={gradient} />;
}

function ChannelFillJs({
  axis,
  className,
  gradient,
}: {
  axis: "x" | "y";
  className: string;
  gradient: string;
}) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  // Clip (not scale) so each chakra color stays at its own position.
  const clip = useTransform(progress, (p) =>
    axis === "y" ? `inset(0 0 ${(1 - p) * 100}% 0)` : `inset(0 ${(1 - p) * 100}% 0 0)`,
  );
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ clipPath: clip, backgroundImage: gradient }}
    />
  );
}

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

    // The active chakra is the section under the middle of the viewport. We
    // track every section inside a thin middle band and, on any change,
    // re-pick the one containing the center line. (Reacting only to sections
    // *entering* the band missed the case where a section never left it: scroll
    // a little into the next section, then back up, and the previous one —
    // still in the band — was never re-activated.)
    const inBand = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        const center = window.innerHeight / 2;
        let picked: Element | undefined;
        for (const el of inBand) {
          const r = el.getBoundingClientRect();
          if (r.top <= center && r.bottom > center) {
            picked = el;
            break;
          }
        }
        picked ??= inBand.values().next().value;
        if (!picked) return; // e.g. the footer is in the middle: keep the last chakra

        const index = Number(picked.getAttribute("data-chakra-section"));
        if (index === lastRef.current) return;
        lastRef.current = index;
        // A soft haptic tick when crossing into a new chakra (Android).
        if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(12);
        setState((prev) => ({ active: index, jumps: prev.jumps + 1 }));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    // Pause the CSS loops of sections that are off screen (see globals.css):
    // the browser keeps ticking every running animation each frame, visible
    // or not, and on phones that adds up. Paused loops resume where they were.
    const visibility = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
        }
      },
      { rootMargin: "120px 0px" },
    );

    sections.forEach((s) => {
      observer.observe(s);
      visibility.observe(s);
    });
    return () => {
      observer.disconnect();
      visibility.disconnect();
    };
  }, []);

  return state;
}

function Portal({ active, jumps }: JourneyState) {
  const reduce = useReducedMotion();
  const chakra = CHAKRAS[active] ?? CHAKRAS[0];
  if (reduce || jumps === 0) return null;

  // In step with the tunnel's jump (JUMP): a veil over the WHOLE site (above
  // header, bars and buttons) darkens it by 80% and blurs it in 0.5 s, the
  // chakra text appears on top and holds still and sharp for 1 s, then the
  // veil lifts in the last 0.5 s. It never blocks scrolling or taps.
  // Exact timing comes from CSS keyframes (globals.css: portal-veil,
  // portal-text); remounting on each jump (key) restarts them.
  const duration = { animationDuration: `${JUMP.total}s` };

  return (
    <div
      key={jumps}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] grid place-items-center px-6"
    >
      <div
        className="portal-veil absolute inset-0 bg-[#07060b]/80 backdrop-blur-lg"
        style={duration}
      />
      <div className="portal-text relative text-center" style={duration}>
        <span
          className="block font-display text-[24vw] leading-none tracking-[0.12em] md:text-[10vw]"
          style={{
            color: "#fff",
            textShadow: `0 0 2px rgba(0,0,0,0.45), 0 0 28px ${chakra.light}, 0 0 80px ${chakra.light}`,
          }}
        >
          {chakra.bija}
        </span>
        <span className="mt-4 block font-display text-2xl text-white md:text-3xl">
          {chakra.label}
        </span>
        <span className="mt-2 block text-xs uppercase tracking-[0.5em] text-white/75">
          {chakra.sanskrit}
        </span>
      </div>
    </div>
  );
}

export function ChakraBackground() {
  const journey = useChakraJourney();
  const { active } = journey;
  const current = CHAKRAS[active] ?? CHAKRAS[0];

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
        <ChannelFill
          axis="y"
          className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full"
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
              </li>
            );
          })}
        </ol>

        {/* Active chakra's seed syllable (LAM, VAM…), letters stacked upright
            along the bar like a vertical sign — the same code the mobile pill
            and the portal use. Centered on the active dot (dots are 28px tall
            and spread evenly along the bar). */}
        <AnimatePresence>
          <motion.p
            key={current.id}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="text-glow pointer-events-none absolute right-full mr-4 -translate-y-1/2 whitespace-nowrap font-display text-xl leading-none tracking-[0.35em] [text-orientation:upright] [writing-mode:vertical-rl]"
            style={{
              top: `calc(14px + (100% - 28px) * ${active / (CHAKRAS.length - 1)})`,
              color: current.soft,
            }}
          >
            {current.bija}
          </motion.p>
        </AnimatePresence>
      </nav>

      {/* Energy channel — mobile: pill at the bottom */}
      <nav
        aria-label="Chakra — sezioni"
        className="glass-dark fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full py-2 pl-4 pr-4 md:hidden"
      >
        <div className="relative flex items-center gap-3">
          <div className="absolute left-1 right-1 top-1/2 h-px -translate-y-1/2 bg-white/15" />
          <ChannelFill
            axis="x"
            className="absolute left-1 right-1 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
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
