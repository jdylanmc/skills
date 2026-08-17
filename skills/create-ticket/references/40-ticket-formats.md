# Ticket Formats

This skill renders every payload in one of two canonical shapes. The caller selects the shape; when the caller does not specify one, default to the remote tracker body.

## Remote Tracker Body (Bug or Feature)

This is the canonical shape used by `/breakdown-to-tickets`. Defect and feature payloads share it; classification and unresolved metadata remain outside the rendered tracker body.

```markdown
## Parent

<Linked title of the source conversation, issue, or grouping item, if any. Otherwise "None.">

## What to build

<For a defect: the observed behavior, the expected behavior if stated, and reproduction context if stated.>
<For a feature: the end-to-end outcome from the user's or external observer's perspective.>

## Acceptance criteria

- [ ] <Checkable outcome.>

## Blocked by

- <Linked blocker title, or "None - can start immediately.">
```

Reconciling bug- and feature-shaped source material into this one body means:

- a bug report's "steps to reproduce" become the reproduction context inside **What to build**, not a separate section;
- a bug report's "expected vs actual" becomes the two behavior lines inside **What to build**;
- a feature request's "user story" or "why" becomes the outcome statement inside **What to build**;
- a feature request's "definition of done" becomes **Acceptance criteria** entries;
- severity, priority, and component assignment are never invented here; omit them rather than guessing.

## Discovery One-question Ticket

Use this shape only when the caller states the payload is for `/discovery` or another one-question model, or when fact-finding is genuinely the only thing the issue needs before it can become a defect or feature ticket.

```markdown
## Question

<The single decision or investigation this ticket resolves.>
```

Do not add Parent, Acceptance criteria, or Blocked by sections to a Discovery ticket; that model carries exactly one bounded Question and nothing else. Blocker and parent relationships for Discovery tickets remain the caller's responsibility through its own tracker contract.

## Choosing the Shape

| Situation | Shape |
| --- | --- |
| Caller names a target format | Use that format. |
| Issue is clearly a defect or feature with enough fact to act on | Remote tracker body. |
| Issue is really "we don't know yet" and needs investigation or a human decision before it can be built or fixed | Discovery one-question ticket. |
| A composing skill named no format and the issue fits neither shape cleanly | Ask that caller which shape it needs; do not guess on its behalf. |
| A person named no format | Default to the remote tracker body and note that the Discovery one-question shape is available. |

## Local-only Fallback

When the caller has no remote tracker configured, return the same remote tracker body content; the caller is responsible for saving it under its own local-only Markdown convention (for example the one described in `/breakdown-to-tickets`). This skill does not write the file itself.
