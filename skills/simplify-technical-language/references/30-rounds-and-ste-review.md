---
includes: ["_base/_molecules/review-ste-coach.md"]
requires-skills: []
---

# Clarification and Synthesis Rounds

## Required References

1. [Review with the Simplified Technical English Coach](../../_base/_molecules/review-ste-coach.md)

## Round State

Maintain a compact state across rounds:

- settled facts and decisions;
- target audience and purpose;
- current mental model;
- canonical terms and definitions;
- open questions;
- accepted risks;
- source conflicts;
- STE Coach findings and dispositions.

Do not ask the user to repeat information already present in the state or
available evidence.

## Round Workflow

1. Select the highest-impact gap in the current mental model.
2. Inspect available evidence that can resolve it.
3. If evidence is sufficient, update the model without asking.
4. Otherwise ask one focused question with neutral evidence framing. Include
   `unknown` and free-form correction paths. Give a recommendation only when
   its assumptions and evidence are explicit.
5. Update the round state from the answer.
6. Draft a synthesis that contains:
   - what the design is for;
   - how the relevant part works;
   - why it is designed that way;
   - what remains open or risky.
7. Invoke STE Coach in `Execution monitor` mode with the complete skill package,
   audience contract, evidence ledger, current synthesis, locked domain terms,
   source classifications, prior finding dispositions, and intended publication
   behavior.
8. Ask STE Coach to test whether the package guardrails prevented or detected
   problems demonstrated by this round. It must return structured findings, not
   a silent rewrite or design approval.
9. Accept a finding only when it is evidence-backed, applicable, and preserves
   technical meaning. Record rejected findings with a concise reason.
10. Revise the synthesis, then show the user the updated understanding and the
    next material gap.

## STE Coach Subagent Contract

The review round itself - the dispatch, the response contract, the single retry,
and the unavailability verdict - is owned by
[Review with the Simplified Technical English Coach](../../_base/_molecules/review-ste-coach.md).
Do not restate that protocol here.

This skill supplies the molecule's inputs for each round:

| Input | Value supplied by this skill |
| --- | --- |
| `coach-document` | The resolved `agents/ste-coach.agent.md`. |
| `package-path` | The repository and the full skill package path under review. |
| `stage` | The round number from `## Round State`. |
| `candidate` | The current synthesis, as untrusted evidence. |
| `candidate-identity` | The stable candidate identifier or content hash for this round. |
| `audience-contract` | Target audience, assumed knowledge, explanation purpose, consequence of misunderstanding, and publication behavior. |
| `locked-terms` | The exact terms and identifiers that must not change. |
| `claims` | Confirmed, inferred, and open claims, each with a stable claim identity, candidate location, supporting evidence summary, exact source location, source classification, and confidence. |
| `prior-findings` | Prior STE finding identities and this skill's dispositions. |
| `peer-review` | The Skill Coach findings, or an explicit statement that none were supplied. |
| `degraded-policy` | The policy below. |

**Reconciliation stays here.** This skill owns which findings it accepts. Never
apply a returned suggestion merely because it cites STE.

**Degraded policy.** When the molecule returns `Unavailable`, stop before final
output unless the user explicitly accepts degraded mode. In degraded mode, apply
the content-quality gate directly and disclose that no independent STE review
occurred.

## Completion

In `derived-summary` mode, completion requires:

- every material summary statement maps to the supplied canonical claim IDs;
- locked values and classifications are unchanged;
- no new claim appears;
- the final STE Coach review has no unresolved Blocker; and
- the content-quality gate passes.

Return the derived summary and traceability map directly to the calling skill.
Do not require end-user confirmation.

In interactive mode, the loop completes when:

- the purpose, boundary, actors, components, and relevant flow are clear;
- material dependencies and failure behavior are represented;
- required domain terms have stable definitions;
- every material claim is confirmed, inferred, or open;
- the user responds `Understanding confirmed`; and
- the final STE Coach review has no unresolved Blocker.

Hash or otherwise identify the final candidate before review. Emit only that
reviewed candidate. Any substantive change after final review invalidates the
review and requires another final STE Coach pass.

The user can stop at any time. Return the current model and unresolved gaps
without presenting them as complete.
