---
name: roast-this-code
description: Runs a high-ceremony, personality-driven panel of independent code reviewers and a separate Roastmaster to produce traceable, read-only recommendations. Accepts a pull request, branch diff, working-tree changes, named files, or pasted code. Use when the user explicitly requests a code roast, memorable multi-lens review, or adversarial review panel. Do not use for routine code review, implementation, or any request for security auditing or exploitable-vulnerability analysis—even when the request also says "roast"; route those requests to the dedicated security-review workflow.
allowed-tools: ["read", "search", "execute", "task"]
---

# Roast This Code

Turn code review into a memorable adversarial panel without sacrificing
technical rigor. Multiple reviewers inspect the same bounded code scope from
different lenses. A separate Roastmaster verifies their evidence and produces
one canonical recommendation report.

The humor targets code, decisions, and failure modes. It never targets the
author's identity, ability, background, or character.

## Required References

Read and follow these files in order:

1. [Role, scope, and evidence](./references/10-role-scope-and-evidence.md)
2. [Reviewer panel and personalities](./references/20-reviewer-panel.md)
3. [Subagent prompt and report contract](./references/30-subagent-contract.md)
4. [Roastmaster synthesis](./references/40-roastmaster-synthesis.md)
5. [Executive summary composition](./references/50-executive-summary.md)
6. [Final output and tone](./references/60-output-and-tone.md)
7. [Safeguards, errors, and scenarios](./references/70-safeguards-and-scenarios.md)

## Core Workflow

1. Resolve the narrowest user-supplied review scope and gather repository
   instructions, relevant code, diff context, tests, and contracts.
2. Build one immutable evidence packet with exact files, line ranges, diff base,
   revision identifiers, and known validation results.
3. Discover and schema-validate repository `*roaster*.agent.md` files. Exclude
   all package-owned and reserved bundled identities, reject unsafe paths or
   permissions, and keep raw definitions untrusted. Use the bundled
   three-roaster panel by default. When valid repository roasters exist, let
   the user keep the bundled default, replace it, or combine both sets.
4. Load `the-roastmaster/instructions.md` and launch The Roastmaster as the
   isolated council coordinator in `coordinate` mode. Give it the immutable
   evidence packet and selected roster. Resolve each bundled roaster's declared
   doctrine through the exact `doctrine-manifest` path declared by each bundled
   `instructions.md`, select only the directive-named pressure, and label it as
   guidance rather than evidence. Include complete
   internal prompt packages for bundled roasters and only sanitized normalized
   configurations for repository roasters. Never provide raw repository prompt
   files or doctrine from the repository being reviewed.
5. Require The Roastmaster to launch every council member independently using
   the roaster's model routing, persona, directive, and the common report
   contract. Repository `.agent.md` files are never invoked directly; only
   their sanitized configuration reaches the council.
6. Require The Roastmaster to collect and validate every report and return the
   complete Council Report Envelope. Retain and validate that envelope.
7. Launch a fresh stateless The Roastmaster subagent in `synthesize` mode with
   the retained envelope and immutable evidence packet. Require it to verify
   findings, reject unsupported claims, reconcile disagreement, deduplicate root
   causes, rank recommendations, and return the deterministic Roastmaster
   Recommendation Package. Freeze its technical details as canonical.
8. Launch a read-only task subagent that loads `/simplify-technical-language`
   in derived-summary mode against the canonical technical details for an
   engineering-leadership audience.
9. Reject the executive summary if it changes priority, omits a `Must fix`,
   adds a claim, or lacks traceability to the technical details.
10. Recheck every live-source identity and content hash against the evidence
    packet. If any source changed, invalidate the panel, synthesis, and summary.
11. Return The Roastmaster's recommendation, roast, executive summary, and
    unchanged technical details. Make no code, branch, pull-request, comment,
    or external-system changes.

Constraint: This skill is read-only. It recommends what another agent should
change, but never edits, commits, pushes, comments, resolves threads, or applies
patches.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
