# Roast This Agent

`roast-this-agent` runs the shared Artifact Roastmaster over one agent
definition and the prompt files it explicitly links. The Artifact Roastmaster
stages that evidence as immutable, launches independent read-only roasters,
verifies their evidence, deduplicates root causes, and returns one
severity-ranked Artifact Roast. The reviewed agent is never invoked.

## Who this is for

- **Review users** point the skill at one agent file before shipping it and
  decide whether to ship, revise, or reroute the work.
- **Agent maintainers** read the roast to locate the exact file, the
  consequence, the bounded fix, and the validation that proves the fix.

The report assumes familiarity with this repository's agent format. It never
edits, commits, publishes, or comments on anything.

## Terms

- **Roaster** — one independent read-only reviewer instance that applies
  exactly one lens and returns one Artifact Roaster Report.
- **Lens** — the bounded set of review dimensions a roaster applies.
- **Council** — the selected roasters for one run. Maximum five: two mandatory
  and up to three evidence-triggered specialists.
- **Evidence packet** — the immutable staged evidence for one run, named by one
  packet identifier and described by one file manifest with digests.
- **Trusted lens document** — a read-only source of review principles, either a
  coach agent file or a bundled lens configuration. Never invoked.
- **Doctrine** — shared engineering best-practice files loaded only through a
  trusted doctrine manifest. Doctrine guides recommendations and never proves a
  defect.

## Installation

The canonical layout is this skills repository:

```text
agents/artifact-roastmaster.agent.md
agents/skill-coach.agent.md
agents/prompt-coach.agent.md
agents/ste-coach.agent.md
doctrine/manifest.md
skills/roast-this-agent/
```

The package also installs standalone at `.github/skills/roast-this-agent/` or
`~/.agents/skills/roast-this-agent/`. A standalone install works on its first
run:

- the coordinator resolves to the bundled snapshot at
  `references/agents/artifact-roastmaster.agent.md`;
- every lens resolves to its bundled configuration in
  `references/30-trusted-lenses.md`;
- shared doctrine is absent, which is a supported state recorded as
  `Doctrine status: unavailable`.

Copying `agents/artifact-roastmaster.agent.md` and the coach agent files to
`.github/agents/` restores the repository sources, which take precedence over
the bundled copies. Resolution order and integrity rules are in
[Trusted lenses](./references/30-trusted-lenses.md).

## Package layout

```text
skills/roast-this-agent/
  README.md
  SKILL.md
  references/
    10-agent-roast-contract.md
    20-failure-and-recovery.md
    30-trusted-lenses.md
    trusted-manifest.md
    agents/
      artifact-roastmaster.agent.md
```

## Maintenance

`references/agents/artifact-roastmaster.agent.md` is a copy of
`agents/artifact-roastmaster.agent.md`. After editing the repository agent or
`references/30-trusted-lenses.md`, refresh the copy and regenerate the digests:

```bash
cp agents/artifact-roastmaster.agent.md \
  skills/roast-this-agent/references/agents/artifact-roastmaster.agent.md
shasum -a 256 \
  skills/roast-this-agent/references/agents/artifact-roastmaster.agent.md \
  skills/roast-this-agent/references/30-trusted-lenses.md
```

Update the matching entries in
[Trusted manifest](./references/trusted-manifest.md). A stale copy is detected
rather than silently used: the skill prefers the repository agent and records
`Snapshot drift` when the digests disagree.

A run records `Lens drift` when a coach agent in `agents/` no longer matches the
bundled lens configuration in `references/30-trusted-lenses.md`. That is the
trigger to refresh the matching lens section and regenerate its digest with the
command above.

The same maintenance rule applies to the sibling packages `roast-this-skill`
and `roast-this-prompt`.

## Related skills

- `roast-this-skill` — one complete skill package.
- `roast-this-prompt` — one pasted prompt or one named prompt file.
- `roast-this-code` — source code, a diff, or a pull request.
