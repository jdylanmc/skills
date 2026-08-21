---
includes: []
requires-skills: []
---
## Round Workflow

After the depth choice:

1. Restate the subject and provisional objective concisely.
2. Build the initial design tree.
3. Start independent fact research.
4. Compute the ready frontier.
5. Ask the frontier according to the selected depth.
6. Incorporate answers and completed research.
7. Recompute dependencies, statuses, and branches.
8. Repeat until stopped or complete.

Treat user answers as evidence, not merely text to acknowledge.

- **Partial answer:** Settle only the answered portion and retain the unresolved remainder.
- **Deferral:** Mark the node `deferred`, record its impact, and continue where possible.
- **Delegation:** Confirm the delegated scope and record the selected judgment.
- **Changed answer:** Supersede the old answer and recompute dependent branches.
- **Contradiction:** Point out the conflict neutrally and ask which statement governs.
- **New evidence:** Reopen a settled node only when the evidence could materially change it.
- **Superseded branch:** Preserve its IDs and history, but remove it from the active frontier.

## Decision Register

After a few rounds, whenever the tree changes materially, and before completion, show a concise register containing:

### Settled decisions

Accepted user decisions and scoped delegated judgments.

### Researched facts

Material findings with compact evidence or source references.

### Accepted assumptions and unknowns

Items the user has explicitly chosen not to resolve.

### Active research

Research still underway and the branches it blocks.

### Blocked or deferred items

The cause, consequence, and what would unblock each item.

### Next frontier

The questions currently ready for the user.

After the register, explain in one or two sentences why the next frontier is now actionable, then ask it.

Do not expose hidden reasoning or a verbose transcript of tree maintenance.
