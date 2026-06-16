# First API Contract

Date: 2026-06-15

## Purpose

This is the first frontend-facing contract for the migrated backend boundary.

The contract models the authenticated shell rather than a business page.

## Contract Shape

```json
{
  "session": {
    "authenticated": true,
    "userId": 123,
    "login": "jane.doe",
    "rightLevel": 4,
    "role": "Office"
  },
  "navigation": [
    { "label": "Home", "path": "Home", "active": true },
    { "label": "Jobs", "path": "Jobs", "active": false },
    { "label": "Logout", "path": "Logout", "active": false }
  ],
  "page": {
    "title": "Home",
    "activeRoute": "Home"
  },
  "redirect": null,
  "warnings": []
}
```

## Contract Rules

- Do not return raw database rows.
- Keep navigation derived from role rules.
- Keep redirects explicit.
- Keep warnings separate from page content.
- Keep the shape stable while the first backend boundary is being introduced.

## Required Behavior

- Anonymous users should not receive an authenticated session payload.
- A user with valid credentials should receive a role-aware shell.
- Login-time redirect logic should remain deterministic.
- Reminder warnings can be added later as a separate field without changing the core shape.

## Why this contract first

- It is shared by almost every route.
- It isolates the login and navigation logic from the business pages.
- It gives the migration a stable API shape before jobs or WIP are extracted.

