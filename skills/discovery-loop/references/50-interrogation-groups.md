# Interrogation Groups

**Intended reader:** the agent executing a cycle.

One cycle asks one question group about one selected node. The group is the only place the loop spends user attention.

## Group Size

| Source | Value | Precedence |
| --- | --- | --- |
| Per-invocation override | An explicit instruction such as `in groups of 5` | Highest |
| Session default | `question-group-size` in the session frontmatter | Middle |
| Package default when unset | `12` | Lowest |

Rules:

1. Accept an integer `N` where `1 <= N <= 50` inclusive. Reject any other value - non-integer, zero, negative, or above 50 - exactly once, state the accepted range, and continue the cycle with the next value in the precedence table: the session default `question-group-size`, or the package default of `12` when the session has none. Do not re-prompt, and do not stop the cycle over it.
2. A per-invocation override applies to the whole invocation, including every later cycle in it. Record it as `question-group-size-in-effect` in each cycle's journal and carry it in the carry-over handle so a context reset does not silently revert to the session default.
3. Persist it as the new session default only when the user explicitly asks to save it, and record the change in the checkpoint. Each cycle's checkpoint records the `N` actually in effect, and the session frontmatter records both the session default and `last-question-group-size`.
4. Compute the caps: `grounded cap = ceil(N / 2)` and `follow-up cap = floor(N / 2)`.
5. Ask grounded questions before follow-ups.
6. `asked_total <= N` always. Update the journal's `asked`, `grounded-asked`, and `follow-ups-asked` counters after every question.

| Invocation | Grounded cap | Follow-up cap | Total cap |
| --- | ---: | ---: | ---: |
| `in groups of 5` | 3 | 2 | 5 |
| Default session | 6 | 6 | 12 |
| `in groups of 35` | 18 | 17 | 35 |
| `in groups of 1` | 1 | 0 | 1 |

## Caps Are Not Quotas

Every number in that table is a ceiling. None of them is a target.

- Ask only the grounded questions the node's fog actually needs, up to the grounded cap.
- Ask only the follow-ups the answers actually raise, up to the follow-up cap.
- Never ask an extra question to "use up" a budget.
- Unused grounded capacity is **not** converted into extra follow-ups.
- Unused follow-up capacity is **not** converted into extra grounded questions.
- Unused capacity of either kind is left unused and reported in the group summary, the checkpoint, and the outcome envelope.

## Grounded Questions

Grounded questions come from durable state read this cycle: the latest anchor, the tree, the domain model, requirements, evidence, both lexicons, linked-session summaries, and promoted tracker items. Each one names the fog it clears.

Do not ask a grounded question whose answer is already discoverable in repository or documentation evidence. Research it first under [Research and prototypes](./70-research-and-prototypes.md); spend the budget on decisions only the user owns.

## Adaptive Follow-Ups

Follow-ups react to the answers already given in this group. Use them to clarify intent, request source material, reconcile a contradiction, or expose a constraint, dependency, feasibility concern, or verification need.

## Question Format

Ask one question at a time and wait for the answer. Never batch, and never renumber a question after asking it.

```markdown
❓ **Q<n> of up to <N> - <short title>** (<grounded | follow-up>)

<One question about one issue, with the context needed to answer it.>

➡️ **Recommended:** <Recommended answer.>
**Why:** <Concise rationale grounded in state or evidence.>

🔀 **Alternative:** <One credible alternative.> | none - <why no credible alternative exists>
**Tradeoff:** <What that alternative costs or gains.> | not applicable

✍️ **Or answer freely** - including "defer", "delegate to you", "accept as unknown", or a correction to an earlier answer.
```

The header says `of up to <N>` because `N` is a ceiling. Never phrase it as `Q<n> of <N>`, which promises questions the group may never ask.

Requirements for every question:

- exactly one recommended answer with a rationale;
- exactly one credible alternative with its tradeoff, **or** the literal form `none - <reason>` when no credible alternative exists. Never invent a straw alternative to fill the slot, and never omit the line;
- an explicit freeform path;
- confirmed lexicon terms, or an inline definition for a `candidate` term;
- no compound questions; split anything independently answerable.

When no defensible recommendation exists, recommend a decision method, a reversible default, a bounded experiment, or a decision criterion. Do not fabricate certainty, and do not record a recommendation as settled unless the user accepts or explicitly delegates it.

## Answer Handling

Record each answer in the cycle journal immediately, with its disposition:

```text
settled | deferred | delegated-to-loop | accepted-unknown | needs-research |
needs-prototype | revises <node-id or question>
```

A `delegated-to-loop` answer authorizes the loop to choose using evidence; it never converts research into user authority. A revision to an earlier answer updates the affected node and lists the downstream nodes it touches.

An answer that arrives after the group closes is carried into the next cycle through the carry-over handle and asked or applied there. It does not extend the current group.

## Closing the Group

1. Stop at the first of:
   - the total cap `N` is reached;
   - the material fog for the selected node is resolved - stop immediately, even with grounded capacity remaining, because there is nothing material left to ask about this node;
   - the user stops the group.
2. Summarize the settled decisions, the unresolved fog, the unused capacity of both kinds, and the debt consequences of any priority the user changed during the group.
3. Reset the budget ledger. Budgets never accumulate between cycles.
4. Continue with step 11 of [Cycle workflow](./20-cycle-workflow.md), which stages the outcomes without writing them.

An aborted attempt under step 12 does not reset the ledger: the restarted attempt keeps `asked` and continues with `N - asked`.

## Composing `/interrogate`

Compose `/interrogate` only under the bounded contract in [Composition and ownership](./10-composition-and-ownership.md): one bounded decision, the remaining ceiling `N - asked`, and this question format, with its own completion and Shared Understanding gates left uninvoked. Every question it asks the user counts against `N`. If it cannot run within the remaining budget or cannot accept the ceiling and format, ask the decision directly under this contract or defer it to the next cycle and record why. This orchestrator keeps the group contract, the budget ledger, and the persistence duty in all cases.
