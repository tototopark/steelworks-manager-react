# Smoke Test Plan Log

Date: 2026-06-15

## What was decided

- The first end-to-end path verifies home entry, login, redirect, session creation, and role-based navigation.
- A small executable smoke test was added at `tests/smoke.ps1`.

## What it checks

- required portfolio docs exist
- the checklist has no open items

## Why

- The migration record needs one executable validation point.
- The first path is the control surface for the rest of the site.
