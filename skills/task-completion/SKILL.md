---
name: task-completion
description: Verify completed implementation work and produce the mandatory evidence-based Task Completion Report. Use automatically after every coding, configuration, infrastructure, database, UI, refactoring, bug-fix, or documentation implementation task before giving the final response.
---

# Task completion

Run this skill after implementation work and before the final response.

## Verify the requested outcome

1. Re-read the request and acceptance criteria.
2. Inspect the final diff or changed files and confirm that every requested behavior is present.
3. Check that no unrelated user work was removed or overwritten.
4. Exercise the implemented behavior using the most relevant available validation.
5. Report unfinished requirements as remaining work; never describe partial work as complete.

## Perform the completion review

- Remove unused imports, variables, components, files, debug logging, and commented-out implementations introduced or made obsolete by the task.
- Check formatting and duplicated logic in the changed scope.
- Run type-checking, linting, focused tests, and broader tests or production builds when applicable and available.
- Check for runtime or console errors when the application can be exercised.
- Verify responsive behavior and accessibility basics for affected UI.
- Review security, privacy, error handling, logging, dependency, migration, and rollback implications according to the change.
- Review rendering, bundle, query, memory, network, caching, and concurrency impact where applicable.
- Update related documentation when behavior, architecture, setup, configuration, or operations changed.

Do not modify unrelated code merely to make the repository globally clean. Distinguish new failures, pre-existing failures, unavailable checks, and checks that are genuinely not applicable.

## Validation integrity

- Never claim a command passed unless it was run successfully.
- Include the exact check or command and outcome when useful.
- Do not mark TypeScript, lint, console, responsive, or accessibility checks as passed when the task did not involve those surfaces.
- Use `Not applicable` with a short reason instead of a false success.
- Use `Not run` with a reason when tooling, permissions, dependencies, environment, or time prevents a check.

## Mandatory Task Completion Report

End every implementation response with these ten sections in this order:

1. **Completion Status** — complete, partially complete, or blocked, with the reason.
2. **Summary** — concise outcome and user-visible effect.
3. **Files Modified** — created, changed, moved, or deleted files.
4. **Changes Made** — important implementation details and decisions.
5. **Validation Checklist** — commands and checks with passed, failed, not run, or not applicable status.
6. **Quality Review** — maintainability, typing, duplication, formatting, accessibility, and documentation.
7. **Security Review** — trust boundaries, validation, authorization, secrets, data, and residual risk.
8. **Performance Review** — measured or reasoned impact and any unverified assumptions.
9. **Remaining Work** — known gaps, blockers, follow-ups, or `None`.
10. **Next Recommended Task** — the single most valuable safe follow-up.

Do not end an implementation response with only “Done,” “Finished,” or “Completed.”
