---
name: testing-conventions
description: Use when creating, editing, or reviewing automated tests under testing/ (Serenity BDD + Cucumber + Screenplay Pattern). Enforces the 8-layer architecture, Spanish Gherkin, the Requirement -> Design -> Implementation flow, and the testing pattern conventions. Triggers on tasks like "add feature test", "create runner", "add step definition", "new task/question/pageobject", or any change to feature files, runners, steps definitions, tasks, questions, userinterfaces, models, hooks, or build config.
---

# Testing Conventions — `parking-hackathon/testing`

Entry point. Read this first, then jump to the file that matches the task.

## When to use this skill

Trigger on any of:

- Creating or editing a Gherkin feature file in `src/test/resources/features/`
- Creating or editing a test runner in `src/test/java/co/com/test/runners/`
- Creating or editing step definitions in `src/test/java/co/com/test/stepsdefinitions/`
- Creating or editing a Screenplay Task, Question, PageObject, or Model in `src/main/java/co/com/test/`
- Creating or editing Cucumber hooks in `src/main/java/co/com/test/utils/hooks/`
- Modifying `build.gradle`, `serenity.properties`, or `settings.gradle`
- Adding a new feature end to end (feature file → runner → steps → tasks → questions → pageobjects)
- Running tests, reviewing test reports, or troubleshooting test failures

Skip it for: one-line typo fixes, comment-only edits, lockfile churn.

---

## Mandatory flow: Requirement -> Design -> Implementation

For any non-trivial change, walk through these three steps **in order**:

### 1. Requirement
- What user-facing functionality is being tested?
- Which screen/page of the application does it cover?
- What is the happy path? What are edge cases / failure scenarios?
- In scope / out of scope (e.g. only UI tests, no API-only tests unless specified).
- Gherkin scenario outline: Given / When / Then structure.
- Test data needed (static, data tables, or external sources).

### 2. Design
- Which layers are touched? (feature file / runner / steps / tasks / questions / pageobjects / models / hooks)
- Which **feature file(s)** — one `.feature` per feature, named in lowercase with underscores.
- Which **existing pageobject(s)** need new locators, or does a new pageobject need creation?
- New model class? Match fields to feature file data table columns.
- New hook? Only if shared setup/teardown is needed across scenarios.
- Reporting: Serenity screenshots (captured automatically via `serenity.take.screenshots`).
- Test data: hardcoded in feature tables, or externalised via models?

### 3. Implementation
Follow the rules in the companion files:
- See `architecture.md` for the 8-layer structure, data flow, and layer responsibilities.
- See `code-conventions.md` for Screenplay patterns, naming, locators, assertions, and best practices.
- See `feature-workflow.md` for step-by-step to add a new feature test end to end.
- See `commits-and-prs.md` for commit format, pre-PR checklist, and PR creation (use `gh pr create` directly).

---

## Files in this skill

| File | Purpose |
|------|---------|
| `SKILL.md` | This file — entry point, flow, when to use |
| `architecture.md` | 8-layer folder layout, data flow, layer responsibilities, project configuration |
| `code-conventions.md` | Screenplay patterns, naming, locators, assertions, error handling, best practices |
| `feature-workflow.md` | Step-by-step to add a new feature test (feature file → runner → steps → tasks → questions → pageobjects) |
| `commits-and-prs.md` | Conventional Commits, pre-PR checklist, PR creation with gh |

Add new files here when a recurring concern emerges (e.g. `data-driven.md`, `api-testing.md`, `debugging.md`) and link them from the table above.
