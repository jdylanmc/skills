import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { closureFor, validateRepository } from './validate-skill-graph.mjs';

function fixture(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-graph-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [relative, content] of Object.entries(files)) {
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
  }
  return root;
}

function participating(includes, body, requiresSkills = []) {
  return `---\nincludes: ${JSON.stringify(includes)}\nrequires-skills: ${JSON.stringify(requiresSkills)}\n---\n\n${body}`;
}

test('validates mirrored includes and deterministic closure', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['_base/common/BASE.md', 'example/references/a.md'],
      '# Example\n\n## Required References\n\n1. [Base](../_base/common/BASE.md)\n2. [A](./references/a.md)\n',
    ),
    'skills/example/references/a.md': participating([], '# A\n'),
    'skills/_base/common/BASE.md': participating([], '# Base\n'),
  });
  const result = validateRepository(root);
  assert.deepEqual(closureFor(result, 'example/SKILL.md'), [
    'example/SKILL.md',
    '_base/common/BASE.md',
    'example/references/a.md',
  ]);
  assert.deepEqual(result.routableSkills, ['example']);
});

test('rejects include mirror drift', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating([], '# Example\n\n## Required References\n\n1. [A](./a.md)\n'),
    'skills/example/a.md': participating([], '# A\n'),
  });
  assert.throws(() => validateRepository(root), /includes mirror drift/);
});

test('rejects root escape before resolution', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['outside.md'],
      '# Example\n\n## Required References\n\n1. [Outside](../../outside.md)\n',
    ),
    'outside.md': '# Outside\n',
  });
  assert.throws(() => validateRepository(root), /escapes the skills root/);
});

test('rejects cycles', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example/a.md'],
      '# Example\n\n## Required References\n\n1. [A](./a.md)\n',
    ),
    'skills/example/a.md': participating(
      ['example/SKILL.md'],
      '# A\n\n## Required Files\n\n1. [Entry](./SKILL.md)\n',
    ),
  });
  assert.throws(() => validateRepository(root), /include cycle/);
});

test('allows external dependencies and rejects unresolved local dependencies', (t) => {
  const externalRoot = fixture(t, {
    'skills/example/SKILL.md': participating(
      [],
      '# Example\n',
      [{ id: 'handoff', source: 'external', required: true }],
    ),
  });
  assert.doesNotThrow(() => validateRepository(externalRoot));

  const localRoot = fixture(t, {
    'skills/example/SKILL.md': participating(
      [],
      '# Example\n',
      [{ id: 'missing', source: 'local', required: true }],
    ),
  });
  assert.throws(() => validateRepository(localRoot), /unresolved local skill dependency/);
});

test('rejects routable entries under _base', (t) => {
  const root = fixture(t, {
    'skills/_base/common/SKILL.md': participating([], '# Not allowed\n'),
  });
  assert.throws(() => validateRepository(root), /must not contain routable SKILL/);
});

test('rejects an extra declared include that Markdown does not reference', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example/a.md', 'example/b.md'],
      '# Example\n\n## Required References\n\n1. [A](./a.md)\n',
    ),
    'skills/example/a.md': participating([], '# A\n'),
    'skills/example/b.md': participating([], '# B\n'),
  });
  assert.throws(() => validateRepository(root), /includes mirror drift/);
});

test('rejects a case or canonical path mismatch', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example/references/a.md'],
      '# Example\n\n## Required References\n\n1. [A](./references/a.md)\n',
    ),
    'skills/example/references/A.md': participating([], '# A\n'),
  });
  // The rejection reason depends on filesystem case sensitivity: a
  // case-sensitive filesystem cannot resolve the include at all, while a
  // case-insensitive one resolves it to a name the declared path does not
  // match. The validator must reject it either way.
  assert.throws(() => validateRepository(root));
});

test('rejects declared includes that are not normalized forward-slash paths', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example\\a.md'],
      '# Example\n\n## Required References\n\n1. [A](./a.md)\n',
    ),
    'skills/example/a.md': participating([], '# A\n'),
  });
  assert.throws(() => validateRepository(root), /normalized forward-slash paths/);
});

test('rejects duplicate declared includes', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example/a.md', 'example/a.md'],
      '# Example\n\n## Required References\n\n1. [A](./a.md)\n',
    ),
    'skills/example/a.md': participating([], '# A\n'),
  });
  assert.throws(() => validateRepository(root), /includes contains duplicates/);
});

test('rejects a reachable Markdown include that has not opted in', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example/a.md'],
      '# Example\n\n## Required References\n\n1. [A](./a.md)\n',
    ),
    'skills/example/a.md': '# A\n',
  });
  assert.throws(() => validateRepository(root), /has not opted in/);
});

