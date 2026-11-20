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

## Defensive security review

1. Confirm scope and inspect code, configuration, dependency locks and trust boundaries. Check endpoint authentication, resource/tenant authorization, input validation and parameter binding, uploads and interpreters, CORS, session/cookie handling, security headers and secret management. Report suspected secret locations and credential types without printing values.
2. Inspect available trusted secret, dependency and static-analysis reports or run configured defensive checks with authorization. Review tool output locally and redact sensitive evidence. For advisory checks, record source, date, package version and coverage. Identify unavailable scanners and unchecked surfaces.
3. For each actionable finding, report severity, affected asset and file, observable control gap, impact and remediation. Distinguish confirmed evidence from hypotheses. State coverage and limitations. Limit work to defensive analysis and safe checks of controls.
