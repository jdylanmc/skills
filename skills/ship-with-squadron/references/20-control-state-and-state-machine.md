---
includes: []
requires-skills: []
---

# Squadron Control State and State Machine

Squadron Control State is the only mutable store this skill may consult to
decide whether a claim, a deadline, or a merge is safe. It holds current state,
never history.

The Skill Run Log is separate, best effort, and evidence only. A recording
failure degrades evidence and delivery continues. A control-state failure
freezes claims and merges. Never authorize a claim or a merge from the Skill
Run Log, and never treat control state as a historical record.

## Durable Location

Resolve `git rev-parse --git-common-dir` and store local run state under:

`<git-common-dir>/ship-with-squadron/<run-id>/`

This keeps orchestration state durable across conversation loss and worktrees
without adding product files to the repository. Never store credentials,
tokens, raw secret-bearing logs, or private review content in control state.

Required files:

- `control.json`: canonical current state;
- `handoffs/<ticket-key>.md`: human-readable timeout handoffs.

Write atomically through a temporary sibling file and rename. After every
write, reread and schema-check the result. When a write is interrupted,
rebuild from the last verified `control.json` plus a fresh provider
reconciliation. Live provider state is authoritative for anything control
state cannot prove.

## Control-State Identity

Record:

- schema version and run ID;
- repository root, remote, provider, and default branch;
- root work-item provider key, URL, revision marker, and completion criteria;
- run start, pause, resume, and terminal timestamps;
- concurrency limit and deadline policy;
- startup capability matrix, role-enforcement mode, and human run/merge
  authorization;
- Primary and Coordinator runtime identifiers and heartbeat timestamps;
- graph digest and last provider reconciliation marker;
- the run context passed to Chronicle: run ID, root skill, and log path.

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

Use wall-clock timestamps with offsets and monotonic elapsed durations where
the runtime exposes them. Never derive active implementation time solely from
the difference between start and finish timestamps.

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

Reject impossible or skipped transitions and rebuild from control state plus
live provider state.

## Control-State Failure

If `control.json` cannot be read, written, or schema-checked:

1. stop claiming tickets and stop every merge;
2. report the failure to the user with the affected run and ticket keys;
3. resume only after control state is rebuilt and reconciled with the provider.

This is the opposite of a Chronicle recording failure, which never blocks
delivery.
