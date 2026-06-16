# Code Migration Quality Gate

Date: 2026-06-15

## Purpose

This repository follows a strict migration workflow for a legacy PHP codebase.

The goal is to preserve behavior with zero intentional omissions while the old application is mapped into a cleaner structure.

## Principle

- Do not start implementation until the legacy surface is fully inventoried.
- Do not declare a migrated feature complete until the old behavior has a clear 1:1 mapping.
- Treat edge cases as first-class requirements, not afterthoughts.

## Workflow

### Step 1: Inventory

Build a complete list of legacy entrypoints, support files, shared helpers, and page families.

What to capture:

- root-level scripts
- compatibility copies and versioned variants
- shared data sources
- menu and role routes
- request handlers and upload actions

### Step 2: Gate 1, plan mapping

Create a 1:1 migration map before any implementation work.

What to define:

- each legacy file or feature
- its target module or wrapper
- whether it stays temporarily as compatibility
- which data objects are shared
- which pages can be migrated together

### Step 3: Edge-case preservation

Record every unusual path that affects behavior.

Examples:

- IP allowlist checks
- password rotation branches
- null and empty handling
- role-specific redirects
- admin validation gates
- upload and file validation

### Step 4: Gate 2, regression verification

Compare the legacy flow and the migrated flow against the same expected behavior.

Checks should confirm:

- navigation matches the original role behavior
- redirects match the original rules
- data round-trips behave the same
- no required page or handler was lost

### Step 5: Lock the boundary

Only after the gate checks pass should the new boundary be treated as the source of truth for the next migration step.

## Output expectation

Each migration stage should leave behind:

- a completed inventory
- a 1:1 mapping table
- an edge-case list
- a verification checklist
- an execution log entry

## Repository use

This document defines how the portfolio project should be executed.

It is the working rule for this migration record, not a general refactoring suggestion.
