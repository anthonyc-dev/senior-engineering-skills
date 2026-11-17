#!/usr/bin/env node
import { closeSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { isUtf8 } from 'node:buffer';
import { getSupportedAgents } from 'skills';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const directories = ['skills', 'knowledge', 'prompts', 'instructions', 'rules', 'standards', 'workflows', 'checklists', 'templates', 'glossary', 'adapters', 'examples', 'docs'];
const loaders = {
  codex: 'AGENTS.md', 'claude-code': 'CLAUDE.md', cursor: '.cursor/rules/senior-engineering.mdc',
  'gemini-cli': 'GEMINI.md', 'github-copilot': '.github/copilot-instructions.md',
};
const start = '<!-- senior-engineering-skills:start -->';
const end = '<!-- senior-engineering-skills:end -->';
const instruction = 'Read and follow project-root `.ai/AGENTS.md`. Existing project instructions take precedence. Load only task-relevant guidance.';
const registeredAgents = getSupportedAgents();
const bootstrap = Buffer.from(`---
name: senior-engineering-framework
description: Use when implementing, debugging, testing, reviewing, or planning software changes in this project using its installed full engineering framework.
---

# Project engineering framework

Read project-root \`.ai/AGENTS.md\` using this agent's file-reading capability before working on the change. The path is relative to the project root, not this skill directory.

Follow existing project instructions first. Use the framework's loading protocol to select relevant skills, knowledge, prompts, rules, standards, workflows, and checklists. Load supporting documents only when needed; do not inject the entire framework into every task.

Templates are adaptation examples, not active application configuration. Do not execute template CI, SQL, deployment, or paid actions merely because the files exist.

If the project framework is missing or file access is unavailable, report that limitation and request the relevant project guidance. Do not claim those instructions were loaded. This bridge depends on the full project-local .ai installation and is not a standalone engineering skill.
`);
/** @typedef {{ path: string, content: Buffer, previous: Buffer | null }} Write */
/** @typedef {{ source?: string, target?: string, agents: string[], dryRun?: boolean }} Options */

/** @param {string} agent */
function loaderPath(agent) {
  return Object.hasOwn(loaders, agent) ? loaders[/** @type {keyof typeof loaders} */ (agent)] : 'AGENTS.md';
}

export function frameworkAgents() {
  return [
    ...registeredAgents.map(agent => ({ id: agent.id, name: agent.name, projectSkillsDir: agent.projectSkillsDir, instructionFile: loaderPath(agent.id), activation: 'native framework skill and project instructions' })),
    { id: 'custom', name: 'Custom agent / manual activation', projectSkillsDir: null, instructionFile: 'AGENTS.md', activation: 'manual: configure the agent to read project-root .ai/AGENTS.md' },
  ];
}

/** @param {string[]} agents */
function selectedAgents(agents) {
  if (!agents?.length) throw new Error('Framework mode requires --agent. Use universal for shared skills or custom for manual setup.');
  const selected = [...new Set(agents.flatMap(agent => agent === '*' ? registeredAgents.map(item => item.id) : [agent]))];
  for (const agent of selected) {
    if (agent !== 'custom' && !registeredAgents.some(item => item.id === agent)) throw new Error(`Unsupported framework agent: ${agent}. Use agents to list supported IDs, or --agent custom for manual activation.`);
  }
  return selected;
}

/** @param {string} root @param {string} path */
function inside(root, path) {
  const value = relative(root, path);
  return value === '' || (!isAbsolute(value) && value !== '..' && !value.startsWith(`..${sep}`));
}

/** @param {string} path */
function stat(path) {
  try { return lstatSync(path); }
  catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return null;
    throw error;
  }
}

/** @param {string} root @param {string} path */
function safePath(root, path) {
  if (!inside(root, path)) throw new Error('Destination is outside project root.');
  let current = root;
  for (const part of relative(root, path).split(sep).filter(Boolean)) {
    current = join(current, part);
    const info = stat(current);
    if (info?.isSymbolicLink()) throw new Error(`Symlink destination refused: ${current}`);
    if (info && current !== path && !info.isDirectory()) throw new Error(`Expected directory: ${current}`);
  }
}

/** @param {string} root @param {string} path */
function existing(root, path) {
  safePath(root, path);
  const info = stat(path);
  if (!info) return null;
  if (!info.isFile()) throw new Error(`Expected regular file: ${path}`);
  return readFileSync(path);
}

