# PostgreSQL conditional-update regression

Run [conditional-update-check.sql](conditional-update-check.sql) only against a development/test PostgreSQL connection configured through your normal environment or connection mechanism:

```sh
psql -X --set=ON_ERROR_STOP=1 --file=conditional-update-check.sql
```

It uses a temporary inventory table, bounded statement/lock timeouts, assertions, and an explicit rollback. It creates no persistent table or migration. A failed assertion stops the command; closing the connection rolls back the failed transaction.

The example demonstrates checking affected rows for an atomic conditional decrement. Adapt the invariant through the consuming project's migration/service/test patterns; do not copy a test table into the production schema. This single-session check does not test concurrent sessions, production isolation settings, tenant authorization, or external side effects. Add real concurrent integration tests when correctness depends on those conditions.
