# Source Review Log

Date: 2026-06-15

## What I reviewed

I started the first file-by-file source review pass for the highest-risk legacy PHP entrypoints.

I read the root files and the corresponding `devwebsite` mirrors where they exist.

Reviewed files:

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

## What I found

- `connect.php` is the real auth and redirect gateway, not a thin login stub.
- `register.php` combines account creation, upload handling, and access gating.
- `disconnect.php` is only a trampoline into `Destroysession`.
- `destroysession.php` has a suspicious `$mydevice` handoff after session teardown.
- `create_update_job.php` is a major job creation/update boundary.
- `update_jobsdetails.php` carries the densest job state logic, including WIP and email side effects.
- `update_dateinstalljobs.php` is a focused install-date updater with notifications.
- `PunchSheetAction.php` is a separate punch/job-timing workflow and should stay distinct from jobsheet CRUD.
- `devwebsite` files match the same workflows with dev redirects and dev credentials, so they remain mirror variants until proven otherwise.

## Why this matters

The source review confirmed that family names alone are too coarse for migration work.

The file bodies show that the first real boundaries are auth/session, job CRUD, install-date updates, and punchsheet actions.

