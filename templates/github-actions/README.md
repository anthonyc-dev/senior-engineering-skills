# npm project CI

Copy [node-ci.yml](node-ci.yml) to `.github/workflows/node-ci.yml` at the repository root only when the root contains `package-lock.json` and a meaningful `check` script. The template is inert in this directory; copying it is an explicit setup step.

For a repository keeping this framework under `.ai/`, add `defaults.run.working-directory: .ai` at the job level. For other apps, select the existing runtime/package manager and validation script. Review dependencies requiring lifecycle scripts before adapting `--ignore-scripts`.

The workflow uses read-only repository permissions, no retained checkout credentials, no secrets, bounded execution time, and commit-pinned actions. Verify action updates against their official repositories; do not replace immutable revisions with floating tags. Untrusted PR code still executes: keep it on hosted isolated runners without private infrastructure or privileged credentials. Do not change this to `pull_request_target` while checking out PR code.

Validate YAML locally, then inspect an actual pull-request run, failed-check behavior, and branch-protection settings after copying. No local test proves hosted CI passed. References: [secure workflow use](https://docs.github.com/en/actions/reference/security/secure-use), [checkout revision](https://github.com/actions/checkout/commit/8e8c483db84b4bee98b60c0593521ed34d9990e8), [Node setup revision](https://github.com/actions/setup-node/commit/395ad3262231945c25e8478fd5baf05154b1d79f).
