"use client";

/**
 * Procedural chakra lotus, drawn from the traditional iconography of each
 * chakra: its number of petals, its inner geometry and its bija (seed)
 * syllable at the center.
 *
 * On first view the petals "draw" themselves in; afterwards the lotus slowly
 * breathes and its petal crown turns. Loops are pure CSS (see globals.css),
 * so `prefers-reduced-motion` freezes them for free.
 */

import { useId } from "react";
import { motion } from "motion/react";
import type { Chakra, ChakraGeometry } from "@/lib/chakras";

interface ChakraGlyphProps {
  chakra: Chakra;
  /** Rendered size in px. */
  size?: number;
  /** Enable the breathing / rotation loops. */
  alive?: boolean;
  /** Show the bija syllable at the center. */
  showBija?: boolean;
  className?: string;
}

const R_BASE = 46; // radius where petals start
const R_TIP = 88; // radius of the petal tips

/** One petal pointing up (negative y); rotated into place by the caller. */
function petalPath(petals: number, tip: number = R_TIP): string {
  const width = Math.min(30, ((Math.PI * R_BASE) / petals) * 1.15);
  const mid = R_BASE + (tip - R_BASE) * 0.45;
  return [
    `M ${-width * 0.55} ${-R_BASE}`,
    `C ${-width} ${-mid} ${-width * 0.35} ${-(tip - 6)} 0 ${-tip}`,
    `C ${width * 0.35} ${-(tip - 6)} ${width} ${-mid} ${width * 0.55} ${-R_BASE}`,
    "Z",
  ].join(" ");
}

/** Regular polygon points on a circle of radius r, first vertex at `startDeg`. */
function polygon(sides: number, r: number, startDeg: number): string {
  return Array.from({ length: sides }, (_, i) => {
    const a = ((startDeg + (360 / sides) * i) * Math.PI) / 180;
    return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
  }).join(" ");
}

function Geometry({ kind, maskId }: { kind: ChakraGeometry; maskId: string }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;
  switch (kind) {
    case "square":
      return <rect x={-25} y={-25} width={50} height={50} {...stroke} />;
    case "crescent":
      return (
        <>
          <mask id={maskId}>
            <rect x={-50} y={-50} width={100} height={100} fill="white" />
            <circle cx={0} cy={-9} r={22} fill="black" />
          </mask>
          <circle
            cx={0}
            cy={4}
            r={26}
            fill="currentColor"
            opacity={0.85}
            mask={`url(#${maskId})`}
          />
        </>
      );
    case "triangle":
      return <polygon points={polygon(3, 32, 90)} {...stroke} />;
    case "hexagram":
      return (
        <>
          <polygon points={polygon(3, 32, 90)} {...stroke} />
          <polygon points={polygon(3, 32, -90)} {...stroke} />
        </>
      );
    case "circle":
      return (
        <>
          <polygon points={polygon(3, 36, 90)} {...stroke} />
          <circle cx={0} cy={0} r={15} {...stroke} />
        </>
      );
  }
}

export function ChakraGlyph({
  chakra,
  size = 160,
  alive = true,
  showBija = true,
  className,
}: ChakraGlyphProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `petal-${uid}`;
  const haloId = `halo-${uid}`;
  const maskId = `mask-${uid}`;
  const d = petalPath(chakra.petals);
  const backPetal = petalPath(chakra.petals, R_TIP - 16);

  return (
    <svg
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      role="img"
      aria-label={`${chakra.sanskrit}, ${chakra.name}: ${chakra.petals} petali, elemento ${chakra.element}`}
      className={`${alive ? "chakra-breathe" : ""} ${className ?? ""}`}
      style={{ color: chakra.light, overflow: "visible" }}
    >
      <defs>
        <radialGradient id={gradientId} cx="0" cy="0" r="90" gradientUnits="userSpaceOnUse">
          <stop offset="0.45" stopColor={chakra.light} stopOpacity={0.5} />
          <stop offset="1" stopColor={chakra.light} stopOpacity={0.08} />
        </radialGradient>
        <radialGradient id={haloId} cx="0" cy="0" r="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={chakra.light} stopOpacity={0.35} />
          <stop offset="1" stopColor={chakra.light} stopOpacity={0} />
        </radialGradient>
      </defs>

      <circle r={100} fill={`url(#${haloId})`} />

      <g className={alive ? "chakra-spin" : undefined}>
        {/* Back crown: shorter petals offset by half a step, for a fuller lotus. */}
        {Array.from({ length: chakra.petals }, (_, i) => (
          <motion.path
            key={`back-${i}`}
            d={backPetal}
            transform={`rotate(${(360 / chakra.petals) * (i + 0.5)})`}
            fill={`url(#${gradientId})`}
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth={1}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.55 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.6, ease: "easeOut" }}
          />
        ))}
        {Array.from({ length: chakra.petals }, (_, i) => (
          <motion.path
            key={i}
            d={d}
            transform={`rotate(${(360 / chakra.petals) * i})`}
            fill={`url(#${gradientId})`}
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </g>

      <circle
        r={R_BASE - 2}
        fill="#0c0812"
        fillOpacity={0.6}
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <Geometry kind={chakra.geometry} maskId={maskId} />

      {showBija && chakra.geometry !== "square" && (
        // Soft disc so geometry lines never cross the seed syllable.
        <circle r={chakra.geometry === "circle" ? 13 : 18} fill="#0c0812" fillOpacity={0.88} />
      )}
      {showBija && (
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-display"
          fontSize={chakra.geometry === "square" ? 15 : chakra.geometry === "circle" ? 10 : 12}
          letterSpacing={1}
          fill={chakra.soft}
        >
          {chakra.bija}
        </text>
      )}
    </svg>
  );
}
