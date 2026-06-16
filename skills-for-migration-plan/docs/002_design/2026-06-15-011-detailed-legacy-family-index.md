# Detailed Legacy Family Index

Date: 2026-06-15

## Purpose

This appendix expands the legacy surface inventory beyond the first 20 or so obvious pages.

The repository contains hundreds of PHP files, so the migration gate needs family-level indexing rather than a short representative list.

## Totals

- root PHP files: `265`
- `devwebsite` PHP files: `162`
- support PHP files outside the two main surfaces: `13`
- total PHP files observed in the legacy tree: `440`

## Root Family Index

The following family names were grouped from the root legacy surface.

- `9` - `33`
- `7` - `29`
- `3` - `19`
- `6` - `16`
- `8` - `14`
- `2` - `14`
- `50` - `11`
- `update_jobsdetails` - `10`
- `create_update_job` - `10`
- `15` - `9`
- `39` - `8`
- `PunchSheetAction` - `8`
- `60` - `8`
- `43` - `7`
- `42` - `7`
- `51` - `6`
- `4bisSHOP` - `6`
- `connect` - `5`
- `61` - `5`
- `20` - `5`
- `52` - `5`
- `1` - `5`
- `56` - `4`
- `66` - `4`
- `32` - `4`
- `45` - `4`
- `11` - `4`
- `3bis` - `4`
- `64` - `4`
- `16` - `4`
- `12` - `4`
- `update_dateinstalljobs` - `4`
- `19` - `4`
- `62` - `4`
- `63` - `4`
- `10` - `3`
- `55` - `3`
- `73` - `3`
- `5` - `3`
- `53` - `3`
- `31` - `3`
- `index` - `3`
- `17` - `3`
- `28` - `3`
- `34` - `3`
- `2bis` - `3`
- `67` - `3`
- `30` - `3`
- `29` - `3`
- `59` - `2`
- `58` - `2`
- `57` - `2`
- `destroysession` - `2`
- `18` - `2`
- `68` - `2`
- `register` - `2`
- `disconnect` - `2`
- `info` - `2`
- `71` - `2`
- `72` - `2`
- `14` - `2`
- `69` - `2`
- `functions.inc` - `2`
- `70` - `2`
- `35` - `2`
- `36` - `2`
- `37` - `2`
- `40` - `2`
- `41` - `2`
- `33` - `2`
- `24` - `2`
- `25` - `2`
- `26` - `2`
- `27` - `2`
- `22` - `2`
- `23` - `2`
- `4` - `2`
- `65` - `2`
- `48` - `2`
- `54` - `2`
- `21` - `2`
- `13` - `2`
- `44` - `2`
- `46` - `2`
- `4bis` - `2`
- `49` - `2`
- `47` - `2`
- `6-20210326` - `1`
- `42-Vers0-Init` - `1`
- `email_layout` - `1`
- `FontCharMap` - `1`
- `SiteInfo` - `1`
- `SiteModule` - `1`
- `38` - `1`
- `update_jobsdetails-20210813` - `1`
- `74` - `1`
- `ga` - `1`
- `PunchSheetAction-20210322` - `1`
- `42-Vers1ToImprove` - `1`
- `2bis-20210311` - `1`
- `75` - `1`
- `76` - `1`
- `RSA` - `1`
- `Random` - `1`
- `Hash` - `1`
- `BigInteger` - `1`
- `comments.tpl` - `1`
- `class.json` - `1`
- `polyfill` - `1`
- `8-20200806` - `1`
- `sqlite_roundtrip` - `1`
- `smoke` - `1`
- `2-20200806` - `1`
- `class.phpmailer` - `1`
- `50-20201120` - `1`
- `20210813` - `1`
- `class.smtp` - `1`

## Devwebsite Mirror Index

The `devwebsite` directory mirrors much of the live surface and should be treated as a distinct legacy surface until equivalence is proven.

Key families in that mirror include:

- `9` - `13`
- `7` - `7`
- `6` - `6`
- `2` - `6`
- `3` - `6`
- `39` - `3`
- `PunchSheetAction` - `3`
- `50` - `3`
- `52` - `3`
- `42` - `3`
- `8` - `3`
- `60` - `3`
- `66` - `3`
- `63` - `2`
- `73` - `2`
- `3bis` - `2`
- `4bisSHOP` - `2`
- `5` - `2`
- `61` - `2`
- `43` - `2`
- `51` - `2`
- `62` - `2`
- `1` - `2`
- `15` - `2`
- `45` - `2`
- `connect` - `2`
- `64` - `2`
- `56` - `2`
- `67` - `2`
- `20` - `2`
- `55` - `1`
- `58` - `1`
- `update_jobsdetails-20210813` - `1`
- `53` - `1`
- `54` - `1`
- `57` - `1`
- `59` - `1`
- `index` - `1`
- `disconnect` - `1`
- `PunchSheetAction-20210322` - `1`
- `info` - `1`
- `destroysession` - `1`
- `register` - `1`
- `update_jobsdetails` - `1`
- `create_update_job` - `1`
- `update_dateinstalljobs` - `1`
- `74` - `1`
- `72` - `1`
- `76` - `1`
- `75` - `1`
- `71` - `1`
- `68` - `1`
- `65` - `1`
- `70` - `1`
- `69` - `1`
- `16` - `1`
- `14` - `1`
- `17` - `1`
- `19` - `1`
- `18` - `1`

## Support Files

Support PHP files outside the two main surfaces are treated as dependencies or libraries first:

- `phpmailer/class.phpmailer.php`
- `phpmailer/class.smtp.php`
- `phpmailer/index.php`
- `phpseclib/Crypt/Hash.php`
- `phpseclib/Crypt/Random.php`
- `phpseclib/Crypt/RSA.php`
- `phpseclib/Math/BigInteger.php`
- `src/FontCharMap.php`
- `src/SiteInfo.php`
- `src/SiteModule.php`
- `src/view/email_layout.php`
- `tests/smoke.php`
- `tests/sqlite_roundtrip.php`

## Migration Implication

The Gate 1 mapping should be expanded family by family from this index, not only from the short list of obvious entrypoints.

The right next step is to turn this family index into a fuller 1:1 map for:

- root entrypoints
- `devwebsite` mirror files
- support dependencies
