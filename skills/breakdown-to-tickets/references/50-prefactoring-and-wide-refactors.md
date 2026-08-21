---
includes: []
requires-skills: []
---
# Prefactoring and Wide Refactors

## Prefactoring

Make the change easy before making the easy change.

A prefactoring ticket belongs in the graph only when it:

1. independently improves the structure;
2. lands safely and keeps verification green;
3. genuinely unblocks one or more behavioral slices.

Place it before the slices it enables. Do not add speculative cleanup or unrelated improvements.

## Wide Mechanical Refactors

Some changes cannot be sliced vertically because one mechanical contract spans the codebase.

Use expand-contract:

1. **Expand:** introduce the new form beside the old form without breaking callers.
2. **Migrate:** move callers in blast-radius-sized batches that remain green independently.
3. **Contract:** remove the old form after every migration is complete.

The Expand ticket blocks every migration. Every migration blocks Contract.

When migration batches cannot remain green alone:

1. use a shared integration branch;
2. let batches land there;
3. create an Integrate and Verify ticket blocked by every batch;
4. let Integrate and Verify block Contract.

Prefactoring, migration, integration, and contract tickets are implementation tickets and receive the mapped `ready-for-agent` state.
