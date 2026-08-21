---
includes: []
requires-skills: []
---
# Session Package and State Schema

**Intended reader:** the agent executing a cycle.

Durable Markdown is the canonical state. Conversation memory never is.

## Layout

```text
docs/discovery/
├── discovery-map.md
├── domain-lexicon.md
└── sessions/
    └── <destination-slug>/
        ├── discovery.md
        ├── domain-model.md
        ├── requirements.md
        ├── evidence.md
        └── cycles/
            ├── <cycle-id>.md
            ├── <cycle-id>.journal.md
            └── .pending/
                └── <cycle-id>.<run-id>.md
```

`<destination-slug>` is the normalized destination in lowercase kebab case.

`cycles/<cycle-id>.md` is the published, immutable checkpoint. It exists only after the state it describes has been written and verified, because step 14 renders the checkpoint to `cycles/.pending/<cycle-id>.<run-id>.md` first and publishes it by rename. Once published it is never rewritten.

`cycles/<cycle-id>.journal.md` is the append-only working journal for the in-flight cycle; it is deleted only after every write of step 14 verifies. `cycles/.pending/` holds checkpoint candidates for in-flight or failed runs and is the only other transient location.

**Pending candidate lifecycle.** `run-id` is an invocation-scoped token - a timestamp, or a random token when a clock is unavailable - recorded in the journal at step 1, so two runs never collide on one candidate path. A candidate is deleted by the run that published it. At bind time, reconcile any candidate found:

| Candidate state at bind time | Action |
| --- | --- |
| Its `cycles/<cycle-id>.md` exists and verifies | The cycle published. Delete the candidate. |
| No final checkpoint, and the cycle's journal exists | Resume that cycle. Publish the candidate only when it verifies against the state the journal and current files describe; otherwise re-render it. |
| No final checkpoint and no journal | Keep the candidate as evidence, report it as an unresolved fragment in the next checkpoint, and never publish it blindly. Its cycle id is still consumed. |

**Alternate roots keep the same layout.** An alternate root, such as `.scratch/` under the `/discovery` local-only fallback, is permitted only after `Approve state root change`, or when an existing composed-skill contract requires it. Every path above is relative to whatever root is in effect: the root files stay at `<state-root>/discovery-map.md` and `<state-root>/domain-lexicon.md`, and every session package stays at `<state-root>/sessions/<destination-slug>/...`. Record the root as `state-root` in the session frontmatter, keep the same file names, semantics, and digest-manifest paths, and never flatten or rename the `sessions/<slug>/` layout beneath it. Do not switch roots mid-session without that approval.

## Identifiers

| Identifier | Format | Rule |
| --- | --- | --- |
| Node id | `n-0001` | Zero-padded, monotonically increasing per session, never reused. `n-0000` is the session root. |
| Cycle id | `c-0001` | Zero-padded, monotonically increasing per session. Allocated by the rule below. |
| Session id | `<destination-slug>` | Unique within the state root; appears exactly once on the primary map. |
| Term id | canonical term text | Unique within its lexicon scope. |
| Promotion key | `<session-slug>/<node-id>` at first promotion | Assigned once, written into the tracker item and onto the node, and never changed afterwards - not by a rename, a re-promotion, or an extraction. |

### Cycle id allocation

The next cycle id is `max(highest published checkpoint id, highest journal id in cycles/, highest candidate id in cycles/.pending/) + 1`.

Journals and pending candidates are included so an orphaned or retained journal, or an unpublished candidate, never has its id reused by a later cycle. A cycle that aborts under step 12 keeps its own id and journal and resumes under that same id; only an unreadable or corrupt journal causes the next cycle to take a fresh, previously unused id while the corrupt journal stays on disk as evidence.

### Promotion key identity

`promotion-key` is stored on the node as its own field, in the tracker item body, and in the `Tracker Synchronization` table. It is the stable identity used to update rather than duplicate a tracker item, and it survives:

- a node title, outcome, priority, or maturity change;
- reinterpretation to `weakened` or `invalidated`;
- extraction into another session, even when the node id changes there.

## Enumerations

```text
fog:      unexplored | scouted | investigating | researched | decision-ready |
          cleared | promoted | blocked | accepted-unknown | invalidated
maturity: vague | framed | researched | decision-ready | promotion-ready
priority: unprioritized | P2 | P1 | P0
```

Fog and maturity are independent axes and share three token spellings (`researched`, `decision-ready`). Always name the axis: "fog `cleared`", "maturity `promotion-ready`", "maturity below `researched`". Never write a bare state token where the axis is ambiguous.

Fog tokens are the lowercase serialization of the state names in the README fog diagram. Allowed transitions are in [Traversal, priority, and selection](./40-traversal-and-selection.md).

Priority semantics, independent of any provider field:

- `P0` - the destination cannot be committed to or released without this understanding; it gates other work.
- `P1` - required for the intended outcome, but it may follow P0 work.
- `P2` - valuable and deferrable without changing the destination.
- `unprioritized` - not yet compared; treated as lower than `P2` for debt detection and higher than nothing for selection.

