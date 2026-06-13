"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useActivity } from '../../../hooks/useActivity';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Activity, 
  RefreshCw, 
  Clock, 
  User, 
  Briefcase, 
  Play, 
  Square,
  AlertTriangle
} from 'lucide-react';
import DevHints from '../../../components/common/DevHints';

export default function ActivityPage() {
  const { user: currentUser } = useAuth();
  const { activities, loading, error, fetchActivity } = useActivity();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const autoRefreshInterval = useRef(null);

  const loadData = useCallback(() => {
    fetchActivity(100);
  }, [fetchActivity]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Auto Refresh logic
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshInterval.current = setInterval(() => {
        loadData();
      }, 5000); // refresh every 5 seconds
    } else {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    }

    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, [autoRefresh, loadData]);

  if (!currentUser) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-zinc-500 text-sm">
        Loading user context...
      </div>
    );
  }

  // Helper function to render status badges
  const renderStatusBadge = (status) => {
    const isStart = status === 'START' || status === 'CLOCK IN';
    
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
        isStart 
          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50' 
          : 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
      }`}>
        {isStart ? (
          <Play className="w-2.5 h-2.5 fill-emerald-400" />
        ) : (
          <Square className="w-2.5 h-2.5 fill-zinc-400 text-zinc-400" />
        )}
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100 h-full flex flex-col">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-zinc-400" />
            <span>Live Shop Activity Logs</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time shop floor activity tracking and job punch log streams
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Auto Refresh Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
            <input 
              type="checkbox" 
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-white focus:ring-0 cursor-pointer w-3.5 h-3.5"
            />
            <span className="text-xs font-semibold text-zinc-300">Auto Refresh (5s)</span>
          </label>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 rounded-lg text-xs font-semibold cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200 flex-shrink-0">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Activity Table view */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[300px]">
        <div className="flex-1 overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse min-w-[800px] text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[10px] uppercase font-bold text-zinc-400">
                <th className="p-4 w-48">Timestamp</th>
                <th className="p-4 w-56">Employee</th>
                <th className="p-4 w-32">Status Action</th>
                <th className="p-4 w-40">Job / Detail</th>
                <th className="p-4">Active Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {loading && activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500 font-medium">
                    Loading shopfloor log stream...
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500 font-medium">
                    No active punch log records found.
                  </td>
                </tr>
              ) : (
                activities.map((log) => {
                  const logDate = `${log.year}-${log.month}-${String(log.day).padStart(2, '0')}`;
                  const isClock = log.job_detail_id === 'CLOCK IN' || log.job_detail_id === 'CLOCK OUT';
                  const timeStr = log.startstop === 'START' || log.startstop === 'CLOCK IN' 
                    ? log.start_time 
                    : log.stop_time;

                  return (
                    <tr key={log.id} className="hover:bg-zinc-800/10 transition-colors">
                      {/* Date & Time */}
                      <td className="p-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2 font-mono font-semibold text-zinc-300">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{logDate} {timeStr || ''}</span>
                        </div>
                      </td>
                      {/* Employee name */}
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-white">
                            {log.firstname ? log.firstname[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{log.firstname} {log.surname}</p>
                            <p className="text-[9px] text-zinc-500">{log.role}</p>
                          </div>
                        </div>
                      </td>
                      {/* Status action badge */}
                      <td className="p-4 align-middle">
                        {renderStatusBadge(log.startstop)}
                      </td>
                      {/* Job identifier */}
                      <td className="p-4 align-middle">
                        {isClock ? (
                          <span className="text-[10px] bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-zinc-500 font-semibold uppercase">
                            System Check
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                            <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Job {log.job_no || 'N/A'}</span>
                          </div>
                        )}
                      </td>
                      {/* Description of what is being fabricated */}
                      <td className="p-4 align-middle text-zinc-400 font-medium leading-relaxed">
                        {isClock ? (
                          <span>Employee checked {log.startstop.toLowerCase()} system portal.</span>
                        ) : (
                          <span>Fabricating member element: <strong className="text-zinc-300 font-bold">{log.member || 'Unknown Component'}</strong></span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DevHints 
        title="Timeline Activity Logs"
        fe={['fe/src/app/dashboard/activity/page.js']}
        be={['core/api_router.py (/api/activity)']}
        db={['tb_punchsheet', 'tb_login', 'tb_jobs_details']}
        condition="Live log feed of shop floor operations, displaying which workers are actively fabrication pieces, with customizable 5-second interval auto-refresh."
      />
    </div>
  );
}
