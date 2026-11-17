---
name: logging
description: Design, implement, and review structured application logging and audit trails. Use for log schemas, correlation, redaction, log levels, security events, debugging context, or noisy and missing logs.
---

# Logging

1. Define operational questions logs must answer and distinguish diagnostics from immutable audit events.
2. Emit structured events with timestamp, severity, event name, service, environment, and correlation identifiers.
3. Add stable context at boundaries without duplicating the same error across layers.
4. Redact credentials, tokens, personal data, request bodies, and sensitive query values.
5. Use levels consistently and sample high-volume informational events deliberately.
6. Test redaction and ensure logs remain useful during degraded dependency behavior.
