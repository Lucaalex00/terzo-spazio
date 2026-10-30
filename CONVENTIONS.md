# Conventions

## Naming

- **Folders:** kebab-case (`cookie-policy`, `components/ChakraBackground`).
- **React components:** PascalCase, one per folder:
  `src/components/<Name>/<Name>.tsx`.
- **Non-component modules:** camelCase file names (`whatsapp.ts`, `site.ts`).
- **Content files:** plural nouns (`services.ts`, `news.ts`, `courses.ts`).
- **Route segments:** lowercase, matching the chakra section anchors where
  relevant.

## Imports

- Use the `@/*` path alias (maps to `apps/web/src/*`). Avoid long relative
  chains (`../../..`).

## TypeScript

- `strict` mode is on. Export explicit types for shared data shapes
  (`Service`, `NewsPost`, `Course`, `Chakra`).
- Prefer `interface` for object shapes, `type` for unions.

## Styling

- Tailwind CSS v4 utilities for layout and spacing; chakra accent via the
  `--accent` CSS variable. Define color tokens centrally, not inline, except for
  dynamic per-chakra `--accent`.

## Commits & branches

- **Conventional Commits:** `type(scope): subject`, imperative mood.
- **Branches:** `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, `chore/<slug>`.
- No direct commits to the default branch; open a PR and review.

## Documentation

- Keep `CHANGELOG.md` in Keep a Changelog format.
- Record architecture changes as ADRs in `docs/adr/`.
