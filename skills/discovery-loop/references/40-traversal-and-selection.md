---
includes: []
requires-skills: []
---
# Traversal, Priority, and Selection

**Intended reader:** the agent executing a cycle.

Breadth-first is the default. Depth is a bounded exception with a named trigger.

## Fog State Transitions

These are fog-axis transitions. Maturity moves independently and is never described with these tokens without naming the axis.

```text
unexplored       -> scouted | blocked
scouted          -> investigating | blocked
investigating    -> researched | blocked
researched       -> decision-ready | accepted-unknown | blocked
decision-ready   -> cleared | blocked
cleared          -> promoted | blocked
blocked          -> investigating
accepted-unknown -> investigating
invalidated      -> scouted

any state        -> invalidated   (reinterpretation only)
```

These transitions are the serialized form of the fog state diagram in [README.md](../README.md).

Rules:

1. A node may not skip forward through the ordered states.
2. Reinterpretation may move a node to `invalidated` from **any** state, including `cleared` and `promoted`. No other step may.
3. A node at fog `decision-ready` or `cleared` moves to `blocked` when a new dependency, a `conflicted` term, an unreachable anchor, or contradicting evidence stops it from being settled. Record the reason and the blocking node or term. Maturity is a separate axis: it is retained when the understanding is still valid and lowered by exactly one level when the evidence that supported it was withdrawn or contradicted, exactly as the `weakened` verdict does. Clearing the block returns the node to `investigating`, and it re-earns `decision-ready` and `cleared` through the ordered states.
4. A node leaving `promoted` for `invalidated` keeps its tracker link, tier, and `promotion-key`, and gains a divergence note. The loop never unpublishes or overwrites the tracker item to match; the user decides.
5. `cleared` alone does not authorize promotion. Promotion requires fog `cleared` **and** maturity `promotion-ready`, and the full leaf gate in [Promotion and tracker mapping](./80-promotion-and-tracker.md).
6. Record every transition in the node's history with its cycle id.

Any other transition is invalid.

Fog `researched` means the problem, intended outcome, evidence, blockers, and next decisions are known. It does not mean every question is answered. Maturity `researched` is the corresponding understanding floor used by the priority-maturity invariant.

## Priority and Maturity Are Independent

Priority answers "how much does this matter to the destination". Maturity answers "how well do we understand it". A `P0` node may be at maturity `vague`; a `P2` node may be at maturity `decision-ready`.

Reinterpretation with the `weakened` verdict lowers maturity by exactly one level and never below `vague`. A node already at maturity `vague` stays there and records the weakening as a reason instead.

## Priority-Maturity Invariant

A lower-priority node must not gain depth while a **related** higher-priority node remains below maturity `researched`. Related means connected by parent-child, `depends-on`, `blocks`, `refines`, `conflicts-with`, or a cross-session link into the same subject.

### Detection window

New debt is detected inside a **three-cycle window**. Each cycle, evaluate every node that **advanced** in the last three completed cycles, where advanced means: the node was added, its maturity increased, its fog moved forward, or a decision was recorded against it - as stated in those cycles' checkpoints. Use fewer cycles when the session has fewer. Existing debt rows are re-evaluated every cycle regardless of the window; the window bounds detection of *new* debt, not maintenance of recorded debt.

**Weakening is its own trigger, and it is not bounded by the window.** When a node is `weakened` below maturity `researched` - by reinterpretation, by withdrawn evidence, or by a blocking dependency that costs it a level - the debt it may now be outran by is not limited to nodes that advanced recently. Compare that node against **every** related lower-priority node currently at maturity `researched` or above, no matter which cycle each of them reached that level in, and add a row for each pairing that is not already open or deferred. The ordering violation is created by the higher-priority node moving down, so restricting the comparison to recently advanced nodes would miss every lower-priority node that got ahead earlier and then sat still. Record it on each row as `Cause: weakened <node-id>` so the table itself shows why the pairing appeared without either node advancing.

### Add, update, and clear

| Operation | Trigger | Effect |
| --- | --- | --- |
| Add | An advanced lower-priority node is related to a higher-priority node whose **maturity** is below `researched`, and no **open or deferred** row already pairs them. | Append a row with the lower-priority node, the outran node, the relation, `Cause: advanced <node-id>` (or `weakened <node-id>` / `priority-change <node-id>`), `Detected: <cycle-id>`, `Last seen: <cycle-id>`, and `Status: open`. |
| Update | An open or deferred row still holds. | Refresh `Last seen` to the current cycle, refresh the relation, and keep `Detected` and `Cause` unchanged - `Cause` records why the row first appeared and is never rewritten. |
| Defer | The user overrides selection away from the debt. | Set `Status: deferred (<cycle-id>, <reason>)`. The row stays; deferral is never deletion. A deferred row is re-evaluated and reappears in the recommendation next cycle. |
| Clear | The higher-priority node reaches maturity `researched` or above, the relation is removed, a priority change makes the pairing valid, or either node is invalidated. | Remove the row from `Priority Debt`, record `debt cleared` with the cause in both nodes' history, and record it in the checkpoint's state delta. |

A deferred row never produces a duplicate Add for the same pair; it is updated in place until it clears.

