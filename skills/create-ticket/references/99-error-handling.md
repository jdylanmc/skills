# Error Handling

- **Input too vague to classify:** Ask one focused question about what is broken or wanted rather than guessing a kind.
- **Input too vague to split:** Keep it as one issue, note the ambiguity, and let the caller split it further if wrong.
- **Contradictory facts about the same issue:** Ask one focused question to resolve the contradiction rather than silently choosing one version.
- **No stated reproduction, expected behavior, or definition of done:** Return explicit unresolved metadata outside the payload; do not fabricate an acceptance criterion.
- **Caller requests a shape this skill does not support:** State that only the remote tracker body and the Discovery one-question shape are available, and default to the remote tracker body unless told otherwise.
- **Caller asks this skill to publish, comment on, label, or close a tracker item:** Decline; state that publishing is the caller's responsibility.
- **Caller asks this skill to investigate root cause, explore code, or research the implementation:** Decline; state that this skill formats only, and suggest the caller use a research or investigation skill first.
- **Caller asks this skill to execute or implement a ticket:** Decline; restate the formatting-only boundary.
- **Referenced file or artifact cannot be read:** Proceed from the available conversational text and disclose that the reference could not be read.
- **Multiple issues, one blocked on a missing fact:** Return payloads for the issues that are usable and ask only about the one that is not.
