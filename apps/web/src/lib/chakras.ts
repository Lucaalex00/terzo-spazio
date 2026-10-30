/**
 * The five-chakra design system.
 *
 * The site is built as a vertical scroll of five sections. Each section is
 * tied to one chakra, which gives it its dot on the rail, its accent color,
 * its background tint and its mood. As a section enters the viewport its dot
 * "lights up" and the ambient background drifts toward that chakra's color.
 *
 * We deliberately use five chakras (not seven) to match the project's visual
 * concept of five dots. Colors are chosen to be legible and WCAG-friendly as
 * accents on a soft light background.
 */

export type ChakraId = "root" | "sacral" | "solar" | "heart" | "throat";

export interface Chakra {
  id: ChakraId;
  /** Stable anchor id used for the section element and nav links. */
  section: string;
  /** Short Italian label shown in the UI. */
  label: string;
  /** Sanskrit-ish name, used as a subtle subtitle. */
  sanskrit: string;
  /** Primary accent color (hex). */
  color: string;
  /** Soft tint used for the ambient background of this section. */
  tint: string;
  /** One-line Italian mood/intention for the section. */
  intention: string;
}

export const CHAKRAS: readonly Chakra[] = [
  {
    id: "root",
    section: "benvenuto",
    label: "Benvenuto",
    sanskrit: "Muladhara",
    color: "#c0392b",
    tint: "#fdecea",
    intention: "Radici, presenza, un luogo sicuro dove iniziare.",
  },
  {
    id: "sacral",
    section: "servizi",
    label: "Servizi",
    sanskrit: "Svadhisthana",
    color: "#d35400",
    tint: "#fdeede",
    intention: "Cura del corpo e dei sensi, con dolcezza.",
  },
  {
    id: "solar",
    section: "percorso",
    label: "Percorso & News",
    sanskrit: "Manipura",
    color: "#c9a227",
    tint: "#fbf6e3",
    intention: "Crescita personale e professionale, passo dopo passo.",
  },
  {
    id: "heart",
    section: "corsi",
    label: "Corsi",
    sanskrit: "Anahata",
    color: "#27ae60",
    tint: "#e9f7ef",
    intention: "Imparare insieme, condividere, connettersi.",
  },
  {
    id: "throat",
    section: "contatti",
    label: "Contatti & Prenota",
    sanskrit: "Vishuddha",
    color: "#2980b9",
    tint: "#e8f2fb",
    intention: "Parlarsi, incontrarsi, prenotare il tuo momento.",
  },
] as const;

export const CHAKRA_BY_SECTION: Record<string, Chakra> = Object.fromEntries(
  CHAKRAS.map((c) => [c.section, c]),
);
