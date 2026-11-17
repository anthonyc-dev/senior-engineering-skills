---
name: postgres
description: Design, migrate, query, secure, and optimize PostgreSQL databases. Use for schemas, SQL, indexes, constraints, transactions, locks, query plans, row-level security, connection pooling, or database incidents.
---

# PostgreSQL

1. Inspect schema, constraints, data volume, query patterns, and PostgreSQL version.
2. Encode invariants with types, `NOT NULL`, checks, unique constraints, and foreign keys.
3. Design indexes from real filters, joins, ordering, selectivity, and write cost.
4. Use parameterized SQL and explicit transactions with the narrowest safe isolation and lock scope.
5. Plan migrations for compatibility, backfill cost, lock duration, rollback, and observability.
6. Verify performance with `EXPLAIN (ANALYZE, BUFFERS)` only in a safe environment.
7. Test concurrent behavior, constraint failures, and tenant isolation.
