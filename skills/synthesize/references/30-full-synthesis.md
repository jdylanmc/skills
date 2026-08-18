# Full Synthesis

## Goal

Create a complete operational knowledge model that preserves the source's
distinctive understanding. The full layer is comprehensive, not compressed for
prompt size.

Default audience: practitioners who need to understand, apply, review, or teach
the source accurately. Use the recorded audience contract when the user
supplied one. Mini and nano inherit it unless the user supplies a
stage-specific audience. For simplified, use this precedence: a
simplified-specific audience, then the non-specialist default defined in
[Simplified output](./60-simplified-output.md), then the run audience.

## Audience Contract

Record one audience contract per run before synthesis, and store it in the
manifest and in every stage packet:

```text
audience: <reader role>
assumed-knowledge: <what the reader already knows>
intended-use: <the decision or action the artifact supports>
consequence-of-misunderstanding: <what goes wrong when the reader is wrong>
publication-behavior: sibling files written beside the source at one commit
  point
```

## Full-Stage Packet

The full layer is composed in a fresh context that receives only:

- the reconciled knowledge ledger records with their source locations;
- the structure map and the complete shard disposition list;
- the locked-terminology register;
- the audience contract;
- the required shape and the composition rules below;
- the classification rules and the claim-ledger schema;
- the quotation limit and the exemption rule;
- the ambiguity rule;
- the output contract: return body text only.

The packet excludes raw shards, extracted source text, reviewer notes, and any
later stage's material. The parent writes frontmatter; no stage agent writes
frontmatter. When a ledger record is insufficient to compose a claim, the agent
returns an evidence gap naming the record. The parent re-extracts that shard
group at most once, then stops with `SYN-EVIDENCE-GAP`.

## Required Shape

Adapt headings to the source while preserving these semantic dimensions:

1. purpose and scope;
2. source structure or conceptual map;
3. primary ideas or corrective biases;
4. concepts and vocabulary;
5. decision or interpretation rules;
6. tradeoffs and conflict resolvers;
7. procedures or workflows;
8. trigger conditions;
9. anti-patterns and failure modes;
10. review, testing, or validation guidance;
11. uncertainty, exceptions, and limits;
12. final checklist or application guide.

Do not force prescriptive rules onto descriptive source material. For
historical, scientific, narrative, or explanatory material, preserve claims,
causal models, arguments, evidence, and uncertainty instead.

The full layer's section order is the canonical order for the package. Mini and
nano preserve that relative order for retained material.

## Composition Rules

- Preserve the source's distinctive mental model rather than producing generic
  best practices.
- Merge repetition only when the operational meaning is unchanged.
- Keep exceptions, counterexamples, and limiting conditions beside the rule or
  claim they qualify.
- Classify every material ledger claim:
  - `confirmed`: directly supported by one or more source records;
  - `inferred`: a relationship derived from confirmed records and explicitly
    labeled as synthesis;
  - `open`: disputed, contradictory, incomplete, or unresolved in the source.
- Never upgrade `inferred` or `open` to `confirmed` during compression.
- Use direct language and original phrasing. Favor one main idea per sentence,
  explicit actors, and explicit causal, conditional, and contrast connectors.
  Keep meaning-preserving qualifiers, exact identifiers, commands, tables,
  warnings, and required syntax unchanged. This is repository policy, not a
  claim of ASD-STE100 conformance.
- Do not quote more than 25 consecutive source words or reproduce a complete
  paragraph, table, list, or procedure verbatim. Preserve exact identifiers,
  commands, formulas, and required syntax only when correctness requires them,
  and record each one in the exemption register.
- Do not add modern practices, external facts, or reviewer preferences absent
  from the source.
- Record unresolved contradictions instead of silently choosing a side.
- Lock exact domain terms and identifiers from the locked-terminology register
  and use the same term throughout.
- Expand an unfamiliar acronym on first use only with an expansion the source
  states. When the source never states one, keep the abbreviation, do not
  invent an expansion, and classify the expansion as `open`.
- Express procedures with prerequisites, ordered steps, expected results, and
  failure or recovery behavior. Keep independently executable actions in
  separate steps and keep atomic operations together.
- Place a warning immediately before the destructive, irreversible, or
  hazardous step it governs. Never move it into later commentary.
- Resolve ambiguity before the gate: no unclear pronoun or reference, no hidden
  actor, no undefined condition, no overloaded term, no missing unit, range,
  scope, or environment, no ambiguous modal verb, no unexplained placeholder,
  and no instruction whose success state cannot be observed.

## Claim Ledger

Maintain this transient claim ledger for every stage. The parent owns it; no
stage agent writes it.

```text
- claim-id: <stable ID>
  stage: full | mini | nano | simplified
  classification: confirmed | inferred | open
  claim: <candidate meaning>
  evidence-ids: <source record IDs for full, parent claim IDs otherwise>
  evidence-location: <source location for full, parent-artifact section
    otherwise>
  qualifiers: <limits, exceptions, or none>
  locked-terms: <terms and identifiers or none>
```

Map `stated` and `qualified` extraction records to `confirmed`; map `disputed`
and `open` records to `open`. Create `inferred` only for a relationship that
follows from cited confirmed records. Make `inferred` and `open` status visible
in the artifact wherever a reader could otherwise mistake the claim for fact.

### Stage-scoped projections

Each later stage and each reviewer receives only a **stage-scoped ledger**: the
records for the immediate parent stage, containing claim ID, classification,
claim, evidence location inside the parent artifact, qualifiers, and locked
terms. A stage-scoped ledger never carries source excerpts, ancestor ledgers,
another stage's dispositions, or source locations from earlier stages. The
parent keeps the complete chain for validation.

## Full-Layer Gate

The full layer passes only when:

- every source shard has exactly one accepted disposition;
- every material concept maps to at least one source location;
- no material source section is silently omitted;
- no unsupported claim appears;
- every material claim is classified as `confirmed`, `inferred`, or `open`;
- terminology matches the locked-terminology register;
- every acronym expansion is source-verified, or the acronym stays unexpanded
  and `open`;
- procedures retain prerequisites, order, expected results, failure behavior,
  and warning placement;
- the beginning, middle, and end of the source materially contribute when
  applicable;
- the parent quotation-index check reports no unexempted hit;
- the ambiguity check in the composition rules passes;
- adversarial review has no unresolved blocker.
