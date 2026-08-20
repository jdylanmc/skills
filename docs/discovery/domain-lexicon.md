---
schema-version: 1
state-root: docs/discovery
---

# Shared Domain Lexicon

Confirmed vocabulary is owned by `/domain-mapping` and lives in the canonical
repository artifacts named by `docs/agents/domain.md`. This file is a compact
shared tally that cites those artifacts; it never competes with them.

| Term | Status | Definition | Bounded context | Aliases | Source | First seen | Last verified | Related terms | Scope |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Atom | confirmed | The smallest unit of skill composition: one single operation as judged from the caller's point of view, expressed as a single Markdown file whose frontmatter is consistent across all atoms. An atom references no other unit of composition. | Engineering skills library | `primitive` (discouraged), `ingredient` (discouraged) | Root [CONTEXT.md](../../CONTEXT.md), `### Skill composition` | atomic-skill-composition/n-0001/c-0001 | c-0001 | Molecule, Skill, Composition level | shared |
| Base package | deprecated | Superseded in c-0003 by level namespaces. Once Chronicler decomposes, no package-shaped directory remains under `skills/_base/`. The c-0002 conflict was resolved by retiring the term rather than choosing a reading. | Engineering skills library | none | c-0003 answers Q3, Q4 | atomic-skill-composition/n-0003/c-0001 | c-0003 | Level namespace, Molecule, Skill | shared |
| Level namespace | candidate | An underscore-prefixed directory under `skills/_base/` holding units of exactly one composition level, such as `_atoms/` or `_molecules/`. The prefix marks it as a namespace rather than a package. | Engineering skills library | none recorded | c-0002 answer Q2; c-0003 answers Q3, Q4 | atomic-skill-composition/n-0003/c-0003 | c-0003 | Atom, Molecule, Base package | shared |
| Composition level | candidate | The declared position of a unit in the atom-molecule-skill ordering. | Engineering skills library | `Tier` (discouraged - collides with the tracker tier hierarchy Branch, Story, Task used by Discovery Loop promotion) | Discovery Loop tracker-tier-map collision, c-0001 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Atom, Molecule, Skill | shared |
| Ingredient | deprecated | Proposed and rejected in c-0001 as a fourth composition level. In the cooking metaphor that supplies the word, an ingredient is the primitive, so placing it above Molecule inverts the metaphor. Recorded to prevent reproposal. | Engineering skills library | none | c-0001 question Q5 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Atom, Recipe | shared |
| Molecule | confirmed | A unit of skill composition that composes two or more atoms or molecules by reference to produce one bounded outcome, expressed as a single Markdown file. A molecule declares what it composes; what it may use and what consumes it are derived from that declaration rather than authored. | Engineering skills library | none recorded | Root [CONTEXT.md](../../CONTEXT.md), `### Skill composition` | atomic-skill-composition/n-0001/c-0001 | c-0002 | Atom, Skill, Composition level | shared |
| Organism | deprecated | The original name for the third composition level. Superseded by Skill in c-0001. | Engineering skills library | none | c-0001 question Q5 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Skill | shared |
| Recipe | candidate | The mental model for what a Skill is: an invocable procedure that names what it needs and the steps it runs. Never a structural composition level. | Engineering skills library | none recorded | c-0001 question Q5 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Skill | shared |
| Skill | confirmed | The only unit of skill composition that may be invoked directly, by a router or by a person: the contract the agent understands. A skill composes molecules and atoms rather than restating what a shared unit already defines. | Engineering skills library | `Organism` (discouraged) | Root [CONTEXT.md](../../CONTEXT.md), `### Skill composition` | atomic-skill-composition/n-0001/c-0001 | c-0003 | Atom, Molecule, Recipe | shared |
