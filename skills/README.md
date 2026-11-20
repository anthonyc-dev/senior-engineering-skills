# Skill catalog

Each linked directory contains an installable `SKILL.md`. See [installation and framework setup](../README.md) for the difference between installing individual skills and loading shared engineering policies.

## Core engineering

| Skill | Use for |
| --- | --- |
| [software-architecture](software-architecture/SKILL.md) | System boundaries, integrations, reliability, and architecture decisions |
| [clean-architecture](clean-architecture/SKILL.md) | Dependency direction, use cases, and ports and adapters |
| [ddd](ddd/SKILL.md) | Domain models, bounded contexts, and aggregates |
| [design-patterns](design-patterns/SKILL.md) | Recurring design problems with justified patterns |
| [api](api/SKILL.md) | API contracts, validation, pagination, and failure behavior |
| [testing](testing/SKILL.md) | Test strategy, regressions, integration, and critical workflows |
| [production-quality-code](production-quality-code/SKILL.md) | Standalone senior engineering workflow, failure cases, and optional TypeScript project inspection |
| [code-quality](code-quality/SKILL.md) | Readability, reuse, cohesion, and maintainability |
| [task-completion](task-completion/SKILL.md) | Evidence-based validation and completion reports |
| [security](security/SKILL.md) | Threat modeling and security remediation |
| [owasp-security-implementation-plan](owasp-security-implementation-plan/SKILL.md) | Security control planning and verification |
| [performance](performance/SKILL.md) | Measured latency, throughput, and resource improvements |
| [caching](caching/SKILL.md) | Cache ownership, freshness, invalidation, and isolation |
| [logging](logging/SKILL.md) | Structured logs, redaction, and diagnostic context |
| [monitoring](monitoring/SKILL.md) | Metrics, traces, alerts, health checks, and SLOs |

## Web and backend

| Skill | Use for |
| --- | --- |
| [typescript](typescript/SKILL.md) | Strict types, contracts, and compiler errors |
| [javascript](javascript/SKILL.md) | Browser and Node.js JavaScript behavior |
| [nodejs](nodejs/SKILL.md) | Services, workers, streams, and runtime reliability |
| [react](react/SKILL.md) | Components, hooks, state, and accessible interfaces |
| [react-component-standards](react-component-standards/SKILL.md) | React and Next.js component structure and quality |
| [nextjs](nextjs/SKILL.md) | Routing, rendering, data access, and deployment patterns |
| [nestjs](nestjs/SKILL.md) | Modules, controllers, providers, and API boundaries |

## Data, identity, and infrastructure

| Skill | Use for |
| --- | --- |
| [postgres](postgres/SKILL.md) | Schemas, migrations, queries, indexes, and transactions |
| [supabase](supabase/SKILL.md) | Auth, Postgres, RLS, Storage, Realtime, and Edge Functions |
| [authentication](authentication/SKILL.md) | Login, sessions, tokens, OAuth, and account recovery |
| [authorization](authorization/SKILL.md) | Permissions, ownership, tenant isolation, and access policies |
| [docker](docker/SKILL.md) | Container builds, images, Compose, and runtime behavior |
| [aws](aws/SKILL.md) | AWS architecture, IAM, networking, and operations |
| [devops](devops/SKILL.md) | Delivery pipelines, deployments, and infrastructure automation |

## Delivery, communication, and mobile

| Skill | Use for |
| --- | --- |
| [agent-orchestration](agent-orchestration/SKILL.md) | Role selection, dependencies, bounded delegation and evidence handoff |
| [engineering-memory](engineering-memory/SKILL.md) | Scoped persistent memory and source-backed retrieval |
| [skill-evaluation](skill-evaluation/SKILL.md) | Repeatable comparisons and approval-controlled improvements |
| [git](git/SKILL.md) | Git inspection, history, branches, conflicts, and recovery |
| [github](github/SKILL.md) | Repositories, issues, pull requests, checks, and releases |
| [adaptive-emoji-communication](adaptive-emoji-communication/SKILL.md) | Restrained, tone-aware emoji use unless plain or formal text is requested |
| [flutter](flutter/SKILL.md) | Flutter architecture, widgets, routing, security, and testing |

## Companion skills

The CLI installs the skills you select; it does not install dependencies inferred from their prose.

| Selected skill | Companion skills it names |
| --- | --- |
| `production-quality-code` | Optional: `owasp-security-implementation-plan` and `task-completion`; built-in security and reporting fallbacks work without them |
| `code-quality` | `react-component-standards` for React work; `task-completion` for completion |
| `react-component-standards` | `react`, `typescript`, and `nextjs` for Next.js work; `task-completion` for completion |

`production-quality-code` works independently and includes its own playbook and optional helper. For other skills, include required companions recursively when selecting a subset. For example, React work using `code-quality` also needs the companions named by `react-component-standards`.

Flutter references and OWASP reference documents already live inside their skill folders and are copied with those skills. When loading the complete framework through `.ai/AGENTS.md`, follow its broader skill-loading requirements as well.
