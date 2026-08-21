---
includes: []
requires-skills: []
---
# Implementation and Review Loop

## Isolated Implementation

Start from the current target branch in a clean isolated worktree or branch.
Capture the initial target and source commits. Modify only contract-approved
files and preserve the target skill's canonical format and signature.

Make the smallest complete change that satisfies the evaluator. Prefer
improving routing or an existing skill over adding duplicate capability.
Update directly coupled callers only when unchanged callers would become
incorrect.

Use repository-native validation only. Verify relative links, frontmatter,
declared tools, required references, package signatures, and any existing
tests. Do not install new validation tools unless a changed dependency requires
them.

## Coach Gates

Run Skill Coach against the complete current package. Apply every blocking
finding and record the disposition of nonblocking findings.

When the target produces human-facing technical documentation, run Simplified
Technical English Coach after Skill Coach. Apply blocking findings that
preserve technical meaning.

If the package contains an exact embedded prompt, run Prompt Coach on that
prompt. Do not substitute a general package review.

Any applied coach finding invalidates earlier validation. Rerun the smallest
relevant validation before the roast.

## Roast Gate

Invoke `/roast-this-skill` against exactly one complete target package. The
roast is read-only and its evidence is valid only for the exact package
contents reviewed.

Classify findings:

- `Must fix`: apply before publication;
- `Should fix`: apply when accepted by the operator or when required by
  repository policy;
- `Consider`: record but do not block;
- evidence gap: resolve when it prevents a trustworthy decision.

After any applied finding:

1. rerun targeted validation;
2. rerun applicable coaches when their surface changed;
3. rerun `/roast-this-skill` on the new exact package.

Stop after three correction cycles and return `REVIEW_LOOP_BLOCKED` when an
accepted blocking finding remains, findings oscillate, or the roast cannot
produce a complete validated result. Never publish a knowingly blocked
package.

## Exact-Result Record

Before committing, record:

- target package and allowed files;
- source and target commits;
- evaluator result;
- validation commands and outcomes;
- coach findings and dispositions;
- final roast status and accepted-finding dispositions;
- remaining risks and rollback.

This record supports the pull-request description. It does not promote the
lesson or replace provider evidence.
