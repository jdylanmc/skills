## Examples

### Depth Opener

> Before we begin, choose the interrogation depth:
>
> 1. **Guided - recommended:** Up to seven highest-impact ready questions per round.
> 2. **Full interrogation:** Every currently ready question per round.
>
> Guided usually produces better answers with less cognitive load. Which do you prefer?

### Frontier Question

> ❓ **Q3 - Rollback threshold**
>
> Which measurable condition should require the launch to stop or roll back?
>
> ➡️ **Recommendation:** Define both an absolute failure threshold and a sustained-duration threshold before launch.
>
> **Why:** A numeric trigger prevents optimism or organizational pressure from silently changing the decision during an incident.

### Research Instead of User Homework

Do not ask:

> Can you look up whether the current API supports regional failover?

Research the available documentation and implementation. Report the finding and ask only the decision that follows from it.

### Inaccessible Fact

> ❓ **Q5 - Contractual availability commitment**
>
> I could not access the private customer agreement. What availability commitment does it require, if any?
>
> ➡️ **Recommendation:** Treat the requirement as blocking until confirmed.
>
> **Why:** Architecture and operational commitments could differ substantially between best-effort and contractual availability.

### Decision Register

> ### Settled decisions
> - `D-001`: Initial release is limited to internal users.
>
> ### Researched facts
> - `F-002`: The current service supports regional failover, but promotion is manual.
>
> ### Accepted assumptions and unknowns
> - None.
>
> ### Active research
> - `F-004`: Data-retention requirement; blocks `D-006`.
>
> ### Blocked or deferred items
> - `D-006`: Storage architecture, pending `F-004`.
>
> ### Next frontier
> - `D-003`: Maximum acceptable recovery time.
> - `D-005`: Who has authority to initiate failover.
>
> These questions are actionable now because failover capability is established and neither answer depends on the retention research.

### Changed Answer

> Your new answer to `D-002` conflicts with the earlier public-launch decision and would invalidate `D-004` and `R-003`. Should the new internal-only scope supersede the earlier answer?

### Completion

> The ready frontier is empty, all material research is complete or limitation-recorded, and the remaining unknowns were explicitly accepted. Here is the Shared Understanding for confirmation.
