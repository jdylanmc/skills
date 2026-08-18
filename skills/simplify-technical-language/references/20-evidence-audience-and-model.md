# Evidence, Audience, and Mental Model

## Evidence Packet

Gather the smallest sufficient evidence set:

1. the most recent upstream workflow artifact;
2. confirmed decisions and accepted risks;
3. canonical domain vocabulary;
4. relevant diagrams, interfaces, data contracts, and source files;
5. current code or configuration when it proves actual behavior;
6. citations or links needed to distinguish evidence from interpretation.

Record an evidence ledger for every material source:

| Source | Type | Governing authority | Scope | Recency | Conflict status |
| --- | --- | --- | --- | --- | --- |

Prefer explicit current decisions and authoritative contracts for intended
behavior. Use current code and configuration for observed behavior. Treat
diagrams, comments, meeting notes, and conversation statements as supporting
evidence unless the repository identifies them as governing. When intended and
observed behavior differ, preserve both and surface the conflict.

Inspect quick, read-only evidence before asking the user. If evidence conflicts
with a prior decision or statement, show the exact conflict and request
resolution. Classify each material claim as:

- `Confirmed` — supported by governing evidence within its recorded scope or
  by an explicit current decision;
- `Inferred` — the best explanation supported by available evidence;
- `Open` — unresolved and material to understanding.

Do not present an inference as a confirmed design fact.

## Audience Contract

Determine:

- who will read the explanation;
- what they already know;
- which domain terms they must learn rather than avoid;
- what decision, review, implementation, or operation the explanation supports;
- how independently the output will be consumed.

Default to the current user and their technical collaborators when the audience
does not materially change wording or detail. Ask one audience question when a
different reader would need a materially different mental model.

Name one primary audience, its assumed knowledge, intended action, and
independent-consumption level. When a secondary audience needs different
prerequisites, terminology depth, or warnings, add a named layer rather than
flattening both audiences into one explanation.

## Minimum Accurate Mental Model

Build the explanation around:

1. **Purpose** — the outcome the design enables.
2. **Boundary** — what is inside and outside the design.
3. **Actors** — people, systems, or services that initiate or own behavior.
4. **Components** — the few parts required to explain the behavior.
5. **Flow** — the ordered movement of requests, events, control, or data.
6. **State and lifecycle** — meaningful states and transitions.
7. **Dependencies** — prerequisites and external contracts.
8. **Failure behavior** — important failure, fallback, recovery, and ownership.
9. **Vocabulary** — exact terms needed to discuss the design consistently.

Include only dimensions that matter to the topic. Never omit a consequential
dimension solely to make the explanation shorter.

## Simplification Rules

- Lead with purpose before mechanics.
- Introduce one conceptual layer at a time.
- Use one stable term per concept within the same audience context.
- Define unfamiliar technical terms; do not replace them with inaccurate
  analogies.
- Preserve exact identifiers, commands, API names, schema fields, and units.
- Use examples and analogies only after stating the literal behavior.
- Label where an analogy stops matching the real design.
- Keep causes, actions, results, and failure behavior explicitly connected.
- Distinguish required behavior from examples, options, and implementation
  details.
