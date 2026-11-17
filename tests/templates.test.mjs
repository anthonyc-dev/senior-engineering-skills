import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { parse } from 'yaml';
import ts from 'typescript';

const root = fileURLToPath(new URL('../templates/', import.meta.url));
const categories = ['docker', 'documentation', 'flutter', 'github-actions', 'nestjs', 'nextjs', 'prompts', 'react', 'sql'];

test('every template category includes usage instructions and a usable artifact', () => {
  assert.deepEqual(readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort(), categories);
  for (const category of categories) {
    const directory = join(root, category);
    assert.ok(existsSync(join(directory, 'README.md')), `Missing usage guide: ${category}`);
    const artifacts = readdirSync(directory, { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name !== 'README.md' && entry.name !== 'pubspec.lock')
      .map(entry => entry.name);
    assert.ok(artifacts.length > 0, `Empty template category: ${category}`);
    for (const name of artifacts) assert.ok(readFileSync(join(directory, name), 'utf8').trim(), `Empty artifact: ${category}/${name}`);
  }
});

test('template documentation links resolve locally', () => {
  const documents = [join(root, 'README.md'), ...categories.map(category => join(root, category, 'README.md'))];
  for (const file of documents) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(match[1])) continue;
      assert.ok(existsSync(join(dirname(file), match[1].split('#')[0])), `${file}: ${match[1]}`);
    }
  }
});

test('TypeScript and TSX templates have valid syntax', () => {
  for (const file of ['react/AsyncContent.tsx', 'nextjs/error.tsx', 'nestjs/page-query.dto.ts']) {
    const result = ts.transpileModule(readFileSync(join(root, file), 'utf8'), {
      fileName: file,
      reportDiagnostics: true,
      compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, experimentalDecorators: true },
    });
    const errors = (result.diagnostics ?? []).filter(item => item.category === ts.DiagnosticCategory.Error);
    assert.deepEqual(errors.map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')), [], file);
  }
});

test('CI template uses read-only permissions and immutable action references', () => {
  const workflow = parse(readFileSync(join(root, 'github-actions/node-ci.yml'), 'utf8'));
  assert.equal(workflow.permissions.contents, 'read');
  assert.ok(workflow.on.pull_request !== undefined);
  assert.ok(!workflow.on.pull_request_target);
  for (const step of workflow.jobs.check.steps.filter(step => step.uses)) assert.match(step.uses, /^[\w-]+\/[\w-]+@[a-f0-9]{40}$/);
  assert.ok(workflow.jobs.check.steps.some(step => step.run === 'npm run check'));
  assert.ok(workflow.jobs.check['timeout-minutes'] > 0);
});

test('Flutter templates have package context for in-place editor analysis and tests', () => {
  const manifest = parse(readFileSync(join(root, 'flutter/pubspec.yaml'), 'utf8'));
  assert.equal(manifest.publish_to, 'none');
  assert.equal(manifest.dependencies.flutter.sdk, 'flutter');
  assert.equal(manifest.dev_dependencies.flutter_test.sdk, 'flutter');
  assert.ok(manifest.environment.sdk);
});
