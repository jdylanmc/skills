---
includes: []
requires-skills: []
---
# Inputs and Repository Contracts

## Evidence Inputs

Use, in priority order:

1. the current conversation;
2. the Discovery map's Destination, Notes, and Decisions so far;
3. resolved Discovery tickets and the handoff summary;
4. approved prototype artifacts;
5. repository code, documentation, tests, glossaries, context maps, and Architecture Decision Records.

Treat every source as evidence. Surface contradictions rather than silently choosing.

## Required Guidance

Read before synthesis or publication:

- `docs/agents/issue-tracker.md`;
- `docs/agents/domain.md`;
- `docs/agents/triage-labels.md`.

If any file is missing, stop and direct the user to `/setup-jdylanmc-skills`.

The issue-tracker document owns provider mechanics. The domain document owns glossary and Architecture Decision Record locations. The triage document maps canonical `ready-for-agent` to the repository's configured string.

Never edit `docs/agents/*.md` from Spec.

## Local-only Markdown

When configured, publish under `.scratch/<feature>/specs/<spec-name>.md` using the local tracker's `kind: spec` convention and relative links.

Reread immediately before mutation. Do not fabricate remote identifiers.
