---
name: react-component-standards
description: Enforce production React and Next.js component structure, composition, strict typing, accessibility, responsiveness, and maintainability. Use whenever creating, editing, refactoring, or reviewing React components, hooks, JSX, TSX, feature UI, Tailwind styling, or shadcn/ui composition.
---

# React component standards

Apply alongside the `react`, `typescript`, and, for Next.js projects, `nextjs` skills.

## Size and responsibility limits

- Keep each React component at or below 150 lines.
- Keep each function at or below 40 lines.
- Give every component one clear UI responsibility.
- Give every hook one clear state or side-effect responsibility.
- Split oversized units by cohesive behavior or visual responsibility, not arbitrary line ranges.

Count executable component content consistently. Imports, types, and short static data may remain near their owner, but do not use formatting tricks to evade limits.

## Architecture

- Organize application UI by feature and keep feature-specific code out of broad shared folders.
- Move business rules, data orchestration, and reusable state behavior into hooks, application services, server actions, or domain modules.
- Keep JSX declarative and make loading, empty, success, disabled, and error states explicit.
- Prefer composition over monolithic components, prop-heavy configuration objects, inheritance, or hidden global state.
- Reuse existing shadcn/ui primitives and project design tokens before creating parallel abstractions.
- Remove dead code immediately and refactor duplicated component logic before adding another copy.

## TypeScript

- Use strict types and infer local implementation details.
- Avoid `any`, unsafe assertions, broad index signatures, and untyped event handlers.
- Model component variants and state with narrow props and discriminated unions where useful.
- Keep server-only values, secrets, and privileged types out of client components.

## Callbacks and state

- Name complex event handlers and move non-trivial behavior outside JSX.
- Avoid duplicated inline Tailwind class sets; extract a component, variant, or shared class only when reuse is real.
- Derive values instead of synchronizing duplicate state.
- Use effects only for external synchronization and always handle dependencies and cleanup.
- Keep state at the narrowest owner and avoid unnecessary global stores.

## Accessibility and responsiveness

- Use semantic HTML and native controls first.
- Preserve accessible names, labels, descriptions, errors, focus order, keyboard interaction, and visible focus.
- Support text scaling, reduced motion, contrast, touch targets, and screen-reader announcements as applicable.
- Test representative narrow, medium, and wide layouts without horizontal overflow or hidden critical actions.

## Performance and verification

- Avoid unnecessary client boundaries, rerenders, request waterfalls, oversized dependencies, and unbounded lists.
- Add memoization only when profiling or stable-reference requirements justify it.
- Test important states and user interactions at the lowest useful level.
- Run type-check, lint, focused UI tests, and the `task-completion` review before handoff.
