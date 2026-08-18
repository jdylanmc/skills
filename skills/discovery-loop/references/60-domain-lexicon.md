# Domain Lexicon

**Intended reader:** the agent executing a cycle.

Two lexicons keep the language crisp: the shared root tally in `domain-lexicon.md` and the session-scoped tally inside each session's `discovery.md`. Both are compact operating vocabularies, not replacements for `domain-model.md`.

"Material" is defined once, in [Safeguards and recovery](./90-safeguards-and-recovery.md). Every escalation below uses that definition.

## Ownership

| Content | Owner of the meaning | Writer of the file | This loop's action |
| --- | --- | --- | --- |
| Session lexicon rows, in `discovery.md` | Discovery Loop for `candidate` and `conflicted`; `/domain-mapping` for a material `confirmed` meaning | Discovery Loop, in step 14 | Write every row. A row may only be written as `confirmed` when step 13a recorded an explicit `/domain-mapping` confirmation and the row cites its canonical artifact. |
| Shared lexicon rows, in `domain-lexicon.md` | Same as above | Discovery Loop, in step 14 | Write only this session's rows, rebasing onto the latest file content immediately before writing. Never touch another session's row. |
| `## Confirmed Domain Model` in `domain-model.md` | `/domain-mapping` | Discovery Loop, in step 14 | Mirror explicitly confirmed results only, each citing its canonical artifact. |
| `CONTEXT.md`, `CONTEXT-MAP.md`, and approved Architecture Decision Records (ADRs) | `/domain-mapping` | `/domain-mapping` | Read them and link them. Never write them, and never ask another skill to write them on this loop's behalf. |

The canonical repository domain artifacts are the source of truth for confirmed vocabulary; both lexicons and the confirmed section of `domain-model.md` are compact mirrors that cite them. `/domain-mapping` writes no file inside the discovery package.

## Entry Schema

| Field | Purpose |
| --- | --- |
| Term | Canonical spelling |
| Status | `candidate`, `confirmed`, `conflicted`, or `deprecated` |
| Definition | One concise, testable meaning |
| Bounded context | Where the definition applies |
| Aliases | Accepted synonyms and discouraged variants |
| Source | Evidence, decision, or domain artifact supporting the meaning |
| First seen | Session, node, and cycle that introduced the term |
| Last verified | Latest cycle that checked the term |
| Related terms | Parent, child, contrasting, or associated concepts |
| Scope | `shared` or `session:<slug>` |

Rendered form, used in both files:

```markdown
| Term | Status | Definition | Bounded context | Aliases | Source | First seen | Last verified | Related terms | Scope |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fulfillment window | confirmed | The interval in which a paid order must ship | Orders | delivery window (discouraged) | [ADR-4](<link>) | checkout/n-0007/c-0003 | c-0011 | Order, Carrier | shared |
```

`First seen` is always `<session>/<node-id>/<cycle-id>`. `Scope` is `shared` for a row in `domain-lexicon.md` and `session:<slug>` for a row in a session lexicon; a term that exists in both files carries a row in each with its own scope value.

`ADR-4` is an Architecture Decision Record (ADR): a durable record of one consequential design decision, its context, and its consequences. `/domain-mapping` owns any ADR this loop's vocabulary work qualifies for.

## Status Rules

- `candidate` - detected but unconfirmed. New language always enters here.
- `confirmed` - settled by a user decision for an immaterial term, or by `/domain-mapping` for a material one. A material meaning is confirmed only after step 13a records the confirmation and its canonical artifact; this loop then mirrors it in step 14.
- `conflicted` - two definitions are in use, or a definition contradicts evidence. A conflicted term blocks promotion of any node that depends on it.
- `deprecated` - superseded. Keep the entry with a pointer to the replacement; do not delete it.

Never promote `candidate` to `confirmed` because a document or a subagent asserts it. Evidence supports confirmation; it does not perform it.

## Per-Cycle Duties

Every cycle must:

