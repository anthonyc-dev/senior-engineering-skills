import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const packRoot = fileURLToPath(new URL('../', import.meta.url));

function inside(root, target) {
  const path = relative(root, target);
  return path === '' || (!isAbsolute(path) && path !== '..' && !path.startsWith(`..${sep}`));
}

function readMetadata(file, directory, errors) {
  const text = readFileSync(file, 'utf8');
  const header = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!header) { errors.push(`${file}: missing YAML frontmatter`); return null; }
  let data;
  try { data = parse(header[1], { maxAliasCount: 0 }); }
  catch (error) { errors.push(`${file}: invalid YAML: ${error.message}`); return null; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    errors.push(`${file}: frontmatter must be a mapping`);
    return null;
  }
  if (Object.keys(data).some(key => !['name', 'description'].includes(key))) {
    errors.push(`${file}: this framework permits only name and description in frontmatter`);
  }
  if (typeof data.name !== 'string' || data.name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.name)) {
    errors.push(`${file}: name must be 1-64 lowercase letters, numbers, or single hyphens`);
  }
  if (data.name !== directory) errors.push(`${file}: name must match directory ${directory}`);
  if (typeof data.description !== 'string' || !data.description.trim() || data.description.length > 1024) {
    errors.push(`${file}: description must be a nonempty string of at most 1024 characters`);
  }
  if (!text.slice(header[0].length).trim()) errors.push(`${file}: skill body is empty`);
  return { name: data.name, directory, path: dirname(file) };
}

function markdownFiles(directory, errors) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) errors.push(`${file}: symlinks are not supported in this portable pack`);
    else if (entry.isDirectory()) files.push(...markdownFiles(file, errors));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(file);
  }
  return files;
}

function checkTarget(file, rawTarget, boundary, errors) {
  const target = rawTarget.replace(/^<|>$/g, '').split('#')[0];
  if (!target || /^(?:https?|mailto):/i.test(target)) return false;
  let decoded;
  try { decoded = decodeURIComponent(target); }
  catch { errors.push(`${file}: invalid encoded reference ${target}`); return false; }
  if (/^(?:[a-zA-Z]:[\\/]|[\\/]|file:)/i.test(decoded)) {
    errors.push(`${file}: absolute reference is not portable: ${target}`);
    return true;
  }
  const resolved = resolve(dirname(file), decoded);
  if (!inside(boundary, resolved)) {
    errors.push(`${file}: reference outside ${boundary.includes(`${sep}skills${sep}`) ? 'skill' : 'pack'}: ${target}`);
  } else if (!existsSync(resolved)) errors.push(`${file}: missing reference ${target}`);
  else if (!inside(realpathSync(boundary), realpathSync(resolved))) errors.push(`${file}: reference resolves outside skill or pack: ${target}`);
  return true;
}

function checkReferences(file, boundary, errors, bareReferences = false) {
  // shortcut: inline links and backticked Markdown paths only; use a Markdown parser if reference-style links are introduced.
  const text = readFileSync(file, 'utf8');
  let checked = 0;
  for (const match of text.matchAll(/\[[^\]\n]*\]\(\s*(<[^>\n]+>|[^)\s]+)/g)) {
    if (checkTarget(file, match[1], boundary, errors)) checked++;
  }
  if (bareReferences) {
    for (const match of text.matchAll(/`([^`\n]+\.md)`/g)) {
      if (checkTarget(file, match[1], boundary, errors)) checked++;
    }
  }
  return checked;
}

function checkCatalog(root, skills, errors) {
  const file = resolve(root, 'skills/README.md');
  if (!existsSync(file)) { errors.push(`${file}: missing skill catalog`); return; }
  const text = readFileSync(file, 'utf8');
  const names = skills.map(skill => skill.name);
  const entries = [...text.matchAll(/\| \[([^\]]+)\]\(([^)]+)\/SKILL\.md\)/g)];
  for (const name of names) {
    if (entries.filter(entry => entry[1] === name).length !== 1) {
      errors.push(`${file}: catalog must list ${name} exactly once with its matching directory`);
    }
  }
  for (const entry of entries) {
    if (!names.includes(entry[1])) errors.push(`${file}: unknown catalog skill ${entry[1]}`);
    if (entry[1] !== entry[2]) errors.push(`${file}: catalog label ${entry[1]} must match directory ${entry[2]}`);
  }
  const companions = text.split('## Companion skills')[1] ?? '';
  for (const match of companions.matchAll(/`([a-z0-9-]+)`/g)) {
    if (!names.includes(match[1])) errors.push(`${file}: missing companion skill ${match[1]}`);
  }
}

export function validatePack(root = packRoot) {
  root = resolve(root);
  const errors = [];
  const skills = [];
  let checkedReferences = 0;
  const directory = resolve(root, 'skills');
  if (!existsSync(directory)) return { skills, checkedReferences, errors: [`${directory}: missing skills directory`] };
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const location = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) { errors.push(`${location}: symlink skill directories are not supported`); continue; }
    if (!entry.isDirectory()) continue;
    const file = resolve(location, 'SKILL.md');
    if (!existsSync(file) || !lstatSync(file).isFile()) { errors.push(`${file}: missing regular SKILL.md`); continue; }
    const skill = readMetadata(file, entry.name, errors);
    if (skill) skills.push(skill);
    for (const document of markdownFiles(location, errors)) {
      checkedReferences += checkReferences(document, location, errors, document === file);
    }
  }
  const names = new Set();
  for (const skill of skills) {
    if (names.has(skill.name)) errors.push(`duplicate skill name: ${skill.name}`);
    names.add(skill.name);
  }
  if (!skills.length) errors.push(`${directory}: no valid skills found`);
  checkCatalog(root, skills, errors);
  for (const local of ['README.md', 'skills/README.md']) {
    const file = resolve(root, local);
    if (existsSync(file)) checkedReferences += checkReferences(file, root, errors);
    else errors.push(`${file}: missing documentation`);
  }
  return { skills, checkedReferences, errors };
}

function main() {
  const options = process.argv.slice(2);
  if (options.some(option => !['--help', '--json'].includes(option))) {
    console.error('Unknown option. Usage: node scripts/validate-skills.mjs [--json | --help]');
    process.exitCode = 1;
    return;
  }
  if (options.includes('--help')) {
    console.log('Usage: node scripts/validate-skills.mjs [--json | --help]\nRead-only checks for skill metadata, catalog, companions, and local references.');
    return;
  }
  try {
    const result = validatePack();
    if (options.includes('--json')) console.log(JSON.stringify(result, null, 2));
    else if (result.errors.length) console.error(result.errors.join('\n'));
    else console.log(`PASS: ${result.skills.length} skills; ${result.checkedReferences} local references; catalog and companion skills valid.`);
    if (result.errors.length) process.exitCode = 1;
  } catch (error) { console.error(`Validation failed: ${error.message}`); process.exitCode = 1; }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
