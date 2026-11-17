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
