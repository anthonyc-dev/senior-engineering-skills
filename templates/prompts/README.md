# Repository-aware implementation prompt

Copy [implementation-brief.md](implementation-brief.md), replace its instruction paragraphs with the task facts, then give the completed brief to the agent. Keep only sections relevant to the work; do not invent constraints or require framework changes without a reason.

The prompt is portable across agents and languages. It does not override higher-priority instructions or grant tool access, deployment rights, secret access, or permission for paid actions. Check that acceptance criteria and requested evidence are concrete before using it.
