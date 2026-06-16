# Account, Holiday, and Leave File Review Log

Date: 2026-06-15

## What I reviewed

I continued the file-by-file source review on the remaining account, planning, and leave-management pages.

Reviewed files:

- `sitepro/20.php`
- `sitepro/39.php`
- `sitepro/42.php`
- `sitepro/43.php`
- `sitepro/45.php`

## What I found

- `20.php` is the `MyAccount` reminder/admin surface with multiple update handlers.
- `39.php` is a write-side jobsheet tick-all action that updates lot-level job progress and install status.
- `42.php` is the workload planning page that checks leave before showing availability.
- `43.php` is the annual leave and public holiday management console.
- `45.php` is the annual leave update handler that persists row edits while skipping expired rows.
- No `devwebsite` mirror was confirmed for these pages in the current scan.

## Why it matters

- The remaining broad provisional labels can now be replaced with real behaviors.
- The migration map now separates account reminders, job tick actions, workload planning, and leave admin into distinct file-level boundaries.

