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
| Atom files live at `skills/_base/_atoms/<name>.md`; molecule files at `skills/_base/_molecules/<name>.md`. The level is derivable from the path. | n-0003 | c-0002 |
| Atoms and molecules are non-routable, inherited from the existing `_base` exclusion in `validate-skill-graph.mjs`. No new routing mechanism is introduced. | n-0003 | c-0002 |
| Atom frontmatter: `name`, `description`, `level`, `allowed-tools` authored; `used-by` generated. `includes` and `requires-skills` are forbidden, and their absence is the enforcement of "an atom references no other unit". | n-0003 | c-0002 |
| Molecule frontmatter: `name`, `description`, `level`, `includes` authored; `allowed-tools` and `used-by` generated. `requires-skills` is forbidden. | n-0003 | c-0002 |
| The `level` frontmatter value and the file's path must agree; disagreement fails the build. | n-0003 | c-0002 |
| Derived fields are generated and committed, never hand-authored: `validate-skill-graph.mjs` gains a write-back mode and continuous integration verifies the result. This follows the existing `doctrine/manifest.md` pattern. | n-0005 | c-0002 |
| A molecule's `allowed-tools` is the transitive union of the tools of everything it composes. | n-0005 | c-0002 |
| The validator must detect cycles in the composition graph, which became possible once a molecule may compose another molecule. | n-0005 | c-0002 |
| `AGENTS.md` must be amended: it currently states every `_base` child is a `<base-name>/BASE.md` package, which the level namespaces break. | n-0003 | c-0002 |
| The skill level carries no obligation beyond composing rather than restating. Composition is already universal: all 21 skills use `## Required References`, across 165 reference files. | n-0001 | c-0003 |
| Every reference file carries a level, wherever it lives. Level is a property of the unit, not of its address, so relocating a unit is never a reclassification. | n-0001 | c-0003 |
| Chronicler is a molecule composing atomic chronicle operations, not a package. `skills/_base/chronicler/` is retired. | n-0006 | c-0003 |
| Deterministic scripts and their tests are co-located by basename with the unit they implement: `<unit>.md`, `<unit>.mjs`, `<unit>.test.mjs`. | n-0003 | c-0003 |
| A `.mjs` file inside a level namespace must have a matching `.md` of the same basename. | n-0005 | c-0003 |
| Zero-consumer units are reported, never failed. A reusable library unit owes no caller. | n-0005 | c-0003 |
| Collapse is measured against the named inventory of behaviors that were actually duplicated, not across the whole unit population. | n-0007 | c-0003 |

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
| Whether classification proceeds across all 21 skills at once or incrementally, and whether a skill may remain unclassified. | n-0004 | c-0003 |
| Which of the 165 reference files are genuinely duplicated rather than merely similar. | n-0007 | c-0003 |
| The exact atom decomposition of Chronicler. `append` is confirmed; the rest is inferred and must be confirmed during implementation. | n-0006 | c-0003 |
| What automated check can prove collapse itself, as opposed to declaration, direction, derivation, and cycles. | n-0005 | c-0002 |
| The testable boundary for the skill level. | n-0001 | c-0002 |
| How a referenced unit's instruction text is actually incorporated at runtime, given that `includes` is a mirror rather than a loading directive. | n-0002 | c-0002 |
| Whether a molecule may reference another molecule, or only atoms. RESOLVED in c-0002: it may reference either. | n-0001 | c-0001 |
| Where atom and molecule files live on disk, and what their uniform frontmatter schema is. RESOLVED in c-0002. | n-0003 | c-0001 |
| Whether atoms are invisible to routing, as base packages are today. RESOLVED in c-0002: yes, inherited from the `_base` exclusion. | n-0003 | c-0001 |
| The mechanism by which a consuming unit consumes a referenced one. PARTIALLY RESOLVED in c-0002: `includes`, not `requires-skills`. | n-0002 | c-0001 |
| What automated check can prove collapse rather than declaration. | n-0005 | c-0001 |
| The disposition of `skills/_base/chronicler/`, which conforms to neither the atom nor the molecule form rule. | n-0006 | c-0001 |
| Which behaviors are actually duplicated across the existing skills, without which the collapse test is unmeasurable. | n-0007 | c-0001 |
| Whether all existing skills migrate, and on what schedule. | n-0004 | c-0001 |
