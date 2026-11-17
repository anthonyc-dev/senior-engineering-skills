# Installable Skill Pack Implementation Plan

**Goal:** Make the existing skill pack straightforward to discover and install with Vercel's `skills` CLI, as selected by the user.

**Architecture:** Preserve `.ai/` and every existing skill. Use the upstream CLI rather than building an installer. Document both local installation and future GitHub distribution, separately from the complete framework's shared policy loading.

**Tech stack:** Markdown; upstream `skills` CLI for verification only.

## Constraints

- No new npm package, runtime dependencies, duplicate skill folders, or skill behavior changes.
- Do not publish or install into the user's global agent directories.
- Keep local reference documents with their skills and explain companion skill dependencies.
- This directory is not a Git checkout; review the applied patches and final documentation for scope.

## Task 1: Document and verify installation

- [x] Update `README.md` with prerequisites, local and GitHub installation examples, validation, and framework activation boundaries.
- [x] Add `skills/README.md` covering all 33 skills and their explicit companion relationships.
- [x] Run upstream CLI discovery and install the entire pack into a temporary project.
- [x] Compare installed files with source; check names, descriptions, catalog links, and skill-local references.
- [x] Confirm only planned documentation changed and report local versus published verification boundaries.

## Review focus

Verify paths with spaces, all-skill selection, copied supporting references, complete companion availability, and absence of global installs. GitHub commands remain templates until the user publishes a repository.

## Verification results

- Upstream CLI `1.9.0`: discovered and installed all 33 skills into an isolated temporary project.
- All 50 files inside the skill directories matched their installed copies byte for byte; no installed skill directory was a symlink.
- The documented four-skill subset installed exactly those four skills into a second temporary project.
- All 33 catalog entries matched skill directories; 39 local Markdown links and the skill-local Markdown references resolved.
- Source and destination paths contained spaces. CLI telemetry was disabled and CLI state redirected to the temporary test directory.
- No skill bodies changed. GitHub publishing, remote installation, and agent behavior under real tasks were not tested.
- No package manifest, configured linter, or application build/test suite exists here. Git-based diff review was unavailable because this directory is not a Git checkout.
- A temporary baseline hash snapshot could not be reused because sandbox temporary directories are isolated per command. Scope review used the three applied documentation patches and final file inspection instead; no cross-command baseline hash comparison is claimed.
