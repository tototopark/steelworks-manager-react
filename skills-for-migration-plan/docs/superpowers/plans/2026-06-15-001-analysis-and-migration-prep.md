# Analysis and Migration Prep Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the analysis and migration-preparation phase by closing the remaining legacy family gaps and turning the current Gate 1 review into a ready-to-execute migration handoff.

**Architecture:** Keep the work split into two tracks. Track A continues file-by-file source review for the remaining provisional legacy families so Gate 1 stays accurate. Track B converts the existing design/log evidence into a Gate 2-ready prep package that lists the target boundaries, the remaining unknowns, and the exact stop point for this phase.

**Tech Stack:** Markdown docs, legacy PHP source tree, existing design/log notes, smoke verification.

---

### Task 1: Close the remaining provisional family review list

**Files:**
- Review: `sitepro/31.php`
- Review: `sitepro/32.php`
- Review: `sitepro/33.php`
- Review: `sitepro/34.php`
- Review: `sitepro/35.php`
- Review: `sitepro/36.php`
- Review: `sitepro/37.php`
- Review: `sitepro/40.php`
- Review: `sitepro/41.php`
- Review: `sitepro/44.php`
- Review: `sitepro/46.php`
- Review: `sitepro/47.php`
- Review: `sitepro/48.php`
- Review: `sitepro/49.php`
- Review: `sitepro/50.php`
- Review: `sitepro/51.php`
- Review: `sitepro/52.php`
- Review: `sitepro/53.php`
- Review: `sitepro/54.php`
- Review: `sitepro/55.php`
- Review: `sitepro/56.php`
- Review: `sitepro/57.php`
- Review: `sitepro/58.php`
- Review: `sitepro/59.php`
- Review: `sitepro/65.php`
- Review: `sitepro/74.php`
- Review: `sitepro/75.php`
- Review: `sitepro/76.php`
- Review: `sitepro/devwebsite/*` mirrors for any of the above files that actually exist
- Update: `docs/002_design/2026-06-15-018-gate1-index-consolidation.md`
- Update: `docs/002_design/2026-06-15-012-file-level-mapping-expansion.md`
- Update: `docs/003_logs/2026-06-15-018-gate1-index-consolidation.md`

- [ ] **Step 1: Read each remaining file family directly**

```text
Use `Get-Content` and `rg` to confirm the page role, the main redirect targets, and the write-side tables.
Record whether each file is a view, action, utility, wrapper, or mirror.
```

- [ ] **Step 2: Compare any existing `devwebsite` mirror files**

```text
Check the mirror tree separately and confirm whether the file is a true mirror, a divergent dev variant, or absent.
```

- [ ] **Step 3: Append file-level findings to the numbered design and log notes**

```text
Add a new numbered pair only if the current pass needs a fresh note; otherwise append a short sub-section to the current 018 notes.
```

- [ ] **Step 4: Refresh the Gate 1 index**

```text
Remove confirmed families from the provisional list and keep only the files that still need source-level inspection.
```

- [ ] **Step 5: Re-run smoke verification**

```text
powershell.exe -ExecutionPolicy Bypass -File "F:\pe\public_html\test-migration-codex\skill4migration-1\tests\smoke.ps1"
```

### Task 2: Build the Gate 2 preparation package

**Files:**
- Create: `docs/002_design/2026-06-15-019-gate2-prep-package.md`
- Create: `docs/003_logs/2026-06-15-019-gate2-prep-package.md`
- Update: `README.md` if the new prep package should become a top-level start link
- Update: `docs/002_design/2026-06-15-018-gate1-index-consolidation.md` if the stop point needs to be tightened

- [ ] **Step 1: Summarize the confirmed Gate 1 boundaries**

```markdown
List the confirmed file groups under auth, jobs, scheduling, whiteboard, media, helpers, and export.
Mark which are still legacy wrappers, which are write boundaries, and which are mirrors.
```

- [ ] **Step 2: List the remaining migration unknowns**

```markdown
Keep only the families that have not yet been reviewed at file level.
State why each family remains provisional.
```

- [ ] **Step 3: Define the Gate 2 entry criteria**

```markdown
Gate 2 starts only after the provisional list is reduced to the minimum acceptable size and the smoke check stays green.
```

- [ ] **Step 4: Define the stop point for this phase**

```markdown
This analysis and preparation phase ends once the plan package exists, the index is consolidated, and the tree is clean.
```

- [ ] **Step 5: Record the migration handoff clearly**

```markdown
Write the exact handoff sentence so the next phase can start implementation without re-reading the whole history.
```

### Task 3: Decide the end-of-phase exit criteria

**Files:**
- Update: `docs/002_design/2026-06-15-018-gate1-index-consolidation.md`
- Update: `docs/003_logs/2026-06-15-018-gate1-index-consolidation.md`

- [ ] **Step 1: Define the phase boundary in one sentence**

```markdown
This phase ends after analysis, planning, and migration prep are complete, and before any implementation work begins.
```

- [ ] **Step 2: Tie the boundary to verifiable signals**

```markdown
The exit signal is: confirmed family notes written, Gate 1 index updated, Gate 2 prep package written, smoke passing, and worktree clean.
```

- [ ] **Step 3: Record the next-phase handoff**

```markdown
The next phase is implementation planning or execution, not more surface analysis.
```

