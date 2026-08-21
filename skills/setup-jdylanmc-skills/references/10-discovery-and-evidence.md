---
includes: []
requires-skills: []
---
# Discovery and Evidence

Inspect the consumer repository before recommending configuration. Do not write during this phase.

## Repository Identity

Run `git remote -v` and inspect `.git/config`.

Determine:

- whether the directory is a Git repository;
- which remotes exist and whether fetch and push targets differ;
- whether the primary remote points to GitHub, GitLab, Azure DevOps, another host, or no recognized tracker;
- the inferred organization, project, and repository when the remote exposes them.

Recognize Azure DevOps remotes on `dev.azure.com` and legacy `visualstudio.com` hosts.

Treat conflicting remotes as ambiguous. Present the evidence instead of silently choosing.

## Repository Instructions

Read root `CLAUDE.md` and `AGENTS.md` when present.

Inspect:

- whether either file contains `## Agent skills`;
- the contents and boundaries of that section;
- surrounding user-authored instructions that must remain untouched.

The target selection rule is deterministic:

1. Use `CLAUDE.md` when it exists.
2. Otherwise use `AGENTS.md` when it exists.
3. If neither exists, ask which one to create.

Never create the other instruction file when one already exists.

## Domain Artifacts

Inspect:

- root `CONTEXT.md`;
- root `CONTEXT-MAP.md`;
- root `docs/adr/`;
- context-local `src/*/docs/adr/` directories;
- context-local `CONTEXT.md` files referenced by an existing map.

Record contradictions such as both root context files existing without clear roles.

## Prior Setup

Inspect `docs/agents/` and read any existing:

- `issue-tracker.md`;
- `triage-labels.md`;
- `domain.md`;
- related user-authored files.

Identify compatible prior configuration, additions to preserve, and conflicts requiring review. Do not assume every existing section is generated.

## Local Tracker Evidence

Inspect `.scratch/` and repository instructions for an established local-Markdown issue convention. Do not create `.scratch/` during exploration.

## Triage Vocabulary

Inspect `docs/agents/triage-labels.md` when it exists and record:

- the configured string for each canonical role;
- custom vocabulary that must be preserved;
- missing roles or conflicting mappings.

The vocabulary is repository configuration used by multiple engineering skills. Configure it whether or not a standalone `/triage` skill is installed.

## Monorepo Evidence

Treat the repository as a monorepo candidate only when at least one strong signal exists:

- `pnpm-workspace.yaml`;
- a `workspaces` declaration in `package.json`;
- one or more populated `packages/*` directories containing their own `src/`.

Multiple folders or services alone do not prove multiple domain contexts. Record the signal and then inspect domain boundaries before recommending a layout.

## Findings Report

Before asking configuration questions, summarize:

- repository and remote identity;
- inferred tracker, if any;
- selected instruction file or missing-file choice;
- existing `## Agent skills` content;
- domain and Architecture Decision Record layout;
- prior `docs/agents/` output;
- `.scratch/` convention;
- existing triage-label vocabulary;
- monorepo evidence;
- missing, contradictory, or inconclusive evidence.
