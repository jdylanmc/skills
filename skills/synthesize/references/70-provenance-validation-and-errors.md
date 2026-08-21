---
includes: []
requires-skills: []
---

# Provenance, Validation, Cleanup, and Errors

## Frontmatter Schema

The parent writes frontmatter; no stage agent writes it. Use exactly these keys
in this order, and no other key.

```yaml
---
synthesis-stage: full
synthesis-schema-version: 1
source-path: ./architecture.pdf
source-sha256: <64 lowercase hexadecimal characters>
source-format: pdf
parent-artifact: source
parent-sha256: <64 lowercase hexadecimal characters>
generated: 2026-08-18T15:04:05Z
lineage-status: verified
---
```

| Key | Allowed values |
| --- | --- |
| `synthesis-stage` | `full`, `mini`, `nano`, `simplified` |
| `synthesis-schema-version` | `1` |
| `source-path` | canonical path, or a user-supplied label |
| `source-sha256` | 64 lowercase hexadecimal characters |
| `source-format` | detected format token recorded in the manifest |
| `parent-artifact` | `source`, or the exact parent file name |
| `parent-sha256` | 64 lowercase hexadecimal characters |
| `generated` | UTC timestamp, `YYYY-MM-DDThh:mm:ssZ` |
| `lineage-status` | `verified`, `rebased`, `unverified` |

| `lineage-status` | Meaning |
| --- | --- |
| `verified` | Every recorded ancestor resolved this run and every recorded hash matched |
| `rebased` | Ancestry was absent, incomplete, malformed, or mismatched, so lineage begins at the supplied input |
| `unverified` | Recorded ancestry was carried forward but could not be checked this run |

When provenance is disabled, write only `synthesis-stage` and
`synthesis-schema-version`. Never write source or parent provenance in that
case.

## Provenance Choice

The user must explicitly choose whether provenance is maintained. Ask once per
run unless the request already states the choice.

For a staged input with `verified` provenance, preserve its original-source
identity and extend direct-parent lineage. If provenance is missing or
incomplete, rebase lineage to the supplied staged file, mark
`lineage-status: rebased` when provenance is enabled, and never invent an
unverifiable ancestor.

## Transient Traceability

Maintain one temporary traceability artifact that records:

- source locations to full claims;
- full claims to mini claims;
- mini claims to nano claims;
- mini claims to simplified statements;
- the locked-terminology register: term, source-stated definition or
  `not-in-source`, verified first-use expansion or `not-in-source`, and the
  stages where the term appears;
- the quotation exemption register;
- deterministic word counts and any recorded size-bound exception;
- adversarial findings, their stage, their lens, and their dispositions.

Reviewers and stage agents receive only their stage-scoped slice, never the
whole map.

Store it and every temporary artifact only inside the exact run workspace.
Maintain an allowlist of every path created by this invocation, including the
publication temporary files named `<target-name>.synthesize-tmp-<run-id>`. Do
not ship traceability as an output.

## Final Validation

Before publication:

1. verify every requested candidate exists in the run workspace, and that the
   parent-written frontmatter matches the schema above;
2. verify stage names, stems, and target-path safety checks still hold;
3. verify every child maps to its direct parent through the claim ledger;
4. verify full coverage, mini decision equivalence, nano standalone utility,
   and simplified claim preservation, using each stage gate;
5. verify no unresolved adversarial blocker and no unresolved evidence gap;
6. verify the quotation-index check reports no unexempted hit in any candidate,
   and that every exemption is a minimum identifier, command, formula, or
   required syntax;
7. verify no secret or sensitive-data reproduction;
8. verify the requested candidate set exactly matches the selected profile;
9. verify the ambiguity checks pass for every candidate;
10. verify terminology and acronym expansions are identical across the
    published set and match the locked-terminology register;
11. verify recorded word counts satisfy the size bounds, or that each exception
    has a recorded reason inside the overrun hard cap;
12. rehash the source's raw bytes and compare with the manifest.

After publication:

1. reread every output and compare its SHA-256 with its candidate;
2. verify replaced files were approved and no unrequested path changed;
3. roll back the complete set if either check fails;
4. delete the allowlisted temporary files and the exact run workspace;
5. report success only after cleanup succeeds.

## Cleanup and Workspace Ownership

At the end of every successful or failed run, delete only:

- the allowlisted publication temporary files created by this run;
- the exact run workspace directory recorded at creation.

Before deleting the workspace, verify that its canonical path is inside the
output directory, that it matches the recorded run path exactly, and that its
`.synthesize-run-id` marker contains this run's ID. Never delete the source, a
published output, a pre-existing file, another run's directory, an unresolved
path, or a wildcard. A workspace whose marker is missing or belongs to another
run is not owned by this run: report its exact path with `SYN-STALE-WORKSPACE`
and leave it untouched.

## Canonical Errors

Return the exact string `Synthesis error: <CODE> — <message>` and then the
recovery action. Use one code per failure. Codes marked `advisory` report a
condition and continue only through their explicit gate; all others terminate
the current run.

