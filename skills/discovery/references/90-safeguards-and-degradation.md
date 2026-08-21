---
includes: []
requires-skills: []
---
# Safeguards and Capability Degradation

## Approval Rules

Two gates are mandatory:

1. `Approve and chart` before creating a map, tickets, or dependencies.
2. `Approve and update` before recording a resolution, closing tickets, editing dependencies, changing scope, or updating the map.

Claiming or safely releasing the agent's own claim is the only pre-update-gate mutation authorized by entering Work mode.

A general acknowledgement is not approval.

## Tool Posture

`allowed-tools: ["*"]` is intentional because providers and ticket types vary.

Every mutation still requires:

- the configured tracker contract;
- refresh and verification;
- the applicable approval gate;
- post-write verification.

## Missing Skills or Capabilities

- **`/interrogate` unavailable:** Run an equivalent breadth-first or focused interview inline. Preserve decision ownership and disclose the fallback.
- **`/domain-mapping` unavailable:** Capture terminology decisions in the ticket or Notes, recommend later domain mapping, and do not edit domain artifacts.
- **Research capability unavailable:** Use available evidence, record limitations, and mark the ticket blocked when facts cannot be established.
- **Prototype capability unavailable:** Produce the cheapest viable artifact with available tools or convert the ticket to a precise human task.
- **Provider operation unavailable:** Use only the fallback documented by `docs/agents/issue-tracker.md`; otherwise stop.

Disclose every fallback in the ticket resolution.

## Planning Boundary

When Notes say `Execution: planning-only`, do not implement the Destination.

A Task may perform only prerequisite work needed to unlock a decision. It must not become disguised delivery of the Destination.
