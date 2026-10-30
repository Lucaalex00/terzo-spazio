/**
 * Services offered. EDIT THIS FILE to manage the services shown on the site.
 * Content is in Italian on purpose (it is user-facing copy).
 */

export interface Service {
  slug: string;
  name: string;
  summary: string;
  /** Rough duration, free text. */
  duration?: string;
  /** Optional indicative price, free text (e.g. "da 35€"). Leave empty to hide. */
  price?: string;
  /** Emoji or short symbol used as a light visual marker. */
  icon?: string;
}

export const services: Service[] = [
  {
    slug: "trattamento-viso",
    name: "Trattamento viso personalizzato",
    summary: "Pulizia profonda, idratazione e un momento di cura su misura per la tua pelle.",
    duration: "60 min",
    icon: "🌿",
  },
  {
    slug: "massaggio-benessere",
    name: "Massaggio benessere",
    summary: "Un massaggio pensato per sciogliere le tensioni e ritrovare equilibrio corpo-mente.",
    duration: "50 min",
    icon: "🤲",
  },
  {
    slug: "manicure-pedicure",
    name: "Manicure & pedicure",
    summary: "Mani e piedi curati nel dettaglio, con prodotti delicati e risultati che durano.",
    duration: "45 min",
    icon: "💅",
  },
  {
    slug: "epilazione",
    name: "Epilazione",
    summary: "Epilazione professionale, attenta al comfort e alla sensibilità della pelle.",
    duration: "30 min",
    icon: "✨",
  },
  {
    slug: "percorso-benessere",
    name: "Percorso benessere personalizzato",
    summary:
      "Un percorso costruito insieme, che unisce trattamenti estetici e benessere interiore.",
    duration: "su misura",
    icon: "🕉️",
  },
];
