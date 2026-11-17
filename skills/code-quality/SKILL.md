---
name: code-quality
description: Improve, refactor, implement, and review code for cleanliness, reuse, readability, maintainability, cohesion, simplicity, and testability. Use for every implementation or code review, especially when code is duplicated, difficult to understand, tightly coupled, oversized, inconsistently named, fragile to change, or accumulating technical debt.
---

# Code quality

Make code easy for another engineer to understand, change, test, and safely delete. Preserve behavior unless the task explicitly changes it.

## Quality priorities

Apply these priorities in order:

1. Correctness and explicit behavior.
2. Readability and clear intent.
3. Cohesion and separation of responsibilities.
4. Maintainability and safe change.
5. Reuse of stable concepts.
6. Simplicity and minimal incidental complexity.
7. Performance based on evidence.

Do not sacrifice correctness or clarity merely to reduce line count or eliminate superficial duplication.

## Clean and readable code

- Use precise domain names for modules, types, functions, variables, events, and errors.
- Keep control flow direct; prefer guard clauses over deeply nested branches.
- Keep functions focused on one level of abstraction and make side effects visible.
- Replace magic values with named domain concepts or configuration at the correct owner.
- Use strict types to make invalid states difficult to represent.
- Keep comments for decisions, constraints, invariants, and non-obvious trade-offs rather than narrating syntax.
- Remove dead code, stale comments, debug artifacts, unused exports, and obsolete compatibility paths.

## Reusable code

- Extract reuse only when multiple callers share the same stable concept or policy.
- Prefer small composable functions and narrow interfaces over inheritance or highly configurable abstractions.
- Keep feature-specific logic with the feature; do not turn shared folders into miscellaneous utility collections.
- Accept dependencies explicitly at boundaries where substitution, testing, or volatility justifies it.
- Keep public APIs small and hide implementation details.
- Consolidate duplicated business rules before duplicated syntax.
- Allow similar code to remain separate when it represents different domain meaning or will change independently.

## Maintainable structure

- Give every module a clear owner and reason to change.
- Separate domain rules, orchestration, presentation, persistence, transport, and infrastructure where complexity warrants it.
- Keep dependencies directional and avoid circular imports, hidden globals, and action at import time.
- Handle errors at the layer that can add context or recover; never silently swallow them.
- Keep configuration validated, centralized by responsibility, and free of hardcoded secrets.
- Prefer reversible incremental changes over broad rewrites.

## Refactoring workflow

1. Define the quality problem and behavior that must remain stable.
2. Add characterization or regression coverage for risky behavior.
3. Remove dead code and misleading comments.
4. Simplify control flow and rename unclear concepts.
5. Extract cohesive logic and consolidate proven duplication.
6. Reduce coupling and narrow interfaces only where change pressure justifies it.
7. Run formatting, type-checking, linting, tests, and relevant performance checks.
8. Inspect the final diff for readability and unnecessary abstraction.

## Review questions

- Can a new maintainer identify the responsibility and data flow quickly?
- Does each abstraction represent a real stable concept?
- Are names accurate at the call site?
- Are side effects, ownership, mutations, and failure behavior explicit?
- Is important logic testable without fragile implementation mocks?
- Can obsolete behavior be removed without editing unrelated modules?
- Did the change reduce total cognitive load rather than merely move complexity?

Apply `react-component-standards` for React code and finish implementation work with `task-completion`.
