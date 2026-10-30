/**
 * Central site configuration.
 *
 * Non-secret, public values. Anything environment-specific (analytics id,
 * WhatsApp number, canonical URL, external booking URL) is read from
 * NEXT_PUBLIC_* env vars so it can change per deployment without code edits.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const site = {
  /** Brand / business name. */
  name: "Terzo Spazio di Giulia Bordino",
  shortName: "Terzo Spazio",
  owner: "Giulia Bordino",
  profession: "Estetista",
  /** Short tagline shown in hero and metadata. */
  tagline: "Estetica e benessere, in uno spazio che è corpo, mente e anima.",
  description:
    "Terzo Spazio di Giulia Bordino, estetista: trattamenti e percorsi di benessere " +
    "a Canelli, Costigliole d'Asti e Asti. Scopri i servizi, le novità e prenota in un tocco.",
  locale: "it-IT",
  url: siteUrl,

  /** Towns served — important for local SEO. */
  areasServed: ["Canelli", "Costigliole d'Asti", "Asti"],

  /** Contact bridge. Real bookings happen on Giulia's external app. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  email: "", // optional: set when available
  phone: "", // optional: set when available

  social: {
    instagram: "", // e.g. https://www.instagram.com/...
    facebook: "",
    tiktok: "",
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  },

  author: {
    name: "Lucaalex00",
    url: "https://github.com/Lucaalex00",
  },
} as const;

export type Site = typeof site;
