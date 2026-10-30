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

/** Where Giulia receives clients. Also feeds the LocalBusiness data for SEO. */
export const address = {
  street: "Via Primo Maggio 76/78",
  city: "Canelli",
  region: "AT",
  postalCode: "14053",
  country: "IT",
};

/** One-line address, e.g. "Via Primo Maggio 76/78, 14053 Canelli (AT)". */
export const addressLine = `${address.street}, ${address.postalCode} ${address.city} (${address.region})`;

/** Google Maps search link for the address. */
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`;
