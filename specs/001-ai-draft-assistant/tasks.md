# Tasks: AI Draft Assistant Productization

This is the living backlog for making the extracted baseline safe and supportable for general use. Keep it aligned with [spec.md](spec.md).

## 1. Release readiness

- [ ] 1.1 Select a project license with the repository owner and add the corresponding `LICENSE`.
- [ ] 1.2 Decide and specify the effective Open WebUI tool policy; default to the least privilege needed.
- [ ] 1.3 Document supported Roundcube, PHP, and Open WebUI versions after testing.
- [ ] 1.4 Add a release checklist and pin the consuming Docker deployment to an immutable tag or commit.

## 2. Validation and tests

- [ ] 2.1 Add repeatable PHP lint and JavaScript syntax checks to CI.
- [ ] 2.2 Add focused tests for request validation, model lookup, tool selection, HTTP errors, malformed responses, and empty drafts.
- [ ] 2.3 Add browser-level tests for accessible sidebar behavior, safe insertion, and quote preservation in TinyMCE and plain-text modes.
- [ ] 2.4 Add a supported-version integration check against Roundcube and a test Open WebUI contract.
- [ ] 2.5 Verify credential redaction and ensure service failures do not expose secrets or email content.

## 3. Product contract

- [ ] 3.1 Decide whether the plugin should send all available API-key-user tools or only an explicit allow-list.
- [ ] 3.2 Specify behavior for overlapping requests, compose navigation, and editor changes while a request is running.
- [ ] 3.3 Define localization coverage and add translations for all user-visible messages.
- [ ] 3.4 Review README, quickstart, privacy guidance, and acceptance scenarios against tested behavior.
