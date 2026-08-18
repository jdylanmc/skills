# Cycle Workflow

**Intended reader:** the agent executing a cycle.

One invocation runs one or more cycles. One completed cycle asks exactly one question group and produces exactly one published checkpoint and one outcome envelope. Five situations produce an envelope with **no** published checkpoint; each keeps its journal and any pending checkpoint candidate instead:

| No-checkpoint case | Where it is decided | Status |
| --- | --- | --- |
| Session-state drift underneath the attempt | Step 12, or the apply boundary in step 13b before anything is published | `CYCLE_ABORTED_STALE` |
| A root conflict on content this session owns | Step 12 root rule | `CYCLE_BLOCKED_ON_USER` |
| The node pinned by this cycle id comes back invalidated or orphaned on a restarted attempt, and its disposition is the user's | Step 12, after reinterpretation on a restart | `CYCLE_BLOCKED_ON_USER` |
| No usable drift detector, so the cycle runs strictly read-only | Step 12, unverified mode with no retained baseline, including every post-crash resume in that mode | `CYCLE_BLOCKED_ON_CAPABILITY` |
| **Any** failure before the final checkpoint is published - a failed read, a failed write, a failed verification, a lost unread node, a changed write-blocked file, a destroyed baseline, or an interrupted publication | Anywhere from step 1 through step 14 item 8 | `CYCLE_FAILED_STATE` |

A cycle that closes with a promotion previewed but not approved still publishes a checkpoint; the unapproved preview is not a failure.

If file editing is unavailable, no cycle starts at all: the loop cannot create the journal, so no cycle id is allocated and nothing on this list applies. Report `CYCLE_BLOCKED_ON_CAPABILITY` and offer a read-only summary.

Steps 1 through 15 are ordered and mandatory. A step may report "nothing to do", but it may not be skipped or reordered.

The lifecycle in one line: **stage everything -> recheck freshness -> run the domain handoff and the promotion gate -> persist once -> verify -> publish the checkpoint -> delete the journal -> reset context.**

Step 14 is the sole writer of discovery state: the session current-state files, tracker synchronization, the root map, the shared lexicon, and the checkpoint. Steps 1 through 13 write nothing durable except the named exceptions in invariant 21 of [Safeguards and recovery](./90-safeguards-and-recovery.md): the gated session-setup or state-root creation in step 0, the cycle journal and the `cycle-state: in-progress` marker created in step 1, and an approved prototype's writes inside its isolation path. Two composed skills write their own artifacts in step 13 - `/domain-mapping` writes the repository domain artifacts it owns, and `/discovery` writes the tracker - and neither of those is discovery state.

## 0. Bind the Session

Run once per invocation, before the first cycle.

1. Resolve the state root. Default: `docs/discovery/`. Use an alternate or local root only after `Approve state root change`, or when an existing composed-skill contract requires it, and record it as `state-root` in the session frontmatter. An alternate root changes only the prefix: the `sessions/<slug>/...` layout, file names, and `cycles/` and `cycles/.pending/` subtrees are identical beneath any root.
2. Read `discovery-map.md` and `domain-lexicon.md`. If the state root does not exist, preview the initial root files and the session package, then create them after `Approve session setup`.
3. Identify the anchored idea or file. Match it against existing sessions on the primary map by anchor path and normalized destination. Resume a match instead of creating a second session.
   - While matching, list the session directories under `<state-root>/sessions/` and compare them with the primary map's rows. **Report every session package that exists on disk but has no row on the primary map** - an orphan, usually left by a crash between creating a package and writing its map row, or by a hand-made directory. List the orphan slugs and their anchors in the bind report and in the cycle checkpoint's limitations. Do not adopt, repair, delete, or write a map row for an orphan on your own: relinking it is a state change the user decides, and binding to it as if it were mapped would hide the inconsistency. Binding to an explicitly named orphan is allowed once the user names it, and its map row is then written by step 14 under the ordinary root rules.
4. Read the session frontmatter and list `cycles/` and `cycles/.pending/`. If `cycle-state` is `in-progress` or `publishing`, or an orphaned journal or pending checkpoint candidate exists, run the interrupted-cycle recovery in [Safeguards and recovery](./90-safeguards-and-recovery.md) before starting a new cycle.
5. Resolve the question-group size `N` for this invocation as defined in [Interrogation groups](./50-interrogation-groups.md). An invocation override applies to every cycle of the invocation and is carried across each context reset in the carry-over handle.

