---
name: supabase
description: Build, secure, migrate, and troubleshoot applications using Supabase Auth, Postgres, Row Level Security, Storage, Realtime, and Edge Functions. Use for Supabase clients, policies, typed queries, migrations, auth flows, or data-access security.
---

# Supabase

1. Confirm SDK versions, execution environment, auth model, and generated database types.
2. Use the correct browser or server client and keep the service-role key server-only.
3. Enable RLS on exposed tables and write explicit policies for each operation and tenant boundary.
4. Treat application checks as user experience, not a substitute for database authorization.
5. Use migrations for schema and policy changes; include constraints and indexes intentionally.
6. Avoid leaking secrets or unrestricted signed URLs through client bundles, logs, or errors.
7. Test policies as anonymous, authenticated, owner, non-owner, and privileged actors.
