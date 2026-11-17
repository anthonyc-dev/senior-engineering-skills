---
name: clean-architecture
description: Organize or refactor applications around stable business rules and inward-pointing dependencies. Use for dependency inversion, use cases, ports and adapters, testability, framework decoupling, or tangled application boundaries.
---

# Clean architecture

1. Identify domain rules, application use cases, interface adapters, and infrastructure concerns.
2. Keep dependencies pointing toward stable policy; represent external systems behind narrow ports.
3. Pass plain domain data across boundaries and map transport or persistence shapes at adapters.
4. Keep use cases explicit and transactional without leaking framework-specific context.
5. Introduce boundaries only where change, testing, ownership, or substitution justifies them.
6. Refactor incrementally with characterization tests and preserved behavior.
