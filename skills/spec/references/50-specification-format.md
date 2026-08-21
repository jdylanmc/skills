---
includes: []
requires-skills: []
---
# Specification Format

Use these sections in order.

```markdown
# <Specification title derived from the Destination>

## Problem Statement

<The user's problem, current limitation, and why it matters. Avoid solution language.>

## Solution

<The intended user-visible outcome and what becomes possible.>

## User Stories

1. As a <actor>, I want <capability>, so that <benefit>.

## Implementation Decisions

<Settled and inferred decisions about modules, interfaces, architecture, schemas, contracts, and interactions.>

## Testing Decisions

<Confirmed seams, external behaviors, prior art, fixtures, environments, negative cases, and exclusions.>

## Out of Scope

<Explicitly excluded work.>

## Further Notes

<Assumptions, source links, prototypes, and any remaining non-material unknowns.>
```

## Problem and Solution

Write from the user's perspective. The Problem Statement describes the limitation; the Solution describes the resulting capability rather than implementation mechanics.

## User Stories

Provide an extensive numbered list without filler or duplication.

Cover relevant:

- primary and alternate flows;
- edge cases;
- accessibility;
- failure and recovery;
- permissions and authorization;
- lifecycle, setup, upgrade, and teardown;
- compatibility and migration;
- operationally visible behavior such as configuration, diagnostics, or metrics.

## Implementation Decisions

Include settled modules and interfaces, technical clarifications, architecture, schema, API contracts, and interactions.

Do not include volatile file paths or ordinary code snippets.

A short prototype excerpt is allowed only when it encodes a settled decision more precisely than prose. Trim it to the contract and identify its prototype source.

Mark material claims as **Settled** or **Inferred**. Do not bury a **Blocker**.

## Testing Decisions

Record:

- what externally observable behavior is tested;
- confirmed seams and rationale;
- behaviors and modules covered;
- prior art;
- fixtures and environments;
- important negative and edge cases;
- explicit exclusions.

## Further Notes

Link the Discovery map, resolved decision tickets, handoff, and prototypes used as evidence.
