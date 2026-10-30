# CLAUDE.md — Terzo Spazio di Giulia Bordino (root)

Project-wide instructions for Claude Code. Read this first, then the `CLAUDE.md`
in the part you are working on (`apps/web/CLAUDE.md`).

## What this project is

A mobile-first, statically rendered website for Giulia Bordino, esthetician,
with a five-chakra scrolling design, a WhatsApp booking bridge, local SEO and
GDPR-compliant analytics.

## Golden rules (see GUARDRAILS.md)

- Code, comments, commits and docs in **English**; chat and user-facing copy in
  **Italian**.
- Respect existing patterns strictly; do not introduce a second way of doing
  something that already has a convention.
- Secrets only in `.env` (git-ignored); public config via `NEXT_PUBLIC_*`. Never
  hard-code credentials, numbers or ids.
- No analytics before cookie consent; no personal/booking data stored
  server-side.
- Do not edit locked constitution files directly — use `/repo-forge:change`.

## Where things live

- Architecture: `ARCHITECTURE.md`
- Rules: `GUARDRAILS.md` (hard), `GUIDELINES.md` (soft)
- Conventions: `CONVENTIONS.md`
- How to work & commands: `WORKFLOW.md`
- Decisions: `docs/adr/`
- Public site: `apps/web/` (has its own `CLAUDE.md`)

## Before you start a task

1. Read `apps/web/CLAUDE.md`.
2. Follow `CONVENTIONS.md` for naming and layout.
3. Run format/lint/build per `WORKFLOW.md` before committing.

## Locked structure

The files listed in `.repoforge/locked.json` are locked; a hook blocks direct
edits. To change them, run `/repo-forge:change`.
