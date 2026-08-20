---
schema-version: 1
session: atomic-skill-composition
state-root: docs/discovery
revision: 3
anchor: idea
anchor-revision: 2026-08-20T16:20:00Z
anchor-status: unchanged
question-group-size: 12
last-question-group-size: 12
last-cycle: c-0003
cycle-state: complete
state-digest: 0e49f31eebdcd5f80b9f2761602278baa79e4244217d5d2ab2c68cb154fea06f
root-map-digest: f5e452e65e8bfe0aee02dc66fc4f3daa7e5f3fcd5065c8ffe0c4a90927820bd3
root-lexicon-digest: 08946ae544bc2c59fa295daa55af4656fdba8ad3e6d4e951e77bb8b76106b135
digest-tool: shasum -a 256
digest-status: verified
state-scope: full
tracker-mode: remote
tracker-tier-map: Branch=GitHub issue; Story=GitHub sub-issue; Task=GitHub sub-issue
---

# Discovery Session - Atomic Skill Composition

## Anchor

Recorded at session setup on 2026-08-20T15:55:37Z and revised during c-0001 at
2026-08-20T16:20:00Z.

All skills in this repository should become atomic in nature, taking
inspiration from Atomic Design. An **atom** is a very specific single thing,
such as querying a customer database, asking a question, editing a file, or
downloading a file. A **molecule** is a collection of things, such as querying
a database, running a query, and writing the results to a file. Skills build
upon themselves, starting at the bottom with atoms and moving up to molecules.

Revision in c-0001: the third level is named **skill**, not `organism`. A skill
is understood as a *recipe* - an invocable procedure that names what it needs
and the steps it runs. `Recipe` is the mental model for a skill, never a
separate structural level. A proposed four-level scheme
(atom, molecule, ingredient, recipe) was considered and rejected.

The purpose is to put structure and order on a loose concept: reuse,
de-duplication, composability, testability, and best-practice enforcement.

## Destination

A stated, enforceable composition model for the skills library in which:

- there are exactly three composition levels - atom, molecule, skill;
- an atom is any single operation, judged from the caller's point of view,
  expressed as one Markdown file with frontmatter consistent across all atoms,
  referencing no other unit;
- a molecule is a single Markdown file that composes two or more atoms **or
  molecules** by reference;
- atoms live at `skills/_base/_atoms/<name>.md` and molecules at
  `skills/_base/_molecules/<name>.md`, so the level is derivable from the path
  and non-routability is inherited from the existing `_base` exclusion;
- authored frontmatter is minimal and derived frontmatter is generated:
  `used-by` on every unit and `allowed-tools` on every molecule are written by
  the validator and verified in continuous integration, never hand-edited;
- a skill is the invocable unit that already exists as `skills/<name>/SKILL.md`;
- adoption is proven by collapse: behavior currently duplicated across skills
  exists exactly once, and every former copy is replaced by a reference;
- enforcement is automated, and the check proves collapse rather than mere
  declaration.

## Session Domain Lexicon

