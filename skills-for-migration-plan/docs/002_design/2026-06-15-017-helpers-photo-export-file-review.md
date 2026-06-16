# Helpers, Photo Rotation, and Performance Export File Review

Date: 2026-06-15

## Purpose

This document records the last review wave in the current numeric cluster.

The goal is to keep the Gate 1 map file-specific for helper flows, photo utilities, and export actions.

## Review Method

- Read the root file body directly.
- Use action names and redirect targets as the main boundary signal.
- Keep utilities separate from the user-facing page that invokes them.

## Files Reviewed

- `sitepro/68.php`
- `sitepro/69.php`
- `sitepro/70.php`
- `sitepro/71.php`
- `sitepro/72.php`
- `sitepro/73.php`

## Findings

### `68.php`

- This is the full-screen photo view.
- It is a display utility for photo inspection and routes back to the photo list.
- It is not a write action.

### `69.php`

- This is the photo rotation action.
- It rotates uploaded images and saves the result back to disk.
- It is a utility write action tied to the photo workflow.

### `70.php`

- This is the dev mirror of the photo rotation action.
- It keeps the same rotation behavior but routes through `Login-Dev`.
- It should remain a mirror-only utility.

### `71.php`

- This is the help form page.
- It gathers help request fields and sends the user into `HelpTreatment`.
- It is the request-side half of the help workflow.

### `72.php`

- This is the help treatment action.
- It reads the submitted help request, computes the average/made totals, and performs the order conversion flow.
- It is the processing-side half of the help workflow.

### `73.php`

- This is the performance export page.
- It reads punch and job data, shapes export-ready output, and routes into `AutoPerfExport`.
- It is a reporting/export boundary rather than a generic dashboard.

### Mirror note

- No `devwebsite` counterpart was confirmed for `68`, `69`, `71`, `72`, or `73` in the current tree scan.
- `70.php` is the explicit dev mirror for the photo rotation utility.

## Migration Implication

- Helper flows and export flows should remain separate from the main business dashboards.
- `68/69/70` belong to the photo utility family.
- `71/72` belong to the help request / help treatment family.
- `73` belongs to the performance export boundary.

