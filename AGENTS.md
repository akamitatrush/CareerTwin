<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## graphify

This project has a graphify knowledge graph at `graphify-out/`.

- For architecture / codebase questions, prefer `graphify query "..."` / `graphify explain "..."` / `graphify path "A" "B"`.
- Read `graphify-out/GRAPH_REPORT.md` for god nodes and communities.
- After code changes: `graphify update .` (AST only, no API cost).
- Full rebuild skill: see `~/.grok/skills/graphify/SKILL.md` or `.agents/skills/graphify/SKILL.md`.
