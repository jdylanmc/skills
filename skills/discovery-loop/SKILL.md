---
name: discovery-loop
description: Runs a durable, repeatable fog-of-war discovery loop that turns a vague idea or anchor file into an understood, prioritized, dependency-aware Branch-Story-Task backlog. Invoke to start, resume, or continue daily discovery cycles over a product area, epic, theme, or subsystem, with persisted Markdown state, a product-level mind map, a shared Domain Lexicon, bounded question groups, and approved promotion into the issue tracker. Do not invoke for a bounded interview, a one-time specification, routine ticket slicing, or implementation, and do not invoke for a single tracker-backed route-map or ticket-resolution pass - route that to /discovery.
allowed-tools: ["read", "search", "edit", "execute", "task"]
---

# Discovery Loop

Clear the fog around one anchored idea in durable, repeatable cycles. Every cycle rehydrates persisted state, opens a journal, reinterprets the tree from the latest anchor, asks one bounded question group, stages what changed, verifies the state is still current, runs the promotion gate, writes current state, verifies it, publishes one immutable checkpoint, discards conversational context, and starts again from durable state.

**Intended reader:** the agent executing a cycle. These references are the runtime authority for execution detail. [README.md](./README.md) explains the design intent and vocabulary for humans; when README and a reference disagree about *how* a step executes, the reference wins and the difference is reported. When they disagree about *intent*, README wins and the difference is reported.

## Required References

Read before the first cycle of an invocation, and follow them for every cycle:

1. [Composition and ownership](./references/10-composition-and-ownership.md)
2. [Cycle workflow](./references/20-cycle-workflow.md)
3. [Session package and state schema](./references/30-session-package-and-state.md)
4. [Traversal, priority, and selection](./references/40-traversal-and-selection.md)
5. [Interrogation groups](./references/50-interrogation-groups.md)
6. [Domain Lexicon](./references/60-domain-lexicon.md)
7. [Safeguards and recovery](./references/90-safeguards-and-recovery.md)

Read on demand, before the phase that needs them:

- [Research and prototypes](./references/70-research-and-prototypes.md) - before delegating research or proposing a prototype.
- [Promotion and tracker mapping](./references/80-promotion-and-tracker.md) - before the promotion-readiness check in step 13b of [Cycle workflow](./references/20-cycle-workflow.md).
- [Examples and scenario tests](./references/95-examples-and-scenario-tests.md) - when a situation is ambiguous or a behavior needs confirming.

## Core Workflow

1. **Bind the session.** Resolve or create the state root, primary mind map, and one session package for the anchored idea. Detect an interrupted cycle and resume it before starting a new one.
2. **Open the cycle.** Rehydrate the primary map, shared Domain Lexicon, session current state, and the latest anchor revision; compute the entry state, root-map, and root-lexicon digests; run the contract compatibility check; determine the tracker mode; create `cycles/<cycle-id>.journal.md`; and set `cycle-state: in-progress`. Persisted files, never conversation memory, are the canonical state.
3. **Reinterpret.** Re-read every node against the current anchor, stage the affected verdicts, and refresh both lexicons without deleting history.
4. **Select.** Run the breadth-first fog scan, detect priority and maturity debt, apply the deterministic ordering, then announce the parameterized broad or deep recommendation. The user may redirect.
5. **Interrogate.** Assess evidence, research, domain, and prototype needs first, then ask one bounded question group: at most `ceil(N / 2)` grounded questions and at most `floor(N / 2)` adaptive follow-ups, one at a time, each with a recommendation, one credible alternative or an explicit `none`, and freeform entry. Never exceed `N`.
6. **Stage.** Apply the group's outcomes to the in-memory tree and the journal only, including a bounded `/domain-mapping` handoff packet. No current-state file is written in this step.
7. **Check freshness immediately before the first mutation, and again after any live user turn.** Recompute the entry digests, including the root map and root lexicon, or compare the six files character for character when digests are unverified. A session-state difference aborts the attempt under the abort envelope, keeping the journal, the pinned node, and the unspent budget; a root difference is rebased and the cycle continues unless it touches this session's row or a term this cycle changed, which stops the cycle with no checkpoint and goes to the user. With no usable baseline, run the cycle read-only and write nothing. A live user turn invalidates the check: re-run the same comparison, against the same cycle-start baseline, before the `/domain-mapping` invocation, before the tracker apply, and before the first write of step 9. It is always pre-write and never runs once writing has begun.
8. **Hand off one domain packet, then promote only on exact approval.** Invoke `/domain-mapping` for the single staged handoff selected by the deterministic rule - it writes only its own `CONTEXT.md`, `CONTEXT-MAP.md`, or Architecture Decision Record - and journal its `domain-handoff-key`, artifacts, result, and the keys of any terms left pending. Then run the promotion-readiness gate, preview the Branch-Story-Task hierarchy with its digest over the canonical preview body, obtain the exact approval string, and apply it through the owning skills, recording each applied identity in the journal as it lands. A preview that is never approved does not survive the cycle; the next cycle re-previews with a fresh identity.
9. **Persist, then publish the checkpoint.** As the sole writer of discovery state, write the session files, then the root files - rebased on a fresh reread - then verify both against the bytes just intended, compute the exit digests, render the checkpoint to its pending candidate path and verify it, write the digest-control frontmatter and prove the digest reproduces, publish the candidate to its immutable path by rename, reread it, set `cycle-state: complete`, and only then delete the journal. An approved extraction runs inside these items in its own fixed order: create and verify the receiving package, then write and verify the map row, both typed session links, and the parent pointer, and only then remove the branch from the parent. A cycle whose `state-scope` is `partial` executes no part of an extraction and defers it, writes nothing to a `domain-model.md`, `requirements.md`, or `evidence.md` it could only read in part, and preserves every unread node block byte for byte.
10. **Reset and repeat.** Return the cycle outcome envelope, discard conversational context down to the carry-over handle, and rehydrate the next cycle. Continue until the user explicitly exits, pauses, or hands off.

Constraint: Orchestrate discovery and knowledge capture only. Do not implement the destination, emulate a missing mutating skill, bypass a composed skill's approval gate, publish speculative fog into the tracker, or treat silence, an empty frontier, or "looks good" as an exit.

## Tool Posture

This skill declares the narrowest complete set:

| Tool | Permitted use |
| --- | --- |
| `read`, `search` | Anchors, repository evidence, discovery state, tracker contracts, and composed-skill descriptions. |
| `edit` | This skill's own Markdown discovery package only, plus an approved prototype's declared isolation path. Deletion is limited to this skill's own journal after its cycle's writes verify, its own pending checkpoint candidate under `cycles/.pending/`, and the exact approved prototype isolation path. |
| `execute` | Digest computation, state-root and package creation, the atomic rename that publishes a verified pending checkpoint candidate to `cycles/<cycle-id>.md`, the three deletions named above, and the disposable prototype approved for its declared isolation path. |
| `task` | Read-only research subagents only. |

Rules:

1. No tracker command runs under this skill's `execute`. Every tracker read that a mutation depends on, every tracker state refresh, and every tracker mutation routes through `/discovery`.
2. Prototype edits and prototype execution are permitted only inside the exact isolation path named in an approved `Approve prototype <node-id>` proposal, and cleanup targets exactly that path. No production implementation runs under any name.
3. No broad, recursive, or pattern-based deletion runs under any tool. Only the three exact paths named above are ever deleted, one at a time, and a failed deletion is reported rather than retried more widely.
4. There is no wildcard grant. When a declared capability is unavailable, apply the capability degradation table in [Safeguards and recovery](./references/90-safeguards-and-recovery.md); never invent provider operations.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
