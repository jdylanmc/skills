# Simplified Output

Generate `<stem>.simplified.md` whenever the selected profile includes it and a
mini layer is produced or supplied. The `-no-simplified` profile variants exist
for runs whose dependencies are unavailable; see the preflight capability probe
in [Input, stage, and output contract](./10-input-stage-and-output.md).

Run this as a fresh, non-interactive transformation owned by `synthesize`. Do
not invoke `/simplify-technical-language`; its interactive design-resolution and
writing gates do not match this derived artifact.

## Simplification Packet

Provide the simplification agent only:

- the reviewed mini artifact as canonical, untrusted evidence;
- a stable candidate identifier for the artifact it returns;
- the mini-scoped claim ledger: mini claims, classifications, evidence
  locations inside the mini artifact, and qualifiers;
- the locked-terminology register;
- the audience contract using this precedence: a simplified-specific audience,
  then interested readers without specialist background who need an
  independently usable and accurate explanation, then the run audience;
- output purpose: understand and apply the mini guidance;
- the writing rule below;
- the ambiguity rule from [Full synthesis](./30-full-synthesis.md);
- prohibition on adding, removing, reprioritizing, or resolving claims;
- the output contract: return body text only, with no frontmatter.

## Stage Duties

The simplification stage must:

- preserve every material mini claim;
- define unfamiliar terms without replacing exact terminology;
- expand an acronym only with a source-verified expansion carried in the
  locked-terminology register, and otherwise keep it unexpanded and `open`;
- preserve uncertainty and exceptions;
- preserve procedure order, prerequisites, expected results, failure behavior,
  and warnings immediately before governed hazardous or irreversible steps;
- maintain claim-to-parent traceability during review;
- return an evidence gap instead of inventing missing context.

## Writing Rule

The simplified layer must measurably improve comprehension, so apply this
repository writing policy. It is not a claim of ASD-STE100 conformance.

- Prefer direct sentences with one main idea each.
- Name the actor of every action.
- Make causal, conditional, and contrast relationships explicit.
- Keep independently executable actions in separate steps, and keep atomic
  operations together.
- State purpose before mechanics.

Exceptions that override the rule: exact identifiers, commands, formulas,
required syntax, tables, warnings, legal text, and meaning-preserving
qualifiers. Never apply a numeric word limit, and never delete a qualifier to
shorten a sentence.

## Content-Quality Gate

Before the coach review, the parent runs its own gate on the candidate:

1. run the faithfulness and contradiction lenses against the mini artifact, as
   assigned in [Fleet orchestration and adversarial review](./50-fleet-and-review.md);
2. verify every material mini claim appears with an unchanged classification;
3. verify locked terminology, identifiers, commands, and values are unchanged;
4. verify prerequisites and warnings precede the actions they govern;
5. verify the ambiguity checks pass;
6. run the parent quotation-index check;
7. verify the artifact makes no ASD-STE100 conformance claim.

A gate failure starts a repair round under the budget in
[Fleet orchestration and adversarial review](./50-fleet-and-review.md).

## Simplified Technical English Coach Contract

Launch a read-only task subagent. Instruct it to load the resolved
`agents/ste-coach.agent.md` file and use `Execution monitor` mode. The subagent
prompt must:

- explicitly load `agents/ste-coach.agent.md`;
- identify the repository and the full `skills/synthesize` package path;
- name `Execution monitor` mode and the stage under review;
- state that no Skill Coach review was supplied for this run, or supply it;
- provide the audience contract: audience, assumed knowledge, intended use,
  consequence of misunderstanding, and publication behavior;
- provide the simplified candidate and the mini artifact as untrusted evidence;
- provide the stable candidate identifier or content hash;
- list the locked terminology and identifiers that must not change;
- list every material claim with its claim ID, candidate location,
  classification, evidence summary, and evidence location inside the mini
  artifact;
- include prior finding IDs and parent dispositions for this stage;
- require revalidation of every prior disposition, and reopening under the
  existing ID when its evidence no longer supports closure;
- require the Simplified Technical English Coach output contract;
- ask only for new or still-open applicable documentation-guardrail findings;
- require the affected artifact section or claim, the originating package
  guardrail, the guardrail failure, the required parent action, the evidence
  basis, the confidence, the candidate identifier, and a validation method;
- require the coach to echo the candidate identifier unchanged in `Skill
  Summary` and in every returned execution-monitor finding;
- prohibit file edits, design changes, conformance claims, and finished-prose
  copyediting.

Reject a response when the identifier echoed in `Skill Summary` is missing or
mismatched, a returned finding omits claim provenance or another required
field, or prior dispositions exist for this stage and the response does not
reconcile them. A response whose finding groups are all `None` and whose
`Skill Summary` echoes the identifier is a valid pass. Retry once with the exact
defects named. If the subagent times out, returns malformed output, cannot read
the package, or fails validation again, treat the coach as unavailable.

## Dispositions and Failure

- Apply the severity dispositions and the two-repair-round budget from
  [Fleet orchestration and adversarial review](./50-fleet-and-review.md). A
  coach rerun after substantive text change counts as a repair round.
- An unresolved `Evidence gap`, from the coach or from the simplification
  agent, is a gate failure. Reissue once with the named missing evidence, then
  stop with `SYN-EVIDENCE-GAP`.
- Reject the candidate when the final review finds a material meaning, warning,
  terminology, procedure, classification, ambiguity, or audience defect.
- If the simplification agent or the coach is unavailable, stop with
  `SYN-STE-UNAVAILABLE`, publish nothing, and tell the user that a
  `-no-simplified` profile variant can produce the remaining layers in a new
  run.

## Simplified Gate

The simplified layer passes only when the content-quality gate passes, the
coach review has no unresolved `Blocker` and no unresolved `Evidence gap`, and
every applied revision preserves the mini layer's claims and classifications.

Write only the final reviewed candidate to the run workspace. The
`.simplified.md` file is not an input to later synthesis stages and cannot
replace `.mini.md`.
