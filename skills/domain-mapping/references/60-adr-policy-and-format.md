---
includes: []
requires-skills: []
---
## Architecture Decision Record Qualification

Offer an Architecture Decision Record (ADR) only when all three conditions are true:

1. **Costly to reverse:** Changing the decision later would materially disrupt the system, data, teams, integrations, or delivery.
2. **Surprising without explanation:** A future reader could reasonably misinterpret or undo the choice without its rationale.
3. **Real trade-off:** The choice resulted from weighing credible alternatives rather than recording a requirement, preference, or obvious step.

Failure of any condition means no ADR should be offered.

Possible areas include architectural shape, context integration, lock-in-heavy technology, ownership or boundary choices, deliberate non-obvious deviations, hidden constraints that drove a choice, and significant rejected alternatives. These are prompts for evaluation only; belonging to a category never bypasses the three-part gate.

Do not use ADRs for routine implementation choices, meeting notes, status updates, task history, glossary definitions, or hypothetical decisions.

## ADR Location and Numbering

Store approved ADRs in `docs/adr/`, creating the directory only when the first ADR is approved.

To choose a number:

1. Scan filenames in `docs/adr/`.
2. Consider only names beginning with exactly four decimal digits.
3. Ignore names without a conforming four-digit prefix.
4. Select one greater than the highest conforming number.
5. Use `0001` when no conforming ADR exists.

Use a concise filename such as `0001-separate-order-and-fulfillment-contexts.md`.

## Minimal ADR Format

```markdown
# <Short Decision Title>

<One to three sentences summarizing the context, the decision, and why it was chosen.>
```

Add these sections only when they provide meaningful information:

```markdown
## Status

<Status>

## Considered Options

- <Option and meaningful distinction>

## Consequences

- <Material positive or negative consequence>
```

Minimal does not mean vague. The core paragraph must make the chosen trade-off understandable.
