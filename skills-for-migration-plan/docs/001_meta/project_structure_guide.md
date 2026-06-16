# project_structure_guide.md

## Goal

- Keep the repository understandable, shallow, and easy to migrate.
- Prefer small files and clear boundaries over deep folder nesting.

## Target structure

```text
skill4migration-1/
  AGENTS.md
  README.md
  docs/
    001_meta/
      README_INDEX.md
      checklist.md
      context-notes.md
      project_structure_guide.md
    002_design/
      2026-06-15-001-structure-migration-design.md
    003_logs/
      README.md
      2026-06-15-001-initial-structure-cleanup.md
```

## Rules

- Keep folder depth to `2` levels max.
- If a concern grows, split by file instead of adding deep folders.
- Keep shared constants in config files when code is added later.
- Keep business logic out of view files.
- Keep data access behind a small repository or gateway layer.
- Keep frontend-facing payloads stable and documented.

## Migration rule

- Write SQL and schemas so SQLite and MySQL differences stay contained in the data layer.
- Avoid relying on SQLite-only behavior in business logic.
