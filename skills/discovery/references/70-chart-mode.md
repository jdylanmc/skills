---
includes: ["_base/_atoms/approval-gate-mutation/approval-gate-mutation.md"]
requires-skills: []
---

# Chart Mode

## Required References

1. [Approval gate for a mutation](../../_base/_atoms/approval-gate-mutation/approval-gate-mutation.md)

Use Chart mode when the user brings a loose idea without an existing map.

## Workflow

1. Read and confirm the tracker contract.
2. Name the Destination first. Invoke `/interrogate` and `/domain-mapping` through available skill or subagent mechanisms. Confirm observable success conditions and canonical terms with the user.
3. Explore breadth-first. Surface the first precise Questions across the effort instead of pursuing one branch deeply.
4. Separate precise tickets from `Not yet specified` fog and conscious scope exclusions.
5. Apply the short-effort guard: when there is no material fog and the effort fits one session, do not create a map. Explain why and ask how the user wants to proceed.

## Chart Approval Gate

Gate every charting write through the approval-gate-mutation atom named above,
with `approval-phrase` `Approve and chart` and `scope` set to exactly the
previewed map and children. The atom owns the offer, the explicit-approval
rule, and the stale-approval rule.

Preview:

- Destination and success conditions;
- map title and Notes, including execution policy;
- every proposed child title, type, Question, and dependency;
- initial fog;
- initial out-of-scope entries;
- research tickets that will launch automatically.

## Creation

After approval:

1. refresh for an existing matching map;
2. create or resume the map;
3. create missing child tickets;
4. wire dependencies in a separate pass;
5. verify hierarchy, markers, and dependencies;
6. launch independent research tickets in parallel when safe.

Research agents gather evidence and prepare resolution previews. They do not close tickets or update the map without the applicable approval gate.

Stop after charting. Resolve no non-research ticket in the charting session.

## Chart Summary

Report:

- linked map title;
- Destination;
- linked child titles and types;
- dependency shape;
- research launched;
- remaining fog;
- how to continue in Work mode.
