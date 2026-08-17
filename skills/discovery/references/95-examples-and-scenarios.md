# Examples and Scenario Tests

## Chart a Large Effort

The user wants to redesign an authorization model but the target behavior and migration route are unclear.

Discovery:

1. confirms a Destination with `/interrogate` and `/domain-mapping`;
2. identifies precise Questions about ownership, compatibility, and migration;
3. places unresolved downstream areas in fog;
4. previews the map, tickets, dependencies, and research;
5. creates them after approval;
6. launches safe research;
7. stops without resolving a non-research ticket.

## Short-effort Guard

The user presents a change with one reversible decision, no meaningful fog, and work that fits the current session.

Discovery does not create a map. It explains that the route is already visible and asks whether to execute, document, or stop.

## Work an Interrogate Ticket

Discovery loads the map, selects the first frontier ticket, refreshes it, and claims it. It uses `/interrogate` and `/domain-mapping`, previews the resolution and map delta, then applies them only after approval.

## Fog Graduation

A resolved research ticket makes a previously vague integration concern precise. Discovery creates a linked Question ticket, adds its dependencies, and removes the graduated text from fog.

## Scope Exclusion

A ticket is found to lie beyond the confirmed Destination. Discovery previews the ruling, closes the ticket after approval, and adds a linked reason under `Out of scope`, not `Decisions so far`.

## Concurrent Claim

Another session claims the chosen ticket after the frontier query. Discovery's refresh detects the assignment, aborts the stale claim, recomputes the frontier, and selects another ticket.

## Partial Chart Retry

Creation failed after the map and some children existed. Discovery re-queries by Destination, title, and markers, resumes the existing map, creates only missing children, and wires only missing dependencies.

## Missing Tracker Guidance

Discovery directs the user to `/setup-jdylanmc-skills`. If setup cannot run and the user confirms local-only mode, Discovery uses `.scratch/<feature>/map.md` and local ticket metadata without inventing remote behavior.

## Scenario Invariants

A valid execution must:

- use linked titles in human prose;
- avoid duplicate maps and decision entries;
- leave open tickets out of the map body;
- create no chart artifacts before approval;
- claim before work;
- resolve at most one non-research ticket per session;
- preserve map sections during updates;
- stop planning when the route is clear.
