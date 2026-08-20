---
schema-version: 1
session: test-coverage-doctrine
state-root: docs/discovery
revision: 0
anchor: idea
anchor-revision: 2026-08-20T18:05:00Z
anchor-status: unchanged
question-group-size: 12
last-question-group-size: none
last-cycle: none
cycle-state: complete
state-digest: unverified
root-map-digest: unverified
root-lexicon-digest: unverified
digest-tool: shasum -a 256
digest-status: verified
state-scope: full
tracker-mode: remote
tracker-tier-map: unmapped
---

# Discovery Session - Test Coverage Doctrine

Recorded, not yet worked. No cycle has run. Every node is at fog `unexplored`
and maturity `vague`, and nothing here has been interrogated, researched, or
confirmed.

## Anchor

Recorded from the user's idea statement on 2026-08-20T18:05:00Z, verbatim in
substance:

> Unit test coverage doctrine. We don't want 100% code coverage. We want SOLID
> principles followed and code coverage at the seams to be 100%... but not the
> internal bits. We should integrate the synthesization of Kent Beck's speech
> here: https://www.youtube.com/watch?v=C5IH0ABmyc0

Two further sources were supplied in the same exchange:
https://www.youtube.com/watch?v=ILkT_HV9DVU and
https://www.youtube.com/watch?v=EZ05e7EMOLM.

Context supplied by the user: this topic arises while migrating this repository
of skills to a better model. It is recorded now and worked later.

## Destination

Not yet stated. A candidate destination, unconfirmed, is a doctrine position
that says which code must be covered and which must not, expressed in terms a
reviewer can apply without arguing about a percentage.

## Session Domain Lexicon

| Term | Status | Definition | Bounded context | Aliases | Source | First seen | Last verified | Related terms | Scope |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Coverage | candidate | The proportion of code executed by a test run. The anchor treats it as a target at some boundaries and explicitly not at others. | Engineering doctrine | none recorded | Session anchor | test-coverage-doctrine/n-0000/setup | none | Seam, Internal | session:test-coverage-doctrine |
| Internal | candidate | Code deliberately excluded from a coverage target. The anchor calls these "the internal bits" without defining them. | Engineering doctrine | `implementation detail` | Session anchor | test-coverage-doctrine/n-0001/setup | none | Seam, Coverage | session:test-coverage-doctrine |
| Seam | candidate | The boundary at which the anchor requires 100 percent coverage. Undefined: it may mean a public interface, a dependency boundary, a module port, or Michael Feathers' original sense of a place where behavior can be changed without editing in that place. | Engineering doctrine | none recorded | Session anchor | test-coverage-doctrine/n-0001/setup | none | Coverage, Internal | session:test-coverage-doctrine |

## Tree

### n-0000 - Test coverage doctrine

- Parent: none
- Fog: unexplored
- Maturity: vague
- Priority: unprioritized
- Outcome: unknown
- Open questions: What position should this repository take on coverage, stated so a reviewer can apply it without arguing about a number?
- Evidence: none gathered
- Links: none
- First seen: setup
- Former node id: none
- Reinterpreted: none
- Promotion key: none
- Tracker: none
- Divergence: none
- History: session setup - node created, not interrogated

### n-0001 - What counts as a seam

- Parent: n-0000
- Fog: unexplored
- Maturity: vague
- Priority: unprioritized
- Outcome: unknown
- Open questions: What is a seam, precisely enough that two reviewers classify the same code the same way? Is it a public interface, a dependency boundary, a module port, or Feathers' original definition? What is the complement - "the internal bits" - and who decides?
- Evidence: none gathered
- Links: refines n-0000
- First seen: setup
- Former node id: none
- Reinterpreted: none
- Promotion key: none
- Tracker: none
- Divergence: none
- History: session setup - node created, not interrogated

### n-0002 - SOLID and testability

- Parent: n-0000
- Fog: unexplored
- Maturity: vague
- Priority: unprioritized
- Outcome: unknown
- Open questions: The anchor couples "SOLID principles followed" to the coverage position. What is the claimed causal link - that SOLID produces seams worth covering, or that SOLID makes internals safe to leave uncovered? Is the doctrine's guidance conditional on SOLID being followed?
- Evidence: none gathered
- Links: refines n-0000
- First seen: setup
- Former node id: none
- Reinterpreted: none
- Promotion key: none
- Tracker: none
- Divergence: none
- History: session setup - node created, not interrogated

### n-0003 - Reconciliation with the existing testing doctrine

- Parent: n-0000
- Fog: unexplored
- Maturity: vague
- Priority: unprioritized
- Outcome: unknown
- Open questions: `doctrine/testing.doctrine.md` already exists at 152 lines and already warns "never treat a numerical coverage target as a quality verdict", and separately states "prefer value over test count or coverage" and "coverage measures execution, not assertion quality". The anchor asks for 100 percent at the seams, which is a numerical target, scoped. Does this amend the existing doctrine, refine it, or contradict it? An amendment requires regenerating the SHA-256 digest in `doctrine/manifest.md`.
- Evidence: `doctrine/testing.doctrine.md` lines 29, 35, 37; `doctrine/manifest.md`; `AGENTS.md` Doctrine section
- Links: refines n-0000
- First seen: setup
- Former node id: none
- Reinterpreted: none
- Promotion key: none
- Tracker: none
- Divergence: none
- History: session setup - node created, not interrogated. This is the most material open question in the session.

### n-0004 - Source synthesis

- Parent: n-0000
- Fog: unexplored
- Maturity: vague
- Priority: unprioritized
- Outcome: unknown
- Open questions: What do the three supplied talks actually argue, and which claims are usable as doctrine? Their content is unverified - only their titles have been confirmed. A transcript must be retrieved or supplied before any claim from them is recorded as evidence.
- Evidence: see `evidence.md`. Titles verified; content not.
- Links: refines n-0000; evidence-for n-0001
- First seen: setup
- Former node id: none
- Reinterpreted: none
- Promotion key: none
- Tracker: none
- Divergence: none
- History: session setup - node created, not interrogated

## Active Frontier

| Node | Fog | Maturity | Priority | Blocked by | Open questions |
| --- | --- | --- | --- | --- | --- |
| n-0000 | unexplored | vague | unprioritized | none | The doctrine position itself |
| n-0001 | unexplored | vague | unprioritized | none | Definition of seam and of internal |
| n-0002 | unexplored | vague | unprioritized | none | The claimed SOLID-to-coverage link |
| n-0003 | unexplored | vague | unprioritized | none | Amend, refine, or contradict existing doctrine |
| n-0004 | unexplored | vague | unprioritized | none | Unverified source content |

## Priority Debt

| Lower-priority node | Outran (maturity below researched) | Relation | Cause | Detected | Last seen | Status |
| --- | --- | --- | --- | --- | --- | --- |

## Tracker Synchronization

| Node | Tier | Promotion key | Tracker item | Last synced cycle | Divergence |
| --- | --- | --- | --- | --- | --- |
