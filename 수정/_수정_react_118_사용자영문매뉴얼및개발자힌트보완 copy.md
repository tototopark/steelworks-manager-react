# Steelworks Manager - English User Manual

This manual provides detailed instructions on how to use and operate all 14 menu modules in the React/Next.js Steelworks Manager application. Each page features a unified structure covering the business overview, authorization access levels, UI control descriptions, step-by-step user workflows, and developer reference details.

---

## 1. Dashboard Home (/dashboard)

### 1.1 Overview
The Dashboard Home serves as the central hub of the application, welcoming logged-in users and displaying key metrics and in-progress job monitoring at a glance. It integrates safety certifications and fleet status to warn supervisors of immediate actions needed.

### 1.2 Access Control and Roles
- **View Access**: All logged-in employees (Levels 1, 2, 10, 99).
- **Admin Indicators**: Safety certificate alerts (SiteSafe Warnings) are displayed only to administrators (Level 10+).

### 1.3 UI Components and Control Elements
- **Welcome Banner**: Welcomes the employee by their name.
- **Refresh Button**: Manual reload button with a Refresh icon to fetch the latest server status from the backend Uvicorn API.
- **Summary Cards**:
  - **Active Jobs Card**: Counts the number of active jobs currently in progress.
  - **Average Progress Card**: Displays the average fabrication percentage across all active jobs.
  - **WIP Checked Card**: Displays the total count of lots checked in the Quality Assurance Work-In-Progress pipeline.
- **Shortcut Quick Navigation Cards**:
  - **Active Jobs Shortcut Card**: Contains a link button (Go to Jobs) routing to the Jobs Management screen.
  - **Employees and Whiteboard Shortcut Card**: Contains a link button (Go to Workforce) routing to the Employees Directory.
  - **Punch Clock Shortcut Card**: Contains a link button (Go to Clock) routing to the Punch Clock terminal.
- **Active Job Progress Board**: A table listing the recent 50 active jobs.
  - **Columns**: Job Number, Client/Project Name, Progress Bar (visual color-coded progress showing percentage and numerical fraction, e.g., 85% (17/20 pcs)).
  - **Color priority**: Blue progress bar for in-progress (< 100%), and green progress bar for completed (100%).
  - **Pagination Controls**: Previous (ChevronLeft) and Next (ChevronRight) buttons to navigate page-by-page.

### 1.4 User Workflows and Actions
- **Manually Refreshing Status**: Click the Refresh button at the top right corner to force reload active counts and API state.
- **Navigating to Sub-menus**: Click on any of the three shortcut cards (Active Jobs, Employees, or Punch Clock) to jump to the corresponding application page.
- **Monitoring Job Progress**: Review the progress list. Completed jobs display a green bar with a 100% COMPLETED overlay. In-progress jobs display a blue bar showing the exact count of finished items vs total items.

### 1.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/page.js`
- **Backend API**: `/api/dashboard/job_progress`
- **Database Tables**: `tb_jobs`, `tb_jobs_details`

---

## 2. Jobs Management (/dashboard/jobs)

### 2.1 Overview
The Jobs Management module administers the lifecycle of structural steel fabrication projects. Users can create projects, ingest detail files from Excel sheets, upload engineering drawings/site photographs, assign lot milestones, and print shop floor jobsheets.

### 2.2 Access Control and Roles
- **All Users**: Can view jobs list and search.
- **Admin Users (Level 10+)**: Can create new jobs, upload files, modify lot schedules, reset dates, toggle member checkmarks, and execute Excel ingestion.

### 2.3 UI Components and Control Elements
- **Category Tabs**: Filters the list of jobs:
  - **Active Tab**: Displays only projects currently in fabrication.
  - **Completed Tab**: Displays finalized projects.
  - **All Jobs Tab**: Displays the entire history.
- **Add Job Button**: Opens a modal to register a new job with inputs: Job Number, Client Name, Site Address, and Quoted Fabrication Hours.
- **Ingest Excel Button**: Opens an upload dialog to parse and ingest structural member list Excel files.
- **Search Inputs**: Text filter matching Job Numbers or Client names.
- **Job Detail Overlay/Panel**: Shown upon selecting a job from the table. It has tabs:
  - **Details Tab**: Interactive grid of lots and members.
  - **Drawings Tab**: List of uploaded drawings with a file uploader input.
  - **Photos Tab**: Gallery of QA and site photos with a file uploader input.
