#!/usr/bin/env node
/**
 * Bounded handoff: validation, redaction, rendering, temporary-path
 * resolution, and guarded verified writing.
 *
 * Callers supply confirmed context. This module owns the persisted artifact:
 * the section schema and its order, the bounds, the redaction floor, the
 * single temporary child directory, the collision-resistant name, and the
 * write that proves what landed. Every atom entry point calls into this
 * module, so one validated implementation serves all of them.
 *
 * Portions adapted from Matt Pocock's `handoff` skill,
 * https://github.com/mattpocock/skills, MIT License, Copyright (c) 2026 Matt
 * Pocock. The complete copyright and permission notice is preserved in the
 * Attribution section of `persist-bounded-handoff.md`.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCHEMA_VERSION = 1;

export const MAX_SECTION_BYTES = 8000;
export const MAX_DOCUMENT_BYTES = 65536;
export const MAX_REDACT_BYTES = 65536;
export const MAX_INPUT_BYTES = 262144;
export const MAX_ARTIFACTS = 50;
export const MAX_SUGGESTED_SKILLS = 10;
export const MAX_LOCATOR_BYTES = 300;
export const MAX_NOTE_BYTES = 300;
export const MAX_REASON_BYTES = 200;
export const MAX_SLUG_LENGTH = 64;
export const MAX_FENCE_LINES = 20;
export const MAX_FENCE_BYTES = 2000;
export const MAX_NAME_ATTEMPTS = 100;
export const MAX_WRITE_ATTEMPTS = 5;

export const DEFAULT_TITLE = 'Handoff';
export const DEFAULT_CHILD_DIRECTORY = 'handoffs';
export const PLACEHOLDER = 'No confirmed information yet.';
export const PROBE_RESPONSE = 'handoff: available';

/**
 * The approved heading order. `Goal`, `Current Progress`, `What Worked`,
 * `What Didn't Work`, and `Next Steps` keep their pickup-compatible relative
 * order; `Decisions and Constraints` and `Artifacts and References` are always
 * present; `Suggested Skills` is the only optional section.
 */
export const SECTIONS = [
  { key: 'goal', heading: 'Goal', kind: 'prose', required: true },
  { key: 'current_progress', heading: 'Current Progress', kind: 'prose', required: true },
  {
    key: 'decisions_and_constraints',
    heading: 'Decisions and Constraints',
    kind: 'prose',
    required: true,
  },
  {
    key: 'artifacts_and_references',
    heading: 'Artifacts and References',
    kind: 'artifacts',
    required: true,
  },
  { key: 'what_worked', heading: 'What Worked', kind: 'prose', required: true },
  { key: 'what_did_not_work', heading: "What Didn't Work", kind: 'prose', required: true },
  { key: 'suggested_skills', heading: 'Suggested Skills', kind: 'skills', required: false },
  { key: 'next_steps', heading: 'Next Steps', kind: 'prose', required: true },
];

export const SECTION_KEYS = SECTIONS.map((section) => section.key);
export const HEADING_ORDER = SECTIONS.map((section) => section.heading);

