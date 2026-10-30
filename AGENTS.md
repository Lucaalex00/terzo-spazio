# AGENTS.md — Terzo Spazio di Giulia Bordino

Cross-agent instructions (read by Codex and other AI coding agents, in addition
to Claude Code's `CLAUDE.md`). This file mirrors the project's governance so the
rules hold whichever tool edits the repo.

## What this project is

A mobile-first, statically rendered website for Giulia Bordino, esthetician,
with a five-chakra scrolling design, a WhatsApp booking bridge, local SEO and
GDPR-compliant analytics.

## Golden rules

- Code, comments, commits and docs in **English**; chat and user-facing copy in
  **Italian**.
- Respect existing patterns strictly; do not add a second way to do something
  that already has a convention here.
- Secrets only in `.env` (git-ignored); public config via `NEXT_PUBLIC_*`. Never
  hard-code credentials, numbers or ids.
- No analytics before cookie consent; no personal/booking data stored
  server-side.
- The files listed in `.repoforge/locked.json` are **locked**: do not edit them
  directly. To change one, record an ADR in `docs/adr/`, then make the change
  during an unlock window. A hook enforces this for every agent.

## Where things are

- Architecture: `ARCHITECTURE.md` · Rules: `GUARDRAILS.md` (hard),
  `GUIDELINES.md` (soft) · Conventions: `CONVENTIONS.md` · Workflow &
  commands: `WORKFLOW.md` · Decisions: `docs/adr/`.
- Public site: `apps/web/` (see `apps/web/CLAUDE.md`).

## Changing a locked file (any agent)

1. Add a numbered ADR under `docs/adr/` explaining the change.
2. Open a temporary unlock window scoped to that file (see `WORKFLOW.md`).
3. Make the edit, update `CHANGELOG.md`, then close the window.

In Claude Code, `/repo-forge:change` does all of this for you.
