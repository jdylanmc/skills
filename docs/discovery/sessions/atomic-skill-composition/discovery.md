---
schema-version: 1
session: atomic-skill-composition
state-root: docs/discovery
revision: 13
anchor: idea
anchor-revision: 2026-08-22T02:11:00Z
anchor-status: unchanged
question-group-size: 12
last-question-group-size: 12
last-cycle: c-0013
cycle-state: complete
state-digest: 425c3ebd0c375419a8beded27e4c7dda0558bc4f1555a7f919af98d4f527f9b5
root-map-digest: 22244daa15daabb5fc30176337b84e54b182ee777b99e22bf32d2b21eaaf8675
root-lexicon-digest: b6f8899f45f8bf06b2575c825a5acaac292e2ceb87da090e1fe6d7d577c7f991
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
- skill-local atoms live at
  `skills/<skill>/_atoms/<name>/<name>.md` and skill-local molecules at
  `skills/<skill>/_molecules/<name>/<name>.md`;
- a unit moves to the shared `_base` namespaces only when at least two named
  consumers are current skills or explicitly approved skill designs;
- the path remains the authority for level and ownership, local unit names are
  scoped to their skill, and each unit's support files stay isolated in its
  same-named root;
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
| Base package | deprecated | Superseded in c-0003. No independently routable base package remains under `skills/_base/`, which holds only `_`-prefixed level namespaces. Same-named unit roots added after c-0006 are isolation containers, not packages. The c-0002 conflict is resolved by retiring the term rather than by choosing a reading. | Engineering skills library | none | c-0003 answers Q3, Q4; post-c-0006 unit-root migration | atomic-skill-composition/n-0003/c-0001 | post-c-0006 | Level namespace, Molecule, Skill | session:atomic-skill-composition |
| Composition level | candidate | The declared position of a unit in the atom-molecule-skill ordering. | Engineering skills library | `Tier` (discouraged - collides with the tracker tier hierarchy Branch, Story, Task) | Discovery Loop tracker-tier-map collision, c-0001 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Atom, Molecule, Skill | session:atomic-skill-composition |
| Ingredient | deprecated | Proposed and rejected in c-0001 as a fourth composition level. In the cooking metaphor that supplies the word, an ingredient is the primitive, so placing it above Molecule inverts the metaphor. Recorded to prevent reproposal. | Engineering skills library | none | c-0001 question Q5 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Atom, Recipe | session:atomic-skill-composition |
| Level namespace | candidate | An `_atoms/` or `_molecules/` directory under a routable skill or under `_base`, holding units of exactly one composition level. Its path determines level and ownership. | Engineering skills library | none recorded | c-0007 reinterpretation of c-0002/c-0004 decisions | atomic-skill-composition/n-0003/c-0003 | c-0007 | Atom, Molecule, Local unit, Shared unit | session:atomic-skill-composition |
| Local unit | candidate | An atom or molecule stored under one routable skill because it has fewer than two qualifying consumers. | Engineering skills library | skill-specific unit | c-0007 Q1 and [ADR 0001](../../../adr/0001-use-local-units-and-promote-proven-shared-units.md) | atomic-skill-composition/n-0003/c-0007 | c-0007 | Shared unit, Level namespace | session:atomic-skill-composition |
| Molecule | confirmed | A unit of skill composition that composes two or more atoms or molecules by reference to produce one bounded outcome, expressed as a single Markdown file. A molecule declares what it composes; what it may use and what consumes it are derived from that declaration rather than authored. | Engineering skills library | none recorded | Root [CONTEXT.md](../../../../CONTEXT.md), `### Skill composition`, confirmed c-0002 | atomic-skill-composition/n-0001/c-0001 | c-0002 | Atom, Skill, Composition level | session:atomic-skill-composition |
| Organism | deprecated | The original name for the third composition level. Superseded by Skill in c-0001. | Engineering skills library | none | c-0001 question Q5 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Skill | session:atomic-skill-composition |
| Recipe | candidate | The mental model for what a Skill is: an invocable procedure that names what it needs and the steps it runs. Never a structural composition level. Pending `/domain-mapping` confirmation. | Engineering skills library | none recorded | c-0001 question Q5 | atomic-skill-composition/n-0001/c-0001 | c-0001 | Skill | session:atomic-skill-composition |
| Shared unit | confirmed | An atom or molecule stored under `skills/_base/` because at least two named consumers are either current skills or explicitly approved skill designs. A unit with fewer qualifying consumers remains local to its owning skill. | Engineering skills library | `global unit` (discouraged) | Root [CONTEXT.md](../../../../CONTEXT.md), confirmed c-0007; [ADR 0001](../../../adr/0001-use-local-units-and-promote-proven-shared-units.md) | atomic-skill-composition/n-0003/c-0007 | c-0007 | Local unit, Level namespace | session:atomic-skill-composition |
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
- Reinterpreted: c-0012 (intact)
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
- Reinterpreted: c-0012 (intact)
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
- Reinterpreted: c-0012 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created; composition established as by-reference; fog unexplored -> scouted; priority -> P1 | c-0004 answered from evidence rather than from the question budget; fog scouted -> investigating -> researched; maturity framed -> researched

