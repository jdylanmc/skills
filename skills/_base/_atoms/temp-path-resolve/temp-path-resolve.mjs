#!/usr/bin/env node
/**
 * The one entry point for resolving a bounded temporary destination.
 *
 * Exit 0 prints the resolved directory and proposed file path as JSON. Any
 * non-zero exit prints a stable failure category on standard error.
 */

import {
  DEFAULT_CHILD_DIRECTORY,
  isDirectInvocation,
  parseFlags,
  resolveHandoffPath,
  runEntryPoint,
} from '../../_molecules/persist-bounded-handoff/persist-bounded-handoff.mjs';

const USAGE = 'Usage: temp-path-resolve.mjs --slug <slug> [--child <name>] [--probe]';

export function run(argv) {
  const parsed = parseFlags(argv, { values: { '--slug': 'slug', '--child': 'child' } }, USAGE);
  const resolved = resolveHandoffPath({
    slug: parsed.slug,
    child: parsed.child ?? DEFAULT_CHILD_DIRECTORY,
  });
  return `${JSON.stringify(resolved, null, 2)}\n`;
}

if (isDirectInvocation(import.meta.url)) {
  runEntryPoint(process.argv.slice(2), run);
}
