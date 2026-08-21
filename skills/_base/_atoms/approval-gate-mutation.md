---
name: approval-gate-mutation
description: Preview one exact mutation, offer approve, revise, or cancel, and return authorization only on an explicit approval phrase. A general acknowledgement is never approval.
level: atom
allowed-tools: []
includes: []
used-by: ["_base/_molecules/write-approved.md","breakdown-to-tickets/references/70-preview-and-approval.md","discovery/references/70-chart-mode.md","discovery/references/80-work-mode-and-completion.md","setup-jdylanmc-skills/references/30-preview-write-and-rerun-policy.md","spec/references/60-publishing-and-idempotency.md"]
---

# Approval Gate for a Mutation

Show the user exactly what is about to change, and return authorization only
when the user says so explicitly. This atom owns the gate. It never performs the
mutation it authorizes.

The gate exists because an agent that infers consent will eventually infer it
wrongly, and the cost of that is measured in someone else's files.

## Inputs

| Input | Required | Meaning |
| --- | --- | --- |
| `preview` | yes | The complete, exact description of what will change: destination, whether the action creates or updates, and the full proposed content or a precise section-level diff. |
| `approval-phrase` | yes | The exact phrase that authorizes this mutation, such as `Approve and publish` or `Approve and write`. |
| `scope` | yes | Exactly what the approval authorizes. Anything outside it is unauthorized regardless of the answer. |
| `uncertainties` | no | Statements that will remain marked unknown after the mutation, shown so the user approves them knowingly. |

## Operation

1. Present `preview` in full. Never summarize it, never elide content the user
   would need in order to object, and never present a preview of something other
   than what will actually be written.
2. Offer exactly three choices:
   - `<approval-phrase>`;
   - `Revise`;
   - `Cancel`.
3. On `Revise`, take the revision, produce a fresh preview, and return to step 1.
   Repeat until approved or cancelled.
4. Return `Approved` only on `approval-phrase`, or on an equally explicit
   statement that names the mutation action. Return `Cancelled` on `Cancel`.

## Output

| Field | Meaning |
| --- | --- |
| `status` | `Approved`, `Revised`, or `Cancelled`. |
| `approved-preview` | The exact preview content the user approved. Empty unless `Approved`. |

## Guarantees

- **A general acknowledgement is not approval.** "Looks good", "sure", "ok",
  silence, and an emoji are not authorization. Neither is approval of a
  *previous* preview.
- **Approval binds to the previewed content.** If the content changes after the
  preview for any reason, the approval is void and a fresh preview and a fresh
  approval are required.
- **Approval binds to `scope`.** An approval never authorizes an adjacent,
  larger, or more convenient mutation.
- The gate never mutates anything, so a failure here can never leave a partial
  write behind.

## Boundaries

This atom does not perform the mutation, does not re-read the destination, does
not verify the result, and does not decide what the preview should contain. The
caller owns all four.
