/**
 * The Terzo Spazio mark (sun, rays and serene face), optionally followed by
 * the wordmark set in the display face — which closely matches the logo's
 * own lettering.
 *
 * `alive` lets the sun breathe on the site's 6-second rhythm and the rays
 * glow softly; loops are CSS, so reduced motion freezes them.
 */

import {
  BRAND_COLORS,
  FACE_PATHS,
  MARK_VIEWBOX,
  RAYS_PATH,
  RAYS_STROKE_WIDTH,
  SUN,
} from "@/lib/brand";

interface LogoProps {
  /** Height of the mark in px. */
  size?: number;
  /** Show "Terzo Spazio" next to the mark. */
  wordmark?: boolean;
  alive?: boolean;
  className?: string;
}

export function LogoMark({ size = 32, alive = true }: { size?: number; alive?: boolean }) {
  const [, , w, h] = MARK_VIEWBOX.split(" ").map(Number);
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      height={size}
      width={(size * w) / h}
      aria-hidden
      className="shrink-0 overflow-visible"
    >
      <path
        d={RAYS_PATH}
        stroke={BRAND_COLORS.sun}
        strokeWidth={RAYS_STROKE_WIDTH}
        fill="none"
        className={alive ? "logo-rays" : undefined}
      />
      <circle
        cx={SUN.cx}
        cy={SUN.cy}
        r={SUN.r}
        fill={BRAND_COLORS.sun}
        className={alive ? "logo-sun" : undefined}
      />
      {FACE_PATHS.map((d, i) => (
        <path key={i} d={d} fill={BRAND_COLORS.sageOnDark} />
      ))}
    </svg>
  );
}

export function Logo({ size = 32, wordmark = true, alive = true, className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark size={size} alive={alive} />
      {wordmark && (
        <span
          className="font-display leading-none"
          style={{ color: BRAND_COLORS.sageOnDark, fontSize: size * 0.62 }}
        >
          Terzo Spazio
        </span>
      )}
    </span>
  );
}