test('rejects malformed requires-skills entries', (t) => {
  const missingKeys = fixture(t, {
    'skills/example/SKILL.md': participating([], '# Example\n', [{ id: 'handoff' }]),
  });
  assert.throws(() => validateRepository(missingKeys), /exactly id, source, and required/);

  const badId = fixture(t, {
    'skills/example/SKILL.md': participating([], '# Example\n', [
      { id: 'Not_Valid', source: 'external', required: true },
    ]),
  });
  assert.throws(() => validateRepository(badId), /invalid skill id/);

  const badSource = fixture(t, {
    'skills/example/SKILL.md': participating([], '# Example\n', [
      { id: 'handoff', source: 'remote', required: true },
    ]),
  });
  assert.throws(() => validateRepository(badSource), /invalid requires-skills edge/);
});

test('ignores files that have not opted in and reports routable skills only', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': '# Example\n\n## Required References\n\n1. [A](./a.md)\n',
    'skills/example/a.md': '# A\n',
    'skills/_base/common/BASE.md': '# Base\n',
  });
  const result = validateRepository(root);
  assert.equal(result.participating.size, 0);
  assert.deepEqual(result.routableSkills, ['example']);
});

test('rejects reference-style links in a required section', () => {
  const definition = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-graph-'));
  try {
    fs.mkdirSync(path.join(definition, 'skills/example'), { recursive: true });
    fs.writeFileSync(
      path.join(definition, 'skills/example/SKILL.md'),
      participating([], '# Example\n\n## Required References\n\n1. [A][a]\n\n[a]: ./a.md\n'),
    );
    fs.writeFileSync(path.join(definition, 'skills/example/a.md'), participating([], '# A\n'));
    assert.throws(() => validateRepository(definition), /reference-style links are not supported/);
  } finally {
    fs.rmSync(definition, { recursive: true, force: true });
  }
});

test('parses frontmatter and mirrors correctly with CRLF line endings', (t) => {
  const crlf = (value) => value.replace(/\n/g, '\r\n');
  const root = fixture(t, {
    'skills/example/SKILL.md': crlf(
      participating(
        ['example/a.md'],
        '# Example\n\n## Required References\n\n1. [A](./a.md)\n',
      ),
    ),
    'skills/example/a.md': crlf(participating([], '# A\n')),
  });
  const result = validateRepository(root);
  assert.equal(result.participating.size, 2);
  assert.deepEqual(result.graph.get('example/SKILL.md'), ['example/a.md']);

  const drifted = fixture(t, {
    'skills/example/SKILL.md': crlf(
      participating([], '# Example\n\n## Required References\n\n1. [A](./a.md)\n'),
    ),
    'skills/example/a.md': crlf(participating([], '# A\n')),
  });
  assert.throws(() => validateRepository(drifted), /includes mirror drift/);
});

test('ignores links inside fenced code blocks', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example/a.md'],
      [
        '# Example',
        '',
        '## Required References',
        '',
        '1. [A](./a.md)',
        '',
        'The fenced example below is documentation, not a dependency:',
        '',
        '```markdown',
        '1. [Not a dependency](./missing.md)',
        '```',
        '',
      ].join('\n'),
    ),
    'skills/example/a.md': participating([], '# A\n'),
  });
  const result = validateRepository(root);
  assert.deepEqual(result.graph.get('example/SKILL.md'), ['example/a.md']);
});

test('does not treat a fenced heading as the start of a required section', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      [],
      [
        '# Example',
        '',
        '```markdown',
        '## Required References',
        '',
        '1. [Not a dependency](./missing.md)',
        '```',
        '',
      ].join('\n'),
    ),
  });
  const result = validateRepository(root);
  assert.deepEqual(result.graph.get('example/SKILL.md'), []);
});

test('resolves link titles, query strings, anchors, and percent-encoding', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example/a b.md', 'example/a.md', 'example/c.md'],
      [
        '# Example',
        '',
        '## Required References',
        '',
        '1. [A](./a.md "The A page")',
        '2. [Spaced](./a%20b.md)',
        '3. [Anchored](./c.md?raw=1#section)',
        '',
      ].join('\n'),
    ),
    'skills/example/a.md': participating([], '# A\n'),
    'skills/example/a b.md': participating([], '# A B\n'),
    'skills/example/c.md': participating([], '# C\n'),
  });
  const result = validateRepository(root);
  assert.deepEqual(result.graph.get('example/SKILL.md'), [
    'example/a b.md',
    'example/a.md',
    'example/c.md',
  ]);
});

test('rejects an include whose canonical path differs from the declared path', { skip: process.platform === 'win32' }, (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example/link.md'],
      '# Example\n\n## Required References\n\n1. [Link](./link.md)\n',
    ),
    'skills/example/real.md': participating([], '# Real\n'),
  });
  fs.symlinkSync('real.md', path.join(root, 'skills/example/link.md'));
  assert.throws(() => validateRepository(root), /case or canonical path mismatch/);
});