## 1. Rehydrate Durable State and Open the Cycle

Read, in this order:

1. `discovery-map.md` (primary product mind map);
2. `domain-lexicon.md` (shared lexicon);
3. the session's `discovery.md`, `domain-model.md`, `requirements.md`, and `evidence.md`;
4. the most recent cycle checkpoint;
5. linked-session summaries from the primary map only - never another session's full tree.

Then:

6. Compute the entry state digest over the session current-state files and the latest checkpoint id, and the entry root-map and root-lexicon digests over items 1 and 2, exactly as specified in [Session package and state schema](./30-session-package-and-state.md). Record the digest tool and digest status. When `digest-status` is `unverified`, also retain the cycle-start content of the six comparison files - `discovery.md`, `domain-model.md`, `requirements.md`, `evidence.md`, `discovery-map.md`, and `domain-lexicon.md` - for the character-for-character comparisons in steps 12, 13b, and 14. If any of the six cannot be retained in full, this cycle has no drift detector: run it read-only under the rule in that reference and make no durable write.
7. Run the contract compatibility check in [Composition and ownership](./10-composition-and-ownership.md) and hold its `composition-report` for the checkpoint.
8. Determine `tracker-mode` for this cycle - `remote`, `local-only`, or `markdown-only` - from the compatibility report and the tracker contract, as defined in [Session package and state schema](./30-session-package-and-state.md). Record it in the journal; steps 13b and 14 use this value. Moving a session to a different mode than the one already recorded in the frontmatter requires `Approve tracker mode change`; a mode that degrades because a capability is missing is a degradation, not a mode change, and is reported rather than approved.
9. Allocate the cycle id under the allocation rule in [Safeguards and recovery](./90-safeguards-and-recovery.md).
10. Create `cycles/<cycle-id>.journal.md` with the opening block defined in [Session package and state schema](./30-session-package-and-state.md): cycle id, session, start time, `run-id`, entry state digest, entry root-map digest, entry root-lexicon digest, digest tool, digest status, `tracker-mode`, `question-group-size-in-effect: <N>`, `asked: 0`, `selection: pending`, and `domain-handoff-status: none`.
11. Set `cycle-state: in-progress` in the `discovery.md` frontmatter.

When this step is reached as a restart of an aborted or interrupted attempt, do not create a second journal and do not take a new cycle id: reopen the existing `cycles/<cycle-id>.journal.md`, increment its `attempt`, take a fresh `run-id`, refresh its entry digests to the values just computed, and keep its `asked`, `grounded-asked`, `follow-ups-asked`, recorded answers, `## Domain mapping handoff`, and `## Promotion outcome` sections. When the journal records `domain-handoff-status: completed`, reread the artifacts it names and do not invoke `/domain-mapping` again for the same `domain-handoff-key`; when it records `invoked` or `unknown`, reconcile that key before any retry, as defined in step 13a and [Safeguards and recovery](./90-safeguards-and-recovery.md).

The journal exists before any traversal begins, so an interruption at any later step is resumable. Nothing learned in an earlier conversation is authoritative unless it appears in the files read above.

When a required file is too large to read in full, apply the bounded-rehydration rule in [Session package and state schema](./30-session-package-and-state.md), record the unread scope in the journal, and carry the limitation into the checkpoint and the outcome envelope.

## 2. Read the Latest Anchor

Re-read the anchor idea statement or anchor file at its current revision. Record the observed revision in the journal. Compare it with `anchor-revision` in the session frontmatter and classify the anchor as `unchanged`, `revised`, or `unreachable`. Stage the classification as `anchor-status`; step 14 writes it.

## 3. Reinterpret the Complete Tree

Re-read every node in the selected session against the current anchor, even when the anchor is unchanged. Stage the results in memory and in the journal; write nothing yet.

For each node, stage `reinterpreted: <cycle-id>` and one verdict:

| Verdict | Meaning | Staged effect |
| --- | --- | --- |
| `intact` | The anchor still supports the node's outcome, evidence, and decisions. | No state change. |
| `weakened` | Part of the supporting evidence or framing no longer holds. | Lower maturity by exactly one level, with `vague` as the floor - a node already at `vague` stays at `vague` - and record the reason. If the new maturity is below `researched`, step 6 compares the node against **every** related lower-priority node currently at maturity `researched` or above, regardless of which cycle each of them reached that level in, and records a debt row for each unpaired match with `Cause: weakened <node-id>`. |
| `invalidated` | The anchor contradicts the node's outcome or a settled decision. | Set fog to `invalidated` from whatever state the node was in, including `cleared` and `promoted`, and queue the node for step 7 selection. |
| `orphaned` | The anchor no longer contains the node's subject. | Set fog to `invalidated`, keep the node, and record the removal in history. |

