---
includes: []
requires-skills: []
---

# Event Contract

Callers supply meaningful event data. Chronicler supplies and validates the
persisted envelope.

## Caller Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `--event` | yes | A stable event name reused across runs, such as `run` or `ticket_merge`. |
| `--phase` | yes | `before` for intent, `after` for outcome, `observation` for an observed fact. |
| `--summary` | yes | One short sentence describing what happened. |
| `--skill` | no | The emitting skill. Defaults to the root skill. |
| `--operation` | no | A stable identifier that pairs a `before` event with its `after` event. |
| `--outcome` | no | A short result token on an `after` or `observation` event, such as `succeeded` or `failed`. |
| `--evidence` | no | A short external reference such as a pull-request number or commit. Repeatable. |

Names use letters, digits, and `.`, `_`, or `-`, and start with a letter or
digit. Summaries carry no control characters.

## Fields Chronicler Supplies

Chronicler adds `schema_version`, `sequence`, and `timestamp`. A caller never
sets them.

`run_id`, `root_skill`, and `skill` come from the run context rather than from
per-event caller judgement: the root skill fixes `run_id` and `root_skill` once
for the whole run, and `skill` defaults to `root_skill` unless a nested
participant names itself with `--skill`.

Chronicler validates every field and rejects an unknown one, so a caller never
constructs the persisted record directly.

## Bounds

- An identifier such as an event, skill, operation, or outcome name is limited
  to 100 UTF-8 bytes.
- A summary is limited to 500 UTF-8 bytes.
- An evidence reference is limited to 200 UTF-8 bytes, and at most 10 are kept.
- A complete event is limited to 4096 UTF-8 bytes.

Chronicler truncates an over-long summary or evidence reference on a character
boundary and marks the event `truncated`. It rejects an over-long identifier
outright, because a name is a caller mistake rather than overflowing content.

## Excluded Content

Never pass raw conversations, prompts, internal reasoning, full tool output,
source code, review bodies, credentials, or secret-bearing text. Record a
reference to the evidence instead of the evidence itself.

## Pairing

A material operation emits `before` with an `--operation` identifier and later
emits `after` with the same identifier and an `--outcome`. Replay reports an
operation that records intent without an outcome, which is what makes an
interrupted run diagnosable.

## Ordering

`sequence` is recorded by the writer and is best effort. Physical log order is
authoritative during replay. Chronicler provides no cross-writer global
ordering guarantee, and callers must not depend on one.