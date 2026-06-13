"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import apiClient from '../../services/apiClient';

const HINTS_MAP = {
  '/dashboard': {
    title: 'Dashboard',
    fe: ['fe/src/app/dashboard/page.js', 'fe/src/hooks/useDashboard.js', 'fe/src/hooks/useStaffReminders.js'],
    be: ['core/api_router.py (/api/dashboard/job_progress)', 'core/api_router.py (/api/reminders/staff/expiry-check)', 'skills/300_dashboard_pipeline.py'],
    db: ['tb_jobs', 'tb_jobs_details', 'tb_login (SiteSafe)'],
    condition: 'Shows in-progress jobs (progress < 100) and completed jobs (progress >= 100) sorted by job number. Shows SiteSafe expiry warnings for admins.'
  },
  '/dashboard/jobs': {
    title: 'Jobs Management',
    fe: ['fe/src/app/dashboard/jobs/page.js', 'fe/src/hooks/useJobs.js'],
    be: ['core/api_router.py (/api/jobs)', 'core/api_router.py (/api/jobs/{job_number}/details)', 'core/api_router.py (/api/jobs/{job_number}/install-dates)', 'skills/010_job_pipeline.py'],
    db: ['tb_jobs', 'tb_jobs_details', 'tb_jobs_date_install', 'tb_photos', 'tb_wip'],
    condition: 'Recent 50 jobs list with query filters, new job creation, excel ingestion, photo/drawing uploads, lot status checkers, install date manager, and workorder sheet printing.'
  },
  '/dashboard/weekly-plan': {
    title: 'Monthly/Weekly Plan',
    fe: ['fe/src/app/dashboard/weekly-plan/page.js', 'fe/src/hooks/useCalendar.js'],
    be: ['core/api_router.py (/api/tasks/active)', 'core/api_router.py (/api/dev/random-date)', 'skills/020_task_pipeline.py'],
    db: ['tb_production_plan', 'tb_week_notes', 'tb_login'],
    condition: 'Maps production plans for active shop floor employees with drag-and-drop allocations, color priority coding, and customizable weekly notes.'
  },
  '/dashboard/whiteboard': {
    title: 'Whiteboard Tasks',
    fe: ['fe/src/app/dashboard/whiteboard/page.js', 'fe/src/hooks/useWhiteboard.js'],
    be: ['core/api_router.py (/api/tasks)', 'core/api_router.py (/api/dev/random-date)', 'skills/020_task_pipeline.py'],
    db: ['tb_tasks', 'tb_login'],
    condition: 'Task schedule drag-and-drop board. Low-level staff (right_level < 6) are placed in read-only mode (cards locked, no drag-drop, edit/delete hidden).'
  },
  '/dashboard/qa-wip': {
    title: 'QA WIP Inspections',
    fe: ['fe/src/app/dashboard/qa-wip/page.js', 'fe/src/hooks/useQA.js'],
    be: ['core/api_router.py (/api/qa/jobs)', 'core/api_router.py (/api/qa/wip/{job_number})', 'core/api_router.py (/api/qa/inspect)', 'core/api_router.py (/api/qa/wip-complete/{job_number})', 'skills/015_qa_pipeline.py'],
    db: ['tb_wip', 'tb_jobs', 'tb_jobs_details', 'tb_tasks'],
    condition: 'Quality inspections for structural steel welding. Logs pass status or raises NCR (Rework task auto-generates on Whiteboard and increments wip_version).'
  },
  '/dashboard/employees': {
    title: 'Employees Directory',
    fe: ['fe/src/app/dashboard/employees/page.js', 'fe/src/hooks/useEmployees.js'],
    be: ['core/api_router.py (/api/employees)', 'core/api_router.py (/api/employees/{emp_id}/avatar)', 'core/api_router.py (/api/employees/{emp_id}/random-password)'],
    db: ['tb_login'],
    condition: 'Manage workers. Admin features include profile edits, avatar uploads, deactivation/retirement, quick passwords reset, and unique hashed test credentials.'
  },
  '/dashboard/vehicles': {
    title: 'Vehicles Reminder',
    fe: ['fe/src/app/dashboard/vehicles/page.js', 'fe/src/hooks/useVehicles.js', 'fe/src/hooks/useOtherReminders.js'],
    be: ['core/api_router.py (/api/reminders/vehicles)', 'core/api_router.py (/api/reminders/vehicles/expiry-check)', 'core/api_router.py (/api/reminders/others)'],
    db: ['tb_reminder_vehicle', 'tb_reminder_other'],
    condition: 'Funnels vehicle fleet safety details (WOF/REGO dates, service intervals) and general certifications. Generates warnings for dates expiring within 30 days.'
  },
  '/dashboard/punch': {
    title: 'Punch Clock',
    fe: ['fe/src/app/dashboard/punch/page.js'],
    be: ['core/api_router.py (/api/punch)', 'skills/030_punch_pipeline.py'],
    db: ['tb_punchsheet', 'tb_jobs_details', 'tb_jobs_date_install'],
    condition: 'Attestation terminal for workers to clock in/out or begin specific lot member tasks. Completion of tasks auto-sets pieces to made/finished.'
  },
  '/dashboard/timesheet': {
    title: 'Timesheet Reports',
    fe: ['fe/src/app/dashboard/timesheet/page.js'],
    be: ['core/api_router.py (/api/punch/timesheet)', 'core/api_router.py (/api/export/punch)'],
    db: ['tb_punchsheet', 'tb_login'],
    condition: 'Weekly payroll summaries. Lower staff view only their own records, whereas admins can review all, filter by date/worker, and download CSV sheets.'
  },
  '/dashboard/performance': {
    title: 'Performance Charts',
    fe: ['fe/src/app/dashboard/performance/page.js'],
    be: ['core/api_router.py (/api/performance/weekly)'],
    db: ['tb_punchsheet', 'tb_login', 'tb_jobs_details'],
    condition: 'Calculates structural steel fabrication throughput quantities (beams, columns, portals) per employee mapped against cumulative clock hours.'
  },
  '/dashboard/holidays': {
    title: 'Public Holidays Management',
    fe: ['fe/src/app/dashboard/holidays/page.js', 'fe/src/hooks/useHolidays.js'],
    be: ['core/api_router.py (/api/holidays)'],
    db: ['tb_public_holidays'],
    condition: 'Allows administrators to configure public holiday dates to automatically bypass production planning capacity calculations.'
  },
  '/dashboard/workload': {
    title: 'Workload Planning',
    fe: ['fe/src/app/dashboard/workload/page.js'],
    be: ['core/api_router.py (/api/workload/plan)'],
    db: ['tb_jobs', 'tb_jobs_details', 'tb_jobs_date_install', 'tb_punchsheet', 'tb_public_holidays', 'tb_leaves'],
    condition: 'Aggregates estimated fabrication and installation hours per lot mapped to weekly install date schedules to forecast capacity bottlenecks.'
  },
  '/dashboard/activity': {
    title: 'Timeline Activity Logs',
    fe: ['fe/src/app/dashboard/activity/page.js'],
    be: ['core/api_router.py (/api/activity)'],
    db: ['tb_punchsheet', 'tb_login', 'tb_jobs_details'],
    condition: 'Live log feed of shop floor operations, displaying which workers are actively fabrication pieces, with customizable 5-second interval auto-refresh.'
  },
  '/dashboard/admin-db': {
    title: 'Database & Diagnostics',
    fe: ['fe/src/app/dashboard/admin-db/page.js', 'fe/src/hooks/useAdminDB.js'],
    be: ['core/api_router.py (/api/admin/db_inspect/*)', 'core/api_router.py (/api/admin/db_integrity)', 'core/api_router.py (/api/admin/db_seed)', 'skills/200_admin_pipeline.py'],
    db: ['Dynamic tables lookup', 'Interactive ERD schema visualization'],
    condition: 'Super admin workspace for data migration, diagnostics, mock seeding, and interactive ERD schema diagram exploration.'
  }
};

