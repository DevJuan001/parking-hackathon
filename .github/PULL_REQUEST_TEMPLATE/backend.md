## Summary

<!-- Brief 1-3 sentence description of what this PR does and why -->

## Type of change

<!-- Check all that apply -->

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Refactor / chore (no functional change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Tests

## Changes

<!-- Categorize changes using the sections below. Remove empty ones. -->

### Project setup
<!-- Dependencies, pyproject/requirements, env vars, scripts, Docker -->

### Core (`app/core`)
<!-- Config, database, redis, security, mail, celery_app, exception handlers, lifespan -->

### Features (`app/features/<feature>`)
<!-- Per affected feature, list which layers were touched -->
<!--
  - `controllers/` — request/response handling
  - `routes/`      — FastAPI router definitions
  - `services/`    — business logic
  - `repositories/`— DB access
  - `models/`      — SQLAlchemy models and Pydantic schemas
-->

- **<feature>**
  - routes:
  - controllers:
  - services:
  - repositories:
  - models/schemas:

### Middlewares (`app/middlewares`)
<!-- JWT, roles, CORS, rate limiting, custom middleware -->

### Tasks / workers (`app/tasks`)
<!-- Celery tasks, background jobs, schedulers -->

### Migrations
<!-- Alembic / DB schema changes, new tables, indexes, seed data -->

### API contract
<!-- New endpoints, changed payloads, deprecations. Include sample request/response. -->

```
# Example
# POST /api/v1/auth/login
# Request: { "email": "...", "password": "..." }
# Response: { "access_token": "...", "token_type": "bearer" }
```

## How to test

<!-- Steps a reviewer can follow to validate the change locally -->

1.
2.
3.

## Checklist

- [ ] My code follows the project's style guidelines (PEP 8, type hints)
- [ ] I have performed a self-review of my code
- [ ] I have added/updated type hints and Pydantic schemas
- [ ] I have added/updated tests (unit / integration)
- [ ] New and existing tests pass locally (`pytest`)
- [ ] I have updated API documentation (OpenAPI / docstrings)
- [ ] I have updated migrations if the DB schema changed
- [ ] I have updated `.env.example` and secrets handling if config changed
- [ ] My changes generate no new warnings

## Notes

<!-- Breaking changes, follow-ups, things reviewers should know -->
