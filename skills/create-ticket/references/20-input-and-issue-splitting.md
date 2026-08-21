---
includes: []
requires-skills: []
---
# Input Parsing and Issue Splitting

## Accepted Input

- the current conversation;
- a pasted chat log, email thread, or voice-to-text transcript;
- an existing rough draft ticket to tighten;
- caller-supplied structured context: target format, parent, known blockers, verification seam, and any facts already confirmed elsewhere (for example by `/interrogate`).

## Splitting Rule

Split by distinct, independently observable outcome, never by sentence, paragraph, or speaker turn.

Two statements describe the **same** issue when the second is elaboration, a repeated complaint, or additional evidence for the first observable outcome.

Two statements describe **different** issues when:

- they name different symptoms with no stated causal link;
- one describes something broken and the other describes something that does not exist yet;
- fixing one would not resolve or touch the other;
- they would need separate acceptance criteria to verify independently.

When two statements might be linked but the link is not stated, keep them as separate tickets and do not assert a dependency that was not said.

## Merging Guard

Do not merge distinct issues into one ticket to reduce output count, and do not split one issue into multiple tickets to pad it. Both distort the backlog the caller will preview.

## Noise to Discard During Splitting

- greetings, sign-offs, and pleasantries;
- meta-commentary about the conversation itself;
- venting, blame, and sarcasm that carries no new fact;
- exact repetition of a fact already captured.

## Ambiguous Boundaries

If it is genuinely unclear whether two statements are one issue or two, keep them separate and return the uncertainty as unresolved metadata rather than guessing a merge. Splitting too finely is recoverable by the caller; silently merging is not.
