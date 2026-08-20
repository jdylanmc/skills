---
includes: []
requires-skills: []
---

# Roles, Authority, and Prerequisites

## Accepted Input

Require one tracker-backed root work item from GitHub Issues or Azure DevOps.
It can be an epic, feature, story, issue, or other provider-native parent. The
root must represent approved implementation intent produced by Discovery Loop,
Breakdown to Tickets, or an equivalent user-approved planning process.

Before mutation:

1. resolve the exact repository and remote provider;
2. read repository instructions and tracker contracts;
3. hydrate the root item, descendants, native parent links, dependencies,
   states, assignees, acceptance criteria, and linked pull requests;
4. verify that implementation scope and completion criteria are sufficiently
   concrete;
5. verify a startup capability matrix for tracker hydration and claiming,
   isolated worktrees, task-agent creation, recurring timers, exact-head review
   evidence, required-check freshness, guarded squash merge, and durable local
   state;
6. obtain explicit confirmation of the root item when the user's reference is
   ambiguous;
7. obtain the exact approval:
   `Approve squadron run and guarded squash merges for <root-key>`.

Do not infer a sibling repository, silently treat all open items as the
backlog, or implement fog that the planning workflow has not promoted.
The approval delegates mutating pull-request ownership through human merge
approval for this run. It expires when the root, repository, target branch, or
merge policy changes.

## Primary

The Primary is the agent in the user's conversation. Its steady-state job is
executive control, not implementation.

The Primary:

- launches or resumes one Coordinator;
- arms and owns the one-minute executive status loop;
- receives Coordinator summaries and exceptional escalations;
- reports health, capacity, current assignments, pull-request gates,
  completed scope, remaining frontier, blockers, and next action;
- may execute a guarded merge after independently checking the merge gate;
- relaunches a failed Coordinator from durable control state;
- stops, pauses, or redirects the run when the user instructs it.

The Primary must not implement backlog tickets, shepherd a worker's pull
request, run the worker's Roast loop, or become a second scheduler. If the
Coordinator is healthy, all worker control routes through it.

Primary capability profile:

- read control state and provider state;
- communicate with the Coordinator and user;
- manage the recurring status schedule;
- recover the Coordinator;
- perform only the guarded merge procedure.

No edit, commit, push, ticket-claim, or worker-supervision capability is valid
for the Primary outside Coordinator recovery or the guarded merge procedure.

## Coordinator

Launch one long-lived, high-capability Coordinator task agent. Give it the root
item, repository and provider identity, control-state path, concurrency limit,
deadlines, composed-skill paths, merge authority, and this complete package.

The Coordinator:

- is the sole scheduler and worker supervisor;
- maintains the live dependency graph and durable control state;
- decides which tickets can run in parallel and which must remain serial;
- keeps up to six workers active while the ready frontier has capacity;
- receives worker heartbeats, terminal envelopes, and timeout handoffs;
- may perform a guarded merge but never self-approves a review;
- creates exactly two recovery slices after a valid timeout handoff;
- continuously re-evaluates root completion.

The Coordinator communicates upward through concise structured snapshots. It
does not replace the Primary's user-facing reporting role.

Coordinator capability profile:

- read and mutate control state and the tracker graph;
- create isolated branches, worktrees, and task agents;
- communicate with the Primary and workers;
- accept handoffs and publish recovery children;
- perform only the guarded merge procedure.

The Coordinator does not edit implementation files or shepherd a pull request
on a worker's behalf while that worker is healthy.

## Workers

Each worker:

- owns exactly one claimed ticket and one source branch;
- works in an isolated worktree;
- implements the smallest complete ticket outcome;
- opens exactly one pull request;
- invokes the official Roast This Code and Shepherd skills;
- pushes corrections and updates evidence;
- returns structured progress and terminal envelopes;
- never merges, approves its own pull request, weakens policy, or claims
  another ticket.

Use strong implementation-capable models. Prefer model diversity across active
workers when the runtime supports it, but never trade away repository
compatibility, tool access, or task fitness merely to vary models.

Worker capability profile:

- read and edit only its isolated worktree and claimed ticket;
- build, test, commit, push, and open or update its one pull request;
- invoke the official Roast This Code, Shepherd, and Handoff skills;
- communicate only status, evidence, questions, and terminal results.

The worker has no merge, sibling-ticket, scheduling, or provider-policy
administration authority.

## Authority Matrix

| Action | User | Primary | Coordinator | Worker |
| --- | --- | --- | --- | --- |
| Select or stop the root run | Yes | On user authority | No | No |
| Schedule and claim tickets | No | No | Yes | No |
| Implement one ticket | No | No | No | Yes |
| Open and update worker pull request | No | No | Supervisory recovery only | Yes |
| Produce Roast recommendation | No | No | No | Through official skill |
| Shepherd worker pull request | No | No | No | Through official skill |
| Merge after full gate | Yes | Yes | Yes | Never |
| Split a timed-out ticket | No | No | Yes | Handoff only |

If runtime permissions cannot enforce this matrix, enforce it in prompts,
control-state transitions, and merge checks. Treat a worker merge attempt as a
run-integrity failure.

## Composed Skill Prerequisites

Resolve and read the installed entry points for:

- `breakdown-to-tickets`, for its end-to-end slice and dependency vocabulary;
- `roast-this-code`, for immutable evidence and Roastmaster contracts;
- `shepherd`, for one-pull-request ownership and readiness;
- `handoff`, for its five-section handoff discipline.

Do not imitate or weaken a composed skill when it is missing. Stop with the
exact missing prerequisite before launching workers. The timeout envelope in
this package is the machine-readable return contract; `/handoff` supplies the
required human-readable artifact.
