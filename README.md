# Steelworks Manager - Enterprise React and FastAPI Management Platform

Steelworks Manager is a modern, full-stack enterprise management system designed specifically for structural steel fabrication and erection companies. It replaces manual scheduling, paper-based timecards, and fragmented quality tracking with a centralized, real-time control system.

Developed by Eungsoon (Brian) Park.

* **Live Web Demo**: [https://steelworks-manager-react.onrender.com](https://steelworks-manager-react.onrender.com)
* **Interactive CV WebView**: [https://steelworks-manager-react.onrender.com/resume](https://steelworks-manager-react.onrender.com/resume)

---

## 1. The Developer Story: Fusing Domain Expertise with AI Vibe Coding

This project is a flagship portfolio demonstrating the massive productivity gains realized when deep domain expertise meets AI-assisted software development.

### The Background
Brian Park spent over two decades in New Zealand's structural engineering industry, starting on the shop floor as a qualified welder and progressing to a senior structural steel detailer (designing complex 3D models in AutoCAD and Tekla Structures). 

Following the economic downturn in Auckland in late 2025, Brian transitioned his focus to IT and systems automation. Having previously designed and contributed to a legacy PHP-based production tracking app used in real-world fabrication yards, Brian took on the challenge of rewriting and upgrading the system into a modern, production-ready React and FastAPI stack.

### The Migration Planning & AI Synergy (Vibe Coding)
Instead of a simple code rewrite, Brian architected a **4-Phase Hybrid Migration Strategy** (documented in [skills-for-migration-plan/docs/002_design/](file:///f:/pe/public_html/steelworks-manager-react/skills-for-migration-plan/docs/002_design/)) before moving any logic. The migration blueprint covered structural boundary mapping, schema transition, and API compatibility strategies. 

Using AI coding assistants (Gemini and Claude) under a vibe coding model, Brian implemented this design with advanced validation "Quality Gates" to guarantee zero data loss and automated dynamic mapping for active shopfloor logins. The migration—including modern state management, high-performance API routers, database diagnostic consoles, and print-ready quality reporting modules—was completed in record time. This project stands as proof of his ability to analyze complex domain requirements, plan robust architectures, and rapidly deploy software using the latest AI methodologies.

---

## 2. Key Modules and Features

The platform is split into 14 core functional modules:

- **Dashboard Home**: Provides key operational indicators (active jobs count, average progress rate, QA lot checks) alongside New Zealand fleet compliance (WOF/REGO dates) and welder safety certification alerts.
- **Jobs Management**: Administers structural project lifecycles. Supports bulk importing detail lists from Excel sheets, uploading engineering drawings/quality photographs, setting erection schedules, and tracking item statuses.
- **Monthly/Weekly Plan**: A drag-and-drop scheduling board where supervisors map fabricators and welders to active jobs on specific weekdays.
- **Whiteboard Tasks**: A kanban tasks board grouped by employee, featuring strict write-access guards that put regular field workers in Read-Only Mode.
- **QA WIP Inspections**: Quality control dashboard for structural welding inspections. Logs pass actions or records weld defects with Non-Conformance Reports (NCR), which automatically increment rework versions and generate new whiteboard correction tasks.
- **Employees Directory**: Manages workforce details, security rights (Levels 1 to 99), shop labels, welding bay numbers, profile avatars, and features an 8-character temporary random password generator.
- **Vehicles and Certifications**: Monitors vehicle mileage, next service dates, and safety certificates (e.g. fire extinguisher expirations), raising alerts for dates expiring within 30 days.
- **Punch Clock**: Shop floor terminal tracking shift check-ins and check-outs, allowing workers to log fabrication times on individual steel members.
- **Timesheet Reports**: Weekly timesheets that allow admins to review employee logs, insert manual corrections, and export timesheets as Excel-ready CSV files.
- **Performance Charts**: Leaderboards ranking welders and fabricators by total fabricated tonnage and element types (beams, columns, portals).
- **Public Holidays Management**: Excludes public holidays from weekly scheduling capacity and workload forecasting.
- **Workload Planning**: Forecasts production bottlenecks 30 days into the future by mapping estimated backlog hours against active staff counts and calendar holiday rules.
- **Timeline Activity Logs**: Real-time live log timeline of shop floor operations with 5-second auto-refresh.
- **Database Console**: Diagnostic panel for administrators featuring SQLite database integrity tests, database wiping, mock seeder triggers, schema explorer, and an interactive Mermaid ERD database diagram with pan & zoom.

---

## 3. Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS (or clean CSS variables), Lucide icons, Axios, JWT authorization.
- **Backend**: FastAPI (Python 3.10+), SQLite3, PyJWT, bcrypt, uvicorn.

---

## 4. Directory Structure

```
steelworks-manager-react/
├── core/                       # Backend API Core
│   ├── api/                    # 13 Modular sub-routers (Auth, Jobs, QA, etc.)
│   ├── db_client.py            # SQLite connection and query helper
│   ├── api_router.py           # Main FastAPI entry point & sub-router aggregator
│   └── system_guard.py         # Emoji filter & model protection guard
├── fe/                         # Frontend React Application
│   ├── src/
│   │   ├── app/                # Next.js pages & layouts
│   │   ├── components/         # Reusable UI elements (DevHints, Sidebar, Header)
│   │   ├── hooks/              # Custom React hooks (useJobs, useQA, etc.)
│   │   └── services/           # Axios apiClient configuration
│   ├── package.json
│   └── next.config.js
├── skills/                     # Business automation processing pipelines
├── static/                     # Compiled frontend bundles & file uploads
├── tests/                      # Testing suites & DB schema definitions
└── r.bat                       # Startup Windows Batch Script
```

---

## 5. Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### Setup and Running (Using r.bat)
The project includes a Windows batch script (`r.bat`) in the root directory that automatically terminates any conflicting processes on port 3701, starts the FastAPI Uvicorn backend, compiles the Next.js frontend, and launches the development server.

Simply open a terminal in the root folder and run:
```bash
r.bat
```

### Manual Backend Setup
1. Navigate to the root folder.
2. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn pydantic pyjwt bcrypt passlib
   ```
3. Run the database schema initialization:
   ```bash
   python tests/db_init.py
   ```
4. Start the FastAPI server:
   ```bash
   python run_api.py
   ```
   The API backend will run on `http://127.0.0.1:3701`.

### Manual Frontend Setup
1. Navigate to the `fe/` folder:
   ```bash
   cd fe
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

### Building for Production
To build the frontend static files and compile the bundle for deployment:
```bash
cd fe
npm run build
```
The optimized bundle will be compiled into the `static/` directory to be served directly by the FastAPI backend server.
