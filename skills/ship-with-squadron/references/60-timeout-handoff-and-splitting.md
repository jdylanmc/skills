---
includes: []
requires-skills: []
---

# Timeout Handoff and Recursive Splitting

## Deadline Semantics

Set all deadlines when the worker starts:

- implementation deadline: `start + 1 hour`;
- initial-Roast deadline: `start + 2 hours`;
- total deadline: `start + 6 hours`.

The Coordinator, not the worker, is the deadline authority. Use a monotonic
clock when available. Machine suspension and provider waiting remain visible
wall-clock events and do not silently extend the budget. Only the user may
grant an explicit extension, and control state must record it.

Timeout applies at the next observation opportunity when:

- no non-draft pull request exists at one hour;
- the initial exact-head Roast gate has not passed at two hours;
- the pull request has not merged by six hours.

Enforcement latency is bounded by the active Shepherd observation interval:
at most five minutes in ship-ready monitoring and at most one minute while a
resolvable blocker or required pending signal is active.

At six hours, even an unmerged pull request that satisfies Shepherd readiness
times out because the delivery did not ship within its allocation.

## Immediate Worker Handoff

When a deadline fires, the worker stops implementation, correction, polling,
and shepherding. It must not perform "one last fix." If Shepherd owns a
schedule, stop it and verify runtime drain before returning the handoff. If
drain cannot be proven, return `EXTERNAL_BLOCKER` with the schedule identifier
and do not launch a replacement worker against that pull request.

Invoke the installed `/handoff` skill using its canonical sections. Also
return the machine-readable timeout envelope below. If Handoff becomes
unavailable after it was confirmed at run start, preserve the envelope, report
the prerequisite failure, and stop the worker.

Required human-readable content:

# Handoff

## Goal

## Current Progress

## What Worked

## What Didn't Work

## Next Steps

The first content under `Current Progress` must be a preservation-status block.
It identifies dirty or unpushed state, protected branches, worktrees and paths,
prohibited cleanup or overwrite actions, and the checkpoint required before
recovery. No reader may act on `Next Steps` before reading that block.

Then include:

- ticket and parent outcome;
- branch, worktree, pull request, base, and current head;
- commits and files changed;
- implemented and unimplemented acceptance criteria;
- commands and exact validation results;
- every Roast finding and its disposition;
- Shepherd actions, check failures, review feedback, and unresolved threads;
- failed approaches and why they failed;
- current blockers and recommended decomposition seam;
- dirty or unpushed state and explicit do-not-touch constraints.

The worker writes the handoff, returns `TIMED_OUT`, and terminates. The
Coordinator must not reactivate that worker.

## Timeout Envelope

Record:

- deadline type and timestamps;
- active and wall-clock durations by phase;
- last heartbeat and worker health;
- artifact and handoff paths;
- provider revisions;
- completed outcome;
- remaining outcome;
- evidence and feedback record;
- recommended split seam;
- preservation requirements.

## Coordinator Acceptance

The Coordinator:

1. verifies the handoff against live branch, pull-request, and tracker state;
2. snapshots or preserves unfinished work without merging it;
3. marks the attempt `TIMED_OUT`;
4. identifies the remaining independently deliverable outcome;
5. if the exact-head merge gate still passes, performs the guarded merge
   rather than duplicating completed implementation;
6. otherwise verifies that every prior Shepherd schedule is stopped and
   drained, then decomposes the remaining outcome into exactly two
   independently deliverable end-to-end slices;
7. gives each child independent acceptance criteria and validation;
8. wires native parent and dependency relationships;
9. marks the original ticket `SUPERSEDED` only after both children exist and
   the graph verifies;
10. launches fresh workers when each child reaches the ready frontier.

Each recovery child receives a new six-hour budget. Do not transfer elapsed time,
review approval, or Shepherd readiness from the failed attempt.

## Split Quality Bar

The two children must:

- together cover the remaining required outcome without overlap or omission;
- each deliver independently verifiable value or a necessary
  contract-establishing slice;
- preserve already-valid work when safe;
- declare ordering when one establishes a contract for the other;
- be materially smaller than the timed-out remainder;
- avoid assigning two workers to the same mutable branch.

Do not split by arbitrary file count, test versus implementation, or "first
half/second half" without an executable boundary.

If two coherent smaller slices cannot be formed, repeated splitting reaches an
atomic outcome, the handoff is incomplete, or product intent must change, set
`HUMAN_DECISION_REQUIRED` and escalate. Never fabricate a split to keep the
fleet visually busy.
