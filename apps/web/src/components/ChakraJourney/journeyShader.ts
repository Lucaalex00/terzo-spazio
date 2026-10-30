/**
 * GLSL for the chakra light tunnel (WebGL 1 / GLSL ES 1.00).
 *
 * A single full-screen fragment shader renders, in polar coordinates around a
 * moving vanishing point:
 * - luminous smoke drifting along the tunnel walls (two fbm layers),
 * - lotus-shaped rings carrying the chakra's petal count, flying at the camera,
 * - two layers of light streaks whose length grows with speed,
 * - the chakra sphere at the vanishing point, which swells during a jump.
 *
 * Depth is 1/r, so adding `u_travel` moves everything outward: forward flight.
 * All motion state (speed, roll, focus, colors, warp) is driven from JS.
 */

export const JOURNEY_VERTEX = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const JOURNEY_FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_res;
uniform float u_time;
uniform float u_travel;
uniform float u_roll;
uniform vec2 u_focus;
uniform vec3 u_lightA;
uniform vec3 u_lightB;
uniform vec3 u_deepA;
uniform vec3 u_deepB;
uniform float u_mix;
uniform float u_petalsA;
uniform float u_petalsB;
uniform float u_warp;
uniform float u_speed;
uniform float u_scroll;

#define TAU 6.28318530718

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// One layer of light streaks travelling along radial lanes.
float streaks(float ang, float r, float depth, float lanes, float seed, float len) {
  float x = (ang / TAU + 0.5) * lanes;
  float cell = floor(x);
  float fa = fract(x) - 0.5;
  float rnd = hash(vec2(cell, seed));
  float zz = depth * (0.55 + rnd * 0.9) + rnd * 37.0;
  float t = fract(zz * 0.5);
  float on = step(0.58, hash(vec2(cell + seed, floor(zz * 0.5))));
  float head = smoothstep(1.0 - len, 1.0, t) * smoothstep(1.0, 0.965, t);
  float dist = abs(fa) * (TAU / lanes) * r;
  float lane = smoothstep(0.0035 + 0.004 * r, 0.0, dist);
  return head * head * lane * on;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec2 p = uv - u_focus;
  float c = cos(u_roll);
  float s = sin(u_roll);
  p = mat2(c, -s, s, c) * p;

  float r = length(p);
  float ang = atan(p.y, p.x);
  float depth = 0.32 / max(r, 0.002) + u_travel;

  vec3 light = mix(u_lightA, u_lightB, u_mix);
  vec3 deep = mix(u_deepA, u_deepB, u_mix);
  vec3 white = vec3(1.0);

  // Tunnel walls: luminous smoke drifting past.
  vec2 dir = vec2(cos(ang + u_scroll * 1.4), sin(ang + u_scroll * 1.4));
  float neb = fbm(dir * 1.7 + vec2(depth * 0.18, depth * 0.11));
  float neb2 = fbm(dir * 3.1 - vec2(depth * 0.27, -depth * 0.09) + 4.0);
  vec3 col = deep * (0.7 + 1.1 * neb);
  col += light * pow(neb2, 3.0) * 1.1;

  // Lotus rings carrying the chakra's petal count (morphing during a jump).
  float pet = mix(cos(ang * u_petalsA), cos(ang * u_petalsB), u_mix);
  float petal = pow(0.5 + 0.5 * pet, 1.5);
  float rp = fract(depth * 0.4 + petal * 0.12);
  float ring = exp(-abs(rp - 0.5) * 38.0) + 0.35 * exp(-abs(rp - 0.5) * 9.0);
  float near = smoothstep(0.04, 0.35, r) * smoothstep(2.2, 0.6, r);
  col += light * ring * near * (0.45 + 0.35 * petal + 0.6 * u_warp);

  // Light streaks, longer when flying faster.
  float len = clamp(0.06 + u_speed * 0.07, 0.06, 0.6);
  float fade = smoothstep(0.03, 0.22, r);
  float st = streaks(ang, r, depth, 70.0, 3.1, len)
    + 0.7 * streaks(ang + 0.03, r, depth * 1.3, 120.0, 8.7, len * 0.8);
  col += mix(light, white, 0.55) * st * fade * 1.4;

  // The chakra sphere at the vanishing point; it engulfs us during a jump.
  // Saturated (not white) while swelling, so text over it stays readable.
  float orbR = 0.07 + 0.012 * sin(u_time * 1.05) + u_warp * 0.4;
  float orb = exp(-(r * r) / (orbR * orbR));
  col += mix(light, white, 0.45 - 0.3 * u_warp) * orb * (0.55 + 0.45 * u_warp);
  col += light * exp(-r * 3.0) * 0.18;
  col += light * u_warp * u_warp * 0.12;

  // Breath (6 s, in sync with the hero guide) and vignette.
  col *= 0.94 + 0.06 * sin(u_time * TAU / 6.0);
  float vig = smoothstep(1.35, 0.25, length(uv * vec2(0.9, 1.0)));
  col *= mix(0.45, 1.0, vig);

  // Tone map + dither against banding.
  col = vec3(1.0) - exp(-col * 1.35);
  col += (hash(gl_FragCoord.xy + fract(u_time) * 100.0) - 0.5) / 128.0;
  gl_FragColor = vec4(col, 1.0);
}
`;
