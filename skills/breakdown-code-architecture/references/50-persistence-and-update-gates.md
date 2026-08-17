# Persistence and Update Gates

## Default: Conversation Only

Return the complete architecture map in the conversation. Do not create scratch files, documentation, diagrams, or repository changes unless the user explicitly asks to save or update the map.

## Save Mode

When persistence is requested:

1. Determine whether the repository already defines an architecture-document location or naming convention.
2. Prefer an existing relevant document when the request is to refresh or extend it.
3. Otherwise propose `docs/architecture/<target-slug>.md`.
4. Preserve unrelated sections and user-authored notes in an existing document.
5. Present:
   - the exact destination path;
   - whether the action creates or updates;
   - the complete proposed document or a precise section-level diff;
   - any uncertain statements that will remain marked as unknown.
6. Wait for the exact approval phrase `Approve and write`.
7. Re-read the destination immediately before editing.
8. Abort and report the conflict if it changed materially after the preview.
9. Write only the approved content.
10. Re-read the result and verify all evidence links or relative paths.

Approval is scoped to the displayed path and content. A request to inspect, map, document, or explain architecture is not by itself approval to write files unless it explicitly asks for persistence.

## Idempotency

- If the approved document already matches the proposed map, make no edit and report that it is current.
- If an existing map contains stale evidence, update only the affected claims and evidence index.
- Do not duplicate sections, append repeated maps, or replace a broader architecture document with a narrower one.
- Keep unknowns explicit rather than deleting them merely because they remain unresolved.

## Sensitive Material

Do not surface in the conversation or persist secrets, credentials, personal data, internal tokens, or sensitive configuration values discovered during exploration. Name the configuration mechanism, key, and evidence path without reproducing sensitive contents.