- **Lot Management Controls**:
  - **Lot Status Dropdown**: Dropdown to select lot status (Design, Fabrication, Ready, Temp Installed, Finished).
  - **Install Date Picker**: Date input selector (`date_install`) to schedule lot installation.
  - **Reset Date Button**: Resets the install date to empty in the database.
  - **Print Lot Button**: Small printer icon to print a jobsheet for a single lot.
  - **Print All Button**: Top header printer icon to print a jobsheet for the entire job.
  - **Lot Bulk Actions (All Loaded, All On Site, All Finish)**: Buttons to set checkmarks of all members inside a lot to checked.
- **Member Toggle Checkboxes**: Interactive status badges (Design, Made, Loaded, On Site, TmpFix, Chemset, Tightened, Finish) to toggle progress (0 or 1).

### 2.4 User Workflows and Actions
- **Creating a New Job**: Click the Add Job button, fill out the form (Job Number, Client, Address, Hours), and click Save.
- **Ingesting Member Excel Sheets**: Select a job, click Ingest Excel, select the Excel spreadsheet conforming to the steel member format, and submit.
- **Uploading Drawings/Photos**: Go to the Drawings or Photos tab in the detail panel, choose a file via the uploader, and click Upload.
- **Scheduling Installation**: For a selected lot, select the date from the Install Date Picker and change the Lot Status Dropdown. Changes save automatically. Click Reset Date if the schedule is cancelled.
- **Printing Jobsheets**: Click the printer icon next to a lot or at the top of the details panel. A new print popup window will load and automatically invoke the browser print dialog (`window.print()`).
- **Completing Members**: Click any stage badge (e.g. Design, Made, Finish) to toggle the stage. Administrators can click All Loaded, All On Site, or All Finish to tick the entire lot.

### 2.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/jobs/page.js`
- **Backend API**: `/api/jobs`, `/api/jobs/{job_number}/details`, `/api/jobs/{job_number}/install-dates`
- **Database Tables**: `tb_jobs`, `tb_jobs_details`, `tb_jobs_date_install`, `tb_photos`, `tb_wip`

---

## 3. Monthly/Weekly Plan (/dashboard/weekly-plan)

### 3.1 Overview
The Production Plan board displays a week-by-week calendar matrix mapping active fabricators and welders to assigned jobs on specific weekdays. It serves as the primary scheduling tool for shop floor capacity management.

### 3.2 Access Control and Roles
- **View Access**: All users.
- **Edit Access**: Level 10+ Admins can drag and drop jobs or write weekly notes.

### 3.3 UI Components and Control Elements
- **Week Navigator**: Left (ChevronLeft) and Right (ChevronRight) arrow buttons to jump to the previous or next week.
- **Quick Jump Presentation Buttons**: Quick-filters pointing to historical dates with dense schedules (e.g. 2020-11-25, 2021-11-25) to jump instantly.
- **Employee Matrix Grid**: Rows represent active shop floor employees. Columns represent weekdays (Monday to Friday).
  - **Plan Card**: Colored block indicating an assigned job. Includes the Job Number and client name.
- **Weekly Coordination Note Section**: A text area at the bottom to input coordination notes for the selected week.
- **Save Note Button**: Saves the weekly notes to the database.

### 3.4 User Workflows and Actions
- **Allocating Workers to Jobs**: Drag a job card from the active projects list and drop it onto the grid cell corresponding to a specific worker and day.
- **Reassigning/Removing Tasks**: Drag an allocated job card to a different employee/day cell or drag it back to the unassigned list.
- **Writing Weekly Notes**: Click on the notes field at the bottom, type the coordination plan, and click the Save Note button.

### 3.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/weekly-plan/page.js`
- **Backend API**: `/api/tasks/active`, `/api/dev/random-date`
- **Database Tables**: `tb_production_plan`, `tb_week_notes`, `tb_login`

---

## 4. Whiteboard Tasks (/dashboard/whiteboard)

