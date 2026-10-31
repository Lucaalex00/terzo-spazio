/**
 * Shared contract for the light tunnel's Web Worker.
 *
 * The render loop itself lives in `public/journey-worker.js`: plain JavaScript
 * served as a static file, so the bundler never rewrites it (a serialized
 * bundled function breaks in development, where Turbopack injects its own
 * runtime references). The shaders (journeyShader.ts) and the jump timing
 * below are sent to it in the "init" message, so they stay single-sourced.
 */

/** URL of the static worker script. */
export const JOURNEY_WORKER_URL = "/journey-worker.js";

/** Timing of a chakra "jump", in seconds. */
export const JUMP = {
  /** Total length: darken, hold, brighten. */
  total: 2,
  /** Fade to dark. */
  darken: 0.5,
  /** Dark hold ends (then 0.5 s back to light). */
  holdEnd: 1.5,
} as const;

export interface JourneyPalette {
  light: [number, number, number];
  deep: [number, number, number];
  petals: number;
}

export interface JourneyState {
  active: number;
  scrollY: number;
  viewportH: number;
  docH: number;
  width: number;
  height: number;
  dpr: number;
  coarse: boolean;
  reduce: boolean;
  steerX: number;
  steerY: number;
  steerRoll: number;
}
