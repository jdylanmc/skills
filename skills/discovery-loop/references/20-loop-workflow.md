# Loop Workflow

## 1. Enter or Resume

1. Identify the epic, theme, or idea and normalize its Destination.
2. Search for a matching Discovery map and Shared Understanding.
3. Resume existing artifacts instead of duplicating them.
4. If the Destination or success conditions are ambiguous, use `/interrogate` before charting.
5. Invoke `/discovery` in Chart or Work mode as appropriate.

## 2. Compute the Frontier

Load the map at low resolution and obtain the current ready frontier through the configured tracker contract.

Choose one frontier branch that is:

- in scope;
- unblocked;
- precise enough to investigate or decide;
- not claimed by another actor.

If several independent research tickets are ready, group them under the selected branch and delegate them in parallel. Keep user-decision, prototype, and prerequisite tasks serial unless their independence is explicit.

## 3. Clear One Branch

For the selected branch:

1. gather authoritative evidence through read-only research subagents;
2. invoke `/interrogate` for genuine decisions, asking only after discoverable facts have been researched;
3. invoke `/domain-mapping` when terminology, ownership, lifecycle, boundaries, or a consequential architecture decision is material;
4. reconcile contradictions, limitations, accepted unknowns, and changed decisions;
5. identify newly precise work or newly visible fog.

Every proposed ticket must pass through `/create-ticket`. Give it the source context, parent, single bounded question or outcome, known blockers, and named verification seam. Reject or revise payloads that invent requirements, conceal missing evidence, or combine unrelated work.

Use `/discovery` to preview and, after explicit approval, create tickets, wire dependencies, close resolved tickets, and update the map. The formatter does not authorize publication.

## 4. Decide Whether the Branch Is Clear

A branch is clear and crisp only when:

- its material question has a settled, delegated, blocked, or explicitly accepted-unknown disposition;
- evidence and limitations are linked;
- canonical domain terms are confirmed where material;
- dependencies and verification seams are known;
- newly exposed material fog is represented on the map;
- an implementation specification would not misrepresent an unresolved blocker.

If any condition fails, refresh the frontier and continue clearing the branch.

## 5. Finalize the Branch

When clear:

1. invoke `/spec` with the settled conversation, Discovery artifacts, domain artifacts, prototypes, and repository evidence;
2. let `/spec` confirm testing seams and obtain its own publish approval;
3. record the published or approved local branch specification;
4. compute the implementation ticket order and minimal blocker graph;
5. identify tickets that are genuinely safe to execute in parallel;
6. preview the Shared Understanding delta and obtain `Approve understanding update`;
7. update and verify the existing Shared Understanding rather than creating another.

Do not mark the branch finalized when Spec stops on a material blocker or publication is cancelled. Record it as clear-but-unpublished only when the user explicitly chooses that state.

## 6. Continue or Exit

After each cycle, show only:

- the cleared branch and linked specification;
- material Shared Understanding changes;
- the refreshed frontier;
- available parallel research;
- the next user decision, if one is ready.

Continue into the next branch without asking whether to keep looping. Exit only when the user explicitly asks to stop, pause, exit, or hand off.

An empty frontier does not silently terminate the loop. Reconcile the map:

- if material fog remains, refine it into the next branch;
- if only blocked work remains, ask the user to resolve, delegate, accept, or pause the blockers;
- if the Destination is fully clear, present that state and wait for an explicit exit or scope expansion.