/** @param {string} source @param {string} path */
function sourceFiles(source, path) {
  const info = stat(path);
  if (info?.isSymbolicLink()) throw new Error(`Symlink source refused: ${path}`);
  if (!info?.isDirectory()) throw new Error(`Missing framework directory: ${path}`);
  /** @type {string[]} */
  const files = [];
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (['.git', '.npmignore', 'node_modules', '.dart_tool', 'build', 'coverage', '__pycache__'].includes(entry.name)) continue;
    if (entry.name.startsWith('.env') || /\.(pem|key|p12|pfx)$/i.test(entry.name)) continue;
    const file = join(path, entry.name);
    if (relative(source, file).split(sep).join('/') === 'templates/flutter/pubspec.lock') continue;
    if (entry.isSymbolicLink()) throw new Error(`Symlink source refused: ${file}`);
    if (entry.isDirectory()) files.push(...sourceFiles(source, file));
    else if (entry.isFile()) files.push(file);
  }
  return files;
}

/** @param {Buffer | null} previous @param {boolean} cursor */
function loaderContent(previous, cursor) {
  if (previous && !isUtf8(previous)) throw new Error('Existing instruction file must use UTF-8; convert it explicitly before installation.');
  const text = previous?.toString('utf8') ?? '';
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const block = [start, instruction, end].join(eol);
  if (text.includes(start) || text.includes(end)) {
    if (text.split(start).length !== 2 || text.split(end).length !== 2 || !text.includes(block)) {
      throw new Error('Existing managed block was edited or is malformed; review it manually.');
    }
    return previous;
  }
  if (cursor && previous) throw new Error('Cursor loader file already exists without our managed block; review conflict manually.');
  const header = cursor ? '---\ndescription: Load project engineering guidance\nalwaysApply: true\n---\n\n' : '';
  const prefix = previous ? text + (text.endsWith(eol) ? eol : eol + eol) : header;
  return Buffer.from(prefix + block + eol);
}

/** @param {Options} options */
function plan(options) {
  const agents = selectedAgents(options.agents);
  const source = realpathSync(resolve(options.source ?? packageRoot));
  const target = realpathSync(resolve(options.target ?? process.cwd()));
  const destination = join(target, '.ai');
  if (!stat(target)?.isDirectory()) throw new Error('Target must be an existing project directory.');
  if (inside(source, destination) || inside(destination, source)) throw new Error('Source and framework destination overlap.');
  safePath(target, destination);
  if (stat(destination) && !stat(destination)?.isDirectory()) throw new Error('.ai destination must be a directory.');
  /** @type {Write[]} */
  const writes = [];
  const files = ['AGENTS.md', 'README.md', 'VERSION.md'].map(file => join(source, file));
  for (const directory of directories) files.push(...sourceFiles(source, join(source, directory)));
  for (const file of files) {
    if (stat(file)?.isSymbolicLink() || !stat(file)?.isFile()) throw new Error(`Expected regular source file: ${file}`);
    const path = join(destination, relative(source, file));
    const content = readFileSync(file), previous = existing(target, path);
    if (previous && !previous.equals(content)) throw new Error(`Framework file conflict: ${path}. Merge manually; nothing was overwritten.`);
    if (!previous) writes.push({ path, content, previous });
  }
  const ignorePath = join(destination, '.gitignore');
  const ignoreContent = Buffer.from('templates/flutter/.dart_tool/\ntemplates/flutter/build/\ntemplates/flutter/pubspec.lock\n');
  const previousIgnore = existing(target, ignorePath);
  if (previousIgnore && !previousIgnore.equals(ignoreContent)) throw new Error(`Framework file conflict: ${ignorePath}`);
  if (!previousIgnore) writes.push({ path: ignorePath, content: ignoreContent, previous: null });
  const instructionFiles = new Map(agents.map(agent => [loaderPath(agent), agent === 'cursor']));
  const skillDirectories = new Set(registeredAgents.filter(agent => agents.includes(agent.id)).map(agent => agent.projectSkillsDir));
  for (const directory of skillDirectories) {
    const path = resolve(target, directory, 'senior-engineering-framework/SKILL.md');
    const previous = existing(target, path);
    if (previous && !previous.equals(bootstrap)) throw new Error(`Native framework skill conflict: ${path}. Merge manually; nothing was overwritten.`);
    if (!previous) writes.push({ path, content: bootstrap, previous });
  }
  for (const [file, cursor] of instructionFiles) {
    const path = join(target, file);
    const previous = existing(target, path), content = loaderContent(previous, cursor);
    if (content && !content.equals(previous ?? Buffer.alloc(0))) writes.push({ path, content, previous });
  }
  const notes = agents.includes('custom') ? ['Custom agent requires manual activation: configure it to read project-root .ai/AGENTS.md; no native adapter is assumed.'] : [];
  return { target, writes, agents, notes };
}

