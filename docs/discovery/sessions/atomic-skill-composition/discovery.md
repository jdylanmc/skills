---
schema-version: 1
session: atomic-skill-composition
state-root: docs/discovery
revision: 4
anchor: idea
anchor-revision: 2026-08-20T16:20:00Z
anchor-status: unchanged
question-group-size: 12
last-question-group-size: 12
last-cycle: c-0004
cycle-state: in-progress
state-digest: d3a54f4c63b0a47837bee0d82aadacaa0bf34064426d8dc3274a8773752bb58a
root-map-digest: c5e43509fb5b23f35e9b4f938f13ba6c26ca4f338467327ad1374fd081259324
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

Restated by the user at the opening of c-0004, as urgency rather than revision:
"all my skills are broken down atomically and follow the structure. whatever it
takes for us to get there." Sharpened during c-0004 into two statements that the
tree now treats as destination: the library is "our own lexicon, our own library
of re-usable tools", and "the skill.md files directly are just thin wrappers
around more structured instruction sets".

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
  and non-routability is inherited from the existing `_base` exclusion. Since
  c-0004 the path is the **sole** authority: a file outside a level namespace is
  not a unit at all;
- every reference file eventually becomes a unit, so the endpoint is a single
  shared library rather than a set of self-contained skill packages, and
  `SKILL.md` is a thin wrapper over the units it composes;
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
| Level namespace | candidate | An underscore-prefixed directory under `skills/_base/` holding units of exactly one composition level, such as `_atoms/` or `_molecules/`. The prefix marks it as a namespace rather than a package. Since c-0004 it is the **sole locus of unit identity**: a Markdown file inside one is a unit, a Markdown file outside one is not a unit and carries no level. | Engineering skills library | none recorded | c-0002 answer Q2; c-0003 answers Q3, Q4; c-0004 answer Q1 | atomic-skill-composition/n-0003/c-0003 | c-0004 | Atom, Molecule, Base package | session:atomic-skill-composition |
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
- Fog: investigating
- Maturity: decision-ready
- Priority: P0
- Outcome: Three levels, all confirmed in the canonical glossary. Atom - references no other unit. Molecule - composes two or more atoms or molecules. Skill - the only directly invocable unit, the contract the agent understands, and confirmed in c-0004 to be a **thin wrapper** carrying no substance of its own. `recipe` is the mental model for a skill; `ingredient` and `organism` are rejected. The c-0003 rider that a level is a property of the unit rather than of its address is **revoked**; see n-0003.
- Open questions: none of its own. Returned to fog `investigating` because clearing a block re-earns `decision-ready` and `cleared` through the ordered states.
- Evidence: c-0001 answers Q2-Q5; c-0002 `/domain-mapping` amendment; c-0003 answers Q1-Q4; c-0004 answers Q1, Q2; root [CONTEXT.md](../../../../CONTEXT.md) `Atom`, `Molecule`, and `Skill` entries; the verified 165-file inventory
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0004 (intact)
- Promotion key: none
- Tracker: none - deliberately not promoted. Conceptual definitions fold into the n-0003 Branch body rather than publishing as work.
- Divergence: none
- History: c-0001 node created; three levels named; Atom confirmed; fog unexplored -> researched; maturity vague -> framed; priority -> P0 | c-0002 molecule-in-molecule answered; Molecule confirmed; fog -> decision-ready; maturity -> researched | c-0003 skill boundary settled as routability with no new obligation; Skill confirmed; conflict with n-0006 reconciled; fog -> cleared; maturity -> promotion-ready | c-0004 its c-0003 level-address rider found to contradict the c-0002 path-agreement requirement; `conflicts-with n-0003` recorded; fog cleared -> blocked; maturity promotion-ready -> decision-ready; the user resolved the conflict against this node's rider, the rider was revoked, the conflict was removed, and fog moved blocked -> investigating; the thin-wrapper framing was added to the Skill outcome

### n-0002 - Composition mechanics at runtime

