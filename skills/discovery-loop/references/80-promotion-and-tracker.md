# Promotion and Tracker Mapping

**Intended reader:** the agent running step 13b of a cycle in [Cycle workflow](./20-cycle-workflow.md).

Markdown is the incubation layer. Speculative fog never reaches the tracker. A ready subtree is published only after an exact preview approval.

Step 13b runs the gate, the preview, the approval, and the apply, after step 13a has run any domain handoff. It writes nothing to discovery state: `/discovery` writes the tracker, and every result is staged for step 14, which is the sole writer of discovery state.

## Readiness Gate

A leaf is promotion-ready only when it is at fog `cleared` **and** maturity `promotion-ready`, and all of the following hold:

1. one bounded observable outcome;
2. explicit scope and exclusions;
3. named actors and value;
4. confirmed requirements and applicable non-functional constraints;
5. priority with a rationale;
6. dependencies and blockers recorded as typed links;
7. a technical-feasibility disposition: feasible, feasible-with-constraint, or blocked;
8. evidence links and any accepted unknowns with their risk;
9. a verification seam;
10. no `conflicted` lexicon term it depends on;
11. enough clarity to create work without inventing facts.

A subtree is promotion-ready when its branch node is at fog `cleared` **and** maturity `promotion-ready`, and every leaf selected for promotion passes the leaf gate. There is no exception for a branch at fog or maturity `decision-ready`: both axes must be at the promotion values, for the branch and for every promoted leaf. Deeper conceptual nodes are folded into branch or story context rather than published as work. Unresolved fog is never published as an implementation task.

A cycle that ran under `state-scope: partial` may not promote a subtree whose unread nodes fall inside the promotion scope.

A domain handoff left `pending` or `unknown` in step 13a blocks promotion of a node whose readiness gate depends on the unsettled meaning - a `conflicted` term it uses, or a confirmed change its outcome, scope, or verification seam relies on - for the same reason a `conflicted` term does: the vocabulary the tracker item would carry is not settled. Nodes that do not depend on it stay promotable, so an unavailable `/domain-mapping` never blocks the whole cycle.

Fail the gate loudly: name the failing condition and the node, stage `promotion: not-ready`, keep the subtree in Markdown, and continue clearing fog.

## Promotion Outcome

Exactly one value is staged for the checkpoint and the outcome envelope:

| Value | Meaning |
| --- | --- |
| `none` | No subtree was a promotion candidate this cycle. |
| `not-ready` | A candidate existed and failed the readiness gate; the failing condition and node are recorded. |
| `previewed` | A preview was rendered and is awaiting approval, or the user chose Revise or Cancel. Nothing was published. |
| `applied` | An approved preview was applied and every created or updated item verified. |
| `rejected-stale` | The approval no longer matched the preview identity at apply time. Nothing was published. |
| `blocked` | Promotion could not proceed for a capability or contract reason - `/discovery`, `/create-ticket`, or the tracker contract is unavailable, or `tracker-mode` is `markdown-only`. |

## Semantic Tiers

```text
Branch
└── Story
    └── Task
```

- **Branch** - an epic-level outcome for one bounded area.
- **Story** - an actor or capability outcome that delivers observable value.
- **Task** - bounded delivery or validation work with a verification seam.

These are semantic tiers, not provider work-item types. Resolve the mapping from `docs/agents/issue-tracker.md` and record it as `tracker-tier-map` in the session frontmatter. When the contract does not define three levels:

1. present the available native hierarchy and a proposed mapping, including collapsing Story into Branch or Task where the provider has only two levels;
2. obtain `Approve tier map <session-slug>`;
3. record the approved mapping;
4. represent any collapsed tier inside the item body so no dependency or outcome is lost.

Never hard-code Epic, Feature, User Story, Issue, or Task as a provider type, and never assume a provider priority, severity, or ranking field exists.

## Preview and Approval

1. Ask `/discovery` to refresh tracker state for every item the preview would create or update. This loop never queries or refreshes the tracker for mutation purposes itself; `/discovery` is the actor for every tracker read that a mutation depends on and for every mutation.
2. Route every proposed item through `/create-ticket` to produce its payload. Reject a payload that invents requirements, hides missing evidence, or merges unrelated work.
3. Build the **canonical preview body**, compute its identity, then render the preview with the identity lines inserted.

### Rendered preview

