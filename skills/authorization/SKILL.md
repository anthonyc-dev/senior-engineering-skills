---
name: authorization
description: Design, implement, and audit authorization policies for applications and data. Use for RBAC, ABAC, permissions, ownership checks, tenant isolation, row-level security, service roles, or access-control vulnerabilities.
---

# Authorization

1. Enumerate subjects, resources, actions, tenant boundaries, and policy owners.
2. Deny by default and grant the least privilege needed.
3. Enforce policy at the server and data layers; never trust hidden UI controls.
4. Check access against the specific resource, not only a broad role.
5. Centralize policy decisions while keeping audit-friendly policy names and reasons.
6. Prevent confused-deputy paths and never expose administrative credentials to clients.
7. Test horizontal access, vertical escalation, cross-tenant access, and revoked permissions.
