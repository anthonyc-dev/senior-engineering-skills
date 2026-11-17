# Optional Full Framework Installer

## Design

Keep Vercel's skills-only installation unchanged. Add a GitHub-executable package binary with explicit `framework` and `skills` commands. The framework command copies guidance into the selected project's `.ai/` and appends a small loading block for selected agents. Existing project instructions take precedence; resources load on demand.

Framework payload includes skills, knowledge, prompts, instructions, rules, standards, workflows, checklists, templates, glossary, adapters, examples, and documentation. Development dependencies, Git metadata, caches, and generated Flutter state are excluded. Installing the framework does not activate CI, deploy code, or install application dependencies.

## Safety contract

- Require an explicit agent selection for framework mode; offer `--dry-run` and `--target`.
- Preflight every payload file and instruction destination before writes. Refuse different existing `.ai` files; never supply an implicit overwrite/force mode.
- Preserve existing loader-file contents, append one managed block, and make identical reruns idempotent.
- Reject symlink destinations, unsupported agents, source/destination overlap, and malformed managed blocks.
- Write guidance before activating loader files. A filesystem failure may leave additive files; report it and allow a safe rerun. Do not promise a multi-file transaction.
- Keep framework installation project-local; skills mode delegates to the pinned upstream CLI.

## Implementation and checks

- [x] Add failing fixtures for full copying, selective exclusion, loader preservation, idempotence, conflicts, dry run, overlap, and symlink safety.
- [x] Implement a dependency-light native JavaScript binary with static type checking; runtime TypeScript stripping cannot be assumed inside npm's node_modules.
- [x] Expose the binary through package metadata; make the pinned skills CLI a runtime dependency for delegation.
- [x] Test npm package contents and execute the packed binary in an isolated consuming project.
- [x] Update README with both install modes and agent-specific instruction paths.
- [x] Run project checks and request independent review before publication.

After publication, verify the documented GitHub package command in a fresh temporary project; report that evidence separately from local package tests.

## Pre-publication results

- All 34 regression tests passed outside the sandbox, including the Windows junction escape test; static type checking and npm distribution checks passed.
- Actual packed-package execution verified dry run, full copying, five agent instruction destinations, and skills-only discovery of all 33 skills.
- Packaging tests caught generated Flutter state and a missing workflows allowlist entry before publication; both were fixed and covered by the distribution check.
- Independent code/security review reported no must-fix findings.
- Dependency lockfile update audited 13 packages and reported zero known vulnerabilities.
