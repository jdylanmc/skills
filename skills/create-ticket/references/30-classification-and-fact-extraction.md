---
includes: []
requires-skills: []
---
# Classification and Fact Extraction

## Kinds

Classify every split issue into exactly one kind:

| Kind | Signal |
| --- | --- |
| `defect` | Something that exists today behaves differently from its stated or reasonably assumed correct behavior. |
| `feature` | Something that does not exist today is being requested. |
| `task` | Prerequisite or mechanical work with no independent user-observable behavior of its own. |
| `question` | A decision or investigation is needed before either kind above can be written; route to the Discovery one-question model instead of guessing a kind. |

`defect` and `feature` are the required minimum; classify beyond them only when the input clearly demands `task` or `question` instead of forcing a false defect or feature framing.

When a single statement mixes a defect and a follow-on feature request ("this is broken, and also it should also do X"), split it per the issue-splitting rule and classify each half independently.

## Fact Extraction

For every issue, extract only what is stated or directly, unambiguously implied:

- **Observed behavior** — what currently happens (defect) or what is missing (feature).
- **Expected behavior** — what should happen instead, only if stated.
- **Reproduction context** — steps, environment, data, or trigger, only if stated.
- **Impact** — who or what is affected, only if stated.
- **Constraints** — anything the user ruled in or out.

Do not infer severity, priority, root cause, affected component, or a fix approach. Those require investigation or triage that this skill does not perform.

## Emotional Filler Removal

Strip without altering meaning:

- profanity, sarcasm, and blame language;
- rhetorical questions that carry no new fact ("how is this still broken?!");
- redundant escalation ("this is the third time I'm reporting this") once logged as a single impact fact, if useful, otherwise dropped;
- filler transitions ("so anyway", "like I said", "not to be dramatic but").

Preserve, even if bluntly phrased:

- the specific trigger, input, or action;
- the specific observed versus expected difference;
- any stated frequency, scope, or severity claim ("happens every time", "blocks all users") — keep it as a stated fact, not as adopted priority.

## Succinctness

Keep every extracted line to the shortest phrasing that preserves the fact. Do not pad a ticket with restated context, disclaimers, or throat-clearing. A ticket that says less but loses nothing is preferred over a longer one.
