---
schema-version: 1
state-root: docs/discovery
sessions: 2
last-updated-cycle: atomic-skill-composition/c-0005
---

# Primary Discovery Map - Engineering Skills Library

## Product Idea and Destination

`jdylanmc/skills` is a reusable library of GitHub Copilot skills, agents, and
shared engineering doctrine. The product idea under discovery is that every
skill in the library becomes explicitly compositional: the smallest reusable
capabilities are declared once and composed upward, instead of each skill
restating shared behavior in its own prose.

Destination: a stated, enforceable composition model with exactly three levels -
atom, molecule, and skill - in which atoms and molecules are single Markdown
files composed by reference, skills remain the invocable `SKILL.md` packages,
adoption is proven by collapsing duplicated behavior into single definitions,
and an automated check enforces the model.

## Verticals and Cross-Cutting Domains

| Session | Kind | Priority | Maturity | Active fog | Major blockers | Package |
| --- | --- | --- | --- | --- | --- | --- |
| atomic-skill-composition | cross-cutting | P0 | decision-ready | Schedule beyond the first migration, whether the roast trio still needs standalone install, and whether the collapse union audit can be automated | none | [discovery.md](./sessions/atomic-skill-composition/discovery.md) |
| test-coverage-doctrine | cross-cutting | unprioritized | vague | Recorded only, no cycle run. Seam and internal are undefined, and the position may conflict with the shipped testing doctrine | none recorded | [discovery.md](./sessions/test-coverage-doctrine/discovery.md) |

## Typed Session Links

| From | Link | To | Why |
| --- | --- | --- | --- |
| atomic-skill-composition | related-session | test-coverage-doctrine | Both arise from migrating this skills library to a better model. The composition model's enforcement node n-0005 needs a stated testing position, and the coverage doctrine will be applied to the units that model produces. |
| test-coverage-doctrine | related-session | atomic-skill-composition | Back-link. |

## Shared Actors and Constraints

- Skill author - the repository owner writing and revising skills in this library.
- Routing agent - the runtime that reads `SKILL.md` frontmatter and decides which skill handles a request.
- Consuming skill - a skill that depends on another skill or a shared base package.
- Constraint - canonical formats are Markdown; generated JSON manifests may not replace canonical Markdown files.
- Constraint - `skills/_base/` holds level namespaces `_atoms/` and `_molecules/`; everything beneath `_base` is non-routable and contains no `SKILL.md`. A Markdown file outside a level namespace is not a unit.
- Constraint - `scripts/validate-skill-graph.mjs` is a merge gate over the `includes` dependency mirror.
