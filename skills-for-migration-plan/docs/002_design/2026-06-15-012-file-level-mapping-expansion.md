# File-Level Mapping Expansion

Date: 2026-06-15

## Purpose

This document expands Gate 1 from family-level indexing into file-level mapping for the largest and most important legacy clusters.

Where behavior was not inspected in detail, the mapping is explicitly marked as provisional and based on file-family inference.

## Mapping Legend

- `wrapper` - keep as a compatibility entrypoint for now
- `boundary` - candidate for extraction into `src/`
- `mirror` - mirrored legacy copy that should stay in the legacy surface until equivalence is proven
- `library` - support dependency, not a migrated business endpoint

## Root File-Level Mapping

### Authentication and shell

| Files | Target | Notes |
|---|---|---|
| `index.php` | `wrapper` | shared auth shell |
| `connect.php`, `connect-save20210126.php`, `connect-save20230322.php` | `boundary` / `mirror` | authentication and redirect control |
| `register.php` | `wrapper` | account creation and upload |
| `disconnect.php` | `wrapper` | logout/session teardown |
| `destroysession.php` | `boundary` | session utility |
| `info.php` | `wrapper` | legacy info/about entrypoint |

### Jobs and updates

| Files | Target | Notes |
|---|---|---|
| `create_update_job.php`, `create_update_job-Save20200302.php`, `create_update_job-save20200414.php`, `create_update_job-save20200427.php`, `create_update_job-save20200815.php`, `create_update_job-save20200817.php`, `create_update_job-save20201125.php`, `create_update_job-save20210204.php`, `create_update_job-save20210329.php` | `boundary` / `mirror` | jobs create/update family |
| `update_jobsdetails.php`, `update_jobsdetails-Save2021-10-13.php`, `update_jobsdetails-save20200328.php`, `update_jobsdetails-save20200329.php`, `update_jobsdetails-save20200427.php`, `update_jobsdetails-save20210730.php`, `update_jobsdetails-save20210816.php`, `update_jobsdetails-save20210906.php`, `update_jobsdetails-save20210922.php` | `boundary` / `mirror` | jobs detail updates |
| `update_dateinstalljobs.php`, `update_dateinstalljobs-save20210816.php`, `update_dateinstalljobs-save20210906.php` | `boundary` / `mirror` | install-date updates |

### Punch and WIP

| Files | Target | Notes |
|---|---|---|
| `PunchSheetAction.php`, `PunchSheetAction-Save20191128.php`, `PunchSheetAction-save20200427.php`, `PunchSheetAction-save20210222.php`, `PunchSheetAction-save20210322.php` | `boundary` / `mirror` | punch-sheet family |
| `9.php`, `9-Save20191128.php`, `9-Save20191206.php`, `9-Save20200327.php`, `9-save20200406.php`, `9-save20200427.php`, `9-save20200806.php`, `9-save20200904.php`, `9-save20200929.php`, `9-save20201126.php`, `9-save20210202.php`, `9-save20210202-B.php`, `9-save20210209.php`, `9-save20210222.php`, `9-save20210311.php`, `9-save20210319.php`, `9-save20210618.php`, `9-save20210802.php`, `9-save20210805.php`, `9-save20220111.php` | `boundary` | WIP / punch trace / job detail family |
| `7.php`, `7-Save20191128.php`, `7-Save20191216.php`, `7-Save20200325.php`, `7-Save20200326.php`, `7-save20200328.php`, `7-save20200329.php`, `7-save20200401.php`, `7-save20200414.php`, `7-save20200427.php`, `7-save20200428.php`, `7-save20200717.php`, `7-save20200821.php`, `7-save20200904.php`, `7-save20201125.php`, `7-save20201126.2.php`, `7-save20201126.php`, `7-save20210126.php`, `7-save20210311.php`, `7-save20210326.php`, `7-save20210730.php`, `7-save20210813.php` | `boundary` | punch / todo / role queue family |
| `3.php`, `3-save20200406.php`, `3-save20200410.php`, `3-save20200428a.php`, `3-save20200428b.php`, `3-save20200821.php`, `3-save20200903.php`, `3-save20201202.php`, `3-save20210219.php`, `3-save20210311.php`, `3-save20210802.php`, `3-save20210802bis.php`, `3-save20230322.php` | `boundary` | operational activity family |
| `6.php`, `6-20210326.php`, `6-save20200401.php`, `6-save20200409.php`, `6-save20200413.php`, `6-save20200420.php`, `6-save20201012.php`, `6-save20210217.php`, `6-save20210225.php`, `6-save20210326.php`, `6-save20210813.php` | `boundary` | admin/ops family |
| `2.php`, `2-20200806.php`, `2-save20200821.php`, `2-save20200904.php`, `2-save20201123.php`, `2-save20210121.php`, `2-save20210805.php`, `2-save20210923.php`, `2-save20210930.php` | `boundary` | board / workflow family |
| `8.php`, `8-20200806.php`, `8-Save20200302.php`, `8-save20200401.php`, `8-save20200406.php`, `8-save20200414.php`, `8-save20200415.php`, `8-save20200815.php`, `8-save20200817.php`, `8-save20201125.php`, `8-save20201127.php`, `8-save20210329.php` | `boundary` | staff-facing operational family |

