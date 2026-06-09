# Feature Workflow

Step-by-step procedure to add or modify a table, view, or seed data. Follow the **Requirement -> Design -> Implementation** flow from `SKILL.md`; this file is the operational checklist for that flow.

## 0. Pre-flight

- [ ] Confirm this is the `database` branch. All DB changes happen here; **never** modify schema from a feature branch.
- [ ] `git checkout database` and `git pull`.
- [ ] If a feature branch needs a column, open a PR to `database` first, then coordinate with the feature branch.

## 1. Requirement

- What data needs to be stored?
- Which tables are new or modified?
- What relationships exist?
- What constraints are needed?
- Is seed data needed for testing?

## 2. Design

Decide and write down:

- **File(s):** `parking_db_ddl.sql`, `parking_db_dml.sql`, `parking_db_view.sql`
- **New table:** name, columns, types, constraints, FKs, indexes
- **Modify table:** add column, change type, add FK, add index
- **New view:** name, joins, columns
- **Seed data:** rows to insert, FK references must resolve

## 3. Implementation

Use Conventional Commits (see `commits-and-prs.md`).

### Adding a new table

1. Edit `parking_db_ddl.sql`:
   - Place the table in the correct position (independent tables first, dependent tables last).
   - Add all columns with types, constraints, and comments.
   - Add FK references.
2. If seed data needed: edit `parking_db_dml.sql` with `INSERT INTO`.
3. Commit: `feat(database): add <table_name> table`

### Modifying an existing table

1. Edit `parking_db_ddl.sql`:
   - Since the script starts with `DROP DATABASE`, changes take effect on re-run.
   - If adding a column, place it in logical order with other columns.
2. If seed data changes: edit `parking_db_dml.sql`.
3. Commit: `refactor(database): add <column_name> to <table_name>`

### Adding a view

1. Edit `parking_db_view.sql`:
   - Start with `CREATE VIEW <view_name> AS`
   - List columns with `AS` aliases
   - Use `INNER JOIN` / `LEFT JOIN` correctly
   - End with the query that selects from the view
2. Commit: `feat(database): add <view_name> view`

## 4. Verify locally

```bash
mysql -u <user> -p < db/parking_db_ddl.sql
mysql -u <user> -p < db/parking_db_dml.sql
mysql -u <user> -p < db/parking_db_view.sql
```

- Run the view: `SELECT * FROM vw_parking_summary;`
- Check that FK constraints are enforced: try inserting a row with an invalid FK and confirm it fails.

## 5. Coordinate with backend

- If a new column was added, notify the feature branch so it can update the repository.
- If a table was renamed or dropped, the backend must be updated in the same PR or a follow-up PR.

## 6. Open the PR

See `commits-and-prs.md` for the template and the pre-PR checklist.