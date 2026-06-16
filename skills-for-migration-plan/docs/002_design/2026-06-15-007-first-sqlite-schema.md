# First SQLite Schema

Date: 2026-06-15

## Purpose

This schema supports the first backend boundary: authentication and access control.

It is intentionally small so the first migration step stays portable between SQLite and MySQL.

## Design Rules

- Use SQLite-friendly types that map cleanly to MySQL.
- Keep passwords hashed.
- Keep allowlist and device trust separate from profile data.
- Use ISO text for dates where possible.
- Keep the first schema narrowly focused on login and session identity.

## Tables

### `users`

Core account profile.

Columns:

- `id` integer primary key
- `login` text unique not null
- `password_hash` text not null
- `first_name` text not null
- `surname` text not null
- `avatar_path` text
- `bay` integer not null default `0`
- `created_at` text not null
- `right_level` integer not null
- `role` text
- `admin_validation` integer not null default `0`
- `site_safe_exp_date` text

### `user_ip_allowlist`

Legacy IP-based access control.

Columns:

- `id` integer primary key
- `user_id` integer not null
- `ip_address` text not null
- `slot` integer not null

### `trusted_devices`

Legacy remote-device access control.

Columns:

- `id` integer primary key
- `private_key` text unique not null
- `admin_validation` integer not null default `0`
- `created_at` text not null

### `sessions`

Optional first-step session persistence if needed by the backend shell.

Columns:

- `id` integer primary key
- `user_id` integer not null
- `session_key` text unique not null
- `created_at` text not null
- `last_seen_at` text
- `revoked_at` text

## Foreign Key Intent

- `user_ip_allowlist.user_id` should point to `users.id`.
- `sessions.user_id` should point to `users.id`.

## Index Intent

- index `users.login`
- index `trusted_devices.private_key`
- index `user_ip_allowlist.user_id`
- index `sessions.session_key`

## Migration Mapping

- `tb_login` -> `users`
- `ip_1`, `ip_2`, `ip_3` -> `user_ip_allowlist`
- `tb_keys_remote_devices` -> `trusted_devices`

## Deferred Tables

Later migration waves can add:

- jobs
- job details
- date install records
- tasks
- reminders
- punch entries
