"use client";

import { useState, useEffect, useCallback } from 'react';
import { useEmployees } from '../../../hooks/useEmployees';
import { useAuth } from '../../../hooks/useAuth';
import { useStaffReminders } from '../../../hooks/useStaffReminders';
import DevHints from '../../../components/common/DevHints';
import { 
  Users, 
  Plus, 
  UserPlus, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  Camera, 
  Key, 
  Check, 
  X,
  Layers,
  ClipboardCheck,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

export default function EmployeesPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.right_level >= 10;

  const {
    employees,
    retiredEmployees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    generateRandomPassword,
    uploadAvatar
  } = useEmployees();

  const {
    staffAlerts,
    fetchStaffExpiryAlerts
  } = useStaffReminders();

  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'retired'
  
  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  
  // Generated Password display modal
  const [tempPassword, setTempPassword] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    firstname: '',
    surname: '',
    role: 'Welder',
    right_level: '1',
    bay: '',
    shop_label: ''
  });
  const [modalError, setModalError] = useState('');

  const loadData = useCallback(() => {
    fetchEmployees(activeTab);
    if (isAdmin) {
      fetchStaffExpiryAlerts();
    }
  }, [fetchEmployees, activeTab, isAdmin, fetchStaffExpiryAlerts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!formData.login || !formData.firstname || !formData.surname) {
      setModalError('Please fill in all required fields.');
      return;
    }
    const res = await createEmployee(
      formData.login,
      formData.password || '12345678', // default if not specified
      formData.firstname,
      formData.surname,
      formData.role,
      formData.right_level,
      formData.bay || null,
      formData.shop_label || null
    );
    if (res.success) {
      setIsRegisterOpen(false);
      loadData();
      setFormData({
        login: '',
        password: '',
        firstname: '',
        surname: '',
        role: 'Welder',
        right_level: '1',
        bay: '',
        shop_label: ''
      });
    } else {
      setModalError(res.message);
    }
  };

  const handleOpenEdit = (emp) => {
    setEditingEmp(emp);
    setFormData({
      firstname: emp.firstname,
      surname: emp.surname,
      role: emp.role || 'Welder',
      right_level: String(emp.right_level || 1),
      bay: String(emp.bay || ''),
      shop_label: emp.shop_label || ''
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setModalError('');
    const res = await updateEmployee(
      editingEmp.id,
      formData.firstname,
      formData.surname,
      formData.role,
      formData.right_level,
      formData.bay || null,
      formData.shop_label || null
    );
    if (res.success) {
      setIsEditOpen(false);
      loadData();
    } else {
      setModalError(res.message);
    }
  };

  const handleDeactivate = async (empId, name) => {
    if (confirm(`Are you sure you want to deactivate and retire employee ${name}?`)) {
      const res = await deleteEmployee(empId);
      if (res.success) {
        loadData();
      } else {
        alert(res.message);
      }
    }
  };

  const handleRandomPassword = async (empId, name) => {
    if (confirm(`Generate and set a new random password for ${name}?`)) {
      const res = await generateRandomPassword(empId);
      if (res.success) {
        setTempPassword(res.newPassword);
        setIsPasswordModalOpen(true);
      } else {
        alert(res.message);
      }
    }
  };

  const handleAvatarUpload = async (e, empId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await uploadAvatar(empId, file);
    if (res.success) {
      loadData();
    } else {
      alert(res.message);
    }
  };

  const currentList = activeTab === 'active' ? employees : retiredEmployees;

  return (
    <div className="space-y-6 font-sans text-zinc-100 h-full flex flex-col">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            <span>Employee Directory</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage employee access credentials, workspace welding bay assignments, and portal access rights
          </p>
        </div>
        {isAdmin && activeTab === 'active' && (
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-semibold cursor-pointer transition-all self-end sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Employee</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200 flex-shrink-0">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Staff SiteSafe Expiry Warnings */}
      {isAdmin && staffAlerts.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-5 space-y-3 flex-shrink-0">
          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Critical Safety Certificate Warnings ({staffAlerts.length} employees affected)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffAlerts.map((sAlert) => (
              <div 
                key={sAlert.id}
                className="bg-zinc-900/60 p-3 rounded-lg border border-amber-950/40 flex items-start justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white">{sAlert.name} ({sAlert.role})</p>
                  <p className="text-[10px] text-zinc-500 font-semibold">
                    Passport: {sAlert.passport || 'N/A'} ({sAlert.category || 'N/A'})
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    sAlert.status === 'expired' 
                      ? 'bg-red-900/40 text-red-400 border border-red-900/50' 
                      : 'bg-amber-950/40 text-amber-400 border border-amber-900/50'
                  }`}>
                    SiteSafe {sAlert.status}: {sAlert.expiry_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/20 px-4 flex-shrink-0">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'active' 
              ? 'border-white text-white' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Active Workforce ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('retired')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'retired' 
              ? 'border-white text-white' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Retired / Inactive ({retiredEmployees.length})
        </button>
      </div>

      {/* Main Grid Card list */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-6">
        {loading ? (
          <div className="w-full h-64 bg-zinc-900/40 border border-zinc-800 rounded-xl animate-pulse flex items-center justify-center text-zinc-500 text-sm">
            Loading employees database...
          </div>
        ) : currentList.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-500 text-sm border border-zinc-800 border-dashed rounded-xl bg-zinc-900/10">
            <Users className="w-8 h-8 text-zinc-700 mb-2" />
            <span>No employees found in this directory.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentList.map((emp) => (
              <div 
                key={emp.id} 
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 flex gap-4 transition-all relative group"
              >
                {/* Left side: Avatar + Camera Trigger */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-zinc-800 border border-zinc-750 flex items-center justify-center font-bold text-white text-lg overflow-hidden">
                    {emp.avatar && emp.avatar !== 'default.png' ? (
                      <img 
                        src={emp.avatar.startsWith('/') ? emp.avatar : `/uploads/avatars/${emp.avatar}`} 
                        alt={`${emp.firstname} avatar`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span>{emp.firstname[0].toUpperCase()}</span>
                    )}
                  </div>
                  {isAdmin && activeTab === 'active' && (
                    <label className="absolute -bottom-1 -right-1 bg-zinc-950 border border-zinc-800 p-1.5 rounded-full text-zinc-400 hover:text-white cursor-pointer shadow-lg hover:scale-105 transition-all">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleAvatarUpload(e, emp.id)}
                        className="hidden" 
                      />
                      <Camera className="w-3.5 h-3.5" />
                    </label>
                  )}
                </div>

                {/* Right side: Employee metadata */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-bold text-white text-sm truncate">
                    {emp.firstname} {emp.surname}
                  </h3>
                  <p className="text-xs text-zinc-400 font-semibold">{emp.role}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-semibold text-zinc-500">
                    <span className="bg-zinc-850 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                      ID: {emp.login}
                    </span>
                    <span className="bg-zinc-850 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                      Level {emp.right_level}
                    </span>
                    {emp.bay && (
                      <span className="bg-zinc-850 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                        Bay {emp.bay}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons (Absolute hover overlay or corner overlay for admin) */}
                {isAdmin && activeTab === 'active' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRandomPassword(emp.id, `${emp.firstname} ${emp.surname}`)}
                      className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white cursor-pointer transition-all"
                      title="Reset Password"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(emp)}
                      className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white cursor-pointer transition-all"
                      title="Edit Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeactivate(emp.id, `${emp.firstname} ${emp.surname}`)}
                      className="p-1.5 hover:bg-red-950/20 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer transition-all"
                      title="Deactivate Employee"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Register Employee */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-zinc-400" />
                <span>Register Employee</span>
              </h3>
              <button onClick={() => setIsRegisterOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {modalError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">{modalError}</p>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstname}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Surname *</label>
                  <input
                    type="text"
                    required
                    value={formData.surname}
                    onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Login Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. jdoe"
                    value={formData.login}
                    onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Defaults to 12345678"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  >
                    <option value="Welder">Welder</option>
                    <option value="Fabricator">Fabricator</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="QC Inspector">QC Inspector</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Right Level</label>
                  <select
                    value={formData.right_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, right_level: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  >
                    <option value="1">Level 1 (Standard Workforce)</option>
                    <option value="2">Level 2 (Supervisor)</option>
                    <option value="10">Level 10 (Full Supervisor Admin)</option>
                    <option value="99">Level 99 (Super Admin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Welding Bay</label>
                  <input
                    type="number"
                    placeholder="Bay Number (Optional)"
                    value={formData.bay}
                    onChange={(e) => setFormData(prev => ({ ...prev, bay: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Shop Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop A (Optional)"
                    value={formData.shop_label}
                    onChange={(e) => setFormData(prev => ({ ...prev, shop_label: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
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

      {/* Modal: Edit Employee */}
      {isEditOpen && editingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Edit Employee details</h3>
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
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstname}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Surname</label>
                  <input
                    type="text"
                    required
                    value={formData.surname}
                    onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  >
                    <option value="Welder">Welder</option>
                    <option value="Fabricator">Fabricator</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="QC Inspector">QC Inspector</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Right Level</label>
                  <select
                    value={formData.right_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, right_level: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  >
                    <option value="1">Level 1 (Standard)</option>
                    <option value="2">Level 2 (Supervisor)</option>
                    <option value="10">Level 10 (Full Supervisor Admin)</option>
                    <option value="99">Level 99 (Super Admin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Welding Bay</label>
                  <input
                    type="number"
                    placeholder="Bay Number"
                    value={formData.bay}
                    onChange={(e) => setFormData(prev => ({ ...prev, bay: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Shop Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop A"
                    value={formData.shop_label}
                    onChange={(e) => setFormData(prev => ({ ...prev, shop_label: e.target.value }))}
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

      {/* Modal: Password Reset Confirmation Box */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-sm p-6 rounded-2xl shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-white">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Temporary Password Generated</h3>
              <p className="text-xs text-zinc-400 mt-2">
                Copy the temporary credentials below and provide it to the employee:
              </p>
            </div>
            
            <div className="bg-zinc-850 p-3 rounded-lg border border-zinc-800 select-all font-mono text-base font-bold text-white tracking-widest">
              {tempPassword}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-full px-4 py-2.5 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-lg text-xs cursor-pointer transition-all"
              >
                Close & Done
              </button>
            </div>
          </div>
        </div>
      )}

      <DevHints 
        title="Employees Directory"
        fe={['fe/src/app/dashboard/employees/page.js', 'fe/src/hooks/useEmployees.js']}
        be={['core/api_router.py (/api/employees)', 'core/api_router.py (/api/employees/{emp_id}/avatar)', 'core/api_router.py (/api/employees/{emp_id}/random-password)']}
        db={['tb_login']}
        condition="Manage workers. Admin features include profile edits, avatar uploads, deactivation/retirement, quick passwords reset, and unique hashed test credentials."
      />
    </div>
  );
}
