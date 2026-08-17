# Work Mode and Completion

Use Work mode when the user provides or refers to an existing map or child ticket.

## Workflow

1. Load the map at low resolution: Destination, Notes, Decisions so far, fog, and scope.
2. Read Notes and honor its skill list and execution policy.
3. Use the user-named ticket, or query the frontier and choose its first ticket.
4. Refresh and claim the ticket before work.
5. Resolve according to type:
   - research: use available research capabilities or subagents;
   - prototype: create the cheapest useful artifact and obtain human feedback;
   - interrogate: use `/interrogate` and `/domain-mapping`, preserving human decision authority;
   - task: complete the permitted prerequisite or provide the human checklist.
6. Resolve at most one non-research ticket in the session.

## Resolve and Update Approval Gate

Before consequential writes, preview:

- resolution record;
- ticket closure;
- exact `Decisions so far` or `Out of scope` delta;
- linked assets and context pointers;
- new tickets and their types;
- dependency changes;
- graduated fog;
- invalidated or revised tickets;
- Destination or scope changes.

Offer:

- `Approve and update`;
- `Revise`;
- `Cancel`.

After approval:

1. refresh all affected artifacts;
2. record the resolution in the ticket;
3. close and verify the ticket;
4. surgically update the map index;
5. create newly precise tickets;
6. wire dependencies;
7. remove graduated fog;
8. close and index out-of-scope tickets;
9. update invalidated tickets;
10. verify the final state.

## Completion

The map is complete when:

- the frontier is empty;
- `Not yet specified` contains no material in-scope fog;
- no open in-scope child ticket remains;
- research is complete or its limitation is explicitly accepted;
- the Destination and success conditions remain valid;
- the route is clear enough for execution or handoff.

## Handoff Summary

```markdown
### Handoff Summary - <Destination>

- Destination: <statement and observable success conditions>
- Route resolved: <count or linked summary of decisions>
- Accepted assumptions and unknowns: <items or none>
- Out of scope: <items or none>
- Research still in flight: <linked titles or none>
- Recommended next action: <execute within the Notes policy or hand off to an owner or skill>
```

When the map remains open, report the resolved linked ticket, refreshed frontier, blocked work, and remaining fog for the next session.
