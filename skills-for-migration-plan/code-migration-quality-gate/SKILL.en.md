---
name: code-migration-quality-gate
description: Use when migrating legacy projects, rewriting codebases, porting applications such as PHP to React, Next.js, or FastAPI, or mapping old menus and functions to a new stack. Enforces zero functional omissions and absolute fidelity. Always use this skill for codebase migration tasks. Do not use for writing new standalone apps from scratch, general refactoring of single files, or non-technical project management.
---

# Code Migration Quality Gate

This skill is a **Process + Rigid** rule set for migrations. It is designed to move legacy code, often PHP, into a new technical stack such as React, Next.js, or FastAPI while preserving every business rule, security rule, edge case, routing behavior, menu item, table column, and special handling path.

## Goal

Migrate legacy test code while preserving 100% of the behavior, including functions, security rules, edge handling, UI notes, and exceptions. Keep planning and implementation in lockstep so that migration gaps and omissions are reduced to zero.

## Foundational Principle

**Violating the letter of the rules is violating the spirit of the rules.**

If a rule is written one way and the implementation takes a shortcut around it, that is still a violation.

---

## Iron Laws

### 1. Zero-Assumption Analysis

Never guess or follow habit. Read all source files and map them directly.
- Do not say, "This page probably does X" or "This column is likely irrelevant."
- Inspect the root file and the mirror file, if one exists, before starting migration planning.

### 2. Double-Gate Mapping Check

Before implementation begins, run both:
- **Gate 1 (Planning boundary):** map legacy files and workflows to migration targets.
- **Gate 2 (Verification boundary):** compare the implemented code against the legacy source and confirm behavioral parity.

Do not mark either gate complete until the result is truly finished.

### 3. Edge-Case Preservation

Preserve error handling, permission checks, null handling, and special character handling exactly.
- Keep IP restrictions, bcrypt compatibility, null checks, and legacy redirect behavior intact.

### 4. Strict Code Size Limit

Keep each implementation file under 300 lines whenever possible.
- If a workflow becomes complex, split it into smaller modules, but preserve the behavior.
- For API boundaries, separate major responsibilities into dedicated files such as `auth.py`, `jobs.py`, `employees.py`, or `api_router.py`.

### 5. Executable Standalone Backend Pipeline

Backend logic must be runnable and testable on its own.
- Each backend module should include an `if __name__ == "__main__"` style entry point or equivalent executable test hook.
- The implementation should be verifiable without starting the entire front end.

### 6. Developer Diagnostic Hints and Toggle Feature

Add diagnostic hints on developer-only views so that debugging is easier.
- Show useful details such as backend route names, API targets, source DB references, or behavioral notes.
- Use feature toggles such as `SHOW_DEV_HINTS` or `AUTO_FILL_ENABLED` to expose or hide developer-only behavior.

#### Additional operational requirements

- If a port conflict occurs, detect the offending process and stop it cleanly.
- Convert legacy PHP bcrypt hashes that start with `$2y$` to `$2b$` if the new runtime requires it.
- Add an integrity check API for database consistency when useful.
- For development auto-fill flows, keep the behavior deterministic and easy to test.

### 7. Workflow

#### 1. Inventory the legacy surface

- Collect every executable file in the legacy tree, including `.php`, `.py`, `.js`, and `.sql`.
- Record the business function of each file in one sentence.

#### 2. Extract the database schema and migration model

- Analyze the SQL schema and dumps to identify tables, foreign keys, and constraints.
- Record defaults, nullable columns, and type conventions before migration.

#### 3. Gate 1: build the migration map and 1:1 target mapping

- Define the source structure and component boundaries.
- Create a 1:1 mapping table from legacy files or workflows to new targets.

#### 4. Build the module boundary implementation

- Keep each module under 300 lines if possible.
- Separate business logic into executable backend modules.
- Verify that each module can run independently.

#### 5. Gate 2: regression check

- Compare the implemented UI and backend behavior against the legacy source.
- Check menu links, validation rules, edge cases, and file upload behavior.
- If a discrepancy is found, return to Gate 4 and fix it.

#### 6. Gap review and merge verification

- After migration, document the gap between the legacy behavior and the new code.
- Re-run schema and test scripts to confirm that the migration is truly complete.

---

## Domain Rules

- **Priority of parity:** matching the original behavior is more important than a cleaner implementation.
- **Checklist state updates:** after each workflow step, update the mapping status from "in progress" to "complete" only when parity is proven.

## Common Mistakes

- **Aggressive simplification:** removing legacy behavior because the filename or page title makes it look small.
- **Ignoring edge logic:** treating IP checks, password validation, or special case handling as unimportant.

## Rationalization Patterns to Reject

| AI rationalization | Iron response |
|---|---|
| "That page is just a small note page, so the mapping can be rough." | Small pages still need file-level mapping. Map them one by one. |
| "The latest stack is simpler, so the old behavior can be omitted." | Simpler is not a reason to omit behavior. Preserve the legacy contract first. |
| "I will settle Gate 2 later." | Gate 2 cannot be skipped or delayed indefinitely. |
| "The schema looks obvious enough." | Schema details can hide null, type, and edge-case bugs. Inspect them carefully. |

---

## Verification Checklist

- [ ] Legacy files were inspected directly.
- [ ] Gate 1 has a file-level mapping.
- [ ] Gate 2 compares the new target against the legacy behavior.
- [ ] The backend implementation is runnable.

---

## Output Format

Report migration results in the following structure:

```markdown
### 1. Migration status
- Total legacy files: [N]
- Files fully mapped: [M]
- Implemented backend modules / APIs: [X]

### 2. Double-Gate mapping table
| Legacy surface | Target path | Gate 1 | Gate 2 | Current status |
|---|---|---|---|---|
| ... | ... | [OK/Pending] | [OK/Pending] | [complete / in progress / provisional] |

### 3. Gap analysis
- [ ] Gap 1: ...
- [ ] Gap 2: ...

### 4. Verification result
- Build result: [pass / fail]
- Data integrity result: [0 errors / specific issue]
```

## Migration Addendum

When extending an existing migration record, keep the original workflow intact and append the following practices without rewriting the core rules:

- Add file-by-file source review after Gate 1 mapping.
- Read root and `devwebsite` files separately before updating the mapping.
- Record suspicious branches before moving to the next family.
- Keep design notes in `docs/002_design` and execution notes in `docs/003_logs`.
- Use matching sequence numbers for the same work order.
- Append new numbered notes instead of renumbering unrelated prior work.
- Finish with a smoke check and a clean-worktree check before declaring the pass ready.
- Stay inside the fixed workspace.
