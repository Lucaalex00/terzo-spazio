# 1. Record architecture decisions

- Status: accepted
- Date: 2026-10-30

## Context

We need a lightweight, durable way to capture the architecture decisions behind
Terzo Spazio so the structure is decided once, on purpose, and does not drift.

## Decision

We will use Architecture Decision Records (ADRs), as described by Michael Nygard,
stored in `docs/adr/`. Each ADR is numbered, has a status, and records the
context, the decision and its consequences. The stable constitution documents
(PROJECT_BRIEF, ARCHITECTURE, GUARDRAILS, GUIDELINES, CONVENTIONS, WORKFLOW and
the CLAUDE.md files) are locked via Repo Forge; changing a locked file requires
a new ADR through `/repo-forge:change`.

## Consequences

- Decisions are discoverable and versioned alongside the code.
- Reversing or amending a decision means adding a new ADR, not silently editing
  history.
- The lock keeps the agreed structure stable while still allowing deliberate,
  documented change.
