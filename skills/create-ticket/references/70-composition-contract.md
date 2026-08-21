---
includes: []
requires-skills: []
---
# Composition Contract

Create Ticket is designed to be called by other skills, not only by a person directly. It must behave predictably as a subroutine.

## Callers

| Caller | What it passes in | What it does with the result |
| --- | --- | --- |
| `/discovery-loop` | Every newly defined ticket during a frontier branch, with source context, parent, single bounded question or outcome, known blockers, and named verification seam. | Passes the returned payload to `/discovery` for preview and creation; never creates directly. |
| `/breakdown-to-tickets` | A settled slice description needing wording tightened into the canonical remote tracker body. | Uses the payload inside its own preview and `Approve and publish` gate. |
| Another planning skill, including `/discovery` | Raw input plus an explicit request to use this formatter. | Owns preview, approval, dependencies, and creation; this skill does not claim that standalone callers invoke it automatically. |
| A person directly | Any chat log, draft, or description. | Reviews and pastes the payload into whatever tracker or file they choose. |

## Input Contract

Accept, when supplied by a caller:

- raw text (conversation, log, draft);
- target format: remote tracker body or Discovery one-question;
- parent title or reference, if any;
- known blockers, if any;
- named verification seam or test seam, if any;
- any facts already confirmed by `/interrogate` or `/domain-mapping` that should be treated as settled rather than re-extracted.

Never require a caller to supply more than this. Missing optional fields become `None` or unresolved metadata, not a blocking question by default (see [Clarifying questions](./60-clarifying-questions.md)).

## Output Contract

Return, per detected issue:

- the classified kind;
- the rendered payload in the requested or inferred shape;
- unresolved metadata outside the rendered payload;
- a one-line rationale only when the split, classification, or shape choice is non-obvious.

Return one payload block per issue. Never merge multiple issues' payloads into one block, and never wrap the set in tracker-specific syntax (no issue templates, no YAML front matter, no label or state fields) — those belong to the caller's tracker contract.

## What This Skill Never Does on Behalf of a Caller

- create, update, label, or close anything;
- decide the caller's ready/frontier state or dependency graph beyond restating blockers it was told about;
- perform the caller's own approval gate; the caller always previews and approves before any write;
- assume a caller's silence about target format means "publish it anyway" — silence means default to the remote tracker body and let the caller redirect it.
