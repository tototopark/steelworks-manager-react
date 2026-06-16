# Quality Gate Direction

Date: 2026-06-15

## Decision

The migration portfolio will follow the code migration quality gate workflow.

## Meaning

- Inventory the legacy surface before making changes.
- Define a 1:1 mapping before implementation.
- Preserve edge cases explicitly.
- Verify the migrated path against the original behavior before calling it complete.

## Impact

- Keeps the portfolio story precise.
- Prevents vague or partial migration claims.
- Makes the repository useful as a real migration record rather than a loose notes folder.
