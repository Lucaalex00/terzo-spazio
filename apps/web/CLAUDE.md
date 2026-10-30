# CLAUDE.md — apps/web (Next.js, App Router)

## Stack

Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS v4. Animation with
`motion` (`motion/react`). Analytics via `@next/third-parties` (GA4). No backend,
no database: content is in-repo typed data. Package manager: npm (workspaces).

> This repo uses a very recent Next.js. If an API seems different from what you
> remember, check `node_modules/next/dist/docs/` and the generated `AGENTS.md`
> in this folder before writing code.

## Folder structure

```
src/
  app/
    layout.tsx              # root layout: fonts, metadata, providers, chrome
    page.tsx                # home — the five chakra sections
    globals.css             # Tailwind v4 + chakra tokens
    sitemap.ts / robots.ts  # SEO metadata routes
    privacy/ , cookie-policy/   # legal pages (noindex)
  components/<Name>/<Name>.tsx  # one component per folder (PascalCase)
  content/                  # editable typed content (services, news, courses, business)
  lib/                      # site config, chakra system, whatsapp helpers
```

## Patterns

- **Server Components by default**; add `"use client"` only for state, effects
  or browser APIs (e.g. `ChakraBackground`, `ConsentProvider`, `BookingBridge`).
- **Chakra theming:** read the chakra model from `lib/chakras.ts`; `Section`
  exposes the accent as the `--accent` CSS variable — use it instead of
  hard-coded colors.
- **No secrets client-side:** only `NEXT_PUBLIC_*` env vars reach the browser.
- **Booking never persists:** build `wa.me` links via `lib/whatsapp.ts` or use
  the external booking URL.
- **Analytics gated:** `Analytics` renders GA4 only when `ConsentProvider`
  reports granted consent.

## Naming

- Route files are framework-named (`page.tsx`, `layout.tsx`).
- Components: PascalCase, one per folder. Other folders: kebab-case.
- Use the `@/*` import alias (→ `src/*`).

## Commands (run from repo root)

| Task | Command |
| --- | --- |
| Install | `npm install` |
| Dev | `npm run dev` |
| Build | `npm run build` |
| Start | `npm run start` |
| Lint | `npm run lint` |

## Must / must-not

- Never hard-code services/news/courses in pages — edit `src/content/*`.
- Keep `NEXT_PUBLIC_*` free of secrets.
- Keep the public pages statically renderable; `npm run build` must pass.
- Honor `prefers-reduced-motion` and WCAG 2.1 AA.
