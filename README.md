# Common Copilot Skills

This repository is a personal library of reusable GitHub Copilot skills and agents for day-to-day work.

## Layout

```text
agents/
  artifact-roastmaster.agent.md
  prompt-coach.agent.md
  skill-coach.agent.md
  ste-coach.agent.md
doctrine/
  <id>.doctrine.md
skills/
  _base/
    <base-name>/
      BASE.md
      scripts/
      tests/
  <skill-name>/
    SKILL.md
    references/
      <supporting-instructions>.md
```

`SKILL.md` is the canonical entry point for every skill. Supporting instructions belong beside it under `references/` and are linked from the skill.

Non-routable shared instruction bases live under `skills/_base/<base-name>/`
and use `BASE.md`, never `SKILL.md`. A base is read by the skills that depend
on it. It is never routed to, listed as a skill, or invoked directly. Its
deterministic support files may live in `scripts/` and `tests/` subdirectories
of the same base package.

## Dependency Mirror

A Markdown file opts in to dependency validation by declaring `includes` in its
frontmatter. `includes` is a JSON array of skills-root-relative paths that
mirrors exactly the local links in that file's `## Required References` or
`## Required Files` section. `requires-skills` is a JSON array of routable
skill dependencies, each `{"id": "<skill-name>", "source": "local" | "external",
"required": true | false}`.

```yaml
---
includes: ["_base/common/BASE.md", "example/references/a.md", "example/scripts/run.mjs"]
requires-skills: [{"id": "handoff", "source": "external", "required": true}]
---
```

Rules the validator enforces:

- Both fields are single-line JSON. Block-style YAML lists are not accepted.
- The mirror covers every local link in a required section, including links to
  non-Markdown support files. Links elsewhere in the file are ignored.
- Use inline links. Reference-style links in a required section are rejected
  because the mirror cannot see them.
- Opt-in is transitive. Every Markdown file reachable through `includes` must
  itself declare `includes`, so an opted-in entry point has a complete closure.
- Paths are normalized, forward-slash, case-exact, inside the skills root, and
  free of cycles and duplicates.

Markdown remains the runtime authority. The frontmatter is a machine-readable
mirror, not a directive to load every listed file into context. A file with no
`includes` field is ignored entirely, so skills adopt the convention one
closure at a time. Run `node scripts/validate-skill-graph.mjs` to check every
opted-in file.

Agents are standalone `.agent.md` files. Prompt Coach reviews single-prompt
quality; Skill Coach reviews skill package and workflow quality; Simplified
Technical English Coach reviews documentation-production guardrails. Artifact
Roastmaster is a shared non-user-invocable coordinator that roast skills load
as a document rather than invoke directly.

Doctrine files are shared software-engineering industry best practices. Skills
and agents reference only the doctrine relevant to their job; doctrine does
not replace code evidence or repository-specific requirements.

## Using a Skill

Copy a skill package to one of Copilot's recognized locations:

- Personal: `~/.agents/skills/<skill-name>/`
- Repository: `.github/skills/<skill-name>/`

When a copied skill depends on a shared base, copy the `_base/` directory once
beside the installed skills:

- Personal: `~/.agents/skills/_base/`
- Repository: `.github/skills/_base/`

Do not expose `_base` entries as routable skills. If a required base is missing
at runtime, the consuming skill's own documented degradation behavior applies.

Copy an agent file to `.github/agents/` when it should be available in a repository.

Doctrine-consuming skills require the sibling `doctrine/` directory in the
canonical repository layout. Copying only one roast skill is supported, but it
degrades to `Doctrine status: unavailable`.

For a repository installation, copy doctrine to `.github/doctrine/` beside
`.github/skills/`. For a personal installation, copy it to
`~/.agents/doctrine/` beside `~/.agents/skills/`.

`ship-with-squadron` also requires the separately installed `/handoff` skill.
This repository does not currently ship that external prerequisite.

## Adding Skills

1. Add `skills/<skill-name>/SKILL.md`.
2. Split substantial instructions into focused files under `references/`.
3. Keep the entry point concise and link every required reference.
4. Run Skill Coach against the complete package; use Prompt Coach for any embedded prompt wording.
5. Preserve applicable licenses and attribution when adapting material from another source.
6. Run `node scripts/validate-skill-graph.mjs` and `node --test scripts/validate-skill-graph.test.mjs`.

Do not use JSON manifests or generated mirrors as the canonical skill format.
