# Edge Cases and Compatibility Rules

Date: 2026-06-15

## Purpose

This document records the legacy behaviors that must survive the migration unchanged.

These rules are part of the quality gate, not optional implementation detail.

## Authentication Edge Cases

- Login is gated by password verification, admin validation, and IP allowlisting.
- Some flows also accept a trusted remote-device key as an alternate access path.
- Accounts may require password rotation when the default password is still in use.
- Role-based redirect targets differ after login and must remain stable.

## Registration Edge Cases

- Account creation requires a valid avatar upload.
- The avatar must satisfy file-type and size restrictions.
- Duplicate logins must be rejected.
- Newly registered users remain pending until admin validation.

## Access-Control Edge Cases

- Menus and routes change by `right_level`.
- Some roles only see punch-related navigation.
- Some roles see whiteboard, jobs, activity, or reminder routes.
- Administrative roles see reminder warnings during login.

## Data and Query Edge Cases

- Some legacy pages filter by year or by year plus job number.
- Null, empty, and missing fields must be treated carefully.
- Historical job views may rely on multiple joined tables.
- Versioned save copies may contain behavior differences from the nominal page file.

## Reminder Edge Cases

- WOF, REGO, site-safe, and other expiry checks are part of login-time behavior for selected roles.
- Reminder visibility must remain tied to the original role rules.

## Compatibility Rules

- Keep the legacy URL behavior intact until a replacement is verified.
- Treat numbered page families as separate units until equivalence is proven.
- Keep wrapper candidates in place when they are needed for live traffic.
- Prefer preserving odd legacy behavior over simplifying it too early.

## Inventory Touchpoints

The most important pages for these rules are:

- `index.php`
- `connect.php`
- `register.php`
- `1.php`
- `9.php`
- `15.php`
- `17.php`
- `19.php`
- `PunchSheetAction.php`

