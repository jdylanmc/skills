## Investigation Examples

### Same Name, Different Meaning

Documentation calls both a customer's request and the warehouse instruction an "Order." Code shows separate identifiers, owners, and lifecycles.

Classify this as a meaning and boundary disagreement. Resolve it as separate concepts, such as **Customer Order** and **Fulfillment Order**, then test cancellation, partial fulfillment, and replacement scenarios.

### Multiple Names, One Concept

Conversation uses "member," documentation uses "subscriber," and code uses `AccountHolder`, but all evidence points to one identity with one lifecycle.

Classify this as a naming disagreement. Resolve it as a synonym outcome, select the strongest domain term, and list misleading aliases only if they are likely to recur.

### Definition Too Broad

A glossary defines "Shipment" as anything leaving a facility, while code and operational rules distinguish transfers from customer deliveries.

Classify this as a meaning disagreement. Resolve it with a revised definition or separate concepts, depending on identity, rules, and ownership.

### Code Conflicts with Intent

Code names a state `Complete`, but documented rules and user explanation show that payment can still fail afterward.

Do not treat the identifier as authoritative. Present the discrepancy and test whether the canonical state should be **Submitted**, **Provisionally Complete**, or another confirmed term.

## Scenario Tests

A valid execution should satisfy these behaviors:

- **Empty repository:** With no context artifacts, propose a root `CONTEXT.md`, not a context map.
- **Premature split:** With two software modules but one shared domain language and lifecycle, remain single-context.
- **Approved second context:** With a clearly distinct bounded context, explain the migration and wait for explicit approval before creating local glossaries or a map.
- **Ambiguous ownership:** With a term used by two contexts and insufficient evidence, ask which context owns it rather than duplicating it.
- **Unconfirmed definition:** Present a plausible canonical term but do not edit until the user explicitly confirms the exact proposal.
- **Malformed glossary:** Change only the confirmed entry and preserve unrelated defects.
- **ADR gate failure:** Do not offer an ADR for a surprising choice that is inexpensive to reverse.
- **ADR category temptation:** Do not offer an ADR for a lock-in technology when no credible alternative was considered.
- **ADR numbering:** Given `0002-choice.md`, `notes.md`, and `12-old.md`, choose `0003`.
- **Evidence conflict:** Report disagreement among conversation, documentation, and code and seek resolution instead of silently ranking sources.
