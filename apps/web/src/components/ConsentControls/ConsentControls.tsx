"use client";

/**
 * Lets visitors review and change their cookie choice from the Cookie Policy
 * page, as required by GDPR (consent must be as easy to withdraw as to give).
 */

import { useConsent } from "@/components/ConsentProvider/ConsentProvider";

const LABELS: Record<string, string> = {
  unset: "Nessuna scelta effettuata",
  granted: "Hai accettato i cookie di statistica",
  denied: "Hai rifiutato i cookie di statistica",
};

export function ConsentControls() {
  const { status, ready, accept, reject } = useConsent();

  return (
    <div className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm">
      <p className="text-sm text-neutral-700">
        Stato attuale: <strong>{ready ? LABELS[status] : "…"}</strong>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Accetta statistiche
        </button>
        <button
          type="button"
          onClick={reject}
          className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          Rifiuta statistiche
        </button>
      </div>
    </div>
  );
}
