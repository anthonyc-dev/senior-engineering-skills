import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

assert.ok(process.env.npm_execpath, 'Run through npm run test:package.');
const temporary = mkdtempSync(join(tmpdir(), 'framework package check '));
try {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, 'pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: process.cwd(), encoding: 'utf8', timeout: 60000, maxBuffer: 4 * 1024 * 1024, windowsHide: true,
    env: { ...process.env, npm_config_cache: join(temporary, 'cache') },
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  const pack = JSON.parse(result.stdout)[0];
  const paths = pack.files.map(file => file.path);
  assert.ok(paths.includes('bin/senior-engineering-skills.mjs'));
  assert.ok(paths.includes('knowledge/architecture/README.md'));
  for (const directory of ['skills', 'knowledge', 'prompts', 'instructions', 'rules', 'standards', 'workflows', 'checklists', 'templates', 'glossary', 'adapters', 'examples', 'docs']) {
    assert.ok(paths.some(path => path.startsWith(`${directory}/`)), `Missing packaged guidance directory: ${directory}`);
  }
  assert.ok(paths.includes('templates/flutter/pubspec.yaml'));
  for (const artifact of ['aspnet-core/HealthApi.csproj', 'aspnet-core/Program.cs', 'express/server.mjs', 'go/go.mod', 'go/main.go', 'python/app.py', 'tsconfig.json']) {
    assert.ok(paths.includes(`templates/${artifact}`), `Missing packaged template: ${artifact}`);
  }
  assert.ok(paths.includes('skills/production-quality-code/scripts/inspect-project.mts'));
  assert.ok(paths.includes('skills/engineering-memory/scripts/memory.mjs'));
  assert.ok(paths.includes('skills/skill-evaluation/scripts/evaluate.mjs'));
  assert.ok(!paths.some(path => /(^|\/)(node_modules|\.git|\.dart_tool|build|coverage)(\/|$)|pubspec\.lock$|^tests\//.test(path)), 'Package must exclude development/generated content.');
  assert.ok(!paths.some(path => /^templates\/aspnet-core\/(bin|obj)\/|^templates\/python\/__pycache__\//.test(path)), 'Package must exclude ASP.NET and Python build artifacts.');
  console.log(`PASS: npm distribution contains ${paths.length} files, CLI, full guidance, and bundled helper; no generated caches or development tests.`);
} finally {
  assert.equal(dirname(temporary), resolve(tmpdir()));
  rmSync(temporary, { recursive: true, force: true });
}
