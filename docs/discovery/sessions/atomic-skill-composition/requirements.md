# Requirements - Atomic Skill Composition

## Confirmed Requirements

Each entry links to the node and cycle that produced it.

| Requirement | Node | Cycle |
| --- | --- | --- |
| The composition model serves reuse, de-duplication, composability, testability, and best-practice enforcement. It exists to put structure and order on a loose concept. | n-0000 | c-0001 |
| There are exactly three composition levels: atom, molecule, skill. | n-0001 | c-0001 |
| An atom is any single operation, including a thin wrapper over an existing tool. The bottom layer is uniform, with no judgment call at the boundary. | n-0001 | c-0001 |
| "Single operation" is judged from the caller's point of view; internal steps never split an atom. | n-0001 | c-0001 |
| An atom references no other unit of composition. | n-0001 | c-0001 |
| An atom is a single Markdown file whose frontmatter is consistent across all atoms. It is a logical unit, not a package directory. | n-0003 | c-0001 |
| A molecule is a single Markdown file that composes atoms by reference. | n-0003 | c-0001 |
| The top level is named `skill` and keeps its existing `skills/<name>/SKILL.md` form. `recipe` is its mental model, never a structural level. | n-0001 | c-0001 |
| Adoption is proven by collapse: behavior currently duplicated across skills exists exactly once as an atom or molecule, and every former copy is replaced by a reference. | n-0000 | c-0001 |
| Enforcement is automated and mandatory. The check must prove collapse, not merely that a level was declared. | n-0005 | c-0001 |
| A molecule may compose atoms or other molecules. | n-0001 | c-0002 |
| Atom files live at `skills/_base/_atoms/<name>/<name>.md`; molecule files at `skills/_base/_molecules/<name>/<name>.md`. The level is derivable from the path, and each unit's support files are isolated in its same-named root. | n-0003 | post-c-0006 user directive |
| Atoms and molecules are non-routable, inherited from the existing `_base` exclusion in `validate-skill-graph.mjs`. No new routing mechanism is introduced. | n-0003 | c-0002 |
| Molecule frontmatter: `name`, `description`, `level`, `includes` authored; `allowed-tools` and `used-by` generated. `requires-skills` is forbidden. | n-0003 | c-0002 |
| The `level` frontmatter value and the file's path must agree; disagreement fails the build. | n-0003 | c-0002 |
| Derived fields are generated and committed, never hand-authored: `validate-skill-graph.mjs` gains a write-back mode and continuous integration verifies the result. This follows the existing `doctrine/manifest.md` pattern. | n-0005 | c-0002 |
| A molecule's `allowed-tools` is the transitive union of the tools of everything it composes. | n-0005 | c-0002 |
| The validator must detect cycles in the composition graph, which became possible once a molecule may compose another molecule. | n-0005 | c-0002 |
| `AGENTS.md` must be amended: it currently states every `_base` child is a `<base-name>/BASE.md` package, which the level namespaces break. | n-0003 | c-0002 |
| The skill level carries no obligation beyond composing rather than restating. Composition is already universal: all 21 skills use `## Required References`, across 165 reference files. | n-0001 | c-0003 |
| Every reference file carries a level, wherever it lives. Level is a property of the unit, not of its address, so relocating a unit is never a reclassification. | n-0001 | c-0003 |
| Chronicler is a molecule composing atomic chronicle operations, not a package. `skills/_base/chronicler/` is retired. | n-0006 | c-0003 |
| Deterministic scripts and their tests are co-located by basename with the unit they implement inside its same-named root: `<unit>/<unit>.md`, `<unit>/<unit>.mjs`, `<unit>/<unit>.test.mjs`. | n-0003 | post-c-0006 user directive |
| Unit names follow `<domain>-<verb>[-<object>].md`: kebab-case, lowercase, globally unique, no numeric prefix, and no level suffix. The unit-root migration does not rename them. | n-0003 | c-0005; post-c-0006 user directive |
| A `## Required References` section contains its list and nothing else, and sits immediately before the next `##` heading. The validator's section scan runs to the next heading or to end of file, so prose links inside the section are captured. Prose elsewhere names a unit rather than linking it. | n-0005 | c-0005 |
| A unit declares `## Inputs`, `## Output`, `## Guarantees`, and `## Boundaries`. Without a declared contract a caller must read the whole file to compose it, which makes the library a pile of documents rather than an API. | n-0003 | c-0005 |
| Collapse takes the **union** of the requirements of every copy, then decides per requirement whether it belongs to the unit or to the caller. Collapsing to the most common wording silently drops the strictest copy. | n-0005 | c-0005 |
| Every adversarial review of this work is given an explicit mandate to execute rather than read, and must attach a reproducing command and its output to each finding. | n-0005 | c-0005 |
| A `.mjs` file inside a level namespace must have a matching `.md` of the same basename. | n-0005 | c-0003 |
| Zero-consumer units are reported, never failed. A reusable library unit owes no caller. | n-0005 | c-0003 |
| Collapse is measured against the named inventory of behaviors that were actually duplicated, not across the whole unit population. | n-0007 | c-0003 |
| A unit exists **only** inside a level namespace. A Markdown file outside one is not a unit, carries no level, and is not part of the composition graph. Address is the sole authority for level. | n-0003 | c-0004 |
| Every reference file is in scope for eventual conversion into a unit under `skills/_base/`. The endpoint is total migration; execution is incremental and ordered by value, not by simplicity. | n-0004 | c-0004 |
| `SKILL.md` is a thin wrapper. The contract carries no substance of its own; substance lives in the units it composes. | n-0001 | c-0004 |
| A referenced unit is incorporated at runtime by the consuming unit's prose instructing the agent to read it by relative link. `includes` participates in validation, never in loading. Runtime places no constraint on where a unit lives. | n-0002 | c-0004 |
| Per-file granularity is an empirical parameter, not a declared rule. It is measured by decomposing one high-value skill and observing the ratio. | n-0004 | c-0004 |
| The first migration target is `roast-this-prompt`. Its siblings `roast-this-agent` and `roast-this-skill` are necessarily in scope, because shared units cannot be extracted from one without changing all three. | n-0004 | c-0004 |
| An atom declares `includes: []` because it references no other composition unit. `allowed-tools` is authored and `used-by` is generated. | n-0003 | c-0006 |
| The next value-first migration slice is one `roast-coordinate-review` molecule consumed by `roast-this-agent`, `roast-this-prompt`, and `roast-this-skill` in the same pull request. | n-0008 | c-0006 |
| `roast-coordinate-review` owns coordinate, unchanged-envelope validation, exactly one validation retry with a fresh coordinator, `Unsynthesized` after the second failure, synthesize, and common named-status handling. | n-0008 | c-0006 |
| Artifact identity and locator, artifact-specific contracts and inputs, prompt stale-evidence rehashing, artifact-specific prohibitions, output-schema details, and package-specific recovery remain caller-owned. | n-0008 | c-0006 |
| The n-0008 pull request must audit the union of all three pre-migration workflows, contracts, trusted-source rules, and failure/recovery documents against the molecule plus each caller before merge. | n-0008 | c-0006 |
| Issue #35 behavior is excluded from n-0008. Panel scheduling, re-review, and hypothetical-finding triage add behavior rather than collapse current duplication. | n-0008 | c-0006 |
| The repository remains primarily a skills library; composition work must not broaden it into a general-purpose agent framework. | n-0000 | c-0006 |
| Skill-local atoms live at `skills/<skill>/_atoms/<name>/<name>.md`; skill-local molecules live at `skills/<skill>/_molecules/<name>/<name>.md`. Local unit names are scoped to their owning skill. | n-0003 | c-0007 |
| `_base` is reserved for shared units. A unit qualifies as shared only when at least two named consumers are current skills or explicitly approved skill designs. | n-0003 | c-0007 |
| Every unit and atomic skill declares `composes`, which exactly names the direct atom or molecule subset of `includes`. `includes` remains the complete required-link mirror. | n-0003, n-0005 | c-0007 |
| Every atomic skill declares standard `disable-model-invocation` and `user-invocable` metadata. Long-running skills such as Discovery Loop are human-only; ordinary bounded skills such as Discovery remain model-discoverable. | n-0003 | c-0007 |
| `SKILL.md` retains enough routing summary for a router to choose it; detailed behavior lives in local or shared atoms and molecules. | n-0001, n-0004 | c-0007 |
| The Superpowers adoption work is one Story under packaging Branch #33. Recommendation Tasks are created only after the user approves the individual recommendation or a tightly coupled bundle. | n-0009 | c-0007 |
| Every proposed imported unit receives a shared-versus-local recommendation using the two-consumer threshold, and every recommendation is approved, rejected, or deferred before establishment. | n-0009 | c-0007 |
| Adapted `obra/superpowers` material preserves the MIT copyright and permission notice. | n-0009 | c-0007 |
| Handoff writes beneath exactly one child of the runtime-reported OS temporary directory: `<os-temp>/handoffs/<repository-or-work-slug>-<UTC timestamp>.md`. It never asks where to save or writes into the current workspace. | n-0016 | c-0008 |
| Handoff preserves the pickup-compatible heading order `Goal`, `Current Progress`, `What Worked`, `What Didn't Work`, `Next Steps`, and adds `Decisions and Constraints` plus `Artifacts and References`; `Suggested Skills` is optional. | n-0016 | c-0008 |
| Handoff references existing specifications, plans, Architecture Decision Records, issues, commits, and diffs instead of duplicating their content. | n-0016 | c-0008 |
| Handoff redacts secrets, credentials, and personally identifiable information, and treats arguments as the next session's focus. | n-0016 | c-0008 |
| When `Suggested Skills` is present, it names exact skill IDs and why the next agent should invoke them; it never invents a skill. | n-0016 | c-0008 |
| Agents and orchestrators must be able to invoke or compose the handoff capability explicitly. The exact routing surface is unresolved and blocks promotion. | n-0016 | c-0008 |
| Handoff and Ship with Squadron compose one shared `persist-bounded-handoff` molecule; each keeps a local adapter for its caller-specific context. | n-0016 | c-0009 |
| The shared bounded-handoff core owns artifact referencing, redaction, stable rendering, optional suggested skills, OS-temp path resolution, safe writing, and reread verification. | n-0017 | c-0009 |
| The human-facing Handoff skill is explicitly invoked, remains user-invocable, and gathers conversation plus optional next-session focus before calling the shared core. | n-0018 | c-0009 |
| Ship with Squadron supplies timeout/control-state context through its own local adapter, composes the shared core directly, and removes its external Handoff dependency only after integration tests pass. | n-0019 | c-0009 |
| A01 `evidence-gate` is a shared final evidence-to-claim gate layered over, never replacing, provider- and domain-specific verification. | n-0020 | c-0010 |
| A02 `worktree-context-detect` is a shared atom that reports checkout, worktree, detached-head, submodule, common-root, branch, and isolation-ownership state. | n-0021 | c-0010 |
| A03 `worktree-create-safe` is the shared sole-creator atom: it proves target safety, refuses dirty/shared targets, never force-removes, and returns ownership evidence. | n-0021 | c-0010 |
| M01 `safe-worktree-isolation` is the sole worktree-isolation authority wherever composed and combines A02/A03 with caller-supplied baseline evidence through A01. | n-0021 | c-0010 |
| A06 `placeholder-scan` is a shared atom that accepts a caller-declared forbidden-pattern set, reports exact unresolved placeholders and vague stand-ins, and never rewrites the artifact. | n-0022 | c-0011 |
| A07 `interface-contract-document` is a narrow shared atom that validates and renders one task's exact `Consumes` and `Produces` contract from caller-supplied evidence; it does not design interfaces, split tasks, or invent names or types. | n-0022 | c-0011 |
| A08 `type-consistency-check` is a separate shared whole-plan atom that compares producer and consumer names, signatures, parameter and return types, property names, and schema identifiers, reporting mismatches with both locations and making no edits. | n-0022 | c-0011 |
| A15 is adopted under the narrowed name `change-isolation-evaluate`: a shared atom that reports whether proposed change units have clear responsibilities, explicit boundaries, colocated files, and independently implementable, testable, and reviewable outcomes without redesigning them. | n-0023 | c-0011 |
| M03 `implementation-plan-quality` is local to `breakdown-to-tickets` until a second current or explicitly approved consumer adopts the complete four-atom gate; it coordinates the atoms as a final readiness gate without authoring or rewriting the plan. | n-0024 | c-0011 |
| A04 `review-package-build` is a shared atom that packages caller-supplied requirements, exact base/head revisions, commit range, changed-file summary, and complete diff into one bounded immutable reviewer input with a stable digest; it performs no review and includes no conversation history. | n-0025 | c-0012 |
| A05 `scoped-re-review` is a shared atom that verdicts named prior findings against an exact fix range, admits only new caller-defined blocking breakage from that range, separates out-of-scope observations, and leaves severity and reviewer choice to the caller. | n-0026 | c-0012 |
| A17 `ruling-record` is a shared atom that records one caller-owned disposition with the disputed finding, evidence, rationale, cost if wrong, downstream impact, and revisit trigger; it neither makes the decision nor authorizes mutation. | n-0026 | c-0012 |
| M02 is adopted under the name `scoped-review-correction-loop`: a shared molecule with caller-supplied participants, blocking severities, time or round cap, and escalation policy. It composes A01, A04, A05, and A17 but excludes initial and final broad review, Roast synthesis, pull-request readiness, merge, and caller decision authority. | n-0027 | c-0012 |
| A09 `condition-poll` is a shared provider-neutral bounded polling atom with caller-owned observation, predicate, deadline, and cadence. | n-0028 | c-0013 |
| A10 `defense-layers` is a shared recurrence-defense evaluator that may run only after root cause is confirmed and never implements fixes. | n-0029 | c-0013 |
| A11 `architecture-escalation` is a shared configurable repeated-fix breaker, defaulting to three attempts, that emits evidence and a human decision packet rather than authorizing another fix. | n-0029 | c-0013 |
| S01 `systematic-debugging` is model-discoverable and user-invocable, composes A01/A09/A10/A11 plus local debugging units, and excludes domain triage, incident response, code/security review, and planning. | n-0030 | c-0013 |

