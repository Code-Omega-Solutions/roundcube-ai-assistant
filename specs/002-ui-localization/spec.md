# Feature Specification: Roundcube UI Localization

**Feature Branch**: `002-ui-localization`

**Created**: 2026-11-05

**Status**: Draft

**Input**: User description: "Translate the UI to german and follow the language configuration of roundcube. implement this, that it is easy to contribute new languages. use english as fallback language."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use the assistant in German (Priority: P1)

When a user has selected German in Roundcube, the AI assistant interface appears in German, including its controls, labels, status information, and user-facing errors.

**Why this priority**: German is the requested additional language and is the main user-visible outcome.

**Independent Test**: Set Roundcube's language to German, open the assistant, and verify all plugin-owned interface text is German.

**Acceptance Scenarios**:

1. **Given** Roundcube is configured to display German, **When** the user opens and uses the assistant, **Then** the assistant's labels, buttons, status messages, and errors appear in German.
2. **Given** Roundcube is configured to display English, **When** the user opens and uses the assistant, **Then** the assistant's interface appears in English.

### User Story 2 - Fall back to English (Priority: P1)

When the selected language is unavailable or a translation omits a string, the user still receives a usable interface with English text instead of untranslated identifiers or blank text.

**Why this priority**: Reliable fallback keeps the plugin understandable across Roundcube language settings and incomplete contributions.

**Independent Test**: Select an unsupported language and exercise a deliberately incomplete translation; verify missing text is presented in English.

**Acceptance Scenarios**:

1. **Given** Roundcube is configured to use a language without an assistant translation, **When** the assistant is opened, **Then** its interface is shown in English.
2. **Given** a supported language translation is missing one interface string, **When** that string is displayed, **Then** its English text is shown.

### User Story 3 - Contribute another language (Priority: P2)

A contributor can add or improve a language translation using a documented, predictable set of files and steps without needing to change assistant behavior.

**Why this priority**: A low-friction contribution path lets the community extend localization beyond German.

**Independent Test**: Follow the contribution instructions to add a sample language catalog and verify the assistant can display its translated text when Roundcube selects that language.

**Acceptance Scenarios**:

1. **Given** a contributor follows the localization guide, **When** they add translations for a new Roundcube language, **Then** they can do so without editing application logic.
2. **Given** a contributor updates a translation, **When** they compare it with the English source catalog, **Then** they can identify missing or obsolete strings.

### Edge Cases

- Roundcube reports a regional language identifier for which only a base-language translation exists.
- A regional translation exists but is incomplete.
- A translation contains an empty value for a string.
- A user-facing string is added to the interface but not yet added to a translation catalog.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The assistant MUST display its user-facing interface in German when Roundcube is configured for German.
- **FR-002**: The assistant MUST use Roundcube's configured language rather than a separate plugin language preference.
- **FR-003**: The assistant MUST provide an English translation for every plugin-owned user-facing string.
- **FR-004**: The assistant MUST display English for an unavailable language and for strings missing or empty in a selected translation.
- **FR-005**: The assistant MUST handle regional language identifiers consistently with the available translations, using a matching regional translation when present and the corresponding base language when available.
- **FR-006**: The assistant MUST keep user-facing strings separate from interface behavior so a language can be added without modifying application logic.
- **FR-007**: The project MUST document how to add and validate a language translation, including how contributors can identify missing strings.
- **FR-008**: Existing assistant actions and behavior MUST remain unchanged when the displayed language changes.

### Key Entities

- **Translation catalog**: A language-specific set of user-facing assistant strings, keyed consistently with the English source.
- **Roundcube language setting**: The user's configured language identifier that determines which assistant translation is selected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every plugin-owned string visible during the assistant's normal, loading, success, and error states has English text and a German translation.
- **SC-002**: In test scenarios, 100% of assistant text is German under a German Roundcube setting and English under an English setting.
- **SC-003**: For an unsupported language or any missing/empty translated entry, 100% of displayed assistant strings resolve to readable English rather than blank text or translation keys.
- **SC-004**: A contributor can add a language by following the project guide and adding translation data without changing application logic.
- **SC-005**: Language selection does not change the result or behavior of existing assistant actions.

## Assumptions

- German is the first additional language to be provided; the existing English interface becomes the fallback and canonical source for translation keys.
- The plugin follows Roundcube's active language setting, including the language identifier and regional variants exposed by the Roundcube installation.
- The scope is plugin-owned UI text; Roundcube's own interface and model-generated email content are outside the translation catalog.
