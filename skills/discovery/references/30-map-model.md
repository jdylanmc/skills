# Map Model

Each effort has one canonical map item marked `discovery:map`.

Use a concise title derived from the Destination.

## Map Body

```markdown
## Destination

<The end state and observable success conditions.>

## Notes

<Durable context, standing preferences, skills to consult, and execution policy.>

## Decisions so far

- [<resolved ticket title>](<link>) - <one-line outcome> [context: <link>]

## Not yet specified

<In-scope fog that is visible but not precise enough to become a ticket.>

## Out of scope

<Work intentionally excluded from this Destination.>
```

## Low-resolution Index

The map is an index, not the decision store.

- Complete reasoning and evidence live in the resolved ticket.
- `Decisions so far` contains only a linked title, one-line gist, and optional durable context pointer.
- Open tickets are queried through tracker relationships and are not copied into the map body.
- Research and prototype assets are linked rather than pasted.

## Notes Contract

Notes must record:

1. durable shared context and standing preferences;
2. skills or capabilities to consult, such as `/interrogate`, `/domain-mapping`, research subagents, or prototype tooling;
3. one execution policy:

```text
Execution: planning-only
```

or:

```text
Execution: permitted - <specific scope>
```

Work mode reads Notes before selecting a ticket and honors the execution policy exactly.
