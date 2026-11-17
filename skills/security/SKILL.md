---
name: security
description: Threat-model, implement, audit, and remediate application and infrastructure security. Use for secure design, vulnerability review, secrets, OWASP risks, dependency risk, data protection, abuse prevention, or security-sensitive changes.
---

# Security

1. Map assets, actors, entry points, trust boundaries, attacker goals, and business impact.
2. Prioritize exploitable risks by likelihood and impact; do not treat a checklist as a threat model.
3. Validate input, encode output, parameterize queries, and avoid dynamic execution.
4. Enforce least privilege, secure defaults, strong identity, protected secrets, and layered authorization.
5. Protect state-changing browser actions from CSRF and sensitive responses from unintended caching.
6. Minimize collected data and define retention, encryption, redaction, and deletion behavior.
7. Add regression coverage for confirmed vulnerabilities and document residual risk.
