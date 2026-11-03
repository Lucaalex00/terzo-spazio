/**
 * The Terzo Spazio mark (sun, rays and serene face), optionally followed by
 * the wordmark set in the display face — which closely matches the logo's
 * own lettering.
 *
 * `alive` lets the sun breathe on the site's 6-second rhythm and the rays
 * glow softly. Rays, sun and face are three stacked SVG layers so those loops
 * animate whole layers on the compositor instead of repainting the SVG.
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

const LAYER = "absolute inset-0 h-full w-full overflow-visible";

export function LogoMark({ size = 32, alive = true }: { size?: number; alive?: boolean }) {
  const [, , w, h] = MARK_VIEWBOX.split(" ").map(Number);
  return (
    <span
      aria-hidden
      className="relative inline-block shrink-0"
      style={{ width: (size * w) / h, height: size }}
    >
      <span className={`absolute inset-0 ${alive ? "logo-rays" : ""}`}>
        <svg viewBox={MARK_VIEWBOX} className={LAYER}>
          <path
            d={RAYS_PATH}
            stroke={BRAND_COLORS.sun}
            strokeWidth={RAYS_STROKE_WIDTH}
            fill="none"
          />
        </svg>
      </span>
      <span className={`absolute inset-0 ${alive ? "logo-sun" : ""}`}>
        <svg viewBox={MARK_VIEWBOX} className={LAYER}>
          <circle cx={SUN.cx} cy={SUN.cy} r={SUN.r} fill={BRAND_COLORS.sun} />
        </svg>
      </span>
      <svg viewBox={MARK_VIEWBOX} className={LAYER}>
        {FACE_PATHS.map((d, i) => (
          <path key={i} d={d} fill={BRAND_COLORS.sageOnDark} />
        ))}
      </svg>
    </span>
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
