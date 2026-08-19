# Repository Instructions

This repository is Dylan's common library of reusable GitHub Copilot skills and agents.

## Canonical Formats

- Skills live at `skills/<skill-name>/SKILL.md`.
- Skill support files live at `skills/<skill-name>/references/`.
- Agents live as standalone files at `agents/<agent-name>.agent.md`.
- Shared engineering doctrine lives at `doctrine/<id>.doctrine.md`.
- Do not replace canonical Markdown files with JSON manifests or generated artifacts.

## Doctrine

- Doctrine files contain canonical shared software-engineering industry best
  practices.
- `doctrine/manifest.md` defines canonical doctrine IDs, paths, and integrity
  hashes.
- Keep doctrine source-neutral.
- After editing doctrine, regenerate its SHA-256 digest with
  `shasum -a 256 doctrine/<id>.doctrine.md` and update the matching manifest
  entry.
- Skills and agents may reference doctrine selectively by canonical ID,
  section, and rule label or opening phrase.
- Doctrine guides decisions but never replaces repository evidence,
  requirements, or task-specific instructions.
- Resolve overlap explicitly. Do not load multiple doctrine files merely
  because they are available.

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

Use `agents/ste-coach.agent.md` after Skill Coach when a skill can produce human-facing technical documentation. It checks that the skill workflow explicitly defines audience, controlled terminology, sentence and procedure constraints, acronym handling, warning order, ambiguity checks, and a content-quality gate.

When importing material from elsewhere, adapt it into this repository's conventions and preserve any required license or attribution.

## Machine-local instructions

Read and follow `.user/instructions.md` when it is present. The `.user/`
directory is git-ignored and must never be committed.
