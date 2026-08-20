# Engineering Skills

This context defines shared language for the reusable engineering skills in this repository.

## Language

### Skill orchestration

**Chronicler**

The reusable deterministic recorder used by Chronicle-consuming skills. It
appends bounded operational events to the Skill Run Log but owns no scheduling,
implementation, review judgment, or merge authority.

Discouraged alias: `Journal Keeper`

**Skill Run Log**

The append-only, bounded operational event history for one root skill
invocation, including events attributed to nested skills. It records intended
operations, observed outcomes, continuity gaps, and evidence references without
storing raw reasoning or unbounded logs.

Discouraged aliases: `Squadron Run Journal`, `Skill Run Package`, `run ledger`

**Skill Run State**

The current state reconstructed on demand from a Skill Run Log. It is never
persisted as a separate authority, and incomplete or malformed evidence remains
visible rather than being inferred away.

**Operational Observation**

A structured fact established by an actor or external system with authority to
observe the event. An actor cannot authoritatively observe its own
disappearance.

**Reinforcement Evidence**

Bounded Skill Run Log evidence that Post-Mortem can use to identify reusable
capability, evaluator, or workflow improvements. It excludes internal reasoning
and unbounded transcripts.