const PAYLOAD_FIELDS = new Set([
  'schema_version',
  'title',
  'slug',
  'available_skills',
  ...SECTION_KEYS,
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SKILL_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CHILD_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TITLE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 '\u2019.,()-]{0,79}$/;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const FENCE_PATTERN = /^\s{0,3}(`{3,}|~{3,})/;

export class HandoffError extends Error {
  constructor(code, message, reason = null) {
    super(message);
    this.name = 'HandoffError';
    this.code = code;
    this.reason = reason;
  }
}

function fail(code, message, reason = null) {
  throw new HandoffError(code, message, reason);
}

/** The one refusal a caller may answer by resolving a fresh name. */
export const TARGET_EXISTS = 'target_exists';

function byteLength(value) {
  return Buffer.byteLength(value, 'utf8');
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/* -------------------------------------------------------------------------
 * Redaction
 * ---------------------------------------------------------------------- */

/**
 * A key names a secret when any of its segments is a secret word, or when the
 * key with its separators removed contains a compound secret word. Testing the
 * captured key as a string rather than matching alternatives inside the
 * expression keeps the scan linear and makes `secret_key`, `signing_key`, and
 * a bare `key` all reachable, none of which a keyword-must-come-last pattern
 * can see.
 */
const SECRET_SEGMENTS = new Set([
  'accesskey', 'accountkey', 'apikey', 'apikeys', 'auth', 'authorization',
  'clientsecret', 'connectionstring', 'credential', 'credentials', 'key',
  'keys', 'passphrase', 'passwd', 'password', 'passwords', 'pat', 'privatekey',
  'pwd', 'sas', 'secret', 'secrets', 'sig', 'signature', 'token', 'tokens',
]);

const SECRET_COMPOUNDS = [
  'accesskey',
  'accountkey',
  'apikey',
  'clientsecret',
  'connectionstring',
  'privatekey',
  'refreshtoken',
  'sharedaccesssignature',
];

export function namesSecret(key) {
  const lower = key.toLowerCase();
  if (SECRET_COMPOUNDS.some((word) => lower.replace(/[^a-z0-9]/g, '').includes(word))) {
    return true;
  }
  return lower.split(/[^a-z0-9]+/).some((segment) => SECRET_SEGMENTS.has(segment));
}

/** Keys are short. Bounding the run keeps one pathological token cheap. */
const SECRET_KEY = String.raw`[A-Za-z0-9_.\[\]-]{1,64}`;

/**
 * An unquoted secret value runs to whitespace, but stops before punctuation
 * that carries structure - a closing bracket, a query separator, or sentence
 * punctuation - so redaction never swallows the Markdown around it.
 *
 * A value that is already a redaction marker is matched whole and left alone,
 * which is what keeps a second pass from relabelling or re-bracketing it.
 */
const SECRET_VALUE = String.raw`(?:\[REDACTED:[a-z-]+\]|"[^"\n]*"|'[^'\n]*'|[^\s,;)\]}>"'&]*[^\s,;)\]}>"'&.!?])`;

const MARKER_PATTERN = /^\[REDACTED:[a-z-]+\]$/;

const ASSIGNMENT_PATTERN = new RegExp(
  String.raw`(?<![A-Za-z0-9_.\[\]-])(${SECRET_KEY})(\s*[:=]\s*)(${SECRET_VALUE})`,
  'g',
);

/**
 * Replaces the value of every assignment whose key names a secret.
 *
 * Scanning is manual rather than a `replace` call because a key that does not
 * name a secret must not consume its value: `https://host/x?token=...` matches
 * with the key `https`, and a plain replace would skip past the `token`
 * assignment nested inside it. Resuming immediately after the separator finds
 * the inner assignment while still advancing, so the scan terminates.
 */
function redactAssignments(text) {
  ASSIGNMENT_PATTERN.lastIndex = 0;
  let result = '';
  let cursor = 0;
  let hits = 0;
  let match = ASSIGNMENT_PATTERN.exec(text);
  while (match !== null) {
    const [whole, key, separator, value] = match;
    if (namesSecret(key) && !MARKER_PATTERN.test(value)) {
      result += `${text.slice(cursor, match.index)}${key}${separator}[REDACTED:secret]`;
      cursor = match.index + whole.length;
      hits += 1;
    } else {
      ASSIGNMENT_PATTERN.lastIndex = match.index + key.length + separator.length;
    }
    match = ASSIGNMENT_PATTERN.exec(text);
  }
  return { text: `${result}${text.slice(cursor)}`, hits };
}

function fromPattern(source, replace) {
  return (text) => {
    const pattern = new RegExp(source.source, source.flags);
    let hits = 0;
    const next = text.replace(pattern, (...args) => {
      const whole = args[0];
      const replaced = replace(whole, ...args.slice(1, -2));
      if (replaced !== whole) {
        hits += 1;
      }
      return replaced;
    });
    return { text: next, hits };
  };
}

/**
 * The deterministic redaction floor. Every rule replaces the sensitive span
 * with an explicit marker so a reader can see that something was removed
 * rather than silently reading an incomplete document.
 */
const REDACTION_RULES = [
  {
    category: 'private-key',
    apply: fromPattern(
      /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z0-9 ]*PRIVATE KEY-----/g,
      () => '[REDACTED:private-key]',
    ),
  },
  {
    category: 'credential',
    apply: fromPattern(/\b(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, () => '[REDACTED:credential]'),
  },
  {
    category: 'token',
    apply: fromPattern(/\bgh[pousr]_[A-Za-z0-9]{16,}\b/g, () => '[REDACTED:token]'),
  },
  {
    category: 'token',
    apply: fromPattern(/\bgithub_pat_[A-Za-z0-9_]{20,}\b/g, () => '[REDACTED:token]'),
  },
  {
    category: 'token',
    apply: fromPattern(/\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g, () => '[REDACTED:token]'),
  },
  {
    category: 'token',
    apply: fromPattern(/\bsk-[A-Za-z0-9_-]{16,}\b/g, () => '[REDACTED:token]'),
  },
  {
    category: 'token',
    apply: fromPattern(
      /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
      () => '[REDACTED:token]',
    ),
  },
  {
    category: 'credential',
    apply: fromPattern(/\bAKIA[0-9A-Z]{16}\b/g, () => '[REDACTED:credential]'),
  },
  {
    category: 'secret',
    apply: redactAssignments,
  },
  {
    category: 'email',
    // The lookbehind pins the local part to the start of its run and the
    // domain has no optional tail to backtrack into, so the scan stays linear
    // on adversarial dotted input. The top-level domain is checked afterwards.
    apply: fromPattern(
      /(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g,
      (match) => (/\.[A-Za-z]{2,}$/.test(match) ? '[REDACTED:email]' : match),
    ),
  },
  {
    category: 'phone',
    apply: fromPattern(
      /(?<![\w-])(?:\+\d{1,3}[ .-]?)?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}(?![\w-])/g,
      () => '[REDACTED:phone]',
    ),
  },
];

export const REDACTION_CATEGORIES = [
  ...new Set(REDACTION_RULES.map((rule) => rule.category)),
].sort();

/**
 * Applies the deterministic redaction floor. The result is idempotent: every
 * marker this function emits is inert under all of its own rules, so redacting
 * already-redacted text returns the same text.
 *
 * `redactions` counts spans this call actually changed, so a second pass over
 * already-redacted text reports nothing.
 */
export function redactText(value) {
  if (typeof value !== 'string') {
    fail('malformed_payload', 'redaction input must be a string');
  }
  if (byteLength(value) > MAX_REDACT_BYTES) {
    fail(
      'malformed_payload',
      `redaction input exceeds ${MAX_REDACT_BYTES} UTF-8 bytes; a handoff is bounded evidence, not a transcript`,
    );
  }
  let text = value;
  const counts = new Map();
  for (const rule of REDACTION_RULES) {
    const { text: next, hits } = rule.apply(text);
    text = next;
    if (hits) {
      counts.set(rule.category, (counts.get(rule.category) ?? 0) + hits);
    }
  }
  const redactions = [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((left, right) => left.category.localeCompare(right.category));
  return { text, redactions };
}

function mergeRedactions(target, redactions) {
  for (const entry of redactions) {
    target.set(entry.category, (target.get(entry.category) ?? 0) + entry.count);
  }
}

/* -------------------------------------------------------------------------
 * Payload validation
 * ---------------------------------------------------------------------- */

export function slugify(value) {
  if (typeof value !== 'string') {
    fail('malformed_payload', 'slug source must be a string');
  }
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '');
  if (!slug) {
    fail('malformed_payload', `slug source has no usable characters: ${JSON.stringify(value)}`);
  }
  return slug;
}

function normalizeText(value, field) {
  if (typeof value !== 'string') {
    fail('malformed_payload', `${field} must be a string`);
  }
  const text = value
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '');
  if (CONTROL_CHARACTER_PATTERN.test(text)) {
    fail('malformed_payload', `${field} carries a control character`);
  }
  if (byteLength(text) > MAX_SECTION_BYTES) {
    fail(
      'malformed_payload',
      `${field} exceeds ${MAX_SECTION_BYTES} UTF-8 bytes; reference the artifact instead of reproducing it`,
    );
  }
  return text;
}

function normalizeLine(value, field, limit) {
  if (typeof value !== 'string') {
    fail('malformed_payload', `${field} must be a string`);
  }
  const line = value.trim();
  if (!line) {
    fail('malformed_payload', `${field} must not be empty`);
  }
  if (/[\r\n]/.test(line) || CONTROL_CHARACTER_PATTERN.test(line)) {
    fail('malformed_payload', `${field} must be a single line`);
  }
  if (byteLength(line) > limit) {
    fail('malformed_payload', `${field} exceeds ${limit} UTF-8 bytes`);
  }
  return line;
}

/**
 * Walks `text` line by line, telling the visitor whether each line is a fence
 * delimiter, fenced content, or ordinary text. Returns the unterminated fence
 * marker, or `null` when every fence closed.
 */
function walkLines(text, visit) {
  let fence = null;
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = FENCE_PATTERN.exec(line);
    if (match) {
      const marker = match[1];
      if (fence === null) {
        fence = marker;
        visit(line, index, 'fence-open');
        continue;
      }
      if (marker[0] === fence[0] && marker.length >= fence.length) {
        fence = null;
        visit(line, index, 'fence-close');
        continue;
      }
    }
    visit(line, index, fence === null ? 'text' : 'fenced');
  }
  return fence;
}

/** The `##` headings a rendered document actually carries, ignoring fences. */
export function documentHeadings(text) {
  const headings = [];
  walkLines(text, (line, index, kind) => {
    if (kind === 'text' && /^## \S/.test(line)) {
      headings.push(line.slice(3).trim());
    }
  });
  return headings;
}

/**
 * Rejects two things a section body must not do: reproduce an artifact instead
 * of referencing it, and introduce a structural heading of its own. A body
 * that emits `## Next Steps` would leave the rendered document disagreeing
 * with the heading order this core promises its readers.
 */
function assertSectionShape(text, field) {
  let start = 0;
  let bytes = 0;
  const unterminated = walkLines(text, (line, index, kind) => {
    if (kind === 'fence-open') {
      start = index;
      bytes = 0;
      return;
    }
    if (kind === 'text') {
      if (/^ {0,3}#{1,2} /.test(line)) {
        fail(
          'malformed_payload',
          `${field} introduces its own top-level heading; a section body may not add a document or section heading`,
        );
      }
      return;
    }
    if (kind !== 'fenced') {
      return;
    }
    bytes += byteLength(line) + 1;
    if (index - start > MAX_FENCE_LINES || bytes > MAX_FENCE_BYTES) {
      fail(
        'inlined_artifact_body',
        `${field} inlines a fenced block longer than ${MAX_FENCE_LINES} lines or ${MAX_FENCE_BYTES} bytes; reference the artifact instead`,
      );
    }
  });
  if (unterminated !== null) {
    fail('malformed_payload', `${field} leaves a fenced block unterminated`);
  }
}

/**
 * A locator is a whitespace-free token: a URL, a path, an issue or pull
 * request identifier, or a commit. Prose about the artifact belongs in `note`,
 * which keeps the reference machine-checkable.
 */
function normalizeArtifact(entry, index) {
  const field = `artifacts_and_references[${index}]`;
  if (typeof entry === 'string') {
    return { reference: normalizeLocator(entry, field), note: '' };
  }
  if (!isPlainObject(entry)) {
    fail('malformed_payload', `${field} must be a string or an object`);
  }
  const unknown = Object.keys(entry).filter((key) => !['reference', 'note'].includes(key));
  if (unknown.length) {
    fail('malformed_payload', `${field} has unknown field(s): ${unknown.sort().join(', ')}`);
  }
  if (!('reference' in entry)) {
    fail('malformed_payload', `${field} requires reference`);
  }
  const note = entry.note === undefined || entry.note === null || entry.note === ''
    ? ''
    : normalizeLine(entry.note, `${field}.note`, MAX_NOTE_BYTES);
  return { reference: normalizeLocator(entry.reference, `${field}.reference`), note };
}

function normalizeLocator(value, field) {
  const locator = normalizeLine(value, field, MAX_LOCATOR_BYTES);
  if (/\s/.test(locator)) {
    fail(
      'malformed_payload',
      `${field} must be a whitespace-free locator such as a URL, path, #issue, or commit; put prose in note`,
    );
  }
  return locator;
}

/**
 * Checks one reference set, and optionally the section bodies that reference
 * set exists to keep short. References survive; a reproduced artifact body
 * does not.
 */
export function checkArtifactReferences(input) {
  if (!isPlainObject(input)) {
    fail('malformed_payload', 'payload must be a JSON object with references and bodies');
  }
  const unknown = Object.keys(input).filter((key) => !['references', 'bodies'].includes(key));
  if (unknown.length) {
    fail('malformed_payload', `payload has unknown field(s): ${unknown.sort().join(', ')}`);
  }
  const { references, bodies } = input;
  if (references !== undefined && references !== null && !Array.isArray(references)) {
    fail('malformed_payload', 'references must be an array');
  }
  const list = references ?? [];
  if (list.length > MAX_ARTIFACTS) {
    fail('malformed_payload', `references holds more than ${MAX_ARTIFACTS} entries`);
  }
  const normalized = list.map((entry, index) => normalizeArtifact(entry, index));

  if (bodies !== undefined && bodies !== null && !isPlainObject(bodies)) {
    fail('malformed_payload', 'bodies must be an object of named section text');
  }
  const checked = [];
  for (const [field, value] of Object.entries(bodies ?? {})) {
    assertSectionShape(normalizeText(value, field), field);
    checked.push(field);
  }

  return { references: normalized, bodies_checked: checked.sort() };
}

function normalizeSuggestedSkill(entry, index, availableSkills) {
  const field = `suggested_skills[${index}]`;
  if (!isPlainObject(entry)) {
    fail('malformed_payload', `${field} must be an object with skill and reason`);
  }
  const unknown = Object.keys(entry).filter((key) => !['skill', 'reason'].includes(key));
  if (unknown.length) {
    fail('malformed_payload', `${field} has unknown field(s): ${unknown.sort().join(', ')}`);
  }
  const skill = normalizeLine(entry.skill ?? '', `${field}.skill`, MAX_LOCATOR_BYTES);
  if (!SKILL_ID_PATTERN.test(skill)) {
    fail('malformed_payload', `${field}.skill must be a lowercase hyphenated skill identifier`);
  }
  // A skill identifier is rendered verbatim, so one that a redaction rule
  // would rewrite is rejected here rather than corrupting the document or
  // tripping the post-render check.
  if (redactText(skill).text !== skill) {
    fail(
      'malformed_payload',
      `${field}.skill looks like a credential and cannot be rendered as a skill identifier`,
    );
  }
  const reason = normalizeLine(entry.reason ?? '', `${field}.reason`, MAX_REASON_BYTES);
  if (availableSkills && !availableSkills.includes(skill)) {
    fail(
      'unknown_skill',
      `${field}.skill names ${skill}, which is not in the caller's available skills`,
    );
  }
  return { skill, reason };
}

export function normalizePayload(input) {
  if (!isPlainObject(input)) {
    fail('malformed_payload', 'payload must be a JSON object');
  }
  const unknown = Object.keys(input).filter((key) => !PAYLOAD_FIELDS.has(key));
  if (unknown.length) {
    fail('malformed_payload', `payload has unknown field(s): ${unknown.sort().join(', ')}`);
  }
  if (input.schema_version !== undefined && input.schema_version !== SCHEMA_VERSION) {
    fail('malformed_payload', `unsupported schema_version: ${JSON.stringify(input.schema_version)}`);
  }

  const slug = normalizeLine(input.slug ?? '', 'slug', MAX_SLUG_LENGTH);
  if (!SLUG_PATTERN.test(slug)) {
    fail(
      'malformed_payload',
      'slug must be lowercase alphanumeric words joined by single hyphens',
    );
  }

  const title = input.title === undefined || input.title === null
    ? DEFAULT_TITLE
    : normalizeLine(input.title, 'title', 80);
  if (!TITLE_PATTERN.test(title)) {
    fail('malformed_payload', 'title must be a short plain-text heading');
  }

  let availableSkills = null;
  if (input.available_skills !== undefined && input.available_skills !== null) {
    if (!Array.isArray(input.available_skills)) {
      fail('malformed_payload', 'available_skills must be an array of skill identifiers');
    }
    availableSkills = input.available_skills.map((entry, index) => {
      const skill = normalizeLine(entry, `available_skills[${index}]`, MAX_LOCATOR_BYTES);
      if (!SKILL_ID_PATTERN.test(skill)) {
        fail(
          'malformed_payload',
          `available_skills[${index}] must be a lowercase hyphenated skill identifier`,
        );
      }
      return skill;
    });
  }

  const sections = {};
  for (const section of SECTIONS) {
    const raw = input[section.key];
    if (section.kind === 'prose') {
      if (raw === undefined || raw === null || raw === '') {
        sections[section.key] = '';
        continue;
      }
      const text = normalizeText(raw, section.key);
      assertSectionShape(text, section.key);
      sections[section.key] = text;
      continue;
    }
    if (section.kind === 'artifacts') {
      if (raw === undefined || raw === null) {
        sections[section.key] = [];
        continue;
      }
      if (!Array.isArray(raw)) {
        fail('malformed_payload', `${section.key} must be an array of artifact references`);
      }
      if (raw.length > MAX_ARTIFACTS) {
        fail('malformed_payload', `${section.key} holds more than ${MAX_ARTIFACTS} references`);
      }
      sections[section.key] = raw.map((entry, index) => normalizeArtifact(entry, index));
      continue;
    }
    if (raw === undefined || raw === null) {
      sections[section.key] = null;
      continue;
    }
    if (!Array.isArray(raw)) {
      fail('malformed_payload', `${section.key} must be an array of suggested skills`);
    }
    if (raw.length > MAX_SUGGESTED_SKILLS) {
      fail(
        'malformed_payload',
        `${section.key} holds more than ${MAX_SUGGESTED_SKILLS} suggestions`,
      );
    }
    sections[section.key] = raw.length
      ? raw.map((entry, index) => normalizeSuggestedSkill(entry, index, availableSkills))
      : null;
  }

  return { schema_version: SCHEMA_VERSION, title, slug, available_skills: availableSkills, ...sections };
}

export function redactPayload(payload) {
  const counts = new Map();
  const redact = (value) => {
    const result = redactText(value);
    mergeRedactions(counts, result.redactions);
    return result.text;
  };

  const next = { ...payload };
  next.title = redact(payload.title);
  for (const section of SECTIONS) {
    const value = payload[section.key];
    if (section.kind === 'prose') {
      next[section.key] = redact(value);
      continue;
    }
    if (section.kind === 'artifacts') {
      next[section.key] = value.map((entry) => ({
        reference: redact(entry.reference),
        note: entry.note ? redact(entry.note) : '',
      }));
      continue;
    }
    next[section.key] = value === null
      ? null
      : value.map((entry) => ({ skill: entry.skill, reason: redact(entry.reason) }));
  }

  const redactions = [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((left, right) => left.category.localeCompare(right.category));
  return { payload: next, redactions };
}

/* -------------------------------------------------------------------------
 * Rendering
 * ---------------------------------------------------------------------- */

export function renderHandoff(payload) {
  if (!isPlainObject(payload) || payload.schema_version !== SCHEMA_VERSION) {
    fail('malformed_payload', 'renderHandoff requires a payload from normalizePayload');
  }
  const blocks = [`# ${payload.title}`];
  const included = [];

  for (const section of SECTIONS) {
    const value = payload[section.key];
    if (section.kind === 'skills') {
      if (value === null || value.length === 0) {
        continue;
      }
      included.push(section.heading);
      blocks.push(`## ${section.heading}`);
      blocks.push(value.map((entry) => `- ${entry.skill} - ${entry.reason}`).join('\n'));
      continue;
    }
    included.push(section.heading);
    blocks.push(`## ${section.heading}`);
    if (section.kind === 'artifacts') {
      blocks.push(
        value.length
          ? value
            .map((entry) => (entry.note ? `- ${entry.reference} - ${entry.note}` : `- ${entry.reference}`))
            .join('\n')
          : PLACEHOLDER,
      );
      continue;
    }
    blocks.push(value === '' ? PLACEHOLDER : value);
  }

  const document = `${blocks.join('\n\n')}\n`;
  // The rendered headings must be the headings this function reports. Section
  // bodies cannot introduce one, so a disagreement here is a defect rather
  // than caller input, and a caller that trusts `headings` deserves the check.
  const rendered = documentHeadings(document);
  if (rendered.length !== included.length || rendered.some((heading, index) => heading !== included[index])) {
    fail(
      'malformed_payload',
      `rendered headings ${JSON.stringify(rendered)} do not match the schema ${JSON.stringify(included)}`,
    );
  }
  if (byteLength(document) > MAX_DOCUMENT_BYTES) {
    fail(
      'malformed_payload',
      `rendered handoff exceeds ${MAX_DOCUMENT_BYTES} UTF-8 bytes; reference more and reproduce less`,
    );
  }
  return { document, headings: included };
}

/* -------------------------------------------------------------------------
 * Temporary path resolution
 * ---------------------------------------------------------------------- */

export function utcStamp(now) {
  const date = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(date.getTime())) {
    fail('malformed_payload', 'timestamp is not a valid date');
  }
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

/**
 * Resolves the runtime-reported operating-system temporary directory and
 * creates exactly one child inside it. `mkdir` is deliberately non-recursive:
 * a missing temporary root is a runtime fault to report, not a tree to build.
 */
export function resolveTempDirectory(child = DEFAULT_CHILD_DIRECTORY) {
  if (typeof child !== 'string' || !CHILD_PATTERN.test(child)) {
    fail('malformed_payload', 'temporary child directory must be one lowercase hyphenated name');
  }

  let base;
  try {
    base = fs.realpathSync(os.tmpdir());
  } catch (error) {
    fail('temp_unavailable', `the runtime temporary directory is unusable: ${error.message}`);
  }
  if (!fs.statSync(base).isDirectory()) {
    fail('temp_unavailable', `the runtime temporary directory is not a directory: ${base}`);
  }

  const target = path.join(base, child);
  // Create first, then inspect whatever is actually there. Inspecting first
  // and creating afterwards leaves a window in which the entry that passed the
  // check is replaced by the one that gets used.
  try {
    fs.mkdirSync(target, { mode: 0o700 });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      fail('unsafe_temp_root', `${target} could not be created: ${error.message}`);
    }
  }

  let entry;
  try {
    entry = fs.lstatSync(target);
  } catch (error) {
    fail('unsafe_temp_root', `${target} cannot be inspected: ${error.message}`);
  }
  if (entry.isSymbolicLink()) {
    fail('unsafe_temp_root', `${target} is a symbolic link`);
  }
  if (!entry.isDirectory()) {
    fail('unsafe_temp_root', `${target} exists and is not a directory`);
  }
  // On a shared temporary root any local account can pre-create the child.
  // Writing into a directory somebody else owns or can write to means the
  // handoff can be replaced after it was verified.
  if (typeof process.getuid === 'function') {
    if (entry.uid !== process.getuid()) {
      fail('unsafe_temp_root', `${target} is owned by another user`);
    }
    if ((entry.mode & 0o022) !== 0) {
      fail('unsafe_temp_root', `${target} is writable by other users`);
    }
  }
  return fs.realpathSync(target);
}

/**
 * Proposes the first unused `<slug>-<UTC timestamp>.md` name, disambiguating
 * with a two-digit ordinal. The proposal is not a reservation: the write
 * creates the file exclusively, so a name taken in between is caught there.
 */
export function resolveHandoffPath({ slug, now = new Date(), child = DEFAULT_CHILD_DIRECTORY } = {}) {
  const normalized = normalizeLine(slug ?? '', 'slug', MAX_SLUG_LENGTH);
  if (!SLUG_PATTERN.test(normalized)) {
    fail('malformed_payload', 'slug must be lowercase alphanumeric words joined by single hyphens');
  }
  const directory = resolveTempDirectory(child);
  const stamp = utcStamp(now);

  for (let attempt = 0; attempt < MAX_NAME_ATTEMPTS; attempt += 1) {
    const suffix = attempt === 0 ? '' : `-${String(attempt).padStart(2, '0')}`;
    const name = `${normalized}-${stamp}${suffix}.md`;
    const candidate = path.join(directory, name);
    try {
      fs.lstatSync(candidate);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { directory, path: candidate, name, attempt: attempt + 1 };
      }
      fail('unsafe_target', `${candidate} cannot be inspected: ${error.message}`);
    }
  }
  fail(
    'name_exhausted',
    `no unused handoff name for ${normalized} at ${stamp} within ${MAX_NAME_ATTEMPTS} attempts`,
  );
}