Never delete a node, decision, evidence entry, or lexicon term during reinterpretation. History is append-only; only current-state fields change. A promoted node whose verdict is `weakened` or worse keeps its tracker link, tier, and promotion key, and gains an explicit divergence note that step 13b presents and step 14 records.

When bounded rehydration limited the read, stamp verdicts only on nodes actually read, list the unread nodes as `not-reinterpreted-this-cycle`, and never describe the pass as a full reinterpretation.

## 4. Refresh the Lexicons

Apply [Domain Lexicon](./60-domain-lexicon.md): detect undefined, overloaded, conflicting, or drifting language in the anchor, tree, evidence, and last cycle's answers; add new language as `candidate`; mark conflicts; and queue material vocabulary for `/domain-mapping`. Lexicon refresh happens before branch text is interpreted for selection so questions and recommendations use confirmed language. All changes are staged; step 14 writes them.

## 5. Breadth-First Fog Scan

Walk the tree breadth-first from the root and produce a compact frontier table of every node that is not `cleared` or `promoted`, with its parent, fog state, maturity, priority, blocker count, dependent count, and open questions. This scan is the input to selection and to the priority-debt check; it is not a user-facing dump unless the user asks for the map.

## 6. Detect Priority and Maturity Debt

Apply the priority-maturity invariant and the debt add, update, and clear semantics in [Traversal, priority, and selection](./40-traversal-and-selection.md). Stage every change to the `Priority Debt` table with the offending node, the higher-priority node whose **maturity** it outran, the relation between them, and the detecting cycle.

## 7. Select the Highest-Value Item

Apply the deterministic ordering in [Traversal, priority, and selection](./40-traversal-and-selection.md) and select exactly one node. Record `selection-source` as `deterministic` in the journal, and update it to `user` if step 8 produces a redirect.

## 8. Recommend Broad or Deep

State a parameterized recommendation naming the selected nodes, the rule that chose them, and the reason. Never emit a fixed sentence with no node, rule, or reason in it.

- Broad: "We're going to go broad on `<parent or sibling set>` first, covering `<node ids and titles>`, because `<rule 6 and its reason>`."
- Deep: "I recommend we go deep on `<node-id> - <title>` because `<rule 1-5 and its reason>`."

The user may accept, redirect the node, or change the traversal mode. Record a redirect as `selection-source: user` and keep the deterministic recommendation in the checkpoint so the deferred debt stays visible.

If the user changes a node's priority **in this step**, recompute the whole `Priority Debt` table under [Traversal, priority, and selection](./40-traversal-and-selection.md) before the question group runs, restate the consequences and any change to the recommendation, and carry the recomputed table forward as a staged change for step 11.

## 9. Assess Evidence, Research, Domain, and Prototype Needs

Before framing questions, classify the selected node's open fog using [Research and prototypes](./70-research-and-prototypes.md): repository or documentation facts, user or product decisions, domain-modeling questions, feasibility research, prototype-only questions, and accepted unknowns. Gather read-only evidence first so the question group spends its budget on genuine decisions.

## 10. Run the Bounded Question Group

Run exactly one group under [Interrogation groups](./50-interrogation-groups.md). Append every question, recommendation, alternative, answer, and disposition to the journal as it happens, and increment `asked` in the journal after each question so an interruption cannot recharge the budget.

If the user changes a node's priority **during the group**, record the change in the journal immediately, do not interrupt the group, compute the debt consequences, report them in the group's closing summary, and stage the recomputed `Priority Debt` table in step 11. No debt table is written in this step.

## 11. Stage the Tree and Linked Artifact Updates

Apply the group's outcomes **to the staged state only**. This step writes no current-state file, no root file, and no tracker item. Every change below is held in memory and appended to the journal as a pending write:

