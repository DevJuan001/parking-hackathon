# Commits and PRs

## Conventional Commits

Format: `<type>(<scope>): <subject>`

- **Scope** is `database` for everything in this repo.
- **Subject** is imperative, lowercase, no trailing period, max ~72 chars.

Allowed types:

| Type       | When                                                   |
|------------|--------------------------------------------------------|
| `feat`     | new table, view, seed data                             |
| `fix`      | bug fix in schema or seed data                         |
| `refactor` | modify existing table, column, FK, constraint          |
| `chore`    | tooling, reorder tables, cleanup                       |
| `docs`     | documentation only                                     |

Examples:

```
feat(database): add USERS table with role_id FK
feat(database): add vehicle_type_id to PLATES and update seed data
feat(database): add vw_parking_summary view
refactor(database): add spot_status column to SPOTS table
refactor(database): normalize RATES to use vehicle_type_id FK
fix(database): resolve orphan plate_id in seed data
chore(database): reorder tables to satisfy FK declaration order
```

## Branch naming

- `feat/<name>-table` — new table or view.
- `refactor/<name>-column` — modify existing schema.
- `fix/<name>-seed` — fix seed data or constraint.

## Pre-PR checklist

### Architecture (see `architecture.md`)
- [ ] File touched is correct: DDL, DML, or view
- [ ] Tables in correct order (FK references resolved)
- [ ] Seed data FK references resolve

### Conventions (see `code-conventions.md`)
- [ ] Table names PascalCase, singular
- [ ] Column names snake_case
- [ ] PK: `id INT NOT NULL AUTO_INCREMENT`
- [ ] FK: `<table>_id INT NOT NULL`
- [ ] Status columns have comments documenting values
- [ ] `PRIMARY KEY` and `FOREIGN KEY` declared on every table

### Local verification
- [ ] `mysql -u <user> -p < db/parking_db_ddl.sql` runs without errors
- [ ] `mysql -u <user> -p < db/parking_db_dml.sql` runs without errors
- [ ] `mysql -u <user> -p < db/parking_db_view.sql` runs without errors
- [ ] Views return expected data

### Hygiene
- [ ] No production secrets in seed data
- [ ] Commits are atomic and follow Conventional Commits
- [ ] Correct labels applied to the PR (`gh pr edit <num> --add-label "<label1>,<label2>"`)

## PR template

```markdown
## Summary
<one-sentence description of what this PR does>

## Labels
<!-- Run: gh pr edit <num> --add-label "refactor,enhancement,bug,documentation,database,api,frontend" -->
- `refactor` — refactors / schema modifications
- `enhancement` — new tables or views
- `bug` — seed data or constraint fixes
- `documentation` — docs-only
- `database` — DB changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / chore
- [ ] Documentation update

## Changes

### db/parking_db_ddl.sql
<!-- New or modified tables, columns, FKs, constraints -->

### db/parking_db_dml.sql
<!-- New or modified seed data -->

### db/parking_db_view.sql
<!-- New or modified views -->

## Checklist
- [ ] Tables in correct order (FK references resolve)
- [ ] Seed data FK references resolve
- [ ] Status columns have comments
- [ ] Views return expected data
- [ ] Labels applied correctly
- [ ] No production secrets in seed data

## Notes
<!-- Breaking changes, follow-ups, coordination with backend -->
```

## Opening the PR

Create the PR directly on GitHub. Do not ask. Do not wait.

```bash
gh pr create --base main --head database --title "<title>" --body "<body>"
gh pr edit <num> --add-label "<label1>,<label2>"
```

Pick labels from: `refactor`, `enhancement`, `bug`, `documentation`, `database`, `api`, `frontend`.

## After merge

- Delete the branch locally and remotely.
- Notify feature branches that need to update their repositories.