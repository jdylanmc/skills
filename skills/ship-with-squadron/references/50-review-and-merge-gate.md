# Review and Merge Gate

## Exact-Head Roast Gate

Roast approval is valid only when:

- the official Roast This Code workflow completed successfully;
- the canonical recommendation package identifies the current source head;
- the evidence packet is complete and fresh;
- no accepted `Must fix` remains;
- every blocking `Should fix` disposition is explicit and policy-consistent;
- no source file, target revision, repository instruction, or relevant
  contract changed after packet capture.

Any pull-request head change invalidates the entire gate. Reviewer count,
worker confidence, previous approval, or elapsed time cannot substitute for a
fresh exact-head package.

The assigned worker owns refreshed Roast and Shepherd evidence through merge
or timeout. The Primary and Coordinator can invalidate a stale authorization
but do not manufacture replacement review evidence.

## Mechanical Readiness Gate

Use a fresh provider snapshot and Shepherd's readiness contract. Require:

- the pull request is open and not a draft;
- source and target revisions are fresh and conflict-free;
- target-update requirements are satisfied;
- every required check and policy passes;
- no required result is missing, stale, cancelled, or pending;
- required human approvals are present;
- no requested-changes review remains effective;
- no unresolved actionable thread remains.

Roast approval and mechanical readiness are independent. Both must pass on the
same source head.

## Merge Authorization Record

Immediately before merge, the authorized actor writes:

- actor: `user`, `primary`, or `coordinator`;
- provider and pull-request key;
- expected source head and target head;
- Roast packet and recommendation identifiers;
- Shepherd snapshot marker;
- required-check and approval summaries;
- authorization timestamp and expiry at the first relevant state change.

Workers cannot create this record.

Represent each gate as `PASS`, `FAIL`, or `UNKNOWN`. Record its observed source
head, provider update marker, timestamp, and evidence identifier. `FAIL` or
`UNKNOWN` prevents authorization.

## Guarded Squash Merge

Only the user, Primary, or Coordinator may merge.

The authorized actor:

1. refreshes provider state;
2. verifies the source head exactly matches the authorization record;
3. verifies the target and provider update marker have not invalidated
   readiness;
4. verifies the ticket remains owned by this run;
5. performs a provider-native squash merge with an expected-head guard when
   available;
6. refuses any merge method other than squash;
7. rereads the pull request and target branch;
8. records the provider-confirmed merge commit;
9. updates the tracker according to repository policy;
10. recomputes the entire root graph.

After provider-confirmed merge, notify the assigned worker. The worker returns
`MERGED` and terminates. If the merge or notification races with the total
deadline, provider-confirmed merge wins; otherwise the timeout contract starts.

If the provider lacks an expected-head merge option, refresh immediately before
the merge command and immediately after it. Abort on any intervening source or
target change. Never bypass branch protection, administrator-enforce a merge,
dismiss a review, or mark a missing signal as passing.

## External Merge

If the user or another authorized actor merges outside the Coordinator:

1. detect it during reconciliation;
2. verify the merged head and method;
3. invalidate any in-flight merge attempt;
4. record the external actor when available;
5. update the graph and refill capacity.

An unauthorized worker merge is a run-integrity failure. Stop that worker,
preserve evidence, and escalate to the user.
