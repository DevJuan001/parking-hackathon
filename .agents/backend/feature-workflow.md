# Feature Workflow

Step-by-step procedure to add a new feature end to end. Follow the **Requirement -> Design -> Implementation** flow from `SKILL.md`; this file is the operational checklist for that flow.

## 0. Pre-flight

- [ ] Confirm no existing branch is already working on this (`git fetch` + `git branch -a`).
- [ ] Confirm the database has the tables/columns you need; if not, file/coordinate a PR to the `database` branch first.

## 1. Branch

```bash
git checkout main
git pull
git checkout -b feat/<feature>-api
```

Naming: `feat/<feature>-api` for new features, `fix/<feature>-<short-desc>` for bug fixes, `refactor/<scope>` for refactors.

## 2. Requirement

Write a short paragraph in the PR description later (you can also draft it now):

- User-facing problem (one sentence).
- Endpoint(s) involved, or "new module / no endpoint".
- In scope / out of scope.
- Inputs and outputs.
- Success and failure responses.

## 3. Design

Decide and write down:

- **Layers touched:** route / controller / service / repository / model.
- **New env vars?** Add to `app/core/config.py` and `.env.example`.
- **New tables/columns?** Coordinate with `database` branch — do not ALTER here.
- **New middleware dependency?** Add to `app/middlewares/`.
- **New email?** Template in `app/templates/` + task in `app/tasks/`.
- **RBAC:** which roles? Default to `["Admin"]` for write/admin operations. Every endpoint requires `require_roles` **except**: `POST /api/entries/create`, `POST /api/exits/create`, `POST /api/payments/create`, `GET /api/payments/calculate`, and auth public routes (login, refresh, logout, recover-password).
- **Rate limit:** `RateLimiter(times=N, seconds=60)`. Reasonable defaults: 3 for auth/recovery, 10 for sensitive writes, 30 for normal CRUD, 50 for cheap reads.

## 4. Scaffold

```bash
mkdir -p app/features/<feature>/{routes,controllers,services,repositories,models}
touch app/features/<feature>/__init__.py
touch app/features/<feature>/{routes,controllers,services,repositories,models}/__init__.py
```

## 5. Build in this order, one commit per layer

Use Conventional Commits (see `commits-and-prs.md`).

1. **Models** — `models/<feature>_schemas.py` (input) and `models/<feature>_responses.py` (output).
   - Commit: `feat(backend): add <feature> schemas and responses`
2. **Repository** — `repositories/<feature>_repository.py`. All SQL lives here.
   - Commit: `feat(backend): add <feature> repository with <list queries>`
3. **Service** — `services/<feature>_service.py`. Raises `ServiceError`; never imports FastAPI HTTP types.
   - Commit: `feat(backend): add <feature> service with <list operations>`
4. **Controller** — `controllers/<feature>_controller.py`. Calls the service, shapes the response.
   - Commit: `feat(backend): add <feature> controller`
5. **Routes** — `routes/<feature>_routes.py`. Declares the `APIRouter` with `prefix="/api/<feature>"`, rate limit, RBAC.
   - Commit: `feat(backend): add <feature> routes`
6. **Wire-up** — add `app.include_router(<feature>_routes.router)` in `app/main.py`.
   - Commit: `chore(backend): register <feature> router in main`

## 6. Verify locally

```bash
uv sync
uv run uvicorn app.main:app --reload
```

- Open `http://localhost:8000/docs` and exercise the new endpoint(s).
- Confirm `/ping-db` and `/` still respond.
- If you added an env var, restart with the new `.env`.

## 7. Cross-feature impact

- Does auth need to know about this? -> update `features/auth` in a follow-up PR.
- Does any other feature's service call this new service? -> update the caller in the same PR.
- New shared schema? -> import it from the producing feature; do not duplicate.

## 8. Open the PR

See `commits-and-prs.md` for the template and the pre-PR checklist.