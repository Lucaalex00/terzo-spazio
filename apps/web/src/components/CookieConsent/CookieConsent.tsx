"use client";

/**
 * GDPR cookie banner. Shown only when no choice has been made yet. Offers a
 * clear accept / reject pair (reject is not a dark pattern: equally prominent)
 * and links to the cookie policy. The choice drives whether GA4 loads.
 */

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useConsent } from "@/components/ConsentProvider/ConsentProvider";

export function CookieConsent() {
  const { status, ready, accept, reject } = useConsent();

  const visible = ready && status === "unset";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Preferenze cookie"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white/95 p-4 shadow-lg backdrop-blur sm:p-5"
        >
          <p className="text-sm leading-relaxed text-neutral-700">
            Usiamo solo cookie tecnici necessari. Con il tuo consenso usiamo anche cookie di{" "}
            <strong>statistica</strong> (Google Analytics) per capire come viene usato il sito. Puoi
            cambiare idea in ogni momento dalla{" "}
            <Link href="/cookie-policy" className="underline underline-offset-2">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={reject}
              className="order-2 rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 sm:order-1"
            >
              Solo necessari
            </button>
            <button
              type="button"
              onClick={accept}
              className="order-1 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 sm:order-2"
            >
              Accetta tutti
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
