# Production-quality-code evaluation

## Scope and research

This change strengthens the existing engineering core, not all 33 technology skills. The comparison is between the earlier principle-oriented core and its new explicit procedures. The two accompanying agent reviews are simulated artifact evaluations from this session, not a benchmark across model providers or agent products.

Inspected sources:

- [Vercel skills CLI](https://github.com/vercel-labs/skills): TypeScript implementation of installation, discovery, and agent-specific destinations.
- [Vercel find-skills instruction](https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md): the actual reusable instruction is Markdown.
- [Vercel React skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md): progressive detail, prioritized rules, and linked examples; its wording and code were not copied into this skill.
- [Agent Skills format](https://agentskills.io/home): metadata, instructions, and optional executable resources.
- [Native Node.js TypeScript support](https://nodejs.org/api/typescript.html): erasable types and explicit module extensions.

## Baseline scenarios

An isolated evaluator read only the previous core skill, without root framework instructions or companion skills.

1. **Repository commands without execution tools.** Given pnpm metadata and a configured `verify` script, choose the real command and describe unavailable evidence. The earlier skill said to inspect conventions but gave no reproducible package-manager/command-selection procedure.
2. **Ambiguous payment timeout under release pressure.** Decide whether to automatically retry when the first request may have succeeded. The earlier instruction named retries and idempotency but did not specify reconciliation, persisted operation identity, or why a fresh key is insufficient.
3. **Standalone installation without companions.** Implement an API change when the security and completion skills are absent. The earlier core required both companions and had no explicit fallback or report shape.

The evaluator's baseline answer was itself cautious and sensible. It did not demonstrate unsafe executor behavior. The observed artifact failure was the missing standalone procedure: "no missing-companion detection procedure ... fallback workflow, report template, or evidence-field requirements." Do not claim the new wording caused a measured improvement in model accuracy.

## Revised instruction review

A separate isolated evaluator read only the revised core and its bundled playbook, then answered the same scenarios:

1. Selected `pnpm run verify` from the supplied evidence and explicitly marked reproduction, changes, and checks not run when execution was unavailable.
2. Required reconciliation and the original usable idempotency key before retry; an unreconcilable submission remained pending for authorized review.
3. Applied built-in API, authorization, migration, and five-field evidence reporting procedures without assuming companion installation or proprietary tools.

No coverage failure was reported for those three simulated scenarios. This is evidence that the artifact contains usable procedures, not evidence that every future agent will comply.

## Executable verification

The project check command includes strict TypeScript checking, regression fixtures, and installation tests. It exercises:

- Declared manager selection, conflicting evidence, configured script-name suggestions, workspace warnings, malformed manifests, and non-JavaScript manifest hints.
- Omission of script bodies and `.env` content from output; no project script execution.
- Full 33-skill copy installation and a four-skill subset with identical source/destination contents.
- Standalone core installation into Codex, Claude Code, Cursor, Gemini CLI, and GitHub Copilot target directories, followed by actual Node execution of the copied helper inside CommonJS host projects with spaces in their paths.

Installation destinations are tested by the Vercel CLI; the five agent applications are not launched. Tests run on the current Windows environment with Node 24.15.0. Node 22.20 and Linux/macOS runtime checks, real provider/payment execution, and cross-model task benchmarks are not performed. Structural tooling tests do not establish correctness of every engineering recommendation.
