import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const inspector = fileURLToPath(new URL('../skills/production-quality-code/scripts/inspect-project.mts', import.meta.url));

test('reports stack and delivery evidence without printing dependency values or CI contents', t => {
  const result = inspect(t, {
    'package.json': JSON.stringify({
      scripts: { 'test:e2e': 'exec-never' },
      dependencies: { next: 'secret-dependency-reference', pg: '^8', 'next-auth': '^4' },
    }),
    'package-lock.json': '{}',
    'src/main.ts': '',
    '.github/workflows/build.yml': 'secret-ci-content',
    Dockerfile: 'secret-container-content',
  });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.projectSignals.stack, ['Next.js', 'PostgreSQL', 'Auth.js']);
  assert.deepEqual(report.projectSignals.sourceDirectories, ['src']);
  assert.deepEqual(report.projectSignals.delivery, ['Dockerfile', '.github/workflows']);
  assert.deepEqual(report.checks, [{ script: 'test:e2e', command: 'npm run test:e2e' }]);
  assert.doesNotMatch(result.stdout, /secret-|exec-never/);
});

function inspect(t, files) {
  const root = mkdtempSync(join(tmpdir(), 'project inspection '));
  t.after(() => {
    assert.equal(dirname(root), resolve(tmpdir()));
    rmSync(root, { recursive: true, force: true });
  });
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), content);
  }
  return spawnSync(process.execPath, [inspector, root], { encoding: 'utf8', timeout: 10000 });
}

test('detects declared pnpm and configured checks without leaking script bodies or environment files', t => {
  const result = inspect(t, {
    'package.json': JSON.stringify({ type: 'commonjs', packageManager: 'pnpm@9.15.0', scripts: { verify: 'TOKEN=private-value command', deploy: 'do-not-run' } }),
    'pnpm-lock.yaml': '',
    '.env': 'SECRET=never-print-this',
  });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.packageManager.name, 'pnpm');
  assert.deepEqual(report.checks, [{ script: 'verify', command: 'pnpm run verify' }]);
  assert.ok(!result.stdout.includes('private-value'));
  assert.ok(!result.stdout.includes('never-print-this'));
  assert.ok(!result.stdout.includes('do-not-run'));
});

test('conflicting lockfiles require review and produce no runnable check suggestions', t => {
  const result = inspect(t, {
    'package.json': JSON.stringify({ scripts: { test: 'echo test' } }),
    'pnpm-lock.yaml': '',
    'package-lock.json': '{}',
  });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.packageManager, null);
  assert.deepEqual(report.checks, []);
  assert.ok(report.warnings.some(warning => /conflict/i.test(warning)));
});

test('manifest and lockfile disagreement also suppresses commands', t => {
  const result = inspect(t, {
    'package.json': JSON.stringify({ packageManager: 'yarn@4.0.0', scripts: { test: 'echo test' } }),
    'package-lock.json': '{}',
  });
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.checks, []);
  assert.ok(report.warnings.some(warning => /conflict/i.test(warning)));
});

test('non-JavaScript projects receive manifest hints without invented npm commands', t => {
  const result = inspect(t, { 'pyproject.toml': '[project]\nname="example"' });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.otherManifests, ['pyproject.toml']);
  assert.deepEqual(report.checks, []);
  assert.equal(report.packageManager, null);
});

test('malformed package JSON fails clearly without printing sensitive content', t => {
  const result = inspect(t, { 'package.json': '{"token":"private-value", broken' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /package\.json/);
  assert.ok(!result.stderr.includes('private-value'));
});

test('workspaces are reported and missing manager is never silently assumed to be npm', t => {
  const result = inspect(t, {
    'package.json': JSON.stringify({ workspaces: ['apps/*'], scripts: { test: 'echo test' } }),
  });
  const report = JSON.parse(result.stdout);
  assert.equal(report.workspaces, true);
  assert.equal(report.packageManager, null);
  assert.deepEqual(report.checks, []);
  assert.ok(report.warnings.length > 0);
});
