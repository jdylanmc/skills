---
includes: []
requires-skills: []
---
# Relationship Tracing Workflow

## 1. Establish the Frame

Restate the target and select the depth defined in the role reference. If the user names a symbol or file, identify its containing module and move one level upward before tracing details.

For a repository-wide request, identify:

- deployable or runnable units;
- primary and secondary entry points;
- workspace or package boundaries;
- major domain or feature modules;
- shared infrastructure and external integrations.

## 2. Select Execution Anchors

Choose the smallest set of anchors that explains the target:

- request handlers, commands, jobs, event consumers, user actions, or startup paths;
- public interfaces and exported entry points;
- state stores, repositories, clients, queues, or persistence boundaries;
- representative tests that enter through the highest useful seam.

Do not begin with an unbounded file inventory.

## 3. Trace Relationships

For each anchor:

1. Read the definition and its containing module.
2. Identify direct callers and the route by which execution reaches it.
3. Identify direct callees and group them by domain responsibility.
4. Identify state read or written, including ownership and lifecycle.
5. Identify data transformations and boundary crossings.
6. Identify external systems, processes, packages, or platform services.
7. Identify tests that demonstrate the expected behavior.
8. Continue one hop at a time until the user-visible result, durable side effect, or stable subsystem boundary is reached.

Record dependency direction. Distinguish compile-time imports, runtime calls, asynchronous messages, configuration wiring, and ownership relationships instead of treating them as equivalent.

## 4. Cross-Check the Shape

Before synthesizing:

- confirm each claimed entry point from configuration or callers;
- confirm each major responsibility from multiple representative members when possible;
- check reverse callers for hidden consumers;
- check derived types, interface implementations, registrations, or dependency-injection wiring when dispatch is indirect;
- check event producers and consumers when flow is asynchronous;
- check error and fallback paths that materially alter the architecture;
- compare intended boundaries with actual dependency direction.

Stop when additional files repeat an established pattern without changing the map.

## 5. Identify Reading Order

Select a short, ordered path through the code for a developer learning the area. Begin with the entry point or public contract, then follow the main execution path, state boundary, integration boundary, and representative test.

The reading order is a guided tour, not a list of every relevant file.
