---
name: ship-with-squadron
description: Orchestrates a durable, coordinator-led implementation fleet from one root GitHub or Azure DevOps work item until its dependency-aware backlog is shipped. Use when Discovery Loop or Breakdown to Tickets has produced an approved root outcome and the user wants aggressive parallel implementation, exact-head adversarial review, pull-request shepherding, guarded squash merges, timeout handoffs, and executive fleet reporting. Do not use for discovery, ticket drafting, one pull request, status-only monitoring, or work without an approved tracker-backed backlog.
allowed-tools: ["*"]
includes: ["_base/_molecules/chronicler.md","ship-with-squadron/references/10-roles-and-prerequisites.md","ship-with-squadron/references/20-control-state-and-state-machine.md","ship-with-squadron/references/25-run-recording.md","ship-with-squadron/references/30-backlog-and-scheduling.md","ship-with-squadron/references/40-worker-lifecycle.md","ship-with-squadron/references/50-review-and-merge-gate.md","ship-with-squadron/references/60-timeout-handoff-and-splitting.md","ship-with-squadron/references/70-health-reporting-and-recovery.md","ship-with-squadron/references/90-safeguards-and-scenarios.md"]
requires-skills: [{"id":"handoff","source":"external","required":true},{"id":"roast-this-code","source":"local","required":true},{"id":"shepherd","source":"local","required":true}]
---

# Ship with Squadron

Turn one approved root work item into a continuously replenished implementation
fleet. The current conversational agent becomes the Primary: it stays
user-facing, reports squadron health every minute, and performs only authorized
merge-gate actions. A dedicated Coordinator owns planning, delegation,
persistence, recovery, and backlog completion. Workers implement and shepherd
exactly one bounded ticket each, but never merge.

## External Prerequisite

Require the separately installed `/handoff` skill before launching workers.
This repository does not ship it. If it is unavailable, stop with that exact
missing prerequisite; do not substitute the timeout envelope for the required
human-readable handoff.

## Required References

Read and follow these files in order:

1. [Roles, authority, and prerequisites](./references/10-roles-and-prerequisites.md)
2. [Squadron Control State and state machine](./references/20-control-state-and-state-machine.md)
3. [Run recording](./references/25-run-recording.md)
4. [Backlog hydration and scheduling](./references/30-backlog-and-scheduling.md)
5. [Worker lifecycle and composed skills](./references/40-worker-lifecycle.md)
6. [Review and merge gate](./references/50-review-and-merge-gate.md)
7. [Timeout handoff and recursive splitting](./references/60-timeout-handoff-and-splitting.md)
8. [Health, reporting, and recovery](./references/70-health-reporting-and-recovery.md)
9. [Safeguards, errors, and scenario tests](./references/90-safeguards-and-scenarios.md)
10. [Chronicler recording molecule](../_base/_molecules/chronicler.md)

## Human-Facing Output Contract

Keep independently consumed outputs fit for their reader:

- executive reports help the user decide whether the squadron is healthy or
  needs intervention;
- worker packets give one implementation agent an executable assignment;
- timeout handoffs let the Coordinator preserve work and safely re-delegate;
- merge records let an authorized actor prove why one exact head can merge;
- recovery reports let a fresh Primary or Coordinator resume without duplicate
  work.

Preserve provider identifiers, branch names, revisions, commands, check names,
and composed-skill terminal outcomes exactly. Use `Roast recommendation` for
the canonical Roastmaster result, `exact-head Roast gate` for this package's
authorization condition, and `SHIP_READY_MONITORING` for Shepherd's nonterminal readiness state. Define
unfamiliar abbreviations in every output that can be
read independently; never invent an expansion.

## Core Workflow

1. Resolve the repository, provider, approved root work item, and its complete
   descendant graph. Verify required provider and runtime capabilities, then
   obtain the user's explicit run and guarded-merge authorization. Refuse
   speculative or unapproved backlog creation.
2. Create or resume the durable Squadron Control State. Reconcile it with live
   tracker, branch, pull-request, review, and check state before starting
   agents. Create the Chronicle run context once and record that the run
   started.
3. Arm a one-minute Primary status loop and launch exactly one long-lived
   Coordinator. The Primary does not implement tickets or directly supervise
   workers.
4. Have the Coordinator compute the ready frontier from native dependencies,
   claim tickets atomically, and keep up to six independent workers active
   while eligible work exists.
5. Give each worker one ticket, an isolated branch and worktree, and a
   six-hour total budget: one hour to implement and open a pull request, one
   additional hour to complete the initial `/roast-this-code` correction loop,
   and four additional hours to `/shepherd` the pull request.
6. Keep workers assigned after `SHIP_READY_MONITORING` so they can react to invalidated
   evidence until the pull request merges or the first applicable deadline
   fires. Workers never merge. On timeout, they stop and drain the Shepherd
   schedule, return the structured handoff, and terminate.
7. Let only the user, Primary, or Coordinator perform an exact-head-protected
   squash merge after the full merge gate passes.
8. After every merge, timeout, split, external change, or terminal worker
   result, recompute the root graph and refill the ready frontier.
9. Stop only when the root outcome and every required descendant are complete,
   or when an explicit human decision or external blocker makes further safe
   progress impossible.

Constraint: This skill implements an already-approved backlog. It does not
perform product discovery, silently reslice healthy tickets, bypass provider
policy, let workers merge, reuse stale review evidence, weaken checks, or claim
completion because the fleet is idle.

## Human-Facing Content Gate

Before publishing or acting on an executive report, worker packet, handoff,
merge authorization, recovery instruction, or final report:

1. verify every fact against the named fresh control state or provider snapshot;
2. preserve exact identifiers, values, commands, qualifiers, and timestamps;
3. distinguish observed state from recommendation;
4. reject stale heads, unsupported completion claims, unresolved placeholders,
   ambiguous actors, omitted blockers, and missing preservation warnings;
5. place warnings before the actions they govern;
6. ensure the intended reader can observe the stated success condition.

## Tool Posture

The wildcard grant is intentional because the Coordinator must adapt to
GitHub or Azure DevOps, create isolated worktrees, invoke task agents, arm
runtime timers, read and update tracker state, compose installed skills, and
perform guarded merges. Apply the role-specific capability profiles in the
role reference. Record whether the runtime enforces them technically or only
through prompts and control-state validation. Every use remains bounded by the role
and mutation rules in the required references.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