### n-0003 - Packaging, naming, and routing

- Parent: n-0000
- Fog: scouted
- Maturity: promotion-ready
- Priority: P0
- Outcome: Skill-local units live in scoped `_atoms` and `_molecules` namespaces under their owning skill. Units with at least two named current or explicitly approved consumers live under the shared `_base` namespaces. Each unit has one same-named root, path determines level and ownership, local names are scoped, `includes` mirrors required links, `composes` names direct unit dependencies, and skill routing uses standard invocation metadata.
- Open questions: Complete and verify the repository-wide migration from flat `references/` packages to local atomic units without losing the union of current behavior.
- Evidence: c-0007 Q1; root `CONTEXT.md`; [ADR 0001](../../../adr/0001-use-local-units-and-promote-proven-shared-units.md); current validator groundwork; prior c-0004 and c-0005 evidence
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0003
- Tracker: Branch [#33 Formalize atom, molecule, and skill packaging, naming, and routing](https://github.com/jdylanmc/skills/issues/33)
- Divergence: Issue #33 remains open and describes the superseded `_base`-only model, globally shared names, and atoms without `includes`. c-0007 adds local ownership, explicit `composes`, invocation metadata, and the shared-unit threshold. Story #41 now tracks evaluated adoption beneath it.
- History: c-0001 node created; single-file form settled; fog unexplored -> scouted; maturity vague -> framed; priority -> P0 | c-0002 location, frontmatter schema, and routability settled; fog -> decision-ready; maturity -> decision-ready; debt cleared against n-0006 | c-0003 `Base package` deprecated; code placement settled; fog -> cleared -> promoted; maturity -> promotion-ready; published as Branch #33 | c-0004 `conflicts-with n-0001` recorded on contradicting evidence; fog promoted -> blocked; the user chose address-derived level and the conflict was removed; fog blocked -> investigating; maturity -> decision-ready; naming and flatness added as new fog | c-0005 naming convention decided under delegation on executed evidence; flatness retained with a revisit threshold; unit contract sections added; fog investigating -> researched -> decision-ready; maturity -> promotion-ready | c-0006 current main verified ten conforming units and shipped derivation; fog decision-ready -> cleared | post-c-0006 the user required same-named unit roots | c-0007 revised anchor invalidated `_base`-only placement; local/shared ownership, scoped names, `composes`, invocation metadata, and the shared threshold were settled; fog invalidated -> scouted

### n-0004 - Migration disposition for existing skills

- Parent: n-0000
- Fog: cleared
- Maturity: decision-ready
- Priority: P0
- Outcome: The endpoint remains total, but each reference behavior becomes a skill-local atom or molecule by default and moves to `_base` only on proven shared demand. `SKILL.md` remains the routable summary. Migration is incremental, value-first, and behavior-preserving through a requirement-union audit.
- Open questions: Complete the Discovery pilot, review it, then apply the pattern to every remaining skill.
- Evidence: the verified c-0004 inventory; c-0004 answers Q1-Q4; c-0005 first-migration measurement; commits #38-#40; c-0006 focused read-only research across all three roast packages; c-0006 Q1
- Links: refines n-0000
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: none
- Tracker: none. The concrete next delivery slice is n-0008.
- Divergence: none
- History: c-0001 node created; fog unexplored -> scouted; priority -> P1 | c-0003 reframed as classification-first after the 165-file survey; fog -> investigating; maturity vague -> framed | c-0004 endpoint settled as total migration, ordering settled as value-first, first target chosen, granularity deferred to measurement; fog investigating -> researched; maturity framed -> researched; priority P1 -> P0 | c-0005 first migration executed and the ratio measured at roughly 1.5 units per duplicated behavior, materially fewer than one unit per reference file; the c-0004 projection of roughly 900 atoms is contradicted by measurement; maturity researched -> decision-ready | c-0006 next value-first slice selected; fog decision-ready -> cleared; maturity decision-ready -> promotion-ready

### n-0005 - Verification and enforcement

- Parent: n-0000
- Fog: investigating
- Maturity: framed
- Priority: P1
- Outcome: Enforcement must validate shared and skill-local ownership, same-named roots, level schemas, normalized `includes`, explicit `composes`, downward-only and same-owner composition, cycles, support-file ownership, derived reverse links and molecule tools, skill invocation metadata, and deliberate permission grants. Collapse itself still requires a requirement-union audit.
- Open questions: Validate the new local-unit enforcement against a complete Discovery pilot, and decide whether the behavior-union audit can be automated.
- Evidence: `scripts/validate-skill-graph.mjs`; `scripts/derive-skill-graph.mjs`; `.github/workflows/validate-skills.yml`; `doctrine/manifest.md`; c-0001 answer Q6; c-0002 answers Q4, Q5; c-0003 answers Q1, Q4; commit #40
- Links: refines n-0000; depends-on n-0007
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0001 node created; enforcement confirmed mandatory; fog unexplored -> scouted; maturity vague -> framed; priority -> P1 | c-0002 three concrete checks specified; cycle detection added after molecule-in-molecule was confirmed; fog scouted -> investigating

### n-0006 - Chronicler reconciliation against the single-file rule

- Parent: n-0003
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Chronicler is a molecule that composes atomic chronicle operations, `append` among them. It is a base that is never used on its own; its purpose is to keep a running log of skill operations across a long-running session. The current package form is retired: atoms move to `_base/_atoms/`, the composing molecule to `_base/_molecules/chronicler/chronicler.md`, and scripts and tests are co-located by basename.
- Open questions: none as fog. The exact atom decomposition list is carried into the tracker item as explicitly unresolved metadata rather than invented acceptance criteria.
- Evidence: `skills/_base/chronicler/` contents; c-0003 survey showing no routable skill has a `scripts/` directory and Chronicler is the repository's only script-bearing package; `scripts/conformance.test.mjs` lines 298 and 385
- Links: refines n-0003
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0006
- Tracker: Task [#34 Decompose Chronicler into atoms plus a composing molecule](https://github.com/jdylanmc/skills/issues/34)
- Divergence: none
- History: c-0001 node created after Q4 made the only existing base package non-conforming | c-0002 `Base package` marked conflicted; debt row against n-0003 cleared | c-0003 resolved as a molecule composing atoms; `conflicts-with n-0001` reconciled and removed; fog -> cleared -> promoted; maturity -> promotion-ready; published as Task #34

### n-0007 - Collapse target inventory

- Parent: n-0004
- Fog: decision-ready
- Maturity: researched
- Priority: P1
- Outcome: The c-0004 inventory remains the verified baseline: 12 accepted clusters over 36 of 165 reference files. C5 and C7 were collapsed in the first migration, and #38 eliminated N1 by removing the vendored coordinators and standalone-install property. A c-0006 focused refresh found the next current cluster: roughly 75-105 repeated workflow lines across the three artifact-roast `SKILL.md` files, covering coordinate, validate, retry once, synthesize, and common status handling. `agent-resolve` partially covers old C1 but does not own roast-specific orchestration.
- Open questions: Re-run the full inventory under the local/shared ownership threshold, including the Superpowers recommendation ledger, before scheduling repository-wide extraction.
- Evidence: verified c-0004 inventory; c-0005 first migration; commits #38 and #40; c-0006 focused package research with exact caller-owned boundaries
- Links: refines n-0004; evidence-for n-0000; evidence-for n-0005
- First seen: c-0001
- Former node id: none
- Reinterpreted: c-0012 (intact)
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
- Reinterpreted: c-0012 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0006 node created from the selected value-first slice; fog -> cleared; maturity -> promotion-ready; priority -> P0

### n-0009 - Superpowers capability adoption

- Parent: n-0003
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Every recommendation derived from `obra/superpowers` receives an approved, rejected, or deferred disposition with rationale; approved units name local or shared placement and get one verified Task before implementation, while rejected recommendations remain recorded without dead work items.
- Open questions: Resolve each recommendation wave independently.
- Evidence: c-0007 five-lane fleet and synthesis; [#41 Evaluate and adopt reusable Superpowers capabilities](https://github.com/jdylanmc/skills/issues/41)
- Links: refines n-0004; parent n-0003
- First seen: c-0007
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0009
- Tracker: Story [#41 Evaluate and adopt reusable Superpowers capabilities](https://github.com/jdylanmc/skills/issues/41)
- Divergence: none
- History: c-0007 node created and promoted as a native Story beneath #33

### n-0010 - Wave 1 completion and isolation foundation

- Parent: n-0009
- Fog: promoted
- Maturity: promotion-ready
- Priority: P0
- Outcome: Decide and, when approved, establish the fresh-evidence gate, worktree-context detection, safe worktree creation, and their safe-isolation molecule with one authoritative owner per behavior.
- Open questions: none. A01, A02, A03, and M01 are approved.
- Evidence: c-0007 quality and orchestration fleet lanes
- Links: blocks n-0012; blocks n-0013
- First seen: c-0007
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0010
- Tracker: Story [#46 Establish completion evidence and safe worktree isolation](https://github.com/jdylanmc/skills/issues/46)
- Divergence: none
- History: c-0007 wave created from the highest-confidence shared recommendations | c-0010 all recommendations approved and Story #46 promoted

### n-0020 - Shared evidence gate

- Parent: n-0010
- Fog: promoted
- Maturity: promotion-ready
- Priority: P0
- Outcome: Establish A01 as a shared final evidence-to-claim atom layered over provider- and domain-specific verification.
- Open questions: none.
- Evidence: c-0010 Q1; [#47](https://github.com/jdylanmc/skills/issues/47)
- Links: blocks n-0021
- First seen: c-0010
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0020
- Tracker: Task [#47 Establish the shared evidence gate](https://github.com/jdylanmc/skills/issues/47)
- Divergence: none
- History: c-0010 approved and promoted

### n-0021 - Safe shared worktree isolation

- Parent: n-0010
- Fog: promoted
- Maturity: promotion-ready
- Priority: P0
- Outcome: Establish A02 and A03 plus M01 as the sole shared worktree-isolation authority wherever composed, with caller-supplied baseline evidence through A01.
- Open questions: none.
- Evidence: c-0010 Q2-Q4; [#48](https://github.com/jdylanmc/skills/issues/48)
- Links: depends-on n-0020
- First seen: c-0010
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0021
- Tracker: Task [#48 Establish safe shared worktree isolation](https://github.com/jdylanmc/skills/issues/48)
- Divergence: none
- History: c-0010 approved and promoted; natively blocked by #47

### n-0011 - Wave 2 implementation-plan quality

- Parent: n-0009
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared placeholder scanning, narrow task-interface contract rendering and validation, cross-task type consistency, and change-isolation evaluation, then coordinate them through a local-first `breakdown-to-tickets` plan-quality molecule.
- Open questions: none.
- Evidence: c-0007 planning fleet lane; c-0011 Q1-Q6; [#49](https://github.com/jdylanmc/skills/issues/49)
- Links: relates-to n-0015
- First seen: c-0007
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0011
- Tracker: Story [#49 Establish implementation-plan quality gates](https://github.com/jdylanmc/skills/issues/49)
- Divergence: none
- History: c-0007 wave created from plan-quality recommendations; c-0011 approved and promoted

### n-0022 - Shared plan-artifact validation

- Parent: n-0011
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared A06 `placeholder-scan`, narrowed A07 `interface-contract-document`, and A08 `type-consistency-check` atoms that report exact findings without inventing or rewriting plan content.
- Open questions: none.
- Evidence: Superpowers `writing-plans` source SHA `f74605bfa9af7a3fb7e4ad7f17750a86a9b0d728`; c-0011 Q1-Q4; [#50](https://github.com/jdylanmc/skills/issues/50)
- Links: blocks n-0024
- First seen: c-0011
- Former node id: none
- Reinterpreted: c-0011 (new)
- Promotion key: atomic-skill-composition/n-0022
- Tracker: Task [#50 Establish shared plan-artifact validation](https://github.com/jdylanmc/skills/issues/50)
- Divergence: none
- History: c-0011 approved and promoted

### n-0023 - Shared change-isolation evaluation

- Parent: n-0011
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared atom `change-isolation-evaluate` to report whether proposed change units have clear responsibilities, explicit boundaries, colocated files, and independently implementable, testable, and reviewable outcomes without redesigning them.
- Open questions: none.
- Evidence: Superpowers `writing-plans` source SHA `f74605bfa9af7a3fb7e4ad7f17750a86a9b0d728`; c-0011 Q5; [#51](https://github.com/jdylanmc/skills/issues/51)
- Links: blocks n-0024
- First seen: c-0011
- Former node id: none
- Reinterpreted: c-0011 (new)
- Promotion key: atomic-skill-composition/n-0023
- Tracker: Task [#51 Establish shared change-isolation evaluation](https://github.com/jdylanmc/skills/issues/51)
- Divergence: none
- History: c-0011 approved and promoted

### n-0024 - Local implementation-plan quality

- Parent: n-0011
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish local `breakdown-to-tickets` molecule `implementation-plan-quality` as the final readiness gate coordinating the four approved shared atoms without authoring or rewriting the plan.
- Open questions: none.
- Evidence: c-0011 Q6; [#52](https://github.com/jdylanmc/skills/issues/52)
- Links: depends-on n-0022; depends-on n-0023
- First seen: c-0011
- Former node id: none
- Reinterpreted: c-0011 (new)
- Promotion key: atomic-skill-composition/n-0024
- Tracker: Task [#52 Integrate local implementation-plan quality](https://github.com/jdylanmc/skills/issues/52)
- Divergence: none
- History: c-0011 approved and promoted; natively blocked by #50 and #51

### n-0012 - Wave 3 scoped review correction

- Parent: n-0009
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared exact review-package construction, finding-scoped re-review, bounded ruling records, and a caller-capped `scoped-review-correction-loop` that remains an inner convergence mechanism beneath the Roast outer gate.
- Open questions: none.
- Evidence: c-0007 orchestration and review/release fleet lanes; c-0012 Q1-Q4; [#53](https://github.com/jdylanmc/skills/issues/53)
- Links: depends-on n-0010
- First seen: c-0007
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0012
- Tracker: Story [#53 Establish scoped review correction](https://github.com/jdylanmc/skills/issues/53)
- Divergence: none
- History: c-0007 wave created from review-correction recommendations; c-0012 approved and promoted

### n-0025 - Shared exact review packages

- Parent: n-0012
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared atom `review-package-build` for caller-supplied requirements, exact revisions, commit range, changed-file summary, complete diff, and stable package identity without performing review or including conversation history.
- Open questions: none.
- Evidence: Superpowers review sources; c-0012 Q1; [#54](https://github.com/jdylanmc/skills/issues/54)
- Links: blocks n-0027
- First seen: c-0012
- Former node id: none
- Reinterpreted: c-0012 (new)
- Promotion key: atomic-skill-composition/n-0025
- Tracker: Task [#54 Establish shared exact review packages](https://github.com/jdylanmc/skills/issues/54)
- Divergence: none
- History: c-0012 approved and promoted

### n-0026 - Shared scoped re-review and ruling records

- Parent: n-0012
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared atoms `scoped-re-review` and `ruling-record` for bounded finding re-verification and durable coordinator dispositions without expanding scope or making decisions.
- Open questions: none.
- Evidence: Superpowers review sources; c-0012 Q2-Q3; [#55](https://github.com/jdylanmc/skills/issues/55)
- Links: blocks n-0027
- First seen: c-0012
- Former node id: none
- Reinterpreted: c-0012 (new)
- Promotion key: atomic-skill-composition/n-0026
- Tracker: Task [#55 Establish shared scoped re-review and ruling records](https://github.com/jdylanmc/skills/issues/55)
- Divergence: none
- History: c-0012 approved and promoted

### n-0027 - Shared scoped review correction loop

- Parent: n-0012
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared molecule `scoped-review-correction-loop` with caller-supplied participants, blocking severities, cap, and escalation policy, coordinating fixes and fresh evidence while excluding initial and final broad review, Roast synthesis, readiness, merge, and decision authority.
- Open questions: none.
- Evidence: Superpowers `subagent-driven-development`; c-0012 Q4; [#56](https://github.com/jdylanmc/skills/issues/56)
- Links: depends-on n-0020; depends-on n-0025; depends-on n-0026
- First seen: c-0012
- Former node id: none
- Reinterpreted: c-0012 (new)
- Promotion key: atomic-skill-composition/n-0027
- Tracker: Task [#56 Establish shared scoped review correction loop](https://github.com/jdylanmc/skills/issues/56)
- Divergence: none
- History: c-0012 approved and promoted; natively blocked by #47, #54, and #55

### n-0013 - Wave 4 systematic debugging

- Parent: n-0009
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared condition polling, post-root-cause defense analysis, configurable repeated-fix architecture escalation, and a routable `systematic-debugging` skill with explicit specialist-workflow exclusions.
- Open questions: none.
- Evidence: c-0007 quality fleet lane; c-0013 Q1-Q4; [#57](https://github.com/jdylanmc/skills/issues/57)
- Links: depends-on n-0010; shares-domain-with sessions/test-coverage-doctrine
- First seen: c-0007
- Former node id: none
- Reinterpreted: c-0013 (intact)
- Promotion key: atomic-skill-composition/n-0013
- Tracker: Story [#57 Establish systematic debugging](https://github.com/jdylanmc/skills/issues/57)
- Divergence: none
- History: c-0007 wave created for the largest complementary catalog gap; c-0013 approved and promoted

### n-0028 - Shared condition polling

- Parent: n-0013
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared `condition-poll` with caller-owned observation, predicate, deadline, and cadence.
- Open questions: none.
- Evidence: c-0013 Q1; [#58](https://github.com/jdylanmc/skills/issues/58)
- Links: blocks n-0030
- First seen: c-0013
- Former node id: none
- Reinterpreted: c-0013 (new)
- Promotion key: atomic-skill-composition/n-0028
- Tracker: Task [#58 Establish shared condition polling](https://github.com/jdylanmc/skills/issues/58)
- Divergence: none
- History: c-0013 approved and promoted

### n-0029 - Shared debugging defenses and escalation

- Parent: n-0013
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Establish shared post-root-cause `defense-layers` and configurable `architecture-escalation` atoms.
- Open questions: none.
- Evidence: c-0013 Q2-Q3; [#59](https://github.com/jdylanmc/skills/issues/59)
- Links: blocks n-0030
- First seen: c-0013
- Former node id: none
- Reinterpreted: c-0013 (new)
- Promotion key: atomic-skill-composition/n-0029
- Tracker: Task [#59 Establish shared debugging defenses and escalation](https://github.com/jdylanmc/skills/issues/59)
- Divergence: none
- History: c-0013 approved and promoted

### n-0030 - Routable systematic debugging

- Parent: n-0013
- Fog: promoted
- Maturity: promotion-ready
- Priority: P1
- Outcome: Create model-discoverable, user-invocable `systematic-debugging` from evidence collection through root-cause verification and recurrence defense.
- Open questions: none.
- Evidence: c-0013 Q4; [#60](https://github.com/jdylanmc/skills/issues/60)
- Links: depends-on n-0020; depends-on n-0028; depends-on n-0029
- First seen: c-0013
- Former node id: none
- Reinterpreted: c-0013 (new)
- Promotion key: atomic-skill-composition/n-0030
- Tracker: Task [#60 Create the systematic-debugging skill](https://github.com/jdylanmc/skills/issues/60)
- Divergence: none
- History: c-0013 approved and promoted; blocked by #47, #58, and #59

### n-0014 - Wave 5 skill pressure testing

- Parent: n-0009
- Fog: researched
- Maturity: researched
- Priority: P1
- Outcome: Decide and, when approved, establish rationalization guarding, failure-to-guidance-form matching, wording micro-tests, and a pressure-test molecule integrated with Skill Coach and reinforcement.
- Open questions: Approve, revise, reject, or defer A12, A13, A14, M04, N01, and N02; choose rationalization-table versus existing safeguard style.
- Evidence: c-0007 meta-skill fleet lane
- Links: refines n-0005
- First seen: c-0007
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0007 wave created from skill-authoring recommendations

### n-0015 - Deferred Superpowers decisions

- Parent: n-0009
- Fog: researched
- Maturity: researched
- Priority: P2
- Outcome: Decide whether to adopt optional TDD step sequencing, a human-only plan-based subagent-development skill, testing-doctrine enrichment, and a separately approved visual-companion feasibility prototype.
- Open questions: Resolve A16, S02, N03, and N04 after higher-priority waves; decide whether each adds value beyond current doctrine and orchestration.
- Evidence: c-0007 planning, orchestration, quality, and meta-skill fleet lanes
- Links: relates-to n-0011; shares-domain-with sessions/test-coverage-doctrine
- First seen: c-0007
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: none
- Tracker: none
- Divergence: none
- History: c-0007 lower-confidence and higher-cost recommendations deferred into one wave

### n-0016 - Repository handoff capability

- Parent: n-0004
- Fog: promoted
- Maturity: promotion-ready
- Priority: P0
- Outcome: This repository provides a predictable, bounded handoff capability that writes redacted, artifact-referencing continuation documents under the operating system temporary directory for humans and orchestration callers, and Ship with Squadron no longer depends on an external handoff package.
- Open questions: none. The human wrapper and Squadron adapter compose one shared bounded-handoff molecule.
- Evidence: c-0008 answers; xgang-harness Handoff; [Matt Pocock Handoff](https://github.com/mattpocock/skills/blob/main/skills/productivity/handoff/SKILL.md); Ship with Squadron handoff contracts
- Links: refines n-0004; blocks ship-with-squadron external dependency removal
- First seen: c-0008
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0016
- Tracker: Story [#42 Add bounded handoff creation and orchestration support](https://github.com/jdylanmc/skills/issues/42)
- Divergence: none
- History: c-0008 capability requested, output schema and temp path settled; late orchestration-caller clarification deferred to c-0009 | c-0009 shared core with caller adapters settled; node promoted as Story #42

### n-0017 - Shared bounded-handoff core

- Parent: n-0016
- Fog: promoted
- Maturity: promotion-ready
- Priority: P0
- Outcome: Shared atoms and a `persist-bounded-handoff` molecule own artifact references, redaction, stable rendering, OS-temp path selection, safe writing, and reread verification for both Handoff and Squadron.
- Open questions: none.
- Evidence: c-0008 and c-0009 answers; source skills; [#43](https://github.com/jdylanmc/skills/issues/43)
- Links: blocks n-0018; blocks n-0019
- First seen: c-0009
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0017
- Tracker: Task [#43 Establish the shared bounded-handoff core](https://github.com/jdylanmc/skills/issues/43)
- Divergence: none
- History: c-0009 task created, parented to #42, and verified

### n-0018 - Human-facing Handoff skill

- Parent: n-0016
- Fog: promoted
- Maturity: promotion-ready
- Priority: P0
- Outcome: A thin, explicitly invoked `handoff` skill gathers confirmed conversation and focus context, then composes the shared bounded-handoff core without asking for a filename or destination.
- Open questions: none.
- Evidence: c-0008 and c-0009 answers; [#44](https://github.com/jdylanmc/skills/issues/44)
- Links: depends-on n-0017
- First seen: c-0009
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0018
- Tracker: Task [#44 Create the human-facing Handoff skill](https://github.com/jdylanmc/skills/issues/44)
- Divergence: none
- History: c-0009 task created, parented to #42, and blocked by #43

### n-0019 - Squadron bounded-handoff integration

- Parent: n-0016
- Fog: promoted
- Maturity: promotion-ready
- Priority: P0
- Outcome: Ship with Squadron supplies timeout and control-state context through a local adapter, composes the shared bounded-handoff molecule directly, records the returned path, and removes its external Handoff dependency.
- Open questions: none.
- Evidence: Ship with Squadron contracts; c-0009 answers; [#45](https://github.com/jdylanmc/skills/issues/45)
- Links: depends-on n-0017
- First seen: c-0009
- Former node id: none
- Reinterpreted: c-0012 (intact)
- Promotion key: atomic-skill-composition/n-0019
- Tracker: Task [#45 Integrate bounded handoffs into Ship with Squadron](https://github.com/jdylanmc/skills/issues/45)
- Divergence: none
- History: c-0009 task created, parented to #42, and blocked by #43

## Active Frontier

| Node | Fog | Maturity | Priority | Blocked by | Open questions |
| --- | --- | --- | --- | --- | --- |
| n-0001 | investigating | decision-ready | P0 | none | none of its own; re-earning `cleared` through the ordered states |
| n-0002 | researched | researched | P1 | none | none material |
| n-0003 | scouted | promotion-ready | P0 | none | Complete and verify the local-unit migration |
| n-0005 | investigating | framed | P1 | none | Validate local-unit enforcement and decide whether the union audit can be automated |
| n-0007 | decision-ready | researched | P1 | none | Refresh the full inventory under local/shared ownership |
| n-0014 | researched | researched | P1 | none | Decide A12, A13, A14, M04, N01, and N02 |
| n-0015 | researched | researched | P2 | none | Decide A16, S02, N03, and N04 |

n-0000, n-0004, and n-0008 are at fog `cleared`; n-0006 and n-0009 are at
fog `promoted`; none appears.

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
| n-0009 | Story | atomic-skill-composition/n-0009 | [#41](https://github.com/jdylanmc/skills/issues/41) | c-0007 | none |
| n-0016 | Story | atomic-skill-composition/n-0016 | [#42](https://github.com/jdylanmc/skills/issues/42) | c-0009 | none |
| n-0017 | Task | atomic-skill-composition/n-0017 | [#43](https://github.com/jdylanmc/skills/issues/43) | c-0009 | none |
| n-0018 | Task | atomic-skill-composition/n-0018 | [#44](https://github.com/jdylanmc/skills/issues/44) | c-0009 | blocked by #43 |
| n-0019 | Task | atomic-skill-composition/n-0019 | [#45](https://github.com/jdylanmc/skills/issues/45) | c-0009 | blocked by #43 |
| n-0010 | Story | atomic-skill-composition/n-0010 | [#46](https://github.com/jdylanmc/skills/issues/46) | c-0010 | none |
| n-0020 | Task | atomic-skill-composition/n-0020 | [#47](https://github.com/jdylanmc/skills/issues/47) | c-0010 | none |
| n-0011 | Story | atomic-skill-composition/n-0011 | [#49](https://github.com/jdylanmc/skills/issues/49) | c-0011 | none |
| n-0021 | Task | atomic-skill-composition/n-0021 | [#48](https://github.com/jdylanmc/skills/issues/48) | c-0010 | blocked by #47 |
| n-0022 | Task | atomic-skill-composition/n-0022 | [#50](https://github.com/jdylanmc/skills/issues/50) | c-0011 | none |
| n-0023 | Task | atomic-skill-composition/n-0023 | [#51](https://github.com/jdylanmc/skills/issues/51) | c-0011 | none |
| n-0024 | Task | atomic-skill-composition/n-0024 | [#52](https://github.com/jdylanmc/skills/issues/52) | c-0011 | blocked by #50 and #51 |
| n-0012 | Story | atomic-skill-composition/n-0012 | [#53](https://github.com/jdylanmc/skills/issues/53) | c-0012 | none |
| n-0025 | Task | atomic-skill-composition/n-0025 | [#54](https://github.com/jdylanmc/skills/issues/54) | c-0012 | none |
| n-0026 | Task | atomic-skill-composition/n-0026 | [#55](https://github.com/jdylanmc/skills/issues/55) | c-0012 | none |
| n-0027 | Task | atomic-skill-composition/n-0027 | [#56](https://github.com/jdylanmc/skills/issues/56) | c-0012 | blocked by #47, #54, and #55 |
| n-0013 | Story | atomic-skill-composition/n-0013 | [#57](https://github.com/jdylanmc/skills/issues/57) | c-0013 | none |
| n-0028 | Task | atomic-skill-composition/n-0028 | [#58](https://github.com/jdylanmc/skills/issues/58) | c-0013 | none |
| n-0029 | Task | atomic-skill-composition/n-0029 | [#59](https://github.com/jdylanmc/skills/issues/59) | c-0013 | none |
| n-0030 | Task | atomic-skill-composition/n-0030 | [#60](https://github.com/jdylanmc/skills/issues/60) | c-0013 | blocked by #47, #58, and #59 |
