# Publishing, Dependencies, and Frontier

## Publication Order

Publish tickets in dependency order with blockers first so every relation target exists.

Use phases:

1. refresh source and check for duplicates;
2. create missing tickets;
3. wire parent and dependency relationships;
4. apply the mapped `ready-for-agent` state;
5. verify the graph.

Use native relationships when supported and only the configured fallback otherwise.

## Source Handling

Link or relate each ticket to the source where useful. Adding the relationship is allowed.

Do not close, relabel, rewrite, or otherwise modify the source.

## Frontier

A published ticket is ready when all blockers are closed.

Report the initial frontier: every newly published ticket with no open blocker.

Publishing creates the graph but executes nothing.

## Idempotency

Before creating, search by normalized title and source relationship.

On retry:

- preserve existing identifiers;
- create only missing tickets;
- add only missing relationships;
- do not duplicate labels or local files;
- do not re-slice a live graph silently.

## Verification

Reread created items and verify:

- bodies and acceptance criteria;
- parent links;
- blocker edges;
- mapped label;
- source body, state, and labels remain unchanged.

Report linked titles, dependency graph, and frontier.
