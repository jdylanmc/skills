---
includes: []
requires-skills: []
---
# Examples and Error Handling

## Example: Unfamiliar Symbol

**Request:** "I do not understand `SessionCoordinator`. Show me where it fits."

Behavior:

1. Read the symbol, containing module, repository guidance, and domain vocabulary.
2. Move up to the owning subsystem.
3. Trace production callers, important callees, state access, integrations, and representative tests.
4. Return a focused architecture map and reading order without writing files.

## Example: Feature Flow

**Request:** "Break down the architecture behind checkout."

Behavior:

1. Locate the user or system entry points for checkout.
2. Trace orchestration, domain decisions, persistence, payment integration, events, and result handling.
3. Show fan-out, asynchronous boundaries, and major error paths.
4. Distinguish intended boundaries from actual dependency direction.

## Example: Persisted Repository Map

**Request:** "Map this repository and save the result."

Behavior:

1. Establish workspace, process, and entry-point boundaries.
2. Produce the repository-level map.
3. Propose an existing architecture document or `docs/architecture/repository.md`.
4. Preview the complete write and wait for `Approve and write`.
5. Re-read, write, and verify only after approval.

## Error Handling

- **No target supplied:** Use the repository as the target when the request clearly asks for onboarding or a codebase map. Otherwise ask for the symbol, feature, flow, or subsystem to map.
- **Repository instructions unavailable:** Continue with accessible evidence and state that repository-specific conventions could not be verified.
- **Domain guidance unavailable:** Use observed code vocabulary and mark it as provisional.
- **Code intelligence unavailable:** Fall back to definitions, imports, references, registrations, configuration, and precise text searches; lower confidence for dynamic dispatch.
- **Ambiguous or overloaded symbol:** Present the candidates with paths and ask the user to select one before tracing.
- **Generated or inaccessible code owns a boundary:** Map the visible caller and contract, mark the hidden implementation as unknown, and do not reconstruct it.
- **Conflicting documentation and code:** Report an intent-versus-implementation divergence with evidence from both.
- **Very large repository:** Map runnable units and major boundaries first, then fully trace one representative flow per unit. State what was sampled.
- **No callers found:** Check exports, reflection, registration, dependency injection, event wiring, scripts, and tests before concluding the symbol is unused.
- **Persistence requested without an established path:** Propose the default path and require preview approval; do not guess silently and write.
- **File changed after preview:** Abort the write, explain the conflict, and produce a refreshed preview.