- Parent: n-0000
- Fog: researched
- Maturity: researched
- Priority: P1
- Outcome: Composition is by `includes` reference between Markdown files. Atoms and molecules are non-invocable, so `includes` is the mechanism and `requires-skills` is not. **Settled in c-0004:** a referenced unit is incorporated at runtime by the consuming unit's prose instructing the agent to read it by relative link, in the documented order. `includes` participates in validation only and never in loading. Composition depth costs one read hop per level and has no enforced limit. Runtime therefore places **no** constraint on where a unit lives, which made the n-0001 / n-0003 conflict a policy choice rather than a mechanical one.
- Open questions: none material. A skill naming only a molecule reaches that molecule's atoms only if the molecule's own prose instructs the read, so collapse must preserve the instruction chain, not merely the link graph. That is an implementation obligation recorded against n-0004 rather than remaining fog here.
- Evidence: `AGENTS.md` line 16; direct observation of this cycle's own runtime; `skills/ship-with-squadron/SKILL.md` frontmatter; `scripts/validate-skill-graph.mjs`
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0004 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created; composition established as by-reference; fog unexplored -> scouted; priority -> P1 | c-0004 answered from evidence rather than from the question budget; fog scouted -> investigating -> researched; maturity framed -> researched

### n-0003 - Packaging, naming, and routing

