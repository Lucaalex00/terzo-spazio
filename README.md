# Terzo Spazio di Giulia Bordino

Mobile-first website for **Giulia Bordino**, esthetician. It presents her
services, shares news about her professional and personal journey, lists
courses, and offers a quick, friendly way to get in touch and start a booking.

The design is inspired by the **five chakras**: as you scroll, a chakra-themed
background progressively "lights up", and each section owns a chakra dot with
its own colors, theme and minimal animations.

> Real bookings are handled by Giulia on a separate external app. The booking
> form on this site is only a **bridge** toward that destination (WhatsApp with
> a prepared message, or the configured external booking URL).

## Tech stack

- **Next.js 16** (App Router, TypeScript) — SSG/ISR, great for local SEO
- **Tailwind CSS v4** — chakra theming via CSS variables
- **motion** (`motion/react`) — minimal, fluid animations
- **@next/third-parties** — Google Analytics 4, loaded only after cookie consent
- **Netlify** — hosting via `@netlify/plugin-nextjs`

No database and no custom backend: content lives in the repo as typed data
files and is maintained by the developer. A future `apps/admin` app can be added
to let Giulia edit content herself (see docs/ARCHITECTURE.md).

## Monorepo layout

```
terzo-spazio/
├─ apps/
│  └─ web/            # public website (Next.js)
├─ packages/          # (reserved) shared code
├─ docs/ + *.md       # Repo Forge "constitution" documents
├─ netlify.toml
├─ .env.example
└─ package.json       # npm workspaces root
```

## Getting started

```bash
npm install
cp .env.example apps/web/.env.local   # then fill in the values
npm run dev
```

The site runs at http://localhost:3000.

## Scripts (run from the repo root)

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint on the web app |
| `npm run format` | Format the codebase with Prettier |

## Governance

This repository is managed with **Repo Forge**: its structure and conventions
are documented in the root constitution files and locked via
`.repoforge/locked.json`. To change a locked file, use `/repo-forge:change`.

## Author

Created and maintained by [**Luca**](https://github.com/Lucaalex00).
