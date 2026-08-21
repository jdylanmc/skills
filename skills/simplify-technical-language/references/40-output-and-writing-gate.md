---
includes: ["_base/_molecules/write-approved.md"]
requires-skills: []
---

# Layered Output and Writing Gate

## Required References

1. [Approved and verified write](../../_base/_molecules/write-approved.md)

## Derived-Summary Output

In `derived-summary` mode, the caller's requested schema replaces the
interactive layered format below. Use only the supplied canonical artifact,
claim ledger, audience contract, locked terms, and traceability requirements.
Return the requested derived explanation plus claim-to-source traceability. Do
not add unrelated design sections.

## Final Layered Explanation

Return these sections in order:

## One-Sentence Purpose

State the outcome in one direct sentence. Do not compress multiple independent
claims into the sentence.

## Scope and Boundaries

State what the design includes and excludes. Identify relevant system,
repository, process, trust, and ownership boundaries. If a boundary dimension
is not applicable, say why.

## Prerequisites and Pre-Action Cautions

Include this section before the flow when a reader could act on the explanation.
State required access, environment, data, ordering, hazards, security
consequences, and irreversible effects before the governed action.

## Plain-Language Flow

Explain the normal behavior in ordered steps. Each step must identify the
actor, action, and observable result. Keep atomic operations together.

## Key Components and Responsibilities

Use a compact table:

| Component | Responsibility | Depends on |
| --- | --- | --- |

Include only components needed to understand the design.

## Failure and Recovery Behavior

Explain consequential failures, fallback behavior, recovery, retry or rollback,
and ownership. If none is relevant, state why.

## Essential Vocabulary

Use a compact table:

| Term | Meaning in this design | Relationship to confusing term | Evidence |
| --- | --- | --- | --- |

Expand unfamiliar abbreviations on first use. Preserve exact product and
domain names. Never invent an expansion. If no authoritative expansion is
available, preserve the abbreviation and classify its expansion as `Open`.
Classify confusing terms as aliases, related concepts, deprecated names, or
non-equivalent terms. Do not assert equivalence without evidence.

## Settled Decisions

List decisions that materially shape the design and the reason for each. Do not
repeat routine implementation detail.

## Open Risks and Questions

Separate:

- accepted risks;
- unresolved design questions;
- inferred behavior that still needs confirmation;
- evidence conflicts.

Do not hide uncertainty to make the explanation feel simpler.

## Evidence and Confidence

List material claims with their `Confirmed`, `Inferred`, or `Open` status and
compact source references. Keep evidence conflicts visible in any independently
consumed artifact.

## Content-Quality Gate

Before showing a synthesis or final artifact:

1. Verify every technical claim against the evidence packet or a recorded
   decision.
2. Preserve exact identifiers, commands, values, qualifiers, and domain terms.
3. Confirm the explanation fits the audience contract and intended use.
4. Confirm purpose precedes mechanics and each conceptual layer builds on the
   previous layer.
5. Check for ambiguous pronouns, hidden actors, undefined conditions, missing
   units, overloaded terms, and unobservable outcomes.
6. Check that prerequisites and warnings appear before governed actions.
7. Distinguish confirmed, inferred, and open claims.
8. Confirm analogies follow literal behavior and state their limits.
9. Reconcile all STE Coach Blockers and explain any rejected Improvement.
10. Verify the artifact does not claim ASD-STE100 conformance.
11. Favor direct sentences and explicit causal, conditional, and contrast
    relationships without removing meaning-preserving qualifications.
12. Confirm all independently consumed abbreviations have verified expansions
    or remain explicitly `Open`.

If the gate fails, revise or ask one focused question. Do not publish a
success-shaped explanation.

## Writing Gate

Return the explanation in conversation by default.

When the user explicitly requests a file:

1. Discover repository documentation conventions and the intended path.
2. Reuse or update an existing artifact when it has the same identity and
   purpose.
3. Perform the write through
   [Approved and verified write](../../_base/_molecules/write-approved.md),
   supplying `approval-phrase` `Approve and write`, the resolved destination,
   the complete explanation as `content`, whether the action creates or
   updates, and the content-quality gate as a `post-check`.

The molecule owns the preview, the approval, the stale-approval rule, the
verified write, and the restore. Do not restate any of it here.

Do not create a documentation file merely because a prior skill produced one.
