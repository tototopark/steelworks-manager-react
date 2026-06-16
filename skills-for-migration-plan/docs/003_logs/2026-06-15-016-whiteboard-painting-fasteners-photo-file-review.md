# Whiteboard, Painting, Fasteners, and Photo File Review Log

Date: 2026-06-15

## What I reviewed

I continued the file-by-file source review on the remaining whiteboard, painting, fastener, and photo workflow pages.

Reviewed files:

- `sitepro/60.php`
- `sitepro/61.php`
- `sitepro/62.php`
- `sitepro/63.php`
- `sitepro/64.php`
- `sitepro/66.php`
- `sitepro/67.php`

## What I found

- `60.php` updates weekly whiteboard notes in `tb_week_notes`.
- `61.php` is the painting jobs view/report surface.
- `62.php` writes painting status fields back to `tb_jobs`.
- `63.php` writes the painting comment field back to `tb_jobs`.
- `64.php` is the fasteners view/report surface.
- `66.php` is the photo list/upload view.
- `67.php` writes the uploaded photo row to `tb_photos`.

## Why it matters

- The file-level split between display and write actions is now explicit for these workflow pages.
- The migration map can keep these surfaces separate instead of treating them as one generic legacy bucket.

