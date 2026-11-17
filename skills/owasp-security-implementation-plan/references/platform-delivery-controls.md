# Platform and delivery security controls

## Dependencies and software supply chain

- Verify that proposed packages exist, are maintained, and are the intended package.
- Pin or lock dependencies according to ecosystem practice and review transitive changes.
- Scan for known vulnerabilities, malicious or abandoned packages, licenses, and exposed secrets.
- Protect lockfiles, package sources, build scripts, generated artifacts, and release provenance.
- Do not assume AI-suggested packages or versions are real, current, or safe.

## CI/CD

- Give source, build, review, and deployment automation the minimum permissions required.
- Prefer short-lived workload identity over stored long-lived credentials.
- Isolate untrusted pull-request jobs from secrets and privileged runners.
- Pin third-party automation to trusted immutable revisions.
- Run relevant tests, SAST, dependency, secret, IaC, license, and container checks.
- Build once and promote traceable immutable artifacts.
- Require approval for workflow, rules-file, security-policy, and production deployment changes.

## Cloud and infrastructure

- Use infrastructure as code, environment isolation, private networking, encryption, centralized logs, and explicit ownership.
- Restrict IAM by action and resource; avoid broad wildcards and standing administrative access.
- Protect public endpoints with authentication, throttling, filtering, and resource limits appropriate to the service.
- Define backup, restore, key rotation, incident access, regional failure, and decommissioning procedures.
- Review managed-service defaults instead of assuming the provider secures application configuration.

## Containers

- Use minimal trusted pinned base images and multi-stage builds.
- Exclude secrets and unnecessary files from build context and layers.
- Run as non-root with a read-only filesystem, dropped capabilities, and bounded resources where practical.
- Use exec-form startup, graceful shutdown, health checks, and image scanning.
- Treat orchestrator, registry, admission, and runtime permissions as separate trust boundaries.

## Monitoring and response

- Define security signals, owners, severity, runbooks, escalation, retention, and evidence requirements.
- Monitor authentication abuse, privilege changes, policy denial, secret access, anomalous data access, integrity failure, and disabled controls.
- Correlate logs, metrics, traces, and audit events without collecting unnecessary sensitive data.
- Test alerts and recovery through safe exercises.

## Mobile and desktop clients

- Treat devices and distributed binaries as attacker-controlled.
- Keep authorization and sensitive business rules on trusted services.
- Store credentials only using platform-secure storage and minimize offline sensitive data.
- Validate deep links, inter-process messages, local files, update signatures, and platform permissions.
- Use pinning, root or jailbreak detection, obfuscation, and biometrics only when justified by the threat model; do not treat them as primary authorization controls.

## AI-enabled systems and coding agents

- Treat prompts, retrieved content, repository files, issues, logs, tool output, and agent-to-agent messages as untrusted input.
- Separate instructions from data and prevent untrusted content from changing authority or policy.
- Constrain model tools by action, data, filesystem, network, identity, time, and resource limits.
- Validate tool arguments and results and require approval for material external or destructive actions.
- Protect prompts, context, credentials, personal data, model output, and audit trails.
- Verify dependencies and generated code; never accept fabricated tests or scanner results.
- Review changes to `AGENTS.md`, rules, workflows, tool descriptions, and CI agents as security-sensitive configuration.
- Assign a human owner to approve security-sensitive generated changes.
