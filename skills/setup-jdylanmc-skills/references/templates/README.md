# Template Rendering Guide

These files are seed content used by `setup-jdylanmc-skills`. They are not links to configuration files inside this common skills library.

The skill runs against a separate consumer repository. After exploration, user choices, preview, and explicit approval, it renders the selected templates into that repository.

## Output Mapping

| Seed in this skill package | Output in the consumer repository |
| --- | --- |
| `agent-skills-section.md` | Inserted into the selected root `CLAUDE.md` or `AGENTS.md` |
| `issue-tracker-github.md` | `docs/agents/issue-tracker.md` when GitHub is selected |
| `issue-tracker-gitlab.md` | `docs/agents/issue-tracker.md` when GitLab is selected |
| `issue-tracker-azure-devops.md` | `docs/agents/issue-tracker.md` when Azure DevOps is selected |
| `issue-tracker-local.md` | `docs/agents/issue-tracker.md` when Local-only Markdown is selected |
| `triage-labels.md` | `docs/agents/triage-labels.md` |
| `domain-single-context.md` | `docs/agents/domain.md` when single-context is selected |
| `domain-multi-context.md` | `docs/agents/domain.md` when multi-context is selected |
| `discovery-operations-common.md` | Shared rules incorporated into the selected issue-tracker output |

The `docs/agents/...` paths referenced by `agent-skills-section.md` are created during the same approved write. They are intentionally absent from this library because they contain repository-specific configuration.

Do not copy every template into a consumer repository. Render the selected provider, the selected domain layout, and the triage vocabulary.
