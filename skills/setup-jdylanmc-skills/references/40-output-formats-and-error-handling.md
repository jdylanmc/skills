# Output Formats and Error Handling

## Agent Skills Block

Use the agent-skills seed and include:

- Issue tracker;
- Triage labels;
- Domain docs.

Each subsection contains one concise summary and a relative link to its `docs/agents/` file.

## Tracker Guidance

The selected issue-tracker document must define:

- provider and client;
- repository, organization, or project targeting;
- create, read, list/query, comment, update, label/tag, assign, and close operations;
- how a skill publishes an issue;
- how a skill fetches a referenced ticket;
- pull requests as request surface when applicable, defaulted to `no`;
- provider-specific Discovery operations.

Use linked human-readable ticket titles in prose. Use numeric or machine identifiers only in commands, APIs, metadata, and disambiguation.

## Domain Guidance

The domain document must define:

- selected layout;
- where glossaries and Architecture Decision Records live;
- how consumers identify the relevant context;
- glossary-only boundaries for `CONTEXT.md`;
- lazy file creation;
- the strict Architecture Decision Record qualification gate.

## Error Handling

- **Not a Git repository:** Report the limitation and ask whether to continue using filesystem evidence.
- **Inspection command unavailable:** Use readable configuration files when possible and lower confidence.
- **Conflicting remotes:** Present each candidate and ask which tracker governs.
- **No remote or tracker account:** Recommend Local-only Markdown and explain that all issues and Discovery artifacts remain under `.scratch/`.
- **Tracker client unavailable:** The provider may still be selected, but record the missing prerequisite.
- **Azure DevOps process metadata unavailable:** Do not guess work-item types or terminal states; resolve placeholders before writing.
- **Existing triage mapping incomplete:** Recommend defaults for missing roles and preserve confirmed overrides.
- **Both root context files present:** Surface the ambiguity before selecting a layout.
- **Partial prior setup:** Reuse compatible sections and preview conflicts.
- **No instruction file:** Ask whether to create `CLAUDE.md` or `AGENTS.md`.
- **Write failure:** Stop and report affected files; do not claim completion.
- **Verification mismatch:** Show expected versus actual content and require a new decision before further edits.

## Completion Message

Report:

- created and modified files;
- selected issue tracker;
- the configured triage-label vocabulary;
- selected domain layout;
- which engineering skills now consume each file;
- that direct edits are supported;
- when rerunning setup is useful.