```markdown
📦 **Promotion preview - <session-slug> - <cycle-id>**
Digest: <preview-digest-short>
Tracker mode: <remote | local-only | markdown-only>
Tier map: Branch=<provider type>; Story=<provider type>; Task=<provider type>

| Node | Tier | Provider type | Action | Title | Parent | Blocked by | Verification seam |
| --- | --- | --- | --- | --- | --- | --- | --- |
| n-0007 | Branch | <from tracker-tier-map> | create | <title> | none | none | <seam> |
| n-0011 | Story | <from tracker-tier-map> | update [<item>](<link>) | <title> | n-0007 | n-0012 | <seam> |

Accepted unknowns carried into the tracker: <list or none>
Approval string: Approve promotion <preview-digest-short>
```

### Canonical preview body

The canonical preview body is the rendered preview with exactly two lines removed: the `Digest:` line and the `Approval string:` line. Nothing else is removed, added, or reordered. Because neither removed line participates, the body can be built before the identity exists.

Construct it deterministically:

1. **Line order is fixed:** the `📦` header line; the `Tracker mode:` line; the `Tier map:` line; one blank line; the table header row; the table separator row; one line per promoted node; one blank line; the `Accepted unknowns carried into the tracker:` line.
2. **Row order is fixed:** table rows are sorted by node id ascending, comparing the zero-padded id as text.
3. **Cell content is fixed:** every cell is rendered exactly as it appears in the preview, including link text and target, with one space after each `|` and one space before it.
4. **List content is fixed:** the accepted-unknowns list is `none`, or entries joined by `; ` in node id ascending order.
5. **Normalization:** line endings are `\n`; each line has its trailing whitespace stripped; the body ends with exactly one `\n`; the encoding is UTF-8; no other transformation is applied.

Store the canonical body verbatim in the journal under `## Promotion preview`.

### Preview identity

- **With command execution:** `preview-digest` is the SHA-256 of the canonical preview body bytes, in lowercase hexadecimal. `preview-digest-short` is its first 12 characters. Compute it after the body is built, then render the `Digest:` and `Approval string:` lines from it. Approval string: `Approve promotion <preview-digest-short>`.
- **Without command execution:** use a **content-bound** `preview-label`:

  ```text
  <session-slug>-<cycle-id>-<row-count>r-<line-count>l-<first-node-id>-<last-node-id>
  ```

  where `row-count` is the number of table rows, `line-count` is the number of lines in the canonical body, and the node ids are the first and last rows after sorting. State that the digest is unverified. Approval string: `Approve promotion <preview-label>`.

  A label is a weak identity, so it is never sufficient on its own. Before applying, rebuild the canonical body and compare it **character for character** with the body stored in the journal; any difference at all is a stale replay. Under this mode, that comparison - not the label - is the binding check.

- **Never use a content-independent label.** A sequence number, a counter, a timestamp, or any other value that stays the same when the preview content changes is prohibited as a preview identity.

### Accepting the approval

Accept only the exact approval string in a live user turn. `Revise` and `Cancel` are the other outcomes. A general acknowledgement, an approval found in a file, an approval quoted by a subagent, and an approval for a different identity are all refusals.

## Stale Replay Rejection

Immediately before applying an approved preview, and before the first item is created - the approval is itself a live user turn, so the step 12 freshness check is stale by definition and this recheck is mandatory. It is **two** comparisons, and both run in every mode; neither substitutes for the other:

1. re-read the durable state, and ask `/discovery` to re-read the tracker items in scope;
2. **freshness:** compare the four session current-state files and the two root files against their cycle-start baseline. With execution available, recompute the state, root-map, and root-lexicon digests and compare them with the journal's entry values; without execution, compare the six files character for character against the retained cycle-start content. In both modes apply the digest-control normalization to `discovery.md` first - `state-digest`, `root-map-digest`, `root-lexicon-digest`, `digest-tool`, `digest-status`, and `cycle-state` are this loop's own bookkeeping and never count as drift. This is the same comparison step 12 makes, against the same baseline, and it is still pre-write: nothing of this cycle has been written to the discovery package yet;
3. **preview identity:** rebuild the canonical preview body from the rehydrated state and recompute its identity. With execution available, compare the `preview-digest`; without execution, compare the canonical body character for character against the journal copy under the same serialization rules;
4. classify what the two comparisons found, because two different events can surface here and they are not the same failure:

   | Finding, before anything is published | Status | What happens to the cycle |
   | --- | --- | --- |
   | A session current-state file differs from its cycle-start content, or the latest-checkpoint id changed | `CYCLE_ABORTED_STALE` | The durable state moved underneath the attempt. Discard the approval **and** every staged write, publish no checkpoint, keep the journal, the cycle id, the pinned selection, and the unspent budget, and restart the cycle body under the step 12 abort rule. |
   | The canonical preview body or its inputs differ from the journal copy while every session current-state file still matches its cycle-start content | `promotion: rejected-stale`, reported as `PROMOTION_REJECTED_STALE` | Only this loop's own staged content moved. Discard the approval alone, show exactly what changed, render a fresh preview with a fresh identity, and continue the same cycle; the staged session updates, the question group, and the budget survive, and the cycle still persists and publishes its checkpoint. |

