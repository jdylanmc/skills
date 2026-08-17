---
name: setup-jdylanmc-skills
description: Configures a consumer repository for jdylanmc engineering skills by discovering existing conventions, interviewing the user about unresolved choices, previewing exact edits, and writing only after explicit approval. Invoke when asked to initialize, set up, configure, or refresh jdylanmc skill guidance in a repository.
allowed-tools: ["read", "search", "execute", "edit"]
---

# Setup jdylanmc Skills

Scaffold the per-repository configuration used by jdylanmc engineering skills. This is a prompt-driven setup workflow, not a deterministic script.

Explore first, explain the evidence, ask only unresolved questions, preview exact changes, obtain explicit approval, and then write.

## Required References

Read and follow these files in order:

1. [Discovery and evidence](./references/10-discovery-and-evidence.md)
2. [Sequential interview](./references/20-sequential-interview.md)
3. [Preview, writing, and rerun policy](./references/30-preview-write-and-rerun-policy.md)
4. [Output formats and error handling](./references/40-output-formats-and-error-handling.md)
5. [Shared Discovery tracker semantics](./references/templates/discovery-operations-common.md)

Use the applicable seed templates:

- [Template rendering guide](./references/templates/README.md)
- [GitHub issue tracker](./references/templates/issue-tracker-github.md)
- [GitLab issue tracker](./references/templates/issue-tracker-gitlab.md)
- [Azure DevOps issue tracker](./references/templates/issue-tracker-azure-devops.md)
- [Local Markdown issue tracker](./references/templates/issue-tracker-local.md)
- [Triage labels](./references/templates/triage-labels.md)
- [Agent skills instruction block](./references/templates/agent-skills-section.md)
- [Single-context domain guidance](./references/templates/domain-single-context.md)
- [Multi-context domain guidance](./references/templates/domain-multi-context.md)

## Core Workflow

1. Explore the repository without modifying it.
2. Present findings, missing evidence, and conflicts.
3. Configure the issue tracker, triage labels when applicable, and domain-document layout in that order.
4. Select the existing instruction file according to the repository rules.
5. Preview the complete proposed contents and exact merges.
6. Accept only an explicit `Approve and write` before editing.
7. Create the approved `docs/agents/*.md` outputs and update the selected instruction file in the same write phase.
8. Reread the results and report the resulting configuration.

Constraint: Do not create tracker items, labels, tags, context files, Architecture Decision Records, or Discovery maps during setup. Configure how other skills consume those systems; do not execute those workflows.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
