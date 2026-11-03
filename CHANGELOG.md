# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project scaffold with Repo Forge: npm-workspaces monorepo, Next.js 16
  web app in `apps/web`.
- Five-chakra design system: ambient scroll-lit background, section rail, and
  per-section theming.
- Content model (services, news, courses, business info) as typed data files.
- Booking bridge to WhatsApp / external booking app; floating WhatsApp button.
- Local SEO: metadata, sitemap, robots, `BeautySalon` JSON-LD.
- GDPR: cookie consent gate for Google Analytics 4, privacy and cookie policies.
- Constitution documents and structure lock.
- Chakra experience redesign: procedural lotus glyphs with traditional petal
  counts, inner geometry and bija syllables; breathing hero with a guided
  "inspira / espira" rhythm; aurora background with film grain; scroll-filled
  energy channel; cursor light; blur-to-focus reveals; floating glass header.

- Immersive WebGL light tunnel ("chakra journey"): continuous forward flight
  with random camera tilts, lotus rings carrying each chakra's petal count,
  light streaks and a chakra sphere at the vanishing point. The active chakra
  commands a hyperspace jump on every section change; scroll speed, device
  tilt (phones) and mouse (desktop) steer the flight; adaptive resolution.
- Chakra "portal": the new seed syllable rushes past on each jump, with a
  haptic tick on supported phones.
- Touch-friendly animations: light sweep on titles, cards that light up at
  the center of the screen, breathing CTA glow with sheen, pulsing WhatsApp
  button.

- Brand: the Terzo Spazio logo redrawn as vector paths from the original
  artwork (`src/lib/brand.ts`), used in header, footer and 404; favicon,
  home-screen icons, web manifest and a 1200×630 share image.
- Contacts: address (Via Primo Maggio 76/78, Canelli) with Google Maps link and
  phone; legal identity and VAT number in footer, privacy policy and
  structured data.
- Styled 404 page.

- Chakra portal: on every jump a full-site veil darkens (80%) and blurs the
  page for 2 s (0.5 s in, 1 s hold, 0.5 s out) while the seed syllable,
  section name and Sanskrit name stay sharp on top.
- Desktop: the active chakra's name is set vertically along the chakra bar.

### Performance
- WebGL tunnel moved to a Web Worker (OffscreenCanvas): rendering no longer
  occupies the main thread.
- Lotus, logo, title-shimmer, button-glow and scroll-cue loops reworked as
  compositor-only animations (same look); loops of off-screen sections pause.
- Watermark parallax and chakra-bar fill use CSS scroll-driven animations
  (JS fallback for the bar where unsupported).
- Lingering `blur(0px)` filters removed after reveals.
- Measured on a real GPU (Chrome, Radeon 680M): desktop idle 56 → 60 fps with
  0 janky frames, scroll 40 → 50 fps; phone (CPU 2x slower) idle 58 fps,
  scroll 46 fps.

### Fixed
- Structured data pointed to a missing `/og.png`; opening hours now use
  schema.org day names with separate opens/closes times.
- Chakra transitions follow real time, so they finish on schedule on slow
  devices.

### Removed
- create-next-app template assets and default favicon.

### Changed
- Dark immersive theme; chakra palette is now `light` (glows), `soft` (text
  on dark, ≥ 7:1) and `deep` (tunnel walls).
- Author credit shown as "Luca" (links to github.com/Lucaalex00).
- Service cards numbered instead of emoji icons.