Maturity semantics, independent of fog:

- `vague` - the node names a subject but not a bounded outcome. Its scope, actors, and success conditions are still unknown or contradictory.
- `framed` - the problem and its intended outcome are stated in one bounded sentence, with the actors named and the obvious exclusions written down. Evidence may still be missing.
- `researched` - the problem, intended outcome, supporting evidence, blockers, and the next decisions are known and recorded. This is the floor used by the priority-maturity invariant; it does not mean every question is answered.
- `decision-ready` - every remaining choice is stated as a decision with options and a recommendation, and nothing further needs research before a user or the loop can settle it.
- `promotion-ready` - every decision is settled, requirements and constraints are confirmed, dependencies and blockers are typed links, a verification seam exists, and no `conflicted` term the node depends on remains. This is the maturity half of the promotion gate.

Map these to provider priority, severity, or ranking fields only through `docs/agents/issue-tracker.md`. Never assume a provider has a matching field.

`tracker-mode` values, used consistently everywhere:

| Value | Meaning |
| --- | --- |
| `remote` | A configured provider is reachable through `/discovery`. Promotion creates or updates real tracker items through `/discovery`. |
| `local-only` | `/discovery` is available but running its confirmed local-only fallback. Promotion still routes through `/discovery`, which writes its local tracker artifacts. |
| `markdown-only` | No tracker path exists - `/discovery` or `/create-ticket` is unavailable, or the tracker contract is missing. Nothing is published; the promotion preview is emitted as a manual instruction. |

`cycle-state` values: `in-progress` from step 1 until the state files verify; `publishing` from the moment step 14 writes the digest-control values until the final checkpoint is published and verified; `complete` afterwards. Finding `in-progress` or `publishing` at bind time means a cycle was interrupted and must be reconciled before a new one starts.

`tracker-mode` is determined in step 1 of every cycle from the compatibility report and the tracker contract, and recorded in the journal, the checkpoint, and the session frontmatter. A user-requested move to a different mode requires `Approve tracker mode change`. A mode that degrades to `markdown-only` because a capability went missing is a degradation, reported in the envelope, not an approved mode change.

Intra-session typed links: `depends-on`, `blocks`, `refines`, `duplicates`, `conflicts-with`, `evidence-for`, `supersedes`, `relates-to`.

Cross-session typed links: `requires-session`, `informs-session`, `conflicts-with-session`, `shares-domain-with`, `constrains-session`, `supersedes-session`, `related-session`.

## `discovery.md`

```markdown
---
schema-version: 1
session: <destination-slug>
state-root: docs/discovery
revision: <integer, incremented on every persist>
anchor: <file path or `idea`>
anchor-revision: <commit, hash, or ISO-8601 timestamp>
anchor-status: unchanged | revised | unreachable
question-group-size: 12
last-question-group-size: <N in effect for last-cycle>
last-cycle: <cycle-id>
cycle-state: in-progress | publishing | complete
state-digest: <64-char lowercase hex or `unverified`>
root-map-digest: <64-char lowercase hex or `unverified`>
root-lexicon-digest: <64-char lowercase hex or `unverified`>
digest-tool: <exact command used, or `none`>
digest-status: verified | unverified
state-scope: full | partial
tracker-mode: remote | local-only | markdown-only
tracker-tier-map: <Branch>=<provider type>; <Story>=<provider type>; <Task>=<provider type> | unmapped
---

# Discovery Session - <Destination>

## Anchor

<The idea statement, or a link to the anchor file plus its current revision.>

## Destination

<End state and observable success conditions.>

## Session Domain Lexicon

<Table defined in the Domain Lexicon reference.>

## Tree

### n-0000 - <Root title>

- Parent: none
- Fog: <fog>
- Maturity: <maturity>
- Priority: <priority>
- Outcome: <one bounded observable outcome, or `unknown`>
- Open questions: <question, blocker, or `none`>
- Evidence: [<title>](<link>)
- Links: depends-on n-0004; shares-domain-with sessions/<slug>
- First seen: <cycle-id>
- Former node id: <old id, only on a node moved by extraction> | none
- Reinterpreted: <cycle-id> (<verdict>)
- Promotion key: <session-slug>/<node-id> | none
- Tracker: <tier> [<linked title>](<link>) | none
- Divergence: <one line> | none
- History: <most recent five cycle entries, then one compaction line>

## Active Frontier

| Node | Fog | Maturity | Priority | Blocked by | Open questions |
| --- | --- | --- | --- | --- | --- |

## Priority Debt

| Lower-priority node | Outran (maturity below researched) | Relation | Cause | Detected | Last seen | Status |
| --- | --- | --- | --- | --- | --- | --- |

`Cause` records why the pairing appeared, using exactly one of: `advanced <node-id>` when the lower-priority node advanced inside the detection window, `weakened <node-id>` when the higher-priority node dropped below `researched`, or `priority-change <node-id>` when a user priority change created the ordering violation.

## Tracker Synchronization

| Node | Tier | Promotion key | Tracker item | Last synced cycle | Divergence |
| --- | --- | --- | --- | --- | --- |
```