## Revoked Requirements

A revoked requirement was confirmed by an earlier cycle and later withdrawn. It
is recorded rather than deleted so the reasoning survives.

| Requirement | Node | Confirmed | Revoked | Reason |
| --- | --- | --- | --- | --- |
| Atom files live directly at `skills/_base/_atoms/<name>.md`; molecule files live directly at `skills/_base/_molecules/<name>.md`. | n-0003 | c-0002 | post-c-0006 user directive | The user required every atom and molecule to have an encompassing same-named root so all multi-file structures are isolated. |
| A level namespace stays flat. The domain prefix supplies grouping at no cost to addressing. Revisit when one domain prefix exceeds roughly twenty units. | n-0003 | c-0005 | post-c-0006 user directive | The user explicitly superseded flatness with one same-named root per unit and requested no renaming. |
| Atom files live at `skills/_base/_atoms/<name>/<name>.md`; molecule files live at `skills/_base/_molecules/<name>/<name>.md`. | n-0003 | post-c-0006 user directive | c-0007 | The user chose skill-local units by default and `_base` only for units with at least two current or explicitly approved consumers. |
| Unit names are globally unique across the repository. | n-0003 | c-0005 | c-0007 | Skill-local unit names are scoped to their owning skill; shared `_base` names remain repository-wide. |
| Atoms and molecules are non-routable solely because they inherit the `_base` exclusion. | n-0003 | c-0002 | c-0007 | Local units also live beneath routable skill packages. They remain non-routable because only the package's `SKILL.md` is an entry point. |
| Every reference file eventually becomes a unit under `skills/_base/`. | n-0004 | c-0004 | c-0007 | Total migration remains required, but skill-specific behavior becomes a local unit and only proven reuse is promoted to `_base`. |
| Every reference file carries a level, wherever it lives. Level is a property of the unit, not of its address, so relocating a unit is never a reclassification. | n-0001 | c-0003 | c-0004 | Contradicted the c-0002 requirement that the `level` value and the file's path must agree, which `scripts/validate-skill-graph.mjs` had already implemented. c-0003 recorded it without comparing it against that requirement. The user resolved the conflict in favor of address-derived level in c-0004 Q1, choosing human readability. The shipped merge gate was correct; the written record was wrong. |
| Atom frontmatter: `name`, `description`, `level`, `allowed-tools` authored; `used-by` generated. `includes` and `requires-skills` are forbidden, and their absence is the enforcement of "an atom references no other unit". | n-0003 | c-0002 | c-0006 | The adopted schema requires the explicit empty mirror `includes: []`, as documented in `AGENTS.md` and enforced across the seven current atoms. |

