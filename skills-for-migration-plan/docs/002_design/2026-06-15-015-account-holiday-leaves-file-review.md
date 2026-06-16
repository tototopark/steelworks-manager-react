# Account, Holiday, and Leave File Review

Date: 2026-06-15

## Purpose

This document records the next Gate 1 file-level review wave for the account and leave-management surfaces.

The goal is to replace the remaining broad provisional labels with behavior-specific file assignments.

## Review Method

- Read the root legacy PHP file directly.
- Treat the body of the file as the real contract.
- Use `devwebsite` mirrors only where they exist in the current tree.
- Record whether each page is a view, a write action, or a reporting boundary.

## Files Reviewed

- `sitepro/20.php`
- `sitepro/39.php`
- `sitepro/42.php`
- `sitepro/43.php`
- `sitepro/45.php`

## Findings

### `20.php`

- This is the `MyAccount` surface.
- It is a multi-section reminder/admin page for vehicles, site safety / first aid, and other reminder categories.
- Each section submits to its own `update_reminder_*` handler, so the page is a compound account/admin boundary rather than a single-purpose form.

### `39.php`

- This is the `Update_jobsheet`-style tick-all action page.
- It updates `tb_jobs_details` one lot and status column at a time, and it also updates `tb_jobs_date_install`.
- It is a write-side workflow boundary and should stay separate from the jobsheet view itself.

### `42.php`

- This is the workload plan view.
- It renders leave-aware staff planning and consumes `tb_leaves` for private-leave blocking.
- The page is a read/report boundary for scheduling, not a simple account page.

### `43.php`

- This is the annual leave and public holiday management surface.
- It shows leave calendars, public holiday calendars, edit forms, create/delete actions, and historical leave views.
- It is a dense admin workflow page and should be mapped as a dedicated leave-management boundary.

### `45.php`

- This is the annual leave update action.
- It loops through `tb_leaves`, reads per-row form fields, ignores expired rows, and writes active leave edits back to the database.
- It is a write action that belongs beside `43.php`, not a standalone report page.

### Mirror note

- I did not find `devwebsite` counterparts for these files in the current tree scan.
- That means the current Gate 1 map should keep them as root-only boundaries until an actual mirror is discovered.

## Migration Implication

- `20.php` is account/reminder administration.
- `39.php` is a direct jobsheet tick/update action.
- `42.php` is workload planning with leave-aware availability checks.
- `43.php` is the leave/public-holiday admin console.
- `45.php` is the leave update action that persists edited rows.
- These pages should not be collapsed into a single general "misc" bucket.

