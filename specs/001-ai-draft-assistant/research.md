# Research: AI Draft Assistant

- **Date**: 2026-11-05
- **Status**: Baseline research from the extracted implementation

## Existing implementation

- The plugin is implemented as `ai_assistant`, with a PHP entry point, browser JavaScript/CSS, and four language files.
- The server action accepts `context` and `instructions`, with limits of 60,000 and 4,000 bytes respectively.
- The PHP code queries `/api/models`, finds the configured model, queries `/api/v1/tools/`, then posts a non-streaming request to `/api/chat/completions`.
- The configured model's `toolIds` are combined with IDs returned by the tools endpoint. This means tool access is broader than model-associated tools alone.
- The browser holds returned draft text separately and requires an explicit insertion action. The code does not invoke Roundcube's send action.
- Rich-text insertion escapes model text before creating paragraphs and preserves a detected blockquote; plain-text insertion similarly attempts to preserve quote content.
- The current deployment uses Roundcube `1.7.5-apache` and Open WebUI, but there is no checked-in compatibility test or declared minimum/maximum version.

## Decisions for the initial extraction

| Topic | Decision | Rationale |
| --- | --- | --- |
| Provider | Keep Open WebUI as the only provider in the initial extraction | Avoid speculative abstraction and preserve current behavior |
| Plugin layout | Keep plugin files at repository root | Allows direct clone into Roundcube's `plugins/ai_assistant/` path |
| Deployment | Keep Compose, host paths, certificates, and secrets in the consuming stack | Maintain separation between reusable code and one deployment |
| Persistence | No plugin-owned data store | Current implementation has no persistent plugin state |
| License | Unresolved; do not add a license without an owner decision | A public repository alone does not grant a general reuse license |

## Risks and open questions

1. **Tool permissions**: The implementation may expose side-effecting Open WebUI tools to a drafting request. Decide between model-only tools, an explicit allow-list, and broader API-key-user tools; specify and test the chosen policy.
2. **Data handling**: Compose content is sent to Open WebUI. Deployers need explicit retention and privacy guidance.
3. **Compatibility**: Roundcube APIs, PHP minimum version, and Open WebUI response formats are not tested across a version matrix.
4. **Failure diagnostics**: The browser gets a generic error; the server currently suppresses details from the user response. Add appropriately redacted diagnostics and tests.
5. **Concurrency/navigation**: The current client does not visibly cancel or correlate overlapping requests or navigation.
6. **Licensing**: Select and add a license before announcing the code as reusable.
