/**
 * Chronicle conformance: the caller contract exercised exactly as a consuming
 * skill exercises it, by running the documented commands as child processes.
 *
 * This suite is intentionally black box. It never imports Chronicle internals,
 * so it proves the contract a skill author actually depends on, on every
 * supported operating system.
 *
 * Out of scope by design: power loss, disaster recovery, platform-native
 * append behavior, and any global cross-writer ordering guarantee.
 */

import assert from 'node:assert/strict';
import { execFile, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHRONICLER = path.join(REPOSITORY_ROOT, 'skills', '_base', 'chronicler');
const EMIT = path.join(CHRONICLER, 'scripts', 'emit-event.mjs');
const REPLAY = path.join(CHRONICLER, 'scripts', 'replay-log.mjs');
const VALIDATOR = path.join(REPOSITORY_ROOT, 'scripts', 'validate-skill-graph.mjs');

const RUN_ID = '20260820T120000Z-conformance';
const ROOT_SKILL = 'ship-with-squadron';

function workspace(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'chronicle-conformance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function logPathIn(root) {
  return path.join(root, '.skill-log', `${ROOT_SKILL}.2026-08-20.${RUN_ID}.jsonl`);
}

/** Runs a command the way a consuming skill does, without a shell. */
function runCommand(scriptPath, args) {
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, stdout, stderr: '' };
  } catch (error) {
    return {
      code: typeof error.status === 'number' ? error.status : 1,
      stdout: error.stdout ?? '',
      stderr: error.stderr ?? '',
    };
  }
}

function emitArgs(logPath, overrides = {}) {
  const values = {
    '--log': logPath,
    '--run': RUN_ID,
    '--root-skill': ROOT_SKILL,
    '--event': 'run',
    '--phase': 'before',
    '--summary': 'The run starts.',
    ...overrides,
  };
  return Object.entries(values).flatMap(([flag, value]) => (value === undefined ? [] : [flag, value]));
}

