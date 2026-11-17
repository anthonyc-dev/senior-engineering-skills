---
name: api
description: Design, implement, document, and review secure HTTP or event-driven APIs. Use for endpoint contracts, REST semantics, pagination, versioning, idempotency, validation, errors, rate limits, webhooks, or API integration.
---

# API design

1. Identify consumers, trust boundaries, latency goals, compatibility needs, and failure modes.
2. Define resource names, schemas, status codes, error envelopes, and authorization before implementation.
3. Validate all inputs; reject unknown or malformed data consistently.
4. Use cursor pagination for large mutable datasets and stable sorting for deterministic results.
5. Make mutation retries safe with idempotency keys or natural idempotency where needed.
6. Add timeouts, rate limits, request identifiers, and bounded retry policies at external boundaries.
7. Version breaking contract changes and test the published contract.
