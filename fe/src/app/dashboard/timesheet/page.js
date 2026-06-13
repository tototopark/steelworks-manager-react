"use client";

import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';
import { useAuth } from '../../../hooks/useAuth';
import { Clipboard, FileSpreadsheet, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import DevHints from '../../../components/common/DevHints';

export default function TimesheetPage() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.right_level === 99;

  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [year, setYear] = useState("");
  const [week, setWeek] = useState("");
  const [devConfig, setDevConfig] = useState({ devHints: false });
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load employees if admin
  useEffect(() => {
    if (authLoading || !user) return;
    if (isAdmin) {
      apiClient.get('/api/employees?status=active')
        .then(res => {
          if (res.data && res.data.status === "success") {
            const list = res.data.data || [];
            setEmployees(list);
            if (list.length > 0 && !selectedEmp) {
              setSelectedEmp(list[0].id);
            }
          }
        })
        .catch(err => console.error("Failed to load employees", err));
    }
  }, [isAdmin, authLoading, user]);

  // Load dev config
  useEffect(() => {
    apiClient.get('/api/config/dev_features')
      .then(res => {
        if (res.data && res.data.status === 'success') {
          setDevConfig({ devHints: res.data.dev_hints });
        }
      })
      .catch(err => console.error("Failed to load dev config", err));
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `/api/punch/timesheet?`;
      if (selectedEmp) url += `employee_id=${selectedEmp}&`;
      if (year) url += `year=${year}&`;
      if (week) url += `week=${week}&`;

      const res = await apiClient.get(url);
      if (res.data && res.data.status === "success") {
        setLogs(res.data.data);
        if (res.data.year) setYear(res.data.year);
        if (res.data.week) setWeek(res.data.week);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch timesheet logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, selectedEmp, year, week]);

  const handleAutoSelectWeek = async () => {
    try {
      const res = await apiClient.get('/api/punch/latest_week');
      if (res.data && res.data.status === 'success') {
        const { year, week } = res.data;
        if (year && week) {
          setYear(year);
          setWeek(week);
        } else {
          alert("No logs found in the database.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch latest week", err);
      alert("Failed to auto-select week.");
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert("No data available to export.");
      return;
    }
    try {
      // CSV Headers matching the table columns
      const headers = ["Date", "Name", "Role", "Target / Member ID", "Action", "Start Time", "Stop Time"];
      
      const rows = logs.map(log => {
        const dayOfWeek = log.day_of_week || getDayOfWeekFallback(log.formatted_date);
        const dateStr = `${log.formatted_date}${dayOfWeek ? ` (${dayOfWeek})` : ''}`;
        const nameStr = `${log.firstname} ${log.surname}`;
        
        return [
          dateStr,
          nameStr,
          log.role || "",
          log.job_detail_id || "",
          log.startstop || "",
          log.start_time || "-",
          log.stop_time || "-"
        ];
      });

      // Join headers and rows with commas, wrapping values in double quotes
      const csvContent = [
        headers.join(","),
        ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      // Add UTF-8 BOM to prevent MS Excel character encoding issues
      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Filename reflecting current selection
      const filename = `timesheet_export_${year || 'all'}_W${week || 'all'}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Failed to export CSV file.");
    }
  };

  // Get English day of week fallback from YYYY-MM-DD string
  const getDayOfWeekFallback = (dateStr) => {
    if (!dateStr) return "";
    try {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(date.getTime())) {
          return days[date.getDay()];
        }
      }
      return "";
    } catch (e) {
      return "";
    }
  };

  if (authLoading) {
    return (
      <div className="p-12 text-center text-zinc-500 text-sm">
        Loading user session...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Clipboard className="w-6 h-6" />
            <span>Timesheet & Work Logs</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review punch records and export Excel logs for production.
          </p>
        </div>
        <div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Filter panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        {isAdmin ? (
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Employee</label>
            <select
              value={selectedEmp}
              onChange={(e) => setSelectedEmp(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 transition-colors"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstname} {emp.surname}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Employee</label>
            <input
              type="text"
              disabled
              value={`${user?.firstname} ${user?.surname}`}
              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-500 cursor-not-allowed"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase">Year</label>
          <input
            type="number"
            placeholder="e.g. 2021"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase">Week</label>
          <input
            type="number"
            placeholder="e.g. 46"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {devConfig.devHints && (
          <div className="h-[38px] flex items-center gap-2">
            <button
              onClick={handleAutoSelectWeek}
              className="px-3 h-[38px] bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-md"
            >
              Auto Week (Dev)
            </button>
          </div>
        )}
      </div>

      {devConfig.devHints && (
        <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Quick Dev Filters (Data Available):</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { year: 2021, week: 27, count: 1017 },
              { year: 2021, week: 39, count: 811 },
              { year: 2020, week: 40, count: 886 },
              { year: 2020, week: 39, count: 822 }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setYear(item.year);
                  setWeek(item.week);
                }}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-mono transition-all cursor-pointer"
              >
                {item.year} W{item.week} ({item.count} rows)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Logs Table Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-300">Punch Log History ({logs.length} entries)</h3>
          <button 
            onClick={fetchLogs} 
            disabled={loading}
            className="p-1 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-400 hover:text-white disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading && logs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm animate-pulse">
            Loading log entries...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm">
            No punch sheets recorded for the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-950/60 border-b border-zinc-800 text-zinc-400 uppercase font-semibold tracking-wider text-[10px]">
                  <th className="p-4">Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Target / Member ID</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Start Time</th>
                  <th className="p-4">Stop Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {(() => {
                  let dayGroupIndex = 0;
                  let lastDate = "";
                  return logs.map((log, index) => {
                    const dayOfWeek = log.day_of_week || getDayOfWeekFallback(log.formatted_date);
                    if (log.formatted_date && log.formatted_date !== lastDate) {
                      if (lastDate !== "") {
                        dayGroupIndex++;
                      }
                      lastDate = log.formatted_date;
                    }
                    const isEvenDayGroup = dayGroupIndex % 2 === 0;
                    const rowStyle = isEvenDayGroup 
                      ? { backgroundColor: '#131316' } 
                      : { backgroundColor: '#222227' };

                    return (
                      <tr 
                        key={log.id} 
                        style={rowStyle}
                        className="hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="p-4 font-mono font-medium text-zinc-300">
                          {log.formatted_date} {dayOfWeek && `(${dayOfWeek})`}
                        </td>
                        <td className="p-4 font-bold text-white">{log.firstname} {log.surname}</td>
                        <td className="p-4 text-zinc-400">{log.role}</td>
                        <td className="p-4 font-mono text-zinc-400">{log.job_detail_id}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            log.startstop === 'START' 
                              ? 'bg-blue-950/40 border border-blue-900 text-blue-400' 
                              : 'bg-rose-950/40 border border-rose-900 text-rose-400'
                          }`}>
                            {log.startstop}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-300 font-mono">{log.start_time || "-"}</td>
                        <td className="p-4 text-zinc-300 font-mono">{log.stop_time || "-"}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DevHints 
        title="Timesheet Reports"
        fe={['fe/src/app/dashboard/timesheet/page.js']}
        be={['core/api_router.py (/api/punch/timesheet)', 'core/api_router.py (/api/export/punch)']}
        db={['tb_punchsheet', 'tb_login']}
        condition="Weekly payroll summaries. Lower staff view only their own records, whereas admins can review all, filter by date/worker, and download CSV sheets."
      />
    </div>
  );
}
