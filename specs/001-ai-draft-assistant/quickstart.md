# Quickstart: AI Draft Assistant

This quickstart describes the current implementation. Confirm the compatibility status in the repository README before using it in production.

## Prerequisites

- A Roundcube installation that supports the plugin APIs used by this code.
- The repository installed at `plugins/ai_assistant/`.
- PHP cURL enabled for Roundcube.
- An Open WebUI service and model available to Roundcube.
- A server-side Open WebUI API key whose tool permissions have been reviewed.

## Configure

Provide the following values to the Roundcube PHP process using its deployment's environment/secret mechanism:

```text
OPENWEBUI_BASE_URL=https://open-webui.example.invalid
OPENWEBUI_MODEL=your-model-id
OPENWEBUI_API_KEY=your-server-side-secret
```

Do not put the API key in browser configuration, this repository, or a committed deployment file. Add `ai_assistant` to Roundcube's configured plugin list.

## Verify

1. Open a new-message compose view and confirm the assistant toolbar button appears.
2. Request a draft from instructions with no quoted message, then repeat with a non-sensitive reply context.
3. Verify that the result appears separately and is not sent automatically.
4. Insert the result and confirm quoted content and editor formatting behave as expected.
5. Verify the Open WebUI API-key user's available tools are limited to the intended set.

## Data sent

On user request, the current compose text and instructions are sent to the configured Open WebUI service. Review service retention and tool policies before using real email content.
