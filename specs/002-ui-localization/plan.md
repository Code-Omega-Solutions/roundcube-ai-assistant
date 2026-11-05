# Implementation Plan: Roundcube UI Localization

**Branch**: `002-ui-localization` | **Date**: 2026-11-05 | **Spec**: [spec.md](spec.md)

**Input**: [Feature specification](spec.md)

## Summary

Translate every assistant-owned UI string into German and English, honoring Roundcube's active language and using English if the selected translation or an individual entry is unavailable. Keep strings in Roundcube-compatible locale catalogs and document a catalog-only contribution workflow. The plugin already loads locale files for the toolbar label; extend that approach to the JavaScript sidebar and AJAX error statuses.

## Technical Context

- **Language/Version**: PHP (Roundcube plugin runtime; exact minimum version unverified), browser JavaScript (no build step)
- **Primary Dependencies**: Roundcube plugin and localization APIs; Node.js built-in test runner for locale consistency checks
- **Storage**: Locale catalog files only; no runtime persistence
- **Testing**: `node --check ai_assistant.js`; focused Node.js tests validating catalog completeness and string references; PHP syntax check when PHP CLI is available
- **Target Platform**: Roundcube compose view
- **Project Type**: Standalone Roundcube plugin
- **Performance Goals**: No additional network requests or perceptible delay for language selection or panel rendering
- **Constraints**: Use Roundcube's active language; keep English as fallback; preserve draft requests, insertion, and existing behavior; do not expose internal provider errors
- **Scale/Scope**: One sidebar and toolbar button; English plus German (`de`, `de_DE`, and `de_CH` catalogs)

## Constitution Check

- **User control and privacy**: Pass; localization does not change email data flow, permissions, or user-triggered behavior.
- **Roundcube-native, standalone plugin**: Pass; use plugin-owned locale files and the existing Roundcube localization integration.
- **Requirements lead behavior**: Pass; this plan follows [spec.md](spec.md) and the project language-selection requirements.
- **Test and compatibility evidence**: Pass with a bounded evidence statement; add focused locale checks and run available syntax checks. No Roundcube installation is available in this repository environment, so live Roundcube locale selection will remain a manual integration validation.
- **Minimal, observable integration**: Pass; translation affects displayed text only, and user-facing failures remain generic and localized.

**Gate**: Pass. No constitution exception is required.

## Design Decisions

- Use the existing `localization/*.inc` catalogs as the source for Roundcube translations and load all plugin-owned labels through `add_texts('localization', true)`.
- Translate the toolbar, sidebar accessibility label, headings, fields, buttons, default instruction hint, and all status/error messages.
- Show the localized default instruction as a placeholder, while sending the unchanged canonical English default when users leave the field empty; this keeps language selection from changing model behavior.
- Return stable error identifiers from the AJAX handler and translate them in the browser, keeping provider diagnostics private.
- Keep an explicit English string map in the browser as a runtime fallback when Roundcube cannot resolve a selected or incomplete translation. Add a focused consistency test so these fallback keys and values cannot silently drift from `localization/en_US.inc`.
- Provide complete `en_US`, `de`, `de_DE`, and `de_CH` catalogs. Use identical German text across the existing German variants unless Roundcube-specific regional wording is needed later.
- Document that contributors add locale catalogs by copying the English key set, translating values, and running the focused validation; adding a supported language must not require behavior code changes.

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-localization/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
ai_assistant.php
ai_assistant.js
localization/
├── en_US.inc
├── de.inc
├── de_DE.inc
└── de_CH.inc
tests/
└── localization.test.js
README.md
```

**Structure Decision**: Keep Roundcube plugin files and locale catalogs in their existing locations. Add a minimal Node.js test under `tests/` using only built-in modules; do not add a package manifest or runtime dependency.

## Complexity Tracking

No constitution violations or added architectural complexity.
