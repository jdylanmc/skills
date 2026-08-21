---
name: simplify-technical-language
description: Builds shared understanding from an existing technical design, architecture artifact, specification, or sufficiently settled design conversation through evidence-grounded clarification, layered explanation, and repeated Simplified Technical English guardrail reviews. Invoke when readers need an accurate mental model of an established design. Do not invoke to discover architecture, resolve design or vocabulary decisions, produce a specification, implement changes, or copyedit prose.
allowed-tools: ["read", "search", "edit", "task"]
includes: ["_base/_molecules/review-ste-coach/review-ste-coach.md","_base/_molecules/write-approved/write-approved.md","simplify-technical-language/references/10-role-composition-and-boundaries.md","simplify-technical-language/references/20-evidence-audience-and-model.md","simplify-technical-language/references/30-rounds-and-ste-review.md","simplify-technical-language/references/40-output-and-writing-gate.md","simplify-technical-language/references/50-safeguards-and-scenarios.md"]
---

# Simplify Technical Language

Turn an established or emerging technical design into an accurate mental model
that its intended readers can understand and use. Start from prior workflow
artifacts and repository evidence, clarify only material gaps, and simplify the
explanation without simplifying away the design.

Read and search provide evidence. Task invokes the Simplified Technical English
(STE) Coach as a read-only subagent. Edit is reserved for a repository-local
artifact that passes the explicit writing gate.

## Required References

Read and follow these files in order:

1. [Role, composition, and boundaries](./references/10-role-composition-and-boundaries.md)
2. [Evidence, audience, and mental model](./references/20-evidence-audience-and-model.md)
3. [Clarification and synthesis rounds](./references/30-rounds-and-ste-review.md)
4. [Layered output and writing gate](./references/40-output-and-writing-gate.md)
5. [Safeguards, errors, and scenarios](./references/50-safeguards-and-scenarios.md)
6. [Review with the Simplified Technical English Coach](../_base/_molecules/review-ste-coach/review-ste-coach.md)
7. [Approved and verified write](../_base/_molecules/write-approved/write-approved.md)

## Core Workflow

1. Gather the preceding architecture, discovery, specification, decision log,
   conversation, diagrams, and relevant repository evidence.
2. Separate settled design facts from unresolved decisions, assumptions, and
   source conflicts. Do not silently reopen settled decisions.
3. Identify the intended readers, their assumed knowledge, and the decision or
   action the explanation must support.
4. Build the smallest accurate mental model: purpose, boundaries, actors,
   components, information flow, dependencies, failure behavior, and key terms.
5. Ask one focused clarification at a time only when evidence cannot resolve a
   material gap or the target audience changes the explanation.
6. Produce a concise synthesis round, then invoke STE Coach as an adversarial
   subagent to test the skill's documentation guardrails against that round.
   Reconcile valid findings without changing technical meaning.
7. Show the revised understanding and ask for exact `Understanding confirmed`,
   or one correction. Repeat clarification, synthesis, and STE review until the
   user confirms or asks to stop.
8. Run one final STE Coach review, apply the content-quality gate, and return
   the unchanged reviewed candidate. Any substantive revision restarts final
   review. Write a repository-local file only after an explicit request and an
   exact preview.

## Composition Mode

When another skill supplies a canonical technical artifact, complete evidence
ledger, locked terms, target audience, output purpose, and traceability
requirements, run in `derived-summary` mode:

1. Treat the supplied canonical artifact as governing evidence.
2. Skip interactive clarification when the packet is complete.
3. Produce only the requested derived explanation.
4. Preserve locked identifiers, priorities, confidence, counts, and claims.
5. Run STE Coach execution monitoring and the content-quality gate.
6. Return the derived explanation and claim-to-source traceability to the
   calling skill.
7. Do not request `Understanding confirmed`, write files, or alter the canonical
   artifact.

If the packet is incomplete or contradictory, return an evidence gap to the
calling skill instead of asking the end user or inventing a resolution.

Constraint: Explain the design; do not redesign it. Never replace exact
identifiers, commands, API names, product names, or domain terms with invented
plain-language substitutes. Never claim ASD-STE100 conformance. Never commit,
publish, post, send, or update an external system.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