### Boards, history, and dashboards

| Files | Target | Notes |
|---|---|---|
| `10.php`, `10-save20200327.php` | `boundary` | whiteboard/activity summary |
| `15.php`, `15-Save20191208.php`, `15-save20200328.php`, `15-save20200410.php`, `15-save20200411.php`, `15-save20200817.php`, `15-save20201120.php` | `boundary` | job history and year filters |
| `16.php`, `16-save20200406.php`, `16-save20200409.php` | `boundary` | job staffing / assignment |
| `17.php`, `17-save20200414.php` | `boundary` | job progress / analysis |
| `19.php`, `19-save20200406.php`, `19-save2020326.php` | `boundary` | WIP history |
| `20.php`, `20-save20210126.php`, `20-save20210311.php` | `boundary` | account/task admin |
| `39.php`, `39-Save20210126.php`, `39-save20210906.php`, `39-save20210922.php`, `39-save20211013.php` | `boundary` | admin/account family |
| `42.php`, `42-save20200329.php`, `42-save20200420.php`, `42-save20200420V2.php` | `boundary` | scheduling / leave boundary |
| `43.php`, `43-save20200328.php`, `43-save20200406.php`, `43-save20210127.php`, `43-save20210805.php` | `boundary` | scheduling / leave boundary |
| `50.php`, `50-20201120.php`, `50-save20200328.php`, `50-save20200401.php`, `50-save20200410.php`, `50-save20200427.php`, `50-save20200815.php`, `50-save20200817.php`, `50-save20210304.php` | `boundary` | board/history family |
| `51.php`, `51-save20200401.php`, `51-save20200606.php`, `51-save20210122.php` | `boundary` | board/history family |
| `52.php`, `52-save20210209.php` | `boundary` | board/history family |
| `53.php`, `53-save20200413.php` | `boundary` | board/history family |
| `55.php`, `55-save20230322.php` | `boundary` | board/history family |
| `56.php`, `56-save20200420V2.php` | `boundary` | board/history family |
| `60.php`, `60-save20210121.php`, `60-save20210922.php`, `60-save20210923.php`, `60-save20210930.php` | `boundary` | scheduling / leave boundary |
| `61.php`, `61-save20210218.php`, `61-save20210311.php` | `boundary` | confirmed utility flow |
| `62.php`, `62-save20210311.php` | `boundary` | confirmed utility flow |
| `63.php`, `63-save20210311.php` | `boundary` | confirmed utility flow |
| `64.php`, `64-save20210323.php` | `boundary` | confirmed utility flow |
| `66.php`, `66-save2021-03-25.php`, `66-save20210326.php` | `boundary` | confirmed utility flow |

### Admin and account maintenance

| Files | Target | Notes |
|---|---|---|
| `11.php`, `11-Save20200327.php`, `11-save20200413.php` | `boundary` | user admin |
| `12.php`, `12-Save20200327.php`, `12-save20230322.php` | `boundary` | login/account admin |
| `13.php` | `boundary` | user admin action |
| `14.php` | `boundary` | user admin action |
| `31.php`, `31-save20200409.php` | `boundary` | task update by employee |
| `32.php`, `32-save20200401.php`, `32-save2020326.php` | `boundary` | WIP detail view and related update flow |
| `33.php` | `wrapper` | legacy maintenance wrapper |
| `34.php`, `34-save20200413.php` | `boundary` | device admin view and action surface |
| `35.php` | `boundary` | device update action |
| `36.php` | `boundary` | device create action |
| `37.php` | `boundary` | device delete action |
| `40.php` | `boundary` | WIP detail update action |
| `41.php` | `boundary` | WIP completion action |
| `44.php` | `boundary` | public holiday update action |
| `45.php`, `45-save20210127.php` | `wrapper` / `boundary` | account/leave workflow boundary |
| `46.php` | `boundary` | public holiday create action |
| `47.php` | `boundary` | annual leave create action |
| `48.php` | `boundary` | public holiday delete action |
| `49.php` | `boundary` | annual leave delete action |

### Production, export, and WIP support actions

