# Roundcube AI Assistant

A Roundcube plugin that provides an AI-assisted draft sidebar in the compose view. The initial implementation integrates with Open WebUI.

## Current status

This repository is the extracted plugin source, initialized for Spec Kit and GitHub Copilot. The living baseline specification is in [`specs/001-ai-draft-assistant/spec.md`](specs/001-ai-draft-assistant/spec.md); update it as supported behavior changes.

The implementation has not yet been validated against a compatibility matrix or released. See the [open productization tasks](specs/001-ai-draft-assistant/tasks.md).

## Install

Place this repository's contents in Roundcube's `plugins/ai_assistant/` directory, then add `ai_assistant` to Roundcube's configured plugin list. For example, a deployment can clone the repository directly into that directory:

```sh
git clone https://github.com/Code-Omega-Solutions/roundcube-ai-assistant.git /path/to/roundcube/plugins/ai_assistant
```

Pin a release tag or commit for production deployments instead of tracking a moving branch. The plugin requires a Roundcube version with the plugin APIs used by the current implementation; a supported version range has not yet been verified.

## Configuration

The PHP plugin reads these environment variables from the Roundcube process:

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENWEBUI_BASE_URL` | Yes | Base URL of the Open WebUI service, without a trailing slash |
| `OPENWEBUI_MODEL` | Yes | ID of the model to use |
| `OPENWEBUI_API_KEY` | Yes | Open WebUI bearer token; provide it through the deployment's secret mechanism |

The API key must not be committed or exposed to browser JavaScript. The plugin sends the current compose text and user instructions to the configured Open WebUI service.

## Privacy and tool access

Email compose context can include personal or confidential information. It leaves Roundcube when a user requests a draft and is sent to the configured Open WebUI service. Review that service's access, retention, and processing policies before enabling the plugin.

The current implementation sends the model's configured tool IDs together with the tools available to the API-key user. Open WebUI may therefore invoke any such tool; some tools may have effects outside draft generation. Restrict the API-key user's available tools accordingly. This behavior is an explicit productization concern in the living specification and must not be represented as a safe, read-only guarantee.

The plugin itself returns draft text for user review and does not call Roundcube's send action. Users must review the result before inserting and sending it.

## Development

- Read `.specify/memory/constitution.md` and the current feature specifications before changing behavior.
- Use the installed `/speckit-*` skills under `.github/skills/` to keep requirements, implementation plans, and tasks aligned.
- No automated test suite or compatibility matrix is established yet; the initial tasks define those follow-ups.
- Do not add deployment-specific Compose files, host paths, domains, or credentials to this plugin repository.

## License

No license has been selected yet. Until a license is added, no permission to use, modify, or redistribute this code is granted beyond rights provided by applicable law. Resolve licensing before announcing a reusable release.
