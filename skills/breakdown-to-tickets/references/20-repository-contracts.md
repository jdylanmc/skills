---
includes: []
requires-skills: []
---
# Repository Contracts

Read:

- `docs/agents/issue-tracker.md`;
- `docs/agents/domain.md`;
- `docs/agents/triage-labels.md`.

If any is missing, stop and direct the user to `/setup-jdylanmc-skills`.

## Tracker

Delegate provider mechanics to the tracker document:

- create and read items;
- parent-child or related-item links;
- dependencies and fallbacks;
- labels or tags;
- query and verification.

Do not hardcode GitHub, GitLab, Azure DevOps, or local commands in this skill.

## Domain

Use the owning context's glossary and respect relevant Architecture Decision Records.

When terminology is unresolved, recommend `/domain-mapping`.

## Triage

Read the configured string mapped from canonical `ready-for-agent`. Apply it exactly to every published implementation ticket unless the user explicitly instructs otherwise.

Do not create a near-duplicate, add another triage state, or run general triage.

Never edit repository guidance from this skill.