/* -------------------------------------------------------------------------
 * Guarded verified write
 * ---------------------------------------------------------------------- */

export function writeGuarded({ destination, allowedRoot, content }) {
  if (typeof content !== 'string') {
    fail('malformed_payload', 'content must be a string');
  }
  if (typeof destination !== 'string' || !path.isAbsolute(destination)) {
    fail('malformed_payload', 'destination must be an absolute path');
  }
  if (typeof allowedRoot !== 'string' || !path.isAbsolute(allowedRoot)) {
    fail('malformed_payload', 'allowedRoot must be an absolute path');
  }

  let realRoot;
  try {
    realRoot = fs.realpathSync(allowedRoot);
  } catch (error) {
    fail('unsafe_target', `allowed root ${allowedRoot} is unusable: ${error.message}`);
  }
  if (!fs.statSync(realRoot).isDirectory()) {
    fail('unsafe_target', `allowed root ${realRoot} is not a directory`);
  }

  const resolved = path.resolve(destination);
  const parent = path.dirname(resolved);
  const name = path.basename(resolved);
  if (!name || name === '.' || name === '..') {
    fail('path_escape', `destination ${destination} does not name a file`);
  }

  let parentEntry;
  try {
    parentEntry = fs.lstatSync(parent);
  } catch (error) {
    fail('unsafe_target', `destination directory ${parent} is unusable: ${error.message}`);
  }
  if (parentEntry.isSymbolicLink()) {
    fail('unsafe_target', `destination directory ${parent} is a symbolic link`);
  }
  if (!parentEntry.isDirectory()) {
    fail('unsafe_target', `destination directory ${parent} is not a directory`);
  }
  if (fs.realpathSync(parent) !== realRoot) {
    fail('path_escape', `destination ${resolved} is outside the allowed root ${realRoot}`);
  }

  let existing = null;
  try {
    existing = fs.lstatSync(resolved);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      fail('unsafe_target', `${resolved} cannot be inspected: ${error.message}`);
    }
  }
  if (existing?.isSymbolicLink()) {
    fail('unsafe_target', `${resolved} is a symbolic link`);
  }
  if (existing && !existing.isFile()) {
    fail('unsafe_target', `${resolved} exists and is not a regular file`);
  }
  if (existing) {
    fail(
      'unsafe_target',
      `${resolved} already exists; a handoff never replaces an earlier one`,
      TARGET_EXISTS,
    );
  }

  let handle;
  try {
    // Exclusive create is the guard that survives a race: an entry that
    // appears between the check above and this call fails here rather than
    // being followed or overwritten.
    handle = fs.openSync(resolved, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') {
      fail(
        'unsafe_target',
        `${resolved} already exists; a handoff never replaces an earlier one`,
        TARGET_EXISTS,
      );
    }
    fail('write_failed', `${resolved} could not be created: ${error.message}`);
  }

  const bytes = byteLength(content);
  try {
    fs.writeFileSync(handle, content, 'utf8');
    fs.fsyncSync(handle);
  } catch (error) {
    fs.closeSync(handle);
    fs.rmSync(resolved, { force: true });
    fail('write_failed', `${resolved} could not be written: ${error.message}`);
  }
  fs.closeSync(handle);

  const written = fs.lstatSync(resolved);
  if (written.isSymbolicLink() || !written.isFile()) {
    fs.rmSync(resolved, { force: true });
    fail('verification_failed', `${resolved} is not a regular file after writing`);
  }
  const reread = fs.readFileSync(resolved, 'utf8');
  if (reread !== content) {
    fs.rmSync(resolved, { force: true });
    fail('verification_failed', `${resolved} does not hold what was written`);
  }

  return { path: resolved, bytes };
}