- update node outcomes, fog states, maturity, priority, dependencies, and typed links;
- add newly visible fog as new nodes rather than hiding it inside an existing one;
- split an oversized node, merge duplicates, or invalidate an assumption when the answers require it;
- stage the recomputed `Priority Debt` table when a priority changed in step 8 or step 10;
- stage confirmed requirements, constraints, and exclusions for `requirements.md`;
- stage sources, research results, prototype outputs, and limitations for `evidence.md`;
- stage every lexicon and domain change this loop owns - the session lexicon, the shared lexicon rows for this session, and both sections of `domain-model.md` - and stage a **bounded handoff packet** for `/domain-mapping` when a vocabulary or boundary change is material. The packet is staged with its deterministic `domain-handoff-key` as defined in [Session package and state schema](./30-session-package-and-state.md). Do not invoke `/domain-mapping` in this step; step 13a owns that invocation;
- stage a proposed new linked session under the extraction gate in [Session package and state schema](./30-session-package-and-state.md). The proposal and its `Approve session extraction <slug>` approval happen here; the package, the map row, the typed links, and the parent pointer are written by step 14. **When `state-scope` is `partial`, an extraction is proposed and deferred, never executed** - and it is refused outright when any node to be moved, any node referencing one, or any node the branch references is on the journal's `## Unread scope` list. An approval given in a partial cycle is recorded as a standing intent for the next full-state cycle, and nothing is moved now.

A cycle that changes nothing must stage an explicit no-change outcome with its reason. That outcome is still persisted and checkpointed in step 14.

## 12. Stale-State and Root-Integrity Check

This check runs **once per cycle**, immediately before the first durable mutation of the cycle - before `/domain-mapping` is invoked in step 13a, before any tracker item is created or updated in step 13b, and before any step 14 write.

**With verified digests.** Recompute the entry state digest over the session current-state files and the latest checkpoint id, and the root-map and root-lexicon digests over the two root files, using the same specification as step 1.

**With `digest-status: unverified`.** Recompute nothing, and instead reread all six files in full and compare each one **character for character** with the content retained at cycle start: `discovery.md`, `domain-model.md`, `requirements.md`, `evidence.md`, `discovery-map.md`, and `domain-lexicon.md`. Apply the digest-control normalization to `discovery.md` before comparing, because `state-digest`, `root-map-digest`, `root-lexicon-digest`, `digest-tool`, `digest-status`, and `cycle-state` are this loop's own bookkeeping and a change in them is not third-party drift. Any other difference in the session files is drift; a difference in the root files is classified by the root rule below.

### A live user turn invalidates this check

The check is only as fresh as the last moment the loop held the floor. **Any live user turn after this check invalidates it**, because the user - or anything else running while they thought - may have written the same files. Before the **first** mutation that follows such a turn, re-run this same comparison against the same cycle-start baseline, in whichever step reaches the mutation first:

| Mutation about to happen | Re-run the check first when a live turn has occurred since the last check |
| --- | --- |
| Step 13a invokes `/domain-mapping`, which will write its own artifacts | Yes - and especially when its confirmation or Architecture Decision Record gate was answered in a live turn |
| Step 13b applies an approved promotion through `/discovery` | Yes - the approval itself is a live turn, so this recheck always runs |
| Step 14 item 1 writes the first session file | Yes - any redirect, answer, or approval taken after step 12 makes this mandatory |

Each re-run is the identical comparison: the same six files, the same cycle-start baseline, the same digest-control normalization, and the same classification of session drift versus root drift. It is always **pre-write**. Once any write of this cycle has begun, the comparison is never run again: from that point verification compares each file to the bytes this loop intended to write, and the cycle-start content is deliberately obsolete. Consecutive mutations with no intervening user turn need only the one check.

The root rebase is separate and always immediate: step 14 item 2 rereads and rebases the root files right before writing them because other sessions share them, not because it is looking for drift.

**When the comparison cannot be made.** In unverified mode the comparison depends on the retained cycle-start content of all six files. If that content was never retained, cannot be reread, or is incomplete - a resumed attempt after a crash, a truncated read, or `state-scope: partial` covering any of the six - this cycle has no drift detector and is **strictly read-only**. Apply the read-only rule in [Session package and state schema](./30-session-package-and-state.md): make no durable write and no mutation, do not invoke `/domain-mapping`, do not promote, keep the journal, publish no checkpoint, and report `CYCLE_BLOCKED_ON_CAPABILITY`. Never assume a match, and never continue in a reduced mode. The single way out is to establish a fresh usable six-file baseline in one pass and reconcile the journal against it; once that reconciles, the attempt rejoins this step normally.

### Session-state drift

