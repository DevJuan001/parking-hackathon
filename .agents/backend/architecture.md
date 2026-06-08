# Architecture

The backend follows a **layered architecture inside feature folders**, with shared cross-cutting modules in `app/core`, `app/middlewares`, `app/tasks`, `app/templates`, and `app/utils`.

## Folder layout (rule, not a suggestion)

```
app/
├── core/            # config, database, security, redis, mail, celery_app, exception
├── middlewares/     # FastAPI dependencies (jwt, roles, ...)
├── tasks/           # Celery tasks (@shared_task)
├── templates/       # email templates
├── utils/           # reusable helpers (logger, base_schema, ...)
├── features/
│   └── <feature>/
│       ├── routes/         # APIRouter, prefix=/api/<feature>
│       ├── controllers/    # request -> service -> response
│       ├── services/       # business logic (NO SQL)
│       ├── repositories/   # the ONLY place that runs SQL
│       └── models/         # pydantic: *_schemas.py (input) | *_responses.py (output)
└── main.py          # include_router, lifespan, CORS, /ping-db, /
```

### Top-level module responsibilities

- **`app/core/config.py`** — `settings` instance from pydantic-settings, env loading, validation.
- **`app/core/database.py`** — `get_connection()` and the MySQL connection pool.
- **`app/core/security.py`** — JWT issue/decode, password hashing/verify, cookie helpers.
- **`app/core/redis.py`** — `init_redis`, `close_redis`.
- **`app/core/exception.py`** — `ServiceError` and any other domain exceptions.
- **`app/core/mail.py`** + **`app/templates/*`** — email transport and HTML bodies.
- **`app/core/celery_app.py`** — Celery app instance imported by tasks.
- **`app/middlewares/*_middleware.py`** — FastAPI `Depends`-compatible guards.
- **`app/tasks/*_tasks.py`** — Celery `@shared_task` functions.
- **`app/utils/logger.py`** — `get_logger(name)`.
- **`app/utils/base_schema.py`** — `BaseSchema` with date-string conversion.

## Layer rules (enforce strictly)

| Layer         | May import                                       | Must NOT                                  |
|---------------|--------------------------------------------------|-------------------------------------------|
| `routes`      | controllers, schemas, middlewares               | repositories, SQL, raw `mysql-connector`  |
| `controllers` | services, schemas                                | repositories, SQL                         |
| `services`    | repositories, `app.core.*`, `app.utils.*`, other services | FastAPI `Request`/`Response`, HTTP-specific code |
| `repositories`| `app.core.database`                              | services, controllers, routes             |
| `models`      | pydantic, pydantic-settings                      | business logic                            |

The data flow on a request is always:

```
route -> controller -> service -> repository -> mysql
```

Never shortcut a layer.

## Cross-feature access

- A service in `features/auth` may import a service in `features/users` (e.g. `AuthService` -> `UsersService`).
- A repository in feature A **must not** be imported by feature B. The single exception is `PlatesRepository` from `parking/repositories/`, which is a shared concern: any feature that needs to read or write PLATES (entries, exits, payments, etc.) imports it directly. Treat PLATES as a shared resource owned by the `parking` feature.
- Schemas can be shared across features when a payload crosses boundaries (e.g. `UserResponse` reused by both auth and users).

## When something does not fit a feature

- One-off CLI/script -> `app/scripts/` (create the folder if missing; add to this doc when you do).
- Cross-cutting middleware -> `app/middlewares/`.
- Background work -> `app/tasks/`.
- Shared schema/helper -> `app/utils/`.
- Shared infrastructure -> `app/core/`.