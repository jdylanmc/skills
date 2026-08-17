# Tracker Contract

## Required Repository Guidance

Read `docs/agents/issue-tracker.md` before any tracker operation. It defines how this repository represents:

- maps and child tickets;
- labels, tags, or metadata;
- parent-child relationships;
- dependencies;
- frontier queries;
- assignment and claims;
- discussion and resolution;
- closure;
- surgical map-body updates.

Discovery provides intent and content. The tracker document provides provider mechanics.

Never edit `docs/agents/issue-tracker.md` from Discovery.

## Missing Guidance

When the file is absent:

1. direct the user to `/setup-jdylanmc-skills`;
2. do not invent remote provider behavior;
3. if setup cannot run and no remote tracker is required, offer an explicit local-only Markdown fallback;
4. proceed locally only after the user confirms.

## Local-only Markdown

Preserve the same semantics under `.scratch/<feature>/`:

- map: `map.md`;
- child tickets: `tickets/<stable-id>.md`;
- identity: stable local metadata plus relative links;
- hierarchy: `parent`;
- dependencies: `blocked_by`;
- claim: `assigned_to` plus `claimed_at`;
- close: Resolution content, `status: closed`, and `closed_at`;
- map update: relative linked title and one-line gist.

Reread every affected local file immediately before mutation because no server-side locking exists.

Do not fabricate remote URLs, issue numbers, provider commands, or server capabilities.
