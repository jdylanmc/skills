---
name: reinforce-skill
description: Applies one evidence-backed recommendation from the current session's post-mortem to one existing canonical skill package, validates and adversarially roasts the exact result, opens a pull request, and shepherds that pull request under an explicit merge authorization. Use when the operator invokes "/reinforce-skill <skill-name>" after reviewing a Post-Mortem recommendation. Do not use to create a new skill, edit multiple unrelated skills, apply unvalidated lessons, or bypass review and merge gates.
allowed-tools: ["read", "search", "execute", "edit", "task"]
---

# Reinforce Skill

Turn one approved Post-Mortem recommendation into one reviewed, reversible
skill-package change and carry its pull request through completion.

## Required References

Read and follow these files by phase:

1. Before accepting work:
   [Reinforcement contract](./references/10-reinforcement-contract.md)
2. Before editing or reviewing:
   [Implementation and review loop](./references/20-implementation-and-review.md)
3. Before publishing, shepherding, or reporting:
   [Pull request, completion, and scenarios](./references/30-pull-request-and-completion.md)

## Core Workflow

1. Resolve exactly one existing canonical skill package and one explicit
   evidence-backed recommendation from the current session's Post-Mortem
   report. Confirm the operator approved that recommendation for reinforcement.
2. Read repository instructions and establish a clean, isolated branch or
   worktree from the current target branch. Refuse overlapping user changes.
3. Build a reinforcement contract that preserves the target skill's strengths,
   names the behavior to change, limits scope, and defines evaluation,
   disconfirmation, rollback, and pull-request completion authority.
4. Make the smallest complete package change. Update directly coupled
   references or callers only when the contract proves they must change.
5. Run existing package validation, Skill Coach, and Simplified Technical
   English Coach when the skill produces human-facing technical content. Apply
   blocking findings.
6. Invoke `/roast-this-skill` on the exact target package. Apply accepted
   `Must fix` findings and explicitly accepted `Should fix` findings, then
   rerun validation and the roast after every head-changing correction.
7. Continue until the exact local result has no unresolved accepted blocking
   finding, or return a named blocker without publishing.
8. Commit and push only the approved files, open one pull request with the
   evidence, evaluation, roast result, and rollback plan, then invoke
   `/shepherd` for that pull request.
9. If Shepherd changes the source head, invalidate the prior validation and
   roast. Rerun both before declaring the pull request ship-ready.
10. Merge only when the initiating operator explicitly preauthorized merge and
    the exact-head completion gate passes. Otherwise stop at ship-ready. Verify
    provider-reported `MERGED` before returning success.

Constraint: Reinforce one existing skill from one approved recommendation.
Never infer promotion from Post-Mortem output, create a new skill, modify the
installed copy instead of the canonical source, merge without explicit
authorization, self-approve, weaken repository policy, or treat an empty check
set as checks passing.

## Tool Posture

`edit` and `execute` are required for isolated package changes, repository
validation, Git operations, and provider commands. `task` is required for the
read-only coaches. Invoke `/roast-this-skill` and `/shepherd` as composed
skills; each enforces its own tool and safety contract. Keep every effect
inside the approved package, branch, provider, and merge boundary.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
