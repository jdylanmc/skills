---
includes: []
requires-skills: []
---

# Skill Run Log Evidence

A Skill Run Log is an optional, operator-selected evidence source. It never
replaces session evidence and never widens this skill into repository or
history analysis.

Follow the Chronicle replay atom contract for the command surface and the
defect vocabulary.

## Selection

1. Raise this source only in response to an operator request about a recorded
   run. Never offer it unprompted, and never reach for it merely because the
   current session is partial, compacted, or summary-only. A gap in session
   evidence is a limitation to report, not a reason to analyze another run.
2. Discover candidates in the `.skill-log/` directory at the repository root
   for the current run context, or at a path the operator supplies. If neither
   exists, record that no candidate log is available under limitations and
   continue with session evidence. Never search the filesystem for logs.
3. List candidates by skill, date, and run identifier. Never open one before
   the operator names it.
4. Analyze exactly one run by default.
5. Analyze more than one run only when the operator explicitly selects a
   comparison set, and only if the runs are independent of each other.
6. If the operator declines, or no log exists, continue with session evidence
   alone and record the absence under limitations.

Never infer a run from the newest file, and never substitute a log the
operator did not name.

## Replay

Replay a selected log with the Chronicle read-only replay command. Never parse
the file by hand, never write to it, and never treat raw bytes as clean
evidence when replay reports a problem.

If replay cannot read the selection at all, or returns no usable event, treat
the log as unavailable: record the log identifier and the reported defect under
limitations, and draw no finding from it.

Use `--log-id` so published output carries an opaque run identifier instead of
an absolute path.

## Anchors

Give each selected log a slot in selection order: `L1`, `L2`. Anchor a record
as `<slot>:<line>`, for example `L1:12`, and a range as `L1:12-18`. These
anchors never collide with session anchors, which use `U`, `A`, `T`, `S`, `R`,
and `M`.

Every finding drawn from a log cites the log identifier, the run identifier,
and an anchor or anchor range.

## Completeness and Confidence

Declare completeness for each selected run from the replay result:

- **complete:** replay reported no defect;
- **incomplete:** replay reported one or more defects.

Report every defect with its type and anchor. Never repair, reorder, or infer
a missing event, and never present a reconstructed value as observed.

An incomplete run caps confidence at **Moderate** for any finding that depends
on the affected records. A finding that depends only on unaffected records
keeps its own confidence. Session completeness caps apply independently, and
the most restrictive cap wins.

An operation that records intent with no outcome is evidence that the run
stopped there. It is not evidence of the cause, so state the cause as a
hypothesis unless an observation records it.

## Recurrence

Two or more independently selected runs may support `OBSERVED` when the same
pattern appears in each and the runs are not two attempts at the same work.

Repetition inside one run is not recurrence. Repeated wording about one event
is not corroboration. If independence cannot be established, keep the
candidate `PROPOSED` and record why.

## Boundary

This source is read only. Selecting and replaying a log never authorizes
validating, promoting, applying, or persisting learning, and it never permits
reconstructing a conversation. A Skill Run Log holds bounded operational
events, not transcripts, so do not present it as a record of what was said.
