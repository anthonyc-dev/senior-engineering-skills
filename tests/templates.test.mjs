import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { compileFunction } from 'node:vm';
import { parse } from 'yaml';
import ts from 'typescript';

const root = fileURLToPath(new URL('../templates/', import.meta.url));
const categories = ['aspnet-core', 'docker', 'documentation', 'express', 'flutter', 'github-actions', 'go', 'nestjs', 'nextjs', 'prompts', 'python', 'react', 'sql'];

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

function loadTemplate(relativePath) {
  const filename = join(root, relativePath);
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
      experimentalDecorators: true, emitDecoratorMetadata: true,
    },
  });
  const module = { exports: {} };
  const evaluate = compileFunction(outputText, ['require', 'module', 'exports'], { filename });
  evaluate(createRequire(filename), module, module.exports);
  return module.exports;
}

test('React states and the Next.js error boundary render safe markup', async () => {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { AsyncContent } = loadTemplate('react/AsyncContent.tsx');
  const { default: ErrorBoundary } = loadTemplate('nextjs/error.tsx');
  const renderState = (state, onRetry) => renderToStaticMarkup(createElement(AsyncContent, {
    state, onRetry, children: data => createElement('strong', null, data),
  }));
  assert.match(renderState({ status: 'loading' }), /role="status"/);
  assert.match(renderState({ status: 'empty' }), /No content yet/);
  assert.match(renderState({ status: 'ready', data: 'Example' }), /<strong>Example<\/strong>/);
  assert.doesNotMatch(renderState({ status: 'error' }), /<button/);
  assert.match(renderState({ status: 'error' }, () => {}), /<button type="button">Try again/);
  const error = renderToStaticMarkup(createElement(ErrorBoundary, {
    error: new Error('private details'), reset() {},
  }));
  assert.match(error, /role="alert"/);
  assert.match(error, /<button type="button">Try again/);
  assert.doesNotMatch(error, /private details/);
});

test('NestJS query DTO transforms numeric strings and rejects invalid pages and limits', async () => {
  await import('reflect-metadata');
  const { plainToInstance } = await import('class-transformer');
  const { validateSync } = await import('class-validator');
  const { PageQueryDto } = loadTemplate('nestjs/page-query.dto.ts');
  assert.deepEqual({ ...plainToInstance(PageQueryDto, {}) }, { page: 1, limit: 20 });
  const query = plainToInstance(PageQueryDto, { page: '2', limit: '50' });
  assert.deepEqual({ ...query }, { page: 2, limit: 50 });
  assert.deepEqual(validateSync(query), []);
  for (const params of [{ page: '0' }, { limit: '101' }, { page: '1.5' }, { page: ['1', '2'] }]) {
    assert.ok(validateSync(plainToInstance(PageQueryDto, params)).length > 0, JSON.stringify(params));
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
