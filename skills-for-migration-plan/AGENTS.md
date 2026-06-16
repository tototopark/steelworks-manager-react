# AGENTS.md

## Role

- This is the canonical policy document for this repository.
- Read it first for planning, editing, testing, and finishing work.

## Core rules

- Plan before editing.
- Keep edits surgical.
- Update `checklist.md` and `context-notes.md` for non-trivial work.
- Test before saying done.
- Read the real error output before retrying.
- Do not touch unrelated files.
- Prefer docs-first changes when the work affects architecture, migration, or conventions.

## Project rules

- Keep code files small and focused.
- Target `300` lines or less per file when practical.
- Keep the folder structure shallow.
- Prefer at most `2` directory levels from the repository root.
- Centralize constants and environment values in config files.
- Keep backend logic independent from frontend rendering.
- Design the data layer so SQLite can migrate to MySQL later.

## Scope

- Shared rules belong here.
- Human-facing quick start lives in `README.md`.
- Meta docs live under `docs/001_meta/`.
- Design docs live under `docs/002_design/`.
- Execution notes live under `docs/003_logs/`.
