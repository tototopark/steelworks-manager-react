# Numeric Family File Review

Date: 2026-06-15

## Purpose

This document records the next file-by-file review wave after the core entrypoints pass.

The goal is to tighten Gate 1 from family-level guesses into file-level mapping for the numeric legacy pages that clearly carry business behavior.

## Review Method

- Read the root legacy PHP file directly.
- Compare `devwebsite` mirrors when they exist in the current tree.
- Treat each page as its own boundary until evidence shows it is only a wrapper.
- Record whether the page is a user-facing dashboard, a data-entry boundary, or a support view.

## Files Reviewed

- `sitepro/7.php`
- `sitepro/9.php`
- `sitepro/10.php`
- `sitepro/11.php`
- `sitepro/12.php`
- `sitepro/15.php`
- `sitepro/16.php`
- `sitepro/17.php`
- `sitepro/19.php`
- `sitepro/devwebsite/7.php`
- `sitepro/devwebsite/9.php`
- `sitepro/devwebsite/10.php`
- `sitepro/devwebsite/11.php`

## Findings

### `7.php`

- This is the jobsheet surface.
- It is a large combined boundary that handles session/device gating, job lookup, job progress rendering, page navigation, install-date updates, WIP signals, and jobsheet edit entrypoints.
- It posts into `Update_jobs_details` and routes to other jobsheet-specific actions.

### `9.php`

- This is the punch clock surface.
- It mixes clock-in/out actions, pause/resume behavior, punchsheet edits, and job-detail transitions.
- It is not a thin timecard stub; it is a workflow boundary that also reaches into job state.

### `10.php`

- This is the punch user selection view.
- It exposes the year/week selection surface and routes users into `PunchClock`.
- It is a control page for choosing which employee and time window to inspect.

### `11.php`

- This is the edit-user surface.
- It renders user administration controls, role selection, reset/delete actions, and save submission.
- It is a true admin boundary, not just a display page.

### `12.php`

- This is an upload-driven update-user action.
- It iterates through `tb_login`, reads per-user upload fields, validates image uploads, and writes uploaded avatars by login name.
- This file should be treated as a boundary action, not a passive page.

### `15.php`

- This is an analytics/history view over jobs and punchsheet data.
- It exposes year filtering and scans completed jobs and job-hours data.
- The page acts like a reporting dashboard rather than an input form.

### `16.php`

- This is the tasks/history surface.
- It reads task history by year, employee group, and admin context.
- It combines task listing with role-aware visibility, so it should stay a boundary page in Gate 1.

### `17.php`

- This is the user performance dashboard.
- It aggregates punchsheet data over 1, 2, 4, and 12 week windows and renders charts.
- It is a reporting boundary with heavy read-side logic.

### `19.php`

- This is the WIP history browser.
- It filters WIP by year, lists inspected and open items, and redirects back to jobsheet details.
- It behaves like a reporting/navigation surface for WIP history.

### `devwebsite` mirrors

- The `devwebsite` copies for `7.php`, `9.php`, `10.php`, and `11.php` remain behavior mirrors with `-Dev` redirects and dev database credentials.
- The current tree does not show `devwebsite` counterparts for `12.php`, `15.php`, `16.php`, `17.php`, or `19.php`.
- That absence is itself useful for Gate 1 because these files should be mapped individually in the root surface until a mirror is found elsewhere.

## Migration Implication

- The numeric family is not one bucket.
- `7.php`, `9.php`, `10.php`, and `11.php` are all distinct boundaries with different responsibilities.
- `12.php`, `15.php`, `16.php`, `17.php`, and `19.php` are also separate read/write or read/report pages and should be tracked file by file.
- Gate 1 should now keep the family index but annotate each numeric file with its actual behavior, not only its page number.

