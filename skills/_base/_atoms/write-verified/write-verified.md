---
name: write-verified
description: Write approved content to one destination, aborting when the destination changed after the preview, and restoring the previous state when the result does not match what was approved.
level: atom
allowed-tools: ["read", "edit"]
includes: []
used-by: ["_base/_molecules/write-approved/write-approved.md"]
---

# Verified Write

Write exactly the approved content to exactly one destination, and prove
afterwards that it landed. This atom owns the write and its verification. It
owns nothing about whether the content was approved.

Two things go wrong between an approval and a durable file: the destination
moves underneath the write, and the write does not produce what was approved.
This atom detects both.

## Inputs

| Input | Required | Meaning |
| --- | --- | --- |
| `destination` | yes | One resolved path. |
| `content` | yes | The exact approved content. |
| `preview-state` | yes | The destination's content, or its absence, as observed when the preview was produced. |
| `post-checks` | no | Checks the written result must pass, such as resolving every relative link. |

## Operation

1. **Re-read `destination` immediately before writing.** Compare it with
   `preview-state`. If it changed materially, abort, write nothing, and report
   the conflict. The approval described a destination that no longer exists.
2. **Preserve the previous state** so it can be restored.
3. **Stage before replacing.** When the destination already exists, write the
   candidate to a temporary repository-local file and validate it there, or
   otherwise validate the exact candidate, **before** replacing the existing
   artifact. Replacing first and checking afterwards leaves a window in which
   the destination holds content nobody approved.
4. **Write `content`, and only `content`.** Never merge, reformat, reorder, or
   add to it. Preserve unrelated sections that the approved content did not
   claim.
5. **Re-read the destination** and compare with `content`.
6. **Run `post-checks`** when supplied.
7. On any mismatch or failed check, **restore the preserved state** and report
   the failure.

## Output

| Field | Meaning |
| --- | --- |
| `status` | `Written`, `Aborted on conflict`, or `Restored on mismatch`. |
| `detail` | The observed difference, for every status other than `Written`. |

## Guarantees

- A write that cannot be verified is **undone**, not reported as a success and
  not left in place for someone to discover later.
- The destination is re-read immediately before the write, so a change between
  preview and write is caught rather than silently overwritten.
- Only the approved content is written. This atom never improves it.
- `Restored on mismatch` returns the destination to its exact previous state,
  including absence when the file did not exist.

## Boundaries

This atom does not obtain approval, decide the destination, generate the
content, or decide what happens after a failure. A caller that wants a fresh
approval after a restore requests one itself.
