# Architecture Map Output Contract

Return the relevant sections in this order. Always include **Scope and Orientation**, **Main Execution and Data Flow**, **Constraints, Risks, and Unknowns**, and **Evidence Index**. Include the remaining sections only when the target has meaningful evidence for them. At symbol or single-flow depth, related module, caller, and test-seam details may be folded into the flow narrative, and the diagram may be omitted when there is no multi-stage path. Do not pad a focused map with repository-wide inventory.

## Scope and Orientation

State what was mapped, the selected depth, and the larger runtime or domain context that contains it.

## Architecture at a Glance

Provide a compact text diagram showing the primary control or data path. Use project domain vocabulary and real module or symbol names.

```text
[entry or caller] -> [orchestration] -> [domain behavior] -> [state or integration] -> [result]
```

Represent asynchronous boundaries, process boundaries, or fan-out explicitly when they matter.

## Modules and Responsibilities

Use a table:

| Module or boundary | Responsibility | Called by or entered from | Calls or depends on | Evidence |
| --- | --- | --- | --- | --- |

Include only modules needed to explain the target. State ownership boundaries and dependency direction.

## Main Execution and Data Flow

Walk the representative flow step by step from entry to result. Include:

- dispatch and orchestration;
- data transformations;
- state reads and writes;
- external or process boundaries;
- significant error, fallback, or asynchronous paths.

## Callers and Consumers

List the important direct and indirect consumers that establish why the target exists. Distinguish production callers from tests, tooling, and registration or configuration references.

## Test Seams

Identify the highest existing seams that verify behavior and point to representative tests. Explain what each seam observes without prescribing new tests unless asked.

## Constraints, Risks, and Unknowns

Separate:

- verified architectural constraints;
- evidence-backed risks that affect understanding or change safety;
- intent-versus-implementation divergences;
- unknowns that could materially change the map.

Do not turn ordinary complexity or personal preference into a risk.

## Recommended Reading Order

Provide a short numbered tour through the most useful files or symbols.

## Evidence Index

List the concrete paths, symbols, configuration, tests, and relationship queries that support the map. Avoid bare paths without explaining what each item proves. Never reproduce secret, credential, token, connection-string, or personal-data values; cite the path and configuration key and describe the mechanism instead.

## Optional Follow-Up

Suggest only the next useful zoom level or unresolved relationship. Do not offer implementation work unless the user asked for it.