/* -------------------------------------------------------------------------
 * Composed operation
 * ---------------------------------------------------------------------- */

export function persistBoundedHandoff(input, { now = new Date(), child = DEFAULT_CHILD_DIRECTORY } = {}) {
  const normalized = normalizePayload(input);
  const { payload, redactions } = redactPayload(normalized);
  const { document, headings } = renderHandoff(payload);

  // Redaction is idempotent, so a second pass that still finds something is a
  // defect in this module rather than in the caller's content.
  if (redactText(document).text !== document) {
    fail('redaction_incomplete', 'the rendered handoff still matches a redaction rule');
  }

  let lastError = null;
  for (let attempt = 0; attempt < MAX_WRITE_ATTEMPTS; attempt += 1) {
    const target = resolveHandoffPath({ slug: payload.slug, now, child });
    try {
      const written = writeGuarded({
        destination: target.path,
        allowedRoot: target.directory,
        content: document,
      });
      return {
        path: written.path,
        directory: target.directory,
        name: target.name,
        bytes: written.bytes,
        headings,
        redactions,
        suggested_skills_included: headings.includes('Suggested Skills'),
      };
    } catch (error) {
      // Only a name taken between the proposal and the exclusive create is
      // retryable. Every other refusal is a real refusal.
      if (!(error instanceof HandoffError) || error.reason !== TARGET_EXISTS) {
        throw error;
      }
      lastError = error;
    }
  }
  fail(
    'name_exhausted',
    `a collision-free handoff name was taken on every attempt: ${lastError?.message ?? 'unknown'}`,
  );
}

