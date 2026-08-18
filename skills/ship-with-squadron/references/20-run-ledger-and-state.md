# Run Ledger and State Machine

## Durable Location

Resolve `git rev-parse --git-common-dir` and store local run state under:

`<git-common-dir>/ship-with-squadron/<run-id>/`

This keeps orchestration state durable across conversation loss and worktrees
without adding product files to the repository. Never store credentials,
tokens, raw secret-bearing logs, or private review content in the ledger.

Required files:

- `ledger.json`: canonical current state;
- `events.jsonl`: append-only transition and heartbeat events;
- `handoffs/<ticket-key>.md`: human-readable timeout handoffs;
- `snapshots/<timestamp>.json`: bounded reconciliation checkpoints.

Write atomically through a temporary sibling file and rename. After every
write, reread and schema-check the result. The append-only event log is the
recovery source when a current-state write is interrupted.

## Ledger Identity

Record:

- schema version and run ID;
- repository root, remote, provider, and default branch;
- root work-item provider key, URL, revision marker, and completion criteria;
- run start, pause, resume, and terminal timestamps;
- concurrency limit and deadline policy;
- startup capability matrix, role-enforcement mode, and human run/merge
  authorization;
- Primary and Coordinator runtime identifiers and heartbeat timestamps;
- graph digest and last provider reconciliation marker.

For every ticket record:

- provider key, URL, parent, blockers, descendants, and tracker revision;
- title, acceptance criteria digest, and repository scope;
- current state and state reason;
- claim owner, generation, attempt, branch, worktree, and base revision;
- implementation, initial-Roast, and total deadlines;
- last heartbeat, active-time counters, and suspension intervals;
- pull-request ID, URL, source and target revisions;
- validation summary;
- Roast evidence-packet ID, recommendation status, reviewed head, and
  unresolved `Must fix` findings;
- Shepherd terminal outcome and guarded snapshot marker;
- merge authorization actor, expected head, merge commit, and timestamp;
- timeout handoff path and replacement child keys.

## Ticket States

Use only these states:

- `BLOCKED`
- `READY`
- `CLAIMED`
- `IMPLEMENTING`
- `PR_OPEN`
- `ROASTING`
- `CORRECTING`
- `SHEPHERDING`
- `MERGE_READY`
- `AWAITING_MERGE`
- `MERGING`
- `MERGED`
- `TIMED_OUT`
- `SPLITTING`
- `SUPERSEDED`
- `HUMAN_DECISION_REQUIRED`
- `EXTERNAL_BLOCKER`
- `FAILED`
- `CANCELLED`

Fleet idleness is an observation, not a ticket or run terminal state.

## Required Events

Append events for:

- run started, resumed, paused, stopped, or completed;
- Coordinator launched, heartbeat, stale, failed, or replaced;
- graph reconciled or changed;
- ticket claimed or released;
- worker launched, heartbeat, suspended, resumed, or terminated;
- implementation completed;
- pull request opened or head changed;
- Roast started, invalidated, approved, or rejected;
- Shepherd started or returned a terminal outcome;
- deadline reached;
- handoff accepted;
- split children created and wired;
- merge authorized, attempted, succeeded, or failed;
- external provider mutation detected.

Use wall-clock timestamps with offsets and monotonic elapsed durations where
the runtime exposes them. Never derive active implementation time solely from
the difference between start and finish timestamps.

## Transition Rules

- Claim with a provider-fresh compare-and-set operation when supported.
- A worker can mutate only its claimed ticket record.
- Any pull-request head change invalidates prior Roast approval, validation
  tied to the old head, and merge authorization.
- `MERGE_READY` requires the complete gate in the merge reference and
  immediately transitions to `AWAITING_MERGE` while the worker remains
  assigned.
- A head or target change from `AWAITING_MERGE` returns the same worker to
  `ROASTING` or `SHEPHERDING` as required by the invalidated evidence.
- `MERGED` requires provider confirmation, not a successful local command
  alone.
- `TIMED_OUT` is immutable for that worker attempt.
- `SUPERSEDED` requires exactly two recorded recovery children or an explicit
  human-decision blocker.
- Run completion requires a fresh root-graph reconciliation.

Reject impossible or skipped transitions and rebuild from events plus live
provider state.
