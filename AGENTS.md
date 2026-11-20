# Personal AI Engineering Framework

Use this file as the entry point for every agent working in a project that includes this `.ai` directory.

## Loading protocol

1. Read `instructions/base.md` and `instructions/communication.md`.
2. For user-facing responses, load `skills/adaptive-emoji-communication/SKILL.md` unless the user requests plain or formal text.
3. Read every filename under `skills/*/SKILL.md` to discover available capabilities.
4. Load the complete `SKILL.md` only when its YAML description matches the task or the user names it.
5. Load linked skill references only when the selected skill directs you to them.
6. Read applicable files from `instructions/`, `rules/`, `standards/`, `workflows/`, `checklists/`, and `knowledge/`.
7. For every implementation task, load `skills/production-quality-code/SKILL.md` and `skills/code-quality/SKILL.md`.
8. For React, Next.js, JSX, TSX, component, hook, or Tailwind work, load `skills/react-component-standards/SKILL.md`.
9. Before finishing any implementation task, load `skills/task-completion/SKILL.md`, run the applicable checks, and produce its mandatory Task Completion Report.

Do not blindly load every document body. Index all skill metadata, then use progressive disclosure to keep context focused.

For cross-specialty or dependency-heavy tasks, load `skills/agent-orchestration/SKILL.md`. If prior decisions could change the answer, use `skills/engineering-memory/SKILL.md` when present and restrict automatic retrieval to the current project. For benchmark or skill improvement work, load `skills/skill-evaluation/SKILL.md` before changing official skills.

For authentication, authorization, APIs, sensitive data, file uploads, payments, cloud or CI/CD changes, AI-enabled systems, vulnerability remediation, or security reviews, load `skills/owasp-security-implementation-plan/SKILL.md` alongside the applicable technology skill.

Every implementation response must end with the Task Completion Report sections in this order: Completion Status, Summary, Files Modified, Changes Made, Validation Checklist, Quality Review, Security Review, Performance Review, Remaining Work, and Next Recommended Task. Never replace this report with only “Done,” “Finished,” or “Completed.”

## Directory index

| Directory | Purpose | Loading rule |
| --- | --- | --- |
| `skills/*/SKILL.md` | Reusable task and technology skills | Discover all; fully load applicable skills |
| `instructions/*.md` | Agent behavior and execution guidance | Load base + communication; add task-specific files |
| `rules/*.md` | Non-negotiable engineering constraints | Load rules that match the work |
| `standards/*.md` | Quality definitions and conventions | Load standards used by the task |
| `workflows/*.md` | Repeatable delivery procedures | Load the matching workflow |
| `checklists/*.md` | Completion and release gates | Load before validation |
| `knowledge/*/README.md` | Domain reference notes | Load only when the domain is relevant |
| `glossary/*.md` | Shared vocabulary and architecture language | Load when terms are unclear |
| `prompts/*/README.md` | Optional role-focused prompt fragments | Load when adopting that role |
| `examples/*/README.md` | Reference project patterns | Load when examples are useful |
| `adapters/*/README.md` | Instructions for other AI coding tools | Load only for that tool |
| `templates/` | Reusable output assets | Use when a matching template exists |

## Skill catalog

### Core engineering

- `skills/software-architecture/SKILL.md`
- `skills/clean-architecture/SKILL.md`
- `skills/ddd/SKILL.md`
- `skills/design-patterns/SKILL.md`
- `skills/api/SKILL.md`
- `skills/testing/SKILL.md`
- `skills/production-quality-code/SKILL.md`
- `skills/code-quality/SKILL.md`
- `skills/task-completion/SKILL.md`
- `skills/security/SKILL.md`
- `skills/owasp-security-implementation-plan/SKILL.md`
- `skills/performance/SKILL.md`
- `skills/caching/SKILL.md`
- `skills/logging/SKILL.md`
- `skills/monitoring/SKILL.md`

### Web and backend

- `skills/typescript/SKILL.md`
- `skills/javascript/SKILL.md`
- `skills/nodejs/SKILL.md`
- `skills/react/SKILL.md`
- `skills/react-component-standards/SKILL.md`
- `skills/nextjs/SKILL.md`
- `skills/nestjs/SKILL.md`

### Data, identity, and infrastructure

- `skills/postgres/SKILL.md`
- `skills/supabase/SKILL.md`
- `skills/authentication/SKILL.md`
- `skills/authorization/SKILL.md`
- `skills/docker/SKILL.md`
- `skills/aws/SKILL.md`
- `skills/devops/SKILL.md`

### Delivery and collaboration

- `skills/agent-orchestration/SKILL.md`
- `skills/engineering-memory/SKILL.md`
- `skills/skill-evaluation/SKILL.md`
- `skills/git/SKILL.md`
- `skills/github/SKILL.md`

### Communication

- `skills/adaptive-emoji-communication/SKILL.md`

### Mobile

- `skills/flutter/SKILL.md`
- `skills/flutter/architecture.md`
- `skills/flutter/best-practices.md`
- `skills/flutter/folder-structure.md`
- `skills/flutter/performance.md`
- `skills/flutter/routing.md`
- `skills/flutter/security.md`
- `skills/flutter/state-management.md`
- `skills/flutter/testing.md`

## Maintaining this skill pack

When changing the framework itself, including skill metadata, references, catalogs, or its tools:

1. These maintenance commands require a source checkout containing `package.json` and the lockfile. A full-framework guidance installation omits development tooling; use the consuming project's checks for application work and a source checkout for framework/tool changes.
2. Install locked development dependencies with `npm ci --ignore-scripts` when needed.
3. Run `npm run check` before reporting completion or recommending a push. It validates the pack, runs regression tests, and tests the pinned installer in temporary projects.
4. Update `skills/README.md` when adding, renaming, or removing skills or changing companion requirements.
5. Keep supporting references inside their skill directory so individual installs remain portable. Do not introduce absolute local paths or symlink dependencies.
6. Report failures and unverified agent behavior separately; installation success does not prove instruction-following quality.
7. When adding or changing templates, keep every category nonempty with a real artifact and usage guide, update `templates/README.md`, and run `npm test`. Validate examples in their target framework/runtime where available; syntax checks alone are not runtime verification. Top-level templates do not accompany individual skill installs.

These commands apply to maintaining this framework, not to every application consuming its guidance. Use the consuming project's configured commands for application changes. Never install the test pack globally, publish, or push as part of validation.

## Precedence

Follow system and user instructions first, then the nearest project `AGENTS.md`, then this framework. When two framework documents conflict, prefer the more specific task or technology rule. Preserve existing architecture unless the user explicitly requests a change.
