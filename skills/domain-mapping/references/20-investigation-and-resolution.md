## Evidence-Based Investigation

Use `read` to inspect known artifacts, `search` to locate terms and behavior across the repository, and `edit` only after the applicable approval gate.

Cross-check material domain claims against code when code exists. Search for:

- definitions and aliases;
- validation rules and state transitions;
- ownership boundaries;
- data exchanged between components;
- different names for equivalent behavior;
- identical names representing different behavior.

Report material conflicts instead of silently selecting a source.

## Disagreement Detection

Classify what requires investigation using one or more of these categories:

- **Naming:** Different labels may refer to the same concept.
- **Meaning:** The same label has incompatible definitions.
- **Ownership:** The responsible bounded context is unclear or disputed.
- **Lifecycle:** Creation, transition, completion, or retirement semantics differ.
- **Boundary:** It is unclear whether concepts belong together or cross contexts.

These categories diagnose the disagreement; they are not resolution outcomes.

## Terminology Resolution

Resolve investigated terminology using one of these outcomes:

- **Synonym:** Multiple labels identify one concept. Select one canonical term and discourage alternatives when useful.
- **Separate concepts:** Similar language hides concepts with distinct identity, rules, ownership, or lifecycle. Name and define each concept independently.
- **Revised definition:** The term is useful, but its current definition is incomplete, misleading, or too broad.

State the selected outcome and why the evidence supports it.

## Edge-Case Coaching

Test proposed vocabulary with specific scenarios, especially where:

- two records share attributes but not identity;
- ownership changes during a lifecycle;
- one context consumes another context's representation;
- an alias appears accurate in common cases but fails at a boundary;
- code behavior and documented intent disagree.

Prefer short examples that expose a distinction over abstract lectures.
