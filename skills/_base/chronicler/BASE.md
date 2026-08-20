---
includes: ["_base/chronicler/references/event-contract.md","_base/chronicler/references/replay-contract.md","_base/chronicler/scripts/chronicler.mjs","_base/chronicler/scripts/emit-event.mjs","_base/chronicler/scripts/replay-log.mjs"]
requires-skills: []
---

# Chronicler

Record one bounded Skill Run Log for a root skill invocation, and replay a
selected log on demand. Chronicler observes what happened. It never owns
claims, merges, provider state, or delivery authority.

Recording is best effort. A skill that cannot record reports the failure, marks
its evidence incomplete, and continues delivering.

## Required References

1. [Event contract](./references/event-contract.md)
2. [Replay contract](./references/replay-contract.md)

## Required Files

1. [Recording and replay implementation](./scripts/chronicler.mjs)
2. [Emit entry point](./scripts/emit-event.mjs)
3. [Read-only replay command](./scripts/replay-log.mjs)

## Run Context

The root skill creates the run context once:

- `run_id` - an opaque identifier unique to this invocation;
- `root_skill` - the routable skill that owns the run;
- `log_path` - one absolute path, `<repository>/.skill-log/<root-skill>.<UTC-date>.<run-id>.jsonl`.

Pass all three values unchanged to every nested skill or agent. A nested
participant adds only its own `--skill` name. Never re-derive the path from the
current directory or worktree, and never infer a run from the newest file.

## Emit

Run one command for every recorded event:

```text
node <chronicler>/scripts/emit-event.mjs \
  --log "$log_path" --run "$run_id" --root-skill "$root_skill" \
  --skill "$emitting_skill" \
  --event <stable-event-name> --phase <before|after|observation> \
  --summary "<short bounded summary>" \
  [--operation <operation-id>] [--outcome <outcome>] [--evidence <reference>]...
```

Exit `0` means the event was recorded. Any non-zero exit prints a stable
failure category on standard error. Report that category, mark evidence
incomplete, and continue delivery. Check availability with `--probe`.

`--log` must be an absolute `.jsonl` path. Chronicler refuses a symbolic link,
a non-regular file, or a non-empty file that is not already a Skill Run Log, so
a mistyped path fails instead of corrupting an unrelated file.

Chronicler supplies the schema version, timestamp, and validation. Callers
never construct the persisted record.

## What to Emit

Emit meaningful lifecycle boundaries only:

- the start and final outcome of the run;
- the intent and outcome of each material operation;
- delegation to a nested skill or agent;
- externally observed degradation.

Do not trace every tool call, file read, or heartbeat. Chronicler is evidence,
not instrumentation.

## Replay

Replay only a log the operator explicitly selected:

```text
node <chronicler>/scripts/replay-log.mjs "$selected_log_path" [--log-id <opaque-id>]
```

Replay reconstructs Skill Run State, reports defects, and never repairs,
reorders, or invents evidence. Use `--log-id` when the absolute path must stay
out of published output.

## Regression Suite

From the repository root, run:

```text
node --test skills/_base/chronicler/tests/chronicler.test.mjs skills/_base/chronicler/tests/adversarial.test.mjs
```

The adversarial suite covers torn records, unsafe log targets, semantically
corrupt histories, concurrent writers, and malformed bytes. Keep it passing:
every defect it covers once shipped unnoticed.

## Boundary

Chronicler is a non-routable base. This package contains `BASE.md` and never
`SKILL.md`. It holds no mutable control state, so a consumer's own claim,
merge, and safety gates remain authoritative and unaffected by a recording
failure.