### 4.1 Overview
The Whiteboard is a kanban board organizing employee tasks. It is grouped vertically by employees, allowing supervisors to assign, reschedule, and delete tasks dynamically.

### 4.2 Access Control and Roles
- **Level 1 to 5 Employees**: Read-only access. Drag-and-drop actions are disabled, and New Task/Edit/Delete actions are hidden. An warning banner (Read-Only Mode) is shown.
- **Level 10+ Admins**: Full read-write CRUD access.

### 4.3 UI Components and Control Elements
- **Week Navigation controls**: Navigation buttons to swap calendar weeks.
- **Quick Jump Presentation Buttons**: Buttons pointing to dense historical weeks (e.g., 2021 W27, 2021 W39) for demonstration purposes.
- **Add Task Button**: Opens a modal to assign a task with input fields: Employee, Instruction Text, and Site Address.
- **Task Cards**: Display the task instructions and site location.
  - **Edit Icon**: Opens the edit modal.
  - **Delete Icon**: Deletes the task after confirmation.

### 4.4 User Workflows and Actions
- **Adding a Task**: Click Add Task, select the employee, type the instructions and location, and save.
- **Moving Tasks**: Drag a task card from one employee column and drop it into another employee column.
- **Editing a Task**: Click the pencil icon on the card, update the form, and save.
- **Deleting a Task**: Click the trashcan icon on the card and confirm the deletion.

### 4.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/whiteboard/page.js`
- **Backend API**: `/api/tasks`
- **Database Tables**: `tb_tasks`, `tb_login`

---

## 5. QA WIP Inspections (/dashboard/qa-wip)

### 5.1 Overview
The QA WIP module provides structural steel quality inspections. Quality inspectors evaluate welded steel members, marking them as Pass, or failing them with Non-Conformance Reports (NCR) which automatically trigger re-fabrication tasks.

### 5.2 Access Control and Roles
- **All Users**: Can search and select jobs.
- **Inspectors/Admins**: Can perform Pass/Fail inspections, write NCR logs, toggle WIP complete, and print inspection reports.

### 5.3 UI Components and Control Elements
- **Job Selector List**: Left sidebar table of jobs with WIP items.
- **WIP Complete Toggle Button**: Top right header button. Shows Mark WIP Complete (ShieldCheck icon) if incomplete, or Reset WIP (RotateCcw icon) if complete.
- **Print Report Button**: Generates a formal A4-styled QA inspection certificate for the selected job.
- **WIP Items Table**:
  - **Columns**: Member, Description, Drawing Number, Size, Steel Grade, Rework Version (e.g. Rework v2), Status.
  - **Pass Button**: Green button to certify the member has passed quality inspections.
  - **Fail NCR Button**: Red button to record a weld failure.
- **NCR Modal Dialog**:
  - **NCR Comment Input**: Text area to write details about the weld defect.
  - **Submit NCR Button**: Logs the failure and increments the member version.

### 5.4 User Workflows and Actions
- **Selecting a Job**: Click on a job in the left sidebar to display its pending inspection members.
- **Approving a Member**: Click Pass on the member row. The item is marked as approved and cleared from the active WIP list.
- **Failing a Member**:
  1. Click Fail NCR on the member row.
  2. In the modal, write the weld defect reason (e.g., Lack of fusion at web plate).
  3. Click Submit NCR.
  4. The system increments the rework version (e.g., Rework v1 -> Rework v2) and creates a new rework task on the Whiteboard.
- **Finalizing QA for a Job**: Click Mark WIP Complete when all members are certified. Click Reset WIP if you need to rollback the QA completion status.
- **Printing Report**: Click Print Report to open the browser dialog and save as PDF.

### 5.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/qa-wip/page.js`
- **Backend API**: `/api/qa/jobs`, `/api/qa/wip/{job_number}`, `/api/qa/inspect`, `/api/qa/wip-complete/{job_number}`
- **Database Tables**: `tb_wip`, `tb_jobs`, `tb_jobs_details`, `tb_tasks`

---

## 6. Employees Directory (/dashboard/employees)

### 6.1 Overview
The Employees Directory administers employee credentials, shop floor welding bay assignments, system security access levels, profile pictures, and safety certificates.

