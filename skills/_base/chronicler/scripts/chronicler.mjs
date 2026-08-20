/**
 * Chronicle: bounded Skill Run Log recording and replay.
 *
 * Callers supply meaningful event data and an inherited run context. This
 * module owns the persisted envelope: schema version, attribution, timestamp,
 * recorded sequence, validation, bounds, and ordinary file input and output.
 *
 * Ordering is internal. Replay treats the physical line order of the log as
 * authoritative and reports a recorded sequence that disagrees with it as a
 * defect rather than silently reordering or repairing the evidence.
 */

import fs from 'node:fs';
import path from 'node:path';

export const SCHEMA_VERSION = 1;
export const MAX_SUMMARY_BYTES = 500;
export const MAX_REFERENCE_BYTES = 200;
export const MAX_IDENTIFIER_BYTES = 100;
export const MAX_EVIDENCE_ITEMS = 10;
export const MAX_EVENT_BYTES = 4096;

export const PHASES = ['before', 'after', 'observation'];

const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

const EVENT_FIELDS = [
  'schema_version',
  'run_id',
  'root_skill',
  'skill',
  'sequence',
  'timestamp',
  'event',
  'phase',
  'operation',
  'outcome',
  'summary',
  'evidence',
  'truncated',
];

export class ChronicleError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ChronicleError';
    this.code = code;
  }
}

function fail(code, message) {
  throw new ChronicleError(code, message);
}

function byteLength(value) {
  return Buffer.byteLength(value, 'utf8');
}

/** Truncates on a UTF-8 boundary so a persisted event is never malformed. */
function boundText(value, maxBytes) {
  if (byteLength(value) <= maxBytes) {
    return { text: value, truncated: false };
  }
  const buffer = Buffer.from(value, 'utf8').subarray(0, maxBytes);
  let text = buffer.toString('utf8');
  if (text.endsWith('\uFFFD')) {
    text = text.slice(0, -1);
  }
  return { text, truncated: true };
}

function requireIdentifier(value, field) {
  if (typeof value !== 'string' || !IDENTIFIER_PATTERN.test(value)) {
    fail('invalid_input', `${field} must be a non-empty identifier`);
  }
  if (byteLength(value) > MAX_IDENTIFIER_BYTES) {
    fail('invalid_input', `${field} must not exceed ${MAX_IDENTIFIER_BYTES} bytes`);
  }
  return value;
}

function requireCleanText(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail('invalid_input', `${field} must be a non-empty string`);
  }
  if (CONTROL_CHARACTER_PATTERN.test(value)) {
    fail('invalid_input', `${field} must not contain control characters`);
  }
  return value.trim();
}

/**
 * Builds the persisted event from caller input plus inherited run context.
 * `sequence` is supplied by the writer and is best effort; replay treats line
 * order as authoritative.
 */
