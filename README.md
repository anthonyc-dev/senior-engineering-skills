# Senior Engineering Skills

A portable pack of 33 production-oriented agent skills, plus shared rules, workflows, checklists, and domain knowledge. Browse the [skill catalog](skills/README.md).

The [template catalog](templates/README.md) contains practical starter files for all nine template categories. Each category documents its prerequisites, destination, safety constraints, and validation steps. Top-level templates are part of the full framework checkout, not individual skill installations.

## Install skills with Vercel's CLI

Requires Node.js 22.20 or later and npm for `npx`. Installed skills contain Markdown and supporting references, with no runtime dependency on this repository's development tools. The `package.json` here provides pinned validation tools and commands; it is private and is not an npm-published installer. Installation uses Vercel's [`skills` CLI](https://github.com/vercel-labs/skills).

Run these commands **from the project that should receive the skills**:

```sh
# Preview available skills without installing
npx skills add anthonyc-dev/senior-engineering-skills --list

# Choose skills and agents interactively
npx skills add anthonyc-dev/senior-engineering-skills --copy

# Install the complete pack for Codex in the current project
npx skills add anthonyc-dev/senior-engineering-skills --skill '*' --agent codex --copy

# Inspect the installed project skills
npx skills list
```

`--copy` creates independent copies, including each skill's supporting references. Codex reads project skills from `.agents/skills/`. Omit `--agent codex` to choose agents interactively; add `--global` only when you want installation across projects. Review any existing skills with matching names before installing, since installation can replace them.

For a smaller selection, pass skill names after `--skill`:

```sh
npx skills add anthonyc-dev/senior-engineering-skills --skill production-quality-code code-quality owasp-security-implementation-plan task-completion --agent codex --copy
```

Some skills ask the agent to use companion skills. The CLI does not automatically resolve these dependencies; see [companion skills](skills/README.md#companion-skills). Install the complete pack when you want every cross-reference available.

### Start with the standalone engineering skill

For a portable senior engineering workflow, install just `production-quality-code`:

```sh
npx skills add anthonyc-dev/senior-engineering-skills --skill production-quality-code --agent codex --copy
```

Replace `codex` with your supported agent ID, such as `claude-code`, `cursor`, `gemini-cli`, or `github-copilot`, or omit `--agent` to choose interactively. The skill includes its own workflow, security and evidence gates, failure-case playbook, and optional TypeScript helper. Companion skills and this framework's root instructions are not required for that standalone workflow. In your agent, request: "Use production-quality-code for this change; follow the repository's instructions and report actual validation evidence."

Vercel's `skills` repository contains mostly TypeScript because it implements a package installer and agent adapters. Its [actual skill instructions remain Markdown](https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md). A useful skill combines clear task triggers, executable procedures, concrete examples, and optional tested scripts; rewriting prose as TypeScript cannot force a model to follow it.

Our [project-inspection helper](skills/production-quality-code/scripts/inspect-project.mts) is TypeScript with strict type checking. It uses native Node.js type stripping, has no imported third-party runtime dependency, and needs no build step. The `.mts` extension keeps it independent of a consuming project's CommonJS/ESM setting. Requires Node.js >=22.20; without Node.js or shell access, follow the skill's manual file-inspection fallback. Other language stacks keep their own tools.

The helper emits JSON containing package-manager evidence, safe script names, configured check suggestions, workspace warnings, and known language-manifest names. It never executes scripts or prints their bodies, reads `.env`, installs dependencies, or chooses a manager when evidence conflicts. Review project instructions, CI, and script bodies before executing any suggested command.

Local checks verify standalone copy installation and execution of the bundled helper for Codex, Claude Code, Cursor, Gemini CLI, and GitHub Copilot target directories. They do not launch those five agent applications. Compatibility depends on an agent supporting and loading Agent Skills; arbitrary AI chatbots and guaranteed compliance are outside that claim. [Evaluation scope and evidence](docs/evaluations/production-quality-code.md) distinguish simulated instruction review from actual tool tests.

### Repository layouts and local installation

This repository publishes the framework contents at the root, with `skills/` directly discoverable by the CLI. To install from a local checkout instead, replace the source with its absolute path. No custom installer or npm publication is required.

If you copy this framework into a different repository under `.ai/`, use that repository's subdirectory URL. Replace `OWNER`, `REPO`, and `main` in these alternate-layout examples:

```sh
# If the repository contains the existing .ai/ directory
npx skills add https://github.com/OWNER/REPO/tree/main/.ai --list
npx skills add https://github.com/OWNER/REPO/tree/main/.ai --skill '*' --agent codex --copy
```

For a different repository that also publishes the framework contents at its root, use `npx skills add OWNER/REPO`.

## Use the complete engineering framework

Installing skills copies their individual directories. It does **not** copy or activate the shared `instructions/`, `rules/`, `standards/`, `workflows/`, or `checklists/` directories.

To use those shared policies too, copy `.ai/` into a project and add this to the project's existing root `AGENTS.md`:

```markdown
Read and follow `.ai/AGENTS.md`.
```

Preserve existing project instructions. There is no need to install a second copy of the skills when your agent already follows `.ai/AGENTS.md` and its loading protocol.

## Skill format

Skills follow the [Agent Skills format supported by Vercel's CLI](https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md):

```text
skills/
└── skill-name/
    ├── SKILL.md
    ├── references/   # optional, loaded on demand
    ├── scripts/      # optional deterministic helpers
    └── assets/       # optional output resources
```

Each `SKILL.md` has YAML frontmatter containing only `name` and `description`. The description states both capability and trigger conditions so compatible agents can discover it without loading the full file.

Keep required references inside the skill directory so they travel with an individual installation. Discoverability does not establish the correctness or security of the guidance; review skills before applying them to a project.

## Development tools and pre-push checks

From this `.ai` directory (or the repository root if you publish its contents at the root):

```sh
npm ci --ignore-scripts
npm run check
```

Commit `package.json` and `package-lock.json`; do not commit `node_modules/`. Skill consumers using `npx skills add` do not need to run `npm ci` in this repository. No build or npm publication is required before sharing skills on GitHub.

| Command | Behavior |
| --- | --- |
| `npm run validate` | Read-only checks of YAML metadata, skill names, catalog completeness, documented companions, and local references |
| `npm run validate -- --json` | The same checks as structured JSON; exits nonzero on failure |
| `npm run typecheck` | Strict TypeScript check of the bundled project-inspection helper |
| `npm run inspect:project -- "<project-root>"` | Read-only project metadata and configured check suggestions as JSON |
| `npm test` | Skill/tool regressions plus template completeness, links, TS/TSX syntax, and CI structure |
| `npm run test:install` | Full/subset installs plus standalone core/helper checks for five agent targets |
| `npm run check` | Runs metadata validation, TypeScript checking, regression tests, and installation smoke test |
| `npm run skills -- add . --list` | Lists this pack through the pinned upstream installer CLI |

The install smoke test creates temporary projects with spaces in their paths, disables CLI telemetry, redirects CLI state to the test directory, and removes test files afterwards. It never requests a global installation. Subprocesses run without a shell and have time limits. After `npm ci`, these checks use local files without fetching remote repositories.

The validator supports this framework's flat `skills/<name>/SKILL.md` layout and its `name`/`description`-only frontmatter convention. Local references use inline Markdown links or, in `SKILL.md`, backticked `.md` paths; required files must remain inside the skill folder. Symlinked files and absolute local paths are rejected for portability. Companion checks use names documented in the catalog's Companion skills section. They do not infer dependencies from arbitrary prose or validate external websites.

Run `npm run check` before pushing changes. No Git hook is installed; checks do not commit, push, publish, or alter skills. There is no separate lint configuration; TypeScript uses `tsconfig.json` for type checking without emitted output, and the test runner exercises modules directly.

Passing these checks establishes metadata and installation integrity, not the quality of every engineering recommendation or agent compliance. Evaluate changed skill behavior on representative tasks separately.

## Design principles

- Keep skills focused and reusable.
- Put procedures in `SKILL.md` and detailed facts in references.
- Load applicable guidance progressively.
- Prefer project-local conventions over generic framework defaults.
- Validate changes with the relevant checklist before reporting completion.
