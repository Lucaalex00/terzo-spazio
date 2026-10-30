# Project Brief — Terzo Spazio di Giulia Bordino

## Vision

A mobile-first (then desktop) website that presents the work of **Giulia
Bordino**, esthetician. It showcases her services, shares updates about her
professional and personal journey, lists courses, and offers a quick, friendly
way to get in touch and start a booking. The aesthetic is built around the
**five chakras**: as the visitor scrolls, a chakra-themed ambient background
progressively "lights up", and each section owns a chakra dot with its own
color, theme and minimal, fluid animations.

The primary business goal is **strong local SEO**: the site should rank for
"giulia bordino" and for "estetista" in Canelli, Costigliole d'Asti and Asti,
to attract new clients and make the interested visitor's journey effortless.

## Target users

Prospective and returning clients in the Asti area. No account or login: people
come to read, get informed, and reach out to book.

## Features

- Services presentation (one card per service).
- Simple booking that acts as a **bridge** to Giulia's real channels: a WhatsApp
  chat pre-filled with a prepared message, or an external booking app.
- News / journal of professional and personal updates.
- Courses section.
- Contacts, social links, opening hours and closure days.
- Floating quick-contact WhatsApp button.

## Non-functional requirements

- Mobile-first, responsive up to desktop.
- Strong local SEO: per-page metadata, sitemap, robots, `BeautySalon`
  `LocalBusiness` JSON-LD with the towns served, Open Graph.
- High performance (static rendering, good Core Web Vitals).
- Accessibility target **WCAG 2.1 AA**; honor `prefers-reduced-motion`.
- Language: Italian only.
- GDPR: no personal data stored server-side (booking goes through WhatsApp /
  external app). Google Analytics 4 loads **only after explicit cookie consent**;
  privacy and cookie policies provided.

## Constraints

- Single developer (the site owner's developer) maintains content directly in
  the repository.
- Hosting: Netlify (free tier) via the official Next.js runtime plugin.
- No custom backend and no database at this stage.

## Decisions (approved)

- **Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, `motion` for
  animation, `@next/third-parties` for GA4, Netlify for hosting.
- **Content:** typed data files in the repo, developer-managed. No CMS.
- **Bookings:** bridge to WhatsApp (`wa.me`) or an external booking app; the
  site never stores bookings.
- **Layout:** npm-workspaces monorepo; public site in `apps/web`; constitution
  docs at the repository root.
- **Analytics:** GA4 behind cookie consent only.

## Open decisions / configuration to complete

These are intentional, not placeholders — they are environment or business
values supplied outside the code:

- Final **domain** (not yet chosen); until then the Netlify temporary domain is
  used. Set `NEXT_PUBLIC_SITE_URL` to the final domain in production.
- **WhatsApp number** (`NEXT_PUBLIC_WHATSAPP_NUMBER`) and **GA4 id**
  (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) to be provided via environment variables.
- **Business address, phone, email and social links** to be filled in
  `apps/web/src/content/business.ts` and `apps/web/src/lib/site.ts` when
  available (they also enrich the SEO structured data).
- Legal entity details (VAT, registered name) to be completed in the privacy
  policy.

## Future direction

A separate `apps/admin` application (running on its own port in the same
monorepo) may be added later so Giulia can edit content herself; it would feed
the same content source the public site reads. The booking will still be handled
by Giulia's external app — this site remains the bridge.

## Author

Created and maintained by Lucaalex00 — https://github.com/Lucaalex00
