---
name: frontend-conventions
description: Use when creating, editing, or reviewing frontend code under frontend/ (React + Vite + JavaScript). Enforces the module-first layout, Requirement -> Design -> Implementation flow, and the UI kit conventions. Triggers on tasks like "add page", "create component", "add hook", "new API service", or any change to src/modules/, src/globals/, or src/services/.
---

# Frontend Conventions — `parking-hackathon/frontend`

Entry point. Read this first, then jump to the file that matches the task.

## When to use this skill

Trigger on any of:

- Creating or editing a page, component, hook, service, or route in `src/modules/`
- Adding or modifying shared UI components in `src/globals/components/ui/`
- Adding API calls or services in `src/modules/<name>/services/`
- Changing routing structure, auth flow, or global styles
- Adding dependencies to `package.json`

Skip it for: one-line typo fixes, comment-only edits, lockfile churn.

---

## Mandatory flow: Requirement -> Design -> Implementation

For any non-trivial change, walk through these three steps **in order**:

### 1. Requirement
- What does the user need to see/do on this screen?
- Which API endpoints are consumed?
- What is the expected state (loading, error, success)?
- In scope / out of scope.

### 2. Design
- Which module(s) are affected?
- Does it need a new module or fit in an existing one?
- New shared component? -> goes in `src/globals/components/ui/`
- New API call? -> goes in `src/modules/<name>/services/`
- Auth or global state change? -> coordinate with `src/modules/login/`
- Design system: use existing UI kit components before building custom ones.

### 3. Implementation
Follow the rules in the companion files:
- See `architecture.md` for folder layout and responsibilities.
- See `code-conventions.md` for React/Vite style (no TypeScript, hooks, state, API calls).
- See `feature-workflow.md` for step-by-step to add a new page or component.
- See `commits-and-prs.md` for commit format, pre-PR checklist, and PR creation (use `gh pr create` directly).

---

## Files in this skill

| File | Purpose |
|------|---------|
| `SKILL.md` | This file — entry point, flow, when to use |
| `architecture.md` | Folder layout, module structure, UI kit conventions |
| `code-conventions.md` | React, hooks, state, API calls, no TypeScript |
| `feature-workflow.md` | Step-by-step to add a page or component end to end |
| `commits-and-prs.md` | Conventional Commits, pre-PR checklist, PR creation with gh |

Add new files here when a recurring concern emerges (e.g. `testing.md`, `auth-flow.md`, `routing.md`) and link them from the table above.