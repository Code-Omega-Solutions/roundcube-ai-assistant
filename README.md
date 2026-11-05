# Roundcube AI Assistant

A Roundcube plugin that provides an AI-assisted draft sidebar in the compose view for new messages and replies. The initial implementation integrates with Open WebUI.

## Current status

Plugin version: **0.1.0** (initial development version, not a tagged release).
Package metadata is maintained in [`composer.json`](composer.json); its package
name preserves Roundcube's required `ai_assistant` plugin directory.
Source code: [Code-Omega-Solutions/roundcube-ai-assistant](https://github.com/Code-Omega-Solutions/roundcube-ai-assistant).
Report issues in the [source repository's issue tracker](https://github.com/Code-Omega-Solutions/roundcube-ai-assistant/issues).

This repository is the extracted plugin source, initialized for Spec Kit and GitHub Copilot. The living product specifications are in [`specs/`](specs/README.md); update them as supported behavior changes.

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

## Localization

The assistant follows the language selected in Roundcube. The toolbar and sidebar are available in English and German; English is used when a locale or individual translation is unavailable. The English source catalog is [`localization/en_US.inc`](localization/en_US.inc), and the German catalogs cover `de`, `de_DE`, and `de_CH`.

To contribute another language, copy the keys in `localization/en_US.inc` into `localization/<roundcube-locale>.inc`, translate the values without renaming keys, and run:

```sh
node --test tests/localization.test.js
```

The test discovers locale files automatically and checks key parity and non-empty translations. Adding a language does not require changes to the plugin logic or test configuration.

## Development

- Read `.specify/memory/constitution.md` and the current feature specifications before changing behavior.
- Use the installed `/speckit-*` skills under `.github/skills/` to keep requirements, implementation plans, and tasks aligned.
- A focused localization catalog test is available at `tests/localization.test.js`; a full automated suite and compatibility matrix are not established yet.
- Run `node --test tests/metadata.test.js` to check package metadata, version consistency, source links, and licensing status. When changing the version, update both `composer.json` and the PHP plugin's `@version` annotation, plus the version above.
- Composer declares PHP 7.4 or newer because the source uses arrow functions, along with the cURL and JSON extensions. These are code-level prerequisites, not a tested compatibility range. Run `composer validate --strict --no-check-publish` when Composer is available.
- Do not add deployment-specific Compose files, host paths, domains, or credentials to this plugin repository.

### Versioning before push

Before pushing changes to plugin code, assets, translations, or runtime dependencies,
compare the version with the destination branch and published tags. Bump the version
if it already identifies different published plugin content; do not publish changed
plugin content under a reused version.

Use a patch increment for fixes and translations, a minor increment for
backward-compatible features, and a major increment for breaking changes. Before
1.0.0, breaking changes use a minor increment and must be documented.
Documentation-only changes need no bump, and commits within one unpublished
version can share its version number.

Update `composer.json`, `ai_assistant.php` (`@version`), and this README together,
then run `node --test tests/metadata.test.js tests/localization.test.js` before
pushing. The tests check consistency; they do not automatically bump versions or
enforce remote push history. Tagging or publishing a release is a separate action,
still subject to the license and compatibility gates.

## License

The original plugin code is licensed under the **MIT License**; see [`LICENSE`](LICENSE) for the full terms.

Third-party materials retain their own licenses and attribution notices. The bundled Spec Kit Bug Triage Workflow declares MIT licensing in [its extension manifest](.specify/extensions/bug/extension.yml). Roundcube and its plugin installer remain subject to their own GPL licenses, including Roundcube's plugin exception; the separately deployed Open WebUI service retains its own license.
