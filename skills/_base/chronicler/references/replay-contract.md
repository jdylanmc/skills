---
includes: []
requires-skills: []
---

# Replay Contract

Replay reconstructs Skill Run State from one explicitly selected Skill Run Log.
It is read only. It never repairs, reorders, or invents evidence, and it never
repeats a recorded side effect.

## Result

Replay returns JSON:

- `log_id` - the selected path, or the opaque identifier supplied with `--log-id`;
- `run_id` and `root_skill` - taken from the first usable record;
- `skills` - every skill that recorded an event;
- `event_count` and `events` - usable events, each carrying an `Lnnn` anchor;
- `operations` - each operation with its start anchor, completion anchor, and outcome;
- `defects` - every problem found, each with an anchor;
- `complete` - true only when no defect was found.

## Anchors

An anchor is the physical line of the record in the selected log, written
`L12`. Cite findings by log identity, run identity, and anchor or anchor range.

## Defects

| Type | Meaning |
| --- | --- |
| `malformed_record` | The line is not valid JSON. |
| `invalid_record` | The record does not satisfy the event schema. |
| `blank_record` | A blank line appears inside the log. |
| `foreign_run` | The record belongs to a different run. |
| `sequence_anomaly` | The recorded sequence disagrees with the log position, indicating concurrent writers or a lost record. |
| `duplicate_operation_start` | An operation records intent more than once. |
| `incomplete_operation` | An operation records intent with no outcome. |
| `unmatched_outcome` | An operation records an outcome with no intent. |
| `no_usable_records` | The log holds no usable event. |

A defect never stops replay. Later records stay usable, and the reader decides
how much confidence the remaining evidence supports.

## Consumer Rules

- Analyze only a log the operator explicitly selected.
- Treat `complete: false` as incomplete evidence and cap confidence for any
  finding that depends on the affected records.
- Report each defect rather than working around it.
- Never write to a Skill Run Log while reading it.