Every node keeps every field. `Open questions` is the node's unresolved fog expressed as questions or blockers. `First seen` is the cycle that created the node and is the source for the first-seen tie-breaker in selection. `Former node id` appears only on a node an extraction renumbered.

### Deterministic ordering

Serialization order is fixed so two writers producing the same state produce the same bytes, and so a digest comparison detects content drift rather than reordering:

- node sections under `## Tree` are ordered by node id ascending, comparing the zero-padded id as text;
- rows in `Active Frontier`, `Priority Debt`, and `Tracker Synchronization` are ordered by node id ascending, using the lower-priority node's id for a debt row;
- session lexicon rows are ordered by term, byte-ascending;
- `History` entries within a node are ordered oldest to newest, with the compaction line first.

### Bounded history

Current-state files stay compact; the immutable checkpoints hold full provenance.

- A node's `History` keeps at most the five most recent cycle entries verbatim, each one line: `<cycle-id> <what changed>`.
- Older entries are replaced by exactly one compaction line: `c-0001..c-0006 compacted - <count> earlier changes, see cycles/`.
- Compaction never deletes information, because every compacted entry is already recorded verbatim in its own immutable checkpoint. The checkpoints are the provenance of record.
- `Active Frontier` lists only nodes that are neither fog `cleared` nor fog `promoted`. `Priority Debt` lists only open and deferred debt; cleared debt moves to the node history and the checkpoint.

## `discovery-map.md`

```markdown
---
schema-version: 1
state-root: docs/discovery
sessions: <count>
last-updated-cycle: <session-slug>/<cycle-id>
---

# Primary Discovery Map - <Product>

## Product Idea and Destination

<Whole-product idea, destination, and success conditions.>

## Verticals and Cross-Cutting Domains

| Session | Kind | Priority | Maturity | Active fog | Major blockers | Package |
| --- | --- | --- | --- | --- | --- | --- |
| <slug> | vertical \| cross-cutting | P1 | framed | <one line> | <one line> | [discovery.md](./sessions/<slug>/discovery.md) |

## Typed Session Links

| From | Link | To | Why |
| --- | --- | --- | --- |

## Shared Actors and Constraints

- <Actor or constraint> - <one line>
```

The primary map stays low resolution: what the product is, which verticals exist, how they relate, and where fog remains. Detailed requirements, interrogation history, research, and decomposition stay in the owning session. Every session appears exactly once.

`discovery-map.md` and `domain-lexicon.md` are shared by every session in the state root and are therefore contended. A cycle owns only its own row and its own lexicon changes; it never rewrites another session's row, and it rebases onto the latest file content immediately before writing.

## `domain-model.md`, `requirements.md`, `evidence.md`

`domain-model.md` belongs to this loop. Both sections are required, and they differ by **provenance**, not by writer:

```markdown
## Confirmed Domain Model

<Written by this loop as a mirror of explicitly confirmed /domain-mapping
results. Every entry cites the canonical artifact - the owning CONTEXT.md,
the root CONTEXT-MAP.md, or an approved Architecture Decision Record (ADR) -
that is the source of truth for it.>

## Candidate and Unconfirmed

<Written by this loop: candidate terms, proposed boundaries, open domain
questions, and conflicts awaiting /domain-mapping.>
```

- `/domain-mapping` never writes any file in this package. It writes only its own canonical repository domain artifacts at the locations named by `docs/agents/domain.md`: the owning `CONTEXT.md`, a root `CONTEXT-MAP.md` when the repository has multiple bounded contexts, and approved ADRs. Those artifacts are the source of truth for confirmed vocabulary; the confirmed section here is a mirror with a link, never a competing definition.
- The mirror is written only in step 14, and only for results step 13a recorded as explicitly confirmed with a named artifact. An unconfirmed proposal, an inferred agreement, or a result whose artifact could not be reread stays in `## Candidate and Unconfirmed`.
- If `## Candidate and Unconfirmed` does not exist, this loop creates it.
- If `/domain-mapping` is unavailable, candidates and conflicts stay in the candidate section, the confirmed mirror is untouched, and the fallback is disclosed in the checkpoint and the outcome envelope.
- `requirements.md`: confirmed requirements, constraints, exclusions, and unresolved requirements, each linked to the node and cycle that produced it.
- `evidence.md`: sources, research results, prototype outputs, limitations, and an evidence digest or revision per source. Every claim used in a decision is traceable to an entry here.

## `cycles/<cycle-id>.md`