/** @param {string} target @param {Write} change */
function apply(target, change) {
  const { path, previous, content } = change;
  const current = existing(target, path);
  if (previous ? !current?.equals(previous) : current !== null) throw new Error(`File changed during installation: ${path}`);
  mkdirSync(dirname(path), { recursive: true });
  safePath(target, path);
  if (!previous) { writeFileSync(path, content, { flag: 'wx' }); return; }
  const temporary = join(dirname(path), `.senior-engineering-${randomUUID()}.tmp`);
  try {
    writeFileSync(temporary, content, { flag: 'wx', mode: stat(path)?.mode });
    if (!existing(target, path)?.equals(previous)) throw new Error(`File changed during installation: ${path}`);
    renameSync(temporary, path);
  } finally { rmSync(temporary, { force: true }); }
}

/** @param {Options} options */
export function installFramework(options) {
  const prepared = plan(options);
  const result = { target: prepared.target, dryRun: options.dryRun ?? false, agents: prepared.agents, notes: prepared.notes, filesToWrite: prepared.writes.map(change => relative(prepared.target, change.path).split(sep).join('/')) };
  if (options.dryRun || !prepared.writes.length) return result;
  const lock = join(prepared.target, '.senior-engineering-install.lock');
  const handle = openSync(lock, 'wx');
  try {
    for (const change of prepared.writes) apply(prepared.target, change);
  } finally { closeSync(handle); rmSync(lock); }
  return result;
}

/** @param {string[]} args */
export function skillsArguments(args) {
  return ['add', 'anthonyc-dev/senior-engineering-skills', ...(args.includes('--copy') ? [] : ['--copy']), ...args];
}

function help() {
  console.log(`Usage: senior-engineering-skills <framework|skills|agents> [options]

framework --agent <id> [--agent <id>] [--target <project>] [--dry-run]
  Copy full guidance into .ai/ and append agent loader instructions.
  Supports ${registeredAgents.length} registry targets including Codex; use agents to list IDs.
  Use --agent universal for shared Agent Skills clients, '*' for all registry targets,
  or --agent custom for full files plus manual activation instructions.
  Refuses conflicting files. No global mode or automatic overwrite.

skills [upstream options]
  Run pinned Vercel skills installer; root framework guidance is not copied.
  Example: skills --skill '*' --agent claude-code

agents
  List framework targets, project paths, and activation mechanisms as JSON.
`);
}

function main() {
  const [mode, ...args] = process.argv.slice(2);
  if (!mode || mode === '--help' || mode === '-h' || (mode === 'framework' && args.length === 1 && args[0] === '--help')) { help(); return; }
  if (mode === 'agents') {
    if (args.length) throw new Error('Usage: senior-engineering-skills agents');
    console.log(JSON.stringify(frameworkAgents(), null, 2));
    return;
  }
  if (mode === 'skills') {
    const cli = fileURLToPath(import.meta.resolve('skills/bin/cli.mjs'));
    const child = spawnSync(process.execPath, [cli, ...skillsArguments(args)], { stdio: 'inherit', windowsHide: true });
    if (child.error) throw child.error;
    process.exitCode = child.status ?? 1;
    return;
  }
  if (mode !== 'framework') throw new Error('Choose framework, skills, or agents. Use --help for usage.');
  const { values } = parseArgs({ args, options: {
    agent: { type: 'string', multiple: true, short: 'a' }, target: { type: 'string', short: 't' }, 'dry-run': { type: 'boolean' },
  } });
  const result = installFramework({ agents: values.agent ?? [], target: values.target, dryRun: values['dry-run'] });
  console.log(JSON.stringify(result, null, 2));
  if (!result.dryRun) console.log('Framework ready. Review .ai/ and agent loader changes before committing.');
}

if (process.argv[1] && realpathSync(resolve(process.argv[1])) === fileURLToPath(import.meta.url)) {
  try { main(); }
  catch (error) { console.error(error instanceof Error ? error.message : 'Installation failed.'); process.exitCode = 1; }
}
