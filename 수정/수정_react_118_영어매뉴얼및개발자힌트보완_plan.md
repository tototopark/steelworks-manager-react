# Implementation Plan - English User Manual & Developer Hints Verification

This plan outlines the creation of a comprehensive, unified-format English User Manual for all 14 pages in the React application, while simultaneously auditing and verifying the `DevHints` (Developer Hints) for any missing API endpoints, hooks, databases, or conditions.

## User Review Required

> [!IMPORTANT]
> - **Unified Format**: Every menu manual will follow a consistent structure: Overview, Access Permissions, Button and Control Descriptions (including CRUD), and Standard Workflows.
> - **Double Developer Hints**: We will ensure that both the global path-based hints (`DevHints.js` fallback) and the custom page-level hints are kept aligned and updated with correct API endpoints, hooks, and databases.
> - **No Emojis**: All documentation and codes will strictly avoid emojis and special characters to prevent Unicode parsing errors.

## Proposed Changes

### 1. English User Manual
We will create a comprehensive manual covering the following 14 pages:
- `/dashboard`
- `/dashboard/jobs`
- `/dashboard/weekly-plan`
- `/dashboard/whiteboard`
- `/dashboard/qa-wip`
- `/dashboard/employees`
- `/dashboard/vehicles`
- `/dashboard/punch`
- `/dashboard/timesheet`
- `/dashboard/performance`
- `/dashboard/holidays`
- `/dashboard/workload`
- `/dashboard/activity`
- `/dashboard/admin-db`

The manual will be saved as `수정/수정_react_118_사용자영문매뉴얼및개발자힌트보완.md`.

### 2. Developer Hints Audit
We will cross-check the page files and custom hooks for all 14 pages, updating `fe/src/components/common/DevHints.js` or the page files if we find any missing or outdated parameters.

## Verification Plan

### Manual Verification
- We will double check that all 14 menus are thoroughly covered in the manual.
- We will verify that Next.js compiles cleanly and runs without warnings using `npm run build`.
