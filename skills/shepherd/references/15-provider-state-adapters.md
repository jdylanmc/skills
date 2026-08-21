---
includes: []
requires-skills: []
---
# Provider State Adapters

Normalize provider data into one canonical snapshot. Do not infer a passing
state from a missing field, summary string, ambiguous native value, or partial
page.

## Consistency Guard

Provider queries are not atomic. Use a provider revision that demonstrably
covers policies, results, reviews, votes, and threads. When no such revision
exists, collect and reread stable revision or pagination tokens for each
required collection.

Build every snapshot as a guarded epoch:

1. Read source commit, target commit, lifecycle state, draft status, and every
   available provider and collection revision.
2. Retrieve every required page of policies, checks, reviews, votes, and
   threads.
3. Associate each result with the captured source commit when the provider
   exposes that association. Another commit is `STALE`.
4. Reread every guard and collection revision.
5. Discard the snapshot when any revision changed, pagination was not
   snapshot-consistent, or consistency cannot be proven.

During monitoring, compare prior identifiers only after the new epoch passes
the guard. A change invalidates prior readiness and requires full
classification; it proves neither safety nor failure by itself.

Pagination gaps, authorization gaps, unsupported policy shapes, absent
required state, unrecognized native values, and results whose commit
association cannot be established are `UNKNOWN`, never successful. Required
`UNKNOWN` state cannot satisfy readiness.

## Canonical Snapshot

Keep lifecycle and draft status separate:

- lifecycle: `OPEN`, `CLOSED`, or `MERGED`;
- draft status: `DRAFT` or `READY_FOR_REVIEW`;
- mergeability: `MERGEABLE`, `CONFLICTING`, `BLOCKED`, or `UNKNOWN`;
- required result: `PENDING`, `PASS`, `FAIL`, `CANCELLED`, `SKIPPED`, `STALE`,
  or `UNKNOWN`;
- review: `APPROVED`, `CHANGES_REQUESTED`, `PENDING`, `DISMISSED`, or
  `UNKNOWN`;
- thread: `ACTIONABLE`, `ADDRESSED`, `OUTDATED`, `ADVISORY`, or `UNKNOWN`.

`SKIPPED` is successful only when the active provider rule explicitly accepts
that skipped result for the captured commit. Otherwise it is blocking; when
acceptability cannot be proven, normalize it to `UNKNOWN`.

An actionable thread requests a concrete change, correction, answer, or proof
that still applies to the captured source commit. Bot feedback is advisory
unless an active required rule or repository instruction makes it blocking.
An outdated code position does not prove that its concern was addressed.

## GitHub Mapping

Use authenticated pull-request, checks, target-branch protection or rulesets,
reviews, deployments, merge queue, and all paginated review-thread data.

| Native evidence | Canonical value |
| --- | --- |
| `state=OPEN` | lifecycle `OPEN` |
| `state=CLOSED`, `merged=false` | lifecycle `CLOSED` |
| `merged=true` or `state=MERGED` | lifecycle `MERGED` |
| `isDraft=true` | draft `DRAFT` |
| `isDraft=false` | draft `READY_FOR_REVIEW` |
| mergeable clean/mergeable | `MERGEABLE` |
| conflicting/dirty | `CONFLICTING` |
| blocked by an active rule | `BLOCKED` |
| expected, queued, pending, waiting, requested, or in progress | `PENDING` |
| successful, neutral, or skipped only when the active rule accepts it | `PASS` |
| failed, error, timed out, or action required | `FAIL` |
| cancelled | `CANCELLED` |
| skipped with provider-policy acceptance proven | `SKIPPED` |
| result associated with another head commit | `STALE` |
| approved review still effective for the head | `APPROVED` |
| effective changes-requested review | `CHANGES_REQUESTED` |
| dismissed review | `DISMISSED` |

Every unlisted or contradictory value is `UNKNOWN`. Determine required checks
from active rules, not familiar job names. Treat required conversation
resolution, target updates, deployments, queues, and approval invalidation as
readiness inputs when active rules require them.

## Azure DevOps Mapping

Use authenticated pull-request metadata, current source and target commits,
applicable policy configurations and evaluations, reviewer votes, statuses,
iterations, and all paginated threads.

| Native evidence | Canonical value |
| --- | --- |
| active pull request | lifecycle `OPEN` |
| abandoned pull request | lifecycle `CLOSED` |
| completed pull request | lifecycle `MERGED` |
| draft flag set | draft `DRAFT` |
| draft flag clear | draft `READY_FOR_REVIEW` |
| no conflicts and no blocking update requirement | `MERGEABLE` |
| provider reports conflicts | `CONFLICTING` |
| active blocking policy prevents completion | `BLOCKED` |
| applicable policy queued, running, waiting, or not yet evaluated | `PENDING` |
| applicable policy approved or succeeded for current iteration | `PASS` |
| applicable policy rejected, failed, or broken | `FAIL` |
| applicable policy cancelled | `CANCELLED` |
| skipped with policy acceptance proven | `SKIPPED` |
| evaluation tied to another iteration or source commit | `STALE` |
| effective vote approves | `APPROVED` |
| effective vote rejects or waits for author | `CHANGES_REQUESTED` |
| required reviewer has not cast an effective vote | `PENDING` |

Every unlisted or contradictory value is `UNKNOWN`. Recognize only enabled,
applicable blocking policies as required. Preserve optional policies as
advisory. Never assume all non-positive votes are equivalent; if current vote
semantics cannot be proven, use `UNKNOWN`.

## Mutation Support

Before a review reply, thread resolution, focused question, monitoring
transition, or terminal report, apply this content gate:

1. Verify every claim against the final guarded snapshot or cited repository
   evidence.
2. Preserve exact identifiers, commands, values, provider labels, and
   qualifiers.
3. Preserve canonical labels and explain them in plain language.
4. State repository, pull request, source ref, commit, actor, condition, and
   observable result when needed.
5. Include prerequisites, warnings, verification, and recovery information.
6. Separate outcome, evidence, remaining risk, and next action.
7. Reject stale, incomplete, unsupported, ambiguous, or placeholder content.

Before changing code, confirm that provider, repository, source ref, source
commit, canonical schedule, and mutation lease still match the guarded epoch.
Adapters may rerun a failed required check, reply with factual evidence, or
resolve a thread only after the concern is directly addressed and no reviewer
judgment remains.

Never dismiss a review, alter a vote, mark a required result successful,
disable policy, or resolve a contradictory or decision-bearing thread.
Provider-reported `MERGED` is the only successful completion signal.
