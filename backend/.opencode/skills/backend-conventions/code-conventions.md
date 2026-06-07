# Code Conventions

Style rules for Python 3.13 + FastAPI + MySQL backend code. See `architecture.md` for *where* code lives; this file is *how* it is written.

## Language and typing

- **Python 3.13** (pinned in `.python-version`).
- Full type hints on every public function and method.
- Prefer `Optional[T]` over `T | None` only when matching existing file style; both are accepted.
- `EmailStr` for any email field (`from pydantic import EmailStr`).

## Async

- `async def` in `routes` and `controllers`.
- Services and repositories can stay sync unless they call async I/O (e.g. `httpx.AsyncClient`, async DB driver). Today the DB layer is sync (`mysql-connector`), so most services/repos are sync.
- If a service is async, every caller above it must `await` it.

## Errors

- Services **raise** `ServiceError(message)` (from `app.core.exception`).
- Controllers **catch** `ServiceError` and translate to HTTP responses.
- Repositories raise low-level SQL errors; services wrap them into `ServiceError` with a domain-friendly message.
- Never let a raw `mysql.connector.Error` escape a repository without a comment explaining why.

## Logging

```python
from app.utils.logger import get_logger
logger = get_logger("<module.path>")  # e.g. "auth.service", "users.repository"
```

- Use `logger.error("msg: %s", value, exc_info=True)` inside `except`. Do **not** f-string the log message.
- Never `print()` in production code.

## Schemas and models

- Two files per feature inside `app/features/<feature>/models/`:
  - `<feature>_schemas.py` — request bodies / query params (input).
  - `<feature>_responses.py` — response payloads (output).
- Inherit from `app.utils.base_schema.BaseSchema` when the model contains date/datetime fields.
- Response models expose only the fields the API consumer needs; never leak `password`, internal flags, or DB column names that should be private.

## Routes

```python
router = APIRouter(
    prefix="/api/<feature>",
    tags=["<Feature>"],
)
```

- No trailing slash on individual path strings (`"/me"`, not `"me/"`).
- Path params in `{snake_case}` (FastAPI converts to kwarg of the same name).
- Every endpoint declares `Depends(RateLimiter(times=N, seconds=60))`.
- Protected endpoints add `Depends(require_roles([...]))` and `Depends(verify_jwt)`.

## Auth, RBAC, rate limit

- Public routes: only rate limit.
- Authenticated routes: rate limit + `verify_jwt`.
- Role-restricted routes: rate limit + `verify_jwt` + `require_roles([...])`.
- Token storage: httpOnly cookies (`access_token`, `refresh_token`); never return tokens in response bodies.
- Cookies are set/cleared through helpers in `app.core.security`.

## Env vars and secrets

- Read via `settings` from `app.core.config`; never `os.getenv` directly inside features.
- Any new env var must be added to `.env.example` with a placeholder and a comment.
- Never commit real secrets; `.env` is gitignored.
- New secret fields must be declared on `Settings` with no default, so missing values fail fast at startup.

## Database

- SQL lives only in `repositories/`. Use parameterised queries — never format strings into SQL.
- `mysql-connector` connection management goes through `app.core.database`; do not create ad-hoc `connect()` calls.
- Schema changes happen in the `database` branch (`db/parking_db_ddl.sql`); do not ALTER in feature branches.

## Email

- Templates are HTML files in `app/templates/`, rendered with plain string formatting or Jinja.
- Delivery is a Celery task in `app/tasks/`; routes/services must `task.delay(...)`, never call mail directly.

## Dependencies

- Add new runtime deps to `pyproject.toml` under `dependencies = [...]`, then `uv sync` to refresh `uv.lock`.
- Pin exact versions for security-sensitive packages (`pyjwt`, `bcrypt`); float others with `>=`.

## What "done" looks like for a code change

- Type hints complete.
- Errors raised as `ServiceError`, logged with `exc_info=True`.
- Schema split between input (`*_schemas.py`) and output (`*_responses.py`).
- Rate limit and RBAC declared on the route.
- No SQL outside `repositories/`.
- No `print`, no commented-out code, no dead imports.
