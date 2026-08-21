---
includes: []
requires-skills: []
---
# Domain Documentation: Multiple Contexts

This repository uses multiple bounded contexts.

## Locations

- Context index and relationships: root `CONTEXT-MAP.md`
- Glossaries: context-local `CONTEXT.md` files listed by the map
- Architecture Decision Records: context-local directories listed by the map; system-wide decisions may use root `docs/adr/`

## Consumer Rules

- Read `CONTEXT-MAP.md` first to identify the owning context and relationships.
- Read the owning context's glossary before interpreting or adding vocabulary.
- Ask when a concept's owner remains ambiguous; do not duplicate it silently.
- Treat each `CONTEXT.md` as a glossary only, without implementation details, specifications, notes, or generic programming concepts.
- Create files lazily after an explicit terminology or decision outcome.

Offer an Architecture Decision Record only when the decision is costly to reverse, surprising without rationale, and the result of a genuine tradeoff. All three conditions are required.
