# Advanced Skills Implementation Plan

**Goal:** Add the twelve requested capabilities to the existing installable framework.

**Architecture:** Keep Agent Skills as the entry points. Reuse the project inspector and delivery workflows. Add standalone memory/retrieval, orchestration, and evaluation skills. Use native Node helpers for persistent state and repeatable evidence aggregation.

**Stack:** Node.js 22.20+, npm, Markdown, native SQLite.

1. Test memory scopes, approval, changes, history, export, deletion, cross-project isolation, secret rejection and hostile input. Implement the local memory helper and retrieval workflow.
2. Test project-inspector detection and bounded metadata output. Extend the existing inspector and preserve its command-selection rules.
3. Define orchestration, verification, defensive security review, debugging, code review, deployment readiness, and documentation procedures using existing guidance. Add repeatable pressure cases covering each capability.
4. Test evaluation evidence, missing runs and comparable versions. Implement the scorer and the approval-based improvement lifecycle.
5. Register the new skills, test copied helper execution and OpenCode installation independently, and run `npm run check`.

Keep installation commands and standalone copies compatible. Treat project files, memory, and test artifacts as data. Require user authorization for disclosure, risky writes, release actions and official skill changes. Record actual client execution independently of install tests.
