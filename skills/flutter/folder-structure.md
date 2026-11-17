# Flutter folder structure

Prefer `lib/features/<feature>/{presentation,application,domain,data}` for complex features and omit layers that add no value. Put truly cross-feature UI, utilities, and infrastructure under `lib/shared/`; keep tests parallel to ownership.
