# Gate 1 Mapping Table

Date: 2026-06-15

## Purpose

This table maps the legacy surface inventory into the first migration boundaries.

It is intentionally conservative: preserve behavior first, refine later.

For a fuller file-family breakdown, see [2026-06-15-011-detailed-legacy-family-index.md](2026-06-15-011-detailed-legacy-family-index.md).

## Mapping Rules

- One legacy capability may map to one target boundary or remain a compatibility wrapper.
- Versioned duplicates stay grouped with the canonical file until they are proven equivalent.
- Shared authentication and access checks should be extracted before page-specific logic.
- Anything not yet proven safe remains legacy-compatible.

## Mapping Table

| Legacy surface | Legacy role | Gate 1 target | State | Notes |
|---|---|---|---|---|
| `index.php` | home shell and role-based nav | `legacy/` wrapper + shared auth shell | pending | Keep live landing stable. |
| `connect.php` | login and redirect routing | `src/` auth boundary | pending | Shared across almost every route. |
| `register.php` | account creation and upload | `src/` auth boundary + `legacy/` wrapper | pending | Includes avatar upload and IP checks. |
| `disconnect.php` | logout | `legacy/` wrapper | pending | Simple session teardown path. |
| `destroysession.php` | session helper | `src/` session utility | pending | Candidate utility boundary. |
| `create_update_job.php` | job create/update | `src/` jobs boundary | pending | First business module after auth. |
| `update_jobsdetails.php` | job detail updates | `src/` jobs boundary | pending | Keep under same job family. |
| `update_dateinstalljobs.php` | install-date updates | `src/` jobs boundary | pending | Same workflow family as job updates. |
| `PunchSheetAction.php` | punch-sheet actions | `src/` punch boundary | pending | Likely separate from jobs. |
| `1.php` | public home page | `legacy/` wrapper | pending | Public landing and menu shell. |
| `7.php` family | task/punch access | `src/` access-controlled work queue boundary | pending | Exact split still needs validation. |
| `9.php` family | WIP / job detail access | `src/` WIP boundary | pending | Confirm job detail and punch-sheet overlap. |
| `10.php` family | whiteboard/activity | `src/` dashboard boundary | pending | UI-heavy operational views. |
| `11.php` family | user admin | `src/` admin boundary | pending | Role/user maintenance. |
| `12.php` family | login administration | `src/` admin boundary | pending | Account edits and permission maintenance. |
| `13.php` / `14.php` | user admin actions | `src/` admin boundary | pending | Delete/reset-style actions. |
| `15.php` family | job history and year filters | `src/` jobs boundary | pending | Historical job views. |
| `16.php` family | job staffing / assignment | `src/` jobs boundary | pending | Employee allocation behavior. |
| `17.php` family | job progress / analysis | `src/` jobs boundary | pending | Operational analytics-style page. |
| `19.php` family | WIP history and details | `src/` WIP boundary | pending | Confirm inspection/data drilldown. |

## File-Level Confirmations

The following families now have direct file-by-file confirmation in later review notes:

- `7.php`, `9.php`, `10.php`, `11.php`, `12.php`, `15.php`, `16.php`, `17.php`, `19.php`
- `20.php`, `39.php`, `42.php`, `43.php`, `45.php`
- `60.php`, `61.php`, `62.php`, `63.php`, `64.php`, `66.php`, `67.php`
- `68.php`, `69.php`, `70.php`, `71.php`, `72.php`, `73.php`

Use the later numbered design notes as the source of truth for those pages until the main table is fully rewritten.

## Compatibility Decisions

The following families should stay wrapper-friendly until new boundaries are proven:

- authentication and login
- account creation
- logout and session teardown
- job creation/update
- job detail update
- WIP / punch-sheet flows

## Remaining Work

- Confirm the remaining provisional families listed in the expanded index.
- Record edge cases per family.
- Decide the first backend boundary to move into executable code.
