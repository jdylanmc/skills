---
includes: []
requires-skills: []
---
# Safeguards and Degradation

## Tool Posture

All tools may be required for provider variance, but permitted writes are limited to:

- approved ticket creation;
- approved parent and dependency relationships;
- the mapped `ready-for-agent` state.

Do not modify code, execute tickets, or mutate the source item.

## Mutation Safety

- Require `Approve and publish`.
- Refresh before every mutation.
- Abort stale writes after concurrent change.
- Create tickets before wiring relations.
- Verify the final graph and source preservation.

## Degradation

- **Provider relation unavailable:** Use only the fallback documented by the tracker guidance.
- **Domain evidence unavailable:** Stop for setup rather than invent vocabulary.
- **Test seam unclear:** Explore narrowly and state the verification assumption.
- **Prototype unavailable:** Omit excerpts and retain prose decisions.

Disclose every fallback in the publication report.
