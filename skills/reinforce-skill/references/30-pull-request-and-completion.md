---
includes: []
requires-skills: []
---
# Pull Request, Completion, and Scenarios

## Publish

Before commit and push:

1. verify the diff contains only contract-approved files;
2. rebuild the exact-result record;
3. confirm validation and roast evidence match the current contents;
4. follow repository commit conventions;
5. push without rewriting unrelated history.

Open one pull request against the captured target branch. Include:

- approved recommendation and evidence boundary;
- behavior before and after;
- files changed;
- evaluator and validation result;
- final roast status and finding dispositions;
- residual risk and rollback;
- whether merge was preauthorized.

Do not claim that checks passed when no checks are configured or reported.

## Shepherd

Invoke `/shepherd` using its current input contract and supply the resolved
pull request, exact source commit, and caller deadline. Reinforcement owns the
review-validity loop around Shepherd:

1. capture the current source head before delegation;
2. let Shepherd address required checks and actionable feedback;
3. when Shepherd changes the head, invalidate prior validation, coach, and roast
   evidence;
4. rerun the implementation review loop on the new exact head;
5. push any required review corrections and return to Shepherd;
6. continue until the provider reports merge or a named blocker requires human
   action.

Never let Shepherd bypass the roast gate or merge authorization.

## Completion Gate

An exact head is eligible for merge only when:

- the provider reports the pull request open, non-draft, and mergeable;
- source and target commits match the fresh guarded snapshot;
- every configured required check passes;
- required approvals are effective;
- no requested changes or actionable thread remains;
- target-update requirements are satisfied;
- package validation passes on the source head;
- the final complete roast and accepted findings match the source head;
- merge is explicitly preauthorized by the initiating operator.

When merge is not preauthorized, return `SHIP_READY` with:

- approved recommendation and behavior before and after;
- exact source and target commits;
- evaluator and validation results;
- coach and final roast status;
- configured-check, approval, and review-thread state;
- residual risk and rollback.

When merge is preauthorized, perform the provider's guarded exact-head merge
without self-approval, then verify provider state `MERGED`.

Successful completion requires:

- provider-reported `MERGED`;
- no active Shepherd schedule for the pull request;
- final merge commit and timestamp;
- concise report of recommendation, behavior before and after, exact commits,
  evaluator, validation, coaches, roast, pull-request feedback,
  configured-check state, residual risk, and rollback.

Verify that the report addresses every item. When an item has no data, such as
no configured checks, state that explicitly rather than omitting it.

## Failure Outcomes

| Outcome | Required diagnostic | Operator action |
| --- | --- | --- |
| `HUMAN_DECISION_REQUIRED` | conflicting decision, evidence, allowed scope, and alternatives | choose one bounded alternative |
| `REVIEW_LOOP_BLOCKED` | cycle count, remaining blocking findings, and attempted dispositions | resolve manually, narrow scope, or abandon |
| `VALIDATION_FAILED` | exact command or evaluator condition, failure evidence, and changed files | authorize a correction or abandon |
| `PUBLISH_FAILED` | provider operation, unchanged local commits, and safe retry instruction | restore provider access or retry |
| `SHEPHERD_BLOCKED` | pull request, exact head, blocker, and preserved review evidence | resolve the external or human blocker |
| `SHIP_READY` | complete evidence payload from the completion gate | merge or leave open |
| `MERGED` | verified merge and completion report | no action |

Only `MERGED` is successful completion when merge was preauthorized.

## Scenario Tests

### Human-first handoff

Post-Mortem recommends `/reinforce-skill post-mortem`. Reinforcement requires
explicit invocation and approval before editing.

### Missing recommendation

An invocation without a current-session recommendation returns
`NO_ACTIONABLE_RECOMMENDATION` and does not inspect prior sessions.

### Installed copy

The target resolves first to an installed personal skill. Reinforcement locates
the canonical source package or returns `CANONICAL_SOURCE_REQUIRED`; it never
edits the installed copy as the source of truth.

### Roast correction

A `Must fix` finding is applied. Earlier validation and roast evidence become
stale, and the complete package is rerun through both gates.

### Shepherd mutation

Shepherd pushes a check fix. Reinforcement invalidates the prior roast and does
not merge until the new exact head passes validation and roast.

### Empty checks

The provider reports no checks. The report says no checks are configured or
reported; it never says checks passed.

### Merge authority

A clean exact head without preauthorization returns `SHIP_READY`. The same head
with recorded preauthorization may be merged and must be verified as `MERGED`.

### Conflicting feedback

Coach or roast findings require a behavior outside the approved contract.
Reinforcement returns `HUMAN_DECISION_REQUIRED` rather than widening scope.

### Correction-loop bound

Three correction cycles still leave an accepted blocking finding.
Reinforcement returns `REVIEW_LOOP_BLOCKED` and does not publish.