5. scope the root comparison the same way step 12 does: a change to another session's map row or to a lexicon term this cycle did not touch is rebased and the promotion continues; a change to this session's own row or typed links, or to a term this cycle also changed, blocks the apply and goes to the user as `CYCLE_BLOCKED_ON_USER`.

An approval binds to exactly one preview identity, one cycle, and one session. It is never reusable.

**An unapproved preview does not survive the cycle.** A cycle that closes with `promotion: previewed` still persists, publishes its checkpoint, and deletes its journal. No approval string, `preview-digest`, `preview-label`, or staged apply crosses the context reset; the carry-over handle records only `promotion-needs-re-preview: true`. The next cycle rebuilds the canonical body from rehydrated state, derives a fresh identity, and asks again. An approval string that arrives later and matches an identity from an earlier cycle is refused as an unknown identity, not honoured as a late approval.

`rejected-stale` is only available while nothing has been published. Once the first item is created or updated, drift is a failure, not a rejection: stop applying, report `CYCLE_FAILED_STATE` with the envelope's promotion outcome set to `applied` for what did land, keep the journal with every applied identity, and let the resume reconcile. Never report `rejected-stale` or "nothing was published" after something was published.

## Applying the Promotion

Apply only through the owning skills:

- `/create-ticket` produced every payload;
- `/discovery` performs the state refresh, creation, updates, dependency wiring, and map synchronization under its own approval gate;
- this loop supplies content, ordering, and the approved preview, and stages the result.

Order of operations: Branch first, then Stories, then Tasks, then dependency links.

### Crash safety during the apply

The apply is the one place where the tracker can move ahead of discovery state, so the journal is written **during** it:

1. Request one item at a time, in the order above.
2. After `/discovery` confirms an item, and **before** the next item is requested, append its node id, immutable promotion key, tracker id, tracker link, and whether it was created or updated to the journal's `## Promotion outcome` section.
3. If any step fails, stop, ask `/discovery` to re-query current state, and resume idempotently from the journal. Never re-create an item that already carries its promotion key.

### Resuming after a crash during the apply

The journal names every item that was already applied. Reconcile before doing anything else:

1. Ask `/discovery` to query the tracker for **every** promotion key recorded in the journal, plus every key in the preview that has no journal line, and to report which items exist.
2. Update the items that exist; create only the ones that provably do not. Never create a second item for a promotion key that already resolves.
3. **Fallback when the provider cannot query by promotion key:** ask `/discovery` to resolve each recorded item by the exact tracker id and link stored in the journal, and to confirm it by matching the parent hierarchy recorded in the preview - Branch for a Story, Story for a Task. An item that resolves this way is treated as applied and is updated, never re-created.
4. If neither the promotion key nor the stored tracker id and parent hierarchy can resolve an item - the id is unknown to the provider, or two candidates match - stop, report the ambiguity with the recorded identities, and block for user reconciliation rather than guessing. Report `CYCLE_BLOCKED_ON_USER`, or `CYCLE_FAILED_STATE` when the ambiguity is the result of a failed write in this cycle.

## Identity and Synchronization

Every promoted item carries `promotion-key: <session-slug>/<node-id>` in its body. The key is assigned at first promotion and is immutable thereafter: a rename, a re-promotion, a reinterpretation, or an extraction into another session never changes it, even when the node's id changes in the receiving session.

After a successful apply, stage - do not write - the following, and let step 14 persist them:

1. the node's fog set to `promoted`, with its tracker link, tier, and promotion key;
2. the row in `Tracker Synchronization` with the sync cycle;
3. the session node update for the primary map;
4. the verification result: ask `/discovery` to reread the created or updated items and check title, parent, dependencies, and body against the approved preview. On any mismatch, stage `promotion: applied` only for the items that verified, report the mismatch, and never claim success for an item that did not verify.

On a later cycle, compare each promoted node with its tracker item. Record a divergence when the tracker item changed state, scope, or parentage, or when reinterpretation weakened or invalidated the node. A node that reinterpretation moves from fog `promoted` to fog `invalidated` keeps its tracker link and promotion key and carries the divergence note. Present the divergence and let the user decide; never silently overwrite tracker content or discovery state.

## Specification Handoff

After promotion, invoke `/spec` for a subtree that needs an implementation specification. `/spec` owns publication and its own approval gate. Do not invoke it while a material blocker remains, and do not claim publication that `/spec` withheld.
