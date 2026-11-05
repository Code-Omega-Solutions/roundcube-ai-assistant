# Tasks: Roundcube UI Localization

**Input**: Design documents from `specs/002-ui-localization/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`

**Organization**: Tasks are grouped by user story for independent implementation and validation.

## Phase 1: Setup

The existing standalone plugin structure is retained; no project initialization or external dependencies are required.

## Phase 2: Foundational

No separate foundation is required. Existing Roundcube plugin initialization and locale loading are reused.

## Phase 3: User Story 1 - Use the assistant in German (Priority: P1)

**Goal**: Show all assistant-owned UI in German or English according to Roundcube's active language.

**Independent Test**: Select German and English in Roundcube and verify the toolbar label, sidebar content, accessibility label, status text, and failures are displayed in the selected language.

### Tests for User Story 1

- [X] T001 [P] [US1] Add Node.js locale-catalog parity and UI-key coverage tests in `tests/localization.test.js`

### Implementation for User Story 1

- [X] T002 [P] [US1] Add the complete English source catalog for all assistant UI strings in `localization/en_US.inc`
- [X] T003 [P] [US1] Add matching German translations for the maintained Roundcube German locale variants in `localization/de.inc`, `localization/de_DE.inc`, and `localization/de_CH.inc`
- [X] T004 [US1] Replace hard-coded sidebar and status text with Roundcube plugin-domain localization lookups in `ai_assistant.js`, showing the default instruction as a localized hint
- [X] T005 [US1] Replace user-facing AJAX error strings with stable error identifiers and localize them through the assistant catalogs in `ai_assistant.php` and `ai_assistant.js`

**Checkpoint**: Roundcube language selection controls the toolbar and all assistant UI; draft generation and insertion still work.

## Phase 4: User Story 2 - Fall back to English (Priority: P1)

**Goal**: Keep the assistant understandable if Roundcube has no translation for the selected language or an individual value is missing or empty.

**Independent Test**: Verify an unsupported locale, a missing translation, an empty translation, and an unknown AJAX error all produce English UI text rather than blank text or a translation key.

### Tests for User Story 2

- [X] T006 [US2] Extend `tests/localization.test.js` to exercise missing and empty translations, unknown error identifiers, and language-independent default prompting in `tests/localization.test.js`

### Implementation for User Story 2

- [X] T007 [US2] Add an explicit English fallback map and fallback lookup for missing/empty Roundcube labels in `ai_assistant.js`

**Checkpoint**: Unsupported or incomplete catalogs cannot produce blank labels or untranslated identifiers.

## Phase 5: User Story 3 - Contribute another language (Priority: P2)

**Goal**: Allow contributors to add a supported language by adding translation data and following concise validation steps, without changing application behavior.

**Independent Test**: Follow the documented steps to add a temporary locale catalog, run the focused validation, and verify that no application logic change is needed.

### Implementation for User Story 3

- [X] T008 [P] [US3] Document the English source catalog, locale file naming, required keys, fallback behavior, and validation command in `README.md`

**Checkpoint**: A contributor can add or update translations using the documented catalog workflow.

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T009 Run the catalog tests and JavaScript syntax check from `specs/002-ui-localization/quickstart.md`; fix any regressions in the touched implementation and translation files
- [X] T010 [P] Add standard development artifact and secret ignore rules in `.gitignore`

## Dependencies & Execution Order

### Phase Dependencies

- Setup and Foundational phases require no code changes.
- User Story 1 is the MVP. Its tests and catalog/UI changes establish localized assistant text.
- User Story 2 depends on the localization keys and JavaScript translation lookup from User Story 1.
- User Story 3 documentation can proceed independently, but must describe the final catalog and fallback behavior.
- Polish depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Independent; delivers German and English UI selection.
- **US2 (P1)**: Depends on US1's locale keys and Roundcube lookup.
- **US3 (P2)**: Documentation depends on the catalog conventions established by US1/US2; it does not change application behavior.

### Parallel Opportunities

- T002 and T003 can run in parallel because they modify separate locale files.
- T008 can be drafted independently of code changes, then checked against the final implementation.
- No other tasks edit the same file concurrently.

## Parallel Example: User Story 1

```text
Task: T002 Add the English source catalog in localization/en_US.inc
Task: T003 Add the German catalogs in localization/de.inc, localization/de_DE.inc, and localization/de_CH.inc
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Add the locale key coverage test.
2. Add English and German catalogs.
3. Replace JavaScript literals and localize AJAX errors.
4. Verify the catalog test and exercise German and English Roundcube settings.

### Incremental Delivery

1. Complete US1 to deliver Roundcube-selected German/English UI.
2. Complete US2 to guarantee English for unsupported/incomplete translations.
3. Complete US3 to make future language contributions easy.
4. Run all validation steps in `quickstart.md`.

## Notes

- Every task uses the required checkbox, sequential ID, optional parallel marker, story label for story tasks, and exact file path.
- Tests use Node.js built-in modules only; no package manifest or external dependency is added.
