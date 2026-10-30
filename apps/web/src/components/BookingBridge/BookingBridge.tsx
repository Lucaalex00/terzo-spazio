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
    <div className="chakra-card p-6">
      <h3 className="font-display text-xl text-neutral-900">Prenota il tuo momento</h3>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-neutral-600">
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
            className="field"
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
              className="field resize-none"
            />
          </label>
        )}

        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
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
