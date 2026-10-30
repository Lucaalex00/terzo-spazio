/**
 * The five-chakra design system.
 *
 * The site is a journey through five chakras (root → throat). Each section is
 * tied to one chakra, which gives it its lotus glyph, its dot on the energy
 * channel, its seed syllable and — above all — the color of the light tunnel
 * the visitor travels through while that section is on screen.
 *
 * The symbolism follows the traditional iconography: petal count, bija
 * (seed) mantra, element and inner geometry of each chakra lotus.
 *
 * Three tones per chakra (the site uses a dark, immersive theme):
 * - `light`: the luminous hue — glows, glyphs, light streaks, dots.
 * - `soft`:  a lighter tone of the same hue for text/accents on dark
 *            backgrounds (≥ 7:1 contrast).
 * - `deep`:  the dark, saturated base of the light tunnel's walls.
 */

export type ChakraId = "root" | "sacral" | "solar" | "heart" | "throat";

/** Inner geometry drawn at the center of the lotus. */
export type ChakraGeometry = "square" | "crescent" | "triangle" | "hexagram" | "circle";

export interface Chakra {
  id: ChakraId;
  /** Stable anchor id used for the section element and nav links. */
  section: string;
  /** Short Italian label shown in the UI. */
  label: string;
  /** Sanskrit name. */
  sanskrit: string;
  /** Italian common name (e.g. "Chakra della radice"). */
  name: string;
  /** Traditional number of lotus petals. */
  petals: number;
  /** Bija (seed) mantra. */
  bija: string;
  /** Italian element name. */
  element: string;
  /** Where the chakra sits in the body, in Italian. */
  place: string;
  /** Inner geometry of the lotus. */
  geometry: ChakraGeometry;
  /** Luminous hue for glows, glyphs, streaks and dots. */
  light: string;
  /** Light tone for text and accents on dark backgrounds. */
  soft: string;
  /** Dark saturated base color of the light tunnel. */
  deep: string;
  /** One-line Italian intention for the section. */
  intention: string;
}

export const CHAKRAS: readonly Chakra[] = [
  {
    id: "root",
    section: "benvenuto",
    label: "Benvenuto",
    sanskrit: "Muladhara",
    name: "Chakra della radice",
    petals: 4,
    bija: "LAM",
    element: "Terra",
    place: "Base della colonna",
    geometry: "square",
    light: "#e0433a",
    soft: "#f0928c",
    deep: "#2c0709",
    intention: "Radici, presenza, un luogo sicuro dove iniziare.",
  },
  {
    id: "sacral",
    section: "servizi",
    label: "Servizi",
    sanskrit: "Svadhisthana",
    name: "Chakra sacrale",
    petals: 6,
    bija: "VAM",
    element: "Acqua",
    place: "Basso ventre",
    geometry: "crescent",
    light: "#f2762e",
    soft: "#f8ae82",
    deep: "#2e1204",
    intention: "Cura del corpo e dei sensi, con dolcezza.",
  },
  {
    id: "solar",
    section: "percorso",
    label: "Percorso & News",
    sanskrit: "Manipura",
    name: "Chakra del plesso solare",
    petals: 10,
    bija: "RAM",
    element: "Fuoco",
    place: "Plesso solare",
    geometry: "triangle",
    light: "#f2c230",
    soft: "#f8dc85",
    deep: "#2a1f03",
    intention: "Crescita personale e professionale, passo dopo passo.",
  },
  {
    id: "heart",
    section: "corsi",
    label: "Corsi",
    sanskrit: "Anahata",
    name: "Chakra del cuore",
    petals: 12,
    bija: "YAM",
    element: "Aria",
    place: "Centro del petto",
    geometry: "hexagram",
    light: "#3dbb73",
    soft: "#8fdcae",
    deep: "#052516",
    intention: "Imparare insieme, condividere, connettersi.",
  },
  {
    id: "throat",
    section: "contatti",
    label: "Contatti & Prenota",
    sanskrit: "Vishuddha",
    name: "Chakra della gola",
    petals: 16,
    bija: "HAM",
    element: "Etere",
    place: "Gola",
    geometry: "circle",
    light: "#3a9be0",
    soft: "#8cc6f0",
    deep: "#041a31",
    intention: "Parlarsi, incontrarsi, prenotare il tuo momento.",
  },
] as const;

export const CHAKRA_BY_SECTION: Record<string, Chakra> = Object.fromEntries(
  CHAKRAS.map((c) => [c.section, c]),
);

/** CSS custom properties a chakra-themed element exposes to its children. */
export function chakraVars(chakra: Chakra): React.CSSProperties {
  return {
    ["--accent" as string]: chakra.soft,
    ["--glow" as string]: chakra.light,
    ["--deep" as string]: chakra.deep,
  };
}
