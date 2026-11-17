# Reusable templates

Copy only the artifact that fits the consuming project. Read its category guide first, preserve existing configuration, and adapt the documented assumptions before use. These files are examples and starting points, not generated applications or universal production configurations.

| Category | Artifact and purpose |
| --- | --- |
| [Docker](docker/README.md) | Multi-stage npm/Node build and secret-aware build context |
| [Documentation](documentation/README.md) | Architecture decision record with validation and rollout evidence |
| [Flutter](flutter/README.md) | Async snapshot UI and widget regression tests |
| [GitHub Actions](github-actions/README.md) | Read-only, SHA-pinned Node CI workflow |
| [NestJS](nestjs/README.md) | Bounded, validated pagination query DTO |
| [Next.js](nextjs/README.md) | App Router error boundary with safe retry UI |
| [Prompts](prompts/README.md) | Repository-aware implementation brief |
| [React](react/README.md) | Typed loading, error, empty, and ready content states |
| [SQL](sql/README.md) | Rollback-only PostgreSQL conditional-update regression |

`npm test` checks category completeness, usage links, TypeScript/TSX syntax, and workflow structure. Syntax checks do not replace framework type checking, runtime tests, container builds, database tests, or a real CI run. Follow each category's validation instructions in its target environment.

Templates belong to the full framework checkout; installing an individual skill through the skills CLI does not include this top-level directory. Required resources for an individually installed skill must remain inside that skill folder.