A difference in `discovery.md`, `domain-model.md`, `requirements.md`, or `evidence.md`, or a changed latest-checkpoint id, means the durable state moved underneath this attempt:

1. discard every pending write, including any staged promotion approval;
2. emit the abort envelope with status `CYCLE_ABORTED_STALE`, recording `Changed underneath: session state`;
3. keep the journal and the same cycle id, and keep the unspent budget `N - asked` - an aborted attempt never recharges `asked` and never writes a checkpoint;
4. restart the cycle body at step 1 under the same cycle id, replaying the journal's recorded answers instead of re-asking them.

**The resumed attempt does not re-run selection.** The journal pins `selected-node` and the question group for this cycle id, so the restart rehydrates and reinterprets **that** node against the reread state; it does not choose a different node because the new state made one look more attractive. Only the answers recorded against the pinned node are replayed, and only onto that node.

If reinterpretation shows the pinned node is now `invalidated`, orphaned, or absent, its recorded answers are **not** reassigned to any other node. Append them to `evidence.md` as historical evidence, tagged with the pinned node id, the cycle id, and `superseded-by: state drift`, then choose one of exactly two dispositions with the user and report `CYCLE_BLOCKED_ON_USER` until they choose:

- **Continue this attempt** once the user says how the pinned node should be treated - reinstated, re-parented, or replaced by a named node. The cycle id, the journal, and the unspent budget `N - asked` all survive; the replayed answers apply only where the user directed them.
- **Close the aborted attempt.** The journal is retained as evidence, `cycle-state` stays `in-progress` for that id, no checkpoint is ever published for it, and the next cycle takes a fresh id under the allocation rule in [Session package and state schema](./30-session-package-and-state.md). A new cycle id starts a full budget of `N` with `asked: 0`; the previously spent questions stay counted in the retained journal and in `evidence.md`, and are never re-asked.

Aborting is only correct while nothing has been published. Once `/discovery` has created or updated any tracker item for this cycle, drift is no longer a stale abort: report `CYCLE_FAILED_STATE`, keep the journal with every applied identity recorded in it, and follow the post-apply rule in step 13b. Never emit an abort envelope claiming no items were published when items were published.

### Root drift

The root files are shared by every session in the state root, so another session writing them is normal traffic, not staleness. A root change is never a stale abort. Classify it by what changed:

| What changed in `discovery-map.md` or `domain-lexicon.md` | Response |
| --- | --- |
| Only rows this session does not own - another session's map row, its typed links, or a lexicon term this cycle did not touch | Rebase: reread both root files, replay this session's staged root changes onto the latest content, refresh `root-map-digest` and `root-lexicon-digest` in the journal, note the rebase, and continue the cycle. |
| This session's own map row or typed links, or a lexicon term this cycle also changed | Conflict: present both states, do not overwrite, and let the user decide. Report `CYCLE_BLOCKED_ON_USER`. |
| The root file is missing, unreadable, or schema-invalid | Corrupt-state entry in [Safeguards and recovery](./90-safeguards-and-recovery.md). Report `CYCLE_FAILED_STATE`. |

A conflict on owned content is a **no-checkpoint** outcome, not an abort: stop before step 13, run no `/domain-mapping` handoff, promote nothing, persist nothing, keep the journal and the same cycle id, leave `cycle-state: in-progress`, keep the unspent budget, and publish no checkpoint. The cycle resumes at step 12 under the same id once the user resolves the conflicting row or term. It is not `CYCLE_ABORTED_STALE`, because this session's own durable state did not move; the shared root did.

Rebasing after a root change never discards the question group, the staged session updates, or the spent budget.

## 13. Domain Handoff, Promotion Readiness, Preview, and Apply

Two things happen here, in this order, and both are deliberately after the freshness check. Neither writes discovery state: `/domain-mapping` writes only the repository domain artifacts it owns, and `/discovery` writes only the tracker.

### 13a. Domain Mapping handoff

