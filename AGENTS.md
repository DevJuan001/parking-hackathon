# parking-hackathon — Conventions

Universal rules for any AI working in this repository. Read this before touching any code.

---

## Skills directory

All conventions live in `.agents/`. Load the relevant skill for your task:

- **Backend (Python/FastAPI):** `.agents/backend/SKILL.md`
- **Frontend (React/Vite/JS):** `.agents/frontend/SKILL.md`
- **Database (MySQL):** `.agents/database/SKILL.md`
- **Testing (Serenity/Cucumber/Screenplay):** `.agents/testing/SKILL.md`

---

## Workflow: Requirement → Design → Implementation

For any non-trivial change, walk through these three steps **in order** before coding. They are the thinking framework; the actual PR body is written from them.

1. **Requirement** — What problem does this solve? Which endpoints/modules? In/out scope? Success and failure responses?
2. **Design** — Which layers are touched? New env vars? DB changes? RBAC? Rate limits?
3. **Implementation** — Follow the rules in the relevant skill.

---

## Backend (backend/)

See `.agents/backend/` for the full skill. Key rules:

- **Architecture:** `routes → controller → service → repository → mysql`. Never shortcut a layer.
- **Schemas:** `*_schemas.py` (input) / `*_responses.py` (output)
- **Errors:** `raise ServiceError` in services; controller translates to HTTP
- **Rate limit:** `RateLimiter(times=N, seconds=60)` on every endpoint
- **RBAC:** `require_roles([...])` + `verify_jwt` on protected routes
- **Tokens:** httpOnly cookies only, never in response bodies
- **Env vars:** via `settings` from `app.core.config`, never `os.getenv`

## Database (db/)

See `.agents/database/` for the full skill. Key rules:

- **Schema changes only in the `database` branch.** Never ALTER tables in feature branches.
- **DDL:** `db/parking_db_ddl.sql` — tables, constraints, FKs
- **DML/seed:** `db/parking_db_dml.sql` — INSERT INTO statements
- **Views:** `db/parking_db_view.sql` — CREATE VIEW
- **Coordinate** with the team before touching the schema.

## Frontend (frontend/)

See `.agents/frontend/` for the full skill. Key rules:

- **React + Vite + JavaScript** (no TypeScript)
- **Structure:** `src/modules/<name>/` (components, hooks, services, routes)
- **Shared UI:** `src/globals/components/ui/` — use existing components before building custom ones
- **API calls:** services in `src/modules/<name>/services/`
- **Auth:** handled by `src/modules/login/`; tokens in httpOnly cookies

---

## Opening PRs

**Create directly on GitHub. Do not ask. Do not wait.**

The PR **body** must follow the template defined in the relevant skill. Do not freeform it.

- Frontend work → `.agents/frontend/commits-and-prs.md` (## Summary, ## Labels, ## Changes grouped by Pages / Components / Services & hooks / Routing / Styles)
- Backend work → `.agents/backend/commits-and-prs.md`
- Database work → `.agents/database/commits-and-prs.md`
- Testing work → `.agents/testing/commits-and-prs.md`

```bash
gh pr create --base main --head <branch> --title "<title>" --body "<body>"
gh pr edit <num> --add-label "<label1>,<label2>"
```

**Labels:** `refactor`, `enhancement`, `bug`, `documentation`, `database`, `api`, `frontend`

---

## General

- One feature per branch, short-lived.
- Delete branches after merge.
- No secrets, no hardcoded URLs, no `console.log`, no commented-out code.
- Never touch git stashes. Do not run `git stash`, `git stash pop`, `git stash apply`, `git stash drop`, or `git stash clear`. If uncommitted work blocks a branch switch, ask the user how to handle it.
- If unsure, ask before acting.