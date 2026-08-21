---
includes: []
requires-skills: []
---
# Examples and Scenario Tests

## Plan to Vertical Slices

An approved plan becomes four independent, end-to-end slices. Each provides observable behavior, acceptance criteria, minimal blockers, and the mapped ready state.

## Prefactoring First

A missing public seam makes a behavioral slice difficult. A small green prefactoring ticket is added as its blocker. No unrelated cleanup is included.

## Expand-contract Rename

One Expand ticket blocks three independent migration batches. All batches block Contract.

## Integration Branch

Migration batches cannot stay green alone. They share an integration branch, all block Integrate and Verify, and that ticket blocks Contract.

## Parent Source

Tickets are related to the source specification. The source body, state, and labels remain unchanged.

## Local-only Mode

Each ticket is a separate Markdown file with stable metadata, relative blocker links, acceptance checklists, and the configured ready state.

## Scenario Invariants

A valid run must:

- use linked titles in prose;
- preview before writing;
- require explicit approval;
- publish blockers first;
- create vertical, independently verifiable tickets;
- label every implementation ticket with the configured mapping;
- preserve the source;
- execute no ticket;
- report the frontier.
