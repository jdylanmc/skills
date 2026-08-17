# Issue Tracker: Azure DevOps

Issues and specifications for this repository live as Azure Boards work items. Prefer configured Azure DevOps tools; use the Azure DevOps CLI extension when command-line access is required.

## Configuration

- Provider: Azure DevOps
- Organization: `<organization-url>`
- Project: `<project-name-or-id>`
- Repository: `<repository-name-or-id>`
- Client: configured Azure DevOps integration or `az boards`
- Default issue work-item type: `<process-specific-type>`
- Discovery map work-item type: `<process-specific-type>`
- Discovery ticket work-item type: `<process-specific-type>`
- Terminal state: `<process-specific-state>`
- Pull requests as request surface: no

Configure CLI defaults when useful:

```bash
az devops configure --defaults organization=https://dev.azure.com/ORGANIZATION project=PROJECT
```

Azure DevOps Services can infer organization settings from Git configuration in some cases, but project, work-item types, required fields, and terminal states remain process-specific. Never guess them.

## Work-Item Operations

- **Create:** `az boards work-item create --title "TITLE" --type "TYPE" --description "BODY"` with organization, project, area, iteration, assignment, and required fields as needed.
- **Read:** `az boards work-item show --id ID --expand relations`.
- **Query:** `az boards query --wiql "SELECT ... FROM WorkItems WHERE ..."` or run an existing query by ID or path.
- **Comment:** `az boards work-item update --id ID --discussion "COMMENT"`.
- **Update:** `az boards work-item update --id ID --title "TITLE" --description "BODY" --state "STATE"` and use `--fields` for process-specific fields.
- **Tags:** Read `System.Tags`, merge changes, and update the complete value without dropping unrelated tags. Prefer an integration that supports additive tag updates.
- **Assign:** `az boards work-item update --id ID --assigned-to "IDENTITY"`.
- **Close:** Add a resolution discussion entry, update to the configured terminal state, then reread the work item.
- **Relate:** `az boards work-item relation add --id ID --relation-type TYPE --target-id TARGET_ID`.

Azure DevOps CLI commands apply to Azure DevOps Services, not Azure DevOps Server.

## Pull Requests as a Request Surface

The configuration flag is `no`. A user may change it later.

When enabled, use Azure Repos pull-request operations, link relevant work items, and apply the configured external-author policy. Do not treat every open pull request as a triage request.

## Skill Semantics

- **Publish to the issue tracker:** Create a work item of the configured issue type.
- **Fetch the relevant ticket:** Retrieve the work item, comments or discussion, tags, fields, and relations.

## Discovery Operations

- **Map:** A work item of the configured map type tagged `discovery:map`.
- **Child:** A work item of the configured ticket type linked to the map with a Parent/Child relation and tagged with one of `discovery:research`, `discovery:prototype`, `discovery:interrogate`, or `discovery:task`.
- **Blocking:** Use the project's supported Predecessor/Successor relation. A blocked ticket points to its blocker through the appropriate predecessor relationship.
- **Frontier:** Query open Discovery children, then hydrate relations, current state, and `System.AssignedTo`; keep only unblocked and unassigned tickets in map order.
- **Claim:** Update `System.AssignedTo` to the acting identity after refreshing the ticket.
- **Resolve:** Add a discussion entry, move to the configured terminal state, verify closure, then surgically update the map description's `Decisions so far` section.

Preserve unrelated tags, fields, relations, and map-description sections. Human-facing prose uses linked work-item titles rather than bare IDs.

Follow the shared Discovery map, ticket, fog, scope, naming, claim, and resolution rules.
