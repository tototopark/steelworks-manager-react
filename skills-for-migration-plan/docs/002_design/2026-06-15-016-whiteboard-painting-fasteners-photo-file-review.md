# Whiteboard, Painting, Fasteners, and Photo File Review

Date: 2026-06-15

## Purpose

This document records the next file-by-file review wave for the whiteboard and media-oriented legacy pages.

The goal is to keep Gate 1 file-level and split read surfaces from write actions in the same family.

## Review Method

- Read the root file body directly.
- Use the real update queries and redirects as the boundary signal.
- Keep view pages and action pages separate even when the names feel related.

## Files Reviewed

- `sitepro/60.php`
- `sitepro/61.php`
- `sitepro/62.php`
- `sitepro/63.php`
- `sitepro/64.php`
- `sitepro/66.php`
- `sitepro/67.php`

## Findings

### `60.php`

- This is the whiteboard weekly notes update action.
- It reads week-note fields for each weekday, updates or inserts into `tb_week_notes`, and redirects back to `Whiteboard`.
- It is a bulk note writer, not a display page.

### `61.php`

- This is a painting jobs view page.
- It reads job and status data for painting-related workflow and redirects into `Jobsheet`.
- It behaves like the reporting/view side of the painting workflow.

### `62.php`

- This is the painting jobs update action.
- It writes `PAINT_*` flags and associated purchase-order/date fields in `tb_jobs`.
- It is a write boundary and should remain separate from the view page.

### `63.php`

- This is the painting comment update action.
- It writes `PAINT_COMMENT` back to `tb_jobs`.
- It is a small but distinct write action.

### `64.php`

- This is the fasteners view page.
- It reads fastener fields from jobs and job details, then routes users into `Jobsheet` or `Fasteners` history.
- It is a read/report boundary for the fastener workflow.

### `66.php`

- This is the upload-photo view page.
- It counts photos, lists existing uploads, and routes into the photo upload action or photo zoom.
- It is the read side of the photo workflow.

### `67.php`

- This is the upload-photo action page.
- It reads the upload, writes to `tb_photos`, and redirects back to the photo list.
- It is the write side of the photo workflow.

### Mirror note

- No `devwebsite` counterparts were confirmed for this file set in the current tree scan.
- These pages should stay root-only in Gate 1 until a true mirror appears.

## Migration Implication

- The whiteboard, painting, fastener, and photo pages are separate business boundaries.
- The view/action split is now explicit at the file level.
- Gate 1 should not group these pages into a single miscellaneous bucket.

