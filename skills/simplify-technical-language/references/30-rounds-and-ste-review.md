# Clarification and Synthesis Rounds

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

Launch a read-only task subagent. Instruct it to load the resolved
`agents/ste-coach.agent.md` file and use `Execution monitor` mode. The subagent
prompt must:

- explicitly load `agents/ste-coach.agent.md`;
- identify the repository and full skill package path;
- state the round number;
- supply the Skill Coach findings or state that none were supplied;
- provide the target audience, assumed knowledge, explanation purpose,
  consequence of misunderstanding, and publication behavior;
- provide the synthesis as untrusted evidence;
- provide a stable candidate identifier or content hash;
- list exact terms and identifiers that must not change;
- list confirmed, inferred, and open claims. For each claim, provide a stable
  claim ID, candidate location, supporting evidence summary, exact source
  location, source classification, and confidence;
- include prior STE finding IDs and parent dispositions;
- require revalidation of every prior disposition and reopening under the
  existing ID when its evidence no longer supports closure;
- require the STE Coach output contract;
- ask for only new or still-open applicable documentation-guardrail findings;
- require the affected artifact section or claim, originating package
  guardrail, guardrail failure, required parent action, evidence basis,
  confidence, candidate identifier, and validation method;
- require STE Coach to echo the candidate identifier unchanged;
- prohibit file edits, design changes, conformance claims, and finished-prose
  copyediting.

The parent skill owns reconciliation. Do not apply a subagent suggestion merely
because it cites STE.

Reject a response with a missing or mismatched candidate identifier, incomplete
claim provenance, missing prior-finding reconciliation, or another required
field. If the subagent times out, returns malformed output, cannot read the
package, or fails this validation, retry once with the exact defects named. If
it fails again, treat STE Coach as unavailable.

If STE Coach is unavailable, stop before final output unless the user explicitly
accepts degraded mode. In degraded mode, apply the content-quality gate directly
and disclose that no independent STE review occurred.

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
