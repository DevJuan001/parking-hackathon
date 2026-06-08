# Architecture

Database files live in `db/`. All schema changes happen here; no ALTER statements in feature branches.

## File responsibilities

| File | Purpose | Contains |
|------|---------|----------|
| `parking_db_ddl.sql` | Schema definition | `CREATE DATABASE`, `CREATE TABLE`, `ALTER TABLE`, `DROP` |
| `parking_db_dml.sql` | Seed / test data | `INSERT INTO` statements |
| `parking_db_view.sql` | Views | `CREATE VIEW` and `SELECT` queries |

## Schema strategy

### Tables in `parking_db_ddl.sql`

Tables are declared in this order so FK references resolve correctly:

1. Independent tables (no FKs): `ROLES`
2. Tables with FKs to independent tables: `USERS` (FK to `ROLES`), `VEHICLE_TYPES`
3. Tables with FKs to tables above: `PLATES` (FK to `VEHICLE_TYPES`), `SPOTS`
4. Dependent tables: `ENTRIES` (FK to `PLATES`, `SPOTS`), `EXITS` (FK to `PLATES`), `RATES` (FK to `VEHICLE_TYPES`), `PAYMENTS` (FK to `PLATES`, `SPOTS`)

The script starts with `DROP DATABASE IF EXISTS parking_db` — running it wipes any existing data.

### Seed data in `parking_db_dml.sql`

- Seed data supports development and testing.
- Do not include production-real passwords in plain text.
- All FK references must resolve; run `SET FOREIGN_KEY_CHECKS=0` only if absolutely necessary (and document why).

### Views in `parking_db_view.sql`

- Views are for read-only reporting, not production queries.
- Keep views simple; complex logic belongs in the service layer.

## When to touch the database

- **New table or column:** add to `parking_db_ddl.sql`.
- **New seed data:** add to `parking_db_dml.sql`.
- **New view:** add to `parking_db_view.sql`.
- **Modify existing table:** edit `parking_db_ddl.sql` (drop and recreate the table if needed).
- **Never ALTER a table from a feature branch.** All schema changes go through the `database` branch.

## Coordination with backend

- When a feature branch needs a new column, open a PR to the `database` branch first.
- Backend `repositories/` must match the schema here. If a column is added here, the backend repository must be updated in the same PR or a follow-up PR.
- If a feature needs a new table, coordinate with the feature's service layer before writing the DDL.