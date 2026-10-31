/**
 * Terzo Spazio — light tunnel render loop (Web Worker).
 *
 * Runs on an OffscreenCanvas so the tunnel never occupies the page's main
 * thread. Plain JavaScript served as a static file on purpose: it is not
 * processed by the bundler, so it behaves the same in development and
 * production. Shaders and jump timing arrive with the "init" message
 * (sources: src/components/ChakraJourney/journeyShader.ts and journeyWorker.ts).
 *
 * Messages in:  { type: "init", canvas, palettes, state, shaders: { vert, frag },
 *                 jump: { total, darken, holdEnd } }
 *               { type: "state", state }  (partial updates)
 * Messages out: { type: "fail" } when WebGL is unavailable or lost.
 */
(function () {
  "use strict";

  var DARK = 0.16; // tunnel brightness at the bottom of a jump
  var BASE_SPEED = 0.55;
  var NAMES = [
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

  var state = null;
  var palettes = [];
  var canvas = null;
  var gl = null;
  var u = {};
  var JUMP_TOTAL = 2;
  var JUMP_DARKEN = 0.5;
  var JUMP_HOLD_END = 1.5;

  function clamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function lerp3(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  }
  function easeInOut(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
  function smooth(x) {
    return x * x * (3 - 2 * x);
  }

  function compile(type, src) {
    var s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }

  function setup(vert, frag) {
    gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return false;
    var vs = compile(gl.VERTEX_SHADER, vert);
    var fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return false;
    var program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    // One oversized triangle covers the whole viewport.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    for (var i = 0; i < NAMES.length; i++) u[NAMES[i]] = gl.getUniformLocation(program, NAMES[i]);
    canvas.addEventListener("webglcontextlost", function (e) {
      e.preventDefault();
      running = false;
      self.postMessage({ type: "fail" });
    });
    return true;
  }

  // --- adaptive resolution ---------------------------------------------------
  var scale = 0.75;
  var maxScale = 1;
  function resize() {
    var w = Math.max(1, Math.round(state.width * scale));
    var h = Math.max(1, Math.round(state.height * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  // --- journey state -----------------------------------------------------------
  var targetIndex = 0;
  var from = null;
  var to = null;
  var t = 1; // jump clock, 0..1 over JUMP_TOTAL seconds (1 = settled)
  var kick = 0;
  var jumpDimStart = 1;
  var jumpDim = 1;
  var travel = Math.random() * 40;
  var speed = BASE_SPEED;
  var boost = 0;
  var lastScroll = 0;
  var roll = 0,
    rollT = 0,
    fx = 0,
    fy = 0,
    fxT = 0,
    fyT = 0,
    nextTilt = 0;
  var sx = 0,
    sy = 0,
    sr = 0;
  var elapsed = 0;
  var frameMs = 16;
  var adapt = 0;
  var last = 0;
  var dirty = true;
  var running = true;

  /** Color-mix progress: colors change while the tunnel is dark. */
  function mixAt(k) {
    return easeInOut(clamp((k * JUMP_TOTAL - 0.35) / 1.0, 0, 1));
  }

  /** Brightness during a jump: fade to dark, hold, back to light. */
  function jumpDimAt(k) {
    var s = k * JUMP_TOTAL;
    if (s < JUMP_DARKEN) return lerp(jumpDimStart, DARK, smooth(s / JUMP_DARKEN));
    if (s < JUMP_HOLD_END) return DARK;
    return lerp(DARK, 1, smooth(clamp((s - JUMP_HOLD_END) / (JUMP_TOTAL - JUMP_HOLD_END), 0, 1)));
  }

  var raf =
    typeof self.requestAnimationFrame === "function"
      ? function (cb) {
          self.requestAnimationFrame(cb);
        }
      : function (cb) {
          setTimeout(function () {
            cb(performance.now());
          }, 16);
        };

  function frame(now) {
    if (!running) return;
    raf(frame);
    var realDt = last ? Math.min(0.5, (now - last) / 1000) : 0.016;
    var dt = Math.min(0.05, realDt); // physics: clamped, no jumps after a stall
    last = now;
    elapsed += dt;
    var still = state.reduce;

    // The chakra commands the transition.
    var wanted = state.active;
    if (wanted !== targetIndex && palettes[wanted]) {
      var m0 = mixAt(t);
      from = {
        light: lerp3(from.light, to.light, m0),
        deep: lerp3(from.deep, to.deep, m0),
        petals: m0 < 0.5 ? from.petals : to.petals,
      };
      kick = Math.random() < 0.5 ? -1 : 1;
      jumpDimStart = jumpDim; // start from the current brightness, no flashes
      targetIndex = wanted;
      to = palettes[wanted];
      t = 0;
    }
    if (t < 1) {
      // The jump follows real time so it ends on schedule on slow devices.
      t = Math.min(1, t + realDt / (still ? 0.9 : JUMP_TOTAL));
      dirty = true;
    }
    if (still && !dirty) return; // static frame already on screen

    var mix = still ? smooth(t) : mixAt(t);
    var warp = still || t >= 1 ? 0 : Math.pow(Math.sin(Math.PI * t), 2);
    jumpDim = still || t >= 1 ? 1 : jumpDimAt(t);
    var readingDim = targetIndex > 0 ? 0.85 : 1;

    // Scroll velocity (screens per second) pushes the flight.
    var y = state.scrollY;
    var vh = state.viewportH || 1;
    var velocity = (y - lastScroll) / Math.max(dt, 1e-3) / vh;
    lastScroll = y;
    boost += (clamp(velocity * 0.9, -0.4, 2.6) - boost) * (1 - Math.exp(-dt * 3.5));
    var targetSpeed = still ? 0 : Math.max(0.16, BASE_SPEED + boost + warp * 4);
    speed += (targetSpeed - speed) * (1 - Math.exp(-dt * 5));
    travel += speed * dt;

    // Random small tilts so the flight never feels perfectly straight.
    if (now > nextTilt) {
      rollT = (Math.random() * 2 - 1) * 0.17;
      fxT = (Math.random() * 2 - 1) * 0.06;
      fyT = (Math.random() * 2 - 1) * 0.04;
      nextTilt = now + 2200 + Math.random() * 3800;
    }
    var k = 1 - Math.exp(-dt * 1.6);
    roll += (rollT - roll) * k;
    fx += (fxT - fx) * k;
    fy += (fyT - fy) * k;
    var ks = 1 - Math.exp(-dt * 4);
    sx += (state.steerX - sx) * ks;
    sy += (state.steerY - sy) * ks;
    sr += (state.steerRoll - sr) * ks;

    // Vanishing point sits on the hero lotus, then settles near center.
    var baseY = 0.2 - 0.14 * clamp(y / vh, 0, 1);
    var wobble = Math.sin(elapsed * 0.6) * 0.025 + Math.sin(elapsed * 1.37) * 0.012;
    var twist = t < 1 ? kick * Math.sin(Math.PI * t) * 0.4 : 0;

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

    gl.uniform2f(u.u_res, canvas.width, canvas.height);
    gl.uniform1f(u.u_time, elapsed);
    gl.uniform1f(u.u_travel, travel);
    gl.uniform1f(u.u_roll, still ? 0 : roll + sr + wobble + twist);
    gl.uniform2f(u.u_focus, still ? 0 : fx + sx, baseY + (still ? 0 : fy + sy));
    gl.uniform3fv(u.u_lightA, from.light);
    gl.uniform3fv(u.u_lightB, to.light);
    gl.uniform3fv(u.u_deepA, from.deep);
    gl.uniform3fv(u.u_deepB, to.deep);
    gl.uniform1f(u.u_mix, mix);
    gl.uniform1f(u.u_petalsA, from.petals);
    gl.uniform1f(u.u_petalsB, to.petals);
    gl.uniform1f(u.u_warp, warp);
    gl.uniform1f(u.u_speed, speed);
    gl.uniform1f(u.u_scroll, y / Math.max(1, state.docH - vh));
    gl.uniform1f(u.u_dim, readingDim * jumpDim);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    dirty = false;
  }

  self.onmessage = function (e) {
    var msg = e.data;
    if (msg.type === "init") {
      canvas = msg.canvas;
      palettes = msg.palettes;
      state = msg.state;
      JUMP_TOTAL = msg.jump.total;
      JUMP_DARKEN = msg.jump.darken;
      JUMP_HOLD_END = msg.jump.holdEnd;
      targetIndex = state.active;
      from = palettes[targetIndex] || palettes[0];
      to = from;
      lastScroll = state.scrollY;
      maxScale = Math.min(state.dpr || 1, state.coarse ? 0.85 : 1);
      scale = Math.min(maxScale, state.coarse ? 0.5 : 0.75);
      if (!setup(msg.shaders.vert, msg.shaders.frag)) {
        self.postMessage({ type: "fail" });
        return;
      }
      resize();
      raf(frame);
    } else if (msg.type === "state" && state) {
      var prev = state;
      state = Object.assign({}, prev, msg.state);
      if (state.width !== prev.width || state.height !== prev.height) resize();
      if (state.reduce !== prev.reduce) dirty = true;
    }
  };
})();
