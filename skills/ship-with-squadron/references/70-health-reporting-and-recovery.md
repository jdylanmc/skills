# Health, Reporting, and Recovery

## One-Minute Executive Loop

While the run is active, the Primary must arm the runtime's recurring
scheduling capability for one report every minute. Do not ask the Coordinator
or workers to post directly to the user conversation.

At each tick:

1. read the latest durable ledger;
2. request a fresh concise Coordinator snapshot when it is reachable;
3. reconcile snapshot identity with the ledger;
4. publish the executive report;
5. record the report timestamp, schedule identifier, tick start and finish,
   and next expected tick.

If recurring scheduling is unavailable, state the degradation before launching
workers and publish on every material transition. Do not promise one-minute
updates that the runtime cannot deliver.

## Executive Report

Keep the report brief and stable:

**Squadron:** `<aggregate-health>` | Coordinator `<coordinator-health>` |
`<active>/<limit>` workers | `<ready>` ready |
`<blocked>` blocked | `<merge-ready>` merge-ready

**Active:** one compact line per worker with ticket, phase, elapsed versus
deadline, and current action. Name the milestone and include active elapsed,
wall elapsed, and the absolute deadline with offset.

**Pull requests:** identifiers and exact-head gate summary.

**Progress:** completed descendants versus total required descendants, plus
the highest-value newly shipped outcome.

**Risks:** stale agents, deadline risk, external blockers, or `None`.

**Next:** the Coordinator's next scheduling or merge action.

Do not dump logs, code details, full review findings, or speculative completion
percentages. Tie every assignment and outcome to its tracker key.

## Health Model

Coordinator health:

- `HEALTHY`: heartbeat is current and state advances or valid waiting is
  recorded;
- `DEGRADED`: two consecutive one-minute reports lack a fresh heartbeat;
- `UNHEALTHY`: five consecutive reports lack a fresh heartbeat, the task
  failed, or ledger writes cannot be verified.

Do not preserve `HEALTHY` from the last stored value when its supporting
heartbeat or schedule tick is stale. Health is a fresh derived observation,
not a durable assertion.

Worker health:

- `ACTIVE`: heartbeat within five minutes, or within the active Shepherd
  observation interval plus one minute while delegated monitoring is the
  worker's current phase;
- `AT_RISK`: heartbeat stale or a milestone has less than 15 minutes
  remaining with an unresolved blocker;
- `TIMED_OUT`: a deadline passed;
- `TERMINAL`: a valid terminal envelope was accepted.

Use monotonic timing where available. Report machine suspension separately
from active agent work.

## Coordinator Recovery

When the Coordinator becomes unhealthy:

1. stop new claims and merges;
2. preserve active workers and prevent duplicate launches;
3. capture the freeze bundle from the forensic evidence reference;
4. inspect the last valid ledger and append-only events;
5. query live tracker, branch, pull-request, checks, and merge state;
6. classify every active phase from evidence, using `UNKNOWN` where evidence
   is missing instead of guessing;
7. terminate the failed Coordinator when the runtime permits;
8. launch one replacement Coordinator with the same run ID;
9. require it to reconcile every ticket before scheduling;
10. resume the one-minute reports with a recovery marker.

The Primary may perform this recovery because it owns executive continuity. It
must not take over ticket implementation.

## Worker Recovery

If a worker process fails before a deadline:

- preserve its worktree and branch;
- mark the worker failed;
- request a handoff only if the runtime can still contact it;
- have the Coordinator inspect durable work and live provider state;
- either launch one fresh replacement for the same bounded ticket or apply the
  timeout split when the evidence shows the ticket exceeded its milestone.

Never run two active replacements against the same branch.
A same-ticket replacement inherits the original attempt's milestone and total
deadlines. Only two newly published recovery children receive fresh budgets.

## Pause and Resume

On user pause:

- stop new claims and merges;
- tell workers to reach the nearest safe persistence point;
- record suspension and provider state;
- disarm the one-minute schedule after the final pause report.

On resume, reconcile from durable state before restarting timers or workers.
Do not erase wall-clock deadline history. Any deadline extension requires
explicit user authorization.

## Run Completion

Before declaring completion:

1. stop claims;
2. perform a fresh provider reconciliation;
3. prove backlog exhaustion under the scheduling contract;
4. verify no open worker pull request or timeout split remains;
5. write the terminal snapshot;
6. disarm the one-minute schedule;
7. report shipped scope, merge list, unresolved advisory risks, total worker
   attempts, timeout splits, and final root state.
