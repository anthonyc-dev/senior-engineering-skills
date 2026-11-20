# Advanced skills evaluation

Two independent reviewers examined the committed baseline (`f1105d5`) and the candidate working tree against the same six scenarios. Each marked a case pass only if every criterion appeared in the written guidance. The results measure instruction coverage.

| Case | Baseline | Candidate | Candidate evidence |
| --- | --- | --- | --- |
| Required verification tool absent | FAIL | PASS | [Testing skill](../../skills/testing/SKILL.md) distinguishes individual outcomes, blocked checks and unsupported claims |
| Missing endpoint ownership check and scanner | FAIL | PASS | [Security skill](../../skills/security/SKILL.md) requires a severity, location, impact, remediation and coverage gaps |
| Legacy regression and duplicated logic | FAIL | PASS | [Review workflow](../../workflows/code-review.md) traces old callers and reports the concrete failure and smallest fix |
| Docker release requires approval | FAIL | PASS | [Deployment workflow](../../workflows/deployment.md) uses variable names, readiness evidence, rollback details and explicit authorization |
| Passing DB probe and failing application entry point | FAIL | PASS | [Debugging instructions](../../instructions/debugging.md) separate hypotheses and causes and recheck the original request |
| Stale setup instructions and API contract | FAIL | PASS | [Documentation instructions](../../instructions/documentation.md) compare against installer, manifests, routes and contracts |

Executable tests cover project stack and delivery signals, memory scope and approval, secret-pattern rejection, rollback on malformed restore, source-only document matches, and evidence-based comparisons. Install smoke tests exercise the copied skills and executable helpers for Codex, Claude Code, Cursor, GitHub Copilot, OpenCode and Gemini CLI.

Live activation and behavioral benchmarking of installed clients are **NOT TESTED**. Run the [engineering cases](../../skills/skill-evaluation/references/protocol.md) in those clients before attributing behavior or consistency scores to them.
