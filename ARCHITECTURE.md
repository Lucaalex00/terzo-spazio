# Architecture — Terzo Spazio di Giulia Bordino

## Overview

A statically rendered, content-driven marketing site with a chakra-themed
scrolling experience. There is no backend and no database: all content lives in
the repository as typed TypeScript data, and all dynamic behavior (consent,
animations, the booking bridge) runs client-side in the browser.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Next.js 16 (App Router, TypeScript) | SSG/ISR, Metadata API, strong SEO |
| Styling | Tailwind CSS v4 | Utility-first; chakra theming via CSS variables |
| Animation | `motion` (`motion/react`) | Minimal, fluid, reduced-motion friendly |
| Analytics | `@next/third-parties` (GA4) | Official helper, loaded after consent |
| Hosting | Netlify (`@netlify/plugin-nextjs`) | Free tier, Git deploys, Next.js support |
| Backend | none | Not needed at this stage |
| Database | none | Content is in-repo; no persistence required |

## Monorepo layout

```
terzo-spazio/
├─ apps/
│  └─ web/                      # public website (Next.js)
│     └─ src/
│        ├─ app/                # routes, layout, metadata, sitemap, robots
│        ├─ components/         # one folder per component (PascalCase)
│        ├─ content/            # editable typed content (services, news, …)
│        └─ lib/                # site config, chakra system, helpers
├─ packages/                    # (reserved) shared code for a future app
├─ docs/adr/                    # architecture decision records
├─ *.md                         # constitution documents (this folder)
├─ netlify.toml
├─ .env.example
└─ package.json                 # npm workspaces root
```

npm workspaces (`apps/*`, `packages/*`) keep room for a future `apps/admin`
without restructuring.

## The chakra system

Defined once in `apps/web/src/lib/chakras.ts`: five chakras, each mapped to one
page section (`benvenuto`, `servizi`, `percorso`, `corsi`, `contatti`) with a
label, accent color, soft tint and intention.

- `ChakraBackground` renders a fixed ambient background and a rail of five dots.
  It uses an `IntersectionObserver` to find the most visible section and drifts
  the background color and lights up dots up to the active one.
- `Section` wraps each section: it sets the anchor `id`, the
  `data-chakra-section` index the observer tracks, exposes the chakra accent as
  a `--accent` CSS variable for its children, and animates content in on view.

## Data flow

- **Content** (`src/content/*`) is imported directly by server components and
  rendered at build time. Editing a content file and redeploying updates the
  site.
- **Booking bridge** (`src/lib/whatsapp.ts`, `BookingBridge`, `WhatsAppFab`)
  builds a `wa.me` link with a prepared message, or uses the external booking
  URL when configured. Nothing is sent to our servers.
- **Consent** (`ConsentProvider`) holds the GDPR choice in `localStorage` and
  gates whether `Analytics` mounts GA4.

## SEO

- Per-route metadata via the Next.js Metadata API; canonical and Open Graph in
  the root layout.
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.
- `JsonLd` emits `BeautySalon` structured data including `areaServed` for the
  towns, to support local search intent.

## Boundaries

- No secrets in code: environment values come from `NEXT_PUBLIC_*` vars.
- Legal pages (`/privacy`, `/cookie-policy`) are `noindex` but followable.
- The site must build fully statically (`next build` produces static routes).
