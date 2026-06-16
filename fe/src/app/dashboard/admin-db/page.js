"use client";
 
import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import { useAdminDB } from '../../../hooks/useAdminDB';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Database, 
  ShieldAlert, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  RotateCcw, 
  FileSpreadsheet, 
  RefreshCcw, 
  Search,
  CheckCircle,
  Table as TableIcon,
  HelpCircle,
  X
} from 'lucide-react';
import DevHints from '../../../components/common/DevHints';
 
export default function AdminDBPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.right_level >= 99;
 
  const {
    tables,
    tableData,
    totalCount,
    loading,
    error,
    fetchTables,
    fetchTableData,
    runIntegrityCheck,
    seedDatabase,
    cleanDatabase,
    resetAllPasswords,
    resetAllPasswordsHashed,
    migrateLegacyData,
    randomizeNames,
    shiftDatesToToday
  } = useAdminDB();
 
  const [selectedTable, setSelectedTable] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('explorer');
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  
  // Pan and Zoom States for ERD Diagram
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    // Zoom in/out via wheel scroll
    e.preventDefault();
    const zoomIntensity = 0.08;
    const nextScale = e.deltaY < 0 ? scale + zoomIntensity : scale - zoomIntensity;
    setScale(Math.min(Math.max(nextScale, 0.25), 4)); // scale bounds: 0.25x to 4x
  };

  const handleMouseDown = (e) => {
    // Only drag with left mouse click
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoomPan = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (activeTab === 'erd') {
      // Reset position/zoom when switching to ERD tab
      resetZoomPan();
      if (typeof window !== 'undefined' && window.mermaid) {
        try {
          setTimeout(() => {
            window.mermaid.run({
              nodes: document.querySelectorAll('.mermaid')
            }).catch(err => {
              // fallback
              window.mermaid.contentLoaded();
            });
          }, 100);
        } catch (e) {
          try {
            window.mermaid.contentLoaded();
          } catch(err) {
            console.error("Failed to render mermaid diagram", err);
          }
        }
      }
    }
  }, [activeTab, mermaidLoaded]);
  const itemsPerPage = 10;

  // Maintenance Dialogs State
  const [dialogContent, setDialogContent] = useState(null); // { type, title, message, action, confirmText }
  const [integrityResults, setIntegrityResults] = useState(null);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchTables();
    }
  }, [fetchTables, isSuperAdmin]);

  const loadTableRecords = useCallback((tableName, page = 1, order = 'desc') => {
    if (!tableName) return;
    const offset = (page - 1) * itemsPerPage;
    fetchTableData(tableName, itemsPerPage, offset, order);
  }, [fetchTableData]);

  const handleSelectTable = (tableName) => {
    setSelectedTable(tableName);
    setCurrentPage(1);
    loadTableRecords(tableName, 1, sortOrder);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadTableRecords(selectedTable, newPage, sortOrder);
  };

  const handleSortToggle = () => {
    const nextOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(nextOrder);
    setCurrentPage(1);
    loadTableRecords(selectedTable, 1, nextOrder);
  };

  // Close Maintenance Dialogs
  const closeDialog = () => setDialogContent(null);

  // Maintenance Actions wrapper
  const triggerAction = (type, title, message, action, confirmText = 'Execute') => {
    setDialogContent({ type, title, message, action, confirmText });
  };

  const handleExecuteMaintenance = async () => {
    if (!dialogContent) return;
    const actionFn = dialogContent.action;
    closeDialog();
    
    setIntegrityResults({ status: 'running', message: 'Executing database operation...' });
    const res = await actionFn();
    
    if (res.success) {
      setIntegrityResults({
        status: 'success',
        message: res.message || 'Operation executed successfully.',
        details: res.details
      });
      // Refresh state
      fetchTables();
      if (selectedTable) {
        handleSelectTable(selectedTable);
      }
    } else {
      setIntegrityResults({
        status: 'error',
        message: res.message || 'Failed to complete database operation.'
      });
    }
  };

  // Integrity Check execution
  const handleIntegrityCheck = async (fix = false) => {
    setIntegrityResults({ status: 'running', message: 'Checking database schema integrity...' });
    const res = await runIntegrityCheck(fix);
    if (res.success) {
      setIntegrityResults({
        status: 'success',
        message: res.message || 'Schema integrity check finished.',
        details: res.details
      });
    } else {
      setIntegrityResults({
        status: 'error',
        message: res.message || 'Database integrity error.'
      });
    }
  };

  // Render dynamic table columns
  const getTableColumns = () => {
    if (tableData.length === 0) return [];
    return Object.keys(tableData[0]);
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex-1 bg-zinc-950 flex flex-col justify-between p-6 min-h-[400px]">
        <div className="flex-1 flex flex-col items-center justify-center text-center font-sans">
          <div className="w-16 h-16 bg-red-950/40 border border-red-900/50 rounded-full flex items-center justify-center text-red-500 mb-4 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-zinc-400 max-w-sm">
            You do not have sufficient admin credentials to view the database console. Admin Level 99 is required.
          </p>
        </div>
        <DevHints 
          title="Database & Diagnostics"
          fe={['fe/src/app/dashboard/admin-db/page.js', 'fe/src/hooks/useAdminDB.js']}
          be={['core/api_router.py (/api/admin/db_inspect/*)', 'core/api_router.py (/api/admin/db_integrity)', 'core/api_router.py (/api/admin/db_seed)', 'skills/200_admin_pipeline.py']}
          db={['Dynamic tables lookup', 'Interactive ERD schema visualization']}
          condition="Super admin workspace for data migration, diagnostics, mock seeding, and interactive ERD schema diagram exploration."
        />
      </div>
    );
  }

  const columns = getTableColumns();
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6 font-sans text-zinc-100 h-full flex flex-col">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6" />
            <span>Database Console</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Perform administrative SQL table inspections, seed mock data, run integrity checks, and execute factory resets
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200 flex-shrink-0">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Toolbox cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 flex-shrink-0">
        {/* Integrity Check */}
        <button
          onClick={() => handleIntegrityCheck(false)}
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-4 text-left space-y-2 cursor-pointer transition-all flex flex-col justify-between"
        >
          <Play className="w-5 h-5 text-zinc-400" />
          <div>
            <h3 className="text-xs font-bold text-white">Integrity Check</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Verify SQLite schemas</p>
          </div>
        </button>

        {/* Reset Passwords Plaintext */}
        <button
          onClick={() => triggerAction(
            'passwords',
            'Reset Workforce Passwords to Plaintext 12345678',
            'This will reset ALL standard employee passwords to the plaintext "12345678" in the database. Users will be prompted to change their passwords upon logging in.',
            resetAllPasswords,
            'Reset Passwords (Plain)'
          )}
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-4 text-left space-y-2 cursor-pointer transition-all flex flex-col justify-between"
        >
          <RotateCcw className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-xs font-bold text-white">Reset to 12345678</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Reset all passwords to plaintext 12345678</p>
          </div>
        </button>

        {/* Reset Passwords Hashed (Dev Only) */}
        <button
          onClick={() => triggerAction(
            'passwords_hashed',
            'Reset Workforce Passwords to Unique Hashed dev_[login]',
            'This will reset ALL standard employee passwords to unique hashed "dev_[login]" (e.g. dev_Aaron) in the database. Users will bypass the password change process and log in directly.',
            resetAllPasswordsHashed,
            'Reset Passwords (Hashed)'
          )}
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-4 text-left space-y-2 cursor-pointer transition-all flex flex-col justify-between"
        >
          <RotateCcw className="w-5 h-5 text-green-500" />
          <div>
            <h3 className="text-xs font-bold text-white">Reset to Unique Hashed</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Reset all passwords to unique dev_[login] (Bypass change)</p>
          </div>
        </button>

        {/* Randomize Names */}
        <button
          onClick={() => triggerAction(
            'randomize',
            'Randomize Employee Names',
            'This will replace all real employee first and last names with random English names. System accounts will be renamed Demo [Login]. Owner account (Brian) will be preserved. This is irreversible without re-migration.',
            randomizeNames,
            'Randomize Names'
          )}
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-4 text-left space-y-2 cursor-pointer transition-all flex flex-col justify-between"
        >
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-xs font-bold text-white">Randomize Names</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Anonymize employee names for demo</p>
          </div>
        </button>

        {/* Migrate Legacy */}
        <button
          onClick={() => triggerAction(
            'migrate',
            'Migrate Legacy MySQL Data',
            'This action imports historical project jobs, members, and logins from the legacy SQL backup file. This might take a few moments.',
            migrateLegacyData,
            'Migrate Data'
          )}
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-4 text-left space-y-2 cursor-pointer transition-all flex flex-col justify-between"
        >
          <FileSpreadsheet className="w-5 h-5 text-zinc-400" />
          <div>
            <h3 className="text-xs font-bold text-white">Migrate Legacy</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Import historical DB</p>
          </div>
        </button>

        {/* Seed Database */}
        <button
          onClick={() => triggerAction(
            'seed',
            'Seed Database',
            'This will populate the database with mock records (jobs, welding bays, employees, whiteboard tasks, punchsheets) for development testing.',
            seedDatabase,
            'Seed Mock Data'
          )}
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-4 text-left space-y-2 cursor-pointer transition-all flex flex-col justify-between"
        >
          <RefreshCcw className="w-5 h-5 text-zinc-400" />
          <div>
            <h3 className="text-xs font-bold text-white">Seed Database</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Load dev test data</p>
          </div>
        </button>

        {/* Sync Dates to Today */}
        <button
          onClick={() => triggerAction(
            'shift_dates',
            'Sync All Dates to Today',
            'This will shift ALL date values in every table forward so the most recent record aligns with today. Punchsheet year/month/day/week will also be recalculated. Run once after migration to make recent-data searches work correctly.',
            shiftDatesToToday,
            'Shift Dates'
          )}
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl p-4 text-left space-y-2 cursor-pointer transition-all flex flex-col justify-between"
        >
          <RefreshCcw className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-xs font-bold text-white">Sync Dates to Today</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Shift all DB dates to current time</p>
          </div>
        </button>

        {/* Clean Data / Factory Reset */}
        <button
          onClick={() => triggerAction(
            'clean',
            'Factory Reset Database',
            'WARNING: This will completely drop all tables and recreate clean empty tables. All current records will be permanently deleted.',
            cleanDatabase,
            'Factory Reset'
          )}
          className="bg-zinc-900 hover:bg-zinc-850/40 border border-zinc-800 hover:border-red-950/50 rounded-xl p-4 text-left space-y-2 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <AlertTriangle className="w-5 h-5 text-zinc-500 group-hover:text-red-400 transition-colors" />
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">Factory Reset</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Permanent data wipe</p>
          </div>
        </button>
      </div>

      {/* Integrity / Maintenance results console */}
      {integrityResults && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex-shrink-0 flex items-start gap-3 relative">
          <button 
            onClick={() => setIntegrityResults(null)}
            className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="mt-0.5">
            {integrityResults.status === 'running' ? (
              <div className="w-4.5 h-4.5 border-2 border-t-white border-zinc-700 rounded-full animate-spin" />
            ) : integrityResults.status === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
          </div>
          
          <div className="space-y-1.5 flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white">System Console Output</h4>
            <p className="text-xs text-zinc-400">{integrityResults.message}</p>
            {integrityResults.details && (
              <pre className="mt-2 text-[10px] font-mono bg-zinc-950 p-3 rounded-lg overflow-x-auto text-zinc-400 leading-relaxed max-h-40 overflow-y-auto">
                {typeof integrityResults.details === 'object' 
                  ? JSON.stringify(integrityResults.details, null, 2) 
                  : integrityResults.details}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex border-b border-zinc-800 flex-shrink-0">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'explorer' 
              ? 'border-white text-white' 
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Data Explorer
        </button>
        <button
          onClick={() => setActiveTab('menu-structure')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'menu-structure' 
              ? 'border-white text-white' 
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Menu Permissions (권한별 메뉴 구조)
        </button>
        <button
          onClick={() => setActiveTab('erd')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'erd' 
              ? 'border-white text-white' 
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          ERD Diagram (Graph)
        </button>
      </div>

      {activeTab === 'explorer' ? (
        /* Main split database console viewer */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
          {/* Left Side: Table List (Col 4) */}
          <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden min-h-[250px]">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/40">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Database Tables ({tables.length})</h2>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-850">
              {tables.map((tName) => {
                const isSelected = selectedTable === tName;
                return (
                  <div
                    key={tName}
                    onClick={() => handleSelectTable(tName)}
                    className={`px-4 py-3 cursor-pointer transition-all flex items-center justify-between text-xs ${
                      isSelected 
                        ? 'bg-zinc-800/60 border-l-2 border-white text-white font-semibold' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/20'
                    }`}
                  >
                    <span className="truncate">{tName}</span>
                    <TableIcon className="w-3.5 h-3.5 flex-shrink-0 opacity-40" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Grid Data Inspect Viewer (Col 8) */}
          <div className="lg:col-span-9 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden min-h-[350px]">
            {!selectedTable ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-xs gap-2">
                <Database className="w-10 h-10 text-zinc-700" />
                <span>Select a table from the sidebar to inspect its raw SQL row contents.</span>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Table header console */}
                <div className="p-4 border-b border-zinc-800 bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                  <div>
                    <h2 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase">
                      <TableIcon className="w-4 h-4 text-zinc-400" />
                      <span>Table: {selectedTable}</span>
                    </h2>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Viewing {tableData.length} of {totalCount} records (Sorted: ID {sortOrder})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSortToggle}
                      className="px-2.5 py-1.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 rounded-lg text-[10px] font-semibold text-zinc-300 hover:text-white cursor-pointer transition-all"
                    >
                      Sort: {sortOrder.toUpperCase()}
                    </button>
                  </div>
                </div>

                {/* Dynamic SQL records Table */}
                <div className="flex-1 overflow-auto">
                  {loading ? (
                    <div className="h-64 flex items-center justify-center text-zinc-500 text-xs font-medium animate-pulse">
                      Inspecting table records...
                    </div>
                  ) : tableData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-zinc-500 text-xs">
                      This table is empty.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-max text-[11px]">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-950/40 font-semibold text-zinc-400">
                          {columns.map((col) => (
                            <th key={col} className="p-3 font-semibold">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850">
                        {tableData.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-zinc-800/10 transition-colors">
                            {columns.map((col) => (
                              <td key={col} className="p-3 font-mono text-zinc-300 max-w-xs truncate" title={String(row[col])}>
                                {row[col] === null || row[col] === undefined ? (
                                  <span className="text-zinc-650 italic">NULL</span>
                                ) : typeof row[col] === 'boolean' ? (
                                  String(row[col])
                                ) : (
                                  String(row[col])
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination bar */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between flex-shrink-0 text-xs text-zinc-400">
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-30 rounded-lg transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-30 rounded-lg transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'menu-structure' ? (
        /* 관리자 권한별 접근 메뉴 구조도 Panel */
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-hidden min-h-[450px] flex flex-col space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. 관리자 권한별 접근 메뉴 구조도</h2>
            <p className="text-xs text-zinc-400 mt-1">
              레거시 <code className="text-zinc-300 font-mono bg-zinc-950 px-1 py-0.5 rounded">sitepro</code> 시스템에서는 <code className="text-zinc-300 font-mono bg-zinc-950 px-1 py-0.5 rounded">$_SESSION[&apos;right_level&apos;]</code> 세션 값에 따라 상단 내비게이션바(<code className="text-zinc-300 font-mono bg-zinc-950 px-1 py-0.5 rounded">hmenu</code> 클래스)의 노출 메뉴를 제어합니다. 관리자 직군별 모든 메뉴 구성을 정리한 표입니다.
            </p>
          </div>
          
          <div className="overflow-x-auto border border-zinc-800 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-400 font-semibold">
                  <th className="p-3">직군 권한레벨 (right_level)</th>
                  <th className="p-3">시스템 기본 노출 메뉴 (Menu Navigation)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-300">
                <tr className="hover:bg-zinc-800/10 transition-colors">
                  <td className="p-3 font-semibold text-white">5 - Accountant (회계/경리)</td>
                  <td className="p-3">Home, Whiteboard, Jobs, Punch User (근태 사용자 관리), My Account, Logout</td>
                </tr>
                <tr className="hover:bg-zinc-800/10 transition-colors">
                  <td className="p-3 font-semibold text-white">6 - Admin (최고 관리자)</td>
                  <td className="p-3">Home, Whiteboard, Jobs, Activity (ActivitySHOPREADONLY), My Account, Logout</td>
                </tr>
                <tr className="hover:bg-zinc-800/10 transition-colors">
                  <td className="p-3 font-semibold text-white">68 - Admin/Truck (운송 겸임 관리자)</td>
                  <td className="p-3">Home, Whiteboard, Jobs, Activity (ActivitySHOPREADONLY), My Account, Logout</td>
                </tr>
                <tr className="hover:bg-zinc-800/10 transition-colors">
                  <td className="p-3 font-semibold text-white">9 - Managing Director (대표이사)</td>
                  <td className="p-3">Home, Whiteboard, Jobs, Activity (ActivitySHOPREADONLY), My Account, Logout</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-zinc-500 italic mt-2 leading-relaxed">
            ※ 참고: 현장 근로자 및 일반 직원 레벨(1, 2, 12, 8)은 Whiteboard 조회(읽기 전용), Punch Clock(근태 태그), To Do, Reminder(차량 법정검사 알림), Painter(도장일정) 등의 메뉴만 제한적으로 열람할 수 있습니다.
          </p>
        </div>
      ) : (
        /* ERD Diagram Viewer Panel */
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-hidden min-h-[750px] flex flex-col relative">
          <div className="mb-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase">Core Business ERD</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Entity-Relationship diagram mapping the SQLite database structures. (Scroll to Zoom, Drag to Move)</p>
            </div>
            <button
              onClick={resetZoomPan}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-750 text-white rounded text-[10px] font-semibold cursor-pointer transition-all border border-zinc-700"
            >
              Reset View
            </button>
          </div>
          <div 
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex-1 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-center overflow-hidden min-h-[640px] relative select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {mermaidLoaded ? (
              <div 
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
                className="mermaid text-zinc-200"
              >
                {`erDiagram
    tb_login ||--o{ tb_punchsheet : "Records punch"
    tb_login ||--o{ tb_tasks : "Assigned"
    tb_login ||--o{ tb_leaves : "Takes leaves"
    
    tb_jobs ||--o{ tb_jobs_details : "Contains details"
    tb_jobs ||--o{ tb_tasks : "Has tasks"
    tb_jobs ||--o{ tb_wip : "Tracks WIP"
    tb_jobs ||--o{ tb_photos : "Job photos"
    tb_jobs ||--o{ tb_production_plan : "Schedules"
    tb_jobs ||--o{ tb_jobs_dates : "Timeline dates"
    tb_jobs ||--o{ tb_jobs_date_install : "Install dates"
    
    tb_tasks ||--o{ tb_tasks_employees_affectation : "Has affectations"
    tb_login ||--o{ tb_tasks_employees_affectation : "Assigned via"`}
              </div>
            ) : (
              <div className="text-xs text-zinc-500 animate-pulse">Loading ERD rendering engine...</div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Confirm Maintenance Task Dialog */}
      {dialogContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/30 border border-red-900/50 flex items-center justify-center text-red-500 mt-0.5 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">{dialogContent.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {dialogContent.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
              <button
                onClick={closeDialog}
                className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteMaintenance}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-xs cursor-pointer transition-all"
              >
                {dialogContent.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Mermaid library for Graph rendering */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          try {
            if (window.mermaid) {
              window.mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                securityLevel: 'loose',
                suppressConsole: true
              });
              setMermaidLoaded(true);
            }
          } catch(e) {
            console.error("Mermaid initialization failed", e);
          }
        }}
      />

      <DevHints 
        title="Database & Diagnostics"
        fe={['fe/src/app/dashboard/admin-db/page.js', 'fe/src/hooks/useAdminDB.js']}
        be={['core/api_router.py (/api/admin/db_inspect/*)', 'core/api_router.py (/api/admin/db_integrity)', 'core/api_router.py (/api/admin/db_seed)', 'skills/200_admin_pipeline.py']}
        db={['Dynamic tables lookup', 'Interactive ERD schema visualization']}
        condition="Super admin workspace for data migration, diagnostics, mock seeding, and interactive ERD schema diagram exploration."
      />
    </div>
  );
}
