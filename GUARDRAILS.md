# Guardrails — must always / must never

These are hard rules. The structural ones are protected by the Repo Forge lock;
to change a locked file, use `/repo-forge:change`.

1. **English artifacts.** All code, comments, identifiers, commit messages and
   these documents are in English. User-facing copy and chat are in Italian.
2. **Secrets only in `.env`.** Never hard-code credentials, tokens, phone
   numbers or ids in source. Public config uses `NEXT_PUBLIC_*` env vars; commit
   only `.env.example`. Never commit `.env` / `.env.local`.
3. **No bookings stored here.** The site must never persist personal data or
   booking data server-side. Contact/booking always bridges to WhatsApp or the
   external booking app.
4. **No analytics before consent.** Google Analytics (or any non-essential
   cookie/tracker) must never load until the visitor explicitly grants consent.
5. **No direct commits to the default branch.** Use feature branches and review.
6. **Conventional Commits**, one concern per commit (`feat:`, `fix:`, `docs:`,
   `test:`, `chore:`, `refactor:`, `style:`).
7. **Do not edit locked constitution files directly** — only via
   `/repo-forge:change` (ADR + approval + temporary unlock).
8. **Accessibility is non-negotiable:** public UI meets WCAG 2.1 AA and honors
   `prefers-reduced-motion`.
9. **One component per folder:** components live in
   `apps/web/src/components/<Name>/<Name>.tsx`; no unrelated components in one
   file.
10. **Content lives in `apps/web/src/content/`** as typed data — never hard-code
    services, news or courses inside page components.
11. **The site must build statically:** `npm run build` must succeed and keep
    the public pages static/prerendered.
