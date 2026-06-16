# First API Contract Log

Date: 2026-06-15

## What was decided

- The first API contract models the authenticated shell.
- It carries session state, navigation, page identity, redirect target, and warnings.

## Why

- It gives the frontend a stable shape before business pages are moved.
- It keeps access control decisions explicit.
