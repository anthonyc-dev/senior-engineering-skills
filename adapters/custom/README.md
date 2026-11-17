# Custom-agent adapter

Load `.ai/AGENTS.md` as the root instruction. Index `skills/*/SKILL.md` by YAML `name` and `description`, then inject the body only when triggered. Resolve relative references from the skill directory.
