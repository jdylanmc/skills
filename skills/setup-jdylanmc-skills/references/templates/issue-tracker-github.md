# Issue Tracker: GitHub

Issues and specifications for this repository live in GitHub Issues. Use `gh` for tracker operations.

## Configuration

- Provider: GitHub
- Client: `gh`
- Repository: infer from the working tree's Git remote
- Pull requests as request surface: no

Let `gh` infer the repository inside a clone. Use `-R OWNER/REPO` only to resolve ambiguity, work outside the clone, or target another repository intentionally.

## Issue Operations

- **Create:** `gh issue create --title "TITLE" --body "BODY"`; use a heredoc for multiline bodies and add `--label` as needed.
- **Read:** `gh issue view NUMBER --comments`; request structured fields with `--json` and filter them with `--jq`.
- **List:** `gh issue list --state open --json number,title,body,labels,comments`; add label, state, assignee, author, or search filters as required.
- **Comment:** `gh issue comment NUMBER --body "COMMENT"`.
- **Add or remove labels:** `gh issue edit NUMBER --add-label "LABEL"` and `gh issue edit NUMBER --remove-label "LABEL"`.
- **Assign:** `gh issue edit NUMBER --add-assignee LOGIN`.
- **Close:** `gh issue close NUMBER --comment "RESOLUTION"`; when the installed client cannot comment while closing, comment first.

GitHub issues and pull requests share a number space. Resolve an ambiguous `#NUMBER` with `gh pr view NUMBER`, then fall back to `gh issue view NUMBER`.

## Pull Requests as a Request Surface

The configuration flag is `no`. A user may change it later.

When enabled:

- read with `gh pr view NUMBER --comments` and `gh pr diff NUMBER`;
- list open pull requests with author and association fields;
- keep only the configured external-author associations;
- comment, label, assign, or close with the corresponding `gh pr` commands.

## Skill Semantics

- **Publish to the issue tracker:** Create a GitHub issue.
- **Fetch the relevant ticket:** Read the referenced issue with comments, labels, and required structured fields.

## Discovery Operations

- **Map:** A GitHub issue labelled `discovery:map`.
- **Child:** A native sub-issue labelled with one of `discovery:research`, `discovery:prototype`, `discovery:interrogate`, or `discovery:task`. If sub-issues are unavailable, maintain a map task list and put `Part of #MAP` at the top of each child.
- **Blocking:** Use native issue dependencies. Add a blocked-by edge through the repository issue-dependencies API using the blocker's numeric database ID, not its visible issue number or node ID. Fall back to a `Blocked by: #NUMBER` line only when dependencies are unavailable.
- **Frontier:** List the map's open children in map order, remove tickets with open blockers, and remove assigned tickets.
- **Claim:** `gh issue edit NUMBER --add-assignee @me`.
- **Resolve:** Comment with the answer, close the child, verify closure, then update only the map's `Decisions so far` section with the linked ticket title, one-line gist, and context pointer.

Follow the shared Discovery map, ticket, fog, scope, naming, claim, and resolution rules.