### 6.2 Access Control and Roles
- **All Users**: Read-only directory view.
- **Admin Users (Level 10+)**: Full CRUD management of employee profiles.
- **Super Admins (Level 99)**: Can modify system permissions level configurations.

### 6.3 UI Components and Control Elements
- **Status Tabs**:
  - **Active Workforce Tab**: Lists current employees.
  - **Retired/Inactive Tab**: Lists retired or disabled accounts.
- **Add Employee Button**: Opens a modal to register a new user.
- **Employee Card**:
  - **Avatar Image**: Displays the user profile picture. Includes a Camera overlay button to upload a replacement photo.
  - **Edit Button**: Opens the user profile edit modal.
  - **Random Password Generator Button**: Key icon button. Generates an 8-character temporary password and displays it in a modal.
  - **Status Badges**: Role (Welder, Fabricator, Office), Access Level (Level 1, 2, 10, 99), Bay Number, and Shop Label.

### 6.4 User Workflows and Actions
- **Adding an Employee**: Click Add Employee, fill in the credentials (Login ID, Firstname, Surname, Role, Access Level), and save.
- **Uploading an Avatar**: Click the Camera icon overlay on an employee avatar, select an image file, and confirm upload. The image is saved to the server and refreshed.
- **Resetting a Password**: Click the Key icon on the employee card. Write down the 8-character random password generated and give it to the user.
- **Updating Permissions and Roles**: Click Edit on the employee card. Adjust Role, Access Level, welding Bay Number, or check Retired to disable the account. Save changes.

### 6.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/employees/page.js`
- **Backend API**: `/api/employees`, `/api/employees/{emp_id}/avatar`, `/api/employees/{emp_id}/random-password`
- **Database Tables**: `tb_login`

---

## 7. Vehicles Reminder (/dashboard/vehicles)

### 7.1 Overview
The Vehicles and Certifications module manages vehicle inspections (WOF, REGO, odometer tracking) and general company certifications (e.g. fire extinguishers, site safety documents).

### 7.2 Access Control and Roles
- **All Users**: Read-only list view.
- **Level 10+ Admins**: Add, edit, and delete vehicles and reminders.

### 7.3 UI Components and Control Elements
- **Fleet Warning Banner**: Displays red alerts if WOF or REGO metrics expire within 30 days.
- **Certification Warning Banner**: Displays orange alerts if other certification items are expiring.
- **Add Vehicle Button**: Modal form to add a vehicle (Plate Number, WOF date, REGO date, Service km, RUC km, Current ODO).
- **Add Certification Item Button**: Modal form to add general reminders (Name, Expiry Date, Comments).
- **Vehicles Table**: Lists all fleet assets with Edit and Delete controls.
- **Certifications Table**: Lists general items with expiration status badges (Valid, Expiring Soon, Expired, No Date). Includes Edit and Delete controls.

### 7.4 User Workflows and Actions
- **Adding a Vehicle**: Click Add Vehicle, enter the vehicle plate and parameters, and click Save.
- **Updating Vehicle Mileage (Odometer)**: Click Edit on a vehicle row, input the new Odometer value, update WOF/REGO dates if renewed, and click Save.
- **Managing General Reminders**: Click Add Certification Item, specify the safety equipment or document name and expiration date, and save.
- **Deleting Assets**: Click the Trashcan icon next to a vehicle or certification row, and confirm deletion.

### 7.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/vehicles/page.js`
- **Backend API**: `/api/reminders/vehicles`, `/api/reminders/others`
- **Database Tables**: `tb_reminder_vehicle`, `tb_reminder_other`

---

## 8. Punch Clock (/dashboard/punch)

### 8.1 Overview
The Punch Clock is the digital time card terminal located on the shop floor. Workers log their start/end shifts and register the specific structural steel piece they are fabricating.

### 8.2 Access Control and Roles
- **All Users**: Can punch in/out.
- **Active User Tracking**: Automatically tracks the session of the logged-in worker.

### 8.3 UI Components and Control Elements
- **Live New Zealand Clock**: Displays local NZ time in 24-hour format.
- **Punch In Button**: Green button. Registers shift start.
- **Punch Out Button**: Red button. Registers shift completion.
- **Job and Member Selection Dropdowns**:
  - **Job Dropdown**: List of active jobs.
  - **Member Element Dropdown**: List of fabrication items corresponding to the selected job.