## Constraints

Carried from repository evidence.

| Constraint | Source | Node | Cycle |
| --- | --- | --- | --- |
| Canonical formats are Markdown; generated JSON manifests may not replace canonical Markdown files. | `AGENTS.md` Canonical Formats | n-0003 | c-0001 |
| A `_base` package never contains `SKILL.md` and is never routed to, listed as a skill, or invoked directly. | `AGENTS.md` Canonical Formats | n-0003 | c-0001 |
| `includes` frontmatter is a dependency-graph mirror, not a directive to load every listed file into model context. This survives because context economy was excluded as an objective. | `AGENTS.md` Canonical Formats; c-0001 answer Q1 | n-0002 | c-0001 |
| `scripts/validate-skill-graph.mjs` gates merges over the `includes` dependency mirror, on a three-platform CI matrix. | `AGENTS.md`; `.github/workflows/validate-skills.yml` | n-0005 | c-0001 |

## Exclusions

| Exclusion | Reason | Node | Cycle |
| --- | --- | --- | --- |
| Hand-authored reverse links (`used-by`) are excluded. | Derived data is generated. Hand-authoring costs fan-in churn and turns parallel merges into build failures on popular atoms. | n-0003 | c-0002 |
| Requiring every atom and molecule to have at least one consumer is excluded. | Proposed by the loop and rejected. It conflates an atom extracted from duplication, where zero consumers is a defect, with a reusable primitive, where zero consumers is normal. This is a library. | n-0005 | c-0003 |
| A fourth construct for Chronicler is excluded. | Chronicler is a molecule. No new level or packaging form is introduced for it. | n-0006 | c-0003 |
| A separate top-level `skills/_atoms/` or `skills/_units/` namespace is excluded. | Level namespaces live under `_base`, which already carries the non-routable exclusion. | n-0003 | c-0002 |
| Context economy is not an objective of this model. | Explicitly excluded in c-0001 answer Q1. Keeping it out preserves the `AGENTS.md` rule that `includes` is a mirror rather than a loading directive. | n-0000 | c-0001 |
| Declaration-only enforcement is not sufficient. | It can be fully green with zero de-duplication achieved, which is the main objective. | n-0005 | c-0001 |
| A four-level scheme of atom, molecule, ingredient, recipe is out of scope. | The cooking metaphor places ingredient at the primitive position, so a third-level ingredient inverts it; and `recipe` would rename a unit already called a skill. | n-0001 | c-0001 |
| Renaming atoms or molecules to cooking-metaphor terms is out of scope. | Rejected with the four-level scheme in c-0001 answer Q5. | n-0001 | c-0001 |

