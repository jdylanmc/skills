---
name: artifact-reference
description: Keep an artifact reachable by locator and refuse a reproduced artifact body, so a bounded document points at evidence instead of duplicating it.
level: atom
allowed-tools: ["execute"]
includes: ["_base/_atoms/artifact-reference/artifact-reference.mjs"]
composes: []
used-by: ["_base/_molecules/persist-bounded-handoff/persist-bounded-handoff.md"]
---

# Artifact Reference

Keep the pointer to an artifact and refuse the artifact's body. This atom owns
the difference between the two. It owns nothing about which artifacts matter.

A specification, a plan, an Architecture Decision Record, an issue, a commit,
and a diff already exist and are already authoritative. Copying one into a
second document creates a second version that starts drifting immediately, and
the copy is the one the next reader trusts.

## Required Files

1. [Reference check entry point](./artifact-reference.mjs)

## Operation

```text
node <atoms>/artifact-reference.mjs --stdin
```

The payload is `{"references": [...], "bodies": {"<field>": "<text>"}}`. Exit
`0` prints the normalized `references` and the `bodies_checked`. Any non-zero
exit prints a stable failure category on standard error. Check availability
with `--probe`, which prints `handoff: available`.

## Reference Shape

A reference is either a locator string or `{"reference": "...", "note": "..."}`.

| Field | Required | Meaning |
| --- | --- | --- |
| `reference` | yes | One whitespace-free locator: a URL, a repository-relative path, `#123`, or a commit. At most 300 UTF-8 bytes. |
| `note` | no | One short line saying why the artifact matters. At most 300 UTF-8 bytes. |

Prose belongs in `note`, never in `reference`. A locator with whitespace is
rejected, which is what keeps a reference machine-checkable rather than a
sentence that happens to contain a link.

At most 50 references are accepted.

## Body Exclusion

A checked body may hold a short command or snippet. It may not hold a fenced
block longer than 20 lines or 2000 bytes; that is `inlined_artifact_body`, and
the fix is a reference. An unterminated fenced block is malformed input, not a
body to measure.

## Output

| Field | Meaning |
| --- | --- |
| `references` | The normalized references, in the order supplied. |
| `bodies_checked` | The names of the bodies that passed, sorted. |

## Guarantees

- Every supplied reference survives. Exclusion applies to bodies, never to
  pointers.
- A reproduced artifact is refused with a category that names the field, so the
  caller knows exactly what to replace with a link.
- The check is pure: nothing is fetched, resolved, or written.

## Boundaries

This atom does not verify that a locator resolves, does not decide which
artifacts are worth referencing, and does not summarize an artifact it refused.
A locator is the caller's claim; this atom only keeps it in a shape that a
reader and a test can both follow.
