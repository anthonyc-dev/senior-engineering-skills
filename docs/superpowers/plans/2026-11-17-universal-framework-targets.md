# Full Framework Across Agent Targets

## Scope

Expand full installation from five hardcoded agent IDs to every target exposed by the already pinned Vercel `skills` public API. Keep Codex explicit, provide universal/shared-skill setup, and provide a clearly manual custom-agent path without claiming arbitrary clients auto-load local instructions.

## Design

- Reuse `getSupportedAgents()` for identifiers and project skill destinations; do not duplicate the upstream catalog or expose global home paths.
- Register one native `senior-engineering-framework/SKILL.md` bridge in each selected destination, referencing the authoritative project-root `.ai/AGENTS.md`.
- Preserve five established project instruction adapters. Other targets receive portable `AGENTS.md` plus their native skill; shared destinations are written once.
- Support `--agent universal`, explicit registered IDs, `--agent '*'`, and explicit `--agent custom`. Unknown typos still fail instead of pretending an adapter exists.
- Add an `agents` discovery command showing installation paths and activation expectations.
- Preserve preflight conflict checks, existing project instructions, dry runs, and repeat-install safety. Never replace a conflicting native framework skill.

## Validation

- [x] Observe missing-export failure before implementation.
- [x] Test all 79 registry entries through actual fixture installation, deduplicate paths, and repeat with no further writes.
- [x] Test Codex/universal entry, custom/manual notes, native-skill conflicts, and agent discovery output.
- [x] Run complete checks with the filesystem security fixture enabled, independent review, and actual packed-package installation tests.

Pre-publication results: all 39 tests passed with no skips in the unrestricted temporary-fixture run; static type checks, package exclusions, and existing skill installation checks passed. The actual npm-packed CLI listed all 79 targets plus custom, installed every native destination with full guidance, reran without additional writes, and produced manual activation instructions for custom setup. Independent review reported no actionable findings.

After publication, verify the documented GitHub command for discovery, Codex and additional targets, and custom/manual setup; report that separately from local package verification.

Actual agent behavior and cloud-product integration are outside filesystem/install verification. The generated bridge is full-framework-only; individual skill installation remains unchanged.
