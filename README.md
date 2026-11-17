# Senior Engineering Skills

A portable pack of 33 production-oriented agent skills, plus shared rules, workflows, checklists, and domain knowledge. Browse the [skill catalog](skills/README.md).

Works with Agent Skills-compatible clients, including Claude Code, Codex, Cursor, Gemini CLI, and GitHub Copilot. Installation support does not mean every client has been tested on real coding tasks.

The [template catalog](templates/README.md) contains practical starter files for all nine template categories. Each category documents its prerequisites, destination, safety constraints, and validation steps. Top-level templates are part of the full framework checkout, not individual skill installations.

## Install skills with Vercel's CLI

Requires Node.js 22.20 or later and npm for `npx`. GitHub package execution also requires Git. Installed guidance has no dependency on this repository's development tools. The package stays private to prevent accidental npm registry publication; its binary can run directly from GitHub. Skills-only mode uses Vercel's pinned [`skills` CLI](https://github.com/vercel-labs/skills).

Choose either installation mode:

```sh
# Skills only: choose skills and target agents
npx --yes github:anthonyc-dev/senior-engineering-skills skills

# Full framework: all guidance in .ai/, plus Claude Code loading instructions
npx --yes github:anthonyc-dev/senior-engineering-skills framework --agent claude-code
```

Full mode is project-local and requires an explicit agent selection. Preview with `--dry-run`; see [full-framework installation](#use-the-complete-engineering-framework) for supported agents, preservation rules, and limitations. The direct `npx skills add` commands below remain supported.

Run these commands **from the project that should receive the skills**:

```sh
# Preview available skills without installing
npx skills add anthonyc-dev/senior-engineering-skills --list

# Choose skills and agents interactively
npx skills add anthonyc-dev/senior-engineering-skills --copy

# Install every skill and choose the target agents interactively
npx skills add anthonyc-dev/senior-engineering-skills --skill '*' --copy

# Inspect the installed project skills
npx skills list
```

`--copy` creates independent copies, including each skill's supporting references. Omit `--agent` to choose agents in an interactive terminal; add `--global` only when you want installation across projects. Review any existing skills with matching names before installing, since installation can replace them.

### Choose your agent explicitly

| Agent | CLI identifier | Project installation directory |
| --- | --- | --- |
| Claude Code | `claude-code` | `.claude/skills/` |
| Codex | `codex` | `.agents/skills/` |
| Cursor | `cursor` | `.agents/skills/` |
| Gemini CLI | `gemini-cli` | `.agents/skills/` |
| GitHub Copilot | `github-copilot` | `.agents/skills/` |

```sh
# All skills for Claude Code
npx skills add anthonyc-dev/senior-engineering-skills --skill '*' --agent claude-code --copy

# All skills for Codex
npx skills add anthonyc-dev/senior-engineering-skills --skill '*' --agent codex --copy

# All skills for Cursor, Gemini CLI, and GitHub Copilot
npx skills add anthonyc-dev/senior-engineering-skills --skill '*' --agent cursor gemini-cli github-copilot --copy
```

See the installer's [complete supported-agent list](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) for other clients and destinations. These commands install local coding-agent skills, not skills into a regular Claude web chat. In Claude Code, invoke `/production-quality-code` directly or ask Claude to use the skill when relevant.

For a smaller selection, pass skill names after `--skill`:

```sh
npx skills add anthonyc-dev/senior-engineering-skills --skill production-quality-code code-quality owasp-security-implementation-plan task-completion --copy
```

Some skills ask the agent to use companion skills. The CLI does not automatically resolve these dependencies; see [companion skills](skills/README.md#companion-skills). Install the complete pack when you want every cross-reference available.

### Start with the standalone engineering skill

For a portable senior engineering workflow, install just `production-quality-code`:

```sh
npx skills add anthonyc-dev/senior-engineering-skills --skill production-quality-code --copy
```

Choose the agent interactively or append its explicit `--agent` identifier from the table above. The skill includes its own workflow, security and evidence gates, failure-case playbook, and optional TypeScript helper. Companion skills and this framework's root instructions are not required for that standalone workflow. In your agent, request: "Use production-quality-code for this change; follow the repository's instructions and report actual validation evidence."

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
npx skills add https://github.com/OWNER/REPO/tree/main/.ai --skill '*' --copy
```

For a different repository that also publishes the framework contents at its root, use `npx skills add OWNER/REPO`.

## Use the complete engineering framework

Run from the existing project that should receive the framework:

```sh
# Preview; writes nothing
npx --yes github:anthonyc-dev/senior-engineering-skills framework --agent claude-code --dry-run

# Install and connect Claude Code
npx --yes github:anthonyc-dev/senior-engineering-skills framework --agent claude-code

# Or connect both Codex and Claude Code in the same project
npx --yes github:anthonyc-dev/senior-engineering-skills framework --agent codex --agent claude-code
```

Use `--target "<existing-project-directory>"` to choose a different project. Supported full-mode adapters:

| Agent | Loading instruction destination |
| --- | --- |
| `codex` | `AGENTS.md` |
| `claude-code` | `CLAUDE.md` |
| `cursor` | `.cursor/rules/senior-engineering.mdc` with `alwaysApply: true` |
| `gemini-cli` | `GEMINI.md` |
| `github-copilot` | `.github/copilot-instructions.md` |

The installer copies skills, knowledge, prompts, instructions, rules, standards, workflows, checklists, templates, glossary, adapters, examples, and documentation into `.ai/`. It includes root framework instructions and version information, excluding development tooling, dependencies, Git metadata, private-key/environment file names, and generated Flutter state. It does not install application dependencies, modify the app's package manifest, activate template CI workflows, or execute application scripts.

Existing agent instructions keep their contents; one marked loading block is appended. The block gives existing project instructions precedence and asks the agent to load only relevant guidance. Identical reruns add no duplicate block. Existing different `.ai` files, edited/incomplete managed blocks, non-UTF-8 instruction files, symlink destinations, and overlapping source/destination paths cause a failure before writes. The dedicated Cursor rule refuses an unrelated existing file of the same name.

There is no force or automatic-update option: review and merge conflicting framework versions manually. Files are preflighted and loader replacements use temporary files, but the entire install is not a filesystem transaction. An I/O failure can leave additive `.ai` files; resolve the error and rerun. Avoid concurrent editing during installation. An install lock prevents concurrent instances of this installer; inspect any stale lock before removing it manually. Global installation applies only to skills mode.

From a source checkout, the equivalent local command is `npm run framework -- --agent claude-code --target "<project-directory>"`. Framework mode itself uses Node's standard library and can also run through `node bin/senior-engineering-skills.mjs framework`. Other full-mode agent adapters are not implemented; follow the corresponding manual adapter guide for other clients. The upstream skills-only installer supports additional agents.

For manual setup instead, copy the guidance directories into the project's `.ai/` and reference the framework from the agent's instruction file:

```markdown
Read and follow `.ai/AGENTS.md`.
```

Full mode loads skills through the framework's `.ai/AGENTS.md` protocol; it does not register native `/skill-name` commands. Run skills mode as well if you want the client's native skill discovery or slash commands. There is no need for that second copy when guidance-based loading is sufficient. Installing all files does not mean injecting all documents into every prompt. Actual loading depends on the chosen agent honoring its instruction file.

For Claude Code, add the same instruction to the project's `CLAUDE.md`; see the [Claude Code adapter](adapters/claude-code/README.md). Other clients should use their corresponding guide under [adapters](adapters/). The framework is not restricted to clients that read a root `AGENTS.md` automatically.

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

From a complete source checkout (not the guidance-only `.ai/` generated by full mode):

```sh
npm ci --ignore-scripts
npm run check
```

Commit `package.json` and `package-lock.json`; do not commit `node_modules/`. Consumers do not need the framework's development setup. No build or npm registry publication is required: the `.mjs` binary runs natively from GitHub-installed npm packages. The optional skill helper remains TypeScript outside `node_modules`; the package binary uses checked JavaScript because native TypeScript stripping inside npm dependencies is unsupported.

| Command | Behavior |
| --- | --- |
| `npm run validate` | Read-only checks of YAML metadata, skill names, catalog completeness, documented companions, and local references |
| `npm run validate -- --json` | The same checks as structured JSON; exits nonzero on failure |
| `npm run typecheck` | Strict TypeScript check of the bundled project-inspection helper |
| `npm run inspect:project -- "<project-root>"` | Read-only project metadata and configured check suggestions as JSON |
| `npm test` | Skill/tool regressions plus template completeness, links, TS/TSX syntax, and CI structure |
| `npm run test:install` | Full/subset installs plus standalone core/helper checks for five agent targets |
| `npm run test:package` | Checks actual npm distribution contents and excludes caches/development tests |
| `npm run framework -- --agent claude-code --target "<project>" --dry-run` | Previews full installation into an existing project |
| `npm run check` | Runs metadata validation, static type checks, regressions, packaging checks, and installation smoke test |
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
