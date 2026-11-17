# npm Node service container

Copy [Dockerfile](Dockerfile) and [.dockerignore](.dockerignore) into an existing application's build-context root. Requires an npm lockfile, a `build` script producing `dist/main.js`, and production dependencies declared correctly. This targets a compiled Node service, not Next.js standalone output or this skill pack itself.

```sh
docker build --pull -t local-service:check .
docker run --rm --read-only --tmpfs /tmp -p 3000:3000 local-service:check
```

The service must listen on `0.0.0.0` and respect `PORT`; verify its actual health endpoint and graceful SIGTERM handling. Supply runtime configuration through the deployment's secret/environment mechanism. Keep credentials and private keys out of the build context; extend ignore patterns for project-specific secret files.

Before production, pass a reviewed digest with `--build-arg NODE_IMAGE=...`, scan the image, and verify the built application on the target architecture. Dependency lifecycle scripts are disabled: dependencies requiring native compilation or code generation need an explicit reviewed build step. Copy additional runtime assets only when the application needs them. Workspaces and non-npm projects require their existing package-manager/build conventions.

Reference: [Docker build practices](https://docs.docker.com/build/building/best-practices/).
