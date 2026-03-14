# ECC for Codex (Project Supplement)

This supplements the repo root `AGENTS.md` with Codex-specific guidance.

## Skills Discovery

You have ECC skills installed globally under `~/.codex/skills/` (installed by this workspace setup).
Use them when the task matches the skill name/description (e.g., `security-review`, `tdd-workflow`, `frontend-patterns`).

## MCP Servers

Project-local `.codex/config.toml` enables a baseline set of MCP servers (GitHub, Context7, Exa, Memory, Playwright, Sequential Thinking).
Only use heavier or additional servers when the task actually needs them.

## Multi-Agent Support

Multi-agent is enabled in `.codex/config.toml`.
Use the configured roles when helpful:
- `explorer` — read-only evidence gathering before edits
- `reviewer` — correctness/security review
- `docs_researcher` — verify APIs and release-note claims

