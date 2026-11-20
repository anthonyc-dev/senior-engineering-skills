import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const memory = fileURLToPath(new URL('../skills/engineering-memory/scripts/memory.mjs', import.meta.url));
const evaluation = fileURLToPath(new URL('../skills/skill-evaluation/scripts/evaluate.mjs', import.meta.url));

function sandbox(t) {
  const root = mkdtempSync(join(tmpdir(), 'advanced skills '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

function run(script, home, cwd, args, input) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd, env: { ...process.env, HOME: home, USERPROFILE: home }, input,
    encoding: 'utf8', timeout: 10000, windowsHide: true,
  });
  assert.ifError(result.error);
  return result;
}

const decision = { category: 'decision', text: 'Use PostgreSQL for orders.', source: 'docs/adr-1.md', confidence: 0.9 };

test('memory approval, version history, and deletion are scoped to the project', t => {
  const root = sandbox(t);
  const other = join(root, 'other');
  mkdirSync(other);
  const call = (args, value, cwd = root) => {
    const result = run(memory, root, cwd, args, value === undefined ? undefined : JSON.stringify(value));
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  };
  const { id } = call(['add'], decision);
  assert.deepEqual(call(['search', 'postgresql']), []);
  assert.notEqual(run(memory, root, root, ['approve', id, '--version', '2', '--verified']).status, 0);
  call(['approve', id, '--version', '1', '--verified']);
  assert.equal(call(['search', 'postgresql'])[0].status, 'verified');
  assert.deepEqual(call(['search', 'postgresql'], undefined, other), []);
  call(['update', id], { ...decision, text: 'Use PostgreSQL for billing.' });
  assert.deepEqual(call(['search', 'postgresql']), []);
  const history = call(['history', id]);
  assert.deepEqual(history.map(row => row.status), ['pending', 'verified', 'pending']);
  const backup = call(['export', '--confirm']);
  assert.equal(backup.length, 3);
  assert.notEqual(run(memory, root, root, ['restore', '--confirm'], JSON.stringify(backup)).status, 0);
  call(['delete', id, '--confirm']);
  assert.deepEqual(call(['export', '--confirm']), []);
  assert.notEqual(run(memory, root, root, ['restore', '--confirm'], JSON.stringify(backup)).status, 0);
  const malformed = [backup[0], { ...backup[1], version: 99 }];
  assert.notEqual(run(memory, root, other, ['restore', '--confirm'], JSON.stringify(malformed)).status, 0);
  assert.deepEqual(call(['export', '--confirm'], undefined, other), []);
  call(['restore', '--confirm'], backup, other);
  assert.deepEqual(call(['history', id], undefined, other), history);
});

test('global and named shared memory require explicit selection and shared approval', t => {
  const root = sandbox(t);
  const other = join(root, 'other');
  mkdirSync(other);
  for (const scope of ['global', 'shared:team']) {
    const add = run(memory, root, root, ['add', '--scope', scope], JSON.stringify(decision));
    assert.equal(add.status, 0, add.stderr);
    const { id } = JSON.parse(add.stdout);
    if (scope.startsWith('shared:')) {
      assert.notEqual(run(memory, root, root, ['approve', id, '--scope', scope, '--version', '1']).status, 0);
    }
    const approve = ['approve', id, '--scope', scope, '--version', '1', '--verified', '--confirm'];
    assert.equal(run(memory, root, root, approve).status, 0);
    const find = run(memory, root, other, ['search', 'orders', '--scope', scope]);
    assert.equal(JSON.parse(find.stdout)[0].id, id);
  }
  const secret = ['token', ' = ', 'ghp_', 'A'.repeat(36)].join('');
  const rejected = run(memory, root, root, ['add'], JSON.stringify({ ...decision, text: secret }));
  assert.notEqual(rejected.status, 0);
  assert.ok(!rejected.stderr.includes(secret));
  assert.deepEqual(JSON.parse(run(memory, root, root, ['search', 'orders']).stdout), []);
});

test('knowledge search returns source locations without excerpts and rejects outside paths', t => {
  const root = sandbox(t);
  const docs = join(root, 'docs');
  mkdirSync(docs);
  writeFileSync(join(docs, 'decisions.md'), '# Decisions\nUse PostgreSQL for orders.\n');
  writeFileSync(join(docs, 'setup.md'), '# Setup\nAn unrelated setup note.\n');
  writeFileSync(join(root, '.env'), 'POSTGRESQL=never-expose');
  const args = ['search', 'postgresql', '--document', 'docs/decisions.md', '--document', 'docs/setup.md'];
  const result = run(memory, root, root, args);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { memory: [], documents: [{ path: 'docs/decisions.md', line: 2 }] });
  for (const path of ['.env', '../outside.md', 'docs/missing.md']) {
    assert.notEqual(run(memory, root, root, ['search', 'postgresql', '--document', path]).status, 0);
  }
});

test('evaluation compares only matching case revisions and leaves absent evidence unscored', t => {
  const root = sandbox(t);
  const first = join(root, 'first.json');
  const second = join(root, 'second.json');
  const suite = { suite: 'demo-v1', client: 'Codex', model: 'fixed', cases: ['scope', 'recovery'] };
  writeFileSync(first, JSON.stringify({ ...suite, revision: 'a', results: { scope: { status: 'FAIL', evidence: 'transcript-a#1', rawLog: 'do-not-copy' } } }));
  writeFileSync(second, JSON.stringify({ ...suite, revision: 'b', results: { scope: { status: 'PASS', evidence: 'transcript-b#1' } } }));
  const result = run(evaluation, root, root, [first, second]);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /do-not-copy/);
  assert.deepEqual(JSON.parse(result.stdout).comparisons, [
    { case: 'scope', before: 'FAIL', after: 'PASS' },
    { case: 'recovery', before: 'NOT TESTED', after: 'NOT TESTED' },
  ]);
  writeFileSync(second, JSON.stringify({ ...suite, revision: 'b', results: { scope: { status: 'PASS' } } }));
  assert.notEqual(run(evaluation, root, root, [first, second]).status, 0);
});
