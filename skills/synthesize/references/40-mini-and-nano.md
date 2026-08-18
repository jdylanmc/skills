# Mini and Nano Compression

## Fresh-Context Rule

Each compression stage runs in a new agent context:

- mini receives only the reviewed full layer and the mini stage packet;
- nano receives only the reviewed mini layer and the nano stage packet.

## Stage Packet

A stage packet contains only:

- the audience contract;
- the output stage and its size bounds;
- the stage-scoped claim ledger for the immediate parent stage, as defined in
  [Full synthesis](./30-full-synthesis.md);
- the locked-terminology register;
- the acronym and unfamiliar-term rule, including the source-verified-or-`open`
  requirement;
- the classification-preservation rule;
- the procedure-preservation rule, including prerequisites, ordered steps,
  expected results, and failure or recovery behavior;
- the warning-placement rule: every warning sits immediately before the step it
  governs;
- the sentence-clarity rule and the ambiguity rule from
  [Full synthesis](./30-full-synthesis.md);
- the quotation limit;
- the section-order rule: preserve the full layer's relative order for retained
  material;
- the output contract: return body text only.

A stage packet contains no source excerpts, no ancestor ledger, no other
stage's traceability, and no reviewer notes from another stage. The parent
retains every map for validation and writes all frontmatter.

## Deterministic Word Counting

Measure every size bound the same way, through execute:

1. remove the leading frontmatter block, from its opening `---` line through
   its closing `---` line;
2. for text with ordinary word separators, count whitespace-separated tokens;
   otherwise count one word equivalent per four Unicode letter-or-digit
   characters, rounded up; include headings, lists, tables, and fenced code;
3. record the count for the candidate and for its parent artifact in transient
   traceability, including the selected counting method.

Measure the final reviewed candidate, not a draft. Never estimate a count.

## Size Bounds and Precedence

| Stage | Binding upper bound | Advisory lower bound | Overrun hard cap |
| --- | --- | --- | --- |
| mini | 35 percent of the full layer | 20 percent of the full layer | 50 percent of the full layer |
| nano | the lesser of 1,000 words and 12 percent of the mini layer | 5 percent of the mini layer, or the upper bound when that is smaller | 1.5 times the binding upper bound, and never more than 1,200 words |

When the absolute cap and the relative band disagree, the smaller upper bound
governs. The lower bound is advisory: a smaller artifact is acceptable when it
still satisfies its stage gate. Never add material to reach it.

Exceed the binding upper bound only when a retained warning, an essential
procedure, standalone correctness, or decision equivalence requires it. Keep
the excess minimal and record the reason in transient traceability. The
1,000-word nano target may be exceeded only for a warning, its prerequisites,
a minimum safe procedure, or standalone correctness. Exceeding the overrun
hard cap is a gate failure: stop with `SYN-SIZE-INFEASIBLE` and report that the
stage is not feasible for this source, with the next smaller profile as the
suggested alternative.

## Mini

The mini layer must be decision-equivalent to the full layer for normal focused
use, not sentence-equivalent.

Retain:

- the central thesis or mental model;
- decision-changing rules and claims;
- conflict and tradeoff resolvers;
- repeated local decisions that materially affect outcomes;
- strong triggers and anti-shortcut rules;
- essential procedures with their prerequisites, ordered steps, expected
  results, and failure behavior;
- uncertainty and its qualifiers;
- enough distinctive terminology to preserve the source's identity;
- `confirmed`, `inferred`, and `open` distinctions;
- warnings immediately before the steps they govern;
- a concise final checklist.

Remove:

- duplicated explanations;
- examples that add no separate operational consequence;
- framing that does not affect interpretation or action;
- long catalogs that can become triggers;
- details needed only for deep reference.

When uncertain whether deletion would restore a known misunderstanding or bad
decision, keep the material in mini.

### Mini gate

The mini layer passes only when:

- every retained claim maps to a full-layer claim with the same
  classification;
- no claim is added, strengthened, weakened, or decontextualized;
- decision equivalence holds for the audience contract's intended use;
- retained procedures keep prerequisites, order, expected results, and failure
  behavior, with independently executable actions in separate steps;
- warnings sit immediately before the steps they govern;
- terminology matches the locked-terminology register, and acronym expansions
  stay source-verified or `open`;
- the relative section order of the full layer is preserved;
- the size bounds and their recorded exceptions hold;
- the parent quotation-index check reports no unexempted hit;
- the ambiguity check passes;
- adversarial review has no unresolved blocker.

## Simplified

The simplified layer is derived from the reviewed mini layer. It improves human
comprehension without changing scope, claims, priorities, terminology, or
uncertainty. It is not a smaller synthesis tier, and it is never an input to a
later stage. See [Simplified output](./60-simplified-output.md).

## Nano

The nano layer is the smallest standalone reminder that preserves the source's
central corrective pressure under a severe context budget.

Retain only:

- the minimum thesis needed to interpret the guidance;
- high-consequence decision rules;
- conflict resolvers;
- triggers that block predictable shortcuts;
- classifications needed to avoid presenting inference or uncertainty as fact;
- warnings placed immediately before the steps they govern;
- the minimum safe ordered procedure when action is retained, which means its
  prerequisites, its ordered steps, one observable expected result, and its
  governing warnings;
- the smallest useful checklist.

Nano must stand alone. It must not require the reader to open full or mini to
understand a retained rule. When a retained action cannot carry its
prerequisites, observable result, and warnings inside the overrun hard cap,
stop with `SYN-SIZE-INFEASIBLE` rather than publishing an unsafe procedure.

### Nano gate

The nano layer passes only when:

- every retained claim maps to a mini-layer claim with the same
  classification;
- each retained rule is usable without opening full or mini;
- retained actions carry prerequisites, ordered steps, one observable result,
  and their governing warnings, with each warning immediately before its step;
- terminology matches the locked-terminology register, and acronym expansions
  stay source-verified or `open`;
- the relative section order of the full layer is preserved;
- the size bounds and their recorded exceptions hold;
- the parent quotation-index check reports no unexempted hit;
- the ambiguity check passes;
- adversarial review has no unresolved blocker.

## Terminal Rule

Nano cannot be synthesized further. Return `SYN-NANO-TERMINAL` for any attempt
to use `.nano.md` as a source.
