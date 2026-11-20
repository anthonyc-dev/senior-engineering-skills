import { createHash, randomUUID } from 'node:crypto';
import { closeSync, lstatSync, mkdirSync, openSync, readFileSync, realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, toNamespacedPath } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { parseArgs } from 'node:util';

const categories = new Set(['solution', 'decision', 'pattern', 'preference', 'project', 'lesson']);
const entryId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const credential = /-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:gh[pousr]_|github_pat_|sk-(?:proj-)?|sk_(?:live|test)_|npm_|AIza|xox[baprs]-)[\w-]{16,}|(?:AKIA|ASIA)[A-Z0-9]{16}|\beyJ[\w-]+\.eyJ[\w-]+\.[\w-]{12,}|https?:\/\/[^\s/@]+:[^\s/@]+@|\b(?:bearer\s+[\w.-]{12,}|(?:password|passwd|secret|api[_ -]?key|(?:access[_ -]?)?token)\s*["']?\s*[:=]\s*["']?\S+)/i;
const latest = 'SELECT * FROM versions WHERE id = ? ORDER BY version DESC LIMIT 1';
const insert = 'INSERT INTO versions VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
const backupLimit = 16 * 1024 * 1024;

class MemoryError extends Error {}

function requireCondition(condition, message) {
  if (!condition) throw new MemoryError(message);
}

function inspectPath(path, isDirectory) {
  const info = lstatSync(path);
  requireCondition(!info.isSymbolicLink() && (isDirectory ? info.isDirectory() : info.isFile()), 'Unsafe memory storage path.');
  if (process.platform !== 'win32') {
    requireCondition(info.uid === process.getuid() && (info.mode & 0o077) === 0, 'Memory storage must be owned by the current user and private.');
  }
}

function database(scope, writable) {
  const directory = join(homedir(), '.senior-engineering-memory');
  if (writable) {
    try { mkdirSync(directory, { mode: 0o700 }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  } else if (!lstatSync(directory, { throwIfNoEntry: false })) return null;
  inspectPath(directory, true);
  const key = scope === 'project' ? `project:${realpathSync.native(process.cwd())}` : scope;
  const path = join(directory, createHash('sha256').update(key).digest('hex') + '.sqlite');
  if (writable) {
    try { closeSync(openSync(path, 'wx', 0o600)); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  } else if (!lstatSync(path, { throwIfNoEntry: false })) return null;
  inspectPath(path, false);
  const db = new DatabaseSync(toNamespacedPath(path), { readOnly: !writable });
  db.exec('PRAGMA busy_timeout = 5000; PRAGMA trusted_schema = OFF;');
  if (!writable) {
    if (db.prepare("SELECT 1 FROM sqlite_schema WHERE name = 'versions' AND type = 'table'").get()) return db;
    db.close();
    return null;
  }
  db.exec(`
    PRAGMA secure_delete = ON;
    CREATE TABLE IF NOT EXISTS versions (
      id TEXT, version INTEGER, category TEXT, text TEXT, source TEXT,
      confidence REAL, status TEXT, timestamp TEXT, PRIMARY KEY (id, version)
    ) STRICT;
    CREATE TABLE IF NOT EXISTS deletions (id TEXT, timestamp TEXT) STRICT;
  `);
  return db;
}

async function readInput(limit) {
  const chunks = [];
  let size = 0;
  requireCondition(!process.stdin.isTTY, 'Supply JSON through stdin.');
  for await (const chunk of process.stdin) {
    size += chunk.length;
    requireCondition(size <= limit, 'Memory input exceeds the size limit.');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new MemoryError('Expected valid JSON on stdin.'); }
}

function validateEntry(entry) {
  requireCondition(entry && categories.has(entry.category), 'Invalid memory category.');
  for (const [value, maximum] of [[entry.text, 6000], [entry.source, 500]]) {
    requireCondition(typeof value === 'string' && value.trim() && value.length <= maximum, 'Invalid memory text or source.');
    requireCondition(!credential.test(value) && value.isWellFormed() && !value.includes('\0'), 'Possible credential or unsafe value; sanitize the input.');
  }
  requireCondition(Number.isFinite(entry.confidence) && entry.confidence >= 0 && entry.confidence <= 1, 'Confidence must be between 0 and 1.');
  return entry;
}

function searchTerms(query) {
  requireCondition(query.trim() && query.length <= 200 && !credential.test(query), 'Use a sanitized query of at most 200 characters.');
  return [...new Set(query.toLowerCase().split(/\s+/).filter(Boolean))];
}

function matchCount(terms, text) {
  const lowercase = text.toLowerCase();
  return terms.filter(term => lowercase.includes(term)).length;
}

function search(db, terms) {
  if (!db) return [];
  const rows = db.prepare(`
    SELECT current.* FROM versions current
    WHERE current.status != 'pending' AND current.version = (
      SELECT MAX(version) FROM versions WHERE id = current.id
    )
  `).all();
  return rows.map(row => ({
    row, matches: matchCount(terms, `${row.category} ${row.text} ${row.source}`),
  })).filter(item => item.matches > 0)
    .sort((a, b) => b.matches - a.matches
      || Number(b.row.status === 'verified') - Number(a.row.status === 'verified')
      || b.row.confidence - a.row.confidence
      || b.row.timestamp.localeCompare(a.row.timestamp))
    .slice(0, 20).map(item => item.row);
}

function searchDocuments(paths, terms) {
  requireCondition(paths.length <= 32, 'Select at most 32 Markdown documents.');
  const root = realpathSync.native(process.cwd());
  const hits = [];
  for (const path of new Set(paths.map(item => item.replaceAll('\\', '/')))) {
    const segments = path.split('/');
    requireCondition(path.length <= 300 && /\.md$/i.test(path) && segments.every(segment =>
      /^[\w. -]+$/.test(segment) && !segment.startsWith(' ') && !/[. ]$/.test(segment)
      && !/^(?:\.git|node_modules|build|dist|coverage|\.env.*|.*(?:secrets?|credentials?).*)$/i.test(segment)),
    'Select regular project-relative Markdown documents outside generated and sensitive paths.');
    let current = root;
    for (const [index, segment] of segments.entries()) {
      current = join(current, segment);
      const info = lstatSync(current, { throwIfNoEntry: false });
      const last = index === segments.length - 1;
      requireCondition(info && !info.isSymbolicLink() && (last ? info.isFile() && info.size <= 128 * 1024 : info.isDirectory()),
        'Selected Markdown document is missing, unsafe, or larger than 128 KiB.');
    }
    const lines = readFileSync(current, 'utf8').split(/\r?\n/);
    let best = { path, line: 0, matches: 0 };
    for (const [index, line] of lines.entries()) {
      if (credential.test(line)) continue;
      const matches = matchCount(terms, line);
      if (matches > best.matches) best = { path, line: index + 1, matches };
    }
    if (best.matches) hits.push(best);
  }
  return hits.sort((a, b) => b.matches - a.matches || a.path.localeCompare(b.path))
    .slice(0, 20).map(({ path, line }) => ({ path, line }));
}

function transaction(db, write) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = write();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

function checkStorageBudget(db) {
  // Each UTF-8 byte takes at most six bytes when escaped as JSON.
  const { bytes } = db.prepare(`
    SELECT COALESCE(SUM(300 + 6 * (length(CAST(text AS BLOB)) + length(CAST(source AS BLOB)))), 0) AS bytes
    FROM versions
  `).get();
  requireCondition(bytes <= backupLimit - 2, 'Scope reached the backup size limit. Use history and delete approved obsolete entries before adding versions.');
}

function restore(db, backup) {
  requireCondition(Array.isArray(backup), 'Expected a memory export array.');
  const versions = new Map();
  const statement = db.prepare(insert);
  return transaction(db, () => {
    requireCondition(!db.prepare('SELECT 1 FROM versions UNION ALL SELECT 1 FROM deletions LIMIT 1').get(), 'Restore requires an unused scope.');
    for (const row of backup) {
      validateEntry(row);
      const previous = versions.get(row.id);
      requireCondition(typeof row.id === 'string' && entryId.test(row.id)
        && row.version === (previous?.version ?? 0) + 1
        && ['pending', 'approved', 'verified'].includes(row.status)
        && typeof row.timestamp === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(row.timestamp)
        && Number.isFinite(Date.parse(row.timestamp))
        && new Date(row.timestamp).toISOString() === row.timestamp, 'Invalid backup version, status, ID, or timestamp.');
      requireCondition(row.status === 'pending' || (previous && previous.status === 'pending'
        && ['category', 'text', 'source', 'confidence'].every(key => previous[key] === row[key])), 'Backup contains an invalid approval.');
      statement.run(row.id, row.version, row.category, row.text, row.source, row.confidence, row.status, row.timestamp);
      versions.set(row.id, row);
    }
    checkStorageBudget(db);
    return { restoredVersions: backup.length };
  });
}

function change(db, command, id, input, verified, expectedVersion) {
  return transaction(db, () => {
    const previous = db.prepare(latest).get(id);
    requireCondition(command === 'add' || previous, 'Memory entry does not exist in this scope.');
    if (command === 'approve') {
      requireCondition(previous.version === expectedVersion && previous.status === 'pending', 'Approval requires the current pending version.');
    }
    const timestamp = new Date().toISOString();
    let result = { id };
    if (command === 'delete') {
      db.prepare('DELETE FROM versions WHERE id = ?').run(id);
      db.prepare('INSERT INTO deletions VALUES (?, ?)').run(id, timestamp);
    } else {
      const entry = input ?? previous;
      const version = (previous?.version ?? 0) + 1;
      const status = command === 'approve' ? (verified ? 'verified' : 'approved') : 'pending';
      db.prepare(insert).run(id, version, entry.category, entry.text, entry.source, entry.confidence, status, timestamp);
      checkStorageBudget(db);
      result = { id, version, status };
    }
    return result;
  });
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { scope: { type: 'string', default: 'project' }, verified: { type: 'boolean' }, confirm: { type: 'boolean' }, version: { type: 'string' }, document: { type: 'string', multiple: true } },
  });
  const [command, argument] = positionals;
  const arity = new Map([['add', 1], ['update', 2], ['approve', 2], ['history', 2], ['search', 2], ['export', 1], ['restore', 1], ['delete', 2]]);
  requireCondition(arity.get(command) === positionals.length, 'Usage: memory.mjs add|update|approve|history|search|export|restore|delete [id or query] [--scope project|global|shared:NAME] [--version n] [--verified] [--confirm] [--document path]');
  const { scope, verified, confirm, version, document } = values;
  requireCondition(/^(?:project|global|shared:[a-z0-9][a-z0-9-]{0,49})$/.test(scope), 'Invalid memory scope.');
  requireCondition(!verified || command === 'approve', '--verified requires approve.');
  requireCondition(!document || command === 'search', '--document requires search.');
  requireCondition(command === 'approve' ? /^[1-9]\d*$/.test(version ?? '') && Number.isSafeInteger(Number(version)) : version === undefined, 'Use --version with the pending version when approving.');
  if (['update', 'approve', 'history', 'delete'].includes(command)) {
    requireCondition(entryId.test(argument), 'Invalid memory ID.');
  }
  if (['export', 'restore', 'delete'].includes(command) || (scope.startsWith('shared:') && command === 'approve')) {
    requireCondition(confirm, 'Explicit --confirm is required for this operation.');
  }
  const input = command === 'add' || command === 'update' ? validateEntry(await readInput(65536)) : undefined;
  const backup = command === 'restore' ? await readInput(backupLimit) : undefined;
  const db = database(scope, !['search', 'history', 'export'].includes(command));
  try {
    let result;
    if (command === 'search') {
      const terms = searchTerms(argument);
      const memory = search(db, terms);
      result = document ? { memory, documents: searchDocuments(document, terms) } : memory;
    }
    else if (command === 'history') result = db?.prepare('SELECT * FROM versions WHERE id = ? ORDER BY version').all(argument) ?? [];
    else if (command === 'export') result = db?.prepare('SELECT * FROM versions ORDER BY id, version').all() ?? [];
    else if (command === 'restore') result = restore(db, backup);
    else result = change(db, command, argument ?? randomUUID(), input, verified, Number(version));
    console.log(JSON.stringify(result, null, 2));
  } finally { db?.close(); }
}

try { await main(); }
catch (error) {
  const code = typeof error?.code === 'string' && /^[A-Z0-9_]+$/.test(error.code)
    ? ` (${error.code}${Number.isInteger(error.errcode) ? `:${error.errcode}` : ''})` : '';
  console.error(error instanceof MemoryError ? error.message : `Memory command failed${code}. Check arguments, storage permissions, and database availability.`);
  process.exitCode = 1;
}
