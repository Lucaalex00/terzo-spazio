"use client";

/**
 * Opening section (Muladhara, the root chakra).
 *
 * A large breathing lotus with concentric ripples is the centerpiece; a
 * gentle "inspira / espira" guide follows the same 6-second rhythm, inviting
 * the visitor to slow down. The title unveils word by word and a row of five
 * dots introduces the journey through the chakras below.
 */

import { motion } from "motion/react";
import { CHAKRAS, chakraVars } from "@/lib/chakras";
import { site } from "@/lib/site";
import { ChakraGlyph } from "@/components/ChakraGlyph/ChakraGlyph";

const root = CHAKRAS[0];
const easeOut = [0.22, 1, 0.36, 1] as const;

function Words({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: "0.4em", filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: delay + i * 0.12, ease: easeOut }}
        >
          {word}
          {" "}
        </motion.span>
      ))}
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
      {/* Breathing lotus with ripples */}
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
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: easeOut }}
        >
          <ChakraGlyph
            chakra={root}
            size={260}
            className="h-[min(62vw,300px)] w-[min(62vw,300px)]"
          />
        </motion.div>

        <p
          aria-hidden
          className="breath-guide absolute -bottom-7 text-[11px] uppercase tracking-[0.4em] text-neutral-500"
        >
          <span className="breath-in">inspira</span>
          <span className="breath-out">espira</span>
        </p>
      </div>

      <p className="text-xs uppercase tracking-[0.35em]" style={{ color: "var(--accent)" }}>
        {site.profession} · {site.areasServed.join(" · ")}
      </p>

      <h1 className="mt-4 text-balance font-display text-5xl leading-[1.05] text-neutral-900 sm:text-7xl">
        <Words text="Terzo Spazio" delay={0.3} />
        <Words
          text={`di ${site.owner}`}
          delay={0.6}
          className="mt-2 block text-3xl text-neutral-700 sm:text-4xl"
        />
      </h1>

      <motion.p
        className="mx-auto mt-6 max-w-xl text-pretty text-lg text-neutral-600"
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
          Prenota il tuo momento
        </a>
        <a href="#servizi" className="btn-ghost">
          Scopri i servizi
        </a>
      </motion.div>

      {/* The journey: five chakras, five steps */}
      <motion.ol
        aria-label="Il percorso dei cinque chakra"
        className="mt-12 flex items-end justify-center gap-4 sm:gap-7"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 1.6 } } }}
      >
        {CHAKRAS.map((c) => (
          <motion.li
            key={c.id}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="flex flex-col items-center gap-2"
          >
            <a href={`#${c.section}`} className="group flex flex-col items-center gap-2">
              <span
                className="block h-3 w-3 rounded-full transition-transform group-hover:scale-150"
                style={{ backgroundColor: c.light, boxShadow: `0 0 12px ${c.light}` }}
              />
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 transition-colors group-hover:text-neutral-900">
                {c.bija}
              </span>
            </a>
          </motion.li>
        ))}
      </motion.ol>

      <a
        href="#servizi"
        className="scroll-cue absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-neutral-500 md:flex"
      >
        Scorri e risveglia i chakra
        <span className="scroll-cue-line block h-10 w-px bg-neutral-400" />
      </a>
    </section>
  );
}
