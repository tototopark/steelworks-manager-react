# Legacy Surface Inventory

Date: 2026-06-15

## Purpose

This document inventories the legacy PHP application surface that the migration portfolio is based on.

It is the input for Gate 1 mapping, not the mapping itself.

## Scope of Inventory

The legacy application is a flat-root PHP site with many numbered page scripts, versioned save copies, and a few shared actions.

The inventory below groups the surface by functional family so the later 1:1 map can stay readable.

## Canonical Entry Points

These are the most important live entrypoints observed in the legacy site:

- `index.php` - home shell and role-based navigation
- `connect.php` - login and session bootstrap
- `register.php` - new account creation and avatar upload
- `disconnect.php` - logout
- `destroysession.php` - session teardown helper
- `create_update_job.php` - job creation and update entrypoint
- `update_jobsdetails.php` - job detail update entrypoint
- `update_dateinstalljobs.php` - install-date update entrypoint
- `PunchSheetAction.php` - punch-sheet action handler

## Page Families

### Public shell and authentication

Observed files:

- `1.php` and numbered `1-save*` variants
- `index.php`
- `connect.php`
- `register.php`
- `disconnect.php`
- `destroysession.php`

Observed behavior:

- public home landing
- login gate
- registration form processing
- role-based redirects
- trusted-device or IP checks

### Jobs and workflow management

Observed files:

- `create_update_job.php`
- `update_jobsdetails.php`
- `update_dateinstalljobs.php`
- `15.php` and the `15-save*` family
- `16.php` and the `16-save*` family
- `17.php` and the `17-save*` family
- `19.php` and the `19-save*` family

Observed behavior:

- job creation and editing
- job detail tables
- installation dates
- WIP and inspection data
- year filters and job filters
- employee allocation within jobs

### Whiteboard and activity views

Observed files:

- `2.php` and `2-save*` variants
- `3.php` and `3-save*` variants
- `4.php`
- `4bis.php`
- `4bisSHOP.php`
- `4bisSHOP-save*` variants
- `10.php` and `10-save*` variants

Observed behavior:

- schedule boards
- whiteboard-style operational summaries
- activity visibility
- team or shop-centric views

### WIP and inspection

Observed files:

- `9.php`
- `9-save*` variants
- `9-save20210618.php`
- `9-save20210805.php`

Observed behavior:

- WIP display
- punch-sheet style job tracing
- job detail drilldown
- inspection and fabrication data

### Admin and account management

Observed files:

- `11.php` and `11-Save*` variants
- `12.php` and `12-Save*` variants
- `13.php`
- `14.php`
- `20.php`
- `39.php` and `39-save*` variants

Observed behavior:

- user list management
- account editing
- role and permission management
- password or account maintenance
- user deletion or reset-style actions

### Tasks and personal work queues

Observed files:

- `7.php` and `7-save*` variants
- `8.php` and `8-save*` variants
- `20.php`

Observed behavior:

- personal to-do routing
- task lists
- worker-specific queues
- staff-specific operational routing

### Reminders and compliance

Observed files:

- `connect.php` reminder branch
- `Reminder` route referenced from login
- reminder-related tables and checks in the login flow

Observed behavior:

- expiry warnings
- WOF and REGO checks
- site safety expiry checks
- other reminder categories

### Punch clock and attendance

Observed files:

- `PunchSheetAction.php`
- punch clock pages referenced from the home navigation
- `7.php` and related variants for punch-only access

Observed behavior:

- clock-in / clock-out style flows
- attendance or punch tracking
- role-restricted entry

## Shared Helpers and Assets

Observed non-page files:

- `functions.inc.php`
- `class.json.php`
- `comments.tpl.php`
- `ga.php`
- `polyfill.php`
- `src/SiteInfo.php`
- `src/SiteModule.php`
- `src/FontCharMap.php`

Observed asset and support folders:

- `css/`
- `js/`
- `fonts/`
- `gallery/`
- `gallery_gen/`
- `uploads/`
- `uploadsPhoto/`
- `phpmailer/`
- `phpseclib/`

## Compatibility Copies

Many files exist as versioned duplicates with date suffixes, for example:

- `*-save2020*.php`
- `*-Save2020*.php`
- `*-save2021*.php`
- `*-save20230322.php`

These copies are not treated as noise.

They are part of the inventory because they may contain behavior differences that matter during mapping.

## Inventory Findings

- The application is organized around business operations, not generic content pages.
- Navigation is role-driven and changes by user class.
- Authentication, trusted-device checks, and IP allowlists are shared across many routes.
- Jobs, WIP, whiteboard, tasks, account management, and reminders are the core domain families.
- Versioned duplicates must be mapped before any code movement.

## Gate 1 Input

This inventory is the source material for the next step:

- one row per legacy entrypoint or equivalent file family
- one target path or wrapper decision per row
- one explicit note for edge-case behavior
