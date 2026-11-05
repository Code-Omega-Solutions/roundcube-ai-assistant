# Copilot instructions

## Source of truth

- The current product requirements and acceptance criteria live under `specs/`.
- Keep those specifications current when behavior, configuration, privacy, or compatibility changes.
- Use the repository's Spec Kit skills in `.github/skills/` for substantive feature work: specify, plan, tasks, implement, then analyze.
- Keep `.specify/memory/constitution.md` authoritative for project principles. Update it through the constitution workflow when principles change.

## Engineering constraints

- Preserve Roundcube's plugin contract and the `ai_assistant` plugin directory name.
- Never hard-code API keys, host-specific paths, or deployment domains. Keep credentials server-side.
- Treat email content as sensitive user data. Document what leaves Roundcube and what Open WebUI tools can access.
- Do not add automatic mail sending or other side effects without an explicit specification and user confirmation flow.
- Add or update tests and compatibility documentation with behavior changes. Do not claim compatibility that has not been tested.
- Keep this repository deployable as a standalone Roundcube plugin; deployment-specific configuration belongs in the consuming Roundcube stack.
