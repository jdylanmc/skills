---
includes: []
requires-skills: []
---

# Run Recording

Record a bounded Skill Run Log so an interrupted run can be diagnosed and so
Post-Mortem has cited evidence. Recording is best effort and never gates
delivery.

Follow the Chronicle base contract for the command surface and event fields.

## Root Context

The Primary creates the run context once, before launching the Coordinator:

- `run_id` - the squadron run ID already recorded in control state;
- `root_skill` - `ship-with-squadron`;
- `log_path` - `<repository>/.skill-log/ship-with-squadron.<UTC-date>.<run-id>.jsonl`,
  resolved to an absolute path before any worktree exists.

Store all three in control state and pass them unchanged to the Coordinator,
to every worker, and to every composed skill that records. A nested
participant adds only its own emitting-skill name. Never re-derive the log path
inside a worker's isolated worktree, and never infer a run from the newest log
file.

## What to Record

Emit only meaningful lifecycle boundaries:

| Moment | Phase | Operation |
| --- | --- | --- |
| Run authorized and started | `before` | the run ID |
| Ticket claimed | `before` | the ticket key |
| Worker delegated a ticket | `observation` | the ticket key |
| Initial Roast recommendation, and any later recommendation that clears the exact-head gate | `observation` | the ticket key |
| Shepherd returned a terminal outcome | `observation` | the ticket key |
| Ticket reached a terminal state | `after` | the ticket key |
| Externally observed degradation | `observation` | none |
| Run finished | `after` | the run ID |

Record exactly one `before` and one `after` per ticket key. The `after` event
carries the terminal state as its outcome, such as `MERGED`, `TIMED_OUT`, or
`CANCELLED`, and a confirmed merge is part of that single terminal record
rather than a second one. Pairing intent with exactly one outcome is what makes
a frozen run diagnosable, because replay reports a claim that never completed.

An `observation` never opens or closes an operation, so the intermediate rows
above group under a ticket without disturbing that pairing. Do not record a
Roast recommendation for every correction loop; record the first one and any
that clears the exact-head gate.

Do not record every tool call, provider poll, heartbeat, or file operation.
Do not record raw review bodies, prompts, reasoning, diffs, or credentials.
Record a pull-request number, a revision, or a check name as evidence instead.

## Recording Failure

A non-zero exit from the emit command is not a delivery failure:

1. report the stable failure category once in the next executive report;
2. mark the run's evidence incomplete;
3. continue claiming, implementing, reviewing, and merging.

Never retry in a loop, never block a worker on recording, and never let a
missing Chronicle base stop the run. If the base is absent, report it as
missing evidence infrastructure and continue.

## Boundary

The Skill Run Log never authorizes an action. Claims, deadlines, review
evidence, and merge gates are decided from Squadron Control State and live
provider state alone.
