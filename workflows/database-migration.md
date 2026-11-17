# Database-migration workflow

1. Measure affected schema, data volume, dependencies, and lock risk.
2. Design backward-compatible expand, backfill, switch, and contract stages.
3. Add constraints and indexes without unsafe long blocking where possible.
4. Test migration, rollback or recovery, and application compatibility.
5. Monitor locks, errors, latency, and data integrity during rollout.
