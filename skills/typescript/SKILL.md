---
name: typescript
description: Build, refactor, and review strictly typed TypeScript applications and libraries. Use for TypeScript types, compiler configuration, API contracts, type errors, generics, runtime validation boundaries, or JavaScript-to-TypeScript migration.
---

# TypeScript

1. Inspect `tsconfig`, package versions, and existing conventions before choosing syntax.
2. Model domain states precisely with unions, branded identifiers, and narrow interfaces where useful.
3. Infer local types; declare explicit types at public, network, persistence, and dependency boundaries.
4. Avoid `any`, unsafe assertions, non-null assertions, and broad index signatures. Narrow `unknown` safely.
5. Keep runtime validation separate from compile-time typing and derive types from schemas when supported.
6. Preserve exhaustive checks for discriminated unions and surface errors as typed results where appropriate.
7. Run type-check, lint, and focused tests after changes.
