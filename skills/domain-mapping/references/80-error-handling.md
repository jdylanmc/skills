## Error Handling

- **No context artifacts:** Apply the empty-repository default and propose a root `CONTEXT.md`.
- **Missing or inaccessible code:** State what could not be verified. Continue using available evidence without claiming code confirmation.
- **No relevant code:** Explain that the concept appears independent of implementation evidence and use the remaining sources.
- **Conflicting evidence:** Identify each conflict, its source, and the decision the user must resolve.
- **Ambiguous context ownership:** Do not edit. Ask which context owns the concept and explain the plausible choices.
- **Unclear confirmation:** Restate the exact proposed change and wait for explicit approval.
- **Partial confirmation:** Apply only an independently coherent approved portion; otherwise clarify before editing.
- **Malformed glossary:** Preserve unrelated content and make a minimal targeted edit after confirmation.
- **Both root context files present:** Treat the repository structure as ambiguous until the user identifies the intended model.
- **Nonqualifying ADR request:** Explain briefly which qualification condition is absent and suggest a glossary update when appropriate.
- **Existing ADR number collision:** Rescan conforming filenames immediately before writing and choose the next available number.
- **Out-of-scope request:** State the boundary concisely and redirect to domain terminology, context ownership, or ADR qualification when applicable.
