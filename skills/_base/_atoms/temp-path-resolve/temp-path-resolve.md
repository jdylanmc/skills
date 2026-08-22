---
name: temp-path-resolve
description: Resolve the runtime-reported operating-system temporary directory, create exactly one named child inside it, and propose a collision-resistant UTC file name.
level: atom
allowed-tools: ["execute"]
includes: ["_base/_atoms/temp-path-resolve/temp-path-resolve.mjs"]
composes: []
used-by: ["_base/_molecules/persist-bounded-handoff/persist-bounded-handoff.md"]
---

# Temporary Path Resolution

Ask the runtime where its temporary directory is, put exactly one named child
inside it, and propose a file name that will not collide. This atom owns the
destination. It owns nothing about what is written there.

A caller that guesses `/tmp` is wrong on Windows, wrong under a sandbox that
relocates the temporary root, and wrong whenever the operator has moved it.
Asking the runtime is the only answer that stays correct.

## Required Files

1. [Resolution entry point](./temp-path-resolve.mjs)

## Operation

```text
node <atoms>/temp-path-resolve.mjs --slug <slug> [--child <name>]
```

Exit `0` prints `directory`, `path`, `name`, and `attempt` as JSON. Any
non-zero exit prints a stable failure category on standard error. Check
availability with `--probe`, which prints `handoff: available`.

| Input | Required | Meaning |
| --- | --- | --- |
| `--slug` | yes | The repository or work slug that identifies the artifact. Lowercase alphanumeric words joined by single hyphens, at most 64 characters. |
| `--child` | no | The single child directory name. Defaults to `handoffs`. One lowercase hyphenated name, never a path. |

## Resolution

1. Read the temporary directory **from the runtime**, then resolve it to its
   real path. A temporary root that cannot be resolved is `temp_unavailable`.
2. Join exactly one child. A child name containing a path separator, `.`, or
   `..` is rejected before anything touches the file system.
3. Create the child non-recursively with owner-only permissions, ignoring the
   "already exists" result. Creating one level means a missing temporary root
   is reported rather than fabricated.
4. **Then** inspect what is actually there, without following links. Inspecting
   first and creating afterwards leaves a window in which the entry that passed
   the check is not the entry that gets used.
5. The child must be a real directory. A symbolic link or a non-directory entry
   is `unsafe_temp_root`.
6. On a system with user identities, the child must be owned by the current
   user and must not be writable by its group or by others. A shared temporary
   root lets any local account pre-create the child; a handoff written inside a
   directory somebody else controls can be replaced after it was verified.
7. Propose `<slug>-<YYYYMMDDTHHMMSSZ>.md`. When that name is taken, append a
   two-digit ordinal - `-01`, `-02`, and so on - and take the first unused
   name. After 100 attempts the result is `name_exhausted`.

## Output

| Field | Meaning |
| --- | --- |
| `directory` | The real path of the single child directory. Use it as the write's allowed root. |
| `path` | The proposed absolute file path. |
| `name` | The proposed file name. |
| `attempt` | Which candidate was proposed, starting at `1`. Anything above `1` means a name was already taken. |

## Guarantees

- The destination is always beneath the runtime's own temporary directory, and
  never beneath the workspace.
- Exactly one child directory is created. This atom never builds a tree.
- The directory that is returned is the one that was inspected, and it belongs
  to the current user alone.
- The timestamp is UTC, so two machines in different zones sort identically.
- The proposed name does not exist at the moment it is proposed.

## Boundaries

A proposal is **not a reservation**. Another writer may take the name between
the proposal and the write, so the write must create the file exclusively and
the caller must re-resolve when it reports that the target exists.

This atom does not write, render, redact, choose the slug, or delete anything,
including earlier artifacts in the same directory.
