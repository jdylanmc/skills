---
includes: []
requires-skills: []
---
# Sequential Interview

Take sections in order. Ask one question, wait for its answer, then continue. Put the recommended answer first and explain only choices that materially branch.

Skip a section when exploration already settles it according to the rules below.

## Section A: Issue Tracker

The issue tracker is where engineering skills publish and retrieve work for this repository.

Default posture:

- GitHub is the normal default for jdylanmc skills.
- Recommend Azure DevOps when the repository remote identifies an Azure DevOps organization and project.
- Recommend Local-only Markdown when no remote tracker exists.
- Recommend GitLab only when detected or explicitly requested.

Recommend the provider inferred from the primary remote:

- GitHub remote: GitHub;
- GitLab remote: GitLab;
- Azure DevOps remote: Azure DevOps;
- no recognized remote or no remote: Local Markdown;
- conflicting remotes: no inferred provider.

Offer:

1. The recommended inferred provider, when available.
2. **GitHub** - issues through `gh`.
3. **Azure DevOps** - Azure Boards work items through configured Azure DevOps tools or `az boards`.
4. **GitLab** - issues through `glab`.
5. **Local-only Markdown** - all issues, specifications, and Discovery maps remain under `.scratch/<feature>/`; no remote tracker is used.
6. **Other** - a user-described workflow.

For Other, ask for one paragraph covering the system, normal create/read/update/close flow, identifiers, state transitions, and tools.

For Azure DevOps, record the organization and project. Infer them from the remote or configured defaults when possible; otherwise ask. Discover work-item types and terminal states when tools permit. If they remain process-specific and unknown, use explicit placeholders in the preview and resolve them before writing.

Use the matching tracker seed to draft `docs/agents/issue-tracker.md`.

GitHub, GitLab, and Azure DevOps templates include a pull-requests-as-request-surface flag defaulted to `no`. Do not raise that flag as a setup question.

When Local-only Markdown is selected:

- do not require or configure a remote tracker;
- use repository-local stable identities and relative links;
- store ordinary issues, specifications, Discovery maps, and child tickets under `.scratch/`;
- record relationships, assignment, dependencies, state, and resolution in Markdown metadata;
- state clearly in the preview that every tracker operation is local file work.

## Section B: Triage Labels

Always configure the repository's canonical triage vocabulary because publishing and breakdown skills consume it even when a standalone `/triage` skill is not installed.

Ask exactly:

> Keep the recommended default triage labels? (Recommended: Yes)

The canonical roles and default strings are:

- `needs-triage` -> `needs-triage`;
- `needs-info` -> `needs-info`;
- `ready-for-agent` -> `ready-for-agent`;
- `ready-for-human` -> `ready-for-human`;
- `wontfix` -> `wontfix`.

On Yes, use the defaults without further questions.

Only on No, collect the desired override for each changed role. Preserve unchanged defaults and explain that existing tracker vocabulary should be reused to avoid duplicates.

Draft `docs/agents/triage-labels.md` on every setup run. Preserve compatible existing mappings and preview any changes.

## Section C: Domain Documentation

Without genuine monorepo evidence, select single-context automatically and explain the choice:

- root `CONTEXT.md`;
- root `docs/adr/`.

Do not ask the user to confirm the default.

When genuine monorepo evidence exists:

1. inspect package and domain boundaries;
2. recommend single-context or multi-context;
3. ask the user which layout to use.

Multi-context means:

- root `CONTEXT-MAP.md`;
- context-local `CONTEXT.md` files;
- context-local Architecture Decision Record directories listed in the map.

Selecting a layout configures consumer rules only. Do not create domain artifacts during setup.

## Instruction Target

Apply the selection rule from discovery. Ask which file to create only when neither `CLAUDE.md` nor `AGENTS.md` exists.
