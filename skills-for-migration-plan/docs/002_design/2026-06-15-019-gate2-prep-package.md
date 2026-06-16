# Gate 2 Preparation Package

Date: 2026-06-15

## Purpose

This package captures the analysis and migration-prep handoff after the Gate 1 review wave.

It is the final planning artifact for this phase and the point where implementation work should begin only after the first boundary is chosen.

## Confirmed Gate 1 Boundaries

### Auth and shell

- `index.php`
- `connect.php`
- `register.php`
- `disconnect.php`
- `destroysession.php`

### Jobs and punch/workflows

- `create_update_job.php`
- `update_jobsdetails.php`
- `update_dateinstalljobs.php`
- `PunchSheetAction.php`
- `7.php`
- `9.php`
- `10.php`
- `11.php`
- `12.php`
- `15.php`
- `16.php`
- `17.php`
- `19.php`
- `39.php`

### Account, leave, and scheduling

- `20.php`
- `42.php`
- `43.php`
- `45.php`
- `60.php`

### Maintenance, WIP, export, and production-plan actions

- `31.php`
- `32.php`
- `33.php`
- `34.php`
- `35.php`
- `36.php`
- `37.php`
- `40.php`
- `41.php`
- `44.php`
- `46.php`
- `47.php`
- `48.php`
- `49.php`
- `50.php`
- `51.php`
- `52.php`
- `53.php`
- `54.php`
- `55.php`
- `56.php`
- `57.php`
- `58.php`
- `59.php`
- `65.php`

### Whiteboard, painting, media, and utilities

- `61.php`
- `62.php`
- `63.php`
- `64.php`
- `66.php`
- `67.php`
- `68.php`
- `69.php`
- `70.php`
- `71.php`
- `72.php`
- `73.php`

## Remaining Unknowns

The only residual on-tree wrappers that still need inspection are the small legacy pages that were not part of this phase:

- `5.php`
- `18.php`
- `21.php`
- `22.php`
- `23.php`
- `24.php`
- `25.php`
- `26.php`
- `27.php`
- `28.php`
- `29.php`
- `30.php`

Historical placeholders `74.php`, `75.php`, and `76.php` were not present in the current tree snapshot.

## Gate 2 Entry Criteria

- Gate 1 index stays consolidated.
- The prep package exists and matches the confirmed boundary list.
- Smoke verification stays green.
- The worktree stays clean before implementation begins.

## Phase Stop Point

This phase ends after analysis, planning, and migration-preparation work are complete.

No implementation changes should start until a later phase explicitly chooses the first boundary to migrate.

## Handoff

Gate 1 is consolidated, the residual wrappers are isolated, and the next step is implementation planning rather than more surface analysis.
