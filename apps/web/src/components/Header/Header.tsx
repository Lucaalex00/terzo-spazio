"use client";

/**
 * Floating glass header: brand on the left, chakra-dotted anchors on the
 * right. It slides away while scrolling down (more room for the content) and
 * comes back as soon as the visitor scrolls up.
 */

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { CHAKRAS } from "@/lib/chakras";
import { site } from "@/lib/site";

export function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 160);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-3 z-40 px-3"
      animate={{ y: hidden ? "-130%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/60 bg-white/60 px-5 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl">
        <Link href="#benvenuto" className="font-display text-lg text-neutral-900">
          {site.shortName}
        </Link>
        <nav aria-label="Navigazione" className="hidden gap-5 text-sm text-neutral-600 md:flex">
          {CHAKRAS.slice(1).map((c) => (
            <a
              key={c.id}
              href={`#${c.section}`}
              className="group flex items-center gap-2 transition-colors hover:text-neutral-900"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-150"
                style={{ backgroundColor: c.light }}
              />
              {c.label}
            </a>
          ))}
        </nav>
        <a
          href="#contatti"
          className="btn-primary px-4 py-1.5 text-xs md:hidden"
          style={{ ["--accent" as string]: CHAKRAS[4].ink }}
        >
          Prenota
        </a>
      </div>
    </motion.header>
  );
}
