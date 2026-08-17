# Common Copilot Skills

This repository is a personal library of reusable GitHub Copilot skills and agents for day-to-day work.

## Layout

```text
agents/
  prompt-coach.agent.md
  skill-coach.agent.md
skills/
  <skill-name>/
    SKILL.md
    references/
      <supporting-instructions>.md
```

`SKILL.md` is the canonical entry point for every skill. Supporting instructions belong beside it under `references/` and are linked from the skill.

Agents are standalone `.agent.md` files. Prompt Coach reviews single-prompt quality; Skill Coach reviews skill package and workflow quality — structure, routing, determinism, and safety. Use Skill Coach to gut-check new and revised skills.

## Using a Skill

Copy a skill package to one of Copilot's recognized locations:

- Personal: `~/.agents/skills/<skill-name>/`
- Repository: `.github/skills/<skill-name>/`

Copy an agent file to `.github/agents/` when it should be available in a repository.

## Adding Skills

1. Add `skills/<skill-name>/SKILL.md`.
2. Split substantial instructions into focused files under `references/`.
3. Keep the entry point concise and link every required reference.
4. Run Skill Coach against the complete package; use Prompt Coach for any embedded prompt wording.
5. Preserve applicable licenses and attribution when adapting material from another source.

Do not use JSON manifests or generated mirrors as the canonical skill format.
