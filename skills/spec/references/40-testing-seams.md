# Testing Seams

A testing seam is the boundary through which tests exercise observable behavior.

## Selection Rules

1. Prefer existing seams and fixtures.
2. Prefer the highest external-behavior seam.
3. Minimize the number of seams; one is ideal.
4. Introduce a new seam only when existing seams cannot observe required behavior.
5. Place any new seam at the highest practical architectural point.

## Confirmation Checkpoint

Present one focused seam proposal. For each seam include:

- boundary and test level;
- reason for choosing it;
- prior art in the repository;
- behaviors and modules covered;
- tradeoffs, cost, and blind spots.

Ask whether the seams match the user's expectations.

This is not an interview. If seams were already settled, restate and confirm them.

Do not publish until confirmation is obtained.

## Missing Test Infrastructure

When no existing seam or test prior art exists, propose the highest practical new seam and label it clearly as new.
