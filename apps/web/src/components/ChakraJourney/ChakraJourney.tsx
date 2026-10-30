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
 * center of the screen, the journey performs a "jump" — speed surges, the
 * chakra sphere swells and engulfs the view, colors flow into the new chakra,
 * the lotus rings morph to its petal count and the camera twists — while the
 * flight never stops.
 *
 * Performance: the canvas renders at a fraction of CSS resolution and adapts
 * it to the measured frame time; requestAnimationFrame pauses in background
 * tabs. With "reduce motion" only a gentle color fade remains. Without WebGL
 * a static CSS gradient takes over.
 */

import { useEffect, useRef } from "react";
import { CHAKRAS, type Chakra } from "@/lib/chakras";
import { JOURNEY_FRAGMENT, JOURNEY_VERTEX } from "./journeyShader";

type RGB = [number, number, number];

interface Palette {
  light: RGB;
  deep: RGB;
  petals: number;
}

const TRANSITION_SECONDS = 1.9;
const BASE_SPEED = 0.55;

const UNIFORMS = [
  "u_res",
  "u_time",
  "u_travel",
  "u_roll",
  "u_focus",
  "u_lightA",
  "u_lightB",
  "u_deepA",
  "u_deepB",
  "u_mix",
  "u_petalsA",
  "u_petalsB",
  "u_warp",
  "u_speed",
  "u_scroll",
] as const;

function hexToRgb(hex: string): RGB {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as RGB;
}

