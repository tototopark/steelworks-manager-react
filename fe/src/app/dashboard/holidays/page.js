"use client";

import { useState, useEffect, useCallback } from 'react';
import { useHolidays } from '../../../hooks/useHolidays';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  CalendarDays, 
  Plus, 
  Trash2, 
  X, 
  AlertTriangle,
  Calendar,
  Clock,
  ShieldAlert
} from 'lucide-react';
import DevHints from '../../../components/common/DevHints';

export default function HolidaysPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const isAdmin = currentUser?.right_level >= 10;

  const {
    holidays,
    loading,
    error,
    fetchHolidays,
    createHoliday,
    deleteHoliday
  } = useHolidays();

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date_start: '',
    date_stop: ''
  });
  const [modalError, setModalError] = useState('');

  const loadData = useCallback(() => {
    if (isAdmin) {
      fetchHolidays();
    }
  }, [fetchHolidays, isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Authorization Guard
  useEffect(() => {
    if (currentUser && currentUser.right_level < 10) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-zinc-500 text-sm">
        Loading user context...
      </div>
    );
  }

  if (currentUser.right_level < 10) {
    return (
      <div className="flex-1 bg-zinc-950 flex flex-col justify-between p-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-4 text-center">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-lg font-bold text-white">Access Denied</h2>
            <p className="text-xs text-zinc-400">
              You do not have the required permission level (Level 10+) to access the Public Holidays admin panel.
            </p>
          </div>
        </div>
        <DevHints 
          title="Public Holidays Management"
          fe={['fe/src/app/dashboard/holidays/page.js', 'fe/src/hooks/useHolidays.js']}
          be={['core/api_router.py (/api/holidays)']}
          db={['tb_public_holidays']}
          condition="Allows administrators to configure public holiday dates to automatically bypass production planning capacity calculations."
        />
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!formData.name || !formData.date_start || !formData.date_stop) {
      setModalError('Please fill in all required fields.');
      return;
    }
    if (formData.date_start > formData.date_stop) {
      setModalError('Start date cannot be after end date.');
      return;
    }

    const res = await createHoliday(formData.name, formData.date_start, formData.date_stop);
    if (res.success) {
      setIsNewOpen(false);
      loadData();
      setFormData({
        name: '',
        date_start: '',
        date_stop: ''
      });
    } else {
      setModalError(res.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete holiday "${name}"?`)) {
      const res = await deleteHoliday(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100 h-full flex flex-col">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6" />
            <span>Public Holidays</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage annual public holidays and factory-wide day-off schedules
          </p>
        </div>
        <button
          onClick={() => setIsNewOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-semibold cursor-pointer transition-all self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Holiday</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200 flex-shrink-0">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Holidays List Card */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[300px]">
        <div className="flex-1 overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse min-w-[600px] text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[10px] uppercase font-bold text-zinc-400">
                <th className="p-4 w-48">Holiday Name</th>
                <th className="p-4 w-40">Start Date</th>
                <th className="p-4 w-40">End Date</th>
                <th className="p-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-zinc-500 font-medium">
                    Loading holidays list...
                  </td>
                </tr>
              ) : holidays.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-zinc-500 font-medium">
                    No holidays registered.
                  </td>
                </tr>
              ) : (
                holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="p-4 font-bold text-white">{h.name}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 font-mono font-semibold text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{h.date_start}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 font-mono font-semibold text-zinc-300">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{h.date_stop}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right align-middle">
                      <button
                        onClick={() => handleDelete(h.id, h.name)}
                        className="p-1.5 hover:bg-red-950/20 rounded text-zinc-400 hover:text-red-400 cursor-pointer"
                        title="Delete Holiday"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Holiday */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-zinc-400" />
                <span>Add Public Holiday</span>
              </h3>
              <button onClick={() => setIsNewOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {modalError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">{modalError}</p>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Holiday Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Christmas Day"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2.5 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_start: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2.5 text-xs text-white focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date_stop}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_stop: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2.5 text-xs text-white focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsNewOpen(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-zinc-950 font-semibold rounded-lg text-xs cursor-pointer hover:bg-zinc-200 transition-all"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DevHints 
        title="Public Holidays Management"
        fe={['fe/src/app/dashboard/holidays/page.js', 'fe/src/hooks/useHolidays.js']}
        be={['core/api_router.py (/api/holidays)']}
        db={['tb_public_holidays']}
        condition="Allows administrators to configure public holiday dates to automatically bypass production planning capacity calculations."
      />
    </div>
  );
}
