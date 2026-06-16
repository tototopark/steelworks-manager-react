# Core Entrypoint Source Review

Date: 2026-06-15

## Purpose

This document records the first file-by-file source review pass over the highest-risk legacy PHP entrypoints.

The goal is to replace broad assumptions with direct evidence from the live source tree, including the `devwebsite` mirror.

## Review Method

- Read the legacy PHP file directly.
- Treat the file body, not the filename, as the source of truth.
- Compare the root file with its `devwebsite` mirror when both exist.
- Record any mismatch, coupling, or behavior-preserving concern before moving to the next family.

## Files Reviewed

- `sitepro/index.php`
- `sitepro/connect.php`
- `sitepro/register.php`
- `sitepro/disconnect.php`
- `sitepro/destroysession.php`
- `sitepro/create_update_job.php`
- `sitepro/update_jobsdetails.php`
- `sitepro/update_dateinstalljobs.php`
- `sitepro/PunchSheetAction.php`
- `sitepro/devwebsite/index.php`
- `sitepro/devwebsite/connect.php`
- `sitepro/devwebsite/register.php`
- `sitepro/devwebsite/disconnect.php`
- `sitepro/devwebsite/update_jobsdetails.php`
- `sitepro/devwebsite/update_dateinstalljobs.php`

## Findings

### `index.php`

- This is not a simple page template.
- It is a bootstrapper that loads site metadata, route mappings, shared modules, page rendering logic, language handling, comments, forms, and compatibility behavior.
- The file is heavily obfuscated and acts like a generalized shell rather than a page-specific script.

### `connect.php`

- This is the main authentication and redirect gateway.
- It validates login/password, checks admin approval, checks IP and device allowlists, updates device attempt counters, and sends users to different destination pages based on role.
- The file also includes task/reminder routing, so it is both an auth boundary and a post-login dispatch layer.

### `register.php`

- This is account creation plus avatar upload plus access gating.
- It is not only creating a user row; it also enforces image validation, login uniqueness, and IP/device-based access checks before the insert.

### `disconnect.php`

- This is a logout trampoline.
- It performs the same IP/device gate as the other entrypoints, then forwards to `Destroysession`.

### `destroysession.php`

- This file clears session state and cookies and then returns to login.
- The root version writes `$_SESSION['mydevice'] = $mydevice` after session destruction, but `$mydevice` is not initialized in this file.
- That makes the file a likely bug candidate or a leftover from a refactor, and it should be treated carefully during migration.

### `create_update_job.php`

- This file creates and updates job records.
- It writes to the main job table, job date table, job date-install table, job details table, and seeds WIP rows.
- It is a major business boundary, not a narrow form handler.

### `update_jobsdetails.php`

- This is the detailed job-progress updater.
- It synchronizes checkbox states, date fields, status transitions, email notifications, WIP completion, cancellation handling, and job-date records.
- It is one of the densest legacy business scripts in the tree.

### `update_dateinstalljobs.php`

- This updates `date_install` and notifies operations/workshop.
- It is a targeted workflow handler but still coupled to job/date-install joins and email notifications.

### `PunchSheetAction.php`

- This handles punch clock and job timing actions.
- It inserts punchsheet rows, propagates job finish/made status, and updates install-status state.
- It is a separate workflow family from the jobsheet scripts even though the data overlaps.

### `devwebsite` mirrors

- The `devwebsite` copies are mostly the same workflows with `-Dev` redirects and dev database credentials.
- They should be treated as mirror variants until equivalence is explicitly proven file by file.
- The mirror layer is not just cosmetic; it confirms that the same behavior exists in a parallel surface.

## Migration Implication

- The first file-by-file review confirms that the real boundaries are auth/session, jobsheet CRUD, install-date maintenance, and punchsheet actions.
- The next review wave should walk the numbered families in order, starting with the high-fanout roots and their `devwebsite` mirrors.
- The `destroysession.php` session handoff issue should be tracked as a compatibility risk during later refactor work.

