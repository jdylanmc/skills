---
includes: []
requires-skills: []
---
# Inputs and Context Gathering

## Accepted Sources

- current conversation;
- filesystem path;
- issue or work-item ID;
- tracker URL;
- published specification;
- Discovery map or handoff;
- parent ticket.

## Full Hydration

When a source reference is supplied, fetch:

- full body;
- comments or discussion;
- labels or tags;
- state and assignment;
- relations, dependencies, and children;
- linked specifications, decisions, prototypes, and context.

Summarize what was read before slicing.

When multiple plausible sources exist, ask which to use.

## Focused Code Exploration

Explore only when current understanding is insufficient to slice safely.

Inspect:

- current behavior and architecture;
- externally visible paths through the system;
- existing test seams and similar tests;
- structural friction that genuinely blocks vertical slices;
- relevant glossary terms and Architecture Decision Records.

Do not conduct speculative cleanup research.

Acceptance criteria should name observable outcomes and the seam through which they can be verified.
