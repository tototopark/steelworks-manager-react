"use client";

import { useState, useEffect, useCallback } from 'react';
import { useVehicles } from '../../../hooks/useVehicles';
import { useOtherReminders } from '../../../hooks/useOtherReminders';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Truck, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  X,
  CheckCircle,
  HelpCircle,
  Clock,
  Gauge,
  ShieldCheck,
  CalendarClock
} from 'lucide-react';
import DevHints from '../../../components/common/DevHints';


export default function VehiclesPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.right_level >= 10;

  const {
    vehicles,
    expiryAlerts,
    loading,
    error,
    fetchVehicles,
    fetchExpiryAlerts,
    createVehicle,
    updateVehicle,
    deleteVehicle
  } = useVehicles();

  const {
    reminders: otherReminders,
    expiryAlerts: otherAlerts,
    loading: otherLoading,
    fetchReminders: fetchOtherReminders,
    fetchExpiryAlerts: fetchOtherAlerts,
    createReminder,
    updateReminder,
    deleteReminder
  } = useOtherReminders();

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [formData, setFormData] = useState({
    vehicle: '',
    plate: '',
    wof: '',
    rego: '',
    service: '',
    ruc: '',
    current_odo: ''
  });
  const [modalError, setModalError] = useState('');

  // Other Reminders modal state
  const [isOtherNewOpen, setIsOtherNewOpen] = useState(false);
  const [isOtherEditOpen, setIsOtherEditOpen] = useState(false);
  const [editingOther, setEditingOther] = useState(null);
  const [otherFormData, setOtherFormData] = useState({ name: '', comment: '', expiry_date: '' });
  const [otherModalError, setOtherModalError] = useState('');

  const loadData = useCallback(() => {
    fetchVehicles();
    fetchExpiryAlerts();
    fetchOtherReminders();
    fetchOtherAlerts();
  }, [fetchVehicles, fetchExpiryAlerts, fetchOtherReminders, fetchOtherAlerts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!formData.vehicle || !formData.plate) {
      setModalError('Vehicle name and plate are required.');
      return;
    }
    const res = await createVehicle(
      formData.vehicle,
      formData.plate,
      formData.wof || null,
      formData.rego || null,
      formData.service || null,
      formData.ruc || null,
      formData.current_odo || null
    );
    if (res.success) {
      setIsNewOpen(false);
      loadData();
      setFormData({
        vehicle: '',
        plate: '',
        wof: '',
        rego: '',
        service: '',
        ruc: '',
        current_odo: ''
      });
    } else {
      setModalError(res.message);
    }
  };

  const handleOpenEdit = (v) => {
    setEditingVehicle(v);
    setFormData({
      vehicle: v.Vehicle || '',
      plate: v.Plate || '',
      wof: v.WOF || '',
      rego: v.REGO || '',
      service: String(v.SERVICE || ''),
      ruc: String(v.RUC || ''),
      current_odo: String(v.Current_ODO || '')
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setModalError('');
    const res = await updateVehicle(
      editingVehicle.id,
      formData.vehicle,
      formData.plate,
      formData.wof || null,
      formData.rego || null,
      formData.service || null,
      formData.ruc || null,
      formData.current_odo || null
    );
    if (res.success) {
      setIsEditOpen(false);
      loadData();
    } else {
      setModalError(res.message);
    }
  };

  const handleDelete = async (vId, name) => {
    if (confirm(`Are you sure you want to delete vehicle ${name}?`)) {
      const res = await deleteVehicle(vId);
      if (res.success) {
        loadData();
      } else {
        alert(res.message);
      }
    }
  };

  // --- Other Reminders Handlers ---
  const handleOtherCreate = async (e) => {
    e.preventDefault();
    setOtherModalError('');
    if (!otherFormData.name) {
      setOtherModalError('Item name is required.');
      return;
    }
    const res = await createReminder(
      otherFormData.name,
      otherFormData.comment || null,
      otherFormData.expiry_date || null
    );
    if (res.success) {
      setIsOtherNewOpen(false);
      setOtherFormData({ name: '', comment: '', expiry_date: '' });
      loadData();
    } else {
      setOtherModalError(res.message);
    }
  };

  const handleOtherOpenEdit = (r) => {
    setEditingOther(r);
    setOtherFormData({
      name: r.name || '',
      comment: r.comment || '',
      expiry_date: r.expiry_date || ''
    });
    setIsOtherEditOpen(true);
  };

  const handleOtherUpdate = async (e) => {
    e.preventDefault();
    setOtherModalError('');
    const res = await updateReminder(
      editingOther.id,
      otherFormData.name,
      otherFormData.comment || null,
      otherFormData.expiry_date || null
    );
    if (res.success) {
      setIsOtherEditOpen(false);
      loadData();
    } else {
      setOtherModalError(res.message);
    }
  };

  const handleOtherDelete = async (id, name) => {
    if (confirm(`Delete reminder "${name}"?`)) {
      const res = await deleteReminder(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message);
      }
    }
  };

  // Helper: check if a specific vehicle and type is in the alert warnings list
  const getAlertStatus = (plate, type) => {
    const matchedAlert = expiryAlerts.find(a => a.plate === plate);
    if (!matchedAlert) return null;
    return matchedAlert.alerts.find(al => al.type === type);
  };

  // Helper: get expiry status badge color
  const getExpiryBadgeClass = (status) =>
    status === 'expired'
      ? 'bg-red-900/40 text-red-400 border border-red-900/50'
      : 'bg-amber-950/40 text-amber-400 border border-amber-900/50';

  return (
    <div className="space-y-6 font-sans text-zinc-100 h-full flex flex-col">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-6 h-6" />
            <span>Vehicle Fleet</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Monitor registration and warrant of fitness statuses of fleet vehicles
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsNewOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-semibold cursor-pointer transition-all self-end sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200 flex-shrink-0">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Warnings Board if any alerts are active */}
      {expiryAlerts.length > 0 && (
        <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-5 space-y-3 flex-shrink-0">
          <h3 className="text-xs font-bold text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Critical Fleet Warnings ({expiryAlerts.length} vehicles affected)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiryAlerts.map((vAlert) => (
              <div 
                key={vAlert.id}
                className="bg-zinc-900/60 p-3 rounded-lg border border-red-950/40 flex items-start justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white">{vAlert.vehicle}</p>
                  <p className="text-[10px] text-zinc-500 font-semibold">{vAlert.plate}</p>
                </div>
                <div className="space-y-1 text-right">
                  {vAlert.alerts.map((al, idx) => (
                    <span 
                      key={idx}
                      className={`inline-block text-[9px] px-2 py-0.5 rounded ml-2 font-bold uppercase ${
                        al.status === 'expired' 
                          ? 'bg-red-900/40 text-red-400 border border-red-900/50' 
                          : 'bg-amber-950/40 text-amber-400 border border-amber-900/50'
                      }`}
                    >
                      {al.type} {al.status}: {al.date}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fleet table */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[300px]">
        <div className="flex-1 overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse min-w-[900px] text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[10px] uppercase font-bold text-zinc-400">
                <th className="p-4 w-48">Vehicle</th>
                <th className="p-4 w-32">Plate</th>
                <th className="p-4 w-40">WOF Expiry</th>
                <th className="p-4 w-40">REGO Expiry</th>
                <th className="p-4 w-32">Next Service</th>
                <th className="p-4 w-32">Next RUC</th>
                <th className="p-4 w-32">Current ODO</th>
                {isAdmin && <th className="p-4 w-24 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-500 font-medium">
                    Loading vehicles directory...
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-500 font-medium">
                    No fleet vehicles registered.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => {
                  const wofAlert = getAlertStatus(v.Plate, 'WOF');
                  const regoAlert = getAlertStatus(v.Plate, 'REGO');
                  
                  return (
                    <tr key={v.id} className="hover:bg-zinc-800/10 transition-colors">
                      <td className="p-4 font-bold text-white">{v.Vehicle}</td>
                      <td className="p-4 font-mono font-bold text-zinc-400">{v.Plate}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-300">{v.WOF || 'N/A'}</span>
                          {wofAlert && (
                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              wofAlert.status === 'expired' 
                                ? 'bg-red-950 text-red-400 border border-red-900/50' 
                                : 'bg-amber-950 text-amber-400 border border-amber-900/50'
                            }`}>
                              {wofAlert.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-300">{v.REGO || 'N/A'}</span>
                          {regoAlert && (
                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              regoAlert.status === 'expired' 
                                ? 'bg-red-950 text-red-400 border border-red-900/50' 
                                : 'bg-amber-950 text-amber-400 border border-amber-900/50'
                            }`}>
                              {regoAlert.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-zinc-300">
                        {v.SERVICE ? `${v.SERVICE.toLocaleString()} km` : 'N/A'}
                      </td>
                      <td className="p-4 font-semibold text-zinc-300">
                        {v.RUC ? `${v.RUC.toLocaleString()} km` : 'N/A'}
                      </td>
                      <td className="p-4 font-semibold text-zinc-300">
                        {v.Current_ODO ? `${v.Current_ODO.toLocaleString()} km` : 'N/A'}
                      </td>
                      {isAdmin && (
                        <td className="p-4 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(v)}
                              className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white cursor-pointer"
                              title="Edit Vehicle details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(v.id, v.Vehicle)}
                              className="p-1.5 hover:bg-red-950/20 rounded text-zinc-400 hover:text-red-400 cursor-pointer"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Vehicle */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-zinc-400" />
                <span>Register Vehicle</span>
              </h3>
              <button onClick={() => setIsNewOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {modalError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">{modalError}</p>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Vehicle Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Hilux 2.8"
                    value={formData.vehicle}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Number Plate *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MKO892"
                    value={formData.plate}
                    onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">WOF Expiry</label>
                  <input
                    type="date"
                    value={formData.wof}
                    onChange={(e) => setFormData(prev => ({ ...prev, wof: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">REGO Expiry</label>
                  <input
                    type="date"
                    value={formData.rego}
                    onChange={(e) => setFormData(prev => ({ ...prev, rego: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Next Service (km)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={formData.service}
                    onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Next RUC (km)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={formData.ruc}
                    onChange={(e) => setFormData(prev => ({ ...prev, ruc: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Current ODO (km)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={formData.current_odo}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_odo: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-855">
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
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Vehicle */}
      {isEditOpen && editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Edit Vehicle details</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {modalError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">{modalError}</p>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Vehicle Description</label>
                  <input
                    type="text"
                    required
                    value={formData.vehicle}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Number Plate</label>
                  <input
                    type="text"
                    required
                    value={formData.plate}
                    onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">WOF Expiry</label>
                  <input
                    type="date"
                    value={formData.wof}
                    onChange={(e) => setFormData(prev => ({ ...prev, wof: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">REGO Expiry</label>
                  <input
                    type="date"
                    value={formData.rego}
                    onChange={(e) => setFormData(prev => ({ ...prev, rego: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Next Service (km)</label>
                  <input
                    type="number"
                    value={formData.service}
                    onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Next RUC (km)</label>
                  <input
                    type="number"
                    value={formData.ruc}
                    onChange={(e) => setFormData(prev => ({ ...prev, ruc: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Current ODO (km)</label>
                  <input
                    type="number"
                    value={formData.current_odo}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_odo: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-zinc-950 font-semibold rounded-lg text-xs cursor-pointer hover:bg-zinc-200 transition-all"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Other Certifications & Reminders Section ===== */}
      <div className="space-y-4 pt-2 border-t border-zinc-800">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Other Certifications &amp; Reminders</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Track expiry dates for equipment inspections, training certificates, and other compliance items
            </p>
          </div>
          {isAdmin && (
            <button
              id="btn-add-other-reminder"
              onClick={() => { setIsOtherNewOpen(true); setOtherFormData({ name: '', comment: '', expiry_date: '' }); setOtherModalError(''); }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg text-xs font-semibold cursor-pointer transition-all self-end sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          )}
        </div>

        {/* Other Alerts Banner */}
        {otherAlerts.length > 0 && (
          <div className="bg-orange-950/20 border border-orange-800/40 rounded-xl p-4 space-y-2 flex-shrink-0">
            <h3 className="text-xs font-bold text-orange-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Certification Warnings ({otherAlerts.length} items require attention)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {otherAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-zinc-900/60 p-3 rounded-lg border border-orange-950/40 flex items-start justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{alert.name}</p>
                    {alert.comment && <p className="text-[10px] text-zinc-500 mt-0.5">{alert.comment}</p>}
                  </div>
                  <span className={`inline-block text-[9px] px-2 py-0.5 rounded ml-2 font-bold uppercase whitespace-nowrap ${getExpiryBadgeClass(alert.status)}`}>
                    {alert.status === 'expired' ? 'EXPIRED' : 'EXPIRING'}: {alert.expiry_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Reminders Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px] text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[10px] uppercase font-bold text-zinc-400">
                  <th className="p-4">Item / Certification Name</th>
                  <th className="p-4">Comment / Notes</th>
                  <th className="p-4 w-40">Expiry Date</th>
                  <th className="p-4 w-24">Status</th>
                  {isAdmin && <th className="p-4 w-20 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {otherLoading ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-zinc-500">Loading certifications...</td>
                  </tr>
                ) : otherReminders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-zinc-500">
                      No certification items registered.
                    </td>
                  </tr>
                ) : (
                  otherReminders.map((r) => {
                    const alert = otherAlerts.find(a => a.id === r.id);
                    const today = new Date().toISOString().split('T')[0];
                    const isExpired = r.expiry_date && r.expiry_date < today;
                    const isExpiring = alert && alert.status === 'expiring_soon';
                    return (
                      <tr key={r.id} className="hover:bg-zinc-800/10 transition-colors">
                        <td className="p-4 font-bold text-white">{r.name}</td>
                        <td className="p-4 text-zinc-400">{r.comment || '—'}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <CalendarClock className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                            <span className="font-semibold text-zinc-300">{r.expiry_date || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {!r.expiry_date ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-zinc-800 text-zinc-500">No Date</span>
                          ) : isExpired ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-red-900/40 text-red-400 border border-red-900/50">Expired</span>
                          ) : isExpiring ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-amber-950/40 text-amber-400 border border-amber-900/50">Expiring Soon</span>
                          ) : (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-green-950/40 text-green-400 border border-green-900/50">Valid</span>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOtherOpenEdit(r)}
                                className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOtherDelete(r.id, r.name)}
                                className="p-1.5 hover:bg-red-950/20 rounded text-zinc-400 hover:text-red-400 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Add Other Reminder */}
      {isOtherNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span>Add Certification / Reminder</span>
              </h3>
              <button onClick={() => setIsOtherNewOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {otherModalError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">{otherModalError}</p>
            )}

            <form onSubmit={handleOtherCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Item Name *</label>
                <input
                  id="other-reminder-name"
                  type="text"
                  required
                  placeholder="e.g. Fire Extinguisher Inspection"
                  value={otherFormData.name}
                  onChange={(e) => setOtherFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Comment / Notes</label>
                <input
                  type="text"
                  placeholder="Optional description"
                  value={otherFormData.comment}
                  onChange={(e) => setOtherFormData(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={otherFormData.expiry_date}
                  onChange={(e) => setOtherFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsOtherNewOpen(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-xs cursor-pointer hover:bg-indigo-500 transition-all"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Other Reminder */}
      {isOtherEditOpen && editingOther && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span>Edit Certification Item</span>
              </h3>
              <button onClick={() => setIsOtherEditOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {otherModalError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">{otherModalError}</p>
            )}

            <form onSubmit={handleOtherUpdate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={otherFormData.name}
                  onChange={(e) => setOtherFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Comment / Notes</label>
                <input
                  type="text"
                  value={otherFormData.comment}
                  onChange={(e) => setOtherFormData(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={otherFormData.expiry_date}
                  onChange={(e) => setOtherFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsOtherEditOpen(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-xs cursor-pointer hover:bg-indigo-500 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DevHints 
        title="Vehicles Reminder"
        fe={['fe/src/app/dashboard/vehicles/page.js', 'fe/src/hooks/useVehicles.js', 'fe/src/hooks/useOtherReminders.js']}
        be={['core/api_router.py (/api/reminders/vehicles)', 'core/api_router.py (/api/reminders/vehicles/expiry-check)', 'core/api_router.py (/api/reminders/others)']}
        db={['tb_reminder_vehicle', 'tb_reminder_other']}
        condition="Funnels vehicle fleet safety details (WOF/REGO dates, service intervals) and general certifications. Generates warnings for dates expiring within 30 days."
      />
    </div>
  );
}
