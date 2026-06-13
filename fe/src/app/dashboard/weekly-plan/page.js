"use client";

import { useState, useEffect, useCallback } from 'react';
import { useCalendar } from '../../../hooks/useCalendar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit3, 
  Calendar as CalendarIcon,
  AlertCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import apiClient from '../../../services/apiClient';
import DevHints from '../../../components/common/DevHints';

// Date utility functions
const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const formatDateString = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export default function WeeklyPlanPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()));
  const [selectedPlanDate, setSelectedPlanDate] = useState('');
  const [selectedPlanEmpId, setSelectedPlanEmpId] = useState('');
  const [selectedPlanEmpName, setSelectedPlanEmpName] = useState('');
  const [devConfig, setDevConfig] = useState({ devHints: false });
  
  // Note Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteDate, setNoteDate] = useState('');
  const [noteContent1, setNoteContent1] = useState('');
  const [noteContent2, setNoteContent2] = useState('');

  // Plan Assignment Modal state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planJobNumber, setPlanJobNumber] = useState('');
  const [planLot, setPlanLot] = useState('1');
  const [planPriority, setPlanPriority] = useState('1');

  const {
    scheduleData,
    employeesData,
    holidaysData,
    jobOptions,
    loading,
    error,
    fetchSchedule,
    updateNote,
    assignPlan
  } = useCalendar();

  // Generate 6 working days (Mon to Sat)
  const weekDays = Array.from({ length: 6 }).map((_, i) => addDays(currentWeekStart, i));
  const startDateStr = formatDateString(weekDays[0]);
  const endDateStr = formatDateString(weekDays[5]);

  const loadData = useCallback(() => {
    fetchSchedule(startDateStr, endDateStr);
  }, [fetchSchedule, startDateStr, endDateStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  // Navigate week
  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const handleToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  // Jump to random date with data for dev testing
  const handleRandomDateJump = async () => {
    try {
      const response = await apiClient.get('/api/dev/random-date?type=weekly');
      if (response.data && response.data.date) {
        const targetDate = new Date(response.data.date);
        setCurrentWeekStart(getMonday(targetDate));
      }
    } catch (err) {
      console.error('Failed to get random date', err);
    }
  };

  // Auto Week (Dev) Action
  const handleAutoSelectWeek = async () => {
    try {
      const res = await apiClient.get('/api/punch/latest_week');
      if (res.data && res.data.status === 'success') {
        const { year, week } = res.data;
        if (year && week) {
          // ISO Week 46 of 2021 date fallback or just jump to random date that has week plan
          const response = await apiClient.get('/api/dev/random-date?type=weekly');
          if (response.data && response.data.date) {
            const targetDate = new Date(response.data.date);
            setCurrentWeekStart(getMonday(targetDate));
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch latest week", err);
    }
  };

  // Note Modal Actions
  const openNoteModal = (dateStr, currentNote1 = '', currentNote2 = '') => {
    setNoteDate(dateStr);
    setNoteContent1(currentNote1);
    setNoteContent2(currentNote2);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async () => {
    const result = await updateNote(noteDate, noteContent1, noteContent2);
    if (result.success) {
      setIsNoteModalOpen(false);
      loadData();
    }
  };

  // Plan Assignment Modal Actions
  const openPlanModal = (dateStr, empId, empName) => {
    setSelectedPlanDate(dateStr);
    setSelectedPlanEmpId(empId);
    setSelectedPlanEmpName(empName);
    setPlanJobNumber(jobOptions[0]?.job_number || '');
    setPlanLot('1');
    setPlanPriority('1');
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async () => {
    if (!planJobNumber) return;
    const result = await assignPlan(selectedPlanDate, selectedPlanEmpId, planJobNumber, planLot, planPriority);
    if (result.success) {
      setIsPlanModalOpen(false);
      loadData();
    }
  };

  // Parse holidays, notes, employees, and plans from scheduleData and calendar states
  const holidays = holidaysData || [];
  const notes = scheduleData?.notes || {};
  const employees = employeesData || [];
  const plans = scheduleData?.plans || [];

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            <span>Monthly Production Plan</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Assign jobs and manage daily notes for welding bays
          </p>
        </div>
        <div className="flex items-center gap-2">
          {devConfig.devHints && (
            <>
              <button
                onClick={handleAutoSelectWeek}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-md"
              >
                Auto Week (Dev)
              </button>
              <button
                onClick={handleRandomDateJump}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Jump to Active Date (Dev)
              </button>
            </>
          )}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 hover:bg-zinc-800 rounded-md transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold hover:bg-zinc-800 rounded-md transition-all cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="p-1.5 hover:bg-zinc-800 rounded-md transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {devConfig.devHints && (
        <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Quick Dev Filters (Data Available):</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "2020-11-25 (Rich Notes & Plans)", date: "2020-11-25" },
              { label: "2021-11-25 (Week Note)", date: "2021-11-25" },
              { label: "2021-07-07 (Production Plan)", date: "2021-07-07" },
              { label: "2020-02-26 (Production Plan)", date: "2020-02-26" }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const targetDate = new Date(item.date);
                  setCurrentWeekStart(getMonday(targetDate));
                }}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-mono transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Week Date Display Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
        <span className="text-sm font-semibold text-white">
          {startDateStr} ~ {endDateStr}
        </span>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl h-64 animate-pulse flex items-center justify-center text-zinc-500">
          Loading schedule plans...
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          {/* Main Grid View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                {/* 1st Header Row: Days of Week + Daily Notes */}
                <tr className="border-b border-zinc-800 text-xs font-bold bg-zinc-950">
                  <th className="p-4 border-r border-zinc-850 w-48 text-zinc-400">Bay / Employee</th>
                  {weekDays.map((day) => {
                    const dayStr = formatDateString(day);
                    const dayNote = notes[dayStr] || {};
                    const holiday = holidays.find(h => h.date_start <= dayStr && dayStr <= h.date_stop);

                    return (
                      <th key={dayStr} className="p-4 border-r border-zinc-800 align-top relative min-w-[140px]">
                        <div className="flex items-center justify-between">
                          <span className="text-white">
                            {day.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                          </span>
                          <button
                            onClick={() => openNoteModal(dayStr, dayNote.note, dayNote.note2)}
                            className="p-1 hover:bg-zinc-800 rounded-md transition-all cursor-pointer text-zinc-500 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        {holiday && (
                          <div className="mt-1 text-[10px] bg-red-950/40 border border-red-900/50 text-red-400 px-1.5 py-0.5 rounded">
                            {holiday.name}
                          </div>
                        )}

                        {(dayNote.note || dayNote.note2) && (
                          <div className="mt-2 text-[10px] text-zinc-400 font-normal space-y-1 bg-zinc-900/40 p-2 rounded border border-zinc-800">
                            {dayNote.note && <p className="truncate">{dayNote.note}</p>}
                            {dayNote.note2 && <p className="truncate border-t border-zinc-800 pt-1 text-zinc-500">{dayNote.note2}</p>}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-sm">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 border-r border-zinc-850 bg-zinc-950/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                          {emp.firstname ? emp.firstname[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs">{emp.firstname} {emp.surname}</p>
                          <p className="text-[10px] text-zinc-500">Bay {emp.bay || 'N/A'} - {emp.role}</p>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day) => {
                      const dayStr = formatDateString(day);
                      // Filter plan for this employee on this date
                      const dayPlan = plans.find(p => p.employee_id === emp.id && p.date === dayStr);

                      return (
                        <td key={dayStr} className="p-4 border-r border-zinc-800 align-top relative group">
                          {dayPlan ? (
                            <div className="bg-zinc-800 border border-zinc-700/60 p-2 rounded-lg space-y-1.5 shadow-sm text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-white flex items-center gap-1">
                                  <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                                  Job {dayPlan.job_number}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-medium">Lot {dayPlan.lot}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                                <Clock className="w-3 h-3 text-zinc-500" />
                                <span>Prio {dayPlan.priority}</span>
                              </div>
                              {/* Edit triggers can be added here */}
                            </div>
                          ) : (
                            <button
                              onClick={() => openPlanModal(dayStr, emp.id, `${emp.firstname} ${emp.surname}`)}
                              className="w-full h-10 border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/10 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Note Edit Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Edit Day Note</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Adjust notes for {noteDate}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Primary Note</label>
                <textarea
                  className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-sm text-white focus:ring-1 focus:ring-zinc-600 h-20"
                  placeholder="Primary note or instructions..."
                  value={noteContent1}
                  onChange={(e) => setNoteContent1(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Secondary Note (Sub-info)</label>
                <textarea
                  className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-sm text-white focus:ring-1 focus:ring-zinc-600 h-20"
                  placeholder="Secondary details..."
                  value={noteContent2}
                  onChange={(e) => setNoteContent2(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-white text-zinc-950 font-semibold rounded-lg text-xs cursor-pointer hover:bg-zinc-200 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Assignment Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Assign Production Plan</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Assign job to {selectedPlanEmpName} on {selectedPlanDate}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Select Job</label>
                <select
                  value={planJobNumber}
                  onChange={(e) => setPlanJobNumber(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-sm text-white focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                >
                  {jobOptions.map((job) => (
                    <option key={job.job_number} value={job.job_number}>
                      Job {job.job_number} - {job.company_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Lot Number</label>
                  <input
                    type="number"
                    min="1"
                    value={planLot}
                    onChange={(e) => setPlanLot(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-sm text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Priority</label>
                  <input
                    type="number"
                    min="1"
                    value={planPriority}
                    onChange={(e) => setPlanPriority(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-sm text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="px-4 py-2 bg-white text-zinc-950 font-semibold rounded-lg text-xs cursor-pointer hover:bg-zinc-200 transition-all"
              >
                Assign Job
              </button>
            </div>
          </div>
        </div>
      )}

      <DevHints 
        title="Monthly/Weekly Plan"
        fe={['fe/src/app/dashboard/weekly-plan/page.js', 'fe/src/hooks/useCalendar.js']}
        be={['core/api_router.py (/api/tasks/active)', 'core/api_router.py (/api/dev/random-date)', 'skills/020_task_pipeline.py']}
        db={['tb_production_plan', 'tb_week_notes', 'tb_login']}
        condition="Maps production plans for active shop floor employees with drag-and-drop allocations, color priority coding, and customizable weekly notes."
      />
    </div>
  );
}
