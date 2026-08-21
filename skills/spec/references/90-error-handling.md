---
includes: []
requires-skills: []
---
# Error Handling

- **Missing tracker, domain, or triage guidance:** Stop and direct the user to `/setup-jdylanmc-skills`.
- **Ambiguous Discovery source:** Ask which map or source to specify.
- **No Discovery map:** Use conversation-only synthesis only when the route is demonstrably settled; otherwise recommend `/discovery`.
- **Material Blocker:** Stop and identify the missing decision.
- **Testing seams unconfirmed:** Do not finalize or publish.
- **Approval withheld:** Make no tracker write; retain the preview for revision.
- **Duplicate found:** Update the existing specification.
- **Concurrent modification:** Refresh and reconcile; never overwrite newer state blindly.
- **Provider operation unavailable:** Apply only the documented fallback or stop.
- **Verification mismatch:** Show expected and actual results and do not claim success.
- **Sensitive content:** Exclude it from publication and warn the user.
- **Request to reopen a settled decision:** Redirect to `/discovery` or `/interrogate`.
