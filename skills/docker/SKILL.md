---
name: docker
description: Create, secure, optimize, and troubleshoot Docker images, Dockerfiles, Compose environments, and container runtime behavior. Use for container builds, image size, networking, volumes, health checks, permissions, or reproducible local environments.
---

# Docker

1. Confirm target runtime, architecture, build context, and required development or production behavior.
2. Use pinned, minimal trusted base images and multi-stage builds.
3. Order layers for cache efficiency and exclude secrets, VCS data, dependencies, and build output from context.
4. Run as a non-root user with a read-only filesystem and minimal capabilities when possible.
5. Use exec-form commands, graceful signal handling, health checks, and explicit resource limits.
6. Scan dependencies and images, then test the built image rather than only the host process.
