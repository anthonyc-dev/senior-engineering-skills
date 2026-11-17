# API rules

- Validate all request inputs and authenticate and authorize server-side.
- Use stable schemas, consistent error envelopes, correct status codes, and bounded payloads.
- Parameterize queries and protect mutations with CSRF controls where cookie authentication applies.
- Add rate limits, timeouts, idempotency, and auditability according to risk.
- Never expose internal errors, stack traces, secrets, or unrestricted sensitive data.
