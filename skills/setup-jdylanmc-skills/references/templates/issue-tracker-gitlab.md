# Issue Tracker: GitLab

Issues and specifications for this repository live in GitLab Issues. Use `glab` when it supports the required operation and the GitLab API or configured integration otherwise.

## Configuration

- Provider: GitLab
- Client: `glab`
- Project: infer from the working tree's Git remote
- Pull requests as request surface: no

Confirm conflicting remotes before mutation.

## Issue Operations

Use the supported `glab issue` commands to create, view, list, comment on, update, label, assign, and close issues. Use structured API calls when the installed CLI lacks a required hierarchy, dependency, or filtering operation. Do not invent unsupported flags.

## Pull Requests as a Request Surface

GitLab calls pull requests merge requests. The configuration flag is `no`. When enabled, use merge-request operations and the configured external-author policy.

## Skill Semantics

- **Publish to the issue tracker:** Create a GitLab issue.
- **Fetch the relevant ticket:** Read the issue, notes, labels, assignment, state, and relationships.

## Discovery Operations

- **Map:** A GitLab issue labelled `discovery:map`.
- **Child:** Use verified native child or hierarchy support; otherwise use a documented parent reference. Apply one type label: `discovery:research`, `discovery:prototype`, `discovery:interrogate`, or `discovery:task`.
- **Blocking:** Prefer native blocking relationships and fall back to `Blocked by:` metadata only when necessary.
- **Frontier:** Find open children, exclude those with open blockers, and exclude assigned tickets.
- **Claim:** Assign the issue to the acting identity.
- **Resolve:** Add a resolution note, close the issue, verify closure, and update only the map's `Decisions so far` section.

Follow the shared Discovery map, ticket, fog, scope, naming, claim, and resolution rules.
