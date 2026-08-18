---
name: shepherd
description: Autonomously shepherds exactly one already-open GitHub or Azure DevOps pull request on its writable source branch by fixing required checks and review feedback, committing and pushing verified changes, and performing guarded rebases when necessary. Use only when the user explicitly delegates mutating pull-request ownership through human merge approval. Do not use for status-only watching, opening or merging pull requests, one-time review, unsupported hosts, or branches the agent cannot update.
allowed-tools: ["read", "search", "execute", "edit"]
---

# Shepherd

Own one existing pull request after it opens and keep working until it is ready
for a human to merge. Detect the hosting platform from the repository remote,
derive readiness from that platform's live policies and review state, and
reconcile every invalidated result after each push.

## Required References

Read and follow these files in order:

1. [Provider detection and pull-request resolution](./references/10-provider-and-pr-resolution.md)
2. [Provider state adapters](./references/15-provider-state-adapters.md)
3. [Shepherding loop](./references/20-shepherding-loop.md)
4. [Rebase, push, and safety policy](./references/30-rebase-and-safety.md)
5. [Readiness, errors, and scenario tests](./references/40-readiness-and-scenarios.md)

## Human-Facing Outputs

- Terminal reports help the pull-request owner decide whether to merge or which
  blocker needs human action.
- Recovery guidance helps a repository operator preserve work and restore a
  safe state.
- Focused questions obtain one missing product, architecture, security, or
  conflict decision.
- Review replies explain how a pushed commit or evidence addresses a thread.

Use repository and provider terminology consistently. Preserve exact branch
names, commit identifiers, commands, check names, and policy names. Define an
unfamiliar abbreviation on first use when the output can be read independently;
never invent an expansion.

## Core Workflow

1. Confirm the repository is clean enough to work safely, detect GitHub or
   Azure DevOps from the selected remote, and resolve the target pull request
   from a supplied URL or number or from the current branch.
2. Capture a consistency-guarded live state snapshot: source and target commits, mergeability,
   required policies and checks, approvals, requested changes, unresolved
   review threads, and branch protection or update requirements.
3. Select the highest-priority blocker: remote-head divergence, merge conflict,
   failed required check, requested change, or unresolved actionable thread.
4. Rebase automatically when the source branch conflicts with or must be
   updated from the target branch. Push rewritten history only through the
   guarded lease procedure in the safety reference.
5. Investigate actionable failures and review feedback, inspect relevant code,
   make the smallest complete fix, and run the repository's existing targeted
   validation before committing and pushing.
6. After every push or remote state change, discard the stale snapshot and
   rebuild it. Continue within the bounded loop while a required signal is
   pending or a resolvable blocker remains.
7. Stop without merging when the provider reports the pull request mergeable,
   every required policy and check passes, required approvals are present, no
   requested changes remain, and no actionable review thread is unresolved.
   Report the pull-request link and concise merge-ready evidence.

Constraint: Manage one already-open pull request. Never create or merge it,
weaken repository policies, dismiss a review, fabricate approval, bypass a
required check, edit unrelated work, or operate against an unsupported host.
The broad execution capability is limited to repository reads, existing
validation, isolated source-branch edits and commits, guarded pushes, permitted
check reruns, and evidence-based review replies or thread resolution.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
