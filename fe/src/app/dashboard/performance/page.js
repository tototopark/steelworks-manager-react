"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import apiClient from '../../../services/apiClient';
import DevHints from '../../../components/common/DevHints';

export default function PerformancePage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [week, setWeek] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devConfig, setDevConfig] = useState({ devHints: false });

  // 1주, 2주, 4주, 12주 단위로 필터링하기 위한 옵션
  // 현재 ISO 주차 구하기
  const getISOWeek = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
  };

  const currentWeek = getISOWeek(new Date());

  const weekOptions = [
    { label: 'Previous Week', value: currentWeek - 1 },
    { label: '2 Weeks Ago', value: currentWeek - 2 },
    { label: '4 Weeks Ago', value: currentWeek - 4 },
    { label: '12 Weeks Ago', value: currentWeek - 12 },
  ];

  useEffect(() => {
    // 기본값으로 직전 주차 설정
    setWeek(currentWeek - 1);
  }, []);

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

  // Auto Week (Dev) Action
  const handleAutoSelectWeek = async () => {
    try {
      const res = await apiClient.get('/api/punch/latest_week');
      if (res.data && res.data.status === 'success') {
        const { year: y, week: w } = res.data;
        if (y && w) {
          setYear(y);
          setWeek(w);
        }
      }
    } catch (err) {
      console.error("Failed to fetch latest week", err);
    }
  };

  const fetchPerformance = async () => {
    if (!week) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/performance/stats?week=${week}&year=${year}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.status === 'success') {
        setData(json.data || []);
      } else {
        setError(json.detail || 'Failed to fetch performance stats');
      }
    } catch (err) {
      setError(err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, [week, year]);

  // 효율성 판별 헬퍼 (기준 대비 신호등 색상 칩 반환)
  // 부재당 평균 제작 시간 기준으로 판정
  const getEfficiencyChip = (totalQty, totalHours) => {
    if (totalQty === 0) return { label: 'N/A', class: 'bg-zinc-800 text-zinc-500' };
    const avgTime = totalHours / totalQty;
    
    // 단순 평균 소요시간 기준으로 신호등 표시
    // 평균 2시간 이하: 초록 (우수), 4시간 이하: 주황 (주의), 4시간 초과: 빨강 (정체)
    if (avgTime <= 2.0) {
      return { label: `${avgTime.toFixed(1)}h/pc (Good)`, class: 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50' };
    } else if (avgTime <= 4.0) {
      return { label: `${avgTime.toFixed(1)}h/pc (Warning)`, class: 'bg-amber-950/40 text-amber-400 border border-amber-800/50' };
    } else {
      return { label: `${avgTime.toFixed(1)}h/pc (Slow)`, class: 'bg-red-950/40 text-red-400 border border-red-800/50' };
    }
  };

  return (
    <div className="font-sans max-w-7xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Performance Statistics</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Standard fabrication time standards: Portal: 5-6h, Beam: 2-3h, Column: 1-1.5h
          </p>
        </div>
        <div className="flex items-center gap-3">
          {devConfig.devHints && (
            <button
              onClick={handleAutoSelectWeek}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-md"
            >
              Auto Week (Dev)
            </button>
          )}
          <label className="text-xs text-zinc-400">Select Period:</label>
          <select 
            value={week} 
            onChange={(e) => setWeek(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-zinc-700"
          >
            {weekOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label} (W{o.value})</option>
            ))}
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-zinc-700"
          >
            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
          </select>
        </div>
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

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-zinc-500 text-xs p-12 text-center">Loading performance stats...</div>
      ) : (
        <>
          {/* Custom Proportional Stacked Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((row) => {
              const total = row.portals + row.beams + row.columns + row.others;
              const getPercent = (val) => total > 0 ? ((val / total) * 100).toFixed(0) : 0;
              
              return (
                <div key={row.employee_id} className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-semibold text-sm text-zinc-200">{row.name}</span>
                    <span className="text-xs text-zinc-500">{row.login}</span>
                  </div>
                  
                  {/* Custom CSS Bar Chart (Proportion Representation) */}
                  <div className="space-y-2">
                    <span className="text-xs text-zinc-400">Production Mix Proportion</span>
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-800">
                      {row.portals > 0 && <div className="bg-blue-500" style={{ width: `${getPercent(row.portals)}%` }} title="Portals" />}
                      {row.beams > 0 && <div className="bg-amber-500" style={{ width: `${getPercent(row.beams)}%` }} title="Beams" />}
                      {row.columns > 0 && <div className="bg-emerald-500" style={{ width: `${getPercent(row.columns)}%` }} title="Columns" />}
                      {row.others > 0 && <div className="bg-zinc-600" style={{ width: `${getPercent(row.others)}%` }} title="Others" />}
                    </div>
                  </div>

                  {/* Qty breakdown indicators */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      <span>Portals: <strong>{row.portals}</strong> ({getPercent(row.portals)}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      <span>Beams: <strong>{row.beams}</strong> ({getPercent(row.beams)}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>Columns: <strong>{row.columns}</strong> ({getPercent(row.columns)}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
                      <span>Others: <strong>{row.others}</strong> ({getPercent(row.others)}%)</span>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between text-xs text-zinc-500">
                    <span>Total Output: <strong className="text-zinc-300">{total} pcs</strong></span>
                    <span>Hours: <strong className="text-zinc-300">{row.total_hours}h</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Efficiency Comparison Table */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800">
              <h2 className="text-sm font-semibold text-white">Fabrication Efficiency Rankings</h2>
              <p className="text-xs text-zinc-500 mt-1">Based on actual production counts versus hours logged this week</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/60 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Total Qty (pcs)</th>
                    <th className="px-6 py-4">Total Time (Hours)</th>
                    <th className="px-6 py-4">Average Time per Piece</th>
                    <th className="px-6 py-4">Status & Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {data.map((row) => {
                    const totalQty = row.portals + row.beams + row.columns + row.others;
                    const chip = getEfficiencyChip(totalQty, row.total_hours);
                    const avgTimeText = totalQty > 0 ? `${(row.total_hours / totalQty).toFixed(2)} hours` : 'N/A';
                    
                    return (
                      <tr key={row.employee_id} className="hover:bg-zinc-800/20">
                        <td className="px-6 py-4 font-medium text-white">{row.name} ({row.login})</td>
                        <td className="px-6 py-4">{totalQty}</td>
                        <td className="px-6 py-4">{row.total_hours}h</td>
                        <td className="px-6 py-4">{avgTimeText}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${chip.class}`}>
                            {chip.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <DevHints 
        title="Performance Charts"
        fe={['fe/src/app/dashboard/performance/page.js']}
        be={['core/api_router.py (/api/performance/weekly)']}
        db={['tb_punchsheet', 'tb_login', 'tb_jobs_details']}
        condition="Calculates structural steel fabrication throughput quantities (beams, columns, portals) per employee mapped against cumulative clock hours."
      />
    </div>
  );
}
