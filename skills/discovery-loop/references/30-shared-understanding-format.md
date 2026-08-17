# Shared Understanding Format

Maintain one living Shared Understanding per Destination. It is a low-resolution index, not a duplicate decision store or implementation specification.

## Persistence Target

Use one remote tracker item titled `Shared Understanding - <Destination>` related to the canonical Discovery map. Locate it by normalized title plus its map link; do not require or invent a label. Create and update it through the provider operations defined in `docs/agents/issue-tracker.md`.

When the repository is in the explicitly confirmed local-only Discovery fallback, use exactly:

```text
.scratch/<normalized-destination>/shared-understanding.md
```

Do not switch between remote and local persistence during a loop without explicit user approval. When an existing matching artifact is found, resume it.

```markdown
# Shared Understanding - <Destination>

## Destination

<End state and observable success conditions.>

## Current Understanding

<Succinct statement of the problem, intended outcome, confirmed constraints, and present confidence.>

## Domain Vernacular

- [<Confirmed term or bounded context>](<domain artifact link>) - <one-line meaning>

## Decisions and Branch Specifications

- [<Clear branch>](<specification link>) - <one-line settled outcome>
  - Decisions: <linked decision or Architecture Decision Record titles>
  - Evidence: <linked research or prototype titles>

## Delivery Map

1. [<Ticket title>](<link>) - <observable outcome>
2. [<Ticket title>](<link>) - <observable outcome>; blocked by <linked title>

### Safe Parallel Lanes

- Lane A: <linked tickets that can proceed concurrently and why>
- Lane B: <linked tickets that can proceed concurrently and why>

## Remaining Fog

- <Unresolved branch, blocker, accepted unknown, or research limitation>

## Out of Scope

- <Explicit exclusion>
```

## Content Rules

- Link to the Discovery map, branch specifications, domain artifacts, decisions, prototypes, evidence, and tickets. Do not copy their detailed contents.
- Use human-readable linked titles; reserve identifiers for provider operations.
- Include only confirmed facts and decisions in Current Understanding.
- Label delegated judgments, inferences, assumptions, accepted unknowns, and blockers explicitly.
- List a ticket in a parallel lane only when its open dependencies are satisfied and it does not contend for the same exclusive decision, artifact, or migration stage.
- Keep ticket ordering dependency-valid. Prefer a topological order with deterministic tracker ordering as the tie-breaker.
- Keep prose succinct. Detail belongs in the linked owning artifact.

## Update Gate

Before each create or update:

1. search for the normalized Destination and detect an existing Shared Understanding;
2. refresh every linked source and the current target;
3. preview the complete resulting document, create-versus-update target, links, ticket order, and parallel lanes;
4. offer `Approve understanding update`, `Revise`, or `Cancel`;
5. write only after exact approval;
6. reread and verify the content and links.

Preserve unrelated discussion or provider metadata with read-modify-write semantics. Never treat approval from Discovery, Domain Mapping, or Spec as approval for this update.

## Exit State

On explicit exit, present the verified Shared Understanding as final for this loop run. "Final" means the latest agreed understanding, not that the epic is complete or every unknown is resolved.