export function buildEvent(input, context, sequence, now = new Date()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    fail('invalid_input', 'event input must be an object');
  }
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    fail('invalid_input', 'run context must be an object');
  }

  const runId = requireIdentifier(context.run_id, 'run_id');
  const rootSkill = requireIdentifier(context.root_skill, 'root_skill');
  const skill = requireIdentifier(input.skill ?? context.root_skill, 'skill');
  const eventName = requireIdentifier(input.event, 'event');

  if (!PHASES.includes(input.phase)) {
    fail('invalid_input', `phase must be one of ${PHASES.join(', ')}`);
  }

  const summaryInput = requireCleanText(input.summary, 'summary');
  const bounded = boundText(summaryInput, MAX_SUMMARY_BYTES);
  let truncated = bounded.truncated;

  const event = {
    schema_version: SCHEMA_VERSION,
    run_id: runId,
    root_skill: rootSkill,
    skill,
    sequence,
    timestamp: now.toISOString(),
    event: eventName,
    phase: input.phase,
    summary: bounded.text,
  };

  if (input.operation !== undefined && input.operation !== null && input.operation !== '') {
    event.operation = requireIdentifier(input.operation, 'operation');
  }
  if (input.outcome !== undefined && input.outcome !== null && input.outcome !== '') {
    event.outcome = requireIdentifier(input.outcome, 'outcome');
  }

  if (input.evidence !== undefined && input.evidence !== null) {
    if (!Array.isArray(input.evidence)) {
      fail('invalid_input', 'evidence must be an array of short references');
    }
    const references = [];
    for (const item of input.evidence.slice(0, MAX_EVIDENCE_ITEMS)) {
      const reference = requireCleanText(item, 'evidence reference');
      const boundedReference = boundText(reference, MAX_REFERENCE_BYTES);
      truncated = truncated || boundedReference.truncated;
      references.push(boundedReference.text);
    }
    if (input.evidence.length > MAX_EVIDENCE_ITEMS) {
      truncated = true;
    }
    if (references.length > 0) {
      event.evidence = references;
    }
  }

  if (truncated) {
    event.truncated = true;
  }

  const line = JSON.stringify(event);
  if (byteLength(line) > MAX_EVENT_BYTES) {
    // Defense in depth. Every individual bound is chosen so a valid event
    // stays well under this limit, so this branch is not reachable from
    // `emitEvent`; it guards against a future bound being raised carelessly.
    fail('event_too_large', `event exceeds ${MAX_EVENT_BYTES} bytes`);
  }
  return event;
}

/** Validates a persisted event read back from a log. */
export function validateEvent(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    return 'record is not an object';
  }
  for (const field of Object.keys(event)) {
    if (!EVENT_FIELDS.includes(field)) {
      return `unknown field: ${field}`;
    }
  }
  if (event.schema_version !== SCHEMA_VERSION) {
    return `unsupported schema_version: ${String(event.schema_version)}`;
  }
  for (const field of ['run_id', 'root_skill', 'skill', 'event']) {
    if (typeof event[field] !== 'string' || !IDENTIFIER_PATTERN.test(event[field])) {
      return `invalid ${field}`;
    }
  }
  if (!PHASES.includes(event.phase)) {
    return 'invalid phase';
  }
  if (typeof event.summary !== 'string' || event.summary.length === 0) {
    return 'invalid summary';
  }
  if (!Number.isSafeInteger(event.sequence) || event.sequence < 1) {
    return 'invalid sequence';
  }
  if (typeof event.timestamp !== 'string' || Number.isNaN(Date.parse(event.timestamp))) {
    return 'invalid timestamp';
  }
  if ('evidence' in event
    && (!Array.isArray(event.evidence) || !event.evidence.every((item) => typeof item === 'string'))) {
    return 'invalid evidence';
  }
  return null;
}

function countRecords(logPath) {
  let contents;
  try {
    contents = fs.readFileSync(logPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return 0;
    }
    throw error;
  }
  return contents.split('\n').filter((line) => line.trim().length > 0).length;
}

/**
 * Appends one event to the Skill Run Log. Recording is best effort: a caller
 * that receives a ChronicleError reports it, marks evidence incomplete, and
 * continues delivery.
 */
export function emitEvent(input, context, options = {}) {
  const logPath = context?.log_path;
  if (typeof logPath !== 'string' || !path.isAbsolute(logPath)) {
    fail('invalid_input', 'log_path must be an absolute path');
  }

  // Validate caller input before touching the filesystem, so a rejected event
  // leaves no directory or file behind.
  buildEvent(input, context, 1, options.now);

  let sequence;
  try {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    sequence = countRecords(logPath) + 1;
  } catch (error) {
    fail('log_unavailable', `cannot prepare the Skill Run Log: ${error.message}`);
  }

  const event = buildEvent(input, context, sequence, options.now);

  try {
    fs.appendFileSync(logPath, `${JSON.stringify(event)}\n`, { encoding: 'utf8' });
  } catch (error) {
    fail('append_failed', `cannot append to the Skill Run Log: ${error.message}`);
  }
  return event;
}