1. If step 11 staged a bounded handoff packet, invoke `/domain-mapping` now, before the promotion gate, because unsettled material vocabulary can block promotion of the nodes that depend on it. If any live user turn has occurred since the step 12 check - including a turn spent answering this loop's own questions or `/domain-mapping`'s confirmation or Architecture Decision Record gate - re-run the step 12 comparison first, and re-run it again before any further invocation that will write. **At most one packet is handed off per cycle**, covering exactly one material term. When step 11 staged more than one material term, select the single packet deterministically:

   1. a term used by the node selected this cycle or by its direct children outranks a term that is not;
   2. then the term attached to the higher-priority node, using the priority order in [Traversal and selection](./40-traversal-and-selection.md);
   3. then the term with the greater dependency impact, counted as the number of distinct nodes whose typed links reference it;
   4. then the lexically smallest term, compared by Unicode code point on the normalized term string.

   Every other material term is recorded in the journal's pending handoff list with its own `domain-handoff-key`, stays `candidate` or `conflicted`, is disclosed in the checkpoint and the envelope, and is eligible for selection in a later cycle. The pending list is carried forward; a term leaves it only when its own handoff completes or the term stops being material.
2. `/domain-mapping` writes only its own canonical repository domain artifacts - the owning `CONTEXT.md`, a root `CONTEXT-MAP.md`, and an approved Architecture Decision Record (ADR) - at the locations named by `docs/agents/domain.md`. It never writes this loop's `domain-model.md`, `discovery.md`, `discovery-map.md`, or `domain-lexicon.md`. Those files are outside its scope, so no discovery state changes in this step and the step 12 comparison baseline stays valid for the rest of the cycle.
3. Before invoking, write the handoff record to the journal: the deterministic `domain-handoff-key` `<session-slug>/<cycle-id>/<packet-digest>` defined in [Session package and state schema](./30-session-package-and-state.md), the packet itself, and `domain-handoff-status: invoked`.
4. When it returns, record in the journal: `domain-handoff-status: completed`, the canonical artifact paths and identities it reports writing, what it confirmed, split, aliased, deprecated, or left conflicted, and the post-write per-file digest of each named artifact when digests can be computed. Reread each named artifact to confirm the reported outcome before recording it. If it reports no artifact path, reread the candidate locations from `docs/agents/domain.md`, record what was found, and mark `domain-handoff-status: unknown` when the outcome still cannot be established. **Handoff status never rolls back.** The order `none -> staged -> invoked -> completed` is monotonic; `pending` and `unknown` are terminal for the cycle that recorded them and are re-entered as `staged` only by a later cycle, under a new `domain-handoff-key`.
5. Nothing is mirrored into discovery state here. Step 14 mirrors only the explicitly confirmed results - and only those - into `domain-model.md`, the session lexicon, and the shared lexicon, each citing the canonical artifact.
6. If `/domain-mapping` is unavailable, is `available-changed`, cannot accept the packet, or would require a gate this loop does not own, do not self-abort and do not write a confirmed result yourself. Keep the term `candidate` or `conflicted`, record `domain-handoff-status: pending` with the reason, disclose it in the checkpoint and the envelope, and continue. Promotion is blocked only for a node whose readiness gate actually depends on the unsettled meaning; every other node stays eligible.

### 13b. Promotion

Evaluate the touched subtree against the readiness gate in [Promotion and tracker mapping](./80-promotion-and-tracker.md). A subtree that is not ready stays in Markdown; say so plainly and stage `promotion: not-ready`.

When it is ready, run that reference's preview, approval, stale-replay rejection, and apply sequence in full. `/discovery` performs every tracker refresh and every tracker mutation. Record the outcome as exactly one of `none`, `not-ready`, `previewed`, `applied`, `rejected-stale`, or `blocked`, and stage the resulting tracker links, tiers, and promotion keys for step 14. Nothing about the promotion is written to discovery state in this step.

**A previewed promotion does not survive the cycle.** If the cycle closes with `Promotion: previewed` because the user has not approved yet, the cycle still persists and publishes its checkpoint, and the journal is still deleted afterwards. No approval string, preview identity, or staged apply carries across the context reset. The carry-over handle records only that a promotion needs re-previewing; the next cycle rebuilds the canonical body from the state it rehydrates, derives a **fresh** identity, and asks for a fresh approval. An approval string quoted later that matches an identity from an earlier cycle is refused, and so is any identity not rendered in the current cycle.

Two rules make a crash during the apply survivable:

- After `/discovery` confirms each created or updated item, and before the next item is requested, append that item's node id, immutable promotion key, and tracker id and link to the journal's `## Promotion outcome` section. The journal is therefore never behind the tracker by more than one in-flight item.
- If drift is detected after the first item has been applied - by the pre-apply recheck of a later item, or by step 14 - stop applying, report `CYCLE_FAILED_STATE` with `Promotion: applied`, keep the journal with every applied identity in it, and hand the reconciliation to the resume rule in [Safeguards and recovery](./90-safeguards-and-recovery.md). Never report `rejected-stale` or "nothing was published" once anything was published.

### Two different stale events at the apply boundary

The approval arrives in a live user turn, so the pre-apply recheck can find two distinct things. They are not the same event and they do not share a status:

| What the recheck finds, before anything is published | Meaning | Response |
| --- | --- | --- |
| A session current-state file differs from its cycle-start content, or the latest-checkpoint id changed | A third party moved the durable state underneath this attempt | `CYCLE_ABORTED_STALE`. Discard the approval and every staged write, publish no checkpoint, keep the journal, the cycle id, and the unspent budget, and restart the cycle body under the step 12 abort rule. |
| The canonical preview body or its inputs differ from the journal copy while every session current-state file still matches its cycle-start content | This loop's own staged content moved between the preview and the apply | `promotion: rejected-stale`. Discard only the approval, show what changed, render a fresh preview with a fresh identity, and continue the same cycle - the staged session updates, the question group, and the budget all survive, and the cycle still publishes a checkpoint. |

A root difference at the apply boundary is classified by the step 12 root rule, not by either row above.

## 14. Persist and Publish the Checkpoint

This is the sole writer of discovery state. No checkpoint becomes immutable before the state it describes has been verified, so the checkpoint is rendered to a pending candidate first and published last. Perform the items in exactly this order:

1. **Write the session current-state files.** `discovery.md` (frontmatter, tree, active frontier, priority debt, session lexicon, tracker synchronization), both sections of `domain-model.md`, `requirements.md`, and `evidence.md`. When `state-scope` is `partial`, write only the sections and node blocks this cycle actually loaded and leave every unread node block byte-identical, as required by [Session package and state schema](./30-session-package-and-state.md); never re-render the tree from a partial in-memory view. Mirror into the confirmed sections only what step 13a recorded as explicitly confirmed, citing the canonical `/domain-mapping` artifact for each entry; everything else stays candidate or conflicted. Write every frontmatter field except the **values** of the digest-control block - `state-digest`, `root-map-digest`, `root-lexicon-digest`, `digest-tool`, `digest-status`, and `cycle-state` - whose keys are written now with their previous values, or with placeholders on a first write, and whose values items 6 and 9 set. When an extraction was approved **and this cycle's `state-scope` is `full`**, this item does exactly one part of it: **create the receiving package and verify it**, as a copy, with the moved branch still present in the parent. A partial cycle performs no part of an extraction. No root file is written in this item, and nothing is removed from the parent here. Items 2 and 2b finish the extraction in the order defined in [Session package and state schema](./30-session-package-and-state.md).
2. **Reread, rebase, and write the root files.** Immediately after item 1, reread `discovery-map.md` and `domain-lexicon.md` and rebase this session's row and its own lexicon rows onto the latest content so a concurrent session's write is not overwritten. Write this session's compact status, maturity, priority, active fog, blockers, and typed links, and the shared-lexicon rows this cycle added or changed. For an approved extraction, also write and verify, in this item: exactly one primary-map row for the receiving session; both typed session links - `supersedes-session` from the parent to the receiving session and `related-session` back - and the parent pointer that names the receiving session in the parent's own extraction record. The moved branch is still in the parent at the end of this item, so a crash here leaves a duplicated but fully linked branch, which is recoverable.
2b. **Only now, remove or move the extracted branch out of the parent, then reverify both packages.** Reread the parent session and the receiving session and confirm that the branch exists exactly once, that the map row and both typed links still resolve, and that the parent pointer still names the receiving session. This item runs only after item 2 verified. A failure here leaves the parent intact and is `CYCLE_FAILED_STATE`, never a silent partial move.
3. **Verify the session files and the owned root content.** Reread the files written in items 1, 2, and 2b. Verify every session file in full **against the bytes this loop intended to write** - not against the cycle-start content, which item 1 has deliberately superseded. When `state-scope` is `partial`, also verify preservation: every node id on the journal's `## Unread scope` list must still be present in `discovery.md` and still byte-identical to its recorded content. A missing, moved, or altered unread node is `CYCLE_FAILED_STATE` - name the node ids, keep the journal, and publish no checkpoint. Confirm that every write-blocked file listed on a `file:` line of `## Unread scope` is byte-identical to what was read at cycle start; a difference there is also `CYCLE_FAILED_STATE`. Verify in the root files only what this session owns: its own map row, its own typed links, and the lexicon rows this cycle wrote. Another session's rows may legitimately have changed between item 2 and this reread; that is not a verification failure. A conflict on owned content is handled by the root rule in step 12.
4. **Compute the exit digests over the freshly written files, as they are on disk.** Reread the four session current-state files and hash what is actually stored, not what was intended - an extraction changes the parent session again in item 2b, so the exit state digest must be computed after item 2b, over the parent files on disk, or the next cycle's entry digest will not match. The current cycle id is the checkpoint identity input and the digest-control block is normalized; no checkpoint content is ever hashed. The exit root-map and root-lexicon digests are the per-file digests of the root files as just verified in item 3.
5. **Render the checkpoint to its pending candidate path** `cycles/.pending/<cycle-id>.<run-id>.md`, then reread that file and verify its content. `run-id` is the invocation-scoped token recorded in the journal, so two runs can never write the same candidate. The final immutable path is not touched yet.
6. **Write the digest-control values** into the `discovery.md` frontmatter: `state-digest`, `root-map-digest`, and `root-lexicon-digest` from item 4, `digest-tool`, `digest-status`, and `cycle-state: publishing`. Only the values change; the keys and their line positions are already in place from item 1. Reread the file and recompute the state digest to prove reproducibility: every field in that block is normalized out, so the recomputed value must equal item 4's. A difference means the normalization or the write failed.
7. **Publish the checkpoint atomically.** Move the verified candidate from `cycles/.pending/<cycle-id>.<run-id>.md` to `cycles/<cycle-id>.md` with a single same-directory-tree rename. When rename is unavailable, write `cycles/<cycle-id>.md` from the verified candidate content, verify the final file byte for byte, and only then delete the candidate. Never publish a candidate that did not verify in item 5, and never overwrite an existing `cycles/<cycle-id>.md`: an existing final checkpoint for this id means the cycle already published, so reconcile under the resume rule instead.
8. **Reread the final checkpoint** at `cycles/<cycle-id>.md` and verify it matches the verified candidate.
9. **Set `cycle-state: complete`** in the digest-control block, then reread to confirm it. `cycle-state` is normalized out of every digest, so this write cannot change the value proved in item 6.
10. **Delete `cycles/<cycle-id>.journal.md`**, and delete the pending candidate if the item 7 fallback path left one behind. Nothing else is ever deleted.

