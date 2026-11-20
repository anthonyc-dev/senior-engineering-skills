# Deployment workflow

1. Inventory Docker, Compose, CI/CD, infrastructure and release files. Map tested artifact, target environment, migrations and dependencies. Compare required environment variable names with approved configuration or presence-only tooling. Never emit values or expanded configuration containing secrets.
2. Run authorized local checks and report readiness, inconsistencies, and evidence. Specify approval owner, previous artifact, rollback sequence, schema compatibility, health endpoints, critical user journeys and stop thresholds. A runbook or successful build does not authorize deployment.
3. Deploy progressively when risk warrants it.
4. Verify health, logs, metrics, and critical user journeys.
5. Apply only the authorized rollback on breached criteria and record the outcome. Keep production actions pending until authorization covers that operation.
