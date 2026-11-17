---
name: nextjs
description: Build, refactor, debug, and review modern Next.js applications using the App Router, Server Components, Server Actions, route handlers, caching, and deployment-safe patterns. Use for any Next.js API, routing, rendering, data-fetching, metadata, middleware or proxy, and performance task.
---

# Next.js

1. Read the relevant documentation under `node_modules/next/dist/docs/` before assuming an API or convention.
2. Confirm the installed Next.js and React versions and follow the project's App Router structure.
3. Default to Server Components; add `"use client"` only at the smallest interactive boundary.
4. Keep secrets, privileged clients, and authorization checks on the server.
5. Make caching, revalidation, runtime, and dynamic rendering decisions explicit.
6. Validate Server Action and route-handler inputs, enforce authorization, and return typed errors.
7. Minimize client JavaScript, request waterfalls, layout shifts, and oversized assets.
8. Run type-check, lint, tests, and a production build when risk warrants it.
