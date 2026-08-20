# Requirements - Test Coverage Doctrine

No cycle has run. Nothing here is confirmed; every entry is the loop's reading of
the anchor, held as unresolved until interrogated.

## Confirmed Requirements

None.

## Constraints

Carried from repository evidence, not yet confirmed as session constraints by a
user decision.

| Constraint | Source | Node | Cycle |
| --- | --- | --- | --- |
| Doctrine files are integrity-controlled. Editing one requires regenerating its SHA-256 with `shasum -a 256` and updating `doctrine/manifest.md`. | `AGENTS.md` Doctrine section; `doctrine/manifest.md` | n-0003 | setup |
| Doctrine must stay source-neutral. | `AGENTS.md` Doctrine section | n-0004 | setup |
| Doctrine guides decisions but never replaces repository evidence, requirements, or task-specific instructions. | `AGENTS.md` Doctrine section | n-0000 | setup |

The source-neutrality constraint is directly relevant: the anchor asks to
integrate a named speaker's talk, and doctrine is required to be source-neutral.
Synthesized guidance may therefore need to be stated without attribution inside
the doctrine file itself, with attribution recorded here in `evidence.md`.

## Exclusions

None confirmed.

## Unresolved Requirements

| Unresolved requirement | Node | Cycle |
| --- | --- | --- |
| The definition of a seam, precise enough that two reviewers classify the same code identically. | n-0001 | setup |
| The definition of "the internal bits" that are exempt. | n-0001 | setup |
| Whether "100 percent" means line, branch, or behavioral coverage of the contract. | n-0001 | setup |
| Whether the position amends, refines, or contradicts `doctrine/testing.doctrine.md`, which already warns against numerical coverage targets. | n-0003 | setup |
| The claimed causal link between following SOLID principles and the coverage position. | n-0002 | setup |
| What the three supplied talks actually argue, and which claims survive as doctrine. | n-0004 | setup |
| Whether attribution to named speakers is compatible with the source-neutrality rule for doctrine. | n-0004 | setup |
