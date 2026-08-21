---
includes: []
requires-skills: []
---
# Provider Detection and Pull-Request Resolution

## Establish the Repository

1. Resolve the repository root and read its instruction files before changing
   anything.
2. Inspect the worktree and current branch. Do not stash, discard, overwrite,
   or include unrelated user changes.
3. Select the remote associated with the current branch. Fall back to `origin`
   only when no upstream is configured.
4. Read the remote URL without rewriting it or exposing embedded credentials.

If tracked or untracked changes overlap files that shepherding may need to
modify, stop and ask the user how to proceed. A clean worktree is preferred but
unrelated changes do not prevent read-only status collection.

## Detect the Provider

Normalize Secure Shell (SSH) and HTTPS forms before matching:

| Remote host | Provider |
| --- | --- |
| `github.com` or a configured GitHub Enterprise host supported by `gh` | GitHub |
| `dev.azure.com`, `ssh.dev.azure.com`, `*.visualstudio.com`, or `vs-ssh.visualstudio.com` | Azure DevOps |

Confirm the provider CLI is installed and authenticated before continuing:

- GitHub: `gh`
- Azure DevOps: `az` with the Azure DevOps extension

Resolve and record the effective authenticated provider principal and the Git
credential principal used for pushes. If either principal cannot be identified,
return `EXTERNAL_BLOCKER` before accepting mutation authority. A later
principal change invalidates the current mutation lease.

Fail clearly for any other host. Do not guess that a Git-compatible host uses
GitHub or Azure DevOps pull-request semantics.

## Resolve the Pull Request

Accept, in priority order:

1. A pull-request URL.
2. A provider-specific pull-request number or ID.
3. The open pull request whose source branch matches the current branch.

Verify that the resolved pull request belongs to the detected repository and
that its source branch is the branch shepherding will update. If multiple open
pull requests match, ask the user to select one. If the pull request originates
from a fork or a repository where the source branch is not writable, collect
status and evaluate readiness, but return `UNWRITABLE` before proposing local
mutations when work remains.

Record stable identifiers separately from display names:

- repository and project identity;
- pull-request ID and URL;
- exact source repository, branch, and commit;
- exact target repository, branch, and commit.
- effective provider and Git principals.

Never select a pull request by title similarity.
