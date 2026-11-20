import { lstatSync, readFileSync } from 'node:fs';

const statuses = new Set(['PASS', 'FAIL', 'BLOCKED', 'NOT TESTED']);
const own = (object, key) => Object.hasOwn(object, key);
const label = value => typeof value === 'string' && value.trim() && value.length <= 150;
const record = value => value && typeof value === 'object' && !Array.isArray(value);

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function readRun(path) {
  let run;
  try {
    const info = lstatSync(path);
    if (!info.isFile() || info.size > 1024 * 1024) throw new Error();
    run = JSON.parse(readFileSync(path, 'utf8'));
  } catch { throw new Error('Expected a regular JSON evidence file of at most 1 MiB.'); }
  requireCondition(record(run) && ['suite', 'client', 'model', 'revision'].every(key => label(run[key])), 'Invalid run identity.');
  requireCondition(Array.isArray(run.cases) && run.cases.length && run.cases.every(label)
    && new Set(run.cases).size === run.cases.length && record(run.results), 'Invalid case list or result object.');
  for (const [id, result] of Object.entries(run.results)) {
    requireCondition(run.cases.includes(id) && record(result) && statuses.has(result.status)
      && (result.status === 'NOT TESTED' || label(result.evidence)), 'Invalid result or missing evidence reference.');
  }
  return run;
}

function status(run, id) {
  return own(run.results, id) ? run.results[id].status : 'NOT TESTED';
}

function report(run) {
  const counts = Object.fromEntries([...statuses].map(value => [value, 0]));
  for (const id of run.cases) counts[status(run, id)]++;
  const results = Object.fromEntries(Object.entries(run.results).map(([id, result]) => [
    id, result.status === 'NOT TESTED' ? { status: result.status } : { status: result.status, evidence: result.evidence },
  ]));
  return { suite: run.suite, client: run.client, model: run.model, revision: run.revision, counts, results };
}

try {
  const args = process.argv.slice(2);
  requireCondition(args.length >= 1 && args.length <= 2, 'Usage: evaluate.mjs <evidence.json> [comparison.json]');
  const [before, after] = args.map(readRun);
  const output = { runs: [report(before)] };
  if (after) {
    requireCondition(['suite', 'client', 'model'].every(key => before[key] === after[key])
      && before.cases.length === after.cases.length && before.cases.every(id => after.cases.includes(id)),
    'Comparison requires the same suite, cases, client, and model.');
    output.runs.push(report(after));
    output.comparisons = before.cases.map(id => ({ case: id, before: status(before, id), after: status(after, id) }));
  }
  console.log(JSON.stringify(output, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