- **Start Piece Fabrication Button**: Starts the timer for the selected piece.
- **Stop Piece Fabrication Button**: Stops the timer, saving the fabrication time.

### 8.4 User Workflows and Actions
- **Starting a Work Shift**: Click Punch In. The status changes to Active.
- **Fabricating a Specific Piece**:
  1. Select the Job from the dropdown.
  2. Select the Member from the element list.
  3. Click Start Piece. The terminal logs the timestamp and tracks the active fabrication.
  4. Once fabricated, click Stop Piece. The piece is recorded as Made/Finished, and hours are saved.
- **Ending a Work Shift**: Click Punch Out.

### 8.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/punch/page.js`
- **Backend API**: `/api/punch`
- **Database Tables**: `tb_punchsheet`, `tb_jobs_details`, `tb_jobs_date_install`

---

## 9. Timesheet Reports (/dashboard/timesheet)

### 9.1 Overview
The Timesheet Reports screen processes weekly hours for payroll. It displays clock-in logs and total hours worked per week.

### 9.2 Access Control and Roles
- **Regular Workers**: View only their own personal time cards.
- **Administrators (Level 10+)**: Can view all employees, filter by employee name and date, add manual time cards, edit entries, and export timesheets.

### 9.3 UI Components and Control Elements
- **Employee Filter**: Dropdown to select a worker (Admin only).
- **Week Selection Input**: Week/date picker to filter logs.
- **Add Manual Timecard Button**: Opens a modal to insert missing punch logs (Employee, Date, Time In, Time Out).
- **Export CSV Button**: Exports the current timesheet view as a CSV spreadsheet.
- **Timesheet Logs Table**:
  - **Columns**: Date, Clock In Time, Clock Out Time, Total Hours, Actions.
  - **Edit/Delete Buttons**: Edit or remove logs.

### 9.4 User Workflows and Actions
- **Viewing Timesheet Logs**: Adjust the Week Selection Input to review daily hours.
- **Manually Inserting logs**: Click Add Manual Timecard, fill in the date and times, and save.
- **Exporting Payroll CSV**: Filter the list by week/employee, and click Export CSV.

### 9.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/timesheet/page.js`
- **Backend API**: `/api/punch/timesheet`, `/api/export/punch`
- **Database Tables**: `tb_punchsheet`, `tb_login`

---

## 10. Performance Charts (/dashboard/performance)

### 10.1 Overview
Performance Charts provide productivity statistics. It tracks employee throughput by measuring total weight, element counts (beams, portals, columns), and fabrication times.

### 10.2 Access Control and Roles
- **View Access**: All logged-in users.

### 10.3 UI Components and Control Elements
- **Weekly Production Selectors**: Filter date inputs to evaluate productivity cycles.
- **Throughput Bar Charts**: Visualizes fabricated components compared against clock-in hours.
- **Leaderboard Grid**: Lists employees ranked by total tonnage fabricated.

### 10.4 User Workflows and Actions
- **Analyzing Fabrication Metrics**: Adjust filters to evaluate performance. Hover over chart bars to view total fabrication hours and piece counts.

### 10.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/performance/page.js`
- **Backend API**: `/api/performance/weekly`
- **Database Tables**: `tb_punchsheet`, `tb_login`, `tb_jobs_details`

---

## 11. Public Holidays Management (/dashboard/holidays)

### 11.1 Overview
Administrators log public holiday calendars to exclude these dates from workload capacity and delivery forecasting.

### 11.2 Access Control and Roles
- **Level 10+ Admins**: Full access.
- **Regular Staff**: Blocked with an Access Denied message.

### 11.3 UI Components and Control Elements
- **Add Holiday Button**: Opens a creation modal.
- **Holidays Table**:
  - **Columns**: Holiday Name, Start Date, End Date, Actions.
  - **Delete Button**: Trash icon to remove the calendar rule.

### 11.4 User Workflows and Actions
- **Adding a Public Holiday**:
  1. Click Add Public Holiday.
  2. Input the Name (e.g. Easter Monday).
  3. Select the Start Date and End Date.
  4. Click Save Holiday.
- **Deleting a Holiday**: Click the Trashcan icon next to a holiday and confirm.