1. load the primary map, shared lexicon, and selected session lexicon before interpreting branch text;
2. detect undefined, overloaded, conflicting, or drifting language in the anchor, tree, evidence, and last cycle's answers;
3. use confirmed terms in questions, recommendations, previews, and node text;
4. add new language as `candidate`;
5. stage a bounded handoff packet with its `domain-handoff-key` in step 11 for every material term, and invoke `/domain-mapping` in step 13a with exactly one of them - never in step 11, and never after step 13b. One packet per cycle is the limit; the selection rule and its tie-breaks are in [Cycle workflow](./20-cycle-workflow.md) step 13a, and every unselected term is recorded in `domain-handoff-pending` with its own key and stays `candidate` or `conflicted`;
6. propagate a confirmed rename or definition change to current-state artifacts while leaving checkpoint wording untouched;
7. record unresolved terminology as fog that can block promotion;
8. refresh `Last verified` for every term the cycle used.

Every lexicon change - both lexicons and both sections of `domain-model.md` - is staged in step 11 and written by step 14. `/domain-mapping` writes none of them: in step 13a it writes only its own `CONTEXT.md`, `CONTEXT-MAP.md`, or ADR, and step 14 mirrors the confirmed result with a citation. Because no third party writes the discovery package mid-cycle, the step 12 comparison baseline stays valid until persist.

## Drift Detection

A term has drifted when its use in the anchor, an answer, or new evidence no longer matches the recorded definition, or when two nodes use it with different boundaries. On drift:

1. mark the term `conflicted` and name both readings with their sources;
2. add the reconciliation as fog on the affected nodes;
3. resolve it through evidence or a user decision, then through `/domain-mapping` when the change is material;
4. record the resolution as confirm, split, alias, deprecate, or keep-conflicted.

## Shared and Session Scope

- A term first defined in a session keeps its source-session identity in `First seen`.
- When a second session uses a term, propose promoting it into the shared lexicon and record the decision.
- A session may adopt an alias or a context-specific definition, but it must record the distinction explicitly. Silent local redefinition of a shared term is prohibited.
- The shared lexicon holds only terms needed across sessions. Detail belongs in `domain-model.md`.
- `domain-lexicon.md` is shared by every session in the state root. Reread it and recompute `root-lexicon-digest` immediately before writing, and merge only this session's rows.

## Handoff to `/domain-mapping`

Stage the packet in step 11 and invoke `/domain-mapping` in step 13a, before the promotion gate, for the single term selected by the step 13a rule. Give it the term, both readings, the bounded contexts, the affected nodes, the supporting evidence, and the decision at stake - the same fields the canonical packet body serializes for the `domain-handoff-key`. One term per invocation and one invocation per cycle keeps the composed skill's own gates answerable in a single user turn.

`/domain-mapping` runs its own investigation, confirmation gate, and Architecture Decision Record (ADR) gate, and writes only its own artifacts: the owning `CONTEXT.md`, a root `CONTEXT-MAP.md`, and approved ADRs at the locations named by `docs/agents/domain.md`. Record in the journal what it confirmed and every artifact path and identity it reports, reread those artifacts to confirm the outcome, then let step 14 mirror the confirmed result into both lexicons and the confirmed section of `domain-model.md`, citing the artifact in `Source`.

When `/domain-mapping` is unavailable, cannot accept the packet, or would need a gate this loop does not own:

1. keep the term `candidate` or `conflicted`;
2. write only in this loop's own files, creating `## Candidate and Unconfirmed` if it does not exist;
3. touch no `/domain-mapping` artifact and write no `confirmed` row;
4. record the pending handoff and its key in the node, the journal, the checkpoint, and the outcome envelope;
5. block promotion only for a node whose readiness gate depends on the unsettled meaning - a `conflicted` term it uses, or a confirmed change its outcome, scope, or verification seam relies on. Unrelated nodes stay promotable, so an unavailable domain skill never deadlocks the loop;
6. disclose the fallback, continue the cycle rather than aborting it, and recommend running domain mapping later.
