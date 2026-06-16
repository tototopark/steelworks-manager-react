"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useWhiteboard } from '../../../hooks/useWhiteboard';
import { 
  Plus, 
  Trash2, 
  Edit, 
  AlertCircle,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useAuth } from '../../../hooks/useAuth';
import DevHints from '../../../components/common/DevHints';

export default function WhiteboardPage() {
  const { user } = useAuth();
  const isReadOnly = user?.right_level < 6;

  const [filterDate, setFilterDate] = useState('');
  const [dateBuffer, setDateBuffer] = useState(3);
  const [devConfig, setDevConfig] = useState({ devHints: false });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalEmployeeId, setModalEmployeeId] = useState('');
  const [modalSite, setModalSite] = useState('');
  const [modalInstruction, setModalInstruction] = useState('');

  const {
    tasksData,
    employeesData,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useWhiteboard();

  // Single initialization: fetch default date, then load tasks once
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      let dateToUse = filterDate;

      // Only fetch default date if filterDate is not set
      if (!dateToUse) {
        try {
          const res = await apiClient.get('/api/tasks/active-date');
          if (!cancelled && res.data?.status === 'success' && res.data.date) {
            dateToUse = res.data.date;
            setFilterDate(dateToUse);
          }
        } catch (err) {
          console.error('Failed to load default active date', err);
        }
      }

      if (!cancelled) {
        fetchTasks(dateToUse, dateBuffer);
      }
    };

    init();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when filter or buffer changes (but NOT on first mount - handled above)
  const isFirstMount = React.useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    fetchTasks(filterDate, dateBuffer);
  }, [filterDate, dateBuffer, fetchTasks]);

  // Dev testing random active date helper
  const handleRandomDateJump = async () => {
    try {
      const response = await apiClient.get('/api/dev/random-date?type=whiteboard');
      if (response.data && response.data.date) {
        setFilterDate(response.data.date);
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
          // ISO Week to date mapping or simple date transition
          // Let's set typical date that belongs to latest week of that year
          // latest is typically 2021 week 46, we can set default active date "2021-11-18" or so.
          // Or just grab random date for safety.
          const response = await apiClient.get('/api/dev/random-date?type=whiteboard');
          if (response.data && response.data.date) {
            setFilterDate(response.data.date);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch latest week", err);
    }
  };

  const handleClearFilter = () => {
    setFilterDate('');
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, taskId, currentEmpId, currentSite, currentInst) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.setData('sourceEmpId', currentEmpId);
    e.dataTransfer.setData('sourceSite', currentSite);
    e.dataTransfer.setData('sourceInst', currentInst);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetEmpId) => {
    e.preventDefault();
    if (isReadOnly) return;
    const taskId = e.dataTransfer.getData('text/plain');
    const sourceSite = e.dataTransfer.getData('sourceSite');
    const sourceInst = e.dataTransfer.getData('sourceInst');

    if (!taskId || !targetEmpId) return;

    // Update backend with new employee assignment
    const result = await updateTask(taskId, targetEmpId, sourceSite, sourceInst);
    if (result.success) {
      loadTasks();
    }
  };

  // Modal Actions
  const openCreateModal = () => {
    setEditingTask(null);
    setModalEmployeeId(employeesData[0]?.id || '');
    setModalSite('');
    setModalInstruction('');
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalEmployeeId(task.employee_id || task.employee || '');
    setModalSite(task.site || '');
    setModalInstruction(task.task || '');
    setIsModalOpen(true);
  };

  const handleSaveTask = async () => {
    if (!modalSite || !modalInstruction) return;

    let result;
    if (editingTask) {
      result = await updateTask(editingTask.id, modalEmployeeId, modalSite, modalInstruction);
    } else {
      result = await createTask(modalEmployeeId, modalSite, modalInstruction);
    }

    if (result.success) {
      setIsModalOpen(false);
      loadTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(taskId);
      if (result.success) {
        loadTasks();
      }
    }
  };

  // Render columns for each employee
  // Tasks are grouped by employee_id or employee key
  const getEmployeeTasks = (empId) => {
    return tasksData.filter(t => (t.employee_id === empId || t.employee === empId));
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6" />
            <span>Whiteboard Task Board</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Drag and drop tasks between employee columns to reassign jobs
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-white px-2 py-1 focus:ring-0 cursor-pointer"
            />
            {filterDate && (
              <button
                onClick={handleClearFilter}
                className="px-2 py-1 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {filterDate && (
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs font-semibold text-zinc-400">
              <span className="px-2 text-[10px] text-zinc-500">Buffer:</span>
              <button
                onClick={() => setDateBuffer(1)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  dateBuffer === 1
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                    : 'hover:text-white'
                }`}
              >
                1 Day
              </button>
              <button
                onClick={() => setDateBuffer(3)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  dateBuffer === 3
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                    : 'hover:text-white'
                }`}
              >
                3 Days
              </button>
            </div>
          )}

          {!isReadOnly && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      {devConfig.devHints && (
        <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Quick Dev Filters (Data Available):</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "All Active Tasks (No Date)", date: "" },
              { label: "2019-09-20 (Active Task)", date: "2019-09-20" },
              { label: "2019-09-08 (Active Task)", date: "2019-09-08" },
              { label: "2019-09-02 (Active Task)", date: "2019-09-02" },
              { label: "2019-08-29 (Active Task)", date: "2019-08-29" }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => setFilterDate(item.date)}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-mono transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isReadOnly && (
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3 flex items-center gap-2.5 text-amber-200 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>Read-Only View: You do not have permissions to modify whiteboard tasks.</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl h-64 animate-pulse flex items-center justify-center text-zinc-500">
          Loading whiteboard tasks...
        </div>
      ) : (
        /* Tasks Table Layout (Left column fixed with Employee info, Right column stack layout for tasks) */
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-800 text-xs font-bold bg-zinc-950 uppercase tracking-wider text-zinc-400">
                <th className="p-4 w-64 border-r border-zinc-850">Employee / Bay Assignment</th>
                <th className="p-4">Assigned Tasks & Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-sm">
              {employeesData.map((emp) => {
                const empTasks = getEmployeeTasks(emp.id);
                return (
                  <tr 
                    key={emp.id} 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, emp.id)}
                    className="hover:bg-zinc-800/10 transition-colors"
                  >
                    {/* Fixed Left Employee Column */}
                    <td className="p-4 border-r border-zinc-850 bg-zinc-950/20 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                          {emp.firstname ? emp.firstname[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs">{emp.firstname} {emp.surname}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Bay {emp.bay || 'N/A'} - {emp.role}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Scrollable Right Tasks Stack Column */}
                    <td className="p-4 align-top">
                      {empTasks.length === 0 ? (
                        <div className="py-2 text-xs text-zinc-650 italic">
                          No tasks assigned to this employee.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 max-w-2xl">
                          {empTasks.map((task) => (
                            <div
                              key={task.id}
                              draggable={!isReadOnly}
                              onDragStart={(e) => handleDragStart(e, task.id, emp.id, task.site, task.task)}
                              className={`bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700/80 p-3 rounded-lg flex items-start justify-between gap-4 transition-all hover:bg-zinc-850/30 ${
                                isReadOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
                              }`}
                            >
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-zinc-500" />
                                    {task.site}
                                  </span>
                                  {task.expiry_date && (
                                    <span className="text-[9px] text-zinc-500 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      Expiry: {task.expiry_date}
                                    </span>
                                  )}
                                </div>
                                <p className="text-zinc-200 text-xs leading-relaxed break-words pr-2">
                                  {task.task}
                                </p>
                              </div>
                              
                              {!isReadOnly && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => openEditModal(task)}
                                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white cursor-pointer transition-all"
                                    title="Edit Task"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-1 hover:bg-red-950/20 rounded text-red-400 hover:text-red-300 cursor-pointer transition-all"
                                    title="Delete Task"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Task Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingTask ? 'Edit Task Details' : 'Create New Task'}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Define site location and fabrication instructions</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Assignee</label>
                <select
                  value={modalEmployeeId}
                  onChange={(e) => setModalEmployeeId(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-sm text-white focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                >
                  {employeesData.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstname} {emp.surname} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Site / Job Address</label>
                <input
                  type="text"
                  placeholder="e.g. Lot 12, Pokeno"
                  value={modalSite}
                  onChange={(e) => setModalSite(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-sm text-white focus:ring-1 focus:ring-zinc-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Task Instruction</label>
                <textarea
                  placeholder="Instructions for fabrication or delivery..."
                  value={modalInstruction}
                  onChange={(e) => setModalInstruction(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-sm text-white focus:ring-1 focus:ring-zinc-600 h-24"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="px-4 py-2 bg-white text-zinc-950 font-semibold rounded-lg text-xs cursor-pointer hover:bg-zinc-200 transition-all"
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      <DevHints 
        title="Whiteboard Tasks"
        fe={['fe/src/app/dashboard/whiteboard/page.js', 'fe/src/hooks/useWhiteboard.js']}
        be={['core/api_router.py (/api/tasks)', 'core/api_router.py (/api/dev/random-date)', 'skills/020_task_pipeline.py']}
        db={['tb_tasks', 'tb_login']}
        condition="Task schedule drag-and-drop board. Low-level staff (right_level < 6) are placed in read-only mode (cards locked, no drag-drop, edit/delete hidden)."
      />
    </div>
  );
}
