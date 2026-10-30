/**
 * The light tunnel's render loop, run inside a Web Worker on an
 * OffscreenCanvas so it never occupies the page's main thread. With the main
 * thread idle, the site's CSS loops stay on the compositor and the phone
 * doesn't have to restyle the page every frame.
 *
 * `journeyWorkerMain` must be fully self-contained (it is serialized with
 * `toString()` into a Blob worker): no imports, no outer variables — only its
 * arguments and worker globals.
 *
 * Messages in:  { type: "init", canvas, palettes, state }  and
 *               { type: "state", state }  (partial updates)
 * Messages out: { type: "fail" } when WebGL is unavailable or lost.
 */

import { JOURNEY_FRAGMENT, JOURNEY_VERTEX } from "./journeyShader";

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

function journeyWorkerMain(
  VERT: string,
  FRAG: string,
  JUMP_TOTAL: number,
  JUMP_DARKEN: number,
  JUMP_HOLD_END: number,
) {
  const DARK = 0.16; // tunnel brightness at the bottom of a jump
  const BASE_SPEED = 0.55;
  const NAMES = [
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
    "u_dim",
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scope = self as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let state: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let palettes: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let canvas: any = null;
  let gl: WebGLRenderingContext | null = null;
  const u: Record<string, WebGLUniformLocation | null> = {};

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const lerp3 = (a: number[], b: number[], t: number) => [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t),
  ];
  const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const smooth = (x: number) => x * x * (3 - 2 * x);

  function compile(type: number, src: string) {
    const s = gl!.createShader(type);
    if (!s) return null;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    return gl!.getShaderParameter(s, gl!.COMPILE_STATUS) ? s : null;
  }

  function setup() {
    gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    }) as WebGLRenderingContext | null;
    if (!gl) return false;
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    const program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    for (let i = 0; i < NAMES.length; i++) u[NAMES[i]] = gl.getUniformLocation(program, NAMES[i]);
    canvas.addEventListener("webglcontextlost", (e: Event) => {
      e.preventDefault();
      scope.postMessage({ type: "fail" });
      running = false;
    });
    return true;
  }

  // --- adaptive resolution ---------------------------------------------------
  let scale = 0.75;
  let maxScale = 1;
  function resize() {
    const w = Math.max(1, Math.round(state.width * scale));
    const h = Math.max(1, Math.round(state.height * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
  }

  // --- journey state ---------------------------------------------------------
  let targetIndex = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let from: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let to: any = null;
  let t = 1; // jump clock in seconds / JUMP_TOTAL (1 = settled)
  let kick = 0;
  let jumpDimStart = 1;
  let jumpDim = 1;
  let travel = Math.random() * 40;
  let speed = BASE_SPEED;
  let boost = 0;
  let lastScroll = 0;
  let roll = 0;
  let rollT = 0;
  let fx = 0;
  let fy = 0;
  let fxT = 0;
  let fyT = 0;
  let nextTilt = 0;
  let sx = 0;
  let sy = 0;
  let sr = 0;
  let elapsed = 0;
  let frameMs = 16;
  let adapt = 0;
  let last = 0;
  let dirty = true;
  let running = true;

  /** Color-mix progress: colors change while the tunnel is dark. */
  const mixAt = (k: number) => easeInOut(clamp((k * JUMP_TOTAL - 0.35) / 1.0, 0, 1));

  /** Brightness during a jump: fade to dark, hold, back to light. */
  function jumpDimAt(k: number) {
    const s = k * JUMP_TOTAL;
    if (s < JUMP_DARKEN) return lerp(jumpDimStart, DARK, smooth(s / JUMP_DARKEN));
    if (s < JUMP_HOLD_END) return DARK;
    return lerp(DARK, 1, smooth(clamp((s - JUMP_HOLD_END) / (JUMP_TOTAL - JUMP_HOLD_END), 0, 1)));
  }

  const raf: (cb: (now: number) => void) => void =
    typeof scope.requestAnimationFrame === "function"
      ? (cb) => scope.requestAnimationFrame(cb)
      : (cb) => setTimeout(() => cb(performance.now()), 16);

  function frame(now: number) {
    if (!running) return;
    raf(frame);
    const realDt = last ? Math.min(0.5, (now - last) / 1000) : 0.016;
    const dt = Math.min(0.05, realDt);
    last = now;
    elapsed += dt;
    const still = state.reduce;

    // The chakra commands the transition.
    const wanted = state.active;
    if (wanted !== targetIndex && palettes[wanted]) {
      const m = mixAt(t);
      from = {
        light: lerp3(from.light, to.light, m),
        deep: lerp3(from.deep, to.deep, m),
        petals: m < 0.5 ? from.petals : to.petals,
      };
      kick = Math.random() < 0.5 ? -1 : 1;
      jumpDimStart = jumpDim; // start from the current brightness, no flashes
      targetIndex = wanted;
      to = palettes[wanted];
      t = 0;
    }
    if (t < 1) {
      t = Math.min(1, t + realDt / (still ? 0.9 : JUMP_TOTAL));
      dirty = true;
    }
    if (still && !dirty) return; // static frame already on screen

    const mix = still ? smooth(t) : mixAt(t);
    const warp = still || t >= 1 ? 0 : Math.pow(Math.sin(Math.PI * t), 2);
    jumpDim = still || t >= 1 ? 1 : jumpDimAt(t);
    const readingDim = targetIndex > 0 ? 0.85 : 1;

    // Scroll velocity (screens per second) pushes the flight.
    const y = state.scrollY;
    const vh = state.viewportH || 1;
    const velocity = (y - lastScroll) / Math.max(dt, 1e-3) / vh;
    lastScroll = y;
    boost += (clamp(velocity * 0.9, -0.4, 2.6) - boost) * (1 - Math.exp(-dt * 3.5));
    const targetSpeed = still ? 0 : Math.max(0.16, BASE_SPEED + boost + warp * 4);
    speed += (targetSpeed - speed) * (1 - Math.exp(-dt * 5));
    travel += speed * dt;

    // Random small tilts so the flight never feels perfectly straight.
    if (now > nextTilt) {
      rollT = (Math.random() * 2 - 1) * 0.17;
      fxT = (Math.random() * 2 - 1) * 0.06;
      fyT = (Math.random() * 2 - 1) * 0.04;
      nextTilt = now + 2200 + Math.random() * 3800;
    }
    const k = 1 - Math.exp(-dt * 1.6);
    roll += (rollT - roll) * k;
    fx += (fxT - fx) * k;
    fy += (fyT - fy) * k;
    const ks = 1 - Math.exp(-dt * 4);
    sx += (state.steerX - sx) * ks;
    sy += (state.steerY - sy) * ks;
    sr += (state.steerRoll - sr) * ks;

    // Vanishing point sits on the hero lotus, then settles near center.
    const baseY = 0.2 - 0.14 * clamp(y / vh, 0, 1);
    const wobble = Math.sin(elapsed * 0.6) * 0.025 + Math.sin(elapsed * 1.37) * 0.012;
    const twist = t < 1 ? kick * Math.sin(Math.PI * t) * 0.4 : 0;

    // Adaptive resolution: keep the phone smooth.
    frameMs += (realDt * 1000 - frameMs) * 0.05;
    adapt += dt;
    if (!still && adapt > 1.5) {
      adapt = 0;
      if (frameMs > 24 && scale > 0.32) {
        scale = Math.max(0.32, scale * 0.82);
        resize();
      } else if (frameMs < 15 && scale < maxScale) {
        scale = Math.min(maxScale, scale * 1.12);
        resize();
      }
    }

    const g = gl!;
    g.uniform2f(u.u_res, canvas.width, canvas.height);
    g.uniform1f(u.u_time, elapsed);
    g.uniform1f(u.u_travel, travel);
    g.uniform1f(u.u_roll, still ? 0 : roll + sr + wobble + twist);
    g.uniform2f(u.u_focus, still ? 0 : fx + sx, baseY + (still ? 0 : fy + sy));
    g.uniform3fv(u.u_lightA, from.light);
    g.uniform3fv(u.u_lightB, to.light);
    g.uniform3fv(u.u_deepA, from.deep);
    g.uniform3fv(u.u_deepB, to.deep);
    g.uniform1f(u.u_mix, mix);
    g.uniform1f(u.u_petalsA, from.petals);
    g.uniform1f(u.u_petalsB, to.petals);
    g.uniform1f(u.u_warp, warp);
    g.uniform1f(u.u_speed, speed);
    g.uniform1f(u.u_scroll, y / Math.max(1, state.docH - vh));
    g.uniform1f(u.u_dim, readingDim * jumpDim);
    g.drawArrays(g.TRIANGLES, 0, 3);
    dirty = false;
  }

  scope.onmessage = (e: MessageEvent) => {
    const msg = e.data;
    if (msg.type === "init") {
      canvas = msg.canvas;
      palettes = msg.palettes;
      state = msg.state;
      targetIndex = state.active;
      from = palettes[targetIndex] || palettes[0];
      to = from;
      lastScroll = state.scrollY;
      maxScale = Math.min(state.dpr || 1, state.coarse ? 0.85 : 1);
      scale = Math.min(maxScale, state.coarse ? 0.5 : 0.75);
      if (!setup()) {
        scope.postMessage({ type: "fail" });
        return;
      }
      resize();
      raf(frame);
    } else if (msg.type === "state" && state) {
      const prev = state;
      state = Object.assign({}, prev, msg.state);
      if (state.width !== prev.width || state.height !== prev.height) resize();
      if (state.reduce !== prev.reduce) dirty = true;
    }
  };
}

/** JavaScript source of the worker, with the shaders and timing baked in. */
export function journeyWorkerSource(): string {
  const args = [JOURNEY_VERTEX, JOURNEY_FRAGMENT, JUMP.total, JUMP.darken, JUMP.holdEnd]
    .map((a) => JSON.stringify(a))
    .join(", ");
  return `(${journeyWorkerMain.toString()})(${args});`;
}
