---
includes: ["_base/_atoms/approval-gate-mutation.md"]
requires-skills: []
---

# Preview and Approval

## Required References

1. [Approval gate for a mutation](../../_base/_atoms/approval-gate-mutation.md)

Present a numbered breakdown before any write.

For each ticket show:

- **Title**
- **Blocked by**
- **What it delivers**
- **Acceptance-criteria summary**
- **Why it is independently verifiable**

Also show:

- dependency order and initial frontier;
- prefactoring or expand-contract structure;
- source relationship plan;
- mapped `ready-for-agent` string;
- remote provider or local target.

Ask focused questions:

1. Is the granularity too coarse, too fine, or right?
2. Are all blocker edges genuine?
3. Should any tickets be merged or split?

Iterate without reopening product decisions.

Gate publication through the approval-gate-mutation atom named above, with
`approval-phrase` `Approve and publish`, the numbered breakdown above as the
preview, and `scope` set to exactly the previewed tickets and their dependency
edges at the named target. The atom owns the offer, the explicit-approval rule,
and the stale-approval rule.
