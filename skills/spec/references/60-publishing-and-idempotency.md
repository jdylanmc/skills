---
includes: ["_base/_atoms/approval-gate-mutation.md"]
requires-skills: []
---

# Publishing and Idempotency

## Required References

1. [Approval gate for a mutation](../../_base/_atoms/approval-gate-mutation.md)

## Publish Approval

Gate publication through
[Approval gate for a mutation](../../_base/_atoms/approval-gate-mutation.md)
with `approval-phrase` `Approve and publish`. The atom owns the offer, the
explicit-approval rule, and the stale-approval rule.

This skill supplies the preview:

- create versus update target;
- the complete seven-section specification;
- confirmed testing seams;
- linked Discovery sources;
- the configured label mapped from `ready-for-agent`;
- the exact local path when using local-only Markdown.

The `scope` is exactly one specification at the previewed target.

## Duplicate Detection

Search before creating:

- remote: normalized title plus linked Discovery map or source;
- local: `kind: spec` under the configured effort's `specs/` directory.

Update an existing specification instead of creating a duplicate.

Preserve discussion and unrelated content through read-modify-write. Refresh immediately before writing and reconcile concurrent changes.

## Labeling

Read the repository mapping for canonical `ready-for-agent` and apply that single configured label or tag.

Do not add other triage-state labels or run general triage.

## Discovery Links

Always link the source map and decision tickets from the spec.

Do not modify Discovery artifacts. A backlink from Discovery requires a separate, explicitly approved Discovery workflow.

## Verification

After publishing:

1. reread the item;
2. verify all seven sections;
3. verify the mapped label;
4. verify source links;
5. report the canonical linked title, URL, or local path.

Do not claim success after a mismatch.
