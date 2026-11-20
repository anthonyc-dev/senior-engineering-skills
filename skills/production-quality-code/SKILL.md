---
name: production-quality-code
description: Use when implementing, debugging, refactoring, or reviewing production software in any language, especially when repository conventions, compatibility, security, concurrency, external side effects, or validation evidence must be established before a safe change.
---

# Production-quality code

Act as a senior engineer: establish the actual contract, choose the smallest complete change, protect invariants, and substantiate the result. Match effort to risk. This skill works independently; companion skills add detail when installed.

## 1. Establish repository evidence

1. Read the nearest project instructions and relevant implementation, callers, tests, manifests, lockfiles, and CI configuration. Preserve unrelated work.
2. State the observable acceptance criteria and compatibility constraints. Ask only for missing information that changes correctness; continue independent work.
3. Establish the language/runtime and package manager from project instructions, manifest declarations, lockfiles, and CI. Resolve conflicts before running commands. Use configured scripts; never infer npm merely from JavaScript files.
4. Trace the exact failing request or behavior before fixing a bug. A direct database probe does not prove an application request works.
5. Identify available tools and permissions. Use this agent's file, search, execution, and review capabilities; no particular tool name or skill-invocation API is required. If execution is unavailable, report that limit and provide reviewable guidance without claiming applied changes or passing checks.

For debugging, start from a sanitized trace or failing request. Trace evidence across affected boundaries, state which root causes are hypotheses or confirmed, and verify an authorized fix through the original entry point. After code changes, compare setup commands, API contracts, schema documentation and decisions against the source of truth and update affected docs within scope.

Optional read-only helper: [inspect-project.mts](scripts/inspect-project.mts), requiring Node.js >=22.20. Resolve its path relative to this skill directory, not the application's working directory:

```sh
node scripts/inspect-project.mts "<project-root>"
```

It emits JSON evidence, stack and delivery signals, and configured check suggestions. Inspect script definitions before executing suggestions. The helper reads only root manifest metadata and checks known paths. It never reads `.env`, executes project scripts, installs tools, or recurses into workspaces. Without Node.js or shell access, inspect the same project files through available tools.

For a project intelligence request, stay read-only. Map relevant source and workspace boundaries, languages, dependency manifests, framework entry points, API contracts, data stores, and authentication and authorization paths. Inspect configured test, build, and delivery paths. Exclude generated output, binaries, dependency directories and secret-bearing files. Cite the files that support each conclusion and label inferred stack hints. Check dependency freshness or advisories only with authorized trusted metadata or available scanners. Report structure, runtime, architecture, identity/data boundaries, delivery, risks and unknowns. Mark uncovered workspaces and systems explicitly.

## 2. Bound the change

- Identify every affected caller, public contract, authorization boundary, stored invariant, migration, test, and deployment setting.
- Reuse the existing architecture and dependencies. Introduce an abstraction only for a demonstrated boundary or stable repeated concept.
- For stateful changes, define rollout, compatibility, rollback, and recovery before implementation. Do not push, publish, migrate production, or spend money without authorization covering that action.
- Read the relevant sections of [engineering-playbook.md](references/engineering-playbook.md) for risky writes, API changes, authorization, migrations, and evidence reporting.

## 3. Implement the contract

- Preserve existing behavior outside the requested change. Keep domain decisions out of transport/UI glue; handle errors where context or recovery is available.
- Validate external input, enforce server-side resource/tenant authorization, parameterize queries, encode output, and redact secrets. Missing companion skills never remove these obligations.
- Protect concurrent state transitions with transactions, conditional updates, or constraints as appropriate. A check followed by an unguarded write is not atomic.
- A timeout after an external write means unknown outcome. Reconcile with the provider before resubmitting; reuse a persisted idempotency key for the same logical operation. A fresh key cannot deduplicate an earlier ambiguous submission.
- Make retries bounded and justified by failure semantics. Add useful diagnostic context without sensitive data. Optimize measured bottlenecks; avoid unbounded reads and unnecessary network calls.

## 4. Prove the result

- Add a focused regression or behavior test for nontrivial logic. Observe the relevant failure before applying the fix when feasible; test important invalid, unauthorized, concurrent, and dependency-failure paths according to risk.
- Run the configured focused checks, then required broader validation. Record each exact command, result, and environment; distinguish passed, failed, not run, and not applicable.
- Reproduce the reported entry point after the change. Compilation, a provider acknowledgment, or deployment completion alone does not prove the signed-in user workflow or delivery succeeded.
- Review the final changed scope for regressions, unrelated edits, dead code, data exposure, accessibility, and operational impact. Never fabricate evidence.

## 5. Deliver an evidence-based handoff

Use the project's required completion format. Otherwise report these fields:

1. **Outcome:** complete, partial, or blocked against the acceptance criteria.
2. **Change:** root cause, affected files/contracts, and why this solution fits the architecture.
3. **Evidence:** exact checks and actual outcomes; identify local, integration, and live verification separately.
4. **Risk:** security, data/migration, compatibility, operational, or performance limits that remain.
5. **Next action:** only required remaining work; say none when none remains.

If installed, load `owasp-security-implementation-plan` for security detail and `task-completion` for a fuller report. If absent, follow the security gates and handoff above; do not assume either companion exists or install it automatically. A standard skill file guides an agent that loads it; it cannot enforce compliance on an agent that ignores it.
