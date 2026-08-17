# Evidence and Synthesis

## Focused Exploration

Explore only when existing context leaves a material gap. Stop when the gap is closed.

Inspect as needed:

- current behavior and implementation structure;
- public interfaces and externally visible behavior;
- existing tests and fixtures;
- highest-level test seams and similar tests;
- the owning domain glossary and context map;
- applicable Architecture Decision Records.

## Canonical Vocabulary

Use terminology from the owning `CONTEXT.md` and `CONTEXT-MAP.md`. Respect applicable Architecture Decision Records.

When terminology remains materially unresolved, recommend `/domain-mapping` rather than inventing a definition.

## Evidence Classification

Classify every material point:

- **Settled:** established by Discovery, the user, an Architecture Decision Record, or an approved prototype contract.
- **Inferred:** implementation guidance derived from evidence and safe to challenge.
- **Blocker:** unresolved information that makes a ready-for-agent specification misleading.

## Contradictions

When evidence conflicts:

1. state both positions and sources;
2. defer to a clearly governing settled decision and identify the superseded source;
3. otherwise classify the conflict as a Blocker.

If a material Blocker remains, stop and identify the Discovery ticket, fog, or decision that must be resumed.