```markdown
---
schema-version: 1
cycle: <cycle-id>
session: <destination-slug>
started: <ISO-8601>
completed: <ISO-8601>
anchor-revision: <value>
anchor-status: unchanged | revised | unreachable
entry-state-digest: <64-char lowercase hex or `unverified`>
exit-state-digest: <64-char lowercase hex or `unverified`>
entry-root-map-digest: <64-char lowercase hex or `unverified`>
exit-root-map-digest: <64-char lowercase hex or `unverified`>
entry-root-lexicon-digest: <64-char lowercase hex or `unverified`>
exit-root-lexicon-digest: <64-char lowercase hex or `unverified`>
digest-tool: <exact command used, or `none`>
digest-status: verified | unverified
question-group-size: <N in effect for this cycle>
questions-asked: <grounded>+<follow-ups>
selection-source: deterministic | user
traversal-mode: broad | deep
promotion: none | not-ready | previewed | applied | rejected-stale | blocked
promotion-identity: <preview-digest-short or preview-label or `none`>
domain-handoff: <domain-handoff-key> | none
domain-handoff-status: none | completed | unknown | pending
domain-handoff-pending: <count> (<domain-handoff-key>, ... | none)
tracker-mode: remote | local-only | markdown-only
state-scope: full | partial
outcome: <outcome envelope status>
composition-report: discovery=available; create-ticket=available; interrogate=available; domain-mapping=unavailable; spec=available
---

# Cycle <cycle-id>

## Selection

<Selected node, selection source, traversal mode, the rule that fired, and the triggering reason.>

## Reinterpretation

<Nodes whose verdict changed and why.>

## Questions and Answers

<Each question with its recommendation, alternative, disposition, and the user's answer, in order.>

## Decisions

<Settled decisions, their owner, and the node each updates.>

## Evidence

<New evidence, limitations, and prototype results.>

## Lexicon Changes

<Added, confirmed, aliased, conflicted, deprecated, or promoted terms; the canonical `/domain-mapping` artifact each confirmed term was mirrored from; and any handoff left `pending` or `unknown` this cycle.>

## Promotion Outcome

<The promotion status above, the preview identity, every item created or updated with its node id, promotion key, and tracker id and link, or the failing readiness condition and node.>

## State Delta

<Nodes added, split, merged, invalidated, re-prioritized, matured, or promoted; or the explicit no-change reason.>

## Limitations

<Unread scope under bounded rehydration, unverified digests, degraded capabilities, and any other stated limitation; or `none`.>

## Next Frontier

<Deterministic next item, an advisory only, plus the remaining priority debt.>
```

Checkpoints preserve the wording used at the time. A later rename or definition change updates current-state artifacts only; checkpoints keep their historical wording. `Next Frontier` is advisory: the next cycle recomputes selection from durable state and may legitimately select something else.

## `cycles/<cycle-id>.journal.md`

Created in step 1, before any traversal. Opening block, then append-only entries:

```markdown
---
schema-version: 1
cycle: <cycle-id>
session: <destination-slug>
started: <ISO-8601>
run-id: <invocation-scoped token used for the pending checkpoint path>
entry-state-digest: <64-char lowercase hex or `unverified`>
entry-root-map-digest: <64-char lowercase hex or `unverified`>
entry-root-lexicon-digest: <64-char lowercase hex or `unverified`>
domain-handoff-key: <session-slug>/<cycle-id>/<packet-digest> | none
domain-handoff-status: none | staged | invoked | completed | unknown | pending
domain-handoff-pending: <domain-handoff-key>, ... | none
digest-tool: <exact command used, or `none`>
digest-status: verified | unverified
tracker-mode: remote | local-only | markdown-only
question-group-size-in-effect: <N>
asked: 0
grounded-asked: 0
follow-ups-asked: 0
selection: pending
state-scope: full | partial
composition-report: <same format as the checkpoint>
attempt: 1
---

## Anchor
## Unread scope
## Reinterpretation verdicts
## Lexicon changes
## Domain mapping handoff
## Selection
## Questions and answers
## Evidence
## Promotion preview
## Promotion outcome
## Pending writes
## Limitations
```

Rules:

