---
name: skill-evaluation
description: Evaluate skill discovery, activation, instruction clarity, task correctness, verification, consistency, security, and maintainability. Use for skill benchmarks, feedback triage, version comparison, proposals, and controlled skill improvement.
---

# Skill evaluation and improvement

1. Freeze a case revision and pass criteria before testing. Include a positive trigger, neighboring negative trigger, missing-tool fallback, and a pressure case for any risky workflow. Run each version in a clean client session with the same prompt, fixtures, client, model, and tool access. Repeat when checking consistency.
2. Record what the client discovered and activated, acceptance criteria reached, command evidence and observed failures. Include conflicting or overlapping guidance, ambiguous instructions, unsafe behavior, missing fallbacks and needless complexity. Review evidence before marking a criterion passed.
3. Use [the evaluation protocol and case suite](references/protocol.md). The [scorer](scripts/evaluate.mjs) validates and compares recorded results. It does not run agent clients, grade prose, or create evidence. Without Node, tabulate the same outcomes manually. Keep real client results distinct from structural tests and reviewed simulations.
4. Collect only approved, sanitized feedback. Group repeated failures by case and version. Draft the smallest patch and identify affected claims, references and tests. Review the proposal with a maintainer before changing official skills.
5. Evaluate the approved candidate in an isolated checkout, rerun affected cases and pack checks, and record baseline and candidate revisions. Require approval before accepting or publishing. Use Git for version history and an approved revert or previous pinned release for rollback. Pause when evidence conflicts, a critical case regresses, or approval is absent.
