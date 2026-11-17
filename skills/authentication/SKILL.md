---
name: authentication
description: Design, implement, audit, and troubleshoot secure user or service authentication. Use for login, sessions, cookies, OAuth, OIDC, MFA, password handling, token lifecycle, account recovery, or identity-provider integration.
---

# Authentication

1. Define actors, assurance requirements, session lifetime, recovery flow, and threat model.
2. Prefer established identity providers and standards over custom cryptography or token formats.
3. Store passwords only with an approved adaptive password hash and per-user salts.
4. Use secure, HttpOnly, SameSite cookies for browser sessions and rotate identifiers after privilege changes.
5. Validate token issuer, audience, signature, expiry, nonce, and state as applicable.
6. Rate-limit sensitive endpoints and avoid revealing whether an account exists.
7. Test logout, revocation, expiry, recovery, MFA, and concurrent-session behavior.
