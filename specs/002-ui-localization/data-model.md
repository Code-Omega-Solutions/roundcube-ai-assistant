# Data Model: Roundcube UI Localization

## Translation catalog

A language catalog maps stable assistant string keys to user-facing text.

| Field | Description | Validation |
| --- | --- | --- |
| Language identifier | Roundcube locale identifier represented by the catalog filename | Must use a supported Roundcube locale name, such as `de_DE` |
| String key | Stable identifier shared by all catalogs | Must be present in English and every maintained German catalog |
| Translation value | User-visible text for that key | Must not be empty; missing runtime translations resolve to English |

The English catalog is the source key set. Existing German locale variants (`de`, `de_DE`, `de_CH`) contain the same keys.

## Roundcube language setting

The active Roundcube language determines which catalog Roundcube loads. The plugin does not store a separate language preference. The client English fallback applies when Roundcube cannot resolve a catalog entry.

## Error identifier

The AJAX draft response uses stable identifiers for expected user-facing failures. The browser maps recognized identifiers to catalog keys; unknown identifiers use the generic request-failure message. No provider exception detail is sent to the browser.
