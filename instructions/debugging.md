# Debugging

- Reproduce the issue or establish the failing signal before changing code.
- Start from the sanitized stack trace, log event or user-visible failure. Record exact environment, entry point and reproducible inputs. Distinguish what was actually reproduced from a related probe.
- Trace from observable symptom to the first incorrect state transition.
- Form one falsifiable hypothesis at a time and gather evidence.
- Fix the root cause with the narrowest safe change.
- Add a regression test when practical and remove temporary diagnostics.
- Mark hypotheses and confirmed causes separately. Trace application, service and data boundaries using evidence. Recheck the original entry point after an authorized fix. If memory is available, offer a sanitized candidate with source and verification evidence, then save or approve only within the user's authorization.
