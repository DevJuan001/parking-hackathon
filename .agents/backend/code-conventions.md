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

- `app/core/exception.py` defines a single domain exception:
  ```python
  class ServiceError(Exception):
      def __init__(self, message: str):
          self.message = message
  ```
  Keep it minimal — just `message`. Do **not** add a `code` field, status enums, or helper functions around it. The mapping from message to HTTP status lives in the controller, period.
- Services **raise** `ServiceError("Mensaje en español")` and return tuples shaped `(error, ...)` from a `try/except ServiceError as e: return e.message, ...` block.
- Controllers **never** catch `ServiceError` — they only inspect the returned message. When `error` is truthy, the controller maps it to HTTP with a plain `if` and a literal string match, then raises `HTTPException`:
  ```python
  error, success, message = Service.method(...)
  if error:
      if error == "Contraseña incorrecta":
          raise HTTPException(status_code=401, detail=error)
      raise HTTPException(status_code=404, detail=error)
  ```
  No helper functions, no dicts of codes, no extra parameters on the service. Just a literal-string `if` in the controller.
- Services and repositories **must never** raise `HTTPException`. Helpers in `app/core/security.py` (e.g. `verify_password`) return `bool`, not raise — the call site decides what to do with `False`.
- Repositories raise low-level SQL errors; services wrap them into `ServiceError` with a domain-friendly message.
- Never let a raw `mysql.connector.Error` escape a repository without a comment explaining why.

### Error messages must be explanatory

`ServiceError` messages are user-facing — the controller returns them verbatim as `HTTPException.detail`. They must always tell the caller **what happened** and **what to do next**. Bad: `"Error"`, `"No se puede eliminar"`, `"Tarifa no encontrada"`. Good: `"La plaza esta ocupada, desocupala primero e intentalo nuevamente"`.

Rules:

- **State the problem** in the first clause. Avoid generic verbs like "error" / "fallo" without an object.
- **State the resolution** when there is one: "intentalo nuevamente", "verifica el id e intentalo nuevamente", "registra su salida y vuelve a intentarlo".
- **Include the count when relevant** so the caller can act without another round trip: `f"hay {n} vehiculo(s) del mismo tipo dentro del parking"`.
- **Spanish, imperative / indicative, no trailing period** — same style as the rest of the messages in the codebase.
- Never expose internal field names, SQL fragments, or stack traces in the message.

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
- Protected endpoints add `Depends(require_roles([...]))` — `require_roles` already includes `verify_jwt` internally. **Do not** add `Depends(verify_jwt)` separately.
- When searching by a field (e.g. plate name), use `GET` with a **path parameter**: `@router.get("/plates/find/{plate}")`. Do **not** use `Query()` or `POST` for searches.

## Auth, RBAC, rate limit

- **Every endpoint** must declare `Depends(RateLimiter(times=N, seconds=60))`.
- **Every endpoint** must add `Depends(require_roles([...]))` **except** the following public operations:
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
  - `POST /api/auth/recover-password`
  - `POST /api/entries/create` (vehicle entry — open to all)
  - `POST /api/exits/create` (vehicle exit — open to all)
  - `POST /api/payments/create` (payment — open to all)
  - `GET /api/payments/calculate` (tariff calculation — open to all)
- `require_roles` already includes `verify_jwt` internally. **Do not** add `Depends(verify_jwt)` separately.
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

## Utilities (app/utils/)

Reusable helpers live in `app/utils/` and are imported by services and controllers. They must NOT do any I/O, raise HTTP errors, or know about FastAPI.

- **`app/utils/logger.py`** — `get_logger(name)`. Use this everywhere; never `print()`.
- **`app/utils/date_formatter.py`** — converts DB datetimes to display strings.
- **`app/utils/plate_formatter.py`** — normalizes a plate string (strip whitespace, remove dashes, uppercase). Every service that does plate lookups MUST call this first to avoid duplicate lookups for `ABC-123` vs `ABC123`.
- **`app/utils/round_to_50.py`** — `round_up_to_next_50(value)`. Rounds a monetary value up to the next multiple of 50; returns 0 for non-positive inputs. Used in payment flows to enforce the "bills always end in .00 or .50, and a positive total charges at least 50" rule.
- **`app/utils/base_schema.py`** — `BaseSchema` with date-string conversion for pydantic models.

## `app/core/security.py` rules

- Pure functions only. `verify_password(hashed, plain) -> bool`, never `-> None` raising `HTTPException`. The HTTP mapping is the controller's job, not core's.
- `create_access_token`, `create_refresh_token`, `set_auth_cookies`, `generate_temporal_password` follow the same rule: return values, do not raise `HTTPException`.

## Validation invariants

Services are responsible for business-rule validation. A few that recur:

- **Time ranges**: when computing `diff = exit_time - entry_time`, validate `exit_time > entry_time` and raise `ServiceError` with a domain message. Negative or zero deltas must never produce a payment.
- **Minimum billing**: parking charges a minimum of 1 hour. After computing `hours_parked = round(diff.total_seconds() / 3600, 2)`, clamp with `max(hours_parked, 1.0)` so the customer is never billed less than the rate for one hour.
- **Negative monetary values**: before persisting, assert `value >= 0` and raise `ServiceError` if not. This is a safety net for unexpected arithmetic; the previous checks should already prevent it.
- **Round up to next 50**: after computing the raw total (`hours_parked * rate`), apply `round_up_to_next_50(total_raw)`. A positive total must always end in `.00` or `.50`, and the minimum charge for any positive total is 50. The helper handles 0 correctly by returning 0. Apply in both `calculate_payment` (for the response preview) and `create_payment` (for the persisted value).

## What "done" looks like for a code change

- Type hints complete.
- Errors raised as `ServiceError`, logged with `exc_info=True`.
- Schema split between input (`*_schemas.py`) and output (`*_responses.py`).
- Rate limit and RBAC declared on the route.
- No SQL outside `repositories/`.
- No `print`, no commented-out code, no dead imports.