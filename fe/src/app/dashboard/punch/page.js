"use client";

import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';
import { useAuth } from '../../../hooks/useAuth';
import { Clock, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import DevHints from '../../../components/common/DevHints';

export default function PunchClockPage() {
  const { user, loading: authLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" or "error"

  // Live NZ clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time matching en-NZ locale 24h
      const timeStr = now.toLocaleTimeString('en-NZ', { hour12: false });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePunch = async (actionType) => {
    if (!user || !user.id) {
      alert("User session not found!");
      return;
    }

    const empName = `${user.firstname} ${user.surname}`;

    setLoading(true);
    setError("");
    setMessage({ text: "", type: "" });

    try {
      const res = await apiClient.post('/api/punch', {
        employee_id: parseInt(user.id),
        action: actionType
      });

      if (res.data && res.data.status === "success") {
        setMessage({
          text: `Successfully punched ${actionType.toUpperCase()} for ${empName} at ${currentTime}`,
          type: "success"
        });
      } else {
        setMessage({
          text: `Error: ${res.data.detail || "Request failed"}`,
          type: "error"
        });
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || "Failed to communicate with server.";
      setMessage({
        text: errMsg,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center text-zinc-500 text-sm">
        Loading user session...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Workshop Punch Clock</h1>
          <p className="text-zinc-400 text-sm mt-1">Track workshop employee shifts</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl text-center space-y-8">
        
        {/* NZ Clock Display */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-zinc-500 tracking-widest uppercase">New Zealand Local Time</div>
          <div className="text-5xl md:text-6xl font-bold text-white font-mono tracking-wider">
            {currentTime || "00:00:00"}
          </div>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex items-center gap-3 text-red-200 text-left">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Logged in Employee Info */}
        <div className="max-w-xs mx-auto text-center bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Active Operator</div>
          <div className="text-lg font-bold text-white">
            {user ? `${user.firstname} ${user.surname}` : "Guest User"}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">ID: {user?.id || "N/A"}</div>
        </div>

        {/* Punch Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <button
            onClick={() => handlePunch('in')}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-full font-bold text-lg tracking-wider transition-all shadow-lg shadow-emerald-900/20 cursor-pointer"
          >
            PUNCH IN
          </button>
          <button
            onClick={() => handlePunch('out')}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-full font-bold text-lg tracking-wider transition-all shadow-lg shadow-rose-900/20 cursor-pointer"
          >
            PUNCH OUT
          </button>
        </div>

        {/* Status Messages */}
        {message.text && (
          <div 
            className={`p-4 rounded-lg border text-sm text-left flex items-start gap-3 transition-all ${
              message.type === "success" 
                ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-300" 
                : "bg-red-950/20 border-red-900/60 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
            )}
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        <div className="text-[11px] text-zinc-500 pt-4 border-t border-zinc-800/60">
          Note: Punch records are stored directly in the tb_punchsheet table.
        </div>
      </div>

      <DevHints 
        title="Punch Clock"
        fe={['fe/src/app/dashboard/punch/page.js']}
        be={['core/api_router.py (/api/punch)', 'skills/030_punch_pipeline.py']}
        db={['tb_punchsheet', 'tb_jobs_details', 'tb_jobs_date_install']}
        condition="Attestation terminal for workers to clock in/out or begin specific lot member tasks. Completion of tasks auto-sets pieces to made/finished."
      />
    </div>
  );
}
