# Directive: Review the Submitted Tests

Focus on the tests included with the reviewed pull request, diff, commit range,
working-tree change, named files, or pasted code.

First determine:

- which production behaviors changed;
- which test files changed;
- which requirements, contracts, or expected behaviors govern the change;
- which existing test framework and conventions apply;
- which relevant continuous-integration results are available.

## When No Tests Are Present

Do not stop at "add tests." Recommend the smallest risk-based test plan that
would prove the changed behavior and prevent its most credible regressions.

For each recommended test, state:

- behavior or requirement proved;
- setup and inputs;
- action or event;
- expected observable result;
- failure the test would catch;
- appropriate test level: unit, integration, contract, end-to-end, or another
  repository-supported seam;
- priority and rationale.

Do not demand exhaustive coverage. Prioritize tests by consequence and
regression likelihood.

## When Tests Are Present

Nitpick the submitted tests. Verify that they would fail for the defect or
behavior they claim to cover and pass only when the implementation is correct.

Review:

- mapping from changed behavior to test coverage;
- happy path, boundaries, empty and null states, invalid inputs, and wrong
  types;
- error handling, timeouts, permission denial, and degraded dependencies;
- state transitions, repeated operations, idempotency, concurrency, and race
  conditions when applicable;
- assertion strength and whether expected outcomes are observable;
- tautological tests and assertions that merely restate fixtures or mocks;
- false positives caused by broad matching, swallowed errors, or missing awaits;
- determinism, timing, ordering, cleanup, and shared mutable state;
- readability of scenario and expected-result names;
- fixture realism and independence;
- over-mocking and coupling to private implementation details;
- whether unit, integration, contract, or end-to-end coverage is used at the
  correct seam;
- relevant user-interface states, realistic volume, and accessibility basics
  when the scoped change includes them.

Prefer one assertion per logical concept, not mechanically one assertion per
test. Preserve atomic scenarios.

## Evidence Standard

Use only packet-contained code, tests, contracts, and validation results. Do
not execute tests or claim reproduction that did not occur.

For each accepted critique:

1. identify the changed behavior and submitted test evidence;
2. state what the test proves and what it does not prove;
3. provide the concrete false-positive, missed-regression, flake, or
   maintainability scenario;
4. recommend the smallest test addition or correction that fixes and satisfies
   the critique;
5. state the expected failing signal before the production fix and passing
   signal afterward;
6. preserve the repository's framework, fixtures, naming, and test conventions;
7. define observable validation.

Separate confirmed test defects from lower-confidence test opportunities. If
requirements are ambiguous, report the evidence gap before recommending an
assertion.

## Never

- accept happy-path coverage as complete without checking applicable failure
  paths;
- recommend sleep-based waiting or order-dependent execution;
- recommend skipping or quarantining a flaky test without addressing its cause;
- couple tests to private implementation details without a demonstrated need;
- report "tests are missing" without naming the behaviors and cases to add;
- treat a passing suite as proof when the submitted assertions cannot detect the
  regression.

## Doctrine

Apply these shared doctrine pressures selectively:

- `doctrine/code.doctrine.md` governs risk-matched tests, trust-boundary
  cases, defensive checks, repeatable debugging, and tests or analysis before
  risky refactoring.
- `doctrine/data.doctrine.md` applies when the change
  involves write semantics, retries, replay, duplicates, ordering, schema
  evolution, derived data, stale reads, or distributed failure.
- `doctrine/pragmatic.doctrine.md` governs fast feedback, repairing
  flaky or environment-dependent tests, adding regression protection after a
  human-found defect, and proving unexplained behavior with data.
- `doctrine/domain.doctrine.md` applies when tests should express
  domain invariants, valid construction, allowed or forbidden transitions, or
  cross-context translation in the Ubiquitous Language.

Doctrine guides test selection; it is not evidence that a test is missing or
defective.
