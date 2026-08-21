---
name: agent-resolve
description: Resolve one agent document by name from the standard locations, verify it structurally, and return its path and digest. Never searches outside the declared order.
level: atom
allowed-tools: ["read", "search", "execute"]
includes: []
---

# Agent Resolve

Find one agent document by name, prove it is safe and complete enough to use,
and return where it is. This atom owns resolution and verification. It owns
nothing about what the agent is for or what is done with it afterwards.

Resolution is a fixed, declared order. An agent that is not at one of those
locations does not exist for this purpose. Searching more widely is how a
process ends up loading a document an attacker placed.

## Inputs

| Input | Required | Meaning |
| --- | --- | --- |
| `agent-name` | yes | The bare name, such as `ste-coach` or `artifact-roastmaster`. |
| `repository-root` | yes | The declared root that the search order resolves against. |
| `required-headings` | no | Headings the document must contain, each outside every fenced block, for it to count as complete. |
| `expected-digest` | no | A digest the resolved file must match. Supply it only for a file whose content is pinned; omit it for a file that changes independently. |

## Operation

1. Try each location in order and take the first match:
   1. `agents/<agent-name>.agent.md`, from `repository-root`;
   2. `.github/agents/<agent-name>.agent.md`, from `repository-root`.
2. Confirm the match is a **regular file and not a symbolic link**, and that its
   resolved path stays inside `repository-root`.
3. Compute its SHA-256 digest.
4. When `expected-digest` is supplied, compare and reject on mismatch.
5. When `required-headings` is supplied, confirm each appears outside every
   fenced block. A document missing one is incomplete, and incomplete is a
   resolution failure rather than a usable result.
6. Return the resolved path and the computed digest.

## Output

| Field | Meaning |
| --- | --- |
| `status` | `Resolved` or a named failure. |
| `path` | The resolved path, when `Resolved`. |
| `digest` | The computed SHA-256 digest, when `Resolved`. |
| `attempted` | Every location tried, so a caller can report what it looked for. |

Failure categories: `Not found`, `Not a regular file`, `Path escapes root`,
`Digest mismatch`, `Missing required heading`, `Digest unavailable`.

## Guarantees

- **Never searches outside the declared order.** No globbing, no walking upward,
  no following a path supplied by reviewed content.
- A symbolic link is refused rather than resolved.
- `Digest unavailable` is a failure, not a silent skip. A caller that needs a
  trust boundary cannot have one without a digest.
- A document that resolves but is missing a required heading is reported as a
  failure, so a caller never runs a truncated or wrong document.
- `attempted` is always populated, including on success, so a caller can record
  which location supplied the document.

## Boundaries

This atom does not read the document into instructions, spawn anything, or
decide what to do when resolution fails. It returns a path and a digest.
