/**
 * Helpers to build the "booking bridge" links.
 *
 * This site does NOT store bookings. It bridges the visitor toward Giulia's
 * real channels: a WhatsApp chat pre-filled with a friendly message, or an
 * external booking app when configured.
 */

import { site } from "@/lib/site";

/** Build a wa.me URL with a pre-filled message. Returns null if no number set. */
export function buildWhatsAppUrl(message: string): string | null {
  const number = site.whatsappNumber.replace(/\D/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** A prepared message for a generic contact. */
export function genericMessage(): string {
  return `Ciao Giulia! Ho visto il sito di ${site.shortName} e vorrei qualche informazione.`;
}

/** A prepared message tied to a specific service. */
export function serviceMessage(serviceName: string): string {
  return (
    `Ciao Giulia! Dal sito di ${site.shortName} vorrei informazioni o una prenotazione ` +
    `per: ${serviceName}.`
  );
}

/**
 * Resolve the best booking destination for a given service.
 * Priority: external booking app (if set) → WhatsApp → mailto fallback.
 */
export function bookingHref(serviceName?: string): string {
  if (site.bookingUrl) return site.bookingUrl;
  const message = serviceName ? serviceMessage(serviceName) : genericMessage();
  const wa = buildWhatsAppUrl(message);
  if (wa) return wa;
  if (site.email) return `mailto:${site.email}`;
  return "#contatti";
}
