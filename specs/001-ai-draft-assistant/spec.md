# Feature Specification: AI Draft Assistant

- **Feature Branch**: `001-ai-draft-assistant`
- **Created**: 2026-11-05
- **Status**: Baseline for the extracted implementation; productization work remains
**Input**: Extract the existing Roundcube `ai_assistant` plugin into a standalone, spec-driven repository.

## User Scenarios & Testing

### User Story 1 - Generate a reviewable draft (Priority: P1)

As a Roundcube user composing a new email or reply, I can request a draft based on my compose text and instructions, then review and edit it before using it.

**Why this priority**: Draft generation is the plugin's primary user value.

**Independent Test**: In a supported Roundcube compose view with a configured Open WebUI service, request a draft for both a blank new message and a reply, and verify that returned text is shown for review without being sent automatically.

**Acceptance Scenarios**:

1. **Given** a compose view and valid service configuration, **When** I open the assistant and request a draft, **Then** the current compose context and my instructions are sent to the configured Open WebUI service and a non-empty result appears in the draft field.
2. **Given** a new message with no quoted source, **When** I open the assistant and request a draft, **Then** it is available and can generate a new email body from my instructions.
3. **Given** a returned reply draft, **When** I choose to insert it, **Then** the draft replaces the reply text while the quoted source message is preserved.
4. **Given** the assistant has returned or inserted a draft, **When** I do not choose Roundcube's send action, **Then** the plugin does not send the email.

### User Story 2 - Understand and recover from failures (Priority: P2)

As a user, I receive a clear status when configuration, model availability, or the AI request prevents draft generation.

**Why this priority**: The plugin depends on a separately operated service and must not misrepresent failures as successful drafts.

**Independent Test**: Exercise missing configuration, unavailable model, failed HTTP response, invalid response, and empty draft cases; verify each returns a visible error and restores the generate control.

**Acceptance Scenarios**:

1. **Given** required configuration is missing, **When** I request a draft, **Then** the interface reports that the AI service is not configured and returns no draft.
2. **Given** the service request fails or returns unusable data, **When** the request completes, **Then** the interface reports a failure and does not enable insertion of an empty result.

### User Story 3 - Use the assistant in a compose workflow (Priority: P3)

As a user, I can open and close the assistant from the compose toolbar and use it with either the rich-text editor or a plain-text compose field.

**Why this priority**: The assistant should fit Roundcube's compose workflow without replacing the user's editor.

**Independent Test**: Verify the toolbar command and sidebar behavior in compose mode, then exercise insertion with TinyMCE enabled and disabled.

**Acceptance Scenarios**:

1. **Given** a compose view, **When** I activate the assistant toolbar button, **Then** its accessible sidebar opens and can be closed.
2. **Given** a rich-text or plain-text compose editor with a quoted message, **When** I insert a draft, **Then** the quote is retained and draft text is inserted as text rather than executable markup.

## Edge Cases

- Compose context exceeds 60,000 bytes or instructions exceed 4,000 bytes.
- Required Open WebUI settings are missing, malformed, or point to an unavailable service.
- The configured model is not returned by the models endpoint.
- Open WebUI returns invalid JSON, a non-success status, an empty body, or an empty draft.
- Compose page has no editor, the editor changes while a request is in flight, or the user navigates away before completion.
- Quoted text uses a format not recognized by the current quote detection patterns.
- The Open WebUI API-key user has tools beyond the model's configured tools, including tools with effects outside drafting.

## Requirements

### Functional Requirements

- **FR-001**: The plugin MUST register a compose toolbar action that opens and closes an assistant sidebar.
- **FR-002**: The user MUST be able to provide instructions and request draft text from a new-message or reply compose context.
- **FR-003**: The plugin MUST enforce the current context and instruction size limits before making a service request.
- **FR-004**: The plugin MUST send requests to the configured Open WebUI base URL and model using a server-side API key.
- **FR-005**: The plugin MUST display a successful non-empty draft separately for review before insertion.
- **FR-006**: The plugin MUST allow the user to insert the draft into rich-text or plain-text composition and preserve a detected quoted message.
- **FR-007**: Draft insertion MUST treat model output as text and MUST NOT interpret it as executable HTML.
- **FR-008**: The plugin MUST surface failures without returning a success-shaped empty draft or exposing the API key.
- **FR-009**: The plugin MUST NOT invoke Roundcube's send action.
- **FR-010**: Documentation MUST explain that compose text is sent to the configured Open WebUI service and describe tool access available to its API-key user.
- **FR-011**: The project MUST maintain tested Roundcube/Open WebUI compatibility claims and installation/configuration guidance before making a release.
- **FR-012**: The effective Open WebUI tool policy MUST be documented and deliberately configurable before a general-purpose reusable release. The extracted implementation currently sends model tool IDs plus all tools available to the API-key user; this is a known productization concern, not a read-only guarantee.

### Key Entities

- **Compose context**: Current reply text and any quoted source message provided to the model.
- **Draft request**: Compose context, user instructions, configured model, and server-side Open WebUI credentials.
- **Draft result**: Non-empty returned text held in the UI for user review and optional insertion.
- **Tool permission set**: Model-configured tool IDs combined by the current implementation with tools available to the API-key user.

## Success Criteria

### Measurable Outcomes

- **SC-001**: In the declared supported Roundcube environments, a valid request produces a reviewable non-empty draft or an explicit visible error.
- **SC-002**: No acceptance test causes the plugin to send an email automatically.
- **SC-003**: Tests verify the documented size limits, server-side credential handling, safe text insertion, and quote preservation.
- **SC-004**: Every release has installation and configuration instructions, a compatibility statement based on tests, and an explicit license.

## Assumptions and Open Decisions

- The initial supported provider is Open WebUI; provider abstraction is out of scope until separately specified.
- The initial interface is the Roundcube compose view and the plugin identifier remains `ai_assistant`.
- The existing implementation is the starting baseline, not proof of compatibility beyond its current Roundcube deployment.
- The license is unresolved. The public source repository does not yet grant a reuse license; choose and add one before announcing a reusable release.
- Tool discovery/allow-list policy must be decided before recommending the plugin for deployments whose Open WebUI API-key user has side-effecting tools.
