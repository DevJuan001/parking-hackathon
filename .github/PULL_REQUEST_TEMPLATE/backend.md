## Summary

<!-- Brief 1-3 sentence description of what this PR does and why -->

## Labels

<!-- Add matching labels via `gh pr edit <num> --add-label "<label1>,<label2>"` -->

- `refactor` — refactors / non-functional changes
- `enhancement` — new features
- `bug` — bug fixes
- `documentation` — docs-only
- `database` — DB schema or seed changes
- `api` — backend API changes
- `frontend` — frontend changes

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / chore
- [ ] Documentation update

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

### Tasks / templates
<!-- Celery tasks, email templates -->

### Docs / meta
<!-- PR template, skills, README, .github -->

## Checklist

- [ ] Code follows project conventions (type hints, ServiceError, logger)
- [ ] Rate limit + RBAC declared on new endpoints
- [ ] Schema split: `*_schemas.py` (input) / `*_responses.py` (output)
- [ ] DB changes coordinated with `database` branch if needed
- [ ] `.env.example` updated for new env vars
- [ ] `uv sync` clean, app boots without errors
- [ ] No secrets, no `print()`, no commented-out code

## Notes

<!-- Breaking changes, follow-ups, things reviewers should know -->
