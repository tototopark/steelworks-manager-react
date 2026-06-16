# context-notes.md

## Working decisions

- The current workspace is a legacy PHP application with many flat root-level scripts.
- New work should move toward a cleaner modular backend without breaking the current app too early.
- The preferred direction is backend-first, then frontend.
- Configuration should be centralized.
- SQLite is the default development database, with a later MySQL migration path.
- The project should stay shallow: no more than `2` folder levels from the root when practical.
- The codebase should avoid oversized files and split responsibilities early.
- The first migration phase is a hybrid structure cleanup that preserves legacy behavior while extracting shared boundaries.
- The migration process must follow a quality gate: inventory first, then 1:1 mapping, then edge-case preservation, then regression verification.
- The repository is a portfolio record of the migration process, not a standalone rewrite target.
- The first inventory groups the legacy site into authentication, jobs/workflow, whiteboard/activity, WIP, admin/account, tasks, reminders, and punch clock families.
- The first Gate 1 mapping keeps authentication, account creation, logout, and job-update flows wrapper-friendly until the target boundaries are proven.
- The first backend boundary is authentication and access control, including login, redirects, IP/device checks, and menu selection.
- The first SQLite schema centers on `users`, `user_ip_allowlist`, `trusted_devices`, and optional `sessions`.
- The first API contract models the authenticated shell with session, navigation, page, redirect, and warnings fields.
- The core wrapper list includes login, registration, logout, job updates, and punch/WIP entrypoints.
- The first smoke test is a structural repo check that validates required docs and confirms the checklist is fully closed.
- The detailed family index counts 440 PHP files across root, devwebsite, and support directories.
- Gate 1 now has a file-level expansion for the largest root families, plus provisional wrapper and mirror labels for the rest.
- Design docs and logs are now numbered to align one-to-one across the same work sequence.
- The first file-by-file source review confirmed that auth/session, jobsheet CRUD, install-date updates, and punchsheet actions are the true high-risk boundaries.
- `destroysession.php` has a suspicious undefined `$mydevice` handoff after session teardown and should be treated as a compatibility risk.

## Documentation rule

- Any meaningful architecture, DB, or workflow decision should be written here and in the checklist.
