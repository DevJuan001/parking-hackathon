# Commits and PRs

## Conventional Commits

Format: `<type>(<scope>): <subject>`

- **Scope** is `backend` for everything in this repo.
- **Subject** is imperative, lowercase, no trailing period, max ~72 chars.

Allowed types:

| Type       | When                                                   |
|------------|--------------------------------------------------------|
| `feat`     | new user-facing functionality                          |
| `fix`      | bug fix                                                |
| `refactor` | code change that neither fixes a bug nor adds a feature|
| `chore`    | tooling, deps, config, lockfile, non-functional        |
| `docs`     | documentation only                                     |
| `test`     | adding or fixing tests                                 |
| `perf`     | performance improvement                                |

Examples:

```
feat(backend): add parking entries endpoint
feat(backend): add users repository with role and user queries
fix(backend): handle null refresh token in auth service
refactor(backend): move config to app.core.config
chore(backend): register users router in main
chore(backend): update uv.lock
docs(backend): document auth flow in README
```

## Branch naming

- `feat/<feature>-api` — new feature.
- `fix/<scope>-<short-desc>` — bug fix.
- `refactor/<scope>` — refactor.
- `chore/<scope>` — tooling / config.

Keep branches short-lived; merge to `main` when green.

## Pre-PR checklist

Run through this before opening the PR. Tick every box.

### Architecture (see `architecture.md`)
- [ ] No SQL outside `repositories/`
- [ ] Schemas split into `*_schemas.py` (input) and `*_responses.py` (output)
- [ ] Each layer only imports from layers below it

### Conventions (see `code-conventions.md`)
- [ ] Full type hints on public functions
- [ ] Services raise `ServiceError`; controllers translate to HTTP
- [ ] `except` blocks log via `logger.error("...", exc_info=True)`
- [ ] `EmailStr` used for email fields
- [ ] Rate limit on every new endpoint (`RateLimiter`)
- [ ] RBAC declared where the route is protected (`require_roles` + `verify_jwt`)
- [ ] Tokens travel in httpOnly cookies, not response bodies
- [ ] Plates normalised through `plate_formatter` before lookups
- [ ] Business-rule validation (time ranges, minimum billing, non-negative money) enforced in the service
- [ ] No `print()`, no commented-out code, no dead imports

### Wiring
- [ ] `include_router` added in `app/main.py` (if a new router was added)
- [ ] `.env.example` updated for any new env var
- [ ] New runtime deps added to `pyproject.toml` and `uv sync` run
- [ ] DB changes coordinated with the `database` branch (not ALTERed in this PR)
- [ ] Email changes include both template and Celery task

### Local verification
- [ ] `uv sync` clean
- [ ] `uv run uvicorn app.main:app --reload` starts without errors
- [ ] New endpoint(s) exercised via `/docs`
- [ ] `/ping-db` and `/` still respond

### Hygiene
- [ ] No secrets in diff
- [ ] No `TODO` left behind that blocks the feature (open an issue instead)
- [ ] Commits are atomic and follow Conventional Commits
- [ ] Correct labels applied to the PR (`gh pr edit <num> --add-label "<label1>,<label2>"`)
- [ ] New SQL targets the right canonical repository (table-per-repository rule)

## PR template

This matches `.github/PULL_REQUEST_TEMPLATE/backend.md`.

```markdown
## Summary
<one-sentence description of what this PR does and why>

## Changes
<!-- Group by relevant section. Remove empty ones. -->

### Project setup
<!-- Dependencies, pyproject.toml, uv.lock, .env.example, scripts, Docker -->

### Core (app/core)
<!-- config, database, security, redis, mail, celery, exception -->

### db/
<!-- DDL, DML, views, migrations -->

### Middlewares (app/middlewares)
<!-- JWT, roles, custom dependencies -->

### Features (app/features/<name>)
<!-- Per feature, list layers touched -->

- **<feature>**
  - routes:
  - controllers:
  - services:
  - repositories:
  - models:

### Utils (app/utils)
<!-- plate_formatter, base_schema, date_formatter, logger, helpers -->

### Tasks / templates
<!-- Celery tasks, email templates -->

### Docs / meta
<!-- PR template, skills, README, .github -->

**Style rules for PR bodies:**
- `## Summary` — 1-3 sentences. No more.
- `## Changes` — bullets only, grouped by section. Empty sections deleted.
- Do **not** include `## Labels`, `## Notes`, `## Type of change`, or `## Checklist` — they have been removed from the template and are not used in real PRs. Labels are applied via `gh pr edit <num> --add-label ...` and don't appear in the body.

**Style rules for PR bodies:**
- `## Summary` — 1-3 sentences. No more.
- `## Changes` — bullets only, grouped by section. Empty sections deleted.
- Do **not** include `## Type of change`, `## Checklist`, or `## Notes` — they have been removed from the template and are not used in real PRs.

## Opening the PR

Create the PR directly on GitHub. Do not ask. Do not wait.

```bash
gh pr create --base main --head <branch> --title "<title>" --body "<body>"
gh pr edit <num> --add-label "<label1>,<label2>"
```

Pick labels from: `refactor`, `enhancement`, `bug`, `documentation`, `database`, `api`, `frontend`.

## After merge

- Delete the branch locally and remotely.
- If the feature exposes a new shared service, call it out in the team channel so other PRs can adopt it.