- `asked`, `grounded-asked`, and `follow-ups-asked` are updated after every question so an interruption cannot recharge the budget.
- `selection` is replaced with the selected node id, rule, and source once step 7 completes, and is then **pinned for the life of this cycle id**. A restart after a step 12 abort rehydrates and reinterprets the pinned node; it does not re-run selection, and it never reassigns the recorded answers to a different node. When the pinned node comes back `invalidated`, orphaned, or absent, follow the disposition rule in [Cycle workflow](./20-cycle-workflow.md) step 12.
- `## Domain mapping handoff` holds the bounded packet staged in step 11 and, after step 13a, the canonical artifact paths and identities `/domain-mapping` reported writing, the post-write per-file digest of each one when digests can be computed, what it confirmed, split, aliased, deprecated, or left conflicted, and the reason when the handoff stayed `pending`. Nothing in this section is discovery state; step 14 mirrors only the explicitly confirmed results.
- `domain-handoff-key` is `<session-slug>/<cycle-id>/<packet-digest>`, where `packet-digest` is the first 12 characters of the SHA-256 of the canonical packet body, or - when command execution is unavailable - the content-bound label `<term-count>t-<node-count>n-<line-count>l`. The canonical packet body is the staged packet rendered with one field per line in this fixed order, trailing whitespace stripped, `\n` line endings, and exactly one trailing newline: `term`, `readings`, `bounded-contexts`, `affected-nodes` (node ids ascending, joined by `; `), `evidence` (links ascending, joined by `; `), `decision-at-stake`. The key is deterministic, so a resumed attempt recomputes the same key and can tell a completed handoff from one that must be reconciled.
- `domain-handoff-status` moves `none` -> `staged` (step 11) -> `invoked` (written before the call) -> `completed` (result and artifacts reread and recorded), or to `pending` when the handoff could not run, or to `unknown` when the call returned without an establishable outcome. The progression is **monotonic**: a status never moves backwards within a cycle, `pending` and `unknown` are terminal for the cycle that recorded them, and a later cycle re-enters the work at `staged` under its own new key. A resumed attempt never reinvokes a `completed` key; it reconciles an `invoked` or `unknown` key first.
- `domain-handoff-pending` lists the keys of the material terms that were staged but **not** selected this cycle. At most one packet is handed off per cycle; the selection rule and the tie-breaks are in [Cycle workflow](./20-cycle-workflow.md) step 13a. Each pending key is carried into the checkpoint and stays eligible for a later cycle until its own handoff completes or the term stops being material.
- `## Promotion preview` stores the canonical preview body verbatim plus its digest or label, so the pre-apply comparison can be exact.
- `## Promotion outcome` is appended to **during** the apply, not after it. After `/discovery` confirms each created or updated item, and before the next item is requested, append one line: `<node-id>  <promotion-key>  <tracker id>  <tracker link>  <created | updated>`. This is what makes a crash between the apply and step 14 recoverable without duplication.
- `## Unread scope` is written when `state-scope` is `partial`: one line per not-reinterpreted node, `<node-id>  <digest or `unverified`>  <byte length>`, plus the retained node bytes when digests cannot be computed, followed by one line per write-blocked file, `file: <file-name>  <digest or `unverified`>  <byte length>`, for a `domain-model.md`, `requirements.md`, or `evidence.md` that could only be read in part. Step 14 verifies every listed node and every listed file against it before the checkpoint is rendered.
- `## Pending writes` accumulates every staged change from step 11 in the order it was staged.
- `attempt` increments when step 12 aborts and the cycle restarts under the same cycle id.

## Digests

Digests exist to detect that durable state moved underneath a cycle. They must be reproducible by any actor from the same file contents.

**Inputs, in this exact order:**

1. `discovery.md`, normalized as described below;
2. `domain-model.md`;
3. `requirements.md`;
4. `evidence.md`;
5. the identity - not the content - of the latest checkpoint.

Checkpoints are immutable, so their content cannot drift; only their existence can change. Input 5 therefore contributes the latest cycle id rather than a file digest, which detects a concurrently completed cycle without making the digest self-referential.

**Normalization of `discovery.md`.** Before hashing, replace the *value* of every field in the loop-owned digest-control block with a fixed placeholder, keeping the keys and line positions intact:

```text
state-digest: <state-digest>
root-map-digest: <root-map-digest>
root-lexicon-digest: <root-lexicon-digest>
digest-tool: <digest-tool>
digest-status: <digest-status>
cycle-state: <cycle-state>
```

Every field in that block is written by this loop about its own bookkeeping: `state-digest` is self-referential, the root digests and the tool fields are produced by the same computation, and `cycle-state` is set to `in-progress` in step 1. Hashing their live values would make the digest unstable for reasons that are not third-party drift, and drift in the root files is already detected by the separate root digests. No other field is normalized. No other file is normalized.

**Per-file digest.** SHA-256 over the UTF-8 bytes of the file as stored, rendered as 64 lowercase hexadecimal characters. Uppercase hexadecimal is never written or accepted.

**Manifest.** The manifest is exactly five lines, in this order, with paths written relative to the state root using forward slashes on every platform:

```text
<digest of discovery.md, normalized>  sessions/<slug>/discovery.md
<digest of domain-model.md>  sessions/<slug>/domain-model.md
<digest of requirements.md>  sessions/<slug>/requirements.md
<digest of evidence.md>  sessions/<slug>/evidence.md
<latest-cycle-id>  sessions/<slug>/cycles/<latest-cycle-id>.md
```

Each field pair is separated by exactly two spaces, each line ends with a single `\n` including the last, and no other whitespace, ordering, or path form is permitted. When the session has no checkpoint yet, line 5 is exactly:

```text
none  sessions/<slug>/cycles/
```

A missing or unreadable input among lines 1 through 4 is a corrupt-state condition, not a `none` line.

Worked example for session `offline-mode` whose latest checkpoint is `c-0006`:

```text
3b1f0c9a7d2e4f5061728394a5b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e  sessions/offline-mode/discovery.md
9c4d2e1f0a3b5c6d7e8f9012a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6  sessions/offline-mode/domain-model.md
71a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80  sessions/offline-mode/requirements.md
e5f60718293a4b5c6d7e8f9012a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5  sessions/offline-mode/evidence.md
c-0006  sessions/offline-mode/cycles/c-0006.md
```

**State digest.** SHA-256 over the manifest bytes, rendered as 64 lowercase hexadecimal characters.

Line 5 carries the id of the latest **published** checkpoint, with one recovery exception: when `cycle-state` is `publishing`, the digest-control block already commits to the cycle being published, so a resuming attempt uses that cycle's id in line 5 until the candidate is published or re-rendered. Without that exception a crash between the digest-control write and the rename would look like drift.

The entry digest is computed in step 1 with the previous cycle's id in line 5. The exit digest is computed in step 14 item 4, over the four session current-state files **as they are on disk at that moment** - which after an approved extraction means after item 2b removed the branch from the parent, not the bytes item 1 intended - and with the current cycle's id in line 5, before that checkpoint is published - line 5 contributes the id, never checkpoint bytes - so it equals the entry digest the next cycle will compute from the same files. No other actor writes these files mid-cycle: `/domain-mapping` writes only its own repository artifacts and `/discovery` writes only the tracker, so the cycle-start value stays the comparison baseline for the whole cycle.

**Root digests.** `root-map-digest` is the per-file digest of `discovery-map.md`; `root-lexicon-digest` is the per-file digest of `domain-lexicon.md`. Each is `none` when the file does not exist yet.

**Tool and status.** Record `digest-tool` as the exact command used, such as `shasum -a 256` or `sha256sum`, and `digest-status` as `verified`. Both go in the journal, the checkpoint, and the session frontmatter.

**When command execution is unavailable.** Record every digest field as `unverified`, `digest-tool: none`, and `digest-status: unverified`, then compensate: retain the cycle-start content of the four session current-state files and the two root files, and compare character for character - with the digest-control normalization applied to `discovery.md` - immediately before the first mutation of the cycle at step 12, and again before the next mutation whenever a live user turn has intervened since the last check - the `/domain-mapping` invocation in step 13a, the tracker apply in step 13b, and the first write in step 14 each require a valid check taken after the most recent user turn.

The comparison is always **pre-write** and always against the same cycle-start baseline. "No further comparison after writes begin" is scoped precisely to **step 14's writes to the discovery state** - the four session current-state files and the two root files. Once step 14 item 1 has written the first of them, the baseline is deliberately superseded and step 14 item 3 verifies each file against the bytes this loop intended to write instead. Writes that are not discovery-state writes do not close the window: the `/domain-mapping` artifacts written at step 13a and the tracker items created at step 13b live outside this package, so a later first mutation still gets its own pre-write comparison against the same cycle-start baseline. The root files are the exception that stays immediate, and for a different reason: item 2 rereads and rebases them right before writing because other sessions share them, not because it is looking for drift.

A difference in a session file follows the session-state drift path in step 12; a difference in a root file is classified by the root rule there, and only the rows this session owns can make it a conflict. Never claim a digest that was not computed, and never treat `unverified` as equivalent to a match.

**Unverified with no usable baseline: read-only cycle.** When `digest-status` is `unverified` and the cycle-start content of all six files was not retained, cannot be reread, or is incomplete - a resumed attempt after a crash, a truncated read, or `state-scope: partial` covering any of the six - the cycle has no way to detect drift and must not mutate anything:

1. make no durable write: the only writes permitted are appends to this cycle's own journal and the `cycle-state` marker - no current-state file, no root file, no pending candidate, no published checkpoint, no extraction, and no other frontmatter change;
2. run no mutation through a composed skill: no `/domain-mapping` invocation and no promotion, preview, or apply;
3. it may still ask its bounded question group **only if** the journal itself can be written and reread successfully after each question, since the journal is the sole record that survives; if the journal cannot be verified, ask nothing and stop;
4. publish no pending candidate found in `cycles/.pending/`, and reconcile none: a candidate is published only when both it and the journal can be read and verified, which is exactly what this mode lacks - it stays an unresolved fragment for the next attempt;
5. keep the journal, write no checkpoint, and report `CYCLE_BLOCKED_ON_CAPABILITY` with the limitation named - the answers stay in the journal and are replayed by the next attempt;
6. report `CYCLE_FAILED_STATE` instead when the missing baseline is itself the result of a failed read or write in this cycle rather than a missing capability.

This is the same rule a resumed attempt hits after a crash, where the retained cycle-start content is gone by definition. There is no partial mode between it and normal operation.

**An oversized package in unverified mode is a dead end, and the loop says so.** When there is no execution to compute digests and the six files are too large to retain and compare in full, no cycle can ever leave read-only mode, because the only exit - a fresh full six-file baseline in one pass - is exactly what does not fit. Do not retry, do not sample, and do not weaken the rule: report the dead end explicitly, name the files and their sizes, and state that the resolution is a **human split of the session package into smaller linked sessions, performed outside this loop**, or restoring command execution so digests can be computed. Until one of those happens, every cycle on that package is `CYCLE_BLOCKED_ON_CAPABILITY` and writes nothing. The only exit is to establish a **fresh usable baseline**: read all six files in full in one pass, retain their exact content as the new cycle-start baseline, and reconcile the journal against it - replaying recorded answers, reconciling any applied promotion identities, and classifying any difference by the ordinary session-drift and root-drift rules. Once it reconciles, the attempt rejoins the normal flow at step 12; until then it writes nothing.

