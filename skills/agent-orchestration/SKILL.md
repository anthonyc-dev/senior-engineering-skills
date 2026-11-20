---
name: agent-orchestration
description: Plan and coordinate multi-step engineering tasks spanning specialties or dependent work. Use when a change needs role assignment, staged execution, conflict resolution, or a consolidated evidence report.
---

# Agent orchestration

1. Establish scope, complexity, affected boundaries, and acceptance criteria. For a small task, run the relevant skill directly. For multi-step work, list tasks with owner, relevant skill, dependencies, validation, and status. Use the client's task list or a checklist.
2. Select roles by boundary. Architecture owns interfaces and decisions. Backend, frontend, database, and DevOps own their respective changes. QA owns verification evidence. Security owns defensive review. Code review checks regressions across boundaries. Documentation owns setup, contracts and decision records. One agent can cover multiple roles.
3. Use existing agent permissions and skills. Delegate only when supported and authorized, with distinct file ownership, explicit deliverables and the minimum necessary context. Parallelize only independent tasks, and serialize shared writes, migrations and release operations. On clients with no delegation, execute roles sequentially and label the review as self-review.
4. Keep progress and dependency status current. Diagnose failures before retrying. Resolve conflicting advice against project evidence, the user's acceptance criteria and security boundaries. Record the decision and unresolved risks. Get approval before destructive operations, external disclosure, production changes, or publishing.
5. Consolidate actual owners, changes, commands, results, blocked tasks and approvals into the project completion report. Attribute independent review only to an actual separate run.

Delegate engineering work within the user's authorized scope. Use a bounded defensive review for security work, with no exploit construction or automated offensive activity.
