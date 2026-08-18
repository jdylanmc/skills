# Backlog Hydration and Scheduling

## Build the Graph

Hydrate the complete tracker-backed subtree below the root. Use provider-native
parent and dependency relationships. Where the repository's tracker contract
defines a fallback relationship, parse only that canonical fallback.

For each descendant, determine:

- whether it is an implementation ticket or a planning/container item;
- whether its acceptance criteria are executable;
- whether it is already complete, actively owned, or linked to an open pull
  request;
- its open blockers;
- repository and component overlap with other ready work;
- whether it changes a shared contract that dependent work must consume.

Do not treat tracker order as dependency order. Do not infer parallel safety
from different titles alone.

## Ready Frontier

A ticket is ready only when:

- it is open and approved for implementation;
- every required blocker is complete;
- no live worker, assignee, branch, or pull request already owns it;
- its acceptance criteria fit one worker's bounded outcome;
- repository instructions do not require a missing human decision;
- running it concurrently will not create an uncoordinated shared-contract or
  same-file conflict.

Prefer tracer-bullet slices that deliver independently verifiable behavior.
Schedule contract-establishing work before consumers. Serialize overlapping
schema, migration, generated-file, public-interface, and wide-refactor work
unless the ticket graph explicitly provides an expand-contract lane.

## Aggressive Refill

Default concurrency is six workers.

Whenever a worker reaches a terminal state, a merge lands, a blocker closes, a
new dependency appears, or a ticket is split:

1. refresh provider state;
2. recompute blockers and conflict lanes;
3. sort the ready frontier deterministically;
4. claim as many safe tickets as capacity allows;
5. launch fresh workers immediately;
6. persist the new graph and report the change upward.

Do not wait for all active workers to finish before refilling an open lane.

## Deterministic Ordering

Within the ready frontier, prefer:

1. blockers that unlock the most descendants;
2. contract-establishing tracer bullets;
3. smallest complete independently verifiable outcomes;
4. oldest provider order;
5. stable provider key as the final tie-breaker.

The Coordinator may choose fewer than six concurrent workers when evidence
shows overlap, provider rate limits, build-resource contention, or a serial
contract boundary. Record the reason; unused capacity without a reason is a
health finding.

## Claim Protocol

Before launch:

1. refresh the ticket and graph revision;
2. verify it remains ready and unowned;
3. claim through the repository's configured assignment or ready-state
   mechanism;
4. create a unique branch and isolated worktree from the current target head;
5. persist the claim, deadlines, branch, worktree, and base revision;
6. launch the worker with the exact ticket and no sibling scope.

If provider-native claiming is unavailable, use the repository's documented
fallback plus the ledger's compare-and-set transition. Never create two
workers for one ticket.

## Backlog Exhaustion

The backlog is exhausted only when a fresh reconciliation proves:

- the root outcome is complete;
- every required implementation descendant is complete or merged;
- no required descendant is blocked, timed out, splitting, or awaiting merge;
- no approved child was omitted from the hydrated graph;
- linked pull requests and tracker states agree.

An empty ready frontier with active, blocked, failed, or undiscovered work is
not completion.
