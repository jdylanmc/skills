# Frontier, Claiming, and Concurrency

## Frontier

Prefer native hierarchy and dependency relationships. Use only the fallback documented by the configured tracker.

The frontier contains child tickets that are:

- open;
- unblocked by every open dependency;
- unclaimed;
- precise enough to contain a Question.

Use the deterministic order returned by the tracker document's frontier operation. When the user does not name a ticket, choose the first frontier ticket.

## Claim Protocol

Invoking Work mode authorizes Discovery to claim the selected ticket immediately.

Claiming is the first execution write:

1. refresh parent, state, dependencies, and assignment;
2. verify the ticket remains open, unblocked, and unclaimed;
3. assign it to the acting identity;
4. verify assignment;
5. begin work only after the claim succeeds.

Disclose the claim in the next response. All later consequential writes require the resolve/update approval gate.

If work stops without a resolution, offer to release the agent's own claim. The original Work invocation authorizes a safe release when the agent is no longer working the ticket, but never remove another identity's claim.

## Concurrency

Refresh immediately before every mutation.

If another session claimed, closed, blocked, or changed the ticket:

- abort the stale mutation;
- recompute the frontier or reload the named ticket;
- report the change;
- never overwrite newer state blindly.

Update the map with read-modify-write semantics and verify the result while preserving every unrelated section and entry.

## Idempotency and Retry

Before charting, search for an existing `discovery:map` matching the normalized Destination. Offer to resume instead of duplicating it.

Create in verified phases:

1. map;
2. child tickets;
3. dependencies.

On retry:

- re-query by title and marker;
- create only missing artifacts;
- preserve existing identifiers;
- do not duplicate a map decision entry;
- resume a self-claimed ticket;
- never take a ticket claimed by another identity;
- when the ticket is already closed, continue with any missing map update.
