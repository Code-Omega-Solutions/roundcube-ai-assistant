# Roundcube AI Assistant Constitution

## Core Principles

### I. User control and privacy
Email content is sensitive. Document what data is sent to external services and what permissions those services have. Keep credentials server-side. Never send or modify mail automatically; any future side effect requires a specification, explicit user action, and a reviewable confirmation flow.

### II. Roundcube-native, standalone plugin
Keep the plugin independently installable in Roundcube's `plugins/ai_assistant/` directory. Do not couple plugin code to a particular Docker stack, hostname, filesystem path, or account.

### III. Requirements lead behavior
Treat the specifications in `specs/` as living product requirements. Update requirements and acceptance scenarios with behavior changes before or alongside implementation. Record unresolved product and compatibility decisions rather than presenting assumptions as guarantees.

### IV. Test and compatibility evidence
Validate changed PHP and JavaScript and add focused tests for behavior and service contracts. State the Roundcube and Open WebUI versions actually tested; do not infer broad compatibility from a single deployment.

### V. Minimal, observable integration
Use the smallest integration that meets the specification. Surface actionable errors to users without exposing credentials, email content, or internal service details in browser responses.

## Technical Constraints

- The initial provider integration is Open WebUI; other providers require a separate specification.
- API credentials are server-side environment configuration and must never be embedded in client assets.
- Open WebUI tool permissions are controlled by the deployment's API-key user. Tool access and potential side effects must be explicit in documentation and configuration.
- Releases must be pinned by consumers to a tag or immutable commit.

## Workflow and Quality Gates

- Use the checked-in Spec Kit skills for specification, planning, task generation, implementation, and consistency analysis.
- A feature is not complete until its acceptance scenarios and relevant tests pass and documentation reflects the delivered behavior.
- Keep installation and deployment configuration separate from this plugin repository.
- Do not publish a reusable release until a project license has been selected and added.

## Governance

This constitution governs implementation and review. Amend it through the Spec Kit constitution workflow when project principles change; update its version and amendment date, and update affected specifications in the same change.

**Version**: 1.0.0 | **Ratified**: 2026-11-05 | **Last Amended**: 2026-11-05