/* -------------------------------------------------------------------------
 * Shared entry-point helpers
 * ---------------------------------------------------------------------- */

/**
 * `values` maps a flag to the field it fills; `flags` maps a flag to a boolean
 * field. An unknown flag, a missing value, and a repeated flag are all usage
 * failures rather than silently ignored input.
 */
export function parseFlags(argv, { values = {}, flags = {} } = {}, usage = '') {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag in flags) {
      parsed[flags[flag]] = true;
      continue;
    }
    const field = values[flag];
    if (!field) {
      fail('usage', `unknown argument: ${flag}\n${usage}`);
    }
    const value = argv[index + 1];
    if (value === undefined || value.startsWith('--')) {
      fail('usage', `${flag} requires a value\n${usage}`);
    }
    if (field in parsed) {
      fail('usage', `${flag} was given more than once\n${usage}`);
    }
    parsed[field] = value;
    index += 1;
  }
  return parsed;
}

export function readTextSource({ file, stdin }, usage, label = 'input') {
  if (Boolean(file) === Boolean(stdin)) {
    fail('usage', `supply exactly one ${label} source\n${usage}`);
  }
  let raw;
  try {
    raw = stdin ? fs.readFileSync(0, 'utf8') : fs.readFileSync(file, 'utf8');
  } catch (error) {
    fail('usage', `${label} could not be read: ${error.message}`);
  }
  if (byteLength(raw) > MAX_INPUT_BYTES) {
    fail('malformed_payload', `${label} exceeds ${MAX_INPUT_BYTES} UTF-8 bytes`);
  }
  return raw;
}

