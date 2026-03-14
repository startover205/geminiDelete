# Codex Instructions (Workspace)

This repo is configured for OpenAI Codex.

## How to work here

- Prefer the existing patterns in `src/` and keep changes minimal and focused.
- For non-trivial changes: make a short plan, implement, then run the closest available checks/tests.
- Security basics: never hardcode secrets; treat `.env` and keys as sensitive; validate external inputs.

## Codex configuration

- Project-local config: `.codex/config.toml`
- Codex-specific supplement: `.codex/AGENTS.md`
- ECC skills are installed globally under `~/.codex/skills/` and can be used when relevant.

