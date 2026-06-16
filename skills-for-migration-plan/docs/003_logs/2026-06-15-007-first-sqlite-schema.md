# First SQLite Schema Log

Date: 2026-06-15

## What was decided

- The first SQLite schema centers on `users`, `user_ip_allowlist`, `trusted_devices`, and optional `sessions`.

## Why

- It keeps the first backend boundary portable.
- It preserves the legacy login and trust model without committing to MySQL-specific behavior.
