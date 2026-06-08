---
name: db-conventions
description: Use when creating, editing, or reviewing database code under db/ (MySQL DDL, DML, views). Enforces the Requirement -> Design -> Implementation flow and the file-based schema management. Triggers on tasks like "add table", "add column", "add view", "add seed data", "modify foreign key", or any change to parking_db_ddl.sql, parking_db_dml.sql, parking_db_view.sql.
---

# Database Conventions — `parking-hackathon/db`

Entry point. Read this first, then jump to the file that matches the task.

## When to use this skill

Trigger on any of:

- Creating or editing a table, column, index, or constraint in `parking_db_ddl.sql`
- Adding or modifying seed data in `parking_db_dml.sql`
- Creating or updating views in `parking_db_view.sql`
- Adding or changing foreign keys, triggers, or stored procedures
- Adding a new migration script

Skip it for: one-line typo fixes, comment-only edits.

---

## Mandatory flow: Requirement -> Design -> Implementation

For any non-trivial change, walk through these three steps **in order**:

### 1. Requirement
- What data does the application need to store?
- Which tables are affected?
- What relationships exist between tables?
- What constraints (PK, FK, NOT NULL, DEFAULT) are needed?
- In scope / out of scope.

### 2. Design
- Which file(s) are touched? (`parking_db_ddl.sql`, `parking_db_dml.sql`, `parking_db_view.sql`)
- New table or modification of existing?
- New FK relationship? Ensure referential integrity.
- Column type: `INT`, `TEXT`, `TIMESTAMP`, `FLOAT`, etc.
- Indexes needed for query performance?
- Seed data needed for development/testing?
- Coordinate with backend team: does the service layer expect this column?

### 3. Implementation
Follow the rules in the companion files:
- See `architecture.md` for folder layout and file responsibilities.
- See `code-conventions.md` for SQL style and naming conventions.
- See `feature-workflow.md` for step-by-step to add or modify a table.
- See `commits-and-prs.md` for commit format, pre-PR checklist, and PR creation (use `gh pr create` directly).

---

## Files in this skill

| File | Purpose |
|------|---------|
| `SKILL.md` | This file — entry point, flow, when to use |
| `architecture.md` | Folder layout, file responsibilities, FK strategy |
| `code-conventions.md` | SQL style, naming, constraints, indexes |
| `feature-workflow.md` | Step-by-step to add or modify a table/view |
| `commits-and-prs.md` | Conventional Commits, pre-PR checklist, PR creation with gh |

Add new files here when a recurring concern emerges (e.g. `migrations.md`, `performance.md`) and link them from the table above.