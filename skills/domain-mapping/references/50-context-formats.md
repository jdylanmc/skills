---
includes: []
requires-skills: []
---
## Context Glossary Format

Use this compact structure for a new or deliberately rewritten context glossary:

```markdown
# <Context Name>

<One short paragraph describing the context's responsibility or purpose.>

## Language

### <Optional Domain Group>

**<Canonical Term>**

<One or two sentences defining what the domain concept is.>

Discouraged aliases: `<alias>`, `<alias>`
```

Rules:

- Include only language belonging to the domain.
- Define what a concept is, not how software implements it.
- Use bold canonical terms.
- Keep definitions to one or two precise sentences.
- Add subgroup headings only when they improve navigation.
- Include discouraged aliases only when they prevent recurring ambiguity.
- Prefer a clear, opinionated vocabulary over a catalog of every observed phrase.
- Exclude APIs, classes, database fields, protocols, algorithms, specifications, generic programming concepts, tasks, history, and scratch notes.

Omit the discouraged-alias line when it adds no value.

## Context Map Format

Use this structure for a new multi-context root map:

```markdown
# Context Map

<One short paragraph describing the domain covered by this repository.>

## Contexts

- [<Context Name>](<relative-path>/CONTEXT.md) - <responsibility or purpose>
- [<Context Name>](<relative-path>/CONTEXT.md) - <responsibility or purpose>

## Relationships

- **<Context A> -> <Context B>:** <domain relationship, dependency, translation, or exchange>
```

The map summarizes ownership and relationships. It does not duplicate local glossary definitions or describe implementation architecture.
