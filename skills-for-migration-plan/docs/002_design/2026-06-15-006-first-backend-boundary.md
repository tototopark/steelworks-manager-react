# First Backend Boundary

Date: 2026-06-15

## Decision

The first backend boundary to migrate is authentication and access control.

## Why this boundary comes first

- It is shared by nearly every route.
- It governs login, redirect, and menu behavior.
- It already contains several important edge cases.
- It gives the migration a stable control point before feature pages move.

## What belongs in the boundary

- session bootstrap
- login verification
- password hash checks
- admin validation checks
- IP allowlist checks
- trusted-device checks
- role-based redirect selection
- navigation/menu selection

## What stays outside for now

- jobs business logic
- WIP history rendering
- reminder data calculations
- punch-sheet business rules
- admin maintenance screens

## Compatibility rule

Legacy login and registration routes should stay wrapper-friendly until the backend boundary proves it can reproduce the original flow.

## Next step

Once this boundary is in place, the next migration target should be one business family, most likely jobs or WIP.
