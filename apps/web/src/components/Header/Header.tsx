"use client";

/**
 * Minimal, transparent top bar: brand on the left, quick anchors on the right.
 * Kept light so it never competes with the chakra background.
 */

import Link from "next/link";
import { CHAKRAS } from "@/lib/chakras";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/60 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="#benvenuto" className="font-display text-lg font-semibold text-neutral-900">
          {site.shortName}
        </Link>
        <nav aria-label="Navigazione" className="hidden gap-6 text-sm text-neutral-600 sm:flex">
          {CHAKRAS.slice(1).map((c) => (
            <a key={c.id} href={`#${c.section}`} className="transition hover:text-neutral-900">
              {c.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
