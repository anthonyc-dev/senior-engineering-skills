# Reusable templates

Copy only the artifact that fits the consuming project. Read its category guide first, preserve existing configuration, and adapt the documented assumptions before use. These files are examples and starting points, not generated applications or universal production configurations.

| Category | Artifact and purpose |
| --- | --- |
| [ASP.NET Core](aspnet-core/README.md) | C# minimal API liveness endpoint |
| [Docker](docker/README.md) | Multi-stage npm/Node build and secret-aware build context |
| [Documentation](documentation/README.md) | Architecture decision record with validation and rollout evidence |
| [Express](express/README.md) | Express 5 liveness route and local server |
| [Flutter](flutter/README.md) | Async snapshot UI and widget regression tests |
| [GitHub Actions](github-actions/README.md) | Read-only, SHA-pinned Node CI workflow |
| [Go](go/README.md) | Standard library HTTP liveness endpoint with timeouts |
| [NestJS](nestjs/README.md) | Bounded, validated pagination query DTO |
| [Next.js](nextjs/README.md) | App Router error boundary with safe retry UI |
| [Prompts](prompts/README.md) | Repository-aware implementation brief |
| [Python](python/README.md) | Standard library WSGI liveness handler |
| [React](react/README.md) | Typed loading, error, empty, and ready content states |
| [SQL](sql/README.md) | Rollback-only PostgreSQL conditional-update regression |

From the framework root, run `npm ci --ignore-scripts` to install the standalone editor dependencies for NestJS, Next.js and React. Their [TypeScript configuration](tsconfig.json) supplies JSX and decorator settings. Use `npm run typecheck` for strict type checks and `npm test` for render, DTO, catalog and workflow tests. Follow each category's instructions for checks in the consuming app.

Templates belong to the full framework checkout; installing an individual skill through the skills CLI does not include this top-level directory. Required resources for an individually installed skill must remain inside that skill folder.
