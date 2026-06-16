# Test Prompts for code-migration-quality-gate

## 1. Should trigger
The migration boundary or business workflow needs to be analyzed before implementation.

Example prompt:
~~~
I want the legacy `sitepro/11.php` page translated into a second-generation implementation with Next.js and FastAPI.
~~~

## 2. Should not trigger
Simple code edits or isolated refactoring that do not involve migration planning.

Example prompt:
~~~
Please change the View Developer CV button text in LoginPage.js.
~~~

## 3. Adversarial trigger
A request that mentions "migration" but is actually asking for a different task.

Example prompt:
~~~
The migration boundary changed. Update the GCP server IP and also change the SSH login address.
~~~

## 4. Cross-domain confusion
Backup, restore, spreadsheet, or reporting work may sound similar to migration planning, but it is a different domain.

Example prompt:
~~~
Restore the backup SQL dump into a SQLite database and write a Python script to verify the data.
~~~

## 5. Missing inputs
The user asks for migration analysis but provides too little detail to locate the relevant surface.

Example prompt:
~~~
Analyze the old jobsheet module again.
~~~

## 6. Realistic complex
A realistic migration request that mixes PHP behavior, menus, and business rules.

Example prompt:
~~~
Translate the behavior currently implemented in `sitepro/7.php` into a React frontend and a Python FastAPI backend while preserving every menu item, status transition, and update flow.
~~~

## 7. Edge or failure
A request that touches SQL-heavy PHP logic, hashing, or type conversion and needs direct source comparison.

Example prompt:
~~~
Move the MySQL salt handling from `sitepro/connect.php` into a FastAPI login flow with JWT security and preserve the existing password compatibility rules.
~~~

## 8. Pressure Scenarios (Rigid Skill Use)

### Time pressure
~~~
The client wants the 1:1 mapping and Gate 2 regression check finished today. Start by mapping the Jobsheet page and the punch pages only.
~~~

### Priority pressure
~~~
The new frontend must go live, but do not skip the migration mapping or the parity checks.
~~~

### Scope pressure
~~~
Only translate the UI pages, but make sure the source-review notes still capture the workflow boundaries.
~~~

### Method pressure
~~~
This looks like a straightforward static page, but it actually contains update and permission logic.
~~~

### Outcome pressure
~~~
Do not launch the next migration step until the current file-level map is complete and reviewed.
~~~

### Strategic pressure
~~~
A QA manager says to finish in three months, so do not collapse the legacy flow into a shallow rewrite. Keep the mapping notes precise and complete.
~~~

### Spirit vs Letter
~~~
A rewrite that looks cleaner but drops behavior is not a valid migration. Finish the map before declaring the work done.
~~~

## 9. Addendum trigger

Use this when the user asks to keep the original migration skill intact and only append the newer file-by-file source review workflow from the latest migration pass.

Example:

~~~
Keep the original skill intact, then append the new file-by-file source review steps and the numbered doc/log rules from the latest migration pass.
~~~
