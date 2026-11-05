# Research: Roundcube UI Localization

## Roundcube locale integration

- **Decision**: Continue using the plugin's `localization/` catalogs and Roundcube's `add_texts('localization', true)` mechanism. Use the plugin-domain client translation lookup for dynamic JavaScript text.
- **Rationale**: The PHP plugin already loads the toolbar label through these catalogs. This keeps selection aligned with Roundcube's active language and avoids introducing a separate preference or loading path.
- **Alternatives considered**: A plugin-specific language setting or browser-side locale detection was rejected because it could disagree with the language selected by Roundcube.

## English fallback

- **Decision**: Keep an English fallback map available to the JavaScript UI and use it when the Roundcube translation lookup is missing or empty. Keep the canonical English catalog in `localization/en_US.inc` and validate that the map stays in sync.
- **Rationale**: An explicit client fallback handles incomplete regional files and unresolved client labels without showing blank text or internal keys. No extra request is needed.
- **Alternatives considered**: Relying only on Roundcube's language fallback was rejected because it does not guarantee a readable fallback for each plugin label when a translation entry is absent.

## AJAX failure messages

- **Decision**: The server returns stable, non-sensitive error identifiers; the client maps them to localized UI messages.
- **Rationale**: This preserves the current generic error behavior, avoids returning provider exceptions, and allows the same language selection to cover both synchronous and asynchronous interface text.
- **Alternatives considered**: Translating response text in PHP was rejected because it duplicates translation responsibilities and makes the client dependent on error wording rather than stable identifiers.

## Default instruction hint

- **Decision**: Translate the default instruction shown as a placeholder, but send the existing canonical English default instruction when the input is left empty.
- **Rationale**: The interface is localized without allowing the selected UI language to change the prompt sent to the model.
- **Alternatives considered**: Placing translated instructions in the input value was rejected because the language selection could then affect draft output.

## Contributor validation

- **Decision**: Add a Node.js built-in test that discovers locale files automatically and checks catalog parity, non-empty translations, fallback-map parity, and that UI code references catalog keys. Document the workflow in the root README.
- **Rationale**: The repository has no established test runner or PHP CLI in the current environment. A built-in Node test avoids dependencies, catches common catalog omissions, and lets contributors add a locale file without updating a hard-coded locale list.
- **Alternatives considered**: Adding a package manager or external localization framework was rejected as unnecessary for a small standalone Roundcube plugin.
