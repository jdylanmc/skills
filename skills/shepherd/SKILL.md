---
name: shepherd
description: Autonomously shepherds exactly one already-open GitHub or Azure DevOps pull request on its writable source branch through human merge by fixing required checks and review feedback, committing and pushing verified changes, performing guarded rebases, and adaptively monitoring ship-ready state until the provider reports it merged. Use only when the user explicitly delegates bounded source-branch mutation and continuous monitoring. Do not use for status-only watching, opening or merging pull requests, one-time review, unsupported hosts, or branches the agent cannot update.
allowed-tools: ["read", "search", "execute", "edit", "manage_schedule"]
includes: ["_base/_molecules/chronicler/chronicler.md","shepherd/references/10-provider-and-pr-resolution.md","shepherd/references/15-provider-state-adapters.md","shepherd/references/20-shepherding-loop.md","shepherd/references/30-rebase-and-safety.md","shepherd/references/40-readiness-and-scenarios.md"]
---

# Shepherd

Own one existing pull request after it opens and keep working through human
merge. Detect the hosting platform from the repository remote, derive readiness
from that platform's live policies and review state, reconcile every
invalidated result after each push, and monitor a ship-ready pull request until
the provider reports it merged.

## Required References

Load references by phase. Read the first two before provider access. Read the
others before performing the action they govern:

1. [Provider detection and pull-request resolution](./references/10-provider-and-pr-resolution.md)
2. [Provider state adapters](./references/15-provider-state-adapters.md)
3. Before claiming or monitoring:
   [Shepherding loop](./references/20-shepherding-loop.md)
4. Before validation, editing, rebasing, committing, pushing, or provider
   mutation:
   [Rebase, push, and safety policy](./references/30-rebase-and-safety.md)
5. Before a readiness transition, human-facing output, recovery, or unusual
   state:
   [Readiness, errors, and scenario tests](./references/40-readiness-and-scenarios.md)
6. [Chronicler recording molecule](../_base/_molecules/chronicler/chronicler.md)

## Human-Facing Outputs

- Terminal and blocker reports are for the pull-request owner. Assume they
  understand the pull request's product intent, but explain provider policy,
  monitor, and canonical-state terms needed to decide whether to merge or take
  a human action.
- Recovery guidance is for a repository operator who understands Git and the
  repository's documented validation commands. State provider-specific
  prerequisites and safe restoration steps explicitly.
- Focused questions are for the product, architecture, security, or conflict
  decision-maker. Assume no knowledge beyond the cited pull-request evidence;
  identify the exact blocked decision, constraints, alternatives, and response
  needed.
- Review replies are for the thread's reviewers. Assume familiarity with the
  reviewed code, but identify the addressed concern, pushed commit or evidence,
  validation, and any decision that still belongs to the reviewer.

Use repository and provider terminology consistently. Preserve exact branch
names, commit identifiers, commands, check names, and policy names. Define an
unfamiliar abbreviation on first use when the output can be read independently;
never invent an expansion.

## Core Workflow

1. Confirm the repository is clean enough to work safely, detect GitHub or
   Azure DevOps from the selected remote, and resolve the target pull request
   from a supplied URL or number or from the current branch. Verify the
   scheduling runtime satisfies the monitor conformance gate, claim one
   provider-wide schedule marker for the immutable provider, repository, and
   pull-request identifiers, and confirm the monitoring delegation and exact
   mutation lease for that pull request. Accept a caller-supplied lease or
   self-issue the six-hour default.
2. Capture a consistency-guarded live state snapshot: source and target commits, mergeability,
   required policies and checks, approvals, requested changes, unresolved
   review threads, and branch protection or update requirements.
3. Select the highest-priority blocker: remote-head divergence, merge conflict,
   failed required check, requested change, or unresolved actionable thread.
4. Rebase automatically when the source branch conflicts with or must be
   updated from the target branch. Push rewritten history only through the
   guarded lease procedure in the safety reference.
5. Investigate actionable failures and review feedback, inspect relevant code,
   make the smallest complete fix, and validate it under the execution boundary
   in the safety reference before committing and pushing.
6. After every push or remote state change, discard the stale snapshot and
   rebuild it. Continue while a required signal is pending or a resolvable
   blocker remains.
7. When the readiness contract is satisfied, enter
   `SHIP_READY_MONITORING`; do not return success or end the run. Prefer
   provider-native observation. Otherwise use the configured polling policy,
   rebuilding the guarded provider snapshot to scan for new feedback, check or
   policy failures, source or target movement, approval invalidation, and
   rebase requirements.
8. If monitoring finds a blocker, leave `SHIP_READY_MONITORING`, apply the
   normal prioritization, safety, validation, commit, push, and refresh rules,
   then re-enter monitoring only after the readiness contract is satisfied
   again.
9. Stop successfully only when a fresh guarded snapshot reports `MERGED`.
   Return the pull-request link and a concise completion report covering the
   merged commit, final readiness evidence, and Shepherd actions.

Constraint: Manage one already-open pull request through provider-reported
merge. Never create or merge it, enable auto-merge, weaken repository policies,
dismiss a review, fabricate approval, bypass a required check, edit unrelated
work, or operate against an unsupported host. The broad execution capability
is limited to repository reads, existing validation, isolated source-branch
edits and commits, guarded pushes, permitted check reruns, evidence-based
review replies or thread resolution, and provider monitoring.

## Tool Posture

`manage_schedule` is required because monitoring must survive the end of an
individual conversational turn. The schedule service, not a clone-local file,
is the ownership authority. Use one immutable marker for the resolved pull
request, reject duplicate or ambiguous ownership, and disarm the schedule on
every terminal outcome. Monitoring may remain active until merge, but mutation
authority always has an explicit expiry and allowed-action set. Until a fresh
snapshot proves a blocker and the mutation lease is current, scheduled ticks
perform provider reads only. Re-enter mutation tools only after confirming the
canonical schedule, immutable pull-request identity, writable source ref,
effective provider and Git principals, current lease, and current guarded
epoch.

`execute` is required for authenticated provider command-line interface
queries, Git operations, and repository-defined validation. Keep those uses
inside the provider, mutation, and credential-isolation boundaries above.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
