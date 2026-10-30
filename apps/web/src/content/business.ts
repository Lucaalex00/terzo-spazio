/**
 * Business info: opening hours and closure days. EDIT THIS FILE to keep hours
 * and closures up to date. These feed both the UI and the LocalBusiness
 * structured data for SEO.
 */

export interface OpeningHours {
  /** Day label in Italian. */
  day: string;
  /** Free-text hours, or "Chiuso". */
  hours: string;
}

export const openingHours: OpeningHours[] = [
  { day: "Lunedì", hours: "Chiuso" },
  { day: "Martedì", hours: "09:00 – 18:00" },
  { day: "Mercoledì", hours: "09:00 – 18:00" },
  { day: "Giovedì", hours: "09:00 – 18:00" },
  { day: "Venerdì", hours: "09:00 – 18:00" },
  { day: "Sabato", hours: "09:00 – 13:00" },
  { day: "Domenica", hours: "Chiuso" },
];

/** Upcoming closure dates (ISO YYYY-MM-DD) with an optional note. */
export interface Closure {
  date: string;
  note?: string;
}

export const closures: Closure[] = [
  // Example: { date: "2025-08-15", note: "Ferragosto" },
];

/** Optional physical address — fill in for local SEO when available. */
export const address = {
  street: "",
  city: "Canelli",
  region: "AT",
  postalCode: "",
  country: "IT",
};
