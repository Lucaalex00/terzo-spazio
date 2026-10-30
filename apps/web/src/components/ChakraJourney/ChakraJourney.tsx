"use client";

/**
 * The immersive background: a WebGL light tunnel you fly through.
 *
 * The visitor is always travelling forward. The camera drifts with small
 * random tilts (never a perfectly straight line), scroll speed pushes the
 * flight faster (down) or slower (up), and on phones tilting the device steers
 * the vanishing point (desktop: the mouse does).
 *
 * The active chakra commands every color change: when a new section takes the
 * center of the screen the journey "jumps" — the tunnel fades to dark while
 * the portal names the new chakra, colors and lotus rings change in the dark,
 * and light returns in the new chakra's color — while the flight never stops.
 *
 * Performance: rendering runs in a Web Worker on an OffscreenCanvas
 * (journeyWorker.ts), so it never occupies the main thread; this component
 * only forwards state changes. Resolution adapts to the measured frame time.
 * With "reduce motion" only a gentle color fade remains. Without
 * OffscreenCanvas or WebGL a static CSS gradient takes over.
 */

import { useEffect, useRef } from "react";
import { CHAKRAS } from "@/lib/chakras";
import { journeyWorkerSource, type JourneyPalette, type JourneyState } from "./journeyWorker";

function hexToRgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}

const PALETTES: JourneyPalette[] = CHAKRAS.map((c) => ({
  light: hexToRgb(c.light),
  deep: hexToRgb(c.deep),
  petals: c.petals,
}));

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function ChakraJourney({ active }: { active: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
    workerRef.current?.postMessage({ type: "state", state: { active } });
    // Keep the static fallback in the active chakra's colors too.
    const chakra = CHAKRAS[active] ?? CHAKRAS[0];
    if (fallbackRef.current) {
      fallbackRef.current.style.background = `radial-gradient(circle at 50% 30%, ${chakra.light}55 0%, ${chakra.deep} 55%, #07060b 100%)`;
    }
  }, [active]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const showFallback = () => {
      host.replaceChildren();
      fallbackRef.current?.classList.remove("hidden");
    };

    // A fresh canvas per mount: a canvas can be handed to a worker only once.
    const canvas = document.createElement("canvas");
    canvas.className = "h-full w-full";
    if (typeof Worker === "undefined" || !("transferControlToOffscreen" in canvas)) {
      return showFallback();
    }
    host.replaceChildren(canvas);

    const url = URL.createObjectURL(new Blob([journeyWorkerSource()], { type: "text/javascript" }));
    const worker = new Worker(url);
    workerRef.current = worker;
    worker.onmessage = (e) => {
      if (e.data?.type === "fail") showFallback();
    };
    worker.onerror = () => showFallback();

    const post = (state: Partial<JourneyState>) => worker.postMessage({ type: "state", state });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scrollState = () => ({
      scrollY: window.scrollY,
      viewportH: window.innerHeight,
      docH: document.documentElement.scrollHeight,
    });

    const offscreen = canvas.transferControlToOffscreen();
    const initial: JourneyState = {
      active: activeRef.current,
      ...scrollState(),
      width: canvas.clientWidth || window.innerWidth,
      height: canvas.clientHeight || window.innerHeight,
      dpr: window.devicePixelRatio || 1,
      coarse: window.matchMedia("(pointer: coarse)").matches,
      reduce: reduceMotion.matches,
      steerX: 0,
      steerY: 0,
      steerRoll: 0,
    };
    worker.postMessage({ type: "init", canvas: offscreen, palettes: PALETTES, state: initial }, [
      offscreen,
    ]);

    const onScroll = () => post(scrollState());
    const resizeObserver = new ResizeObserver(() =>
      post({ width: canvas.clientWidth, height: canvas.clientHeight, ...scrollState() }),
    );
    resizeObserver.observe(canvas);
    const onReduce = () => post({ reduce: reduceMotion.matches });

    // Steering: device tilt on phones, mouse on desktop.
    let gamma0: number | null = null;
    let beta0: number | null = null;
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      if (gamma0 === null || beta0 === null) {
        gamma0 = e.gamma;
        beta0 = e.beta;
      }
      // Slowly re-center so any comfortable holding angle becomes "straight".
      gamma0 += (e.gamma - gamma0) * 0.004;
      beta0 += (e.beta - beta0) * 0.004;
      const dg = clamp((e.gamma - gamma0) / 28, -1, 1);
      const db = clamp((e.beta - beta0) / 28, -1, 1);
      post({ steerX: dg * 0.12, steerY: -db * 0.08, steerRoll: dg * 0.14 });
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      post({ steerX: nx * 0.05, steerY: -ny * 0.035, steerRoll: nx * 0.04 });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("deviceorientation", onOrientation);
    window.addEventListener("pointermove", onPointer, { passive: true });
    reduceMotion.addEventListener("change", onReduce);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("pointermove", onPointer);
      reduceMotion.removeEventListener("change", onReduce);
      resizeObserver.disconnect();
      worker.terminate();
      workerRef.current = null;
      URL.revokeObjectURL(url);
      host.replaceChildren();
    };
  }, []);

  return (
    <>
      <div
        ref={hostRef}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-20 h-lvh w-full"
      />
      <div ref={fallbackRef} aria-hidden className="fixed inset-0 -z-20 hidden" />
    </>
  );
}
