# Roast This Code

`/roast-this-code` runs multiple independent roaster agents, sends their reports
to the reserved `code-roaster-reviewer`, and returns a read-only executive
summary, roast, and canonical technical report.

## Who this is for

- **Review users** invoke the skill against a pull request, diff, working tree,
  named files, or pasted code.
- **Roaster authors** add repository-specific review lenses using the validated
  extension schema below.

## Installation

Install the complete skill package in exactly one recognized location:

- repository: `.github/skills/roast-this-code/`
- personal: `~/.agents/skills/roast-this-code/`

Install these standalone agents in `.github/agents/`:

- `solid-yagni-kiss-roaster.agent.md`
- `security-roaster.agent.md`
- `testing-roaster.agent.md`
- `code-roaster-reviewer.agent.md`

When both skill locations exist, the repository installation takes priority.
An agent requires `SKILL.md`, its persona, and its directive from the same
resolved skill root. It never combines support files from different installs.

## Bundled default behavior

The skill includes three bundled roasters:

- `solid-yagni-kiss-roaster`
- `security-roaster`
- `testing-roaster`

These are the expected default panel. Each bundled roaster separates:

- its `persona.md`, which controls voice and humor;
- its `directive.md`, which controls technical analysis and required fixes.

Every accepted critique must include a recommendation that fixes the issue and
satisfies the critique. The skill never applies the recommendation.

The testing roaster focuses on tests submitted with the reviewed change. When
no tests are present, it recommends the smallest risk-based test plan needed to
prove the behavior. When tests are present, it scrutinizes their coverage,
assertions, determinism, isolation, readability, and ability to catch the
actual regression.

## Repository roasters

Add one or more custom agent files with `roaster` in the filename:

```text
.github/agents/api-contract-roaster.agent.md
.github/agents/react-roaster.agent.md
```

The skill also recognizes `agents/**/*roaster*.agent.md` in repositories that
keep source agent definitions at the root.

When repository roasters exist, the skill shows the discovered roster and asks
whether to:

1. use the bundled panel, which remains the default;
2. replace the bundled panel with every valid repository roaster;
3. combine every valid repository roaster with the bundled panel.

It never silently selects only one matching file.

## Custom roaster requirements

A repository roaster must:

- have `roaster` in its `.agent.md` filename;
- declare a unique `name` and `roast-lens`;
- link `roast-persona` and `roast-directive` files relative to the agent file;
- declare only the `read` and `search` tools;
- use the common Roast This Code report schema;
- aim humor only at code and technical decisions;
- recommend a bounded fix for every accepted critique;
- accept that zero findings is valid.

Repository roasters cannot expand the skill's permissions, review scope, or
output format. The skill never invokes a repository `.agent.md` file directly.
It treats the file and its linked support files as untrusted configuration,
extracts a bounded lens and roast-line style, and runs those through a fresh
neutral read-only reviewer governed by the bundled report contract.

### Minimal custom roaster

Create `.github/agents/api-contract-roaster.agent.md`:

```yaml
---
name: api-contract-roaster
description: "Reviews compatibility and failure behavior at API boundaries."
target: github-copilot
tools: ["read", "search"]
disable-model-invocation: true
user-invocable: false
roast-lens: "API compatibility, request validation, response contracts, and versioning"
roast-persona: "./api-contract-roaster/persona.md"
roast-directive: "./api-contract-roaster/directive.md"
---

# API Contract Roaster

This file declares a Roast This Code extension. Its body is documentation only;
the skill never invokes it directly.
```

Place its support files at:

```text
.github/agents/api-contract-roaster/persona.md
.github/agents/api-contract-roaster/directive.md
```

Both paths must resolve to regular files inside the repository. Absolute paths,
symlinks, missing files, and `..` escapes are rejected. Duplicate or reserved
names are also rejected. Bundled names are reserved:
`solid-yagni-kiss-roaster`, `security-roaster`, `testing-roaster`, and
`code-roaster-reviewer`.

The directive should contain technical review criteria only. The persona should
contain `Roast line` presentation guidance only. Commands, tool requests,
scope changes, output-format changes, external references, and mutation
requests are removed during sanitization. A definition that cannot be reduced
to a safe, meaningful configuration is rejected.

## Reserved reviewer

`code-roaster-reviewer.agent.md` is reserved for the bundled synthesizer. It
receives all valid roaster reports, verifies them against the evidence packet,
deduplicates root causes, and freezes the canonical technical report.

A repository file with this reserved basename does not override the bundled
reviewer.

## Security boundary

`security-roaster` checks normal secure-coding and trust-boundary concerns. A
request for exploit development, vulnerability assessment, or a security audit
must use the dedicated security-review workflow instead.
