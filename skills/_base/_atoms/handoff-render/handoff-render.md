---
name: handoff-render
description: Render one bounded handoff document in the approved heading order, keeping every required section present and Suggested Skills as the only optional one.
level: atom
allowed-tools: ["execute"]
includes: ["_base/_atoms/handoff-render/handoff-render.mjs"]
composes: []
used-by: ["_base/_molecules/persist-bounded-handoff/persist-bounded-handoff.md"]
---

# Handoff Rendering

Turn bounded, confirmed context into one Markdown document with a stable shape.
This atom owns the schema and the order. It owns nothing about whether the
content is true.

A handoff is read by an agent that has none of the conversation that produced
it. That reader can only rely on the shape, so the shape does not vary: same
headings, same order, every required heading present even when its section has
nothing confirmed in it.

## Required Files

1. [Rendering entry point](./handoff-render.mjs)

## Operation

```text
node <atoms>/handoff-render.mjs --stdin
```

Exit `0` prints the rendered Markdown. Nothing is written to disk. Any non-zero
exit prints a stable failure category on standard error. Check availability
with `--probe`, which prints `handoff: available`.

## Schema

The document opens with `# Handoff`, then these `##` headings in exactly this
order:

| Order | Heading | Payload field | Presence |
| --- | --- | --- | --- |
| 1 | `Goal` | `goal` | always |
| 2 | `Current Progress` | `current_progress` | always |
| 3 | `Decisions and Constraints` | `decisions_and_constraints` | always |
| 4 | `Artifacts and References` | `artifacts_and_references` | always |
| 5 | `What Worked` | `what_worked` | always |
| 6 | `What Didn't Work` | `what_did_not_work` | always |
| 7 | `Suggested Skills` | `suggested_skills` | only when supplied |
| 8 | `Next Steps` | `next_steps` | always |

`Goal`, `Current Progress`, `What Worked`, `What Didn't Work`, and `Next Steps`
keep their relative order, so a reader that knows only the five-section form
still finds what it expects.

## Content Rules

- A required section with nothing confirmed renders
  `No confirmed information yet.` Inventing content to fill a heading is worse
  than an honest gap.
- `Artifacts and References` renders one list item per reference,
  `- <locator> - <note>`, and the note is omitted when there is none.
- `Suggested Skills` renders `- <skill> - <reason>`. A suggestion without a
  reason is malformed input. When the caller supplies its available skills, a
  suggestion outside that set is `unknown_skill`, which is what stops an
  invented skill from reaching the next agent.
- `Suggested Skills` is **omitted entirely**, heading included, when no skill
  is supplied. An empty optional section is noise.
- A section body may not introduce a `#` or `##` heading of its own outside a
  fenced block. A body that emitted `## Next Steps` would leave the document
  disagreeing with the order promised above, and a reader scanning for the
  first `## Next Steps` would act on the wrong block. A `###` or deeper heading
  is fine.
- After rendering, the document's own `##` headings are compared with the
  headings this atom reports. A disagreement is a defect, not an output.

## Bounds

| Bound | Limit |
| --- | --- |
| One prose section | 8000 UTF-8 bytes |
| Suggested skills | 10 entries, each reason at most 200 UTF-8 bytes |
| Whole document | 65536 UTF-8 bytes |

Exceeding a bound is malformed input, not a truncation. A handoff that no
longer fits is a handoff that is reproducing something it should reference.

## Output

| Field | Meaning |
| --- | --- |
| `document` | The rendered Markdown, ending in exactly one newline. |
| `headings` | The headings that were rendered, in order. |

## Guarantees

- The heading order is fixed and does not depend on which fields were supplied.
- The reported headings are the headings the document actually carries.
- Line endings are normalized and trailing whitespace is removed, so the same
  input renders byte for byte the same document on every platform.
- An unknown payload field is rejected rather than silently dropped.
- A suggested skill identifier that a redaction rule would rewrite is rejected
  at validation, so the rendered identifier is always the exact one supplied.

## Boundaries

This atom does not gather context, redact, choose a destination, write, or
judge whether the handoff is good enough to hand off.

Portions of this schema are adapted from Matt Pocock's `handoff` skill under
the MIT license. The complete notice is preserved in the Attribution section of
the `persist-bounded-handoff` molecule.
