---
includes: ["_base/_atoms/approval-gate-mutation.md"]
requires-skills: []
---

# Preview, Write, and Rerun Policy

## Required References

1. [Approval gate for a mutation](../../_base/_atoms/approval-gate-mutation.md)

## Exact Preview

Before writing, show:

1. the complete proposed `## Agent skills` block;
2. the complete proposed contents of every new `docs/agents/` file;
3. exact merged results for every existing file;
4. user-authored additions that will be preserved;
5. unresolved conflicts;
6. files categorized as create, modify, unchanged, and skipped.

When updating an existing `## Agent skills` section, replace only that section. Preserve every surrounding section exactly.

When an existing `docs/agents/` file contains compatible additions, merge them into the preview. If ownership or intended replacement is unclear, stop and ask instead of resetting the file to its seed.

## Approval Gate

Gate every write through the approval-gate-mutation atom named above, with
`approval-phrase` `Approve and write` and the exact preview from
`## Exact Preview` as the preview content. The atom owns the offer, the rule
that a general acknowledgement is not approval, the stale-approval rule, and
the repeat-until-approved-or-cancelled loop.

`scope` is exactly the files named in the preview. An approval never authorizes
an adjacent file.

## Writing

After approval:

1. create `docs/agents/` only if the approved preview requires it;
2. render the selected tracker template to `docs/agents/issue-tracker.md`;
3. render the selected domain template to `docs/agents/domain.md`;
4. render or update `docs/agents/triage-labels.md`;
5. apply only the previewed changes;
6. update an existing `## Agent skills` section in place rather than appending a duplicate;
7. preserve surrounding and unrelated content;
8. reread every changed file;
9. compare the result with the approved preview;
10. stop and report any mismatch or write failure.

Do not create tracker labels, tags, work items, pull requests, context files, Architecture Decision Records, or Discovery artifacts.

## Reruns

Existing configuration is evidence, not disposable generated output.

On rerun:

- preserve compatible user additions;
- recommend the existing provider and layout when still consistent;
- preview migrations when switching trackers or domain layouts;
- surface conflicts before replacement;
- avoid duplicating instruction blocks or documentation sections.

After completion, tell the user that `docs/agents/*.md` may be edited directly. Rerunning is mainly useful when changing providers, changing domain layout, or intentionally rebuilding the configuration.
