---
includes: []
requires-skills: []
---
# Ticket Formats

## Remote Tracker Body

```markdown
## Parent

<Optional linked title of the source or grouping item.>

## What to build

<The end-to-end outcome from the user's or external observer's perspective.>

## Acceptance criteria

- [ ] <Checkable outcome through a named test seam.>

## Blocked by

- <Linked blocker title, or "None - can start immediately.">
```

Avoid:

- file paths;
- layer-by-layer task lists;
- ordinary code snippets;
- internal implementation details that may go stale.

A trimmed prototype excerpt is allowed only when it encodes a settled contract more precisely than prose. Identify its source.

## Local-only Markdown

Create one file per ticket under the configured local convention, normally:

```text
.scratch/<feature>/tickets/<stable-id>.md
```

Never combine the breakdown into one file.

Use structured metadata for:

- stable ID;
- title;
- open status;
- mapped `ready-for-agent` label;
- parent;
- `blocked_by`;
- assignment;
- creation and closure timestamps.

Use relative links between ticket titles.

## Parent Relationship

Reference or relate the source item when appropriate. Do not change its body, state, or labels.
