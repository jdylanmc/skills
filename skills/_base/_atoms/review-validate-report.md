---
name: review-validate-report
description: Validate one returned report against one declared contract and return either a pass or the exact named defects. Never repairs, summarizes, or accepts a partially valid report.
level: atom
allowed-tools: []
includes: []
---

# Review Validate Report

Check one returned report against the contract the caller declared for it, and
return either a pass or the exact defects by name. This atom decides whether a
report is *well formed*. It never decides whether the report is *right*.

Naming the defects is the whole point. A caller that retries needs to tell the
next run exactly what was wrong, and a caller that gives up needs to tell its
reader exactly what was not verified.

## Inputs

| Input | Required | Meaning |
| --- | --- | --- |
| `report` | yes | The returned text, unchanged. |
| `required-headings` | no | Headings that must each appear exactly once, in the given order. |
| `required-fields` | no | Field names that must appear with a non-empty value. |
| `terminator` | no | A line that must be the final line. |
| `echo-identity` | no | A value the report must reproduce **unchanged**. Supply the value, and optionally the sections it must appear in and whether every returned finding must carry it equal to that value. A present-but-different value is a mismatch, not a pass. |
| `required-per-finding` | no | Fields every returned finding must carry, such as evidence, location, confidence, or validation method. |
| `prior-dispositions` | no | Finding identities the report must reconcile rather than silently drop. |

## Counting Rule

Count a heading, a field, or a terminator only when it starts at the beginning
of a line and sits **outside every fenced block**. Quoted evidence inside a
fenced block never counts, even when it reproduces a heading, a field name, or
a terminator.

Without this rule a report that quotes its own contract as evidence validates
itself, and a report that quotes a terminator truncates itself.

## Output

| Field | Meaning |
| --- | --- |
| `status` | `Valid` or `Invalid`. |
| `defects` | Empty when valid. Otherwise one entry per failure, each naming the specific missing, duplicated, misordered, empty, or mismatched item. |

Defect categories: `Missing heading`, `Duplicate heading`, `Misordered heading`,
`Missing field`, `Empty field`, `Missing terminator`, `Identity mismatch`,
`Incomplete finding`, `Unreconciled prior disposition`.

## Guarantees

- A report is valid only when **every** declared requirement passes. There is
  no partial pass.
- A report whose findings are all empty is **valid** when its structure holds.
  An empty result is a real result and is never treated as a failure.
- The report is never modified, repaired, reformatted, or summarized.
- Every defect names the specific item, never a category alone, so a retry can
  state exactly what to fix.

## Boundaries

This atom does not spawn the run that produced the report, does not retry, does
not judge whether a finding is correct or applicable, and does not decide what
happens after an invalid result. Those belong to the caller.