## Unresolved Requirements

| Unresolved requirement | Node | Cycle |
| --- | --- | --- |
| Whether the roast trio still needs to install standalone. RESOLVED before c-0006 by #38: the standalone-install property and three vendored coordinators were removed. | n-0007 | c-0005 |
| Whether the union audit that catches collapse regressions can be automated, or whether it stays a human diff review before merge. Five of seven regressions in the first migration were union losses. | n-0005 | c-0005 |
| Whether the three vendored copies of `artifact-roastmaster.agent.md` may be collapsed. RESOLVED before c-0006 by #38: all three copies were deleted when standalone installation was dropped. | n-0007 | c-0004 |
| The naming convention for a global flat namespace. RESOLVED in c-0005. | n-0003 | c-0004 |
| Whether a level namespace stays flat at scale. RESOLVED in c-0005, then superseded after c-0006 by the direct requirement for one same-named isolation root per unit. | n-0003 | c-0004 |
| The true atoms-per-file ratio, and therefore the endpoint unit count. RESOLVED in c-0005 by measurement: roughly 1.5 units per duplicated behavior, and materially fewer than one unit per reference file. | n-0004 | c-0004 |
| Whether classification proceeds across all 21 skills at once or incrementally, and whether a skill may remain unclassified. PARTIALLY RESOLVED in c-0004: incrementally, value-first, and no skill remains unclassified because the endpoint is total. | n-0004 | c-0003 |
| Which of the 165 reference files are genuinely duplicated rather than merely similar. RESOLVED in c-0004 by the verified inventory: 36 files in 12 clusters, 26 in rejected near-misses, 103 genuinely skill-specific. | n-0007 | c-0003 |
| The exact atom decomposition of Chronicler. `append` is confirmed; the rest is inferred and must be confirmed during implementation. | n-0006 | c-0003 |
| What automated check can prove collapse itself, as opposed to declaration, direction, derivation, and cycles. | n-0005 | c-0002 |
| The testable boundary for the skill level. | n-0001 | c-0002 |
| How a referenced unit's instruction text is actually incorporated at runtime, given that `includes` is a mirror rather than a loading directive. RESOLVED in c-0004: by prose instruction plus relative link, verified empirically. | n-0002 | c-0002 |
| Whether a molecule may reference another molecule, or only atoms. RESOLVED in c-0002: it may reference either. | n-0001 | c-0001 |
| Where atom and molecule files live on disk, and what their uniform frontmatter schema is. RESOLVED in c-0002. | n-0003 | c-0001 |
| Whether atoms are invisible to routing, as base packages are today. RESOLVED in c-0002: yes, inherited from the `_base` exclusion. | n-0003 | c-0001 |
| The mechanism by which a consuming unit consumes a referenced one. PARTIALLY RESOLVED in c-0002: `includes`, not `requires-skills`. | n-0002 | c-0001 |
| What automated check can prove collapse rather than declaration. | n-0005 | c-0001 |
| The disposition of `skills/_base/chronicler/`, which conforms to neither the atom nor the molecule form rule. | n-0006 | c-0001 |
| Which behaviors are actually duplicated across the existing skills, without which the collapse test is unmeasurable. | n-0007 | c-0001 |
| Whether all existing skills migrate, and on what schedule. | n-0004 | c-0001 |
| Which value-first slice follows n-0008. Re-run the complete current inventory after n-0008 rather than fixing a speculative long-range order now. | n-0004 | c-0006 |
| Reconstruct the complete current duplication inventory: the c-0004 checkpoint preserved counts but not the full definitions of all twelve clusters. | n-0007 | c-0006 |
