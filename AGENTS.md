# Repository Instructions

This repository is Dylan's common library of reusable GitHub Copilot skills and agents.

## Canonical Formats

- Skills live at `skills/<skill-name>/SKILL.md`.
- Skill support files live at `skills/<skill-name>/references/`.
- Agents live as standalone files at `agents/<agent-name>.agent.md`.
- Do not replace canonical Markdown files with JSON manifests or generated artifacts.

## Skill Design

- Keep each skill focused on one reusable job.
- Put routing metadata and the core workflow in `SKILL.md`.
- Split detailed policies, formats, examples, and error handling into references by intention.
- Link all required references from `SKILL.md`.
- Declare only the tools the skill needs.
- Include explicit scope boundaries, confirmation gates, and error recovery.
- End every `SKILL.md` with the create-skill signature footer already used in this repository.

## Review

Use `agents/skill-coach.agent.md` to review new or revised skill packages for discoverability, scope, composition, permissions, workflow clarity, determinism, safety, validation, and maintainability.

Use `agents/prompt-coach.agent.md` to review individual prompts for unclear goals, missing context, weak output contracts, constraints, source requirements, safety concerns, and unnecessary complexity.

When importing material from elsewhere, adapt it into this repository's conventions and preserve any required license or attribution.
