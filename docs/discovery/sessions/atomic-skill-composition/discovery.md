---
schema-version: 1
session: atomic-skill-composition
state-root: docs/discovery
revision: 6
anchor: idea
anchor-revision: 2026-08-20T16:20:00Z
anchor-status: unchanged
question-group-size: 12
last-question-group-size: 12
last-cycle: c-0006
cycle-state: complete
state-digest: 2a6b7585670360354885aab2996b74e1e126fe8a2b55c76c3df0a8cef4e5bb06
root-map-digest: 2c0115b56cc83fe3ce829670e477b73f66f1d962f535fad0cdaf686a6c457556
root-lexicon-digest: 08946ae544bc2c59fa295daa55af4656fdba8ad3e6d4e951e77bb8b76106b135
digest-tool: python3 hashlib.sha256
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
- Maturity: promotion-ready
- Priority: P0
- Outcome: A three-level composition model - atom, molecule, skill - is adopted when behavior currently duplicated across skills exists exactly once as an atom or molecule, every former copy is replaced by a reference, and an automated check enforces both the declared level and downward-only composition.
- Open questions: none. n-0004 now confirms the migration disposition and the next value-first slice.
- Evidence: c-0001 answers Q1, Q5, Q6; c-0003 answers Q1, Q2; root [CONTEXT.md](../../../../CONTEXT.md)
- Links: none
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0006 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created; purpose, level count, and adoption test settled; fog unexplored -> decision-ready; maturity vague -> researched; priority -> P0 | c-0006 n-0004 confirmed the next value-first slice; maturity researched -> promotion-ready

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
- Reinterpreted: c-0006 (intact)
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
- Reinterpreted: c-0006 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created; composition established as by-reference; fog unexplored -> scouted; priority -> P1 | c-0004 answered from evidence rather than from the question budget; fog scouted -> investigating -> researched; maturity framed -> researched

### n-0003 - Packaging, naming, and routing