test('closureFor is deterministic, deduplicates fan-in, and tolerates an unknown entry', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': participating(
      ['example/a.md', 'example/b.md'],
      '# Example\n\n## Required References\n\n1. [A](./a.md)\n2. [B](./b.md)\n',
    ),
    'skills/example/a.md': participating(
      ['example/shared.md'],
      '# A\n\n## Required Files\n\n1. [Shared](./shared.md)\n',
    ),
    'skills/example/b.md': participating(
      ['example/shared.md'],
      '# B\n\n## Required Files\n\n1. [Shared](./shared.md)\n',
    ),
    'skills/example/shared.md': participating([], '# Shared\n'),
  });
  const result = validateRepository(root);
  const closure = closureFor(result, 'example/SKILL.md');
  assert.deepEqual(closure, [
    'example/SKILL.md',
    'example/a.md',
    'example/shared.md',
    'example/b.md',
  ]);
  assert.equal(new Set(closure).size, closure.length);
  assert.deepEqual(closureFor(result, 'example/SKILL.md'), closure);
  assert.deepEqual(closureFor(result, 'example/missing.md'), ['example/missing.md']);
});

/**
 * Level namespace enforcement.
 *
 * The composition level is derived from the path, so these tests attack the
 * gap between what a file claims and where it actually lives. Every case here
 * is a way the model could be violated while every other check stayed green.
 */

function unit(level, includes, body, extra = '') {
  return `---\nname: u\nlevel: ${level}\n${extra}includes: ${JSON.stringify(includes)}\nrequires-skills: []\n---\n\n${body}`;
}

test('accepts a molecule composing atoms in their level namespaces', (t) => {
  const root = fixture(t, {
    'skills/_base/_atoms/alpha.md': unit('atom', [], '# Alpha\n'),
    'skills/_base/_atoms/alpha.mjs': 'export const alpha = 1;\n',
    'skills/_base/_atoms/alpha.test.mjs': '// seam test\n',
    'skills/_base/_molecules/combo.md': unit(
      'molecule',
      ['_base/_atoms/alpha.md'],
      '# Combo\n\n## Required References\n\n1. [Alpha](../_atoms/alpha.md)\n',
    ),
  });
  const result = validateRepository(root);
  assert.deepEqual(closureFor(result, '_base/_molecules/combo.md'), [
    '_base/_molecules/combo.md',
    '_base/_atoms/alpha.md',
  ]);
});

test('rejects a unit whose declared level contradicts its namespace', (t) => {
  const root = fixture(t, {
    'skills/_base/_atoms/alpha.md': unit('molecule', [], '# Alpha\n'),
  });
  assert.throws(() => validateRepository(root), /level must be atom to match its namespace/);
});

test('rejects a unit in a level namespace that declares no level', (t) => {
  const root = fixture(t, {
    'skills/_base/_atoms/alpha.md': participating([], '# Alpha\n'),
  });
  assert.throws(() => validateRepository(root), /level must be atom to match its namespace; found none/);
});

test('rejects an atom that references another unit', (t) => {
  const root = fixture(t, {
    'skills/_base/_atoms/alpha.md': unit(
      'atom',
      ['_base/_atoms/beta.md'],
      '# Alpha\n\n## Required References\n\n1. [Beta](./beta.md)\n',
    ),
    'skills/_base/_atoms/beta.md': unit('atom', [], '# Beta\n'),
  });
  assert.throws(() => validateRepository(root), /an atom references no other unit/);
});

test('rejects a level declared outside a level namespace', (t) => {
  const root = fixture(t, {
    'skills/example/SKILL.md': unit('atom', [], '# Example\n'),
  });
  assert.throws(() => validateRepository(root), /does not live in a level namespace/);
});

test('rejects requires-skills inside a level namespace', (t) => {
  const root = fixture(t, {
    'skills/other/SKILL.md': participating([], '# Other\n'),
    'skills/_base/_atoms/alpha.md':
      '---\nname: u\nlevel: atom\nincludes: []\nrequires-skills: [{"id":"other","source":"local","required":true}]\n---\n\n# Alpha\n',
  });
  assert.throws(() => validateRepository(root), /must not declare requires-skills/);
});

test('rejects a support file with no matching unit in its level namespace', (t) => {
  const root = fixture(t, {
    'skills/_base/_atoms/alpha.md': unit('atom', [], '# Alpha\n'),
    'skills/_base/_atoms/orphan.mjs': 'export const orphan = 1;\n',
  });
  assert.throws(() => validateRepository(root), /has no matching orphan.md unit/);
});

test('accepts a suffixed support file that names its unit', (t) => {
  const root = fixture(t, {
    'skills/_base/_molecules/combo.md': unit('molecule', [], '# Combo\n'),
    'skills/_base/_molecules/combo.adversarial.test.mjs': '// hostile input\n',
  });
  assert.doesNotThrow(() => validateRepository(root));
});

test('rejects a subdirectory inside a level namespace', (t) => {
  const root = fixture(t, {
    'skills/_base/_atoms/alpha.md': unit('atom', [], '# Alpha\n'),
    'skills/_base/_atoms/nested/deep.md': unit('atom', [], '# Deep\n'),
  });
  assert.throws(() => validateRepository(root), /a level namespace is flat/);
});
