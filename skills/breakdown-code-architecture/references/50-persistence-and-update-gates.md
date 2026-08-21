---
includes: ["_base/_molecules/write-approved.md"]
requires-skills: []
---

# Persistence and Update Gates

## Required References

1. [Approved and verified write](../../_base/_molecules/write-approved.md)

## Default: Conversation Only

Return the complete architecture map in the conversation. Do not create scratch files, documentation, diagrams, or repository changes unless the user explicitly asks to save or update the map.

## Save Mode

When persistence is requested:

1. Determine whether the repository already defines an architecture-document location or naming convention.
2. Prefer an existing relevant document when the request is to refresh or extend it.
3. Otherwise propose `docs/architecture/<target-slug>.md`.
4. Preserve unrelated sections and user-authored notes in an existing document.
5. Perform the write through the write-approved molecule named above, supplying
   `approval-phrase` `Approve and write`, the resolved destination, whether the
   action creates or updates, the complete proposed document or a precise
   section-level diff as `content`, any statements that will remain marked as
   unknown as `uncertainties`, and resolution of every evidence link and
   relative path as a `post-check`.

The molecule owns the preview, the approval, the re-read before writing, the
abort when the destination changed after the preview, the verification, and the
restore. Do not restate any of it here.

## Idempotency

- If the approved document already matches the proposed map, make no edit and report that it is current.
- If an existing map contains stale evidence, update only the affected claims and evidence index.
- Do not duplicate sections, append repeated maps, or replace a broader architecture document with a narrower one.
- Keep unknowns explicit rather than deleting them merely because they remain unresolved.

## Sensitive Material

Do not surface in the conversation or persist secrets, credentials, personal data, internal tokens, or sensitive configuration values discovered during exploration. Name the configuration mechanism, key, and evidence path without reproducing sensitive contents.
