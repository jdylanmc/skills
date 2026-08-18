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
  <skill-name>/
    SKILL.md
    references/
      <supporting-instructions>.md
```

`SKILL.md` is the canonical entry point for every skill. Supporting instructions belong beside it under `references/` and are linked from the skill.

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

Copy an agent file to `.github/agents/` when it should be available in a repository.

Doctrine-consuming skills require the sibling `doctrine/` directory in the
canonical repository layout. Copying only one roast skill is supported, but it
degrades to `Doctrine status: unavailable`.

`ship-with-squadron` also requires the separately installed `/handoff` skill.
This repository does not currently ship that external prerequisite.

## Adding Skills

1. Add `skills/<skill-name>/SKILL.md`.
2. Split substantial instructions into focused files under `references/`.
3. Keep the entry point concise and link every required reference.
4. Run Skill Coach against the complete package; use Prompt Coach for any embedded prompt wording.
5. Preserve applicable licenses and attribution when adapting material from another source.

Do not use JSON manifests or generated mirrors as the canonical skill format.
