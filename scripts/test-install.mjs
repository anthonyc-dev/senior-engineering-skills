import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { lstatSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSupportedAgents } from 'skills';
import { packRoot, validatePack } from './validate-skills.mjs';

const cli = fileURLToPath(import.meta.resolve('skills/bin/cli.mjs'));

function runCli(args, cwd, state) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd,
    env: { ...process.env, DISABLE_TELEMETRY: '1', XDG_STATE_HOME: state },
    encoding: 'utf8',
    timeout: 60000,
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result.stdout;
}

function compareFiles(source, destination) {
  assert.ok(!lstatSync(destination).isSymbolicLink(), `Expected copied directory: ${destination}`);
  let count = 0;
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const original = join(source, entry.name);
    const copy = join(destination, entry.name);
    assert.ok(!lstatSync(copy).isSymbolicLink(), `Expected copied file: ${copy}`);
    if (entry.isDirectory()) count += compareFiles(original, copy);
    else { assert.deepEqual(readFileSync(copy), readFileSync(original), `Content changed: ${copy}`); count++; }
  }
  assert.deepEqual(readdirSync(destination).sort(), readdirSync(source).sort());
  return count;
}

function testInstall(root, skills, state, selected) {
  runCli(['add', packRoot, '--skill', ...selected, '--agent', 'codex', '--copy', '--yes', '--json'], root, state);
  const destination = join(root, '.agents', 'skills');
  const names = skills.map(skill => skill.name).sort();
  assert.deepEqual(readdirSync(destination).sort(), names);
  const listed = JSON.parse(runCli(['list', '--json'], root, state));
  assert.deepEqual(listed.map(skill => skill.name).sort(), names);
  assert.ok(listed.every(skill => skill.scope === 'project'), 'Expected project-only installs');
  return skills.reduce((count, skill) => count + compareFiles(skill.path, join(destination, skill.name)), 0);
}

function testStandaloneTargets(root, skill, state) {
  const targets = ['codex', 'claude-code', 'cursor', 'gemini-cli', 'github-copilot', 'opencode'];
  const registry = getSupportedAgents();
  for (const agent of targets) {
    const project = join(root, `${agent} project`);
    mkdirSync(project);
    writeFileSync(join(project, 'package.json'), JSON.stringify({
      type: 'commonjs', packageManager: 'pnpm@9.15.0', scripts: { verify: 'do-not-execute' },
    }));
    runCli(['add', packRoot, '--skill', skill.name, '--agent', agent, '--copy', '--yes', '--json'], project, state);
    const directory = registry.find(item => item.id === agent).projectSkillsDir;
    const destination = join(project, directory, skill.name);
    compareFiles(skill.path, destination);
    const listed = JSON.parse(runCli(['list', '--agent', agent, '--json'], project, state));
    assert.deepEqual(listed.map(entry => entry.name), [skill.name]);
    const inspected = spawnSync(process.execPath, [join(destination, 'scripts', 'inspect-project.mts'), project], {
      cwd: project, encoding: 'utf8', timeout: 10000, windowsHide: true,
    });
    assert.ifError(inspected.error);
    assert.equal(inspected.status, 0, inspected.stderr);
    const report = JSON.parse(inspected.stdout);
    assert.equal(report.packageManager.name, 'pnpm');
    assert.deepEqual(report.checks, [{ script: 'verify', command: 'pnpm run verify' }]);

    const advanced = ['agent-orchestration', 'engineering-memory', 'skill-evaluation'];
    runCli(['add', packRoot, '--skill', ...advanced, '--agent', agent, '--copy', '--yes', '--json'], project, state);
    for (const name of advanced) {
      compareFiles(join(packRoot, 'skills', name), join(project, directory, name));
    }
    const expanded = JSON.parse(runCli(['list', '--agent', agent, '--json'], project, state));
    assert.deepEqual(expanded.map(entry => entry.name).sort(), [...advanced, skill.name].sort());
    const home = join(project, 'isolated home');
    mkdirSync(home);
    const memoryScript = join(project, directory, 'engineering-memory', 'scripts', 'memory.mjs');
    const memoryOptions = {
      cwd: project, env: { ...process.env, HOME: home, USERPROFILE: home }, encoding: 'utf8', timeout: 10000, windowsHide: true,
    };
    const memory = spawnSync(process.execPath, [memoryScript, 'search', 'empty'], memoryOptions);
    assert.ifError(memory.error);
    assert.equal(memory.status, 0, `${agent} copied memory helper: ${memory.stderr}`);
    assert.deepEqual(JSON.parse(memory.stdout), []);
    const saved = spawnSync(process.execPath, [memoryScript, 'add'], {
      ...memoryOptions, input: JSON.stringify({ category: 'pattern', text: 'Isolated fixture.', source: 'smoke', confidence: 1 }),
    });
    assert.ifError(saved.error);
    assert.equal(saved.status, 0, `${agent} copied memory write: ${saved.stderr}`);
    assert.equal(JSON.parse(saved.stdout).status, 'pending');
    const evidence = join(project, 'evaluation.json');
    writeFileSync(evidence, JSON.stringify({ suite: 'smoke', client: agent, model: 'fixture', revision: 'fixture', cases: ['empty'], results: {} }));
    const evaluated = spawnSync(process.execPath, [join(project, directory, 'skill-evaluation', 'scripts', 'evaluate.mjs'), evidence], {
      cwd: project, encoding: 'utf8', timeout: 10000, windowsHide: true,
    });
    assert.ifError(evaluated.error);
    assert.equal(evaluated.status, 0, `${agent} copied evaluation helper: ${evaluated.stderr}`);
    assert.equal(JSON.parse(evaluated.stdout).runs[0].counts['NOT TESTED'], 1);
  }
  return targets.length;
}

