# Database rules

- Use migrations for schema changes and make rollout and rollback behavior explicit.
- Encode invariants with constraints and preserve referential integrity.
- Use parameterized queries, least privilege, and RLS for exposed tenant data.
- Design indexes from query patterns and evaluate their write and storage cost.
- Keep transactions short and test concurrency-sensitive behavior.
