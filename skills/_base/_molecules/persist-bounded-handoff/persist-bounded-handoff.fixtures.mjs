/**
 * Shared fixtures for the bounded-handoff suites.
 *
 * The sandbox points the runtime's temporary directory at a repository-local
 * scratch root. The suites then exercise the real resolution path without
 * touching the machine's shared temporary directory, which also proves that
 * resolution follows the runtime rather than a hard-coded location.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const REPOSITORY_ROOT = path.resolve(HERE, '../../../..');
export const SANDBOX_ROOT = path.join(REPOSITORY_ROOT, '.test-sandbox');
export const ATOMS = path.join(REPOSITORY_ROOT, 'skills', '_base', '_atoms');
export const MOLECULE_ENTRY = path.join(HERE, 'persist-bounded-handoff.mjs');

/**
 * Suites run in separate processes, so one suite can remove the shared
 * scratch root between another suite's `mkdirSync` and its `mkdtempSync`.
 * Only that exact race is retried; anything else is a real failure.
 */
function makeSandboxRoot(label) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    fs.mkdirSync(SANDBOX_ROOT, { recursive: true });
    try {
      return fs.realpathSync(fs.mkdtempSync(path.join(SANDBOX_ROOT, `${label}-`)));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
  throw new Error(`could not create a sandbox for ${label} beneath ${SANDBOX_ROOT}`);
}

/**
 * Removes the shared scratch root once the last sandbox inside it is gone, so
 * a test run leaves the working tree exactly as it found it. A root another
 * suite still owns, or one another suite already removed, is left alone.
 */
function removeSandboxRootIfEmpty() {
  try {
    fs.rmdirSync(SANDBOX_ROOT);
  } catch (error) {
    if (!['ENOTEMPTY', 'ENOENT', 'EEXIST', 'EBUSY', 'EPERM'].includes(error.code)) {
      throw error;
    }
  }
}

export function sandbox(t, label) {
  const root = makeSandboxRoot(label);
  const previous = { TMPDIR: process.env.TMPDIR, TEMP: process.env.TEMP, TMP: process.env.TMP };
  for (const key of ['TMPDIR', 'TEMP', 'TMP']) {
    process.env[key] = root;
  }
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    fs.rmSync(root, { recursive: true, force: true });
    removeSandboxRootIfEmpty();
  });
  return root;
}

export function sandboxEnvironment(root) {
  return { ...process.env, TMPDIR: root, TEMP: root, TMP: root };
}

export function completePayload(overrides = {}) {
  return {
    slug: 'skills-issue-43',
    goal: 'Establish the shared bounded-handoff core.',
    current_progress: 'Five atoms and one molecule exist.',
    decisions_and_constraints: 'The shared core owns rendering and writing.',
    artifacts_and_references: [
      { reference: 'https://github.com/jdylanmc/skills/issues/43', note: 'The issue' },
      'docs/adr/0001-use-local-units-and-promote-proven-shared-units.md',
    ],
    what_worked: 'Deterministic bounds.',
    what_did_not_work: 'A single generic write atom.',
    next_steps: 'Wire the wrapper and the orchestrator.',
    ...overrides,
  };
}

export function headingsOf(document) {
  return document
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.slice(3));
}

/**
 * Windows refuses symbolic links without the right privilege, so a suite that
 * needs one asks first and skips rather than failing the platform.
 */
export function trySymlink(target, linkPath, type) {
  try {
    fs.symlinkSync(target, linkPath, type);
    return true;
  } catch (error) {
    if (['EPERM', 'EACCES', 'ENOSYS', 'UNKNOWN'].includes(error.code)) {
      return false;
    }
    throw error;
  }
}

export function failureOf(code) {
  return (error) => error.code === code;
}