export default function DevHints({ title, fe, be, db, condition }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function checkDevFeatures() {
      try {
        const res = await apiClient.get('/api/config/dev_features');
        if (res.data && res.data.dev_hints) {
          setShow(true);
        }
      } catch (err) {
        console.error('Failed to load dev features config', err);
      }
    }
    checkDevFeatures();
  }, []);

  if (!show) return null;

  // If props are passed, use them. Otherwise, fall back to global map based on pathname.
  const hasProps = title || fe || be || db || condition;
  const hint = hasProps 
    ? {
        title: title || 'Custom Page',
        fe: fe || [],
        be: be || [],
        db: db || [],
        condition: condition || ''
      }
    : (HINTS_MAP[pathname] || HINTS_MAP['/dashboard']);

  return (
    <div className="mt-8 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs space-y-2 text-zinc-400">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
        <span className="font-bold text-zinc-200">Developer Hints ({hint.title})</span>
        <span className="text-[10px] text-zinc-500 font-mono">SHOW_DEV_HINTS = True</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-zinc-300 mb-1 text-[11px]">Frontend Files:</p>
          <ul className="list-disc list-inside space-y-0.5 font-mono text-[10px] text-blue-400">
            {hint.fe.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-zinc-300 mb-1 text-[11px]">Backend APIs / Files:</p>
          <ul className="list-disc list-inside space-y-0.5 font-mono text-[10px] text-purple-400">
            {hint.be.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800/60">
        <div>
          <p className="font-semibold text-zinc-300 mb-1 text-[11px]">DB Tables:</p>
          <ul className="list-disc list-inside space-y-0.5 font-mono text-[10px] text-emerald-400">
            {hint.db.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-zinc-300 mb-1 text-[11px]">Conditions & Notes:</p>
          <p className="text-[10px] text-zinc-300 font-sans">{hint.condition}</p>
        </div>
      </div>
    </div>
  );
}
