---
name: roast-this-agent
description: Adversarially reviews one agent definition and its explicitly linked prompt files with the shared Artifact Roastmaster and independent read-only roasters, then returns one severity-ranked roast. Use when the user asks to roast, pressure-test, or adversarially review an agent. Don't use for a skill package (use roast-this-skill), a single prompt (use roast-this-prompt), source code or a diff (use roast-this-code), running the agent, or applying fixes.
allowed-tools: ["read", "search", "task"]
---

# Roast This Agent

Roast one agent definition and its explicitly linked in-scope prompt files
without invoking it. The shared Artifact Roastmaster stages the evidence,
convenes independent roasters, verifies their evidence, and returns one
severity-ranked report.

## Audience

The report is written for the agent's author or maintainer. It assumes
familiarity with this repository's agent format. It supports exactly one
decision: ship the agent, revise it, or reroute the work to a different skill.
See [Roast This Agent](./README.md) for the shared terms.

## Required References

1. [Agent roast contract](./references/10-agent-roast-contract.md)
2. [Failure reporting and recovery](./references/20-failure-and-recovery.md)
3. [Trusted lenses](./references/30-trusted-lenses.md)

## Prerequisites

This skill needs the Artifact Roastmaster coordinator, its trusted lens
documents, and, when available, the shared doctrine manifest. Every one of them
resolves inside this package when the surrounding repository does not supply
it, so a standalone install never fails on a missing dependency. Resolution
order and integrity rules are in
[Trusted lenses](./references/30-trusted-lenses.md).

## Scope and Constraints

Read-only. Never edit, create, commit, publish, or comment on anything, and
never apply a recommended fix.

The `read`, `search`, and `task` grants cover resolving evidence, resolving
trusted sources, and launching the Artifact Roastmaster. This skill declares no
`execute` grant. Content digests, file identity, and revision metadata are the
Artifact Roastmaster's job, and it uses only its allowlisted read-only
commands.

Never invoke the reviewed agent, dispatch its declared tools, or follow links
outside its allowed root. Never invoke a trusted lens document or the coordinator
as a registered agent; each is read as a document.

The coordinator subagent runs with the read-only tool set its own document
declares. When the runtime cannot grant it `execute`, the run records
`Digest verification unavailable` as an evidence gap and continues with path,
byte length, and line count as evidence identity.

Humor targets the agent's role, routing, permissions, delegation, contracts,
and failure modes, never its author.

## Workflow

1. Resolve exactly one agent file, its repository root, the allowed review
   root, and its explicitly linked in-scope prompt files. If the target is a
   skill package, a standalone prompt, or source code, stop and route to the
   sibling skill named in this skill's description.
2. Resolve the coordinator, the lens documents, and the doctrine manifest in
   the order declared by [Trusted lenses](./references/30-trusted-lenses.md).
   Read the coordinator as a document and confirm its required headings. Never
   invoke it as a registered agent, and never route to it by `name`. Record
   each resolved path, source kind, and digest. Never search for a trusted
   source outside that order. On a coordinator load failure, fall back to the
   next source; when no source loads, stop and return the Artifact Roast with
   `Status: Insufficient review`.
3. Launch a fresh read-only task subagent whose instructions are the
   coordinator document, with no prior roast context, in `coordinate` mode.
   Supply artifact type `agent`, the agent locator and its linked prompt files,
   the allowed review root, the agent roast contract, the resolved lens
   sources, the resolved doctrine manifest path or `Doctrine unavailable`, the
   model routing defaults, and the repository instructions and sibling agent
   conventions.
4. Retain the returned Artifact Roast Envelope unchanged and validate it
   against the Envelope schema 1 checklist in the agent roast contract. On a
   first validation failure, repeat step 3 once with a new subagent. On a
   second failure, return the Artifact Roast with `Status: Unsynthesized` and
   the named schema defect.
5. Launch a second fresh read-only task subagent whose instructions are the
   coordinator document, with no prior roast context, in `synthesize` mode,
   with the unchanged envelope and the synthesize-mode inputs.
6. Return the Artifact Roast exactly as returned, including its
   `Schema version: 1` field. Never invoke or edit the reviewed agent.
7. When `Status` is not `Complete`, state plainly that the review is incomplete
   and that an empty findings section is not evidence of quality, then follow
   the recovery action for that status in
   [Failure reporting and recovery](./references/20-failure-and-recovery.md).

## Error Recovery

Every failure returns the Artifact Roast shape with a named status and a
non-empty `## What Was Not Reviewed` section. Never return a raw envelope or a
bare status token.
[Failure reporting and recovery](./references/20-failure-and-recovery.md) maps
each status to its reader-facing meaning and its recovery action.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