### 11.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/holidays/page.js`
- **Backend API**: `/api/holidays`
- **Database Tables**: `tb_public_holidays`

---

## 12. Workload Planning (/dashboard/workload)

### 12.1 Overview
The Workload Planning screen forecasts shop floor bottlenecks. It maps estimated fabrication hours for remaining jobs against available staff and holidays over a 30-day timeline.

### 12.2 Access Control and Roles
- **View Access**: All users.

### 12.3 UI Components and Control Elements
- **Parameters Control Panel**:
  - **Hours Per Day Dropdown**: Adjusts shifts (8 to 12 hours).
  - **Fabricators Count Dropdown**: Adjusts available fabricators (1 to 8).
- **Metrics Overview Cards**:
  - **Estimated Backlog Card**: Hours for approved, unmade members.
  - **Total Remaining Hours Card**: Hours for all remaining members.
- **30-Day Forecast Grids**:
  - **Drawings Approved Grid**: Backlog timeline for approved details.
  - **All Jobs Grid**: Total backlog timeline.
  - **Color Codes**: Red (busy/over-capacity), Yellow (partial day completion), Green (idle/available), Grey (weekend/holiday).

### 12.4 User Workflows and Actions
- **Simulating Capacity Adjustments**: Select a higher Hours Per Day (e.g. 10 hours) or increase Fabricators Count to see capacity adjustments. The grid color blocks will recalculate.

### 12.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/workload/page.js`
- **Backend API**: `/api/workload/plan`
- **Database Tables**: `tb_jobs`, `tb_jobs_details`, `tb_jobs_date_install`, `tb_punchsheet`, `tb_public_holidays`, `tb_leaves`

---

## 13. Timeline Activity Logs (/dashboard/activity)

### 13.1 Overview
The Live Timeline Activity log lists shop floor operations in real time, showing active employee logins, shift actions, and active fabrication details.

### 13.2 Access Control and Roles
- **View Access**: All users.

### 13.3 UI Components and Control Elements
- **Auto-Refresh Toggle Switch**: Enables/disables automatic 5-second refreshes.
- **Activity Table**:
  - **Columns**: Date/Time, Employee, Action, Job, Description.

### 13.4 User Workflows and Actions
- **Real-time Monitoring**: Toggle Auto-Refresh on to view operations. Hover over rows to view member details.

### 13.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/activity/page.js`
- **Backend API**: `/api/activity`
- **Database Tables**: `tb_punchsheet`, `tb_login`, `tb_jobs_details`

---

## 14. Database and Diagnostics (/dashboard/admin-db)

### 14.1 Overview
The Database Console is a diagnostics workshop for system administrators. It features database inspections, seeding tools, and an interactive ERD schema diagram.

### 14.2 Access Control and Roles
- **Super Administrators (Level 99)**: Full access.
- **All Others**: Blocked with an Access Denied message.

### 14.3 UI Components and Control Elements
- **Maintenance Actions Panel**:
  - **Integrity Check Button**: Evaluates SQLite database integrity.
  - **Seed Database Button**: Injects mock test data.
  - **Clean Database Button**: Wipes transactional records.
  - **Reset Passwords Button**: Resets user passwords to defaults.
  - **Migrate Legacy Data Button**: Runs data migration scripts.
- **Table Explorer Dropdown**: Selects a database table to browse its schema and rows.
- **Interactive Mermaid ERD Panel**: Displays the database schema diagram.
  - **Zoom In / Zoom Out Controls**: Adjusts diagram size.
  - **Reset View Button**: Resets diagram position.

### 14.4 User Workflows and Actions
- **Browsing Database Tables**: Select a table from the Explorer dropdown. Use the pagination buttons to view rows.
- **Running Diagnostics**: Click Integrity Check.
- **Seeding Test Data**: Click Seed Database and confirm.
- **Wiping Database**: Click Clean Database and confirm.

### 14.5 Technical Reference
- **Frontend File**: `fe/src/app/dashboard/admin-db/page.js`
- **Backend API**: `/api/admin/db_inspect/*`, `/api/admin/db_integrity`, `/api/admin/db_seed`
- **Database Tables**: All SQLite tables (dynamic lookup)
