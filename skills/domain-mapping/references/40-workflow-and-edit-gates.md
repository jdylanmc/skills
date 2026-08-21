---
includes: []
requires-skills: []
---
## Workflow

1. **Locate context artifacts.** Determine whether the repository has no recorded context, one context, or multiple contexts.
2. **Frame the question.** Identify the disputed term, definition, ownership, lifecycle, or boundary.
3. **Gather evidence.** Read relevant context files and documentation, then search code for actual names and behavior.
4. **Surface conflicts.** Classify disagreements using the investigation categories.
5. **Propose a resolution.** Choose a terminology resolution outcome, recommend canonical language, and identify discouraged aliases when useful.
6. **Test the proposal.** Use concrete normal and edge-case scenarios.
7. **Identify ownership.** Name the exact `CONTEXT.md` that should own the definition. Ask if ownership is ambiguous.
8. **Request confirmation.** Present the exact term, definition, aliases, owner, and any structural change for explicit approval.
9. **Edit immediately after confirmation.** Apply only the confirmed change and report the resulting file.
10. **Consider an ADR separately.** Apply the strict ADR gate and request distinct approval when the decision qualifies.

## Glossary Edit Gate

Never create or modify a glossary based on inferred agreement. Explicit confirmation must unambiguously approve the proposed canonical term, definition, owner, and any discouraged aliases or structural changes.

Discussion, partial agreement, silence, or moving to another topic is not confirmation.

After confirmation, update the owning `CONTEXT.md` without postponing the edit. Do not repeatedly ask for approval once the exact proposal has been accepted.

If an existing glossary is malformed, preserve unrelated content and formatting. Make the smallest targeted edit necessary to record the confirmed resolution; do not normalize, reorganize, or rewrite neighboring entries unless separately approved.

## ADR Edit Gate

Glossary confirmation does not authorize an ADR. Create an ADR only after:

- the decision passes every part of the ADR qualification gate; and
- the user explicitly approves creating that ADR.

Approval to discuss, recommend, or draft an ADR is not approval to write it.
