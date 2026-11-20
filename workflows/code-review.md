# Code-review workflow

1. Read the request, architecture, diff, and tests.
2. Trace affected data and control paths, including unchanged callers, old data, invalid inputs and partial failures.
3. Check correctness, security, regressions, performance, operability and project conventions. Look for duplicate logic, speculative abstraction, unnecessary dependencies, and missing failure handling.
4. Report only actionable findings with severity, file or line, concrete failing scenario, and smallest justified fix. Use a fresh reviewer when available and authorized. Otherwise mark the result as self-review.
5. Summarize validation gaps and overall risk.