| Term | Status | Definition | Bounded context | Aliases | Source | First seen | Last verified | Related terms | Scope |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Atom | confirmed | The smallest unit of skill composition: one single operation as judged from the caller's point of view, expressed as a single Markdown file whose frontmatter is consistent across all atoms. An atom references no other unit of composition. | Engineering skills library | `primitive` (discouraged), `ingredient` (discouraged) | Root [CONTEXT.md](../../../../CONTEXT.md), `### Skill composition`, confirmed c-0001 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Molecule, Skill, Composition level | session:atomic-skill-composition |
| Base package | deprecated | Superseded in c-0003. Once Chronicler decomposes into atoms plus a composing molecule, no package-shaped directory remains under `skills/_base/`, which then holds only `_`-prefixed level namespaces. The c-0002 conflict is resolved by retiring the term rather than by choosing a reading. | Engineering skills library | none | c-0003 answers Q3, Q4 | atomic-skill-composition/n-0003/c-0001 | c-0003 | Level namespace, Molecule, Skill | session:atomic-skill-composition |
| Level namespace | candidate | An underscore-prefixed directory under `skills/_base/` holding units of exactly one composition level, such as `_atoms/` or `_molecules/`. The prefix marks it as a namespace rather than a package. | Engineering skills library | none recorded | c-0002 answer Q2; c-0003 answers Q3, Q4 | atomic-skill-composition/n-0003/c-0003 | c-0003 | Atom, Molecule, Base package | session:atomic-skill-composition |
| Composition level | candidate | The declared position of a unit in the atom-molecule-skill ordering. | Engineering skills library | `Tier` (discouraged - collides with the tracker tier hierarchy Branch, Story, Task) | Discovery Loop tracker-tier-map collision, c-0001 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Atom, Molecule, Skill | session:atomic-skill-composition |
| Ingredient | deprecated | Proposed and rejected in c-0001 as a fourth composition level. In the cooking metaphor that supplies the word, an ingredient is the primitive, so placing it above Molecule inverts the metaphor. Recorded to prevent reproposal. | Engineering skills library | none | c-0001 question Q5 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Atom, Recipe | session:atomic-skill-composition |
| Molecule | confirmed | A unit of skill composition that composes two or more atoms or molecules by reference to produce one bounded outcome, expressed as a single Markdown file. A molecule declares what it composes; what it may use and what consumes it are derived from that declaration rather than authored. | Engineering skills library | none recorded | Root [CONTEXT.md](../../../../CONTEXT.md), `### Skill composition`, confirmed c-0002 | atomic-skill-composition/n-0001/c-0001 | c-0002 | Atom, Skill, Composition level | session:atomic-skill-composition |
| Organism | deprecated | The original name for the third composition level. Superseded by Skill in c-0001. | Engineering skills library | none | c-0001 question Q5 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Skill | session:atomic-skill-composition |
| Recipe | candidate | The mental model for what a Skill is: an invocable procedure that names what it needs and the steps it runs. Never a structural composition level. Pending `/domain-mapping` confirmation. | Engineering skills library | none recorded | c-0001 question Q5 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Skill | session:atomic-skill-composition |
| Skill | confirmed | The only unit of skill composition that may be invoked directly, by a router or by a person: the contract the agent understands. A skill composes molecules and atoms rather than restating what a shared unit already defines. | Engineering skills library | `Organism` (discouraged) | Root [CONTEXT.md](../../../../CONTEXT.md), `### Skill composition`, confirmed c-0003 | atomic-skill-composition/n-0001/c-0001 | c-0003 | Atom, Molecule, Recipe | session:atomic-skill-composition |

## Tree

### n-0000 - Atomic skill composition model

- Parent: none
- Fog: cleared
- Maturity: researched
- Priority: P0
- Outcome: A three-level composition model - atom, molecule, skill - is adopted when behavior currently duplicated across skills exists exactly once as an atom or molecule, every former copy is replaced by a reference, and an automated check enforces both the declared level and downward-only composition.
- Open questions: none. Held at maturity `researched` rather than `promotion-ready` because the migration disposition in n-0004 is not yet confirmed.
- Evidence: c-0001 answers Q1, Q5, Q6; c-0003 answers Q1, Q2; root [CONTEXT.md](../../../../CONTEXT.md)
- Links: none
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0003 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created; purpose, level count, and adoption test settled; fog unexplored -> decision-ready; maturity vague -> researched; priority -> P0

### n-0001 - Composition level definitions and boundaries

- Parent: n-0000
- Fog: cleared
- Maturity: promotion-ready
- Priority: P0
- Outcome: Three levels, all confirmed in the canonical glossary. Atom - references no other unit. Molecule - composes two or more atoms or molecules. Skill - the only directly invocable unit, the contract the agent understands. `recipe` is the mental model for a skill; `ingredient` and `organism` are rejected. The skill level carries no obligation beyond composing rather than restating, because composition is already universal in this repository.
- Open questions: none
- Evidence: c-0001 answers Q2-Q5; c-0002 `/domain-mapping` amendment; c-0003 answers Q1-Q4; root [CONTEXT.md](../../../../CONTEXT.md) `Atom`, `Molecule`, and `Skill` entries; the 165-file reference survey
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0003 (intact)
- Promotion key: none
- Tracker: none - deliberately not promoted. Conceptual definitions fold into the n-0003 Branch body rather than publishing as work.
- Divergence: none
- History: c-0001 node created; three levels named; Atom confirmed; fog unexplored -> researched; maturity vague -> framed; priority -> P0 | c-0002 molecule-in-molecule answered; Molecule confirmed; fog -> decision-ready; maturity -> researched | c-0003 skill boundary settled as routability with no new obligation; Skill confirmed; conflict with n-0006 reconciled; fog -> cleared; maturity -> promotion-ready

