"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';
import { useStaffReminders } from '../../hooks/useStaffReminders';
import DevHints from '../../components/common/DevHints';
import {
  Briefcase, 
  TrendingUp, 
  RefreshCw, 
  AlertTriangle,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { progressData, loading, error, refresh } = useDashboard();
  const { staffAlerts, fetchStaffExpiryAlerts } = useStaffReminders();
  const isAdmin = user?.right_level >= 10;
  const [pageActive, setPageActive] = useState(1);
  const [pageCompleted, setPageCompleted] = useState(1);
  const jobsPerPage = 50;

  useEffect(() => {
    if (isAdmin) {
      fetchStaffExpiryAlerts();
    }
  }, [isAdmin, fetchStaffExpiryAlerts]);

  // Extract jobs array if nested
  const activeJobs = progressData?.data || progressData?.active_jobs || progressData || [];
  
  // Sort jobs by job_number ascending
  const sortedJobs = [...activeJobs].sort((a, b) => a.job_number - b.job_number);

  // Split into Active (In Production) and Completed
  const inProductionJobs = sortedJobs.filter(j => j.progress_percent < 100);
  const completedJobs = sortedJobs.filter(j => j.progress_percent >= 100);

  // Pagination for Active Jobs
  const totalActive = inProductionJobs.length;
  const totalActivePages = Math.ceil(totalActive / jobsPerPage);
  const displayedActiveJobs = inProductionJobs.slice(
    (pageActive - 1) * jobsPerPage,
    pageActive * jobsPerPage
  );

  // Pagination for Completed Jobs
  const totalCompleted = completedJobs.length;
  const totalCompletedPages = Math.ceil(totalCompleted / jobsPerPage);
  const displayedCompletedJobs = completedJobs.slice(
    (pageCompleted - 1) * jobsPerPage,
    pageCompleted * jobsPerPage
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.firstname ? `${user.firstname} ${user.surname || ''} (${user.login})` : 'User'}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Here is what is happening in the workshop today.
          </p>
        </div>
        <div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Staff SiteSafe Expiry Alerts */}
      {isAdmin && staffAlerts.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Safety Certificate Warnings ({staffAlerts.length} employees)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {staffAlerts.map((s) => (
              <div key={s.id} className="bg-zinc-900/60 p-3 rounded-lg border border-amber-950/40 flex items-start justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{s.name}</p>
                  <p className="text-[10px] text-zinc-500">{s.role}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                  s.status === 'expired'
                    ? 'bg-red-900/40 text-red-400 border border-red-900/50'
                    : 'bg-amber-950/40 text-amber-400 border border-amber-900/50'
                }`}>
                  SiteSafe {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Shortcut Cards from App 1 (Modernized) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/dashboard/jobs" 
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between group transition-all shadow-md"
        >
          <div className="flex items-start justify-between w-full">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">Active Jobs</h4>
              <p className="text-xs text-zinc-500">Track steelwork projects</p>
            </div>
            <div className="p-2.5 bg-blue-950/40 text-blue-400 border border-blue-900/50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-zinc-850 pt-4 mt-4 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
            <span>Go to Jobs</span>
            <span className="font-mono">-&gt;</span>
          </div>
        </Link>

        <Link 
          href="/dashboard/employees" 
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between group transition-all shadow-md"
        >
          <div className="flex items-start justify-between w-full">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">Employees & Whiteboard</h4>
              <p className="text-xs text-zinc-500">Manage staff and tasks</p>
            </div>
            <div className="p-2.5 bg-zinc-850 text-zinc-400 border border-zinc-800 rounded-lg group-hover:bg-white group-hover:text-zinc-950 transition-all">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-zinc-850 pt-4 mt-4 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
            <span>Go to Employees</span>
            <span className="font-mono">-&gt;</span>
          </div>
        </Link>

        <Link 
          href="/dashboard/punch" 
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between group transition-all shadow-md"
        >
          <div className="flex items-start justify-between w-full">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">Punch Clock</h4>
              <p className="text-xs text-zinc-500">Track workshop hours</p>
            </div>
            <div className="p-2.5 bg-zinc-850 text-zinc-400 border border-zinc-800 rounded-lg group-hover:bg-white group-hover:text-zinc-950 transition-all">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-zinc-850 pt-4 mt-4 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
            <span>Go to Punch Clock</span>
            <span className="font-mono">-&gt;</span>
          </div>
        </Link>
      </div>

      {/* Side-by-Side Job Progress Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panel 1: In Production (Active) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-zinc-800 bg-zinc-950/30">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span>In Production Jobs</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Fabrication lot status (under 100% completed)</p>
            </div>
            
            {loading && !progressData ? (
              <div className="p-12 text-center text-zinc-500 text-sm animate-pulse">
                Loading production jobs...
              </div>
            ) : totalActive === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-sm">
                No active jobs currently in production.
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {displayedActiveJobs.map((job) => {
                  const label = `${job.progress_percent}% (${job.completed_details || 0}/${job.total_details || 0} pcs)`;
                  return (
                    <div key={job.job_number} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">#{job.job_number}</span>
                          <span className="font-semibold text-zinc-300 truncate max-w-[120px]">{job.company_name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 truncate max-w-[160px]">{job.site_address}</span>
                      </div>
                      {/* Progress bar container */}
                      <div className="w-full bg-zinc-950/60 rounded-lg h-7 border border-zinc-800 relative overflow-hidden flex items-center">
                        <div 
                          className="h-full rounded-l-md border-r border-blue-500 bg-blue-600/85 transition-all duration-500 flex items-center"
                          style={{ width: `${job.progress_percent > 0 ? job.progress_percent : 0}%` }}
                        />
                        <span className="absolute w-full text-center text-[10px] font-bold tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalActivePages > 1 && (
            <div className="p-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/10">
              <span>
                Showing {(pageActive - 1) * jobsPerPage + 1} - {Math.min(pageActive * jobsPerPage, totalActive)} of {totalActive} jobs
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPageActive(prev => Math.max(prev - 1, 1))}
                  disabled={pageActive === 1}
                  className="p-1.5 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-30 rounded-lg transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3">
                  Page {pageActive} of {totalActivePages}
                </span>
                <button
                  onClick={() => setPageActive(prev => Math.min(prev + 1, totalActivePages))}
                  disabled={pageActive === totalActivePages}
                  className="p-1.5 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-30 rounded-lg transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel 2: Completed */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-zinc-800 bg-zinc-950/30">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Completed Jobs</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Fabrication lot status (100% completed)</p>
            </div>
            
            {loading && !progressData ? (
              <div className="p-12 text-center text-zinc-500 text-sm animate-pulse">
                Loading completed jobs...
              </div>
            ) : totalCompleted === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-sm">
                No completed jobs currently.
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {displayedCompletedJobs.map((job) => {
                  const label = `100% COMPLETED (${job.total_details} parts)`;
                  return (
                    <div key={job.job_number} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">#{job.job_number}</span>
                          <span className="font-semibold text-zinc-300 truncate max-w-[120px]">{job.company_name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 truncate max-w-[160px]">{job.site_address}</span>
                      </div>
                      {/* Progress bar container */}
                      <div className="w-full bg-zinc-950/60 rounded-lg h-7 border border-zinc-800 relative overflow-hidden flex items-center">
                        <div 
                          className="h-full rounded-l-md border-r border-green-500 bg-green-600/85 transition-all duration-500 flex items-center"
                          style={{ width: '100%' }}
                        />
                        <span className="absolute w-full text-center text-[10px] font-bold tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalCompletedPages > 1 && (
            <div className="p-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/10">
              <span>
                Showing {(pageCompleted - 1) * jobsPerPage + 1} - {Math.min(pageCompleted * jobsPerPage, totalCompleted)} of {totalCompleted} jobs
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPageCompleted(prev => Math.max(prev - 1, 1))}
                  disabled={pageCompleted === 1}
                  className="p-1.5 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-30 rounded-lg transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3">
                  Page {pageCompleted} of {totalCompletedPages}
                </span>
                <button
                  onClick={() => setPageCompleted(prev => Math.min(prev + 1, totalCompletedPages))}
                  disabled={pageCompleted === totalCompletedPages}
                  className="p-1.5 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-30 rounded-lg transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DevHints 
        title="Dashboard"
        fe={['fe/src/app/dashboard/page.js', 'fe/src/hooks/useDashboard.js', 'fe/src/hooks/useStaffReminders.js']}
        be={['core/api_router.py (/api/dashboard/job_progress)', 'core/api_router.py (/api/reminders/staff/expiry-check)', 'skills/300_dashboard_pipeline.py']}
        db={['tb_jobs', 'tb_jobs_details', 'tb_login (SiteSafe)']}
        condition="Shows in-progress jobs (progress < 100) and completed jobs (progress >= 100) sorted by job number. Shows SiteSafe expiry warnings for admins."
      />
    </div>
  );
}
