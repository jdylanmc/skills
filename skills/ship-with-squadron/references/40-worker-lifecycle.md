# Worker Lifecycle and Composed Skills

## Worker Launch Packet

Give every worker:

- repository instructions and exact isolated worktree;
- provider and ticket identity, complete body, acceptance criteria, blockers,
  and parent goal;
- branch, target branch, and base revision;
- allowed scope and explicit exclusions;
- existing test, build, lint, and formatting commands;
- implementation, initial-Roast, and total deadlines;
- Coordinator contact and ledger ticket key;
- paths to the official Roast This Code, Shepherd, and Handoff entry
  points;
- heartbeat and terminal-envelope schemas;
- the prohibition on merging, self-approval, policy bypass, and sibling work.

The worker must acknowledge the packet, verify the worktree, and emit
`WORKER_STARTED` before editing. The Coordinator persists the worker runtime
identifier, launch request, acknowledgement, and `WORKER_STARTED` event before
counting the worker as active.

Before launch, the Coordinator validates the packet against one fresh ledger
and provider snapshot. Reject a packet with a stale ticket or base revision,
wrong repository, conflicting deadlines, unresolved placeholder, unverified
command, missing exclusion, or unrecorded ownership. Before editing, the
worker echoes the ticket, repository, branch, base revision, deadlines, scope,
exclusions, and validation commands. A mismatch stops the worker.

## Phase 1: Implement and Open the Pull Request

Deadline: one hour from worker start.

The worker:

1. inspects the ticket and repository evidence;
2. makes the smallest complete implementation;
3. runs the narrowest existing validation that proves the acceptance criteria;
4. reviews the diff for scope and secrets;
5. commits and pushes;
6. opens one non-draft pull request linked to the ticket;
7. records the pull-request head and implementation evidence;
8. closes the implementation phase attempt with its exact outcome.

The pull request must exist by the implementation deadline. A draft, local
branch, unpushed commit, or unverified partial implementation does not satisfy
the milestone.

## Phase 2: Initial Roast and Correction

Deadline: two hours from worker start.

Invoke the installed `/roast-this-code` skill against the exact pull-request
head. Do not replace it with an ordinary review or a hand-written reviewer
prompt.

Before invocation, allocate a new Roast phase attempt and persist
`ROAST_REQUESTED` with the ticket, pull request, exact source head, target
head, worker runtime identifier, and request timestamp. Persist
`ROAST_STARTED` only after the official workflow reports that execution began.
As it returns progress, persist the review fields defined in the forensic
evidence reference. Never reduce missing progress to a generic `ROASTING`
state.

The worker consumes the Roast recommendation:

- every `Must fix` blocks progress;
- every `Should fix` requires implementation or a recorded evidence-based
  disposition consistent with repository policy;
- `Consider` items are recorded but do not block unless repository policy
  promotes them.

After any correction push:

1. invalidate the old Roast package;
2. rerun targeted validation;
3. invoke Roast This Code against the new exact head;
4. continue until no blocking finding remains.

Close each Roast attempt with one review outcome. Record
`CONSENSUS_REACHED` only when the official Roastmaster returns a canonical
recommendation. Use `DISAGREEMENT`, `INCOMPLETE`, or `FAILED` when applicable;
do not infer consensus from elapsed time, reviewer count, or worker silence.
Track later invalidation in the separate evidence-validity field.

The initial Roast gate must pass by the two-hour deadline. Reviewer
unavailability, invalid evidence, unresolved disagreement, or an uncorrected
blocking finding does not pause the deadline.

## Phase 3: Shepherd

Deadline: six hours from worker start.

Invoke the installed `/shepherd` skill on the already-open pull request with
the remaining total budget. Pass the worker's six-hour total deadline as
Shepherd's caller deadline. Preserve Shepherd's one-pull-request scope,
operating states, and terminal outcomes.

The worker:

- lets Shepherd fix required checks and actionable review feedback;
- reports `HUMAN_DECISION_REQUIRED`, `EXTERNAL_BLOCKER`, or `UNWRITABLE`
  immediately to the Coordinator;
- treats every Shepherd push as invalidating prior Roast and validation
  evidence;
- reruns the exact-head Roast gate after any Shepherd mutation;
- returns `MERGE_READY` only when both Shepherd readiness and this package's
  exact-head Roast gate agree on the same source revision.

Shepherd never merges. `MERGE_READY` is a status transition, not a worker
terminal outcome. The worker enters `AWAITING_MERGE`, remains available, and
watches for merge confirmation or evidence invalidation. If the source or
target changes, the same worker rebuilds the required Roast or Shepherd
evidence within the original total deadline.

## Heartbeats

Emit a heartbeat at every phase transition and at least every five minutes
while active. Include:

- ticket and worker identity;
- phase and state;
- current head and pull-request URL when available;
- active and wall-clock elapsed time;
- remaining milestone and total budget;
- validation, Roast, check, and review summary;
- current phase-attempt ID and last durable phase event;
- blocker signature;
- next action.

A heartbeat is status evidence, not permission to exceed a deadline.

## Worker Terminal Envelope

Return exactly one:

- `MERGED`
- `TIMED_OUT`
- `HUMAN_DECISION_REQUIRED`
- `EXTERNAL_BLOCKER`
- `UNWRITABLE`
- `FAILED`
- `CANCELLED`

Include the ticket, branch, pull request, exact head, completed changes,
validation, Roast state, Shepherd state, remaining blockers, handoff path when
applicable, and recommended Coordinator action.
