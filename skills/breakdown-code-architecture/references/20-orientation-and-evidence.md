---
includes: []
requires-skills: []
---
# Repository Orientation and Evidence

## Read Guidance First

Before mapping code, locate and read the instructions that govern the target area:

1. repository and nested agent instruction files;
2. configured domain guidance, such as `docs/agents/domain.md`;
3. glossaries and context maps linked from that guidance;
4. Architecture Decision Records (ADRs), design documents, and current specifications relevant to the target;
5. build manifests and entry-point configuration needed to identify runtime units.

Use the project's canonical domain terms in the map. When code uses a legacy or conflicting name, show the code identifier while explaining it with canonical vocabulary. Do not silently rename identifiers or claim that one source is authoritative when evidence conflicts.

If no glossary exists, derive a temporary vocabulary from repeated names in public interfaces and documentation. Label it as observed vocabulary, not confirmed domain language.

## Evidence Priority

Prefer evidence in this order:

1. semantic code relationships and symbol navigation;
2. source definitions and call sites;
3. tests that exercise externally visible behavior;
4. runtime and build configuration;
5. current architecture decisions and design documentation;
6. directory structure and naming;
7. comments and historical notes.

Documentation can express intended architecture while code reveals current behavior. Report meaningful disagreement as **Intent vs. implementation** rather than choosing silently.

## Exploration Rules

- Use code intelligence or language-server relationships when available.
- Fall back to precise symbol and text searches when relationship tools are unavailable.
- Treat relationship tools as optional host capabilities. The declared read and search tools are the guaranteed baseline; lower confidence for dynamic dispatch when only those tools are available.
- Read definitions before interpreting references.
- For important behavior, trace in both directions: what the target calls and what calls the target.
- Follow data and state as well as control flow.
- Read representative tests before describing the supported behavior or test seam.
- Exclude generated, vendored, compiled, cache, and dependency output unless it is itself the runtime artifact being explained.
- In monorepositories, establish workspace and process boundaries before tracing cross-package calls.
- When evidence contains secrets, credentials, tokens, connection strings, or personal data, record only the path, configuration key, and mechanism. Never quote the sensitive value in any output.

## Confidence

Classify material statements as:

- **Verified:** directly supported by code, configuration, a test, or a precise relationship.
- **Interpreted:** the best explanation combining multiple verified observations.
- **Unknown:** evidence is missing, inaccessible, generated elsewhere, or depends on team intent.

Attach concrete paths and symbol names to verified statements. Explain the evidence behind interpretations. Turn unresolved intent into concise questions only when the answer materially changes the map.
