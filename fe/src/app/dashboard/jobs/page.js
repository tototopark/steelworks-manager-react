"use client";

import { useState, useEffect, useCallback } from 'react';
import { useJobs } from '../../../hooks/useJobs';
import apiClient from '../../../services/apiClient';
import { 
  Briefcase, 
  Plus, 
  Database, 
  Trash2, 
  Edit3, 
  Upload, 
  FileText, 
  Image as ImageIcon,
  MapPin, 
  Calendar,
  AlertCircle,
  X,
  CheckCircle2,
  HardDrive,
  Play,
  Square,
  Printer
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import DevHints from '../../../components/common/DevHints';

export default function JobsPage() {
  const { user } = useAuth();
  const isAdmin = user?.right_level >= 10; // Level 10 or 99 is admin

  const {
    jobs,
    currentJobDetails,
    currentJobPhotos,
    jobInstallDates,
    loading,
    error,
    fetchJobs,
    fetchJobDetails,
    createJob,
    updateJob,
    deleteJob,
    ingestJob,
    fetchJobPhotos,
    uploadJobPhoto,
    fetchJobInstallDates,
    updateJobInstallDate,
    deleteJobInstallDate
  } = useJobs();

  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'photos'
  const [jobStatusFilter, setJobStatusFilter] = useState('active'); // 'active' or 'completed' or 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [devConfig, setDevConfig] = useState({ devHints: false });
  const [updatingFields, setUpdatingFields] = useState({}); // { "detailId_field": true }
  const [bulkUpdating, setBulkUpdating] = useState({}); // { "lotNum_field": true }
  
  // Modals state
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    job_number: '',
    company_name: '',
    site_address: '',
    superlot: '',
    lot_group: '',
    supervisor_name: '',
    builder_name: '',
    installer_name: ''
  });
  const [ingestData, setIngestData] = useState({
    job_number: '',
    company_name: '',
    site_address: '',
    excel_data: ''
  });
  const [modalError, setModalError] = useState('');

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

  useEffect(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    fetchJobs(jobStatusFilter, itemsPerPage, offset);
  }, [fetchJobs, jobStatusFilter, currentPage]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    fetchJobDetails(job.job_number);
    fetchJobPhotos(job.job_number);
    fetchJobInstallDates(job.job_number);
  };

  // Quick select helper for presentation
  const handleQuickSelectJob = (jobNumber, companyName, siteAddress) => {
    const tempJob = { job_number: jobNumber, company_name: companyName, site_address: siteAddress };
    setSelectedJob(tempJob);
    fetchJobDetails(jobNumber);
    fetchJobPhotos(jobNumber);
    fetchJobInstallDates(jobNumber);
  };

  // Job creation action
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!formData.job_number || !formData.company_name || !formData.site_address) {
      setModalError('Please fill in all required fields.');
      return;
    }
    const res = await createJob(formData.job_number, formData.company_name, formData.site_address, {
      superlot: formData.superlot,
      lot_group: formData.lot_group,
      supervisor_name: formData.supervisor_name,
      builder_name: formData.builder_name,
      installer_name: formData.installer_name
    });
    if (res.success) {
      setIsNewJobOpen(false);
      fetchJobs();
      setFormData({
        job_number: '',
        company_name: '',
        site_address: '',
        superlot: '',
        lot_group: '',
        supervisor_name: '',
        builder_name: '',
        installer_name: ''
      });
    } else {
      setModalError(res.message);
    }
  };

  // Excel Ingest action
  const handleIngestJob = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!ingestData.job_number || !ingestData.company_name || !ingestData.site_address || !ingestData.excel_data) {
      setModalError('Please fill in all fields.');
      return;
    }
    const res = await ingestJob(ingestData.job_number, ingestData.company_name, ingestData.site_address, ingestData.excel_data);
    if (res.success) {
      setIsIngestOpen(false);
      fetchJobs();
      setIngestData({
        job_number: '',
        company_name: '',
        site_address: '',
        excel_data: ''
      });
    } else {
      setModalError(res.message);
    }
  };

  // Edit action
  const handleOpenEdit = () => {
    if (!selectedJob) return;
    setFormData({
      job_number: selectedJob.job_number,
      company_name: selectedJob.company_name,
      site_address: selectedJob.site_address
    });
    setIsEditOpen(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setModalError('');
    const res = await updateJob(selectedJob.job_number, formData.company_name, formData.site_address);
    if (res.success) {
      setIsEditOpen(false);
      setSelectedJob(prev => ({
        ...prev,
        company_name: formData.company_name,
        site_address: formData.site_address
      }));
      fetchJobs();
    } else {
      setModalError(res.message);
    }
  };

  // Delete action
  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    if (confirm(`Are you sure you want to delete Job ${selectedJob.job_number} and all its member/WIP details? This action is irreversible.`)) {
      const res = await deleteJob(selectedJob.job_number);
      if (res.success) {
        setSelectedJob(null);
        fetchJobs();
      }
    }
  };

  // Photo upload action
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedJob) return;
    const res = await uploadJobPhoto(selectedJob.job_number, file);
    if (res.success) {
      fetchJobPhotos(selectedJob.job_number);
    } else {
      alert(res.message);
    }
  };

  // Member 가공 펀치 제어
  const handleMemberPunch = async (memberId, actionType) => {
    if (!user || !user.id) {
      alert("User session not found.");
      return;
    }
    try {
      const res = await apiClient.post('/api/punch', {
        employee_id: parseInt(user.id),
        action: actionType,
        job_detail_id: String(memberId)
      });
      if (res.data && res.data.status === 'success') {
        fetchJobDetails(selectedJob.job_number);
        alert(`Punch ${actionType === 'in' ? 'START' : 'STOP'} successfully recorded.`);
      } else {
        alert(res.data.message || "Failed to record punch.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Server communication error.");
    }
  };

  // Toggle a single member's status field (legacy 34.php)
  const handleDetailStatusToggle = async (member, field, currentVal) => {
    if (!selectedJob) return;
    const key = `${member.id}_${field}`;
    if (updatingFields[key]) return;

    const newVal = currentVal === 1 ? 0 : 1;
    setUpdatingFields(prev => ({ ...prev, [key]: true }));

    // Optimistic UI update
    const updatedDetails = currentJobDetails.map(d =>
      d.id === member.id ? { ...d, [field]: newVal } : d
    );
    // Update local via hook workaround: refetch after API
    try {
      await apiClient.patch(
        `/api/jobs/${selectedJob.job_number}/details/${member.id}/status`,
        { field, value: newVal }
      );
      fetchJobDetails(selectedJob.job_number);
    } catch (err) {
      console.error('Status update failed', err);
      alert(err.response?.data?.detail || 'Failed to update status.');
    } finally {
      setUpdatingFields(prev => { const n = { ...prev }; delete n[key]; return n; });
    }
  };

  // Bulk update all members in a lot (legacy 39.php)
  const handleBulkLotStatus = async (lotNum, field, value) => {
    if (!selectedJob) return;
    const key = `${lotNum}_${field}`;
    if (bulkUpdating[key]) return;
    if (!confirm(`Set ALL members in Lot ${lotNum} [${field}] to ${value === 1 ? 'DONE' : 'RESET'}?`)) return;

    setBulkUpdating(prev => ({ ...prev, [key]: true }));
    try {
      await apiClient.patch(
        `/api/jobs/${selectedJob.job_number}/lots/${lotNum}/bulk-status`,
        { field, value }
      );
      fetchJobDetails(selectedJob.job_number);
    } catch (err) {
      console.error('Bulk status update failed', err);
      alert(err.response?.data?.detail || 'Failed to bulk update.');
    } finally {
      setBulkUpdating(prev => { const n = { ...prev }; delete n[key]; return n; });
    }
  };

  // Jobsheet Print Handler (legacy 64.php)
  const handlePrintJobsheet = (lotNum = null) => {
    if (!selectedJob) return;

    let targetMembers = [];
    let titleStr = `Jobsheet - Job ${selectedJob.job_number}`;

    if (lotNum !== null) {
      targetMembers = groupedDetails[lotNum] || [];
      titleStr += ` (LOT ${lotNum})`;
    } else {
      // All lots sorted
      const sortedLots = Object.keys(groupedDetails).sort((a, b) => parseInt(a) - parseInt(b));
      sortedLots.forEach(l => {
        targetMembers.push(...groupedDetails[l]);
      });
    }

    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert("Popup blocker enabled. Please allow popups to print jobsheets.");
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-NZ');
    const tableRows = targetMembers.map((m, idx) => {
      const isCompleted = m.member.toLowerCase().startsWith('task') ? m.finish === 1 : m.made === 1;
      return `
        <tr>
          <td>${idx + 1}</td>
          <td style="font-weight: bold;">${m.member}</td>
          <td>LOT ${m.lot}</td>
          <td>${m.GalvAndPaint === 1 ? 'Yes' : 'No'}</td>
          <td>
            <span class="badge ${isCompleted ? 'badge-success' : 'badge-pending'}">
              ${isCompleted ? 'Made / Finished' : 'Pending'}
            </span>
          </td>
          <td>
            <span class="badge ${m.finish === 1 ? 'badge-success' : 'badge-pending'}">
              ${m.finish === 1 ? 'Finished' : 'In Progress'}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${titleStr}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #18181b;
            padding: 40px;
            background: #fff;
          }
          .header {
            border-bottom: 2px solid #18181b;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
            font-size: 13px;
          }
          .info-item strong {
            color: #71717a;
            font-size: 11px;
            text-transform: uppercase;
            display: block;
            margin-bottom: 2px;
          }
          .info-item span {
            font-size: 14px;
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #e4e4e7;
            padding: 10px 12px;
            text-align: left;
          }
          th {
            background-color: #f4f4f5;
            font-weight: 700;
            color: #27272a;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.05em;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            font-size: 9px;
            font-weight: 700;
            border-radius: 4px;
            text-transform: uppercase;
          }
          .badge-success {
            background-color: #d1fae5;
            color: #065f46;
          }
          .badge-pending {
            background-color: #f4f4f5;
            color: #71717a;
          }
          .footer-sign {
            margin-top: 60px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
            font-size: 12px;
          }
          .signature-box {
            border-top: 1px solid #a1a1aa;
            padding-top: 10px;
            text-align: center;
            color: #71717a;
          }
          @media print {
            body { padding: 20px; }
            button { display: none; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${titleStr}</h1>
          <div class="info-grid">
            <div class="info-item">
              <strong>Job Number / Company</strong>
              <span>${selectedJob.job_number} - ${selectedJob.company_name}</span>
            </div>
            <div class="info-item">
              <strong>Site Address</strong>
              <span>${selectedJob.site_address || 'N/A'}</span>
            </div>
            <div class="info-item">
              <strong>Date Printed</strong>
              <span>${todayStr}</span>
            </div>
            <div class="info-item">
              <strong>Total Steel Members</strong>
              <span>${targetMembers.length} pcs</span>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Member Mark</th>
              <th style="width: 80px;">Lot</th>
              <th style="width: 100px;">Galv & Paint</th>
              <th style="width: 130px;">Fabrication Status</th>
              <th style="width: 130px;">Final Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer-sign">
          <div class="signature-box" style="margin-top: 50px;">
            Fabricator / Welder Signature
          </div>
          <div class="signature-box" style="margin-top: 50px;">
            QA Inspector / Supervisor Signature
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Determine which status fields this user can toggle
  const getEditableFields = () => {
    if (!user) return new Set();
    const lvl = user.right_level || 0;
    const fields = new Set();
    if ([4, 6, 68, 9].includes(lvl) || lvl >= 10) fields.add('design');
    if ([1, 6, 68, 9].includes(lvl) || lvl >= 10) { fields.add('made'); fields.add('loaded'); }
    if ([2, 8, 12, 6, 68, 9].includes(lvl) || lvl >= 10) {
      fields.add('on_site'); fields.add('temp_fix'); fields.add('chemset'); fields.add('tightened');
    }
    if ([6, 68, 9].includes(lvl) || lvl >= 10) fields.add('finish');
    return fields;
  };
  const editableFields = getEditableFields();

  // Group details by lot
  const groupedDetails = currentJobDetails.reduce((acc, curr) => {
    const lot = curr.lot || 1;
    if (!acc[lot]) acc[lot] = [];
    acc[lot].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-6 font-sans text-zinc-100 h-full flex flex-col">
      {/* Upper header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            <span>Job Management</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create jobs, ingest drawings/spec members, upload photos, and track production status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsIngestOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer transition-all"
          >
            <Database className="w-4 h-4 text-zinc-400" />
            <span>Ingest Excel</span>
          </button>
          <button
            onClick={() => setIsNewJobOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-semibold cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200 flex-shrink-0">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Main split dashboard view */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* Left Side: Active Jobs List (Col 5) */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden min-h-[300px]">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-300">Jobs Database ({jobs.length})</h2>
            </div>
            
            {/* Status Tabs Selection */}
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-850 text-[10px] font-bold">
              {[
                { id: 'active', label: 'Active' },
                { id: 'completed', label: 'Completed' },
                { id: 'all', label: 'All Jobs' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setJobStatusFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                    jobStatusFilter === tab.id 
                      ? 'bg-zinc-800 text-white shadow-sm' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dev Quick Presentation guide */}
          {devConfig.devHints && (
            <div className="bg-amber-950/20 border-b border-zinc-850 p-3 text-[11px] space-y-1.5">
              <span className="font-bold text-amber-500 block uppercase tracking-wider text-[10px]">Presentation Quick Access (Photos Available):</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickSelectJob(73, "Mike Greer Homes", "Lot 23, Pokeno")}
                  className="px-2 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:text-white cursor-pointer"
                >
                  Job 73 (Greer Homes)
                </button>
                <button
                  onClick={() => handleQuickSelectJob(74, "Best Nest-James", "Lot 15, Mercer")}
                  className="px-2 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:text-white cursor-pointer"
                >
                  Job 74 (Best Nest)
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-850">
            {jobs.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-zinc-500 text-sm gap-2">
                <HardDrive className="w-8 h-8 text-zinc-600" />
                <span>No jobs found matching criteria.</span>
              </div>
            ) : (
              jobs.map((job) => {
                const isSelected = selectedJob?.job_number === job.job_number;
                return (
                  <div
                    key={job.job_number}
                    onClick={() => handleSelectJob(job)}
                    className={`p-4 cursor-pointer transition-all flex flex-col gap-1.5 ${
                      isSelected 
                        ? 'bg-zinc-800/60 border-l-2 border-white' 
                        : 'hover:bg-zinc-800/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Job {job.job_number}</span>
                      <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {job.date_creation}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-300 truncate">{job.company_name}</p>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-zinc-600" />
                      {job.site_address}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Jobs List Pagination Bar */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Page {currentPage}</span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-35 disabled:cursor-not-allowed rounded cursor-pointer text-zinc-300 hover:text-white"
              >
                Prev
              </button>
              <button
                disabled={jobs.length < itemsPerPage}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-35 disabled:cursor-not-allowed rounded cursor-pointer text-zinc-300 hover:text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Job Details / Drawings (Col 7) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden min-h-[400px]">
          {!selectedJob ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm gap-2">
              <Briefcase className="w-10 h-10 text-zinc-700" />
              <span>Select a job from the list to view members and drawings.</span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Job Detail Header Panel */}
              <div className="p-5 border-b border-zinc-800 bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-white">Job {selectedJob.job_number} - {selectedJob.company_name}</h2>
                  </div>
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {selectedJob.site_address}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handlePrintJobsheet(null)}
                    className="p-2 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white cursor-pointer transition-all flex items-center gap-1.5"
                    title="Print Entire Jobsheet"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="text-[10px] font-bold hidden sm:inline">Print All</span>
                  </button>
                  <button
                    onClick={handleOpenEdit}
                    className="p-2 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white cursor-pointer transition-all"
                    title="Edit Job Address"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={handleDeleteJob}
                      className="p-2 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer transition-all"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-zinc-800 bg-zinc-950/20 px-4 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'members' 
                      ? 'border-white text-white' 
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  Members & Lots
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'photos' 
                      ? 'border-white text-white' 
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  Drawings & Photos ({currentJobPhotos.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'members' ? (
                  <div className="space-y-6">
                    {Object.keys(groupedDetails).length === 0 ? (
                      <div className="text-zinc-500 text-xs text-center py-12">
                        No steelwork members found for this job. Use Ingest Excel to load details.
                      </div>
                    ) : (
                      Object.keys(groupedDetails).sort((a, b) => parseInt(a) - parseInt(b)).map((lotNum) => {
                        const lotInt = parseInt(lotNum);
                        const installInfo = jobInstallDates.find(d => d.lot === lotInt) || {
                          date_install: '',
                          status_install: 'design'
                        };

                        return (
                          <div key={lotNum} className="border border-zinc-850 rounded-xl overflow-hidden bg-zinc-950/10">
                            <div className="px-4 py-2.5 bg-zinc-950/40 border-b border-zinc-850 flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-300">LOT {lotNum}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-zinc-500 font-semibold bg-zinc-900 px-2 py-0.5 rounded">
                                    {groupedDetails[lotNum].length} components
                                  </span>
                                  <button
                                    onClick={() => handlePrintJobsheet(lotInt)}
                                    className="p-1 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-400 hover:text-white transition-all cursor-pointer"
                                    title={`Print Lot ${lotNum} Jobsheet`}
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </button>
                                  {isAdmin && (
                                    <div className="flex items-center gap-1">
                                      {['loaded', 'on_site', 'finish'].map(f => (
                                        <button
                                          key={f}
                                          onClick={() => handleBulkLotStatus(parseInt(lotNum), f, 1)}
                                          disabled={!!bulkUpdating[`${lotNum}_${f}`]}
                                          className="text-[9px] px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 rounded text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
                                          title={`Tick All Lot ${lotNum}: ${f}`}
                                        >
                                          All {f === 'on_site' ? 'On Site' : f.charAt(0).toUpperCase() + f.slice(1)}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Installation Date and Status Row */}
                              <div className="flex flex-wrap items-center gap-3 bg-zinc-900/60 p-2 rounded-lg border border-zinc-850/50">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-medium text-zinc-400">Install Date:</span>
                                  <input 
                                    type="date" 
                                    value={installInfo.date_install || ''} 
                                    onChange={(e) => updateJobInstallDate(selectedJob.job_number, lotInt, e.target.value, installInfo.status_install)}
                                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-medium text-zinc-400">Status:</span>
                                  <select 
                                    value={installInfo.status_install || 'design'} 
                                    onChange={(e) => updateJobInstallDate(selectedJob.job_number, lotInt, installInfo.date_install, e.target.value)}
                                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
                                  >
                                    <option value="design">Design</option>
                                    <option value="fabrication">Fabrication</option>
                                    <option value="ready">Ready</option>
                                    <option value="temp installed">Temp Installed</option>
                                    <option value="finished">Finished</option>
                                  </select>
                                </div>
                                {isAdmin && installInfo.id && (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Reset and delete install date schedule for Lot ${lotNum}?`)) {
                                        deleteJobInstallDate(selectedJob.job_number, lotInt);
                                      }
                                    }}
                                    className="text-[9px] text-rose-400 hover:text-rose-300 font-semibold px-2 py-0.5 border border-rose-900/30 hover:border-rose-800 bg-rose-950/20 hover:bg-rose-950/40 rounded transition-all cursor-pointer ml-auto"
                                  >
                                    Reset Date
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="divide-y divide-zinc-850">
                            {groupedDetails[lotNum].map((member) => {
                              const isTask = member.member.toLowerCase().startsWith('task');
                              const isCompleted = isTask ? member.finish === 1 : member.made === 1;
                              
                              return (
                                <div key={member.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                  <div className="space-y-1">
                                    <p className="font-semibold text-white">{member.member}</p>
                                    {member.GalvAndPaint === 1 && (
                                      <span className="inline-block text-[9px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-1 py-0.2 rounded font-medium">
                                        Galv & Paint
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-3">
                                    {/* Action Buttons for punch */}
                                    {!isCompleted && user && (
                                      <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-3 mr-1">
                                        <button
                                          onClick={() => handleMemberPunch(member.id, 'in')}
                                          className="flex items-center gap-1 px-2 py-1 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded hover:bg-blue-600 hover:text-white transition-all cursor-pointer text-[10px] font-bold"
                                          title="Start work on this part"
                                        >
                                          <Play className="w-2.5 h-2.5" />
                                          <span>Start</span>
                                        </button>
                                        <button
                                          onClick={() => handleMemberPunch(member.id, 'out')}
                                          className="flex items-center gap-1 px-2 py-1 bg-zinc-850 text-zinc-400 border border-zinc-850 rounded hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-pointer text-[10px] font-bold"
                                          title="Stop/Complete work on this part"
                                        >
                                          <Square className="w-2.5 h-2.5" />
                                          <span>Stop</span>
                                        </button>
                                      </div>
                                    )}

                                     {/* Status indicators bar - clickable toggles */}
                                     <div className="flex flex-wrap items-center gap-1.5">
                                       {[
                                         { label: 'Design', field: 'design', val: member.design },
                                         { label: 'Made', field: 'made', val: member.made },
                                         { label: 'Loaded', field: 'loaded', val: member.loaded },
                                         { label: 'On Site', field: 'on_site', val: member.on_site },
                                         { label: 'TmpFix', field: 'temp_fix', val: member.temp_fix },
                                         { label: 'Chemset', field: 'chemset', val: member.chemset },
                                         { label: 'Tightened', field: 'tightened', val: member.tightened },
                                         { label: 'Finish', field: 'finish', val: member.finish }
                                       ].map((step) => {
                                         const canEdit = editableFields.has(step.field);
                                         const isUpdating = !!updatingFields[`${member.id}_${step.field}`];
                                         return (
                                           <button
                                             key={step.field}
                                             onClick={() => canEdit && handleDetailStatusToggle(member, step.field, step.val)}
                                             disabled={!canEdit || isUpdating}
                                             title={canEdit ? `Click to ${step.val === 1 ? 'uncheck' : 'check'} ${step.label}` : `No permission to edit ${step.label}`}
                                             className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border transition-all ${
                                               step.val === 1
                                                 ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                                                 : 'bg-zinc-950/20 border-zinc-900 text-zinc-600'
                                             } ${
                                               canEdit ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'
                                             } ${
                                               isUpdating ? 'animate-pulse' : ''
                                             }`}
                                           >
                                             {isUpdating ? '...' : step.val === 1 ? step.label + ' ✓' : step.label}
                                           </button>
                                         );
                                       })}
                                     </div>
                                  </div>
                                </div>
                              );
                            })}
                            </div>
                          </div>
                        );
                      })
                    )}

                  </div>
                ) : (
                  // Drawings and Photos Tab
                  <div className="space-y-6">
                    {/* Uploader Card */}
                    <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-750 bg-zinc-950/20 hover:bg-zinc-950/40 p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all relative">
                      <input 
                        type="file" 
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.dwg,.dxf"
                      />
                      <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                      <p className="text-xs font-semibold text-white">Upload Drawing or Site Photo</p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        PDF, DWG, DXF or Images (PNG, JPG) up to 10MB
                      </p>
                    </div>

                    {/* Media list grid */}
                    {currentJobPhotos.length === 0 ? (
                      <div className="text-zinc-500 text-xs text-center py-12">
                        No documents or photos uploaded yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {currentJobPhotos.map((photo) => {
                          const isPdf = photo.photo_name.toLowerCase().endsWith('.pdf');
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(photo.photo_name);
                          
                          return (
                            <a 
                              key={photo.id}
                              href={photo.photo_name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group bg-zinc-950/40 border border-zinc-850 rounded-xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col text-left"
                            >
                              <div className="aspect-video bg-zinc-900 flex items-center justify-center border-b border-zinc-850 overflow-hidden relative">
                                {isImage ? (
                                  <img 
                                    src={photo.photo_name} 
                                    alt="Job asset" 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
                                  />
                                ) : isPdf ? (
                                  <FileText className="w-8 h-8 text-zinc-400" />
                                ) : (
                                  <ImageIcon className="w-8 h-8 text-zinc-500" />
                                )}
                              </div>
                              <div className="p-2.5 truncate">
                                <span className="text-[10px] font-semibold text-zinc-300 truncate block">
                                  {photo.photo_name.split('/').pop()}
                                </span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Job */}
      {isNewJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create New Job</h3>
              <button onClick={() => setIsNewJobOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {modalError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">{modalError}</p>
            )}

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Job Number *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 8001"
                    value={formData.job_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, job_number: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Builders Ltd"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Site Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lot 45, 12 Pokeno Rd"
                  value={formData.site_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_address: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Supervisor Name</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={formData.supervisor_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, supervisor_name: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Builder Name</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={formData.builder_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, builder_name: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsNewJobOpen(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-zinc-950 font-semibold rounded-lg text-xs cursor-pointer hover:bg-zinc-200 transition-all"
                >
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ingest Excel */}
      {isIngestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-lg p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-zinc-400" />
                <span>Ingest Excel Member Data</span>
              </h3>
              <button onClick={() => setIsIngestOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {modalError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">{modalError}</p>
            )}

            <form onSubmit={handleIngestJob} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Job Number *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 8002"
                    value={ingestData.job_number}
                    onChange={(e) => setIngestData(prev => ({ ...prev, job_number: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Beta Construction"
                    value={ingestData.company_name}
                    onChange={(e) => setIngestData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Site Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 89 Albert St, Auckland CBD"
                  value={ingestData.site_address}
                  onChange={(e) => setIngestData(prev => ({ ...prev, site_address: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Raw Tab-Delimited Data (Paste from Excel) *</label>
                <p className="text-[10px] text-zinc-500 mb-1.5">
                  Expected Columns: <span className="font-mono bg-zinc-950 px-1 rounded text-zinc-400">Page [TAB] Lot [TAB] MemberName</span>
                </p>
                <textarea
                  required
                  rows={6}
                  placeholder={`1	1	B1&#10;1	1	B2&#10;2	2	ncr_rework_v1`}
                  value={ingestData.excel_data}
                  onChange={(e) => setIngestData(prev => ({ ...prev, excel_data: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-xs text-white focus:ring-1 focus:ring-zinc-600 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsIngestOpen(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-zinc-950 font-semibold rounded-lg text-xs cursor-pointer hover:bg-zinc-200 transition-all"
                >
                  Ingest Members
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Job Info */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Edit Job Information</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {modalError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">{modalError}</p>
            )}

            <form onSubmit={handleUpdateJob} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Site Address</label>
                <input
                  type="text"
                  required
                  value={formData.site_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_address: e.target.value }))}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-2 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                />
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DevHints 
        title="Jobs Management"
        fe={['fe/src/app/dashboard/jobs/page.js', 'fe/src/hooks/useJobs.js']}
        be={['core/api_router.py (/api/jobs)', 'core/api_router.py (/api/jobs/{job_number}/details)', 'core/api_router.py (/api/jobs/{job_number}/install-dates)', 'skills/010_job_pipeline.py']}
        db={['tb_jobs', 'tb_jobs_details', 'tb_jobs_date_install', 'tb_photos', 'tb_wip']}
        condition="Recent 50 jobs list with query filters, new job creation, excel ingestion, photo/drawing uploads, lot status checkers, install date manager, and workorder sheet printing."
      />
    </div>
  );
}
