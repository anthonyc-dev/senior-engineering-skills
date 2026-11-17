import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Manager = 'npm' | 'pnpm' | 'yarn' | 'bun';
type Selection = { name: Manager; source: 'packageManager' | 'lockfile' };
type Check = { script: string; command: string };
type Report = {
  root: string;
  packageManager: Selection | null;
  nodeEngine: string | null;
  lockfiles: string[];
  scriptNames: string[];
  checks: Check[];
  workspaces: boolean;
  otherManifests: string[];
  warnings: string[];
};

const lockfiles: Record<string, Manager> = {
  'package-lock.json': 'npm', 'npm-shrinkwrap.json': 'npm',
  'pnpm-lock.yaml': 'pnpm', 'yarn.lock': 'yarn', 'bun.lock': 'bun', 'bun.lockb': 'bun',
};
const checkNames = new Set(['verify', 'validate', 'check', 'typecheck', 'type-check', 'lint', 'test', 'test:unit', 'test:integration', 'build']);

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readManifest(root: string): Record<string, unknown> {
  const file = join(root, 'package.json');
  if (!existsSync(file)) return {};
  let value: unknown;
  try { value = JSON.parse(readFileSync(file, 'utf8')); }
  catch { throw new Error('Cannot read or parse package.json as JSON.'); }
  if (!record(value)) throw new Error('package.json must contain an object.');
  return value;
}

function selectManager(manifest: Record<string, unknown>, found: string[], warnings: string[]): Selection | null {
  const declared = typeof manifest.packageManager === 'string' ? manifest.packageManager.match(/^(npm|pnpm|yarn|bun)@[^\s]+$/) : null;
  const managers = [...new Set(found.map(file => lockfiles[file]))];
  if (manifest.packageManager !== undefined && !declared) {
    warnings.push('Unsupported packageManager declaration; inspect project instructions.');
    return null;
  }
  const name = declared?.[1] as Manager | undefined;
  if (managers.length > 1 || (name && managers.some(manager => manager !== name))) {
    warnings.push('Conflicting package manager evidence; resolve conflict before running checks.');
    return null;
  }
  if (name) return { name, source: 'packageManager' };
  if (managers[0]) return { name: managers[0], source: 'lockfile' };
  warnings.push('No package manager established; inspect documentation rather than assuming npm.');
  return null;
}

export function inspectProject(input: string): Report {
  const root = realpathSync(resolve(input));
  if (!statSync(root).isDirectory()) throw new Error('Project root must be a directory.');
  const present = (file: string): boolean => existsSync(join(root, file));
  const manifest = readManifest(root);
  const found = Object.keys(lockfiles).filter(present);
  const warnings: string[] = [];
  const packageManager = selectManager(manifest, found, warnings);
  const scripts = record(manifest.scripts) ? manifest.scripts : {};
  const scriptNames = Object.entries(scripts)
    .filter(([name, body]) => /^[a-zA-Z0-9][a-zA-Z0-9:_-]*$/.test(name) && typeof body === 'string' && body.trim())
    .map(([name]) => name).sort();
  const checks = packageManager ? scriptNames.filter(name => checkNames.has(name))
    .map(script => ({ script, command: `${packageManager.name} run ${script}` })) : [];
  const workspaces = Array.isArray(manifest.workspaces) || record(manifest.workspaces) || present('pnpm-workspace.yaml');
  if (workspaces) warnings.push('Workspace detected; this report covers only selected root, not child packages.');
  if (!present('package.json')) warnings.push('No package.json in selected root; use relevant language manifest and project documentation.');
  if (!checks.length) warnings.push('No established check commands; do not invent or claim executed validation.');
  const engine = record(manifest.engines) ? manifest.engines.node : null;
  return {
    root, packageManager, nodeEngine: typeof engine === 'string' && /^[\dv<>=~^*| .x-]+$/i.test(engine) ? engine : null,
    lockfiles: found, scriptNames, checks, workspaces,
    otherManifests: ['pyproject.toml', 'Cargo.toml', 'go.mod', 'composer.json', 'pubspec.yaml'].filter(present),
    warnings,
  };
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    console.log('Usage: node inspect-project.mts [project-directory]\nRead-only project evidence; JSON output. Does not execute scripts, install dependencies, read .env, or scan workspaces recursively. Requires Node.js >=22.20.');
    return;
  }
  if (args.length > 1 || args[0]?.startsWith('-')) throw new Error('Usage: node inspect-project.mts [project-directory]');
  console.log(JSON.stringify(inspectProject(args[0] ?? process.cwd()), null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); }
  catch (error) { console.error(error instanceof Error ? error.message : 'Project inspection failed.'); process.exitCode = 1; }
}
