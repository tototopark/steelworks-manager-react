# Compatibility Wrapper List

Date: 2026-06-15

## Purpose

This document lists the legacy PHP files that should remain wrapper-friendly during the first migration wave.

The goal is to preserve live URLs while the new backend boundary is introduced.

## Wrapper Candidates

### Core access path

- `index.php`
- `connect.php`
- `register.php`
- `disconnect.php`
- `destroysession.php`

### Job update path

- `create_update_job.php`
- `update_jobsdetails.php`
- `update_dateinstalljobs.php`

### Punch and WIP path

- `PunchSheetAction.php`
- `9.php` family

### Public and role shell

- `1.php` family
- `7.php` family
- `10.php` family

## Why these stay wrappers first

- They are part of the live entry surface.
- They carry login, upload, session, or redirect logic.
- They are reused by many downstream flows.
- They are high-risk to move before the auth boundary is stable.

## Wrapper Rule

If a file is still needed by a live URL, it stays wrapper-friendly until the replacement has been regression-checked.

