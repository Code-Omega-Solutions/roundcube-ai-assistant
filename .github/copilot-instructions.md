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

## Versioning before push

- Before committing and pushing changed plugin code, assets, translations, or runtime dependencies, compare the proposed version with the destination branch and published tags. If that version already identifies different published plugin content, bump it before pushing; never reuse a published version for changed plugin content.
- Use semantic versioning: patch for fixes and translations, minor for backward-compatible features, major for breaking changes. While below 1.0.0, use minor for breaking changes and document them.
- Update `composer.json`, the `@version` annotation in `ai_assistant.php`, and the current version in `README.md` together. Run `node --test tests/metadata.test.js tests/localization.test.js` before pushing.
- Documentation-only changes do not require a bump. Multiple commits belonging to one unpublished version need only one bump. Creating tags, releases, or pushing still requires the user's request.