| Code | Canonical message | Recovery |
| --- | --- | --- |
| `SYN-SOURCE-MISSING` | source path not found | Ask for one valid local path. |
| `SYN-SOURCE-NOT-REGULAR` | source is not a local regular file | Reject directories, symlinks, URLs, globs, and device files; request one local regular file. |
| `SYN-MULTIPLE-SOURCES` | more than one source supplied | Ask the user to select one source; do not merge them. |
| `SYN-FORMAT-UNSUPPORTED` | format cannot be extracted completely | State the detected format and the missing extraction capability. |
| `SYN-ENCRYPTED` | source is encrypted or password-protected | Ask for an accessible copy; never bypass protection. |
| `SYN-OCR-REQUIRED` | text layer absent and optical character recognition unavailable | Stop and state that complete extraction cannot be proven. |
| `SYN-EXTRACTION-INCOMPLETE` | extraction is partial or truncated | Stop before synthesis and identify the missing range. |
| `SYN-SOURCE-EMPTY` | source contains no extractable knowledge | Stop without creating outputs. |
| `SYN-SOURCE-CHANGED` | source changed during the run | Publish nothing, clean up, and ask the user to run again. |
| `SYN-OUTPUT-DIR-UNWRITABLE` | output directory is not writable | Stop before creating the run workspace. |
| `SYN-TOOL-MISSING` | required hashing, counting, or extraction command unavailable | State the missing capability and stop. |
| `SYN-SCHEMA-UNSUPPORTED` | staged input declares an unsupported schema version | Ask for an input generated by a supported version. |
| `SYN-STAGE-MISMATCH` (advisory) | suffix and frontmatter stage disagree | Treat the file as an original source, or ask for the intended input. |
| `SYN-NAME-AMBIGUOUS` | reserved-suffix name not approved | Show computed names again and require `Approve names` or one replacement stem. |
| `SYN-TARGET-UNSAFE` | target path fails a safety check | Stop; do not repair the path. |
| `SYN-OVERWRITE-DECLINED` | overwrite not approved | Stop; require exact `Approve overwrite` for the complete collision set. |
| `SYN-PROFILE-ILLEGAL` | profile has no legal descendant for this input | Explain the legal profiles for the staged input and stop. |
| `SYN-READONLY-UNAVAILABLE` | read-only agent capability unavailable | Perform the role with parent read-only tools, or stop when complete coverage is impossible. |
| `SYN-REVIEW-LENS-UNAVAILABLE` | required review lens failed response validation twice | Publish nothing and report the failed lens. |
| `SYN-EXTRACTION-AGENT-FAILED` | extraction agent failed after one retry | Stop when shard coverage is incomplete. |
| `SYN-EVIDENCE-GAP` | required evidence missing at a gate | Reissue once with the named missing evidence, then publish nothing. |
| `SYN-BLOCKER-UNRESOLVED` | blocker remains after two repair rounds | Publish nothing and clean the exact run workspace. |
| `SYN-QUOTATION-LIMIT` | candidate reproduces more than 25 consecutive source words | Rewrite the span, or record a minimum correctness exemption. |
| `SYN-SIZE-INFEASIBLE` | stage cannot satisfy its bounds and its safety content | Publish nothing and suggest the next smaller profile. |
| `SYN-STE-UNAVAILABLE` | simplification agent or Simplified Technical English Coach unavailable | Publish nothing; offer a `-no-simplified` profile variant in a new run. |
| `SYN-SECRET-MATERIAL` | secret or sensitive personal data is material | Ask for a sanitized copy; do not reproduce it. |
| `SYN-STALE-WORKSPACE` (advisory) | unowned run workspace found | Report its exact path for manual inspection; do not delete or reuse it. |
| `SYN-PUBLISH-FAILED` | publication or verification failed | Restore the complete pre-run target set and verify restoration. |
| `SYN-CLEANUP-FAILED` | cleanup failed | Report the exact temporary path and do not claim complete success. |
| `SYN-NANO-TERMINAL` | nano is terminal | Ask for the full or mini layer instead. |
| `SYN-SIMPLIFIED-INPUT` | simplified is a presentation artifact | Ask for the mini layer instead. |

## Examples

### Default full pipeline

`Synthesize ./architecture.pdf without provenance.`

Produces, under `complete`:

- `architecture.full.md`
- `architecture.mini.md`
- `architecture.nano.md`
- `architecture.simplified.md`

### Stop after mini

`Synthesize ./handbook.epub through mini and maintain provenance.`

Produces full, mini, and simplified outputs.

### Continue from full

`Synthesize ./handbook.full.md through nano without provenance.`

Produces mini, simplified, and nano outputs.

### Coach unavailable

`Synthesize ./handbook.epub.`

The preflight probe cannot read `agents/ste-coach.agent.md`, so the run stops
with `SYN-STE-UNAVAILABLE` before extraction and offers
`complete-no-simplified`, which produces full, mini, and nano outputs.
