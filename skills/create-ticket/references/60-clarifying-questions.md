# Clarifying Questions

## Default: Do Not Ask

Most input is usable as-is once split, classified, and reconciled with unresolved metadata where facts are missing. Producing an honest draft payload plus unresolved metadata is preferred over interrupting the caller.

## When a Question Is Required

Ask only when a usable payload genuinely cannot be safely formed without it, meaning at least one of:

- the issue cannot be classified as a defect, feature, task, or question at all (the input is too vague to tell what is even being asked for);
- splitting is ambiguous enough that guessing wrong would silently merge or fragment unrelated work in a way unresolved metadata cannot capture;
- the caller asked for a specific target format (for example a Discovery question) but gave content that does not fit that shape, and no reasonable default resolves it;
- a stated fact directly contradicts another stated fact for the same issue, and proceeding would require silently picking one.

A missing reproduction step, missing acceptance detail, or missing severity is **not** by itself a reason to ask; return unresolved metadata instead.

## Question Discipline

When a question is required:

- ask the minimum number of focused questions needed to unblock the specific payload, not a general interview;
- ask about one issue at a time when multiple issues are in flight, and still return payloads for the issues that are already usable;
- state plainly why the payload cannot be formed without the answer;
- never turn this into open-ended requirements gathering; that is `/interrogate`'s job, not this skill's.

## After the Answer

Incorporate the answer as a stated fact, reclassify or re-split if the answer changes the shape of the issue, and produce the payload. Do not re-ask about anything already resolved.