export function readJsonSource(source, usage, label = 'payload') {
  const raw = readTextSource(source, usage, label);
  try {
    return JSON.parse(raw);
  } catch (error) {
    fail('malformed_payload', `${label} is not valid JSON: ${error.message}`);
  }
}

export function readPayload(argv, usage) {
  const parsed = parseFlags(
    argv,
    { values: { '--payload': 'file' }, flags: { '--stdin': 'stdin' } },
    usage,
  );
  return readJsonSource(parsed, usage);
}

export function runEntryPoint(argv, handler) {
  if (argv.includes('--probe')) {
    process.stdout.write(`${PROBE_RESPONSE}\n`);
    return;
  }
  try {
    process.stdout.write(handler(argv));
  } catch (error) {
    const code = error instanceof HandoffError ? error.code : 'internal_error';
    process.stderr.write(`${code}: ${error.message}\n`);
    process.exitCode = 1;
  }
}

export function isDirectInvocation(moduleUrl) {
  if (!process.argv[1]) {
    return false;
  }
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return false;
  }
}

const USAGE = 'Usage: persist-bounded-handoff.mjs (--payload <file> | --stdin) [--probe]';

if (isDirectInvocation(import.meta.url)) {
  runEntryPoint(process.argv.slice(2), (argv) => {
    const payload = readPayload(argv, USAGE);
    return `${JSON.stringify(persistBoundedHandoff(payload), null, 2)}\n`;
  });
}
