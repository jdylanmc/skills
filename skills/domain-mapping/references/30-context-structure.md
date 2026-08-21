---
includes: []
requires-skills: []
---
## Repository Context Model

Determine the repository's context structure before proposing edits.

### Empty Repository

When neither `CONTEXT.md` nor `CONTEXT-MAP.md` exists, default to one root `CONTEXT.md`. Do not introduce multiple contexts speculatively.

### Single Context

A root `CONTEXT.md` means the repository currently has one bounded context. Treat it as the owning glossary unless evidence establishes another context.

### Multiple Contexts

A root `CONTEXT-MAP.md` means the repository contains multiple bounded contexts. Each context owns a local `CONTEXT.md`; the root map links those files and records relationships between contexts.

If both root files exist and their intended roles are unclear, explain the conflict and ask which structure is authoritative.

### Controlled Transition

Transition from a single root glossary to a multi-context structure only when:

1. a second bounded context is clearly established by distinct responsibility, language, rules, ownership, or lifecycle; and
2. the user explicitly approves the structural change.

Before approval, explain the proposed contexts, ownership of existing terms, target file locations, and relationships to record in the root map. Do not split a context merely because the repository contains multiple modules or services.

When term ownership remains ambiguous, ask rather than duplicating the definition across contexts.
