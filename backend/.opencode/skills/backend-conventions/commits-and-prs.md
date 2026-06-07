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

## PR template

```markdown
## Requirement
<one-sentence user-facing problem>

## Design
- Layers touched: <route / controller / service / repository / model>
- New env vars: <list or "none">
- New tables/columns: <list or "none">
- RBAC: <roles or "public">
- Rate limit: <N / 60s>
- Backwards compatibility: <breaking / non-breaking>

## Implementation
- <bullet per commit, mirroring git log>
- Endpoint(s) added: `METHOD /api/...`
- Response shape: <link to pydantic model or inline>

## Checklist
- [ ] pre-PR checklist above completed
```

## After merge

- Delete the branch locally and remotely.
- If the feature exposes a new shared service, call it out in the team channel so other PRs can adopt it.