| Files | Target | Notes |
|---|---|---|
| `50.php`, `50-20201120.php`, `50-save20200328.php`, `50-save20200401.php`, `50-save20200410.php`, `50-save20200427.php`, `50-save20200815.php`, `50-save20200817.php`, `50-save20210304.php` | `boundary` | dev jobsheet surface |
| `51.php`, `51-save20200401.php`, `51-save20200606.php`, `51-save20210122.php` | `boundary` | employee work load |
| `52.php`, `52-save20210209.php` | `boundary` | punch sheet modification by admin |
| `53.php`, `53-save20200413.php` | `boundary` | export data |
| `54.php` | `boundary` | export database page |
| `55.php`, `55-save20230322.php` | `boundary` | export database page |
| `56.php`, `56-save20200420V2.php` | `boundary` | production plan view |
| `57.php` | `boundary` | production plan update |
| `58.php` | `boundary` | production plan create |
| `59.php` | `boundary` | production plan delete |
| `65.php` | `boundary` | fasteners save |

### Remaining numbered pages

| Files | Target | Notes |
|---|---|---|
| `1.php`, `1-save20210202.php`, `1-save20210311.php` | `wrapper` | public landing family |
| `4.php` | `boundary` | dashboard-family candidate |
| `4bis.php` | `boundary` | alternate dashboard candidate |
| `4bisSHOP.php`, `4bisSHOP-save20200903.php`, `4bisSHOP-save20200916.php`, `4bisSHOP-save-20200916.php` | `boundary` | shop dashboard |
| `5.php`, `5-save20210126.php` | `wrapper` / `boundary` | provisional |
| `18.php` | `wrapper` | provisional |
| `21.php` | `wrapper` | provisional |
| `22.php` | `wrapper` | provisional |
| `23.php` | `wrapper` | provisional |
| `24.php` | `wrapper` | provisional |
| `25.php` | `wrapper` | provisional |
| `26.php` | `wrapper` | provisional |
| `27.php` | `wrapper` | provisional |
| `28.php`, `28-save20200409.php` | `wrapper` | provisional |
| `29.php`, `29-save20200409.php` | `wrapper` | provisional |
| `30.php`, `30-save20200409.php` | `wrapper` | provisional |
| `67.php`, `67-save2021-03-25.php` | `boundary` | confirmed helper flow |
| `68.php` | `boundary` | confirmed media/helper flow |
| `69.php` | `boundary` | confirmed media/helper flow |
| `70.php` | `boundary` | confirmed media/helper flow |
| `71.php` | `boundary` | confirmed media/helper flow |
| `72.php` | `boundary` | confirmed media/helper flow |
| `73.php`, `73-save20210816.php` | `boundary` | confirmed media/helper flow |

The historical placeholders `74.php`, `75.php`, and `76.php` were not present in the tree snapshot used for this pass.

## Devwebsite Mirror Mapping

The `devwebsite` tree is a mirror surface and should not be collapsed into the main mapping until equivalence is proven.

| Files | Target |
|---|---|
| `index.php`, `connect.php`, `register.php`, `disconnect.php`, `destroysession.php`, `create_update_job.php`, `update_jobsdetails.php`, `update_dateinstalljobs.php`, `PunchSheetAction.php` | `mirror` |
| `1.php` family | `mirror` |
| `2.php` family | `mirror` |
| `3.php` family | `mirror` |
| `4.php` family | `mirror` |
| `4bisSHOP.php` family | `mirror` |
| `5.php` family | `mirror` |
| `6.php` family | `mirror` |
| `7.php` family | `mirror` |
| `8.php` family | `mirror` |
| `9.php` family | `mirror` |
| `10.php` through `20.php` mirror pages | `mirror` |
| `21.php` through `76.php` mirror pages | `mirror` |

## Support Libraries

| Files | Target |
|---|---|
| `functions.inc.php`, `functions.inc-save20210311.php` | `library` |
| `class.json.php`, `comments.tpl.php`, `ga.php`, `polyfill.php` | `library` |
| `phpmailer/*` | `library` |
| `phpseclib/*` | `library` |
| `src/*` | `library` until the backend boundary is reworked |
| `tests/*` | `verification` |

## Remaining Unknowns

The remaining on-tree unknowns are now limited to the unresolved legacy wrappers that still need direct inspection:

- `5.php` family
- `18.php`
- `21.php` family
- `22.php` family
- `23.php` family
- `24.php` family
- `25.php` family
- `26.php` family
- `27.php` family
- `28.php` family
- `29.php` family
- `30.php` family

## Next Gate

The next step is to leave the confirmed families alone and only inspect the small residual wrapper set one by one if migration scope ever needs to expand beyond this prep phase.