Rank open and deferred debt by the **outran higher-priority node's** priority (`P0` first), then by that node's dependent count (more dependents first), then by that node's node id (lowest first). Every term names the same node, so the ranking is deterministic. Priority debt takes precedence over breadth. Clearing it requires only reaching maturity `researched` on the higher-priority node, not fully clearing its fog; breadth-first work resumes once that floor is met.

`unprioritized` nodes do not generate debt against each other. Compare them only after the user or the evidence assigns a priority.

### Response to a user priority change

When the user changes a node's priority, recompute the whole debt table in the same cycle and stage the result:

- pairings that become violations are added with `Detected: <current cycle>` and the cause `user-priority-change`;
- pairings that stop being violations are cleared with the same cause;
- rows whose ranking changed are re-ranked;
- the change and its debt consequences are stated back to the user.

Timing follows when the change arrives:

| Arrival | Recompute | Report | Write |
| --- | --- | --- | --- |
| At step 8, while the recommendation is being agreed | Immediately, before the question group runs | Restate the consequences and any change to the recommendation before the first question | Staged in step 11, written by step 14 |
| During the question group in step 10 | When the change arrives, without interrupting the group | In the group's closing summary | Staged in step 11, written by step 14 |

A priority change never rewrites the debt history in earlier checkpoints, and no debt table is ever written outside step 14.

## Depth Triggers

Recommend bounded depth-first work only for a trigger that is also a selection rule. The triggers are exactly selection rules 1 through 5, in the same order and with the same meaning:

1. **Anchor invalidation** - a node whose reinterpretation verdict this cycle is `invalidated` or `orphaned`. The anchor moved underneath settled understanding, so nothing else is worth exploring first.
2. **Priority debt** - the highest-ranked open or deferred debt entry.
3. **Shared blocker** - one node blocking two or more other nodes.
4. **High risk or major uncertainty** - a node whose wrong answer would invalidate a settled decision, a promoted subtree, or another session.
5. **Downstream unlock** - a node whose resolution moves the most dependent nodes to a higher maturity.

Selection rule 6 is the only rule that does not trigger depth: it continues breadth across the selected node's sibling set.

Depth is bounded to one branch for one cycle. Re-evaluate breadth at the start of the next cycle. Never chain depth cycles on the same branch without restating the trigger and confirming it still holds.

## Deterministic Selection Order

Select the first non-empty rule, then apply the tie-breakers inside it:

| Rank | Rule | Candidate set |
| --- | --- | --- |
| 1 | Anchor invalidation | Nodes whose reinterpretation verdict this cycle is `invalidated` or `orphaned`. |
| 2 | Priority debt | The highest-ranked debt entry's higher-priority node. |
| 3 | Shared blocker | Nodes at fog `blocked`, or blocking nodes, with two or more dependents. |
| 4 | High risk or uncertainty | Nodes flagged high risk, or `conflicts-with` pairs that are still unreconciled. |
| 5 | Downstream unlock | Nodes with the greatest number of dependents below maturity `researched`. |
| 6 | Oldest unresolved | Every remaining node not at fog `cleared` or fog `promoted`. |

Tie-breakers, applied in order inside the selected rule: higher priority first (`P0` > `P1` > `P2` > `unprioritized`), then lower maturity, then greater dependent count, then earlier first-seen cycle, then lowest node id. The final tie-breaker guarantees exactly one selection.

Traversal mode follows from the rule: rules 1 through 5 recommend depth on the selected node; rule 6 continues breadth across the selected node's sibling set.

Announce the result with the parameterized wording in step 8 of [Cycle workflow](./20-cycle-workflow.md), naming the selected nodes, the rule, and the reason.

## User Override

State the recommendation with its rule and reason. The user may:

- accept it;
- redirect to another node;
- change the traversal mode;
- change a node's priority.

Record the override as `selection-source: user` in the journal, the checkpoint frontmatter, and the outcome envelope, and keep the deterministic recommendation and any unresolved priority debt in the checkpoint. `selection-source` has exactly two values: `deterministic` when the loop's rule stood, and `user` when the user redirected the node or the traversal mode. A priority change alone that does not change the selected node leaves `selection-source: deterministic` and is recorded as a debt-table cause instead.

An override never deletes debt. It defers it with a reason, and the deferred row reappears in the next cycle's recommendation.

## Cross-Session Traversal

A cycle works one session. When selection points at a linked session's node:

1. read only that node's summary from the primary map or that session's `discovery.md`;
2. record the dependency as a typed cross-session link and a blocker on the current node;
3. recommend switching sessions rather than editing the other session's tree in this cycle.

Never mutate another session's package from inside the current session's cycle. The one exception is an approved extraction: after `Approve session extraction <slug>`, step 14 creates and verifies the receiving package, then writes the map row, the `supersedes-session` link and its back-link, and the parent pointer, and only then removes the branch from the parent and reverifies both packages. That exception is bounded to the approved slug and to step 14, and it is unavailable while `state-scope` is `partial`: a partial cycle proposes the extraction and defers it to a later full-state cycle, and refuses it outright when any moved node, any node referencing one, or any node the branch references is unread.
