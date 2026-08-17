# Delegation and Concurrency

Delegate bounded, independent fact-finding aggressively so user interaction is reserved for decisions. Launch at most one read-only subagent per independent ready research question, never more agents than the selected branch has such questions, and do not spawn speculative research for another branch.

## Delegate

Good subagent scopes include:

- repository or architecture evidence for one question;
- documentation or external-system research for one question;
- prior-art and test-seam discovery;
- independent validation of assumptions;
- reconciliation of one evidence set into a concise cited result.

Give each subagent:

- the Destination and selected branch;
- one bounded question and a clear stop condition;
- authoritative sources to prefer;
- read-only constraints;
- the required evidence and limitation format;
- the owning ticket or artifact link.

Require a read-only agent type or tool profile when the runtime supports one. If capability restriction is unavailable, do not delegate evidence that could trigger external or repository mutations; perform it with read-only parent tools or obtain explicit user direction.

## Keep in the Parent Loop

Do not delegate:

- user decisions or approval;
- tracker, domain, specification, or Shared Understanding mutations;
- cross-branch prioritization;
- final reconciliation of conflicting findings;
- the decision that a branch is clear and crisp.

## Parallelism Rules

Launch independent research tasks together. Do not parallelize work when:

- one result determines another task's scope;
- two actors could mutate the same artifact;
- the work depends on the same unresolved user decision;
- concurrent publication could produce duplicate tickets or specifications.

Research agents return evidence; they do not close tickets or settle decisions. Reconcile all results in the parent loop before invoking an owning skill's update gate.

If a subagent fails, retry only when the failure is transient and the scope remains valid. Otherwise narrow the question, use another authoritative source, or record the limitation. Never convert missing research into a confident assumption.
