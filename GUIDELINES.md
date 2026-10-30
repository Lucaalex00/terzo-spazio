# Guidelines — should / prefer

Softer rules. Prefer these unless there is a good, documented reason not to.

1. **Theme via CSS variables.** Use the `--accent` variable a `Section` exposes
   and the chakra tokens in `lib/chakras.ts`; avoid hard-coding chakra colors in
   components.
2. **Keep animations minimal and calm.** Short durations, gentle easing, respect
   reduced motion. Animation should support the mood, not distract.
3. **SEO per page.** Every route defines its own `metadata`; keep the
   `LocalBusiness` JSON-LD and the towns served accurate.
4. **Server components by default.** Mark a component `"use client"` only when
   it needs state, effects or browser APIs.
5. **Tests for critical flows.** Prefer at least one test (Playwright e2e) for
   the booking bridge and consent behavior as they evolve.
6. **Automated formatting/linting.** Let Prettier and ESLint do the work; run
   them before committing (Husky + lint-staged handle this).
7. **Small, focused dependencies.** Justify each new dependency; prefer the
   platform and existing tools first.
8. **Content is friendly and concise.** Italian copy stays warm, clear and
   short; avoid jargon.
9. **Images optimized.** Use `next/image` and provide descriptive `alt` text.
10. **Keep the monorepo tidy.** Shared code goes in `packages/`; a future admin
    app goes in `apps/admin`.
