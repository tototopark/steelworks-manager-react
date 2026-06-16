# Smoke Test Plan

Date: 2026-06-15

## Purpose

This plan defines the first end-to-end path that must be verified once implementation begins.

The goal is to prove the migration preserves the login shell and its role-based redirect behavior.

## First End-to-End Path

1. Open the home entrypoint.
2. Move to the login flow.
3. Submit valid credentials for a known role.
4. Confirm the authenticated session is created.
5. Confirm the redirect target matches the original role rule.
6. Confirm the post-login shell shows the correct navigation.

## Required Assertions

- login succeeds with valid credentials
- anonymous access does not bypass authentication
- role-specific redirect matches the legacy path
- navigation matches the role
- reminder warnings appear only for the roles that had them originally

## Smoke Test Scope

This first smoke path should not try to prove every page.

It should only verify the control point that affects the rest of the site:

- authentication
- redirect
- navigation
- shell rendering

## Later Smoke Paths

After the first path is stable, add smoke coverage for:

- account creation
- one jobs update flow
- one WIP or punch-sheet flow