- Parent: n-0000
- Fog: cleared
- Maturity: promotion-ready
- Priority: P0
- Outcome: Atoms live at `skills/_base/_atoms/<name>.md` and molecules at `skills/_base/_molecules/<name>.md`. Both are single Markdown files. Address is the **sole** authority for level. An atom declares `includes: []`; a molecule declares two or more downward composition references. Scripts and tests are co-located by basename. Unit names are `<domain>-<verb>[-<object>].md`, kebab-case, globally unique, no numeric prefix and no level suffix, domain first so families cluster; a level namespace stays flat, revisited only when one domain prefix exceeds roughly twenty units; and every unit declares `## Inputs`, `## Output`, `## Guarantees`, and `## Boundaries`. Ten current units across five domain prefixes demonstrate the convention.
- Open questions: none.
- Evidence: `scripts/validate-skill-graph.mjs`; `scripts/derive-skill-graph.mjs`; `AGENTS.md` Canonical Formats; c-0004 answer Q1; c-0005 evidence `E-c0005-3`, `E-c0005-4`; commits #36, #37, and #40; the ten current units
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0006 (intact)
- Promotion key: atomic-skill-composition/n-0003
- Tracker: Branch [#33 Formalize atom, molecule, and skill packaging, naming, and routing](https://github.com/jdylanmc/skills/issues/33)
- Divergence: Last known tracker state is open. #33 predates the c-0005 naming, flatness, and unit-contract decisions and says atoms omit `includes`, while the adopted and implemented convention requires `includes: []`. Its generated `used-by` and molecule `allowed-tools` criteria shipped in #40. The implementation scope is complete; tracker reconciliation was not run in c-0006.
- History: c-0001 node created; single-file form settled; fog unexplored -> scouted; maturity vague -> framed; priority -> P0 | c-0002 location, frontmatter schema, and routability settled; fog -> decision-ready; maturity -> decision-ready; debt cleared against n-0006 | c-0003 `Base package` deprecated; code placement settled; fog -> cleared -> promoted; maturity -> promotion-ready; published as Branch #33 | c-0004 `conflicts-with n-0001` recorded on contradicting evidence; fog promoted -> blocked; the user chose address-derived level and the conflict was removed; fog blocked -> investigating; maturity -> decision-ready; naming and flatness added as new fog | c-0005 naming convention decided under delegation on executed evidence; flatness retained with a revisit threshold; unit contract sections added; fog investigating -> researched -> decision-ready; maturity -> promotion-ready | c-0006 current main verified ten conforming units and shipped derivation; fog decision-ready -> cleared

### n-0004 - Migration disposition for existing skills

- Parent: n-0000
- Fog: cleared
- Maturity: promotion-ready
- Priority: P0
- Outcome: The endpoint is total: every reference file eventually becomes a unit under `skills/_base/`, `SKILL.md` becomes a thin wrapper over structured units, and execution is incremental and **value-first**. The first migration shipped shared review and write units. **Settled in c-0006:** the next tracer-bullet is n-0008, one `roast-coordinate-review` molecule consumed by all three artifact-roast skills. It deliberately excludes trusted-source adaptation and issue #35 behavior so the next pull request collapses existing skill behavior without expanding the product.
- Open questions: none for the requested next chunk. The value order after n-0008 is recalculated from a refreshed inventory rather than fixed prematurely.
- Evidence: the verified c-0004 inventory; c-0004 answers Q1-Q4; c-0005 first-migration measurement; commits #38-#40; c-0006 focused read-only research across all three roast packages; c-0006 Q1
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0006 (intact)
- Promotion key: none
- Tracker: none. The concrete next delivery slice is n-0008.
- Divergence: none
- History: c-0001 node created; fog unexplored -> scouted; priority -> P1 | c-0003 reframed as classification-first after the 165-file survey; fog -> investigating; maturity vague -> framed | c-0004 endpoint settled as total migration, ordering settled as value-first, first target chosen, granularity deferred to measurement; fog investigating -> researched; maturity framed -> researched; priority P1 -> P0 | c-0005 first migration executed and the ratio measured at roughly 1.5 units per duplicated behavior, materially fewer than one unit per reference file; the c-0004 projection of roughly 900 atoms is contradicted by measurement; maturity researched -> decision-ready | c-0006 next value-first slice selected; fog decision-ready -> cleared; maturity decision-ready -> promotion-ready

### n-0005 - Verification and enforcement

- Parent: n-0000
- Fog: investigating
- Maturity: researched
- Priority: P1
- Outcome: An automated check is required, not optional. It must prove collapse, not merely that a level was declared. Current enforcement checks path/frontmatter agreement, level schemas, downward composition, cycles, local support-file ownership, required-reference mirrors, generated `used-by`, generated transitive molecule `allowed-tools`, and deliberate skill permission grants. Collapse itself still requires a requirement-union audit.
- Open questions: Can the union audit be automated? c-0005 produced the strongest answer so far to "what check proves collapse": a diff-based audit of every removed requirement against the unit plus the caller, before merge. Five of seven regressions in the first migration were union losses, so this is the dominant failure mode rather than an incidental one. It is currently a human diff review and is deliberately not claimed to be automatable.
- Evidence: `scripts/validate-skill-graph.mjs`; `scripts/derive-skill-graph.mjs`; `.github/workflows/validate-skills.yml`; `doctrine/manifest.md`; c-0001 answer Q6; c-0002 answers Q4, Q5; c-0003 answers Q1, Q4; commit #40
- Links: refines n-0000; depends-on n-0007
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0006 (intact)
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
- Reinterpreted: c-0006 (intact)
- Promotion key: atomic-skill-composition/n-0006
- Tracker: Task [#34 Decompose Chronicler into atoms plus a composing molecule](https://github.com/jdylanmc/skills/issues/34)
- Divergence: none
- History: c-0001 node created after Q4 made the only existing base package non-conforming | c-0002 `Base package` marked conflicted; debt row against n-0003 cleared | c-0003 resolved as a molecule composing atoms; `conflicts-with n-0001` reconciled and removed; fog -> cleared -> promoted; maturity -> promotion-ready; published as Task #34

### n-0007 - Collapse target inventory

- Parent: n-0004
- Fog: decision-ready
- Maturity: decision-ready
- Priority: P1
- Outcome: The c-0004 inventory remains the verified baseline: 12 accepted clusters over 36 of 165 reference files. C5 and C7 were collapsed in the first migration, and #38 eliminated N1 by removing the vendored coordinators and standalone-install property. A c-0006 focused refresh found the next current cluster: roughly 75-105 repeated workflow lines across the three artifact-roast `SKILL.md` files, covering coordinate, validate, retry once, synthesize, and common status handling. `agent-resolve` partially covers old C1 but does not own roast-specific orchestration.
- Open questions: Re-run the complete repository-wide inventory after n-0008 before scheduling the following slice. The full definitions of all twelve historical clusters were not preserved in durable state, so this cycle does not claim a complete current recount.
- Evidence: verified c-0004 inventory; c-0005 first migration; commits #38 and #40; c-0006 focused package research with exact caller-owned boundaries
- Links: refines n-0004; evidence-for n-0000; evidence-for n-0005
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0006 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created because the Q6 collapse test requires a named target set | c-0003 the 165-file survey gave it a concrete population; fog unexplored -> scouted; maturity vague -> framed | c-0004 the inventory was produced by a delegated read-only survey, its false completeness claim was caught and corrected, and its strongest cluster was independently verified by digest; fog scouted -> investigating -> researched; maturity framed -> researched | c-0006 #38 resolved the standalone-install blocker, a focused refresh selected the next current cluster, and the missing durable definitions of the full cluster set were recorded; fog researched -> decision-ready; maturity researched -> decision-ready

### n-0008 - Shared artifact-roast orchestration

- Parent: n-0004
- Fog: cleared
- Maturity: promotion-ready
- Priority: P0
- Outcome: Extract one `roast-coordinate-review` molecule that owns the common artifact-roast sequence: accept already resolved trusted inputs, launch one fresh read-only `coordinate` task, preserve the returned envelope unchanged, validate it, retry exactly once with a new coordinator on first validation failure, return `Unsynthesized` on the second failure, launch one fresh `synthesize` task on success, and apply common named-status handling. Migrate `roast-this-agent`, `roast-this-prompt`, and `roast-this-skill` together in one pull request.
- Open questions: none. Trusted-source adaptation, artifact-specific contracts, prompt stale-evidence rehashing, artifact-specific prohibitions, output-schema details, package-specific recovery language, and issue #35 behavior remain caller-owned or separately scheduled.
- Evidence: c-0006 focused read-only research across all three roast packages; c-0006 Q1; c-0005 requirement-union finding
- Links: refines n-0004; depends-on n-0003; evidence-for n-0005
- First seen: c-0006
- Former node id: none
- Reinterpreted: c-0006 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0006 node created from the selected value-first slice; fog -> cleared; maturity -> promotion-ready; priority -> P0

## Active Frontier

| Node | Fog | Maturity | Priority | Blocked by | Open questions |
| --- | --- | --- | --- | --- | --- |
| n-0001 | investigating | decision-ready | P0 | none | none of its own; re-earning `cleared` through the ordered states |
| n-0002 | researched | researched | P1 | none | none material |
| n-0005 | investigating | researched | P1 | none | Can the union audit be automated |
| n-0007 | decision-ready | decision-ready | P1 | none | Refresh the full inventory after n-0008 |

n-0000, n-0003, n-0004, and n-0008 are at fog `cleared`; n-0006 is at fog
`promoted`; none appears. n-0008 is the planned next implementation chunk, not
frontier fog.

## Priority Debt

| Lower-priority node | Outran (maturity below researched) | Relation | Cause | Detected | Last seen | Status |
| --- | --- | --- | --- | --- | --- | --- |

No open or deferred debt. Every P0 node is at maturity `decision-ready` or
above, so no lower-priority node can be outranking one.


## Tracker Synchronization

| Node | Tier | Promotion key | Tracker item | Last synced cycle | Divergence |
| --- | --- | --- | --- | --- | --- |
| n-0003 | Branch | atomic-skill-composition/n-0003 | [#33](https://github.com/jdylanmc/skills/issues/33) | c-0003 | Last known open; body predates c-0005 naming/contracts, incorrectly says atoms omit `includes`, and does not reflect #40 derivation. Reconcile before the next tracker mutation. |
| n-0006 | Task | atomic-skill-composition/n-0006 | [#34](https://github.com/jdylanmc/skills/issues/34) | c-0003 | none |
