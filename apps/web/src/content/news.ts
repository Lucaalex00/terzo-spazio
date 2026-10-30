/**
 * News / journal entries. EDIT THIS FILE to add updates about Giulia's
 * professional and personal journey. Newest first.
 */

export interface NewsPost {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  excerpt: string;
  /** Optional longer body (plain text or simple HTML-free paragraphs). */
  body?: string[];
}

export const news: NewsPost[] = [
  {
    slug: "apertura-terzo-spazio",
    title: "Nasce Terzo Spazio",
    date: "2025-01-15",
    excerpt:
      "Uno spazio nuovo, pensato come un terzo luogo tra casa e mondo: dove prendersi cura di sé.",
    body: [
      "Terzo Spazio nasce da un'idea semplice: offrire un luogo in cui l'estetica incontra il benessere interiore.",
      "Qui troverai trattamenti su misura, ascolto e un ritmo lento, lontano dalla fretta di ogni giorno.",
    ],
  },
  {
    slug: "nuovi-percorsi-benessere",
    title: "Nuovi percorsi benessere",
    date: "2025-03-02",
    excerpt: "Dalla primavera, nuovi percorsi che uniscono trattamenti estetici e rituali di cura.",
  },
];
