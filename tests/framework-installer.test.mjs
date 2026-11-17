import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { installFramework, skillsArguments } from '../bin/senior-engineering-skills.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'full framework fixture '));
  t.after(() => { assert.equal(dirname(root), resolve(tmpdir())); rmSync(root, { recursive: true, force: true }); });
  const source = join(root, 'source'), target = join(root, 'target');
  mkdirSync(source); mkdirSync(target);
  const write = (file, value) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, value); };
  for (const directory of ['skills', 'knowledge', 'prompts', 'instructions', 'rules', 'standards', 'workflows', 'checklists', 'templates', 'glossary', 'adapters', 'examples', 'docs']) write(join(source, directory, 'README.md'), `${directory} content\n`);
  for (const file of ['AGENTS.md', 'README.md', 'VERSION.md']) write(join(source, file), `${file} content\n`);
  write(join(source, 'node_modules/private.txt'), 'never copy');
  write(join(source, 'templates/flutter/.dart_tool/package_config.json'), 'machine paths');
  write(join(source, 'templates/flutter/pubspec.lock'), 'local lock');
  write(join(source, '.env'), 'private');
  return { root, source, target, write };
}

test('full mode includes all guidance categories but excludes development/generated files', t => {
  const { source, target } = fixture(t);
  const result = installFramework({ source, target, agents: ['codex', 'claude-code'] });
  assert.equal(result.dryRun, false);
  for (const category of ['skills', 'knowledge', 'prompts', 'instructions', 'rules', 'standards', 'workflows', 'checklists', 'templates', 'glossary', 'adapters', 'examples', 'docs']) assert.ok(existsSync(join(target, '.ai', category, 'README.md')), category);
  assert.ok(!existsSync(join(target, '.ai/node_modules')));
  assert.ok(!existsSync(join(target, '.ai/.env')));
  assert.ok(!existsSync(join(target, '.ai/templates/flutter/.dart_tool')));
  assert.ok(!existsSync(join(target, '.ai/templates/flutter/pubspec.lock')));
  assert.match(readFileSync(join(target, 'AGENTS.md'), 'utf8'), /\.ai\/AGENTS\.md/);
  assert.match(readFileSync(join(target, 'CLAUDE.md'), 'utf8'), /\.ai\/AGENTS\.md/);
});

test('preserves existing project instructions and reruns without duplicate blocks', t => {
  const { source, target, write } = fixture(t);
  write(join(target, 'CLAUDE.md'), '# Project\r\nKeep our rules.\r\n');
  installFramework({ source, target, agents: ['claude-code'] });
  const first = readFileSync(join(target, 'CLAUDE.md'), 'utf8');
  assert.ok(first.startsWith('# Project\r\nKeep our rules.\r\n'));
  const again = installFramework({ source, target, agents: ['claude-code'] });
  assert.equal(readFileSync(join(target, 'CLAUDE.md'), 'utf8'), first);
  assert.equal(again.filesToWrite.length, 0);
});

test('conflicting guidance fails before copying or activating anything', t => {
  const { source, target, write } = fixture(t);
  write(join(target, '.ai/knowledge/README.md'), 'User-owned policy\n');
  assert.throws(() => installFramework({ source, target, agents: ['codex'] }), /conflict/i);
  assert.equal(readFileSync(join(target, '.ai/knowledge/README.md'), 'utf8'), 'User-owned policy\n');
  assert.ok(!existsSync(join(target, '.ai/skills')));
  assert.ok(!existsSync(join(target, 'AGENTS.md')));
});

test('dry run reports intended files without writing anything', t => {
  const { source, target } = fixture(t);
  const result = installFramework({ source, target, agents: ['cursor', 'gemini-cli', 'github-copilot'], dryRun: true });
  assert.ok(result.filesToWrite.includes('.cursor/rules/senior-engineering.mdc'));
  assert.ok(result.filesToWrite.includes('GEMINI.md'));
  assert.ok(result.filesToWrite.includes('.github/copilot-instructions.md'));
  assert.deepEqual(readdirSync(target), []);
});

test('unsupported agents, overlapping source, and non-file loaders are rejected', t => {
  const { source, target } = fixture(t);
  assert.throws(() => installFramework({ source, target, agents: ['unknown'] }), /agent/i);
  assert.throws(() => installFramework({ source, target: source, agents: ['codex'] }), /overlap/i);
  mkdirSync(join(target, 'CLAUDE.md'));
  assert.throws(() => installFramework({ source, target, agents: ['claude-code'] }), /regular file/i);
  assert.ok(!existsSync(join(target, '.ai')));
});

test('symlinked framework destinations cannot escape the chosen project', t => {
  const { root, source, target } = fixture(t);
  const outside = join(root, 'outside'); mkdirSync(outside);
  try { symlinkSync(outside, join(target, '.ai'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (['EPERM', 'ENOTSUP'].includes(error.code)) { t.skip('Symlink creation unavailable'); return; } throw error; }
  assert.throws(() => installFramework({ source, target, agents: ['codex'] }), /symlink/i);
  assert.deepEqual(readdirSync(outside), []);
});

test('malformed managed loader blocks fail without changing instructions', t => {
  const { source, target, write } = fixture(t);
  const content = '<!-- senior-engineering-skills:start -->\nUser edit';
  write(join(target, 'AGENTS.md'), content);
  assert.throws(() => installFramework({ source, target, agents: ['codex'] }), /managed block/i);
  assert.equal(readFileSync(join(target, 'AGENTS.md'), 'utf8'), content);
  assert.ok(!existsSync(join(target, '.ai')));
});

test('skills mode retains upstream selection flags without installing root guidance', () => {
  assert.deepEqual(skillsArguments(['--skill', 'react', '--agent', 'claude-code']), ['add', 'anthonyc-dev/senior-engineering-skills', '--copy', '--skill', 'react', '--agent', 'claude-code']);
  assert.equal(skillsArguments(['--copy']).filter(value => value === '--copy').length, 1);
});

test('non-UTF8 instruction files are refused without altering their bytes', t => {
  const { source, target, write } = fixture(t);
  const original = Buffer.from('\ufeff# Existing project rules', 'utf16le');
  write(join(target, 'CLAUDE.md'), original);
  assert.throws(() => installFramework({ source, target, agents: ['claude-code'] }), /UTF-8/i);
  assert.deepEqual(readFileSync(join(target, 'CLAUDE.md')), original);
  assert.ok(!existsSync(join(target, '.ai')));
});

test('existing install locks are preserved and prevent writes', t => {
  const { source, target, write } = fixture(t);
  write(join(target, '.senior-engineering-install.lock'), 'other installer');
  assert.throws(() => installFramework({ source, target, agents: ['codex'] }));
  assert.ok(!existsSync(join(target, '.ai')));
  assert.equal(readFileSync(join(target, '.senior-engineering-install.lock'), 'utf8'), 'other installer');
});

test('CLI help explains both modes and framework requires explicit agents', () => {
  const cli = fileURLToPath(new URL('../bin/senior-engineering-skills.mjs', import.meta.url));
  const help = spawnSync(process.execPath, [cli, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /framework/);
  assert.match(help.stdout, /skills/);
  const invalid = spawnSync(process.execPath, [cli, 'framework'], { encoding: 'utf8' });
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /agent/i);
});