## Bounded Rehydration

A cycle needs the compact current-state files. All four are mandatory: if `discovery.md`, `domain-model.md`, `requirements.md`, or `evidence.md` cannot be read at all, the cycle cannot run - report `CYCLE_FAILED_STATE`, keep the journal, and follow the corrupt-state entry in [Safeguards and recovery](./90-safeguards-and-recovery.md). A file that is missing because the session package was never completed is repaired under `Approve session setup`, not written silently.

When the anchor or the tree is too large to read in full - the read is truncated, or the file exceeds the runtime's single-read limit - do not guess and do not silently sample:

1. read the frontmatter, `Destination`, `Session Domain Lexicon`, `Active Frontier`, `Priority Debt`, and `Tracker Synchronization` sections in full;
2. read the selected branch's nodes and their directly linked nodes in full;
3. read a summary of the anchor - its headings and the sections the selected branch cites - when the anchor itself is oversized;
4. set `state-scope: partial` in the journal, the checkpoint, and the session frontmatter, and list the unread node ids or anchor sections under `## Limitations`;
5. stamp `reinterpreted` only on nodes actually read, and report the pass as partial - never claim a full reinterpretation;
6. include the limitation in the outcome envelope, and recommend session extraction or node splitting to bring the package back under the limit.

A partial cycle may still advance state. It may not promote a subtree whose unread nodes are inside the promotion scope.

### Writing `discovery.md` from partial state

A partial cycle never holds the whole tree in memory, so it must never write the whole tree back. Rendering `discovery.md` from partial in-memory state would silently delete every node the cycle did not load.

1. **Targeted writes only.** A partial cycle edits only the sections and node blocks it actually read: the frontmatter, the always-read sections listed above, and the node blocks of the loaded branch. Every other node block is left exactly as it was found, byte for byte, including its whitespace, ordering, and trailing newline.
2. **Record what must not change.** Before staging any update, record in the journal, under `## Unread scope`, one line per not-reinterpreted node: `<node-id>  <per-file-style digest of that node's block, or `unverified`>  <byte length>`. When digests cannot be computed, retain the node blocks' exact bytes instead. This list is the contract that step 14 verifies against, and it is copied into the checkpoint's `## Limitations`.
3. **Verify preservation, not just intent.** In step 14 item 3, in addition to verifying the written sections, reread `discovery.md` and confirm that **every** node id on the unread list is still present and still byte-identical to its recorded content.
4. **A violation is a failed state.** An unread node that is missing, reordered out of its recorded position, or changed in any byte is `CYCLE_FAILED_STATE`: name the node ids, keep the journal, publish no checkpoint, leave `cycle-state` as it stands, and do not delete anything. This is treated as data loss, not as drift, because the loop itself is the only writer of that file inside step 14.
5. **Never re-render the tree.** A full serialization of the `## Tree` section is permitted only when `state-scope` is `full` for that file in this cycle. The deterministic node ordering rule applies to the nodes actually written; it is never a licence to rewrite the whole section from a partial view.
6. **No extraction.** A partial cycle proposes extraction and defers it, and refuses it outright when any affected node is on the unread list. See the extraction section below.

### When `domain-model.md`, `requirements.md`, or `evidence.md` is partially read

`discovery.md` has stable, individually addressable node blocks, so targeted editing with a recorded unread scope is safe there. The other three files do not: their sections are prose and tables without per-node boundaries this loop can prove it has, so there is no reliable way to edit one region while guaranteeing an unread region survives. The rule is therefore simpler and stricter, and it is not a judgement call:

1. **A partially read file is write-blocked for the whole cycle.** No write of any kind lands in it - not a rewrite, not a section replacement, and not an append, because an append still depends on content boundaries this cycle could not read. Set `state-scope: partial` and record the file by name on a `file:` line in the journal's `## Unread scope` and in the checkpoint's limitations.
2. **A write-blocked file blocks the operations that need it.** Do not ask a question whose answer must be recorded in that file; do not mirror a confirmed domain result into a write-blocked `domain-model.md`; do not promote a subtree whose readiness depends on requirements or evidence in the unread region. Say which operation was blocked and why.
3. **When every write of the cycle targets a write-blocked file, the cycle is read-only** and reports `CYCLE_BLOCKED_ON_CAPABILITY` with the file named. It still journals, and the next full-state cycle persists the work.
4. **A full-file rewrite from partial content is never permitted**, for any of the four current-state files, under any status or approval. The way out is a full read in a later cycle, or splitting the session so the files fit.
5. **Verification follows the same split.** Step 14 verifies written files against intended bytes, verifies the unread node blocks of a partial `discovery.md` byte for byte, and confirms that each write-blocked file is byte-identical to the content read at cycle start. Any difference in a write-blocked file is `CYCLE_FAILED_STATE`.

## Extraction into a New Linked Session