/**
 * Reconstructs Skill Run State from one explicitly selected log. Replay never
 * repairs, reorders, or invents evidence; every problem becomes a defect.
 */
export function replayLog(logPath, options = {}) {
  let contents;
  try {
    contents = fs.readFileSync(logPath, 'utf8');
  } catch (error) {
    fail('log_unavailable', `cannot read the selected Skill Run Log: ${error.message}`);
  }

  const logId = options.logId ?? logPath;
  if (typeof logId !== 'string'
    || logId.length === 0
    || byteLength(logId) > MAX_REFERENCE_BYTES
    || CONTROL_CHARACTER_PATTERN.test(logId)) {
    fail('invalid_input', `log id must be clean text of at most ${MAX_REFERENCE_BYTES} bytes`);
  }

  const defects = [];
  const events = [];
  const lines = contents.split('\n');

  let runId = null;
  let rootSkill = null;

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    const anchor = `L${index + 1}`;
    if (line.length === 0) {
      if (index < lines.length - 1) {
        defects.push({ type: 'blank_record', anchor, detail: 'blank line inside the log' });
      }
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      defects.push({ type: 'malformed_record', anchor, detail: 'record is not valid JSON' });
      return;
    }

    const problem = validateEvent(parsed);
    if (problem) {
      defects.push({ type: 'invalid_record', anchor, detail: problem });
      return;
    }

    if (runId === null) {
      runId = parsed.run_id;
      rootSkill = parsed.root_skill;
    } else if (parsed.run_id !== runId) {
      defects.push({
        type: 'foreign_run',
        anchor,
        detail: `record belongs to run ${parsed.run_id}, not ${runId}`,
      });
      return;
    }

    events.push({ ...parsed, anchor, line: index + 1 });
  });

  events.forEach((event, index) => {
    if (event.sequence !== index + 1) {
      defects.push({
        type: 'sequence_anomaly',
        anchor: event.anchor,
        detail: `recorded sequence ${event.sequence} does not match log position ${index + 1};`
          + ' concurrent writers or a lost record',
      });
    }
  });

  const operations = new Map();
  for (const event of events) {
    // Only intent and outcome define an operation. An observation that merely
    // references an operation must not create a phantom entry.
    if (!event.operation || event.phase === 'observation') {
      continue;
    }
    const entry = operations.get(event.operation) ?? {
      operation: event.operation,
      skill: event.skill,
      started: null,
      completed: null,
      outcome: null,
    };
    if (event.phase === 'before') {
      if (entry.started !== null) {
        defects.push({
          type: 'duplicate_operation_start',
          anchor: event.anchor,
          detail: `operation ${event.operation} starts more than once`,
        });
      }
      entry.started = entry.started ?? event.anchor;
    } else if (event.phase === 'after') {
      entry.completed = event.anchor;
      entry.outcome = event.outcome ?? null;
    }
    operations.set(event.operation, entry);
  }

  for (const entry of operations.values()) {
    if (entry.started && !entry.completed) {
      defects.push({
        type: 'incomplete_operation',
        anchor: entry.started,
        detail: `operation ${entry.operation} records intent with no outcome`,
      });
    } else if (!entry.started && entry.completed) {
      defects.push({
        type: 'unmatched_outcome',
        anchor: entry.completed,
        detail: `operation ${entry.operation} records an outcome with no intent`,
      });
    }
  }

  if (events.length === 0) {
    defects.push({ type: 'no_usable_records', anchor: 'L0', detail: 'the log holds no usable event' });
  }

  return {
    schema_version: SCHEMA_VERSION,
    log_id: logId,
    run_id: runId,
    root_skill: rootSkill,
    skills: [...new Set(events.map((event) => event.skill))].sort(),
    event_count: events.length,
    events,
    operations: [...operations.values()],
    defects,
    complete: defects.length === 0,
  };
}
