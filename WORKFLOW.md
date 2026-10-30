# Workflow & tooling

Chat in Italian; write code, commits and docs in English.

## Day-to-day

```bash
npm install                          # install workspace deps
cp .env.example apps/web/.env.local  # then fill in values
npm run dev                          # http://localhost:3000
npm run build                        # production build (must pass)
npm run lint                         # ESLint
npm run format                       # Prettier
```

All scripts run from the repository root and delegate to `apps/web`.

## Set up now

- **Next.js 16 + TypeScript + Tailwind v4** — scaffolded with
  `npx create-next-app@latest` (verified at nextjs.org/docs → create-next-app).
- **motion** — `npm install motion` in `apps/web`, import from `motion/react`
  (verified at the Motion for React docs / motion GitHub).
- **@next/third-parties** — GA4 helper, installed in `apps/web` (verified at
  nextjs.org/docs → third-party-libraries).
- **@netlify/plugin-nextjs** — configured in `netlify.toml` (verified at
  docs.netlify.com → Next.js on Netlify).
- **Prettier + ESLint** — ESLint ships with create-next-app; Prettier is
  configured via `.prettierrc.json`.
- **Husky + lint-staged** — pre-commit format/lint. Initialize once at the repo
  root with `npx husky init` (verified at typicode.github.io/husky), then keep
  the generated `.husky/pre-commit` running `npx lint-staged`.

## Optional, add later

- **Playwright** for e2e tests of the booking bridge and consent flow; the
  Playwright MCP server (already available) lets Claude drive a real browser.
- **apps/admin** — a future editor app for Giulia (see PROJECT_BRIEF).

## Deployment

Netlify builds from `apps/web` (`base = "apps/web"`, `command = "npm run
build"`, `publish = ".next"`) using `@netlify/plugin-nextjs`. Set the production
environment variables (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`,
`NEXT_PUBLIC_GA_MEASUREMENT_ID`, optionally `NEXT_PUBLIC_BOOKING_URL`) in the
Netlify site settings.

## Manual steps (not automated)

- Provide the WhatsApp number and GA4 measurement id as environment variables.
- Choose and connect the final domain when ready.