function readRecords(logPath) {
  return fs
    .readFileSync(logPath, 'utf8')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

test('the emit entry point is available on this platform', () => {
  const probe = runCommand(EMIT, ['--probe']);
  assert.equal(probe.code, 0, probe.stderr);
  assert.match(probe.stdout, /chronicle: available/);

  const replayProbe = runCommand(REPLAY, ['--probe']);
  assert.equal(replayProbe.code, 0, replayProbe.stderr);
  assert.match(replayProbe.stdout, /chronicle: available/);
});

test('a root skill records one event with injected attribution', (t) => {
  const logPath = logPathIn(workspace(t));
  const result = runCommand(EMIT, emitArgs(logPath));

  assert.equal(result.code, 0, result.stderr);
  const records = readRecords(logPath);
  assert.equal(records.length, 1);
  assert.equal(records[0].run_id, RUN_ID);
  assert.equal(records[0].root_skill, ROOT_SKILL);
  assert.equal(records[0].skill, ROOT_SKILL);
  assert.equal(records[0].schema_version, 1);
  assert.equal(records[0].sequence, 1);
  assert.ok(Date.parse(records[0].timestamp) > 0);
});

test('a nested skill inherits the run context and shares the same log', (t) => {
  const logPath = logPathIn(workspace(t));

  assert.equal(runCommand(EMIT, emitArgs(logPath)).code, 0);
  assert.equal(
    runCommand(EMIT, emitArgs(logPath, {
      '--skill': 'shepherd',
      '--event': 'pull_request',
      '--phase': 'after',
      '--summary': 'Shepherd merged the pull request.',
      '--outcome': 'succeeded',
    })).code,
    0,
  );

  const replay = runCommand(REPLAY, [logPath, '--log-id', 'conformance-run']);
  assert.equal(replay.code, 0, replay.stderr);
  const state = JSON.parse(replay.stdout);

  assert.equal(state.run_id, RUN_ID);
  assert.equal(state.root_skill, ROOT_SKILL);
  assert.deepEqual(state.skills, ['shepherd', 'ship-with-squadron']);
  assert.equal(state.log_id, 'conformance-run');
});

test('invalid caller input is rejected with a stable category and records nothing', (t) => {
  const logPath = logPathIn(workspace(t));

  const badPhase = runCommand(EMIT, emitArgs(logPath, { '--phase': 'sideways' }));
  assert.equal(badPhase.code, 1);
  assert.match(badPhase.stderr, /^invalid_input:/m);

  const missing = runCommand(EMIT, ['--log', logPath]);
  assert.equal(missing.code, 1);
  assert.match(missing.stderr, /^usage:/m);

  assert.equal(fs.existsSync(logPath), false, 'a rejected event must not create a log');
});

test('an over-long summary is bounded and marked truncated', (t) => {
  const logPath = logPathIn(workspace(t));
  const result = runCommand(EMIT, emitArgs(logPath, {
    '--phase': 'observation',
    '--summary': 'y'.repeat(2000),
  }));

  assert.equal(result.code, 0, result.stderr);
  const [record] = readRecords(logPath);
  assert.equal(record.truncated, true);
  assert.ok(Buffer.byteLength(record.summary, 'utf8') <= 500);
  assert.ok(Buffer.byteLength(JSON.stringify(record), 'utf8') <= 4096);
});

test('ordinary concurrent writers all land in the log and remain readable', async (t) => {
  const logPath = logPathIn(workspace(t));
  const writers = 12;

  await Promise.all(
    Array.from({ length: writers }, (_, index) => execFileAsync(process.execPath, [
      EMIT,
      ...emitArgs(logPath, {
        '--skill': `worker-${index}`,
        '--event': 'ticket',
        '--phase': 'observation',
        '--summary': `Worker ${index} reported progress.`,
      }),
    ])),
  );

  const records = readRecords(logPath);
  assert.equal(records.length, writers, 'every concurrent record must survive');
  assert.deepEqual(
    [...new Set(records.map((record) => record.run_id))],
    [RUN_ID],
    'concurrent writers must not corrupt run identity',
  );
  assert.deepEqual(
    records.map((record) => record.skill).sort(),
    Array.from({ length: writers }, (_, index) => `worker-${index}`).sort(),
  );

  // Ordering is internal. A concurrent run may record a sequence that
  // disagrees with log position; replay must surface that rather than hide it,
  // and must still return every record.
  const replay = runCommand(REPLAY, [logPath, '--log-id', 'concurrent']);
  assert.equal(replay.code, 0, replay.stderr);
  const state = JSON.parse(replay.stdout);
  assert.equal(state.event_count, writers);
  assert.ok(state.defects.every((defect) => defect.type === 'sequence_anomaly'));
  assert.equal(state.complete, state.defects.length === 0);
});

test('an unusable log is reported and the caller can continue', (t) => {
  const root = workspace(t);
  const blocker = path.join(root, 'blocker');
  fs.writeFileSync(blocker, 'not a directory\n');

  const failed = runCommand(EMIT, emitArgs(path.join(blocker, 'nested', 'run.jsonl')));
  assert.equal(failed.code, 1);
  assert.match(failed.stderr, /^log_unavailable:/m);

  // Delivery continues: a later event to a usable log still records.
  const recovered = runCommand(EMIT, emitArgs(logPathIn(root)));
  assert.equal(recovered.code, 0, recovered.stderr);
});

test('replay of the same selected log is deterministic', (t) => {
  const logPath = logPathIn(workspace(t));
  const start = runCommand(EMIT, emitArgs(logPath, { '--operation': 'ticket-1' }));
  assert.equal(start.code, 0, start.stderr);
  const finish = runCommand(EMIT, emitArgs(logPath, {
    '--phase': 'after',
    '--summary': 'The run finished.',
    '--operation': 'ticket-1',
    '--outcome': 'succeeded',
    '--evidence': 'PR-42',
  }));
  assert.equal(finish.code, 0, finish.stderr);

  const first = runCommand(REPLAY, [logPath, '--log-id', 'deterministic']);
  const second = runCommand(REPLAY, [logPath, '--log-id', 'deterministic']);

  assert.equal(first.code, 0, first.stderr);
  assert.equal(first.stdout, second.stdout);

  const state = JSON.parse(first.stdout);
  assert.equal(state.complete, true);
  assert.deepEqual(state.operations, [
    { operation: 'ticket-1', skill: ROOT_SKILL, started: 'L1', completed: 'L2', outcome: 'succeeded' },
  ]);
});

test('a malformed record is reported and never repaired', (t) => {
  const logPath = logPathIn(workspace(t));
  const first = runCommand(EMIT, emitArgs(logPath));
  assert.equal(first.code, 0, first.stderr);
  fs.appendFileSync(logPath, 'this line is not json\n');
  const second = runCommand(EMIT, emitArgs(logPath, { '--phase': 'after', '--summary': 'The run finished.' }));
  assert.equal(second.code, 0, second.stderr);

  const before = fs.readFileSync(logPath, 'utf8');
  const replay = runCommand(REPLAY, [logPath, '--log-id', 'malformed']);
  assert.equal(replay.code, 0, replay.stderr);

  const state = JSON.parse(replay.stdout);
  assert.equal(state.complete, false);
  assert.equal(state.event_count, 2);
  assert.ok(state.defects.some((defect) => defect.type === 'malformed_record' && defect.anchor === 'L2'));
  assert.equal(fs.readFileSync(logPath, 'utf8'), before, 'replay must not rewrite the selected log');
});

test('replay reports a selection it cannot read at all', (t) => {
  const missing = runCommand(REPLAY, [path.join(workspace(t), 'absent.jsonl')]);
  assert.equal(missing.code, 1);
  assert.match(missing.stderr, /^log_unavailable:/m);
});

test('the Chronicle base stays out of skill routing and keeps a complete dependency closure', () => {
  const validation = runCommand(VALIDATOR, []);
  assert.equal(validation.code, 0, validation.stderr);
  assert.match(validation.stdout, /Validated \d+ participating Markdown files/);

  assert.equal(
    fs.existsSync(path.join(CHRONICLER, 'SKILL.md')),
    false,
    'a non-routable base must never contain SKILL.md',
  );

  const routable = fs
    .readdirSync(path.join(REPOSITORY_ROOT, 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(REPOSITORY_ROOT, 'skills', entry.name, 'SKILL.md')))
    .map((entry) => entry.name);

  assert.equal(routable.includes('_base'), false, '_base must not appear in the routable inventory');
});

test('the log path convention documented for consumers is what consumers can use', (t) => {
  const root = workspace(t);
  const logPath = logPathIn(root);
  assert.equal(runCommand(EMIT, emitArgs(logPath)).code, 0);

  assert.equal(path.basename(path.dirname(logPath)), '.skill-log');
  assert.match(path.basename(logPath), /^ship-with-squadron\.\d{4}-\d{2}-\d{2}\..+\.jsonl$/);
  assert.ok(fs.existsSync(logPath));
});

test('Ship with Squadron composes Chronicle through a complete dependency closure', async () => {
  const { validateRepository, closureFor } = await import(
    path.join(REPOSITORY_ROOT, 'scripts', 'validate-skill-graph.mjs')
  );
  const result = validateRepository(REPOSITORY_ROOT);
  const closure = closureFor(result, 'ship-with-squadron/SKILL.md');

  assert.ok(closure.includes('_base/chronicler/BASE.md'), 'the consumer must reach the Chronicle base');
  assert.ok(closure.includes('ship-with-squadron/references/25-run-recording.md'));
  assert.ok(
    result.routableSkills.includes('ship-with-squadron'),
    'the consumer stays routable while its base does not',
  );
});

test('Squadron Control State holds current state only, not a duplicate history', () => {
  const controlState = fs.readFileSync(
    path.join(REPOSITORY_ROOT, 'skills/ship-with-squadron/references/20-control-state-and-state-machine.md'),
    'utf8',
  );

  assert.match(controlState, /`control\.json`/);
  assert.doesNotMatch(controlState, /events\.jsonl|snapshots\//);
});

function sectionBody(contents, heading) {
  const lines = contents.split('\n');
  const start = lines.findIndex((line) => line.trim() === heading);
  assert.notEqual(start, -1, `expected a ${heading} section`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^## /.test(line));
  return (end === -1 ? rest : rest.slice(0, end)).join('\n');
}

test('control-state failure and recording failure keep opposite delivery semantics', () => {
  const controlState = fs.readFileSync(
    path.join(REPOSITORY_ROOT, 'skills/ship-with-squadron/references/20-control-state-and-state-machine.md'),
    'utf8',
  );
  const recording = fs.readFileSync(
    path.join(REPOSITORY_ROOT, 'skills/ship-with-squadron/references/25-run-recording.md'),
    'utf8',
  );

  // Structural, not prose matching: the control-state failure procedure must
  // stop delivery, and the recording failure procedure must continue it.
  const controlFailure = sectionBody(controlState, '## Control-State Failure');
  assert.match(controlFailure, /\bstop\b/i);
  assert.doesNotMatch(controlFailure, /\bcontinue claiming\b/i);

  const recordingFailure = sectionBody(recording, '## Recording Failure');
  assert.match(recordingFailure, /\bcontinue\b/i);
  assert.doesNotMatch(recordingFailure, /\bblock\w* delivery\b/i);

  assert.match(sectionBody(recording, '## Boundary'), /never authorizes/i);
});

test('run recording pairs exactly one intent and one outcome per ticket', () => {
  const recording = fs.readFileSync(
    path.join(REPOSITORY_ROOT, 'skills/ship-with-squadron/references/25-run-recording.md'),
    'utf8',
  );
  const rows = recording
    .split('\n')
    .filter((line) => line.startsWith('| ') && !line.includes('---') && !line.includes('| Phase |'));

  const afterTicketRows = rows.filter((row) => row.includes('`after`') && row.includes('the ticket key'));
  const beforeTicketRows = rows.filter((row) => row.includes('`before`') && row.includes('the ticket key'));

  assert.equal(beforeTicketRows.length, 1, 'a ticket must record exactly one intent');
  assert.equal(afterTicketRows.length, 1, 'a ticket must record exactly one outcome');
});

test('consumer instructions expose no Chronicle storage or platform mechanics', () => {
  const consumerFiles = [
    path.join(REPOSITORY_ROOT, 'skills/ship-with-squadron/SKILL.md'),
    ...fs
      .readdirSync(path.join(REPOSITORY_ROOT, 'skills/ship-with-squadron/references'))
      .map((name) => path.join(REPOSITORY_ROOT, 'skills/ship-with-squadron/references', name)),
  ];

  const forbidden = /fsync|O_APPEND|power.?loss|disaster recovery|native append|stream_closed|parent_stream|hash chain|retention engine/i;
  for (const file of consumerFiles) {
    const contents = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(contents, forbidden, `${path.basename(file)} must not expose recording internals`);
  }
});
