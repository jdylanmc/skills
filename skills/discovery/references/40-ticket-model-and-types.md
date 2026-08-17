# Ticket Model and Types

Each ticket:

- is a child of the map through the configured tracker hierarchy;
- contains one bounded Question;
- is sized for one large agent session;
- carries exactly one Discovery type marker;
- is referenced by linked title in human-facing prose.

## Ticket Body

```markdown
## Question

<The single decision or investigation this ticket resolves.>
```

## Ticket Types

| Marker | Purpose | Participation |
| --- | --- | --- |
| `discovery:research` | Establish facts through documentation, code, external systems, or other evidence. May run in parallel. | Agent-driven |
| `discovery:prototype` | Create the cheapest useful artifact that enables informed human feedback. Link the artifact. | Human in the loop |
| `discovery:interrogate` | Resolve a decision through conversation, normally using `/interrogate` and `/domain-mapping`. | Human in the loop |
| `discovery:task` | Complete prerequisite work that unlocks a decision, not delivery of the Destination. | Agent-driven or human in the loop |

An Interrogate ticket cannot resolve without the human speaking for their side of the decision.

A Task earns a place only when the route is blocked until the prerequisite is complete. Agent-driven tasks may be performed when permitted; human tasks produce a precise checklist.

Resolve at most one non-research ticket per session. Independent research may proceed in parallel.

When a named skill or capability is unavailable, follow the degradation rules and disclose the fallback.
