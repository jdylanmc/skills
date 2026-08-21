---
includes: []
requires-skills: []
---
# Safeguards and Degradation

## Human Gates

Two user decisions are mandatory:

1. confirmation of testing seams;
2. `Approve and publish`.

A general acknowledgement is not approval.

## Tool Posture

All tools may be needed for repository and provider variance, but writes are limited to:

- creating or updating the specification;
- applying the configured `ready-for-agent` mapping;
- linking source evidence.

Every write requires repository guidance, refresh, approval, and verification.

## Boundaries

- Do not reopen settled product or architecture decisions.
- Do not implement the feature.
- Do not run general triage.
- Do not edit repository configuration or Discovery artifacts.
- Do not publish secrets or sensitive material.

## Degradation

- **`/domain-mapping` unavailable:** use existing domain artifacts, mark terminology assumptions, and recommend later domain work.
- **Exploration limited:** rely on current evidence and mark unverifiable points as Inferred or Blocker.
- **No tests:** propose and confirm the highest practical new seam.
- **Provider operation unavailable:** use only the documented fallback; otherwise stop.

Disclose degradation in Further Notes.
