# Quickstart: Verify and Contribute UI Translations

## Prerequisites

- Node.js, for the focused catalog validation test.
- A Roundcube installation with this plugin enabled, for end-to-end language selection verification.

## Validate translation catalogs

From the repository root, run:

```sh
node --test tests/localization.test.js
node --check ai_assistant.js
```

The catalog test must pass with all catalog keys present and non-empty, the English fallback synchronized, and the UI translation references covered.

## Verify in Roundcube

1. Select English in Roundcube, open the compose view, and verify the toolbar button, sidebar, statuses, and errors appear in English.
2. Select German (`de`, `de_DE`, or `de_CH` as configured by the installation) and verify the same UI appears in German.
3. Temporarily remove or blank one translated value in a local test copy and verify that the UI displays its English fallback.
4. Select a language without a plugin catalog and verify the assistant remains usable in English.
5. Leave the instruction field empty under English and German settings, request a draft in each, and confirm the same default instruction is sent.
6. Enter a custom instruction and insert a draft to confirm user-entered instructions and the insertion flow still work.

## Add a language

1. Copy the complete key set from `localization/en_US.inc` to a new file named for the Roundcube locale (for example, `fr_FR.inc`).
2. Translate the values without renaming keys or leaving values empty.
3. Run `node --test tests/localization.test.js` and resolve any missing-key or empty-value failures.
4. Run `node --test tests/localization.test.js` to confirm the new catalog is discovered automatically.
5. Test with Roundcube configured for the new language.

Adding a catalog must not require changes to `ai_assistant.js`, `ai_assistant.php`, or the test's locale list.
