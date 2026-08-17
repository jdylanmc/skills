# Acceptance Criteria and Unresolved Items

## Binary and Checkable

Every acceptance criterion must resolve to a plain yes or no through an observable check: a named test seam, a specific user action and its result, or a specific state before and after. Reject vague criteria such as "works correctly," "is improved," or "handles edge cases."

Good: `- [ ] Submitting the form with an empty email shows "Email is required" and does not send the request.`

Bad: `- [ ] Form validation works properly.`

## Sourcing Rule

Write an acceptance criterion only from a fact the input actually stated or from expected behavior the input directly implied. Do not invent:

- edge cases the user never mentioned;
- performance, security, or accessibility bars that were not stated;
- a specific error message, status code, or UI copy that was not given;
- a root cause or fix approach, which belongs to implementation, not the ticket.

## When a Fact Is Missing

If a defect has no stated reproduction steps, or a feature has no stated definition of done, do not fabricate one to fill the section. Instead:

1. Write the acceptance criteria that genuinely are supported by stated facts, if any.
2. Return each missing fact as unresolved metadata outside the rendered tracker body, for example:
   - `Unresolved: reproduction steps not provided.`
   - `Unresolved: no checkable definition of done for "faster loading."`
3. Leave the Discovery-question path (see [Ticket formats](./40-ticket-formats.md)) available as an option the caller can choose instead, when the missing fact is large enough that the ticket cannot be usefully acted on until it is resolved.

Unresolved metadata is not an acceptance criterion and must never be rendered as a checked or unchecked Definition of Done item. It is the correct, honest result when the input does not support a stronger claim. The caller must resolve material missing information before publication.

## Distinguishing "missing" from "safely inferable"

A fact is safely inferable only when the input leaves exactly one reasonable reading. For example, "the button doesn't do anything when I click it" directly implies the expected behavior is "the button performs its labeled action," and that inference is acceptable.

A fact is missing, not inferable, when multiple different reasonable readings exist, or when the gap concerns something the input never touched at all (for example a device, browser, account state, or exact input value needed to reproduce it).

## Multiple Unresolved Items

List every distinct unresolved fact as its own line rather than one vague catch-all. This keeps the ticket checkable even where it is incomplete, and tells the caller exactly what still needs a human or a research ticket.
