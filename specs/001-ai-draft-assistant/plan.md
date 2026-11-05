# Implementation Plan: AI Draft Assistant Baseline and Productization

**Branch**: `001-ai-draft-assistant` | **Date**: 2026-11-05 | **Spec**: [spec.md](spec.md)

**Input**: [Feature specification](spec.md)

## Summary

Extract the existing Roundcube AI drafting plugin into an independently installable repository, document its current Open WebUI contract and privacy/tool behavior, and use the baseline specification to guide compatibility, safety, and test improvements. This initial repository snapshot preserves current behavior; it does not claim that open productization tasks are already complete.

## Technical Context

- **Language/Version**: PHP (Roundcube plugin runtime; exact minimum PHP version not verified), JavaScript (browser; no build step)
- **Primary Dependencies**: Roundcube plugin API, PHP cURL extension, Open WebUI HTTP API
- **Storage**: None in the plugin
- **Testing**: No automated suite established at extraction; PHP syntax and JavaScript syntax checks are initial smoke checks
- **Target Platform**: Roundcube webmail compose view
- **Project Type**: Standalone Roundcube plugin
- **Performance Goals**: Do not block compose UI while generating; current server-side request timeout is up to 120 seconds
- **Constraints**: API key remains server-side; compose context is sent to Open WebUI; tool availability follows the API-key user's permissions plus model tool IDs
- **Scale/Scope**: One plugin, one configured Open WebUI service/model per Roundcube installation

## Constitution Check

- **User control and privacy**: Pass with a documented constraint; requests are user-triggered, but the service and tool permissions require prominent configuration guidance.
- **Roundcube-native, standalone plugin**: Pass; source files are located at the repository root so the repository can be installed as `plugins/ai_assistant/`.
- **Requirements lead behavior**: Pass; this plan and the baseline spec describe current behavior and open decisions.
- **Test and compatibility evidence**: Not yet satisfied for a reusable release; compatibility tests and matrix are explicitly tracked as follow-up work.
- **Minimal, observable integration**: Partial; client receives general failure status, while server-side diagnostics and provider contract tests need improvement.

**Gate**: Extraction and baseline docs can proceed. A reusable release is gated on a license, compatibility evidence, tests, and an explicit tool policy.

## Current Architecture

- `ai_assistant.php` registers a Roundcube compose action, validates input lengths, calls Open WebUI, discovers models/tools, parses a draft, and returns it through Roundcube's AJAX output.
- `ai_assistant.js` creates the sidebar, captures compose text/instructions, requests a draft, and inserts escaped draft text while attempting to preserve quoted content.
- `ai_assistant.css` styles the sidebar.
- `localization/` contains English and German labels.
- Deployment-specific endpoints and credentials are supplied by the consuming Roundcube process, not this repository.

## Project Structure

```text
ai_assistant.php
ai_assistant.js
ai_assistant.css
localization/
.github/
  copilot-instructions.md
  skills/speckit-*/
.specify/
specs/
  README.md
  001-ai-draft-assistant/
    spec.md
    plan.md
    research.md
    quickstart.md
    tasks.md
```

**Structure Decision**: Keep Roundcube plugin files at the repository root to support direct clone/install into `plugins/ai_assistant/`. Keep Spec Kit assets and living specifications alongside source, without imposing a PHP package manager or build step on consumers.

## Rollout

1. Publish the extracted source and current-behavior specification.
2. Resolve license and effective tool-permission policy.
3. Establish PHP/JavaScript checks and focused tests.
4. Verify the supported Roundcube and Open WebUI version ranges.
5. Tag a release only after the release gates in the constitution and spec are met.