Propose extraction only when a branch has an independent problem, outcome, domain, architecture surface, multi-branch backlog, or delivery boundary. Ordinary features, requirements, and technical tasks stay in the parent session.

**A partial cycle never executes an extraction.** When `state-scope` is `partial`, extraction is proposed and deferred, never performed. Moving a branch requires rewriting the parent tree, and a cycle that did not load the whole tree cannot prove what it is removing or what still points at it. Specifically:

- the loop may present the extraction case, record it in the checkpoint, and recommend it for a later full-state cycle;
- it may not obtain the extraction approval as an executable authorization in this cycle - if the user approves anyway, record the approval as a standing intent, state plainly that it will be executed by the next full-state cycle, and execute nothing now;
- it is blocked outright, with no exception, when any node to be moved, any node that references one, or any node the moved branch references is on the journal's `## Unread scope` list;
- the deferral is reported as a limitation in the outcome envelope with the node ids that could not be read.

A full-state cycle then performs it under the ordinary rules below.

1. Present the candidate, the evidence for independence, the proposed slug, and the typed link that will connect it.
2. Obtain `Approve session extraction <slug>` in a live user turn. The proposal and the approval happen in step 11; every write below happens in step 14, which owns and verifies them. This is the single named exception to the rule that a cycle never mutates another session's package.

The write order is fixed so a failure at any point leaves the parent session intact and readable. It maps onto the step 14 items exactly:

| Step 14 item | Write | Verify before continuing |
| --- | --- | --- |
| 1 | Create the receiving session package only: `discovery.md`, `domain-model.md`, `requirements.md`, `evidence.md`, `cycles/`, and `cycles/.pending/`, containing a **copy** of the moved branch with its history intact and the initialized frontmatter defined below. No root file is written in this item. | Reread every created file and confirm the branch and the frontmatter are complete there. |
| 2 | After the root reread and rebase: the primary-map row for the receiving session, both typed session links - `supersedes-session` from the parent to the receiving session, and the back-link from the receiving session to the parent, which is `related-session` by default or a more specific cross-session link such as `informs-session` when the relationship is already known - and the parent pointer that names the receiving session in the parent's extraction record. | Reread the map row, both typed links, and the parent pointer. |
| 2b | Only now remove or move the branch out of the parent session and update every parent link that referenced it. | Reread both packages: the branch exists exactly once, the map row and both links resolve, and the parent pointer still names the receiving session. |

- **On failure.** A failure or a verification mismatch stops the extraction at that point: report `CYCLE_FAILED_STATE`, keep the journal with the completed orders recorded, and leave the parent branch in place. A failure in item 1 or item 2 means the parent was never touched; a failure in item 2b means the branch may exist in both packages and the resume finishes the removal rather than repeating the copy. A duplicated branch that is still linked is recoverable; a branch deleted from the parent before the receiving package verified is not.
- **Node ids.** Keep each moved node's original id when it is free in the receiving session. When an id already exists there, the receiving session assigns the next id as `max(existing node ids) + 1`, records `Former node id: <old id>` on the moved node, keeps its `First seen` cycle unchanged, and updates every link that referenced the old id. Ids are allocated one at a time in ascending source order, so two moved nodes can never collide with each other.
- **Promotion keys.** Every moved node keeps its `promotion-key` exactly as first assigned, even when its node id changed, so promoted tracker items continue to resolve to the same discovery identity. Record the key and the new id together in the receiving session's `Tracker Synchronization` table.
- **Receiving frontmatter is initialized, never inherited.** The new package's frontmatter is written from scratch in item 1, and no cycle bookkeeping is copied from the parent:

  | Field | Value in the receiving package |
  | --- | --- |
  | `session` / slug | The approved `<slug>`, not the parent's |
  | `state-root` | The same state root as the parent, written explicitly |
  | `anchor` and `anchor-revision` | The anchor chosen for the new session, or the parent's anchor and the exact revision it was read at, recorded as inherited |
  | `anchor-status` | `unchanged`, evaluated against the anchor just recorded |
  | `last-cycle` | `none` - the receiving session has run no cycle |
  | `cycle-state` | `complete` - there is no in-flight cycle here, and no journal is created |
  | `question-group-size` | The session default in force, not the parent's per-invocation override |
  | `tracker-mode` | The same value as the parent, written explicitly |
  | `state-digest`, `root-map-digest`, `root-lexicon-digest` | Computed over the new package once it is written, or `unverified` when digests cannot be computed |
  | `digest-tool`, `digest-status` | The same values this cycle is operating under |

  The parent's `last-cycle`, checkpoint history, journal, pending candidates, priority debt rows for nodes that did not move, and `state-scope` are **not** copied. `cycles/` and `cycles/.pending/` are created empty.
- **Exit digest.** The parent's exit state digest is computed after item 2b, over the parent files on disk, so it reflects the removal rather than the pre-removal bytes.
- **Resumability.** The journal records each order step as it verifies, so a crash mid-extraction is resumable rather than ambiguous.

A cycle loads the low-resolution primary map plus the full state of one session only. Read a linked session's specific node on demand; never load every connected tree.
