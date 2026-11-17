# Application security controls

Load the sections relevant to the change. Apply controls according to the threat model rather than mechanically enabling every option.

## Identity and sessions

- Prefer established identity providers and protocol implementations.
- Hash passwords with a current adaptive password-hashing configuration; never design custom password cryptography.
- Protect login, recovery, enrollment, verification, and MFA flows against enumeration, replay, brute force, and session fixation.
- Use short, bounded session lifetimes appropriate to risk; rotate session identifiers after authentication or privilege changes.
- Revoke or invalidate sessions on logout, recovery, compromise, and administrative action.
- For browser cookies, set `Secure`, `HttpOnly`, and an appropriate `SameSite` policy and define CSRF protection.
- Require reauthentication or step-up verification for sensitive operations.

## Authorization

- Deny by default and enforce access at trusted server and database boundaries.
- Check the specific resource, action, owner, tenant, and current policy state on every request.
- Prevent horizontal, vertical, cross-tenant, and mass-assignment privilege escalation.
- Keep privileged credentials and service roles out of clients.
- Test anonymous, authenticated, owner, non-owner, administrator, revoked, and cross-tenant cases.

## Input, interpreters, and output

- Validate all external input for type, structure, length, range, encoding, allowed values, and business invariants.
- Include HTTP, forms, JSON, GraphQL, WebSockets, files, queues, CLI input, environment values, webhooks, redirects, and tool output.
- Use parameterized SQL and safe APIs for operating-system commands, templates, LDAP, NoSQL, XML, and other interpreters.
- Avoid constructing executable expressions from untrusted strings.
- Encode output for its destination: HTML, attribute, URL, JavaScript, CSS, SQL, shell, or log.
- Sanitize user-authored HTML with a maintained allowlist sanitizer; do not use output encoding as HTML sanitization.

## Browser and transport controls

- Enforce authenticated production traffic over supported TLS and redirect insecure requests safely.
- Deploy HSTS only after validating HTTPS coverage and subdomain implications.
- Define a restrictive Content Security Policy and tighten it using report-only telemetry before enforcement where needed.
- Set `X-Content-Type-Options`, `Referrer-Policy`, framing controls, `Permissions-Policy`, and cross-origin isolation headers as applicable.
- Allow only required CORS origins, methods, headers, and credential behavior; never reflect arbitrary origins.
- Apply CSRF defenses to cookie-authenticated state changes. Bearer headers reduce classic CSRF risk but introduce token-storage and XSS risk.

## File uploads and downloads

- Allow only required types and validate extension, declared type, size, and file signature.
- Generate server-controlled names and store uploads outside executable or public paths.
- Apply authorization to upload, read, transform, and delete operations.
- Scan or isolate risky content and process it with constrained resources.
- Return safe download headers and prevent active content from executing in the application origin.

## Cryptography and secrets

- Use maintained platform cryptography and current organizational standards; never invent algorithms or protocols.
- Separate password hashing, integrity hashing, authenticated encryption, and digital-signature use cases.
- Manage keys through an approved secret or key-management service with least privilege, rotation, versioning, and audit.
- Never place secrets in Git, frontend bundles, logs, build arguments, container layers, screenshots, prompts, or error messages.
- Plan key compromise, revocation, rotation, re-encryption, and backup recovery.

## APIs, data, and exceptional conditions

- Authenticate and authorize APIs, validate requests and responses, bound pagination, and use idempotency for retryable mutations.
- Apply rate limits and abuse controls by actor, account, token, tenant, IP, and operation according to the threat.
- Enforce database constraints, parameterized queries, least-privilege roles, encrypted transport, safe migrations, and tenant isolation.
- Avoid using database-owner or service-role credentials for ordinary application traffic.
- Fail closed for security decisions while preserving safe retry and recovery behavior.
- Return stable generic errors to untrusted clients and retain actionable internal diagnostics.

## Logging and privacy

- Log authentication, authorization failure, privileged changes, security configuration, critical business events, and detection signals.
- Include stable event names, timestamps, actor and tenant identifiers, correlation IDs, outcome, and source context.
- Never log passwords, session tokens, API keys, payment data, private keys, or unnecessary personal information.
- Protect log integrity, access, retention, redaction, alerting, and deletion.
