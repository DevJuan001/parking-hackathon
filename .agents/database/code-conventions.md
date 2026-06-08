# Code Conventions

SQL style rules for MySQL. See `architecture.md` for *where* code lives; this file is *how* it is written.

## Naming conventions

- **Tables:** PascalCase, singular (`USERS`, `PLATES`, `PAYMENTS`)
- **Columns:** snake_case (`first_surname`, `vehicle_type_id`, `spot_status`)
- **Primary keys:** `id INT NOT NULL AUTO_INCREMENT`
- **Foreign keys:** `<referenced_table>_id INT NOT NULL` (e.g. `plate_id`, `user_id`)
- **Booleans:** `INT` with `0`/`1` or named status columns (e.g. `status INT NOT NULL DEFAULT 2`)
- **Status conventions (current project):**
  - `status` in `USERS`: `1=disabled, 2=enabled`
  - `spot_status` in `SPOTS`: `1=disabled, 2=available, 3=occupied`

## Column types

- **Text fields:** `TEXT NOT NULL` (no length limit needed for names, emails, plates)
- **Timestamps:** `TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
- **Numeric IDs:** `INT NOT NULL AUTO_INCREMENT`
- **Money values:** `FLOAT` (for parking rates and payments)
- **Booleans/status:** `INT NOT NULL` with a comment documenting the values

## Constraints

- Always declare `PRIMARY KEY(id)` on every table.
- Always declare `FOREIGN KEY` for relationships.
- Use `NOT NULL` when the column is mandatory.
- Use `DEFAULT` for status columns and timestamps.
- Always comment non-obvious columns: `spot_status INT NOT NULL DEFAULT 2 COMMENT '1: disabled, 2: available, 3: occupied'`

## Foreign keys

- FK column must match the referenced table's column type.
- FK column name: `<referenced_table>_id` (e.g. `user_id` -> `USERS(id)`).
- FK columns go first after `id` in the column list.

## Indexes

- Add indexes on columns used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
- Document why an index was added in a comment.

## SQL style

- One statement per line for `CREATE TABLE`, `INSERT INTO`.
- Use `IF NOT EXISTS` / `IF EXISTS` where appropriate.
- `DROP DATABASE IF EXISTS parking_db` at the top of `parking_db_ddl.sql`.
- `USE parking_db` after the CREATE DATABASE statement.
- Do not mix DDL and DML in the same file (keep them in their respective files).

## What "done" looks like for a database change

- All FK references resolve (no orphan rows).
- Seed data is consistent (no FK violations).
- Tables are in the correct order (FK references come after referenced tables).
- Status columns have comments documenting values.
- No `DROP TABLE` in a feature branch without team approval.