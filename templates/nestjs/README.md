# Bounded pagination query

Copy [page-query.dto.ts](page-query.dto.ts) into the feature's DTO directory. Requires the consuming Nest app's existing `class-transformer` and `class-validator` dependencies. Use as a class-typed `@Query()` DTO; do not use it for JSON body validation, where explicit numeric conversion could accept booleans.

Enable the app's shared `ValidationPipe` with `transform: true`, `whitelist: true`, and `forbidNonWhitelisted: true`. Preserve existing pipe/error-envelope conventions. The DTO defaults to page 1, limit 20; accepts integer pages 1 through 1,000,000 and limits 1 through 100. Tighten these bounds for actual query cost.

Apply stable ordering in the repository query. For large mutable datasets use the project's cursor-pagination contract rather than expensive offsets. This DTO does not authenticate users or scope resources; keep those policies in the existing guards/application/repository boundaries.

From the source checkout, `npm run typecheck` checks the DTO and `npm test` exercises it with the real transformation and validation libraries. Run the consuming app's API tests to verify its pipe setup, unknown fields, repeated query parameters and authorization.

Reference: [Nest validation](https://docs.nestjs.com/techniques/validation).
