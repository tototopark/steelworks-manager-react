# Structure Migration Design

Date: 2026-06-15

## Purpose

This repository captures the migration plan for a legacy PHP site. The goal is to reorganize the work into a backend-first, docs-first, shallow structure without breaking the current site too early.

This document defines the first phase of that migration: whole-site structure cleanup and functional mapping, not a full rewrite.

## Goals

- Preserve current site behavior while the structure is being improved.
- Reduce the number of responsibilities handled by root-level PHP files.
- Move shared configuration and canonical app data into a small number of focused files.
- Keep the repository shallow and easy to navigate.
- Create a stable base for later backend-first migration work.
- Document the site map, flow boundaries, and compatibility strategy before code moves.

## Non-Goals

- Full rewrite of the application.
- Frontend redesign.
- Database migration execution in this phase.
- Removal of every legacy PHP script in one step.
- Introducing deep folder hierarchies.

## Current State

The legacy application lives outside this repository. The migration work we keep here is the map, the rules, the compatibility strategy, and the later implementation notes.

That means this repository should stay small and focused on:

- migration policy
- boundary definitions
- implementation planning
- test expectations

## Chosen Approach

### Recommended strategy: hybrid migration

We will keep the current application operating while progressively extracting structure into dedicated areas.

Why this approach:

- It is safer than a full rewrite.
- It reduces the chance of omitting legacy behavior.
- It aligns with the repository guidance.
- It lets us create a reliable migration map before we replace behavior.

### Why not the other approaches

- Legacy-only cleanup is too shallow and leaves the main structural issues intact.
- Full rewrite is too risky for a large legacy PHP site with many page variants and compatibility files.

## Target Shape

The migration should move the application toward a small, readable shape like this:

```text
site-root/
  config/
  docs/
  src/
  tests/
  storage/
  legacy/
```

Notes:

- The exact folder names can stay flexible during implementation.
- Compatibility wrappers may remain in place for as long as the live site needs them.
- The key change is boundary clarity, not immediate file deletion.

## Migration Rules

### 1. Keep live behavior stable

Legacy entrypoints remain available until a replacement path is proven safe.

### 2. Extract shared data first

Site metadata, request metadata, and common config should become explicit data objects or config files before deeper logic is moved.

### 3. Keep the data layer portable

Any new persistence code should remain SQLite-friendly and MySQL-migration-ready.

### 4. Prefer small files

If a file grows too large, split it rather than deepening the tree.

### 5. Document every meaningful choice

Architecture and workflow decisions must be written to the checklist and context notes as they are made.

## First Migration Scope

The first pass should focus on structure, not feature expansion.

### In scope

- Identify the major site modules and page families.
- Map which legacy scripts belong to which feature area.
- Classify compatibility wrappers versus true feature entrypoints.
- Define shared config boundaries.
- Define the first stable API or service boundary for future backend extraction.
- Establish smoke-test coverage for the first end-to-end path.

### Out of scope

- Rewriting all pages.
- Switching rendering technology.
- Replacing the entire persistence layer.
- Removing compatibility scripts before replacements exist.

## Proposed Phases

### Phase 1: Inventory and mapping

- List root-level scripts and group them into functional families.
- Identify the current canonical entrypoints.
- Mark obvious compatibility copies and versioned variants.
- Capture the main request flow and shared data objects.

### Phase 2: Boundary extraction

- Move shared constants and environment values into config.
- Expand `src/` with small modules for site data, request data, and service boundaries.
- Keep the legacy app wired through those boundaries where possible.

### Phase 3: Compatibility stabilization

- Preserve old URLs and forms through wrappers or adapters.
- Make the extracted boundaries the source of truth for new work.
- Add smoke tests around the first end-to-end path.

### Phase 4: Incremental feature migration

- Move page families one at a time.
- Replace legacy logic only after the new path is covered by tests.
- Keep the migration map updated as work progresses.

## Testing Strategy

The first tests should prove that the structural migration has not broken the live flow.

Minimum coverage:

- Smoke test for the main landing or default route.
- Smoke test for one representative form or request handler.
- A basic data round-trip test if a new persistence boundary is introduced.

Testing priorities:

- Behavior preservation before refactor elegance.
- Deterministic checks over manual assumptions.
- A small number of tests tied to the first migrated path.

## Risks

- Hidden coupling inside the current PHP entrypoints.
- Versioned page copies that may contain behavior differences.
- Large files that bundle routing, rendering, and business logic together.
- Compatibility wrappers becoming a permanent layer if not retired deliberately.

## Mitigations

- Keep each extraction small and reversible.
- Map behavior before moving code.
- Treat page variants as distinct until proven equivalent.
- Update the checklist and context notes whenever a boundary decision is made.

## Decision Log

- Keep the migration backend-first.
- Keep the structure shallow.
- Use a hybrid migration instead of a rewrite.
- Preserve live behavior through compatibility while new boundaries are introduced.

