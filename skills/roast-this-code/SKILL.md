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
3. Select the stable core panel and add only specialists justified by the code.
4. Launch reviewers independently with the same evidence packet, distinct lens,
   distinct personality, and strict finding schema.
5. Collect every report without allowing reviewers to see or anchor on another
   reviewer's conclusions.
6. Launch the Roastmaster as a separate subagent. Require it to verify findings
   against the code, reject unsupported claims, reconcile disagreement,
   deduplicate root causes, and rank recommendations.
7. Freeze the Roastmaster's technical details as the canonical source of truth.
8. Launch a read-only task subagent that loads `/simplify-technical-language`
   in derived-summary mode against the canonical technical details for an
   engineering-leadership audience.
9. Reject the executive summary if it changes priority, omits a `Must fix`,
   adds a claim, or lacks traceability to the technical details.
10. Recheck every live-source identity and content hash against the evidence
    packet. If any source changed, invalidate the panel, synthesis, and summary.
11. Return the roast, executive summary, and unchanged technical details. Make
    no code, branch, pull-request, comment, or external-system changes.

Constraint: This skill is read-only. It recommends what another agent should
change, but never edits, commits, pushes, comments, resolves threads, or applies
patches.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
