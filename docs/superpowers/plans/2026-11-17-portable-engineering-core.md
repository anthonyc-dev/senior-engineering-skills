# Portable Engineering Core Plan

## Intent and design

Improve the actual instructions agents receive, using the researched distinction between Vercel's TypeScript installer and Markdown skill format. Strengthen the existing engineering core rather than add a duplicate senior-engineer skill or convert working tooling merely for language consistency.

The core must work when installed alone: no root `.ai` policy dependency, proprietary invocation API, or mandatory companion installation. An optional TypeScript helper provides deterministic repository evidence with a manual fallback. Its `.mts` module extension avoids consuming-project module mode coupling.

## Scope

- [x] Research installer, skill format, actual Vercel instruction patterns, and supported destination layouts.
- [x] Baseline-review the old core against repository validation, ambiguous external writes, and missing companion scenarios.
- [x] Add failing project-inspector fixtures, then implement the smallest read-only native TypeScript helper.
- [x] Strengthen ordered workflow and bundled failure-case playbook; re-evaluate the same scenarios in isolation.
- [x] Add strict type checking and installation tests for five representative agent destinations and CommonJS hosts.
- [x] Document exact support claims, standalone usage, TypeScript purpose, and remaining verification boundaries.
- [x] Complete independent review and final checks.

## Validation boundaries

Use `npm run check`. Preserve the other 32 skill bodies. Tool tests establish runtime behavior of the helper and local installation integrity, not compliance of five agent products or model-performance gains. No production access, paid API requests, global installs, Git initialization, push, or publication.

## Results

- Final pack validation: 33 skills and 51 local references; strict TypeScript check passed.
- All 18 regression tests passed. Initial six helper tests failed before the helper existed, then passed after implementation.
- Full installation preserved 52 files byte for byte; four-skill subset passed.
- Standalone core/helper tests passed for five agent installation targets inside temporary CommonJS projects with spaces in their paths.
- Independent code review reported no actionable findings and independently passed the 18 tests and type check.
- Dependency installation audited 13 packages with zero known vulnerabilities reported at installation time.
- Baseline and revised artifact evaluations, limitations, and research sources are recorded in the evaluation document; no cross-model performance result is claimed.
