# Provider State Adapters

Normalize provider data into one canonical snapshot. Do not infer a passing
state from a missing field, a summary string, or a partially retrieved page.

## Consistency Guard

Provider queries are not atomic. Build every snapshot as a guarded epoch:

1. Read the pull request's source commit, target commit, state, and provider
   update marker.
2. Retrieve every required page of policies, checks, reviews, votes, and
   threads.
3. Associate each result with the captured source commit when the provider
   exposes that association. A result for another commit is `STALE`.
4. Reread the source commit, target commit, state, and update marker.
5. Discard the snapshot if any guard value changed while it was assembled.

During `SHIP_READY_MONITORING`, also retain the prior guarded snapshot's source
commit, target commit, provider update marker, review identifiers, thread
identifiers, and required-result identifiers. Compare them only after the new
epoch passes the consistency guard. A detected change invalidates the prior
readiness decision and requires full blocker classification; it is not proof
that the change is safe or unsafe by itself.

Pagination, authorization gaps, unsupported policy shapes, absent required
state, and results whose commit association cannot be established are
`UNKNOWN`, never successful. A snapshot containing required `UNKNOWN` state
cannot satisfy the ship-ready contract.

## Canonical States

Normalize provider values into:

- pull request: `OPEN`, `DRAFT`, `CLOSED`, or `MERGED`;
- mergeability: `MERGEABLE`, `CONFLICTING`, `BLOCKED`, or `UNKNOWN`;
- required result: `PENDING`, `PASS`, `FAIL`, `CANCELLED`, `STALE`, or
  `UNKNOWN`;
- review: `APPROVED`, `CHANGES_REQUESTED`, `PENDING`, `DISMISSED`, or
  `UNKNOWN`;
- thread: `ACTIONABLE`, `ADDRESSED`, `OUTDATED`, `ADVISORY`, or `UNKNOWN`.

An actionable thread requests a concrete change, correction, answer, or proof
that still applies to the captured source commit. Bot feedback is advisory
unless a required policy, required reviewer, or repository instruction makes it
blocking. Outdated code-position threads are not automatically addressed:
inspect whether their concern still applies.

## GitHub Adapter

Use authenticated GitHub pull-request, checks, branch-rule or ruleset, review,
and review-thread data. Retrieve all paginated review threads. Determine
required checks from active target-branch protection or rulesets, not from
familiar job names. Preserve the provider's association between check runs or
statuses and the captured source commit.

Treat merge queues, required conversation resolution, required target updates,
required deployments, and approval invalidation as readiness inputs when the
active rules require them. If the authenticated identity cannot inspect the
applicable rule or required-check state, fail closed.

## Azure DevOps Adapter

Use authenticated pull-request metadata, current source and target commits,
blocking policy configurations and evaluations, reviewer votes, statuses, and
all paginated threads. Recognize only enabled, applicable blocking policies as
required; retain optional policies as advisory evidence.

Map effective reviewer votes using current Azure DevOps semantics rather than
assuming every non-positive vote is equivalent. Requested changes remain
blocking until the effective vote or policy state changes. Tie build and status
policy evaluations to the current pull-request iteration or source commit when
that evidence is available. If a blocking evaluation cannot be proven current,
normalize it to `UNKNOWN`.

## Mutation Support

Before posting a review reply, resolving a thread, asking a focused human
decision question, or returning an authoritative monitoring transition or
terminal outcome, apply the human-facing content gate:

1. Verify every claim against the final guarded snapshot or cited repository
   evidence.
2. Preserve exact identifiers, commands, values, provider labels, and
   qualifiers.
3. Preserve canonical state labels and explain them in plain language.
4. State the repository, pull-request ID, source ref, commit, actor, condition,
   and observable result when they are needed to avoid ambiguity.
5. Confirm prerequisites, warnings, verification, and recovery information are
   present when the reader must act.
6. Separate the outcome, supporting evidence, remaining risk, and next action.
7. Reject unsupported claims, unclear references, unexplained placeholders,
   and conclusions based on stale or incomplete evidence.

Do not publish the text or resolve the thread when this gate fails.

A focused question must identify the exact pull request, blocked decision,
relevant evidence, constraints, unresolved alternatives, and response needed.
Do not prefer an alternative unless repository evidence supports it, and never
collapse alternatives that materially differ in product behavior,
architecture, security posture, or conflict intent.

Before changing code, confirm the provider, repository, and source ref are still
the ones captured by the guarded epoch. Provider adapters may:

- rerun a failed required check through a supported provider operation;
- reply to a review thread with a factual explanation or pushed commit;
- resolve a thread only after the pushed change or explanation directly
  addresses it and no reviewer judgment remains outstanding.

Never dismiss a review, alter a reviewer vote, mark a required result
successful, disable a policy, or resolve a contradictory or decision-bearing
human thread.

Provider-reported `MERGED` is the only successful completion signal. A merge
button becoming available, an accepted or approved review, an enabled merge
queue, or a merge commit appearing locally does not substitute for the pull
request state changing to `MERGED`.