### n-0002 - Composition mechanics at runtime

- Parent: n-0000
- Fog: investigating
- Maturity: framed
- Priority: P1
- Outcome: Composition is by `includes` reference between Markdown files. Atoms and molecules are non-invocable, so `includes` is the mechanism and `requires-skills` is not.
- Open questions: How does a consuming unit's instruction text actually incorporate a referenced unit at runtime, given that `AGENTS.md` states `includes` is a dependency mirror rather than a loading directive? Is a written cross-reference under `## Required References` the only real mechanism?
- Evidence: `skills/ship-with-squadron/SKILL.md` frontmatter shows `includes` and `requires-skills` already in use; `scripts/validate-skill-graph.mjs` scans `## Required References` links
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0003 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created; composition established as by-reference; fog unexplored -> scouted; priority -> P1

### n-0003 - Packaging, naming, and routing

- Parent: n-0000
- Fog: promoted
- Maturity: promotion-ready
- Priority: P0
- Outcome: Atoms live at `skills/_base/_atoms/<name>.md` and molecules at `skills/_base/_molecules/<name>.md`. Both are single Markdown files; the package-directory form is reserved for skills. Non-routability is inherited from the existing `_base` exclusion in `validate-skill-graph.mjs`. Atom frontmatter is `name`, `description`, `level`, `allowed-tools` authored plus `used-by` generated, with `includes` and `requires-skills` forbidden. Molecule frontmatter is `name`, `description`, `level`, `includes` authored plus `allowed-tools` and `used-by` generated, with `requires-skills` forbidden. Deterministic scripts and tests are co-located by basename with the unit they implement.
- Open questions: none
- Evidence: `scripts/validate-skill-graph.mjs` lines 202 and 277; `scripts/conformance.test.mjs` line 281; `AGENTS.md` Canonical Formats; `agents/<name>.agent.md` routability flags; `doctrine/manifest.md` generated-and-committed precedent
- Links: refines n-0000; blocks n-0005
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0003 (intact)
- Promotion key: atomic-skill-composition/n-0003
- Tracker: Branch [#33 Formalize atom, molecule, and skill packaging, naming, and routing](https://github.com/jdylanmc/skills/issues/33)
- Divergence: none
- History: c-0001 node created; single-file form settled; fog unexplored -> scouted; maturity vague -> framed; priority -> P0 | c-0002 location, frontmatter schema, and routability settled; fog -> decision-ready; maturity -> decision-ready; debt cleared against n-0006 | c-0003 `Base package` deprecated so gate condition 10 passes; code placement settled; fog -> cleared -> promoted; maturity -> promotion-ready; published as Branch #33

### n-0004 - Migration disposition for existing skills

- Parent: n-0000
- Fog: investigating
- Maturity: framed
- Priority: P1
- Outcome: Migration is a classification exercise before it is a move. Every one of the 165 existing reference files carries a level wherever it lives; shared units later relocate into the level namespaces.
- Open questions: Do all 21 routable skills get classified at once or incrementally? Is a skill allowed to remain unclassified? What is the schedule?
- Evidence: 22 directory entries under `skills/`, of which `_base` is non-routable and `reinforce-skill` is untracked; the c-0003 survey of 165 reference files, 135 atom-shaped and 30 molecule-shaped
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0003 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created; fog unexplored -> scouted; priority -> P1 | c-0003 reframed as classification-first after the 165-file survey; fog -> investigating; maturity vague -> framed

### n-0005 - Verification and enforcement

- Parent: n-0000
- Fog: investigating
- Maturity: researched
- Priority: P1
- Outcome: An automated check is required, not optional. It must prove collapse, not merely that a level was declared. Five concrete checks are now specified: path and `level` frontmatter must agree; forbidden fields must be absent per level; `used-by` and molecule `allowed-tools` are validator-written and continuous-integration-verified; the composition graph must be acyclic; and a `.mjs` file in a level namespace must have a matching `.md` of the same basename.
- Open questions: What check proves collapse itself? Declaration, direction, forbidden fields, derivation, cycles, and code pairing are all mechanically checkable, but "this behavior exists exactly once" is not, and likely depends on the named inventory from n-0007 rather than an algorithm. Zero-consumer units are reported, never failed, because the library holds reusable units that owe no caller.
- Evidence: `scripts/validate-skill-graph.mjs`; `.github/workflows/validate-skills.yml`; `doctrine/manifest.md`; c-0001 answer Q6; c-0002 answers Q4, Q5; c-0003 answers Q1, Q4
- Links: refines n-0000; depends-on n-0003; depends-on n-0007
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0003 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created; enforcement confirmed mandatory; fog unexplored -> scouted; maturity vague -> framed; priority -> P1 | c-0002 three concrete checks specified; cycle detection added after molecule-in-molecule was confirmed; fog scouted -> investigating

### n-0006 - Chronicler reconciliation against the single-file rule

- Parent: n-0003
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Chronicler is a molecule that composes atomic chronicle operations, `append` among them. It is a base that is never used on its own; its purpose is to keep a running log of skill operations across a long-running session. The current package form is retired: atoms move to `_base/_atoms/`, the composing molecule to `_base/_molecules/chronicler.md`, and scripts and tests are co-located by basename.
- Open questions: none as fog. The exact atom decomposition list is carried into the tracker item as explicitly unresolved metadata rather than invented acceptance criteria.
- Evidence: `skills/_base/chronicler/` contents; c-0003 survey showing no routable skill has a `scripts/` directory and Chronicler is the repository's only script-bearing package; `scripts/conformance.test.mjs` lines 298 and 385
- Links: refines n-0003
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0003 (intact)
- Promotion key: atomic-skill-composition/n-0006
- Tracker: Task [#34 Decompose Chronicler into atoms plus a composing molecule](https://github.com/jdylanmc/skills/issues/34)
- Divergence: none
- History: c-0001 node created after Q4 made the only existing base package non-conforming | c-0002 `Base package` marked conflicted; debt row against n-0003 cleared | c-0003 resolved as a molecule composing atoms; `conflicts-with n-0001` reconciled and removed; fog -> cleared -> promoted; maturity -> promotion-ready; published as Task #34

### n-0007 - Collapse target inventory

- Parent: n-0004
- Fog: scouted
- Maturity: framed
- Priority: P1
- Outcome: The collapse inventory largely falls out of classification: once every reference file carries a level, duplication candidates are same-level units with matching purpose across different skills.
- Open questions: Which behaviors are genuinely duplicated across the 135 atom-shaped and 30 molecule-shaped reference files? A survey has counted them but not compared them.
- Evidence: c-0003 survey - 165 reference files across 21 skills, 135 referencing no other unit and 30 referencing others
- Links: refines n-0004; evidence-for n-0000; blocks n-0005
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0003 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created because the Q6 collapse test requires a named target set | c-0003 the 165-file survey gave it a concrete population; fog unexplored -> scouted; maturity vague -> framed

## Active Frontier

| Node | Fog | Maturity | Priority | Blocked by | Open questions |
| --- | --- | --- | --- | --- | --- |
| n-0002 | investigating | framed | P1 | none | How a referenced unit is incorporated at runtime |
| n-0004 | investigating | framed | P1 | none | Classification scope and schedule; may a skill stay unclassified |
| n-0005 | investigating | researched | P1 | n-0003, n-0007 | What check proves collapse itself |
| n-0007 | scouted | framed | P1 | none | Which of the 165 reference files are genuinely duplicated |

Nodes n-0000 and n-0001 are at fog `cleared`, and n-0003 and n-0006 are at fog
`promoted`, so none of the four appears on the frontier.

## Priority Debt

| Lower-priority node | Outran (maturity below researched) | Relation | Cause | Detected | Last seen | Status |
| --- | --- | --- | --- | --- | --- | --- |

No open or deferred debt. Every P0 node is at maturity `researched` or above.

## Tracker Synchronization

| Node | Tier | Promotion key | Tracker item | Last synced cycle | Divergence |
| --- | --- | --- | --- | --- | --- |
| n-0003 | Branch | atomic-skill-composition/n-0003 | [#33](https://github.com/jdylanmc/skills/issues/33) | c-0003 | none |
| n-0006 | Task | atomic-skill-composition/n-0006 | [#34](https://github.com/jdylanmc/skills/issues/34) | c-0003 | none |
