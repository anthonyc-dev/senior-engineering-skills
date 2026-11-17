---
name: nodejs
description: Design, implement, troubleshoot, and optimize production Node.js services, workers, and tooling. Use for Node runtimes, event-loop behavior, streams, processes, filesystem work, package management, or backend service reliability.
---

# Node.js

1. Confirm the supported Node version, package manager, module format, and deployment environment.
2. Keep request handlers thin and move business logic behind explicit service boundaries.
3. Use async I/O, bounded concurrency, timeouts, cancellation, and backpressure where relevant.
4. Validate configuration at startup and terminate cleanly on fatal initialization errors.
5. Avoid blocking the event loop, unbounded buffers, leaked handles, and synchronous hot-path work.
6. Implement structured error handling, graceful shutdown, health checks, and contextual logs.
7. Test failure paths, resource cleanup, and process behavior.