function main() {
  const options = process.argv.slice(2);
  if (options.includes('--help') && options.length === 1) {
    console.log('Usage: node scripts/test-install.mjs\nTests discovery, complete and subset installs in temporary projects; removes test files afterwards.');
    return;
  }
  assert.equal(options.length, 0, 'Unknown option. Usage: node scripts/test-install.mjs');
  const result = validatePack();
  assert.deepEqual(result.errors, [], 'Pack must validate before installation');
  const root = mkdtempSync(join(tmpdir(), 'ai skills install '));
  try {
    const state = join(root, 'state');
    const discovered = runCli(['add', packRoot, '--list'], root, state);
    assert.match(discovered, new RegExp(`Found ${result.skills.length} skills`));
    for (const skill of result.skills) assert.ok(discovered.includes(skill.name));
    const copiedFiles = testInstall(root, result.skills, state, ['*']);
    const subsetNames = ['production-quality-code', 'code-quality', 'owasp-security-implementation-plan', 'task-completion'];
    const subset = result.skills.filter(skill => subsetNames.includes(skill.name));
    assert.equal(subset.length, subsetNames.length, 'Documented subset must exist');
    const subsetRoot = join(root, 'subset project');
    mkdirSync(subsetRoot);
    testInstall(subsetRoot, subset, state, subsetNames);
    const core = result.skills.find(skill => skill.name === 'production-quality-code');
    assert.ok(core, 'Standalone engineering skill must exist');
    const targets = testStandaloneTargets(root, core, state);
    console.log(`PASS: ${result.skills.length} skills; ${copiedFiles} identical files; ${subset.length}-skill subset; standalone core, advanced skills and copied helpers verified for ${targets} agent installation targets.`);
  } finally {
    assert.equal(dirname(root), resolve(tmpdir()), 'Cleanup must remain inside temporary directory');
    rmSync(root, { recursive: true, force: true });
  }
}

try { main(); }
catch (error) { console.error(`Install smoke test failed: ${error.message}`); process.exitCode = 1; }