function paletteOf(chakra: Chakra): Palette {
  return { light: hexToRgb(chakra.light), deep: hexToRgb(chakra.deep), petals: chakra.petals };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp3 = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
/** Color mix progress for a transition clock t ∈ [0, 1]. */
const mixAt = (t: number) => easeInOut(clamp((t - 0.12) / 0.62, 0, 1));

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[ChakraJourney] shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, JOURNEY_VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, JOURNEY_FRAGMENT);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("[ChakraJourney] link error:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

export function ChakraJourney({ active }: { active: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
    // Keep the no-WebGL fallback in the active chakra's colors too.
    const chakra = CHAKRAS[active] ?? CHAKRAS[0];
    if (fallbackRef.current) {
      fallbackRef.current.style.background = `radial-gradient(circle at 50% 30%, ${chakra.light}55 0%, ${chakra.deep} 55%, #07060b 100%)`;
    }
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const showFallback = () => {
      canvas.style.display = "none";
      fallbackRef.current?.classList.remove("hidden");
    };

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return showFallback();
    const program = createProgram(gl);
    if (!program) return showFallback();

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // One oversized triangle covers the whole viewport.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(
      UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]),
    ) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const maxScale = Math.min(window.devicePixelRatio || 1, coarse ? 0.85 : 1);
    let scale = Math.min(maxScale, coarse ? 0.5 : 0.75);

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    // --- journey state -----------------------------------------------------
    let targetIndex = activeRef.current;
    let from = paletteOf(CHAKRAS[targetIndex] ?? CHAKRAS[0]);
    let to = from;
    let t = 1; // transition clock, 1 = settled
    let kick = 0; // camera twist direction during a jump
    let dirty = true;

    let travel = Math.random() * 40;
    let speed = BASE_SPEED;
    let boost = 0;
    let lastScroll = window.scrollY;

    let roll = 0;
    let rollTarget = 0;
    let fx = 0;
    let fy = 0;
    let fxTarget = 0;
    let fyTarget = 0;
    let nextTilt = 0;

    // Steering from device tilt (phones) or mouse (desktop).
    let steerX = 0;
    let steerY = 0;
    let steerRoll = 0;
    let steerXTarget = 0;
    let steerYTarget = 0;
    let steerRollTarget = 0;
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
      steerXTarget = dg * 0.12;
      steerYTarget = -db * 0.08;
      steerRollTarget = dg * 0.14;
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      steerXTarget = nx * 0.05;
      steerYTarget = -ny * 0.035;
      steerRollTarget = nx * 0.04;
    };

    window.addEventListener("deviceorientation", onOrientation);
    window.addEventListener("pointermove", onPointer, { passive: true });

    // --- render loop ---------------------------------------------------------
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let frameMs = 16;
    let adaptClock = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // Physics uses a clamped step (no jumps after a stall); the chakra
      // transition follows real time so it completes on schedule even on
      // slow devices.
      const realDt = Math.min(0.5, (now - last) / 1000);
      const dt = Math.min(0.05, realDt);
      last = now;
      elapsed += dt;
      const still = reduceMotion.matches;

      // The chakra commands the transition.
      const wanted = activeRef.current;
      if (wanted !== targetIndex && CHAKRAS[wanted]) {
        const m = mixAt(t);
        from = {
          light: lerp3(from.light, to.light, m),
          deep: lerp3(from.deep, to.deep, m),
          petals: m < 0.5 ? from.petals : to.petals,
        };
        kick = Math.random() < 0.5 ? -1 : 1;
        targetIndex = wanted;
        to = paletteOf(CHAKRAS[wanted]);
        t = 0;
      }
      if (t < 1) {
        t = Math.min(1, t + realDt / (still ? 0.9 : TRANSITION_SECONDS));
        dirty = true;
      }
      if (still && !dirty) return; // static frame already on screen

      const mix = mixAt(t);
      const warp = still || t >= 1 ? 0 : Math.pow(Math.sin(Math.PI * t), 2);

      // Scroll velocity (screens per second) pushes the flight.
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      const velocity = (y - lastScroll) / Math.max(dt, 1e-3) / vh;
      lastScroll = y;
      boost += (clamp(velocity * 0.9, -0.4, 2.6) - boost) * (1 - Math.exp(-dt * 3.5));
      const targetSpeed = still ? 0 : Math.max(0.16, BASE_SPEED + boost + warp * 5);
      speed += (targetSpeed - speed) * (1 - Math.exp(-dt * 5));
      travel += speed * dt;

      // Random small tilts so the flight never feels perfectly straight.
      if (now > nextTilt) {
        rollTarget = (Math.random() * 2 - 1) * 0.17;
        fxTarget = (Math.random() * 2 - 1) * 0.06;
        fyTarget = (Math.random() * 2 - 1) * 0.04;
        nextTilt = now + 2200 + Math.random() * 3800;
      }
      const k = 1 - Math.exp(-dt * 1.6);
      roll += (rollTarget - roll) * k;
      fx += (fxTarget - fx) * k;
      fy += (fyTarget - fy) * k;
      const ks = 1 - Math.exp(-dt * 4);
      steerX += (steerXTarget - steerX) * ks;
      steerY += (steerYTarget - steerY) * ks;
      steerRoll += (steerRollTarget - steerRoll) * ks;

      // Vanishing point sits on the hero lotus, then settles near center.
      const heroProgress = clamp(y / vh, 0, 1);
      const baseY = 0.2 - 0.14 * heroProgress;
      const wobble = Math.sin(elapsed * 0.6) * 0.025 + Math.sin(elapsed * 1.37) * 0.012;
      const twist = t < 1 ? kick * Math.sin(Math.PI * t) * 0.4 : 0;
      const rollOut = still ? 0 : roll + steerRoll + wobble + twist;
      const focusX = still ? 0 : fx + steerX;
      const focusY = baseY + (still ? 0 : fy + steerY);

      // Adaptive resolution: keep the phone smooth.
      frameMs += (dt * 1000 - frameMs) * 0.05;
      adaptClock += dt;
      if (!still && adaptClock > 1.5) {
        adaptClock = 0;
        if (frameMs > 24 && scale > 0.32) {
          scale = Math.max(0.32, scale * 0.82);
          resize();
        } else if (frameMs < 15 && scale < maxScale) {
          scale = Math.min(maxScale, scale * 1.12);
          resize();
        }
      }

      const doc = document.documentElement;
      const scrollProgress = y / Math.max(1, doc.scrollHeight - vh);

      gl.uniform2f(u.u_res, canvas.width, canvas.height);
      gl.uniform1f(u.u_time, elapsed);
      gl.uniform1f(u.u_travel, travel);
      gl.uniform1f(u.u_roll, rollOut);
      gl.uniform2f(u.u_focus, focusX, focusY);
      gl.uniform3fv(u.u_lightA, from.light);
      gl.uniform3fv(u.u_lightB, to.light);
      gl.uniform3fv(u.u_deepA, from.deep);
      gl.uniform3fv(u.u_deepB, to.deep);
      gl.uniform1f(u.u_mix, mix);
      gl.uniform1f(u.u_petalsA, from.petals);
      gl.uniform1f(u.u_petalsB, to.petals);
      gl.uniform1f(u.u_warp, warp);
      gl.uniform1f(u.u_speed, speed);
      gl.uniform1f(u.u_scroll, scrollProgress);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      dirty = false;
    };
    raf = requestAnimationFrame(frame);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      showFallback();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onContextLost);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-20 h-lvh w-full"
      />
      <div ref={fallbackRef} aria-hidden className="fixed inset-0 -z-20 hidden" />
    </>
  );
}