If any write or verification fails, stop, keep the journal, keep any pending candidate, leave `cycle-state` at `in-progress` or `publishing`, report `CYCLE_FAILED_STATE`, and follow the recovery entry in [Safeguards and recovery](./90-safeguards-and-recovery.md). No final checkpoint is written for a cycle whose state writes did not verify, and no journal is deleted whose writes did not verify. If items were already published in step 13b, keep their identities in the retained journal so the resume can reconcile them instead of duplicating them.

## 15. Reset Context and Repeat

Emit the outcome envelope from [Safeguards and recovery](./90-safeguards-and-recovery.md), then discard conversational working context down to the carry-over handle:

```text
state-root, session-slug, next-cycle-id, last-checkpoint-id, state-digest,
root-map-digest, root-lexicon-digest, question-group-size-in-effect,
promotion-needs-re-preview (true or false),
pending user redirect, pending user answer that arrived after the group closed
```

Everything else is dropped. The next cycle begins at step 1 by rereading durable state. Do not carry unrecorded conclusions, unlogged answers, or remembered evidence across the reset. `question-group-size-in-effect` is carried so an invocation override survives the reset; it is not written to the session default unless the user asked to save it.

`promotion-needs-re-preview` is a bare flag and nothing more. No preview body, `preview-digest`, `preview-label`, or approval string is ever carried across a reset, because each of those binds to one cycle and one rendering. When the flag is true the next cycle rebuilds the preview from rehydrated state and asks for a fresh approval.

Continue cycles until the user explicitly exits, pauses, or hands off. An empty frontier is not an exit: reconcile the map, refine remaining fog into the next node, ask the user to resolve or accept remaining blockers, or present a fully cleared destination and wait.

## Daily Pause

On an explicit pause, complete step 14 for the current cycle, record incomplete research and unanswered questions, save the priority debt and the deterministic next frontier, and emit a resume instruction naming the state root, session, and next cycle id. A pause is not completion of the session.
