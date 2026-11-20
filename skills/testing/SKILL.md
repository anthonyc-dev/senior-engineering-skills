---
name: testing
description: Plan, implement, debug, and review unit, integration, contract, and end-to-end tests. Use for test strategy, regression coverage, flaky tests, fixtures, mocks, coverage gaps, or validation of application behavior.
---

# Testing

1. Start from user-visible behavior, business invariants, and the failure being prevented.
2. Choose the lowest test level that gives confidence; reserve E2E tests for critical journeys.
3. Use deterministic fixtures and control time, randomness, network, and concurrency.
4. Mock at stable boundaries, not internal implementation details.
5. Cover success, validation, authorization, dependency failure, and important edge cases.
6. Keep tests isolated, readable, and diagnostic; fix flakiness instead of adding retries.
7. Run the smallest relevant suite first, then broader validation in proportion to risk.

## Verification procedure

1. Inspect configured scripts, manifests, package-manager lockfiles and CI. Use the project's actual commands for applicable unit, integration, end-to-end, lint, type and build checks. Review the script chain, including lifecycle hooks, before execution. Apply existing authorization limits to network, external services, production, paid actions and writes.
2. For APIs and databases, verify the actual application entry point and invariants against approved fixtures and environments. Cover expected error paths, authorization and data boundaries where relevant. Check exit codes and runner output for skipped tests or failed assertions. Record the exact command, environment and result. Run a targeted regression and the configured broader checks.
3. Use `VERIFIED` for observed evidence of the stated behavior, `FAILED` for an executed check that did not meet expectations, `BLOCKED` for a required check prevented by a concrete dependency or permission, `NOT TESTED` for an unexecuted check, and `UNVERIFIED` for a claim that available evidence does not establish. Record a status and reason next to each consequential claim. Never infer success from a command that did not run.
