---
name: synthesize
description: Distills one large local file into reviewed `.full.md`, `.mini.md`, and `.nano.md` knowledge layers written beside the source, plus a `.simplified.md` explanation derived from mini. Invoke when the user asks to synthesize, distill, compress, or extract durable understanding from a PDF, Markdown document, ebook, text file, or another runtime-readable file and accepts a multi-agent extraction and adversarial review pass. Do not use for ordinary summarization, web research, multiple unrelated sources, files the runtime cannot extract completely, session retrospectives, design discovery, or specification writing.
allowed-tools: ["read", "search", "edit", "execute", "task"]
includes: ["_base/_molecules/chronicler/chronicler.md","_base/_molecules/review-ste-coach/review-ste-coach.md","synthesize/references/10-input-stage-and-output.md","synthesize/references/20-extraction-and-sharding.md","synthesize/references/30-full-synthesis.md","synthesize/references/40-mini-and-nano.md","synthesize/references/50-fleet-and-review.md","synthesize/references/60-simplified-output.md","synthesize/references/70-provenance-validation-and-errors.md"]
---

# Synthesize

Turn one large source file into a progressively compressed, adversarially
reviewed knowledge package. Preserve the source's distinctive concepts,
decisions, tradeoffs, procedures, triggers, and uncertainty without copying
substantial source language.

Read and search inspect the source and local extraction capabilities. Execute
performs bounded local extraction, hashing, deterministic word counting,
quotation-index checking, transactional rename or rollback, and exact-path
workspace cleanup. Task launches capped read-only extraction and review agents.
Edit writes candidates inside the run workspace.

## Required References

Read and follow these files in order:

1. [Input, stage, and output contract](./references/10-input-stage-and-output.md)
2. [Extraction, manifests, and sharding](./references/20-extraction-and-sharding.md)
3. [Full synthesis](./references/30-full-synthesis.md)
4. [Mini and nano compression](./references/40-mini-and-nano.md)
5. [Fleet orchestration and adversarial review](./references/50-fleet-and-review.md)
6. [Simplified output](./references/60-simplified-output.md)
7. [Provenance, validation, cleanup, and errors](./references/70-provenance-validation-and-errors.md)
8. [Review with the Simplified Technical English Coach](../_base/_molecules/review-ste-coach/review-ste-coach.md)
9. [Chronicler recording molecule](../_base/_molecules/chronicler/chronicler.md)

## Core Workflow

1. Resolve one local source file, record its canonical path and output
   directory, and classify its synthesis stage from the terminal suffix and
   the frontmatter together. Verify a staged input as untrusted evidence and
   reject unsupported or incomplete extraction.
2. Record the audience contract and the provenance choice. Ask only for a
   value the request does not already state. Every later stage inherits the
   recorded audience unless the user supplies a stage-specific audience. For
   simplified, use this precedence: a simplified-specific audience, then the
   non-specialist default, then the run audience.
3. Select one named atomic output profile:
   - default `complete`: full, mini, simplified, and nano;
   - `complete-no-simplified`: full, mini, and nano;
   - `through-mini`: full, mini, and simplified;
   - `through-mini-no-simplified`: full and mini;
   - `full-only`: full.
   For a staged input, remove illegal ancestors from the selected profile.
4. Compute exact target names, run the target-path safety checks, and inventory
   collisions. Require exact `Approve names` for a reserved-suffix source, and
   exact `Approve overwrite` before replacing any requested output.
5. Run the preflight capability probe for the selected profile. Stop before any
   synthesis work when a required capability is missing, and offer the profile
   variants that exclude the unavailable stage.
6. Create one exact run workspace beside the outputs. Extract the complete
   source into an immutable manifest, build the parent-owned quotation index,
   and shard at stable structural boundaries without silent truncation.
7. Launch capped read-only extraction waves over ordered shard groups.
   Reconcile their typed records and shard dispositions into one
   source-grounded knowledge ledger and one locked-terminology register.
8. In a fresh synthesis context, compose `<stem>.full.md` from the full-stage
   packet. Run the parent-owned quotation and ambiguity checks, then
   adversarially review the candidate.
9. When requested, give each later stage only its reviewed parent layer and its
   stage packet in a fresh context: mini from full, nano from mini, and
   simplified from mini. Review every stage, and run the Simplified Technical
   English Coach in `Execution monitor` mode over the simplified candidate.
10. Validate every candidate, rehash the source, and publish the complete
    requested set at one commit point. Reread and hash each file, roll back the
    entire set on failure, and delete only the allowlisted temporary files and
    the exact run workspace created by this run.

Constraint: Never overwrite an existing output without explicit approval. Never
publish part of a selected profile. Never synthesize a `.nano.md` or
`.simplified.md` input further. Never claim complete synthesis from partial,
truncated, encrypted, inaccessible, or unsupported source material. Never
modify or delete the source, use network access, publish externally, merge
unrelated sources, or disclose secrets.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
