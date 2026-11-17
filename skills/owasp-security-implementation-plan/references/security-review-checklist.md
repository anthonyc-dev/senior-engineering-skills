# Security review checklist

Select applicable items and record `not applicable` with a reason. A checked box requires evidence.

## Design and boundaries

- [ ] Assets, actors, sensitive data, entry points, tenants, and trust boundaries are identified.
- [ ] Abuse cases, business-logic attacks, replay, races, and resource exhaustion were considered.
- [ ] Security requirements and applicable ASVS version and level are defined.
- [ ] Preventive, detective, and recovery controls have owners.

## Application controls

- [ ] Authentication, recovery, MFA, session lifecycle, and revocation are appropriate.
- [ ] Resource-level authorization is enforced server-side and denies by default.
- [ ] Inputs and external data are validated at trusted boundaries.
- [ ] Queries and interpreter calls are parameterized or safely constructed.
- [ ] Output is contextually encoded and user-authored HTML is sanitized.
- [ ] Cookie, CSRF, CORS, TLS, redirect, and security-header behavior is verified.
- [ ] Upload and download paths validate content, size, storage, names, access, and processing.
- [ ] Cryptography and key management use approved maintained implementations.
- [ ] Secrets are absent from source, clients, images, logs, errors, prompts, and artifacts.
- [ ] Errors fail safely without exposing internal implementation details.
- [ ] Rate limits and abuse controls protect sensitive and expensive operations.
- [ ] Logs and alerts cover security events without leaking sensitive information.

## Data and platform

- [ ] Database roles, constraints, parameterized access, transport, migrations, backups, and tenant isolation are verified.
- [ ] Dependencies and lockfiles were reviewed and scanned with supported tooling.
- [ ] CI/CD and cloud identities use least privilege and isolate untrusted inputs.
- [ ] Containers and infrastructure use hardened, observable, recoverable configurations.
- [ ] Client-side or AI-specific threats and tool permissions were reviewed where applicable.

## Verification

- [ ] Unit and integration tests cover security invariants and negative paths.
- [ ] Anonymous, non-owner, cross-tenant, revoked, expired, and privileged cases were exercised.
- [ ] Applicable SAST, dependency, secret, IaC, license, container, or DAST checks ran successfully.
- [ ] Findings include severity, evidence, remediation, owner, and disposition.
- [ ] Residual risks and validation gaps are explicitly documented.
- [ ] No compliance claim exceeds the defined scope and evidence.

## Finding format

```text
Title:
Severity / likelihood:
Asset and actor:
Location:
Abuse path:
Impact:
Existing controls:
Recommended fix:
Verification:
Residual risk:
Owner / release disposition:
```
