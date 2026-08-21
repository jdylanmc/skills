---
includes: []
requires-skills: []
---
# Issue Tracker: Local-only Markdown

All issues, specifications, Discovery maps, and child tickets for this repository live as Markdown under `.scratch/`. No remote issue tracker is used.

## Configuration

- Provider: Local-only Markdown
- Remote tracker: none
- Root: `.scratch/<feature>/`
- Map file: `.scratch/<feature>/map.md`
- Ticket directory: `.scratch/<feature>/tickets/`
- Specification directory: `.scratch/<feature>/specs/`

Use the repository's existing local convention when one exists. Otherwise use stable lowercase identifiers that do not change when titles change.

## Directory Layout

```text
.scratch/
  <feature>/
    map.md
    tickets/
      <stable-ticket-id>.md
    specs/
      <spec-name>.md
```

Create only the files and directories needed by the current effort. A non-Discovery effort does not require `map.md`.

## Ticket Format

Use structured frontmatter so local files can support the same lifecycle as remote issues:

```markdown
---
id: <stable-ticket-id>
title: <human-readable title>
status: open
kind: issue
labels: []
parent:
blocked_by: []
assigned_to:
claimed_at:
created_at: <ISO-8601 timestamp>
closed_at:
---

# <Human-readable title>

## Description

<The issue, request, or specification question.>

## Discussion

<Timestamped notes when needed.>

## Resolution

<Filled when the ticket closes.>
```

Use `kind: spec` for specification records. Discovery tickets use their `discovery:<type>` value as the kind or as the single Discovery label, according to the repository convention.

## Issue Operations

- **Create:** Add a ticket or specification file with a stable identity and structured metadata.
- **Read:** Read the ticket and any linked resolution or context artifacts.
- **List:** Enumerate Markdown records and filter their metadata.
- **Comment:** Append a timestamped entry under `## Discussion`.
- **Label:** Update metadata without dropping unrelated values.
- **Assign:** Record acting identity and claim timestamp.
- **Close:** Fill `## Resolution`, set `status: closed`, and record `closed_at`.

All links between local records use relative Markdown links. Do not invent remote URLs, issue numbers, or provider commands.

## Skill Semantics

- **Publish to the issue tracker:** Create a Markdown ticket.
- **Fetch the relevant ticket:** Resolve its stable identity or relative path and read the full file.
- **Publish a specification:** Create a Markdown file under the effort's `specs/` directory and link it from related tickets.

## Discovery Operations

- **Map:** `map.md` with `kind: discovery:map` metadata and the standard map sections.
- **Child:** A ticket file with `parent: <map-id>` and one type value: `discovery:research`, `discovery:prototype`, `discovery:interrogate`, or `discovery:task`.
- **Blocking:** Structured `blocked_by` identities in ticket metadata.
- **Frontier:** Open child files with no open blocker and no assignee.
- **Claim:** Set assignee and claim timestamp before work.
- **Resolve:** Fill the ticket's Resolution section, set closed status and timestamp, then add a relative linked title and one-line gist to the map's `Decisions so far`.

Local metadata is the explicit fallback relationship model. Preserve stable identities across file renames.

Because every artifact is local, concurrent sessions must reread the map and ticket metadata immediately before claiming or updating a ticket.

Follow the shared Discovery map, ticket, fog, scope, naming, claim, and resolution rules.
