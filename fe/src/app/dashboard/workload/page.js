"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../../../services/apiClient';
import { 
  BarChart2, 
  RefreshCw, 
  AlertTriangle,
  Users,
  Clock,
  Layers
} from 'lucide-react';
import DevHints from '../../../components/common/DevHints';

const HOURS_OPTIONS = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
const FAB_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function WorkloadPlanPage() {
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [nbFabricators, setNbFabricators] = useState(5);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  const fetchPlan = useCallback(async (hours, fabs) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/api/workload/plan', {
        params: { hours_per_day: hours, nb_fabricators: fabs }
      });
      if (res.data?.status === 'success') {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load workload plan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan(hoursPerDay, nbFabricators);
  }, [fetchPlan, hoursPerDay, nbFabricators]);

  const handleHoursChange = (val) => {
    setHoursPerDay(parseFloat(val));
  };

  const handleFabChange = (val) => {
    setNbFabricators(parseInt(val));
  };

  // 셀 색상 결정: 공수 잔여 → Red/Yellow/Green, 비작업일 → Grey
  function getCellColor(hoursNeeded, dayAvailableCount, hoursPerDayVal, isWorking, employeeAvail) {
    if (!isWorking || !employeeAvail) return 'grey';
    if (hoursNeeded <= 0) return 'green';
    const dayOutput = hoursPerDayVal * dayAvailableCount;
    if (hoursNeeded > dayOutput) return 'red';
    return 'yellow';
  }

  function calcGrid(fabHours, calendar, employees, hoursPerDayVal, nbFabsParam) {
    // 실제 출근 직원 있는 경우: 직원별 가용성 기반
    // 없는 경우: 정적 fabricator 수 기반
    const useRealEmployees = employees.length > 0;
    const rows = [];

    if (useRealEmployees) {
      // 각 날짜별 출근 가능 직원 수 배열
      const dayAvailCount = calendar.map((day, di) => {
        if (!day.is_working) return 0;
        return employees.filter(e => e.availability[di]).length;
      });

      employees.forEach(emp => {
        let hoursNeeded = fabHours;
        const cells = calendar.map((day, di) => {
          const empAvail = emp.availability[di];
          const avail = dayAvailCount[di];

          if (!day.is_working || !empAvail) {
            // Non-working or employee not available - grey
            // Still deduct from hoursNeeded if others work (handled below)
            return { color: 'grey', hours: null };
          }

          if (hoursNeeded <= 0) {
            return { color: 'green', hours: null };
          }

          const dayOutput = hoursPerDayVal * avail;
          if (hoursNeeded > dayOutput) {
            hoursNeeded -= dayOutput;
            return { color: 'red', hours: hoursPerDayVal };
          } else {
            const lastDayHours = avail > 0 ? hoursNeeded / avail : 0;
            hoursNeeded = 0;
            return lastDayHours > 0
              ? { color: 'yellow', hours: Math.round(lastDayHours * 100) / 100 }
              : { color: 'green', hours: null };
          }
        });
        rows.push({ label: emp.name, cells });
      });
    } else {
      // 정적 fabricator 수 기반
      for (let a = 1; a <= nbFabsParam; a++) {
        let hoursNeeded = fabHours;
        const cells = calendar.map((day) => {
          if (!day.is_working) return { color: 'grey', hours: null };
          if (hoursNeeded <= 0) return { color: 'green', hours: null };

          const dayOutput = hoursPerDayVal * nbFabsParam;
          if (hoursNeeded > dayOutput) {
            hoursNeeded -= dayOutput;
            return { color: 'red', hours: hoursPerDayVal };
          } else {
            const lastDayHours = nbFabsParam > 0 ? hoursNeeded / nbFabsParam : 0;
            hoursNeeded = 0;
            return lastDayHours > 0
              ? { color: 'yellow', hours: Math.round(lastDayHours * 100) / 100 }
              : { color: 'green', hours: null };
          }
        });
        rows.push({ label: `Fabricator ${a}`, cells });
      }
    }
    return rows;
  }

  const colorClass = {
    red: 'bg-red-700 text-white',
    yellow: 'bg-amber-400 text-zinc-900',
    green: 'bg-green-700 text-white',
    grey: 'bg-zinc-700 text-zinc-400'
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-blue-400" />
            <span>Workload Plan</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            30-day fabrication capacity forecast based on approved drawings and available workforce
          </p>
        </div>
        <button
          onClick={() => fetchPlan(hoursPerDay, nbFabricators)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-zinc-400 whitespace-nowrap">Hours per day:</label>
          <select
            id="workload-hours-select"
            value={hoursPerDay}
            onChange={(e) => handleHoursChange(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            {HOURS_OPTIONS.map(h => (
              <option key={h} value={h}>{h} hrs</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-zinc-400 whitespace-nowrap">Fabricators:</label>
          <select
            id="workload-fab-select"
            value={nbFabricators}
            onChange={(e) => handleFabChange(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            {FAB_OPTIONS.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        {data && (
          <div className="ml-auto flex items-center gap-3 text-xs text-zinc-500">
            <Users className="w-4 h-4" />
            <span>{data.employee_count} employee{data.employee_count !== 1 ? 's' : ''} clocked in today</span>
            {data.employee_count === 0 && (
              <span className="text-amber-400 font-semibold">(using static fabricator count)</span>
            )}
          </div>
        )}
      </div>

      {data && (
        <>
          {/* Stats Cards - Drawings made & approved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 1: Drawings approved, not yet fabricated */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Drawings Approved - Not Yet Fabricated
              </h2>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-amber-400">{data.fab_hours_detailed}</span>
                <span className="text-sm text-zinc-500 mb-1">hours required</span>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] text-zinc-400">
                <span className="bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  {data.member_counts_detailed.portal} Portal(s)
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  {data.member_counts_detailed.beam} Beam(s)
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  {data.member_counts_detailed.column} Post(s)
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  {data.member_counts_detailed.other} Other(s)
                </span>
              </div>
            </div>

            {/* Section 2: All jobs, not yet fabricated */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                All Jobs - Drawings Not Made or Not Approved
              </h2>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-zinc-300">{data.fab_hours_all}</span>
                <span className="text-sm text-zinc-500 mb-1">hours required</span>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] text-zinc-400">
                <span className="bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  {data.member_counts_all.portal} Portal(s)
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  {data.member_counts_all.beam} Beam(s)
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  {data.member_counts_all.column} Post(s)
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  {data.member_counts_all.other} Other(s)
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-red-700 inline-block"></span>
              <span className="text-zinc-400">Busy (full day)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-amber-400 inline-block"></span>
              <span className="text-zinc-400">Last day (partial)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-green-700 inline-block"></span>
              <span className="text-zinc-400">Free</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-zinc-700 inline-block"></span>
              <span className="text-zinc-400">Weekend / Holiday / Leave</span>
            </span>
          </div>

          {/* Grid Table - Drawings Approved */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Forecast Grid — Drawings Approved ({data.fab_hours_detailed} hrs)
            </h3>
            <WorkloadGrid
              fabHours={data.fab_hours_detailed}
              calendar={data.calendar}
              employees={data.employees}
              hoursPerDay={data.hours_per_day}
              nbFabricators={data.nb_fabricators}
              colorClass={colorClass}
              calcGrid={calcGrid}
            />
          </div>

          {/* Grid Table - All Jobs */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              Forecast Grid — All Jobs ({data.fab_hours_all} hrs)
            </h3>
            <WorkloadGrid
              fabHours={data.fab_hours_all}
              calendar={data.calendar}
              employees={data.employees}
              hoursPerDay={data.hours_per_day}
              nbFabricators={data.nb_fabricators}
              colorClass={colorClass}
              calcGrid={calcGrid}
            />
          </div>
        </>
      )}

      {loading && !data && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center text-zinc-500 text-sm">
          Calculating workload plan...
        </div>
      )}

      <DevHints 
        title="Workload Planning"
        fe={['fe/src/app/dashboard/workload/page.js']}
        be={['core/api_router.py (/api/workload/plan)']}
        db={['tb_jobs', 'tb_jobs_details', 'tb_jobs_date_install', 'tb_punchsheet', 'tb_public_holidays', 'tb_leaves']}
        condition="Aggregates estimated fabrication and installation hours per lot mapped to weekly install date schedules to forecast capacity bottlenecks."
      />
    </div>
  );
}

function WorkloadGrid({ fabHours, calendar, employees, hoursPerDay, nbFabricators, colorClass, calcGrid }) {
  const rows = calcGrid(fabHours, calendar, employees, hoursPerDay, nbFabricators);

  if (rows.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-xs">
        No active fabricators or hours data available.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="text-[10px] border-collapse w-full min-w-max">
          <thead>
            <tr className="bg-zinc-950/70 border-b border-zinc-800">
              <th className="p-2 text-left text-zinc-400 font-bold w-32 min-w-[120px] sticky left-0 bg-zinc-950/90 z-10">
                Employee
              </th>
              {calendar.map((day, i) => (
                <th
                  key={i}
                  className={`p-1 text-center font-bold min-w-[36px] ${
                    day.is_working ? 'text-zinc-300' : 'text-zinc-600'
                  }`}
                >
                  <div>{day.day_name}</div>
                  <div className="font-normal text-[9px]">{day.day_number}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-zinc-800/50 hover:bg-zinc-800/10">
                <td className="p-2 font-semibold text-white sticky left-0 bg-zinc-900 z-10 border-r border-zinc-800">
                  {row.label}
                </td>
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`p-0 text-center font-bold ${colorClass[cell.color]}`}
                    style={{ height: '32px', minWidth: '36px' }}
                  >
                    {cell.hours != null && cell.hours > 0 ? (
                      <span className="text-[9px]">{cell.hours}</span>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
