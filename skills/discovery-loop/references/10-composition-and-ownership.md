# Composition and Ownership

**Intended reader:** the agent executing a cycle.

Discovery Loop orchestrates existing skills. It owns the cycle, the durable discovery state, and the question-group contract. It owns nothing else.

"Material" is defined once, in [Safeguards and recovery](./90-safeguards-and-recovery.md). Every escalation rule below uses that definition.

## Artifact Owners

| Artifact or decision | Owning skill | Discovery Loop responsibility |
| --- | --- | --- |
| Tracker map, frontier, ticket state, dependencies, tracker state refresh, and every tracker mutation | `/discovery` | Supply intent, previews, and approved payloads. Never write to the tracker, and never refresh tracker state directly - ask `/discovery` for the refreshed state. |
| Ticket payload wording and splitting | `/create-ticket` | Route every proposed Branch, Story, and Task through it before preview. |
| Confirmed vocabulary, bounded contexts, ownership, lifecycle, and qualifying Architecture Decision Records (ADRs) | `/domain-mapping` | Stage a bounded handoff packet with its `domain-handoff-key` for each material term in step 11, then invoke it in step 13a with exactly one packet per cycle, after the freshness check and before the promotion gate; keep every other term `candidate` or `conflicted` with its key recorded in `domain-handoff-pending`. |
| The canonical domain artifacts - the owning `CONTEXT.md`, a root `CONTEXT-MAP.md`, and approved ADRs at the locations named by `docs/agents/domain.md` | `/domain-mapping` | Read them and cite them. Never write them. `/domain-mapping` writes no file inside the discovery package, so this loop writes its own `domain-model.md` and both lexicons in step 14, mirroring only explicitly confirmed results with a citation to the artifact they came from. |
| Published implementation specification | `/spec` | Invoke only for a promotion-ready subtree with no material unresolved fog. |
| Deep single-decision pressure-testing | `/interrogate` | Compose it under the bounded contract below; the group cycle in [Interrogation groups](./50-interrogation-groups.md) remains this skill's contract. |
| Primary mind map, session packages, cycle checkpoints, Domain Lexicon tally, traversal, and promotion previews | `/discovery-loop` | Own them end to end through the gates defined here. |

Each owning skill's references, boundaries, gates, idempotency rules, and degradation behavior remain authoritative. Never emulate a composed skill from memory when it is available, and never emulate a missing mutating skill at all.

## Composing `/interrogate`

Compose `/interrogate` only for one bounded decision that a single question cannot pressure-test, when the user asks for it, or when the destination itself is ambiguous at session binding.

Pass it exactly three constraints:

1. **One bounded decision** - the node id, the decision at stake, the evidence already gathered, and the stop condition.
2. **The remaining question ceiling** - `N - asked` for this cycle. Every question it asks the user counts against that ceiling.
3. **The parent question format** - the format in [Interrogation groups](./50-interrogation-groups.md): one question at a time, one recommendation with a rationale, one credible alternative with its tradeoff or an explicit `none - <reason>`, and a freeform path.

Do not invoke `/interrogate`'s own completion check or its Shared Understanding confirmation gate. This loop owns completion, persistence, and the shared record; a second confirmation gate would ask the user to approve an artifact this loop does not maintain.

If `/interrogate` cannot accept the remaining ceiling or the parent question format, do not run it. Either ask the decision directly under this loop's own question contract in the remaining budget, or defer it to the next cycle and record the reason in the checkpoint. Never let a composed interview exceed `N` or renumber this cycle's questions.

## Contract Compatibility Check

Run this check once per cycle, before selection, and record the result in that cycle's checkpoint as `composition-report`. Every checkpoint carries a report, including a no-change cycle.

For each composed skill, verify:

1. **Availability.** The skill resolves in the current runtime.
2. **Identity.** Its `name` matches the expected value: `discovery`, `create-ticket`, `interrogate`, `domain-mapping`, `spec`.
3. **Ownership assumptions.** The behavior this loop depends on is still described by that skill: `/discovery` performs tracker preview, mutation, state refresh, and dependency wiring; `/create-ticket` formats without publishing; `/spec` publishes specifications; `/interrogate` can run a bounded interview under a caller-supplied ceiling and format.
4. **Input and output contract for `/domain-mapping`**, checked explicitly because step 13a depends on both halves: it accepts a bounded packet of one term with both readings, bounded contexts, affected nodes, evidence, and the decision at stake; it runs its own confirmation and Architecture Decision Record gates; it writes only the canonical repository domain artifacts named by `docs/agents/domain.md` - the owning `CONTEXT.md`, a root `CONTEXT-MAP.md`, and approved ADRs - and no file inside the discovery package; and it reports which artifact it wrote so the result can be reread and mirrored. If it cannot accept the packet, treat the handoff as `pending`. If it accepts but does not name an artifact, record `domain-handoff-status: unknown`, reread the candidate artifact locations, and mirror nothing that cannot be reread.

Record each skill as `available`, `available-changed`, or `unavailable`. `available-changed` means the dependency above is no longer described by that skill. Treat `available-changed` as `unavailable` for the affected phase, name the difference, and continue with the degradation entry in [Safeguards and recovery](./90-safeguards-and-recovery.md).

Never re-derive a composed skill's internal workflow from an older description. Read its current `SKILL.md` when its behavior is material to the current cycle.

## Repository Contracts

Before any tracker-backed phase, read:

- `docs/agents/issue-tracker.md` for provider mechanics, Discovery operations, and hierarchy;
- `docs/agents/domain.md` for domain artifact locations;
- `docs/agents/triage-labels.md` when labels or tags are material.

Verify that `docs/agents/issue-tracker.md` contains the sections this loop depends on: configuration, work-item or issue operations, and Discovery operations covering map, child, blocking, frontier, and resolve. A file missing those sections is an incomplete contract, not an invitation to guess.

If the contract is missing or incomplete, follow `/discovery` degradation behavior: direct the user to `/setup-jdylanmc-skills`, or continue in the explicitly confirmed local-only Markdown mode. Do not invent provider operations, work-item types, hierarchy, labels, or publication semantics. Never edit `docs/agents/issue-tracker.md` from this loop.

## Scope

One session covers one anchored major idea. One state root covers one product, application, platform, or system.

This skill does not:

- implement product or infrastructure changes;
- run production work under the name of a prototype;
- replace routine `/breakdown-to-tickets` slicing after a settled specification;
- run a single tracker-backed route-map or ticket-resolution pass - that is `/discovery`;
- turn every observation into a ticket;
- treat a recommendation, inference, or research result as a user decision;
- modify a composed skill's artifact outside that skill's workflow;
- carry unrecorded understanding between cycles.

## Importing an Explicitly Supplied Legacy Artifact

This skill does not search for, assume, or claim any artifact from an earlier run. It has no legacy on-disk format of its own to migrate.

When the user explicitly supplies an existing planning artifact - a Markdown file, an exported document, or a tracker item - and asks for it to seed a session, treat it as an unverified input, not as established state:

1. read only the path or item the user named;
2. map its destination, decisions, and remaining fog into a session package under the schema in [Session package and state schema](./30-session-package-and-state.md), entering every claim as unverified until this loop's own evidence or a user answer supports it;
3. preview the import, including the target paths and what each source section becomes;
4. write only after `Approve session setup`;
5. leave the original artifact untouched and link it from `evidence.md` as historical provenance with its source and read date.

Do not silently duplicate an existing understanding into a new package, and do not treat imported wording as confirmed vocabulary, confirmed requirements, or a settled decision.
