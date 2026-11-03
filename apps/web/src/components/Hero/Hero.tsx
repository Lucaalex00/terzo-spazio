"use client";

/**
 * Opening section (Muladhara, the root chakra).
 *
 * The large breathing lotus sits on the vanishing point of the light tunnel:
 * it *is* the sphere the visitor is flying toward. A gentle "inspira / espira"
 * guide follows the same 6-second rhythm as the lotus and the tunnel. The
 * title unveils word by word, crossed by a beam of light, and five dots
 * introduce the journey through the chakras below.
 *
 * On iPhone, motion sensors need an explicit permission: a small button lets
 * the visitor steer the journey by tilting the phone (Android needs nothing).
 */

import { useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { CHAKRAS, chakraVars } from "@/lib/chakras";
import { site } from "@/lib/site";
import { ChakraGlyph } from "@/components/ChakraGlyph/ChakraGlyph";

const root = CHAKRAS[0];
const easeOut = [0.22, 1, 0.36, 1] as const;

type OrientationPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

const noopSubscribe = () => () => {};
// Only iOS/iPadOS gate motion sensors behind a permission prompt.
const needsMotionPermission = () =>
  typeof window !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
  typeof (window.DeviceOrientationEvent as unknown as OrientationPermission | undefined)
    ?.requestPermission === "function";

function MotionPermissionButton() {
  const needed = useSyncExternalStore(noopSubscribe, needsMotionPermission, () => false);
  const [granted, setGranted] = useState(false);
  if (!needed || granted) return null;

  const request = async () => {
    try {
      const api = window.DeviceOrientationEvent as unknown as OrientationPermission;
      const result = await api.requestPermission?.();
      if (result === "granted") setGranted(true);
    } catch {
      // Permission dialog dismissed or unavailable: the journey still works.
    }
  };

  return (
    <motion.button
      type="button"
      onClick={request}
      className="btn-ghost mt-5 px-4 py-2 text-xs"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2.2, ease: easeOut }}
    >
      ✦ Inclina il telefono per guidare il viaggio
    </motion.button>
  );
}

function Words({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  // Words unveil one by one; a single light beam crosses the whole line
  // (one shimmer per line instead of per word keeps fewer loops running).
  return (
    <span className={`shimmer ${className ?? ""}`}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: "0.5em", filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
          transition={{ duration: 1, delay: delay + i * 0.14, ease: easeOut }}
        >
          {word}
          {" "}
        </motion.span>
      ))}
      <span aria-hidden className="shimmer-band" data-text={text} />
    </span>
  );
}

export function Hero() {
  return (
    <section
      id={root.section}
      data-chakra-section={0}
      style={chakraVars(root)}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-28 pt-24 text-center sm:px-8"
    >
      {/* Breathing lotus with ripples — on the tunnel's vanishing point */}
      <div className="relative mb-14 grid place-items-center">
        {[0, 2, 4].map((delay) => (
          <span
            key={delay}
            aria-hidden
            className="chakra-ripple absolute h-[min(62vw,300px)] w-[min(62vw,300px)] rounded-full border"
            style={{ borderColor: root.light, animationDelay: `${delay}s` }}
          />
        ))}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.6, filter: "blur(16px)" }}
          // Drop the filter once settled so it doesn't stay on the spinning layer.
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transitionEnd: { filter: "none" },
          }}
          transition={{ duration: 1.8, ease: easeOut }}
        >
          {/* Static glow (a filter on the spinning lotus would re-render every frame). */}
          <span
            aria-hidden
            className="absolute inset-[-12%] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(224,67,58,0.45) 0%, transparent 62%)",
            }}
          />
          <ChakraGlyph chakra={root} sizeCss="min(62vw, 300px)" />
        </motion.div>

        <p
          aria-hidden
          className="breath-guide absolute -bottom-8 text-[11px] uppercase tracking-[0.45em] text-white/75"
        >
          <span className="breath-in">inspira</span>
          <span className="breath-out">espira</span>
        </p>
      </div>

      <motion.p
        className="text-glow text-xs uppercase"
        style={{ color: "var(--accent)" }}
        initial={{ opacity: 0, letterSpacing: "0.9em" }}
        animate={{ opacity: 1, letterSpacing: "0.35em" }}
        transition={{ duration: 1.6, delay: 0.2, ease: easeOut }}
      >
        {site.profession} · {site.areasServed.join(" · ")}
      </motion.p>

      <h1 className="mt-4 text-balance font-display text-5xl leading-[1.05] sm:text-7xl">
        <Words text="Terzo Spazio" delay={0.3} />
        <Words text={`di ${site.owner}`} delay={0.65} className="mt-2 block text-3xl sm:text-4xl" />
      </h1>

      <motion.p
        className="text-glow mx-auto mt-6 max-w-xl text-pretty text-lg text-white/85"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.1, ease: easeOut }}
      >
        {site.tagline}
      </motion.p>

      <motion.div
        className="mt-8 flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.3, ease: easeOut }}
      >
        <a href="#contatti" className="btn-primary">
          <span aria-hidden className="btn-sheen" />
          Prenota il tuo momento
        </a>
        <a href="#servizi" className="btn-ghost">
          Inizia il viaggio
        </a>
      </motion.div>

      <MotionPermissionButton />

      {/* The journey: five chakras, five steps */}
      <motion.ol
        aria-label="Il percorso dei cinque chakra"
        className="mt-12 flex items-end justify-center gap-4 sm:gap-7"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 1.6 } } }}
      >
        {CHAKRAS.map((c, i) => (
          <motion.li
            key={c.id}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="flex flex-col items-center gap-2"
          >
            <a href={`#${c.section}`} className="flex flex-col items-center gap-2">
              <span
                className="chakra-blink block h-3 w-3 rounded-full"
                style={{
                  backgroundColor: c.light,
                  boxShadow: `0 0 14px ${c.light}`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">{c.bija}</span>
            </a>
          </motion.li>
        ))}
      </motion.ol>

      <a
        href="#servizi"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/60 md:flex"
      >
        Scorri e risveglia i chakra
        <span className="scroll-cue-line block h-10 w-px bg-white/20" />
      </a>
    </section>
  );
}
