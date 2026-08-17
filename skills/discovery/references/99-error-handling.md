# Error Handling

- **Missing tracker guidance:** Direct the user to `/setup-jdylanmc-skills`; offer an explicitly confirmed local-only fallback; never invent provider behavior.
- **Ambiguous mode:** Ask whether to chart a new map or work an existing one.
- **Duplicate map:** Offer to resume the matching Destination map rather than creating another.
- **Effort too small:** Do not chart when the route is already clear and fits one session.
- **Frontier empty with open work:** Report blockers, assignments, or research in flight. Do not invent tickets.
- **Selected ticket changed concurrently:** Recompute the frontier or stop and report the newer state.
- **Claim failure:** Do no work. Refresh and choose again.
- **Approval withheld:** Make no consequential write. Keep the preview available for revision.
- **Partial creation or update failure:** Re-query current state and resume idempotently without duplication.
- **Map verification mismatch:** Stop, show expected and actual state, and do not claim success.
- **Missing ticket capability:** Apply the documented fallback and disclose it.
- **Execution requested without Notes permission:** Decline implementation and recommend handoff or an explicit Notes change through the approval gate.
- **Research result contradicts a settled decision:** Reopen the affected ticket only when the conflict is material; preview downstream invalidation before editing.
- **User stops after claim:** Offer or perform the authorized safe release of the agent's own claim and report unfinished work.
