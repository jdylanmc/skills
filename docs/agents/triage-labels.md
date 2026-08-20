# Triage Label Vocabulary

This repository's engineering skills use five canonical triage roles. Every role maps to exactly one GitHub label.

| Canonical role | GitHub label |
| --- | --- |
| `needs-triage` | `needs-triage` |
| `needs-info` | `needs-info` |
| `ready-for-agent` | `ready-for-agent` |
| `ready-for-human` | `ready-for-human` |
| `wontfix` | `wontfix` |

## Consumer Rules

- Read this mapping before applying or removing triage state.
- Reuse configured strings exactly.
- Do not create a near-duplicate label when a canonical role already maps to existing tracker vocabulary.
- Preserve unrelated labels.
- Treat this mapping as vocabulary, not proof that the GitHub labels already exist.
