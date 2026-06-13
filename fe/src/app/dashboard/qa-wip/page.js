"use client";

import { useState, useEffect, useCallback } from 'react';
import { useQA } from '../../../hooks/useQA';
import DevHints from '../../../components/common/DevHints';
import { 
  CheckSquare, 
  Search, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  ClipboardCheck, 
  User, 
  FileSignature,
  FileText,
  Printer,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function QAWIPPage() {
  const {
    qaJobs,
    wipItems,
    loading,
    error,
    fetchQAJobs,
    fetchWIPItems,
    submitQAInspection,
    fetchWIPCompleteStatus,
    toggleWIPComplete
  } = useQA();

  const [selectedJobNumber, setSelectedJobNumber] = useState(null);
  const [selectedJobCompany, setSelectedJobCompany] = useState('');
  
  // WIP Complete 상태
  const [wipCompleted, setWipCompleted] = useState(null);
  const [wipCompletedDate, setWipCompletedDate] = useState(null);
  const [togglingWip, setTogglingWip] = useState(false);

  // Rework NCR modal state
  const [isNCRModalOpen, setIsNCRModalOpen] = useState(false);
  const [activeWIPItem, setActiveWIPItem] = useState(null);
  const [ncrComment, setNcrComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQAJobs();
  }, [fetchQAJobs]);

  const handleSelectJob = async (job) => {
    setSelectedJobNumber(job.job_number);
    setSelectedJobCompany(job.company_name);
    setWipCompleted(null);
    setWipCompletedDate(null);
    fetchWIPItems(job.job_number);
    // WIP Complete 상태 로드
    const statusRes = await fetchWIPCompleteStatus(job.job_number);
    if (statusRes.success) {
      setWipCompleted(statusRes.wip_completed);
      setWipCompletedDate(statusRes.wip_completed_date);
    }
  };

  const handleToggleWIPComplete = async () => {
    if (!selectedJobNumber) return;
    const label = wipCompleted ? 'Reset WIP inspection status?' : 'Mark WIP inspection as complete?';
    if (!confirm(label)) return;
    setTogglingWip(true);
    const res = await toggleWIPComplete(selectedJobNumber);
    setTogglingWip(false);
    if (res.success) {
      setWipCompleted(res.new_state);
      setWipCompletedDate(res.wip_completed_date);
      fetchQAJobs();
    } else {
      alert(res.message);
    }
  };

  const handlePass = async (wipId) => {
    if (confirm('Are you sure this member passes quality inspection?')) {
      const res = await submitQAInspection(wipId, true);
      if (res.success) {
        // Refresh WIP items list and jobs
        if (selectedJobNumber) fetchWIPItems(selectedJobNumber);
        fetchQAJobs();
      } else {
        alert(res.message);
      }
    }
  };

  const handleOpenNCRModal = (item) => {
    setActiveWIPItem(item);
    setNcrComment('');
    setIsNCRModalOpen(true);
  };

  const handleSaveNCR = async (e) => {
    e.preventDefault();
    if (!ncrComment.trim()) return;
    setSubmitting(true);
    const res = await submitQAInspection(activeWIPItem.wip_id, false, ncrComment);
    setSubmitting(false);
    if (res.success) {
      setIsNCRModalOpen(false);
      if (selectedJobNumber) fetchWIPItems(selectedJobNumber);
      fetchQAJobs();
    } else {
      alert(res.message);
    }
  };

  // QA Report Print Handler (legacy 73.php)
  const handlePrintQAReport = () => {
    if (!selectedJobNumber) return;

    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert("Popup blocker enabled. Please allow popups to print QA reports.");
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-NZ');
    const tableRows = wipItems.map((item, idx) => {
      return `
        <tr>
          <td>${idx + 1}</td>
          <td style="font-weight: bold;">${item.member}</td>
          <td>LOT ${item.lot}</td>
          <td>${item.wps}</td>
          <td>${item.in_house_inspector}</td>
          <td>${item.wip_version > 0 ? 'Rework v' + item.wip_version : 'Original'}</td>
          <td>${item.comment ? item.comment.replace(/\n/g, '<br>') : 'Pending Inspection'}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>QA Report - Job ${selectedJobNumber}</title>
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
          <h1>QA Quality Inspection Report</h1>
          <div class="info-grid">
            <div class="info-item">
              <strong>Job Number / Company</strong>
              <span>Job ${selectedJobNumber} - ${selectedJobCompany}</span>
            </div>
            <div class="info-item">
              <strong>Report Date</strong>
              <span>${todayStr}</span>
            </div>
            <div class="info-item">
              <strong>Pending Inspections</strong>
              <span>${wipItems.length} items</span>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Member Mark</th>
              <th style="width: 80px;">Lot</th>
              <th style="width: 150px;">WPS Specification</th>
              <th style="width: 120px;">Inspector</th>
              <th style="width: 100px;">Version</th>
              <th>NCR Comments / History</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer-sign">
          <div class="signature-box" style="margin-top: 50px;">
            In-House Welding Inspector
          </div>
          <div class="signature-box" style="margin-top: 50px;">
            Production Supervisor / Approval
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

  return (
    <div className="space-y-6 font-sans text-zinc-100 h-full flex flex-col">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6" />
            <span>QA Inspections</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Conduct in-house welding quality inspections, sign off components, and log Rework NCRs
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200 flex-shrink-0">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Main split dashboard view */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* Left Side: Pending QA Jobs (Col 4) */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden min-h-[300px]">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/40">
            <h2 className="text-sm font-semibold text-zinc-300">Pending QA Jobs ({qaJobs.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-850">
            {qaJobs.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-zinc-500 text-sm gap-2">
                <ClipboardCheck className="w-8 h-8 text-zinc-600" />
                <span>All jobs passed QA inspection!</span>
              </div>
            ) : (
              qaJobs.map((job) => {
                const isSelected = selectedJobNumber === job.job_number;
                return (
                  <div
                    key={job.job_number}
                    onClick={() => handleSelectJob(job)}
                    className={`p-4 cursor-pointer transition-all flex flex-col gap-1 ${
                      isSelected 
                        ? 'bg-zinc-800/60 border-l-2 border-white' 
                        : 'hover:bg-zinc-800/20'
                    }`}
                  >
                    <span className="text-sm font-bold text-white">Job {job.job_number}</span>
                    <p className="text-xs font-semibold text-zinc-400 truncate">{job.company_name}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: WIP Inspections List (Col 8) */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden min-h-[400px]">
          {!selectedJobNumber ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm gap-2">
              <CheckSquare className="w-10 h-10 text-zinc-700" />
              <span>Select a job from the list to view pending WIP inspections.</span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Info Header */}
              <div className="p-5 border-b border-zinc-800 bg-zinc-950/40 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-base font-bold text-white">Job {selectedJobNumber} WIP Items</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{selectedJobCompany}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {/* WIP Complete 토글 버튼 (legacy 41.php) */}
                  <button
                    id="btn-wip-complete-toggle"
                    onClick={handleToggleWIPComplete}
                    disabled={togglingWip}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
                      wipCompleted
                        ? 'bg-amber-950/20 border-amber-800/50 text-amber-400 hover:bg-amber-900/20'
                        : 'bg-green-950/20 border-green-900/50 text-green-400 hover:bg-green-900/20'
                    }`}
                    title={wipCompleted ? `WIP completed on ${wipCompletedDate}. Click to reset.` : 'Mark WIP inspection as complete'}
                  >
                    {wipCompleted ? (
                      <><RotateCcw className="w-3.5 h-3.5" /><span>Reset WIP</span></>
                    ) : (
                      <><ShieldCheck className="w-3.5 h-3.5" /><span>Mark WIP Complete</span></>
                    )}
                  </button>
                  <button
                    onClick={handlePrintQAReport}
                    className="p-2 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    title="Print QA Report"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="text-[10px] font-bold hidden sm:inline">Print Report</span>
                  </button>
                  <span className="text-xs font-semibold bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700">
                    {wipItems.length} pending checks
                  </span>
                </div>
              </div>

              {/* WIP items list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {wipItems.length === 0 ? (
                  <div className="text-zinc-500 text-xs text-center py-12">
                    All components for Job {selectedJobNumber} have passed QA!
                  </div>
                ) : (
                  wipItems.map((item) => (
                    <div 
                      key={item.wip_id} 
                      className="border border-zinc-850 rounded-xl p-4 bg-zinc-950/20 hover:border-zinc-750 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold bg-zinc-850 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded">
                            Lot {item.lot}
                          </span>
                          <span className="text-base font-bold text-white">{item.member}</span>
                          {item.wip_version > 0 && (
                            <span className="text-xs bg-red-950/30 border border-red-900/50 text-red-400 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Rework v{item.wip_version}
                            </span>
                          )}
                        </div>

                        {/* Specs checklist tags */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <FileSignature className="w-4 h-4 text-zinc-500" />
                            <span className="text-zinc-500">WPS:</span>
                            <span className="font-semibold text-zinc-300">{item.wps}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4 text-zinc-500" />
                            <span className="text-zinc-500">Inspector:</span>
                            <span className="font-semibold text-zinc-300">{item.in_house_inspector}</span>
                          </span>
                        </div>
                        
                        {item.comment && (
                          <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2">
                            <FileText className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                            <pre className="font-sans whitespace-pre-wrap leading-relaxed break-all">{item.comment}</pre>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handlePass(item.wip_id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-950/20 hover:bg-green-900/20 border border-green-900/50 hover:border-green-800 text-green-400 text-sm font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Pass</span>
                        </button>
                        <button
                          onClick={() => handleOpenNCRModal(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 hover:bg-red-900/20 border border-red-900/50 hover:border-red-800 text-red-400 text-sm font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Fail (NCR)</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: NCR Reason / Fail comments */}
      {isNCRModalOpen && activeWIPItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Log Non-Conformance (NCR) Rework</span>
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Enter details for failing member <span className="font-semibold text-zinc-200">{activeWIPItem.member}</span> (Lot {activeWIPItem.lot})
              </p>
            </div>

            <form onSubmit={handleSaveNCR} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Reason for Failure *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Weld undercut detected on base plate. Porosity issues on main fillet seam."
                  value={ncrComment}
                  onChange={(e) => setNcrComment(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 border-0 p-3 text-xs text-white focus:ring-1 focus:ring-zinc-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsNCRModalOpen(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-xs cursor-pointer transition-all disabled:opacity-50"
                >
                  {submitting ? 'Logging NCR...' : 'Submit Failure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DevHints 
        title="QA WIP Inspections"
        fe={['fe/src/app/dashboard/qa-wip/page.js', 'fe/src/hooks/useQA.js']}
        be={['core/api_router.py (/api/qa/jobs)', 'core/api_router.py (/api/qa/wip/{job_number})', 'core/api_router.py (/api/qa/inspect)', 'core/api_router.py (/api/qa/wip-complete/{job_number})', 'skills/015_qa_pipeline.py']}
        db={['tb_wip', 'tb_jobs', 'tb_jobs_details', 'tb_tasks']}
        condition="Quality inspections for structural steel welding. Logs pass status or raises NCR (Rework task auto-generates on Whiteboard and increments wip_version)."
      />
    </div>
  );
}
