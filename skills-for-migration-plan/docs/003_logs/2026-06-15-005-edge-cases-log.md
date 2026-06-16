# Edge Cases Log

Date: 2026-06-15

## Recorded rules

- login is controlled by password, IP, and device trust
- registration has upload and duplicate-login checks
- roles determine navigation and redirects
- reminder warnings are role-specific
- versioned page copies are part of the behavior surface

## Boundary decision

- authentication and access control are the first backend boundary

## Why

- high reuse across the app
- low risk to centralize early
- strongest leverage for later migration work
