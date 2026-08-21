---
includes: []
requires-skills: []
---
# Shared Discovery Operations

Tracker templates adapt this contract to their native concepts. Setup records the contract; it does not execute `/discovery`.

## Planning Model

`/discovery` plans efforts too large for one agent session as:

- one shared map item;
- child decision or investigation tickets;
- dependency relationships between child tickets.

Resolve at most one non-research ticket per session. Research tickets may proceed in parallel when the Discovery workflow supports it.

## Markers

The map uses `discovery:map`.

Each child has exactly one type marker:

- `discovery:research`;
- `discovery:prototype`;
- `discovery:interrogate`;
- `discovery:task`.

Use labels on GitHub and GitLab, tags in Azure Boards, and structured metadata in local Markdown.

## Map Body

The map contains:

```markdown
## Destination

<The end state and observable success conditions.>

## Notes

<Durable shared context, standing preferences, and skills to consult.>

## Decisions so far

- [<resolved ticket title>](<ticket link>) - <one-line outcome and optional context link>

## Not yet specified

<In-scope fog that is not yet precise enough to become a ticket.>

## Out of scope

<Concerns intentionally excluded from this effort.>
```

The map is an index, not the full decision record. Do not list open child tickets in its body when the tracker can query native children.

## Child Tickets

Each child:

- belongs to the map through the provider's hierarchy;
- contains a `## Question` section;
- carries one Discovery type marker;
- represents one bounded decision or investigation;
- uses a provider-issued identifier or stable local identity for machine operations;
- is referenced by linked title in human-facing prose.

## Fog and Scope

Use `Not yet specified` for in-scope questions that cannot yet be stated precisely. Graduate fog into a ticket only when its question becomes clear.

Use `Out of scope` for consciously excluded work. Out-of-scope content does not graduate unless the destination is explicitly redrawn.

## Dependencies and Frontier

Prefer native blocking or dependency relationships.

The frontier is the set of child tickets that are:

- open;
- unblocked by another open ticket;
- unassigned;
- precise enough to contain a Question.

Use `Blocked by:` body metadata only when the tracker lacks usable native dependencies.

## Claim

Claiming is the first execution write:

1. refresh state, parent, dependencies, and assignment;
2. verify the ticket remains open, unblocked, and unclaimed;
3. assign it to the acting identity;
4. begin work only after assignment succeeds.

## Resolve

Resolve in this order:

1. record a resolution through the provider's discussion mechanism or the local ticket's Resolution section;
2. close the child using the provider's terminal state;
3. verify closure;
4. append a linked title and one-line gist to the map's `Decisions so far`;
5. preserve every other map section and existing decision entry.

Newly clarified fog may become child tickets after the resolution. Tickets found beyond the destination are closed and linked from `Out of scope`, not `Decisions so far`.