- Parent: n-0000
- Fog: investigating
- Maturity: decision-ready
- Priority: P0
- Outcome: Atoms live at `skills/_base/_atoms/<name>.md` and molecules at `skills/_base/_molecules/<name>.md`. Both are single Markdown files; the package-directory form is reserved for skills. Non-routability is inherited from the existing `_base` exclusion. Atom frontmatter is `name`, `description`, `level`, `allowed-tools` authored plus `used-by` generated, with `includes` and `requires-skills` forbidden. Molecule frontmatter is `name`, `description`, `level`, `includes` authored plus `allowed-tools` and `used-by` generated, with `requires-skills` forbidden. Deterministic scripts and tests are co-located by basename. **Settled in c-0004:** address is the **sole** authority for level. A unit exists only inside a level namespace; a file outside one is not a unit and carries no level. The shipped validator is correct as written and needs no change.
- Open questions: What naming convention governs a global flat namespace that will hold well over a hundred permanently addressable units? Existing practice already disagrees - `chronicle-append` is noun-verb, the inventory proposes verb-noun. Does a level namespace stay flat at that scale? `validate-skill-graph.mjs` enforces flatness today, written when the population was three.
- Evidence: `scripts/validate-skill-graph.mjs` lines 202, 275, 277, 306, 342-344; `scripts/conformance.test.mjs` line 281; `AGENTS.md` Canonical Formats; `agents/<name>.agent.md` routability flags; `doctrine/manifest.md` generated-and-committed precedent; c-0004 answer Q1
- Links: refines n-0000; blocks n-0005
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0004 (intact)
- Promotion key: atomic-skill-composition/n-0003
- Tracker: Branch [#33 Formalize atom, molecule, and skill packaging, naming, and routing](https://github.com/jdylanmc/skills/issues/33)
- Divergence: Recorded in c-0004 and **resolved within the same cycle**. The node left fog `promoted` for `blocked` while its c-0002 path-agreement requirement stood in conflict with n-0001's c-0003 level-address rider, then returned to `investigating` once the user resolved the conflict in this node's favor. #33 was not edited, and its scope is unchanged by the resolution; two new naming questions were added to this node and are not yet reflected in #33.
- History: c-0001 node created; single-file form settled; fog unexplored -> scouted; maturity vague -> framed; priority -> P0 | c-0002 location, frontmatter schema, and routability settled; fog -> decision-ready; maturity -> decision-ready; debt cleared against n-0006 | c-0003 `Base package` deprecated; code placement settled; fog -> cleared -> promoted; maturity -> promotion-ready; published as Branch #33 | c-0004 `conflicts-with n-0001` recorded on contradicting evidence; fog promoted -> blocked; maturity promotion-ready -> decision-ready; the user chose address-derived level, the conflicting rider was revoked, the conflict was removed, and fog moved blocked -> investigating; naming and flatness at scale added as new fog

### n-0004 - Migration disposition for existing skills

- Parent: n-0000
- Fog: researched
- Maturity: researched
- Priority: P0
- Outcome: **Settled in c-0004.** The endpoint is total: every one of the 165 reference files eventually becomes a unit under `skills/_base/`, because address is the sole authority for level and the user's destination is a shared library of reusable units with its own lexicon. `SKILL.md` becomes a thin wrapper over structured units. Execution is incremental and ordered **value-first**, not simplest-first. No skill remains unclassified. The first target is `roast-this-prompt`, with `roast-this-agent` and `roast-this-skill` necessarily in scope because shared units cannot be extracted from one without changing all three. Per-file granularity is an empirical parameter to be measured on that first target, not a declared rule.
- Open questions: What is the true atoms-per-file ratio, and therefore the endpoint unit count? A loop projection of roughly 900 atoms was derived from level-two heading counts and rejected by the user as unfounded; the heading count was never established as an operation count. What is the schedule beyond the first target?
- Evidence: 22 directory entries under `skills/`, of which `_base` is non-routable and `reinforce-skill` is untracked; the verified c-0004 inventory - 36 files in 12 clusters, 26 near-miss only, 103 skill-specific; measured scale of 16,671 lines and 929 headings; c-0004 answers Q1-Q4
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0004 (intact)
- Promotion key: none
- Tracker: none. Candidate for promotion once the naming convention in n-0003 is settled, since every migrated unit needs a name that is globally unique and permanent.
- Divergence: none
- History: c-0001 node created; fog unexplored -> scouted; priority -> P1 | c-0003 reframed as classification-first after the 165-file survey; fog -> investigating; maturity vague -> framed | c-0004 endpoint settled as total migration, ordering settled as value-first, first target chosen, granularity deferred to measurement; fog investigating -> researched; maturity framed -> researched; priority P1 -> P0 because it now carries the destination itself

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
- Fog: researched
- Maturity: researched
- Priority: P1
- Outcome: **The inventory exists and is verified.** 36 of 165 reference files fall into 12 accepted duplication clusters, 26 into rejected near-misses only, and 103 are genuinely skill-specific. Exactly one cluster is proven by digest rather than judgment: four byte-identical copies of the 591-line `artifact-roastmaster.agent.md`, one canonical and three vendored, carrying 1,773 duplicate lines. The widest non-identical cluster is an explicit write-approval gate spanning six skills. `roast-this-code` joins none of the roast-family clusters and has genuinely diverged.
- Open questions: May the three vendored coordinator copies be collapsed at all? They are deliberate digest-pinned fallbacks that let a roast skill install standalone, stated in `skills/roast-this-prompt/SKILL.md`. Collapsing them removes that property, so this is a user decision and not an inventory finding.
- Evidence: verified c-0004 inventory with per-cluster paths, line ranges, and verbatim excerpts; independent repository-wide digest comparison confirming exactly one byte-identical group; `skills/roast-this-prompt/SKILL.md` Prerequisites
- Links: refines n-0004; evidence-for n-0000; blocks n-0005
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0004 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created because the Q6 collapse test requires a named target set | c-0003 the 165-file survey gave it a concrete population; fog unexplored -> scouted; maturity vague -> framed | c-0004 the inventory was produced by a delegated read-only survey, its false completeness claim was caught and corrected, and its strongest cluster was independently verified by digest; fog scouted -> investigating -> researched; maturity framed -> researched

## Active Frontier

| Node | Fog | Maturity | Priority | Blocked by | Open questions |
| --- | --- | --- | --- | --- | --- |
| n-0001 | investigating | decision-ready | P0 | none | none of its own; re-earning `cleared` through the ordered states after its c-0004 unblock |
| n-0003 | investigating | decision-ready | P0 | none | Naming convention for a global namespace; whether a level namespace stays flat at scale |
| n-0004 | researched | researched | P0 | none | True atoms-per-file ratio; schedule beyond the first target |
| n-0002 | researched | researched | P1 | none | none material |
| n-0005 | investigating | researched | P1 | n-0003 | What check proves collapse itself |
| n-0007 | researched | researched | P1 | none | May the vendored coordinator copies be collapsed, given standalone-install intent |

Nodes n-0000 is at fog `cleared` and n-0006 is at fog `promoted`, so neither
appears on the frontier. n-0007 no longer blocks n-0005: the inventory it owed
now exists, so n-0005's remaining blocker is n-0003 alone.

## Priority Debt

| Lower-priority node | Outran (maturity below researched) | Relation | Cause | Detected | Last seen | Status |
| --- | --- | --- | --- | --- | --- | --- |

No open or deferred debt. n-0001 and n-0003 were lowered to maturity
`decision-ready` in c-0004, which is above the `researched` floor, so the
lowering generated no debt.


## Tracker Synchronization

| Node | Tier | Promotion key | Tracker item | Last synced cycle | Divergence |
| --- | --- | --- | --- | --- | --- |
| n-0003 | Branch | atomic-skill-composition/n-0003 | [#33](https://github.com/jdylanmc/skills/issues/33) | c-0003 | none |
| n-0006 | Task | atomic-skill-composition/n-0006 | [#34](https://github.com/jdylanmc/skills/issues/34) | c-0003 | none |
