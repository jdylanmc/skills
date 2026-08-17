# Vertical Slicing Model

A tracer-bullet ticket proves a narrow but complete path through every layer needed for one outcome.

Each ticket must:

1. deliver an end-to-end behavior;
2. be independently demoable or verifiable;
3. fit one fresh agent context window as a sizing heuristic;
4. contain externally testable acceptance criteria;
5. declare only genuine blockers.

## Reject Horizontal Slices

Do not create tickets such as:

- build all database models;
- add all service methods;
- create all endpoints;
- write all tests.

Reslice them into complete behavioral paths.

## Blocker Graph

`Blocked by` contains only tickets that must close before the ticket can begin.

Keep the graph:

- minimal;
- acyclic;
- as broad as possible;
- no deeper than real dependencies require.

A ticket with no open blockers is on the frontier and can begin immediately.

If a slice is too large for one context, split it into smaller end-to-end slices, never into layers.
