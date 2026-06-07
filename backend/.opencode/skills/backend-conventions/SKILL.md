---
name: backend-conventions
description: Use when creating, editing, or reviewing backend code under backend/app/ (FastAPI + MySQL). Enforces the layered architecture, feature-folder layout, and the Requirement -> Design -> Implementation flow. Triggers on tasks like "add endpoint", "create feature", "new route", "new service", "new repository", or any change to routes, controllers, services, repositories, models, middlewares, tasks, or core.
---

# Backend Conventions — `parking-hackathon/backend`

Entry point for everything in this skill. Read this first, then jump to the file that matches the task.

## When to use this skill

Trigger on any of:

- Creating or editing a route, controller, service, repository, or model
- Adding middleware, task, template, or `app/core/*` module
- Changing `app/main.py` (routers, CORS, lifespan, middlewares)
- Adding env vars, DB columns, or new dependencies to `pyproject.toml`
- Reviewing or restructuring backend code

Skip it for: doc-only edits, `pyproject.toml` version bumps, lockfile churn, one-line typos.

---

## Mandatory flow: Requirement -> Design -> Implementation

For any non-trivial change, walk through these three steps **in order**. Do not start coding until the first two are written down.

### 1. Requirement
Capture the problem before the solution. Answer:
- What is the user-facing problem? (one sentence)
- Which endpoint(s) or module(s)?
- In scope / out of scope.
- Inputs (auth, body, query) and outputs (status, payload).
- Success and failure responses.

### 2. Design
Decide where the change lives. Answer:
- Which layers are touched? (route / controller / service / repository / model)
- New tables or columns -> coordinate with the `database` branch.
- New env vars -> add to `app/core/config.py` and `.env.example`.
- New middleware dependency -> add to `app/middlewares/`.
- New email -> template in `app/templates/` + task in `app/tasks/`.
- New role -> update seed in `db/parking_db_dml.sql` (separate PR).
- RBAC: which roles? (`require_roles([...])`)
- Rate limit: `RateLimiter(times=N, seconds=60)`.
- Backwards compatibility: any breaking change to payloads or cookies?

### 3. Implementation
Follow the rules in the companion files:
- See `architecture.md` for folder layout and layer boundaries.
- See `code-conventions.md` for Python/FastAPI style.
- See `feature-workflow.md` for the step-by-step to add a new feature.
- See `commits-and-prs.md` for commit format, pre-PR checklist, and PR template.

---

## Files in this skill

| File | Purpose |
|------|---------|
| `SKILL.md` | This file — entry point, flow, when to use |
| `architecture.md` | Folder layout, layer rules, dependency direction |
| `code-conventions.md` | Python typing, async, errors, logging, schemas, RBAC, rate limit, env vars |
| `feature-workflow.md` | Step-by-step procedure to add a new feature end to end |
| `commits-and-prs.md` | Conventional Commits, pre-PR checklist, PR template |

Add new files here when a recurring concern emerges (e.g. `testing.md`, `emails.md`, `db-coordination.md`) and link them from the table above.
