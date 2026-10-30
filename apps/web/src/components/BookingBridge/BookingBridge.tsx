"use client";

/**
 * The "booking bridge". This site does not store bookings: the visitor picks a
 * service and an optional note, and we open WhatsApp with a prepared message
 * (or Giulia's external booking app, when configured). No personal data is
 * collected or sent to our servers — everything happens client-side.
 */

import { useMemo, useState } from "react";
import { services } from "@/content/services";
import { site } from "@/lib/site";
import { buildWhatsAppUrl, serviceMessage } from "@/lib/whatsapp";

export function BookingBridge() {
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? "");
  const [note, setNote] = useState("");

  const serviceName = useMemo(
    () => services.find((s) => s.slug === serviceSlug)?.name ?? "",
    [serviceSlug],
  );

  const href = useMemo(() => {
    // External booking app always wins when present.
    if (site.bookingUrl) return site.bookingUrl;
    const base = serviceMessage(serviceName);
    const message = note.trim() ? `${base}\n\nNota: ${note.trim()}` : base;
    return buildWhatsAppUrl(message) ?? (site.email ? `mailto:${site.email}` : null);
  }, [serviceName, note]);

  const external = Boolean(site.bookingUrl);

  return (
    <div className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6">
      <p className="text-sm text-neutral-600">
        Scegli un servizio e, se vuoi, aggiungi una nota. Ti porteremo{" "}
        {external ? "all'app di prenotazione" : "su WhatsApp con un messaggio già pronto"} — la
        prenotazione vera e propria la gestisce Giulia direttamente.
      </p>

      <div className="mt-4 grid gap-4">
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-neutral-800">Servizio</span>
          <select
            value={serviceSlug}
            onChange={(e) => setServiceSlug(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        {!external && (
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-neutral-800">Nota (facoltativa)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Es. preferirei il sabato mattina"
              className="resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </label>
        )}

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {external ? "Vai a prenotare" : "Scrivi su WhatsApp"}
          </a>
        ) : (
          <p className="text-sm text-neutral-500">
            Canale di contatto non ancora configurato. Imposta
            <code className="mx-1 rounded bg-neutral-100 px-1">
              NEXT_PUBLIC_WHATSAPP_NUMBER
            </code>o{" "}
            <code className="mx-1 rounded bg-neutral-100 px-1">NEXT_PUBLIC_BOOKING_URL</code>.
          </p>
        )}
      </div>
    </div>
  );
}
