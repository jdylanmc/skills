---
name: write-approved
description: Gate one write behind an explicit approval phrase, then perform it verifiably, restoring the previous state and requiring fresh approval when the result does not match what was approved.
level: molecule
includes: ["_base/_atoms/approval-gate-mutation/approval-gate-mutation.md","_base/_atoms/write-verified/write-verified.md"]
used-by: ["breakdown-code-architecture/references/50-persistence-and-update-gates.md","simplify-technical-language/SKILL.md","simplify-technical-language/references/40-output-and-writing-gate.md"]
allowed-tools: ["edit","read"]
---

# Approved and Verified Write

Take one proposed change from preview to a durable, verified file without ever
writing something the user did not explicitly approve. This molecule owns the
whole round trip: the gate, the write, the verification, and what happens when
verification fails.

## Required References

1. [Approval gate for a mutation](../../_atoms/approval-gate-mutation/approval-gate-mutation.md)
2. [Verified write](../../_atoms/write-verified/write-verified.md)

## Inputs

| Input | Required | Meaning |
| --- | --- | --- |
| `destination` | yes | One resolved path. |
| `content` | yes | The complete proposed content. |
| `approval-phrase` | yes | The exact phrase that authorizes this write. |
| `scope` | yes | Exactly what the approval authorizes. |
| `create-or-update` | yes | Which of the two this is, shown in the preview because they carry different risk. |
| `post-checks` | no | Checks the written result must pass. |
| `uncertainties` | no | Statements that will remain marked unknown after the write. |

## Operation

1. **Observe** the destination's current content, or its absence, and keep it as
   the preview state.
2. **Gate** with [Approval gate for a mutation](../../_atoms/approval-gate-mutation/approval-gate-mutation.md),
   previewing the destination, `create-or-update`, the complete content or a
   precise section-level diff, and any `uncertainties`. Stop on `Cancelled`.
3. **Write** with [Verified write](../../_atoms/write-verified/write-verified.md), passing the
   approved content and the preview state from step 1.
4. **On `Aborted on conflict`**, report that the destination changed after the
   preview, produce a fresh preview against the current state, and return to
   step 2. Never reuse the stale approval.
5. **On `Restored on mismatch`**, report the failure, show a corrected preview,
   and require fresh approval. Never retry the same write silently.

## Output

| Field | Meaning |
| --- | --- |
| `status` | `Written`, `Cancelled`, or `Failed`. |
| `detail` | The reason and the observed difference, when not `Written`. |

## Guarantees

- Nothing is written without an explicit approval that named this exact content
  and this exact destination.
- A stale approval is never spent. Any change to the content or the destination
  after the preview voids it.
- A write that cannot be verified leaves the destination exactly as it was.

## Boundaries

This molecule does not decide the destination, generate the content, or choose
the approval phrase. Those are the calling skill's, because they are what make
its gate specific rather than generic.
