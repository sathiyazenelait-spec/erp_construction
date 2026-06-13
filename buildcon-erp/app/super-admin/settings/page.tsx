"use client";
import React, { useState } from "react";
import { Settings, Save, Check, ShieldCheck, Database, Calendar, Volume2 } from "lucide-react";

export default function GlobalSettings() {
  const [maintenance, setMaintenance] = useState(false);
  const [backupInterval, setBackupInterval] = useState("daily");
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">GLOBAL SETTINGS</h2>
        <p className="text-xs text-slate-400">Configure global parameters, security schemas, compliance defaults and system maintenance windows</p>
      </div>

      <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 max-w-3xl">
        <h3 className="text-sm font-semibold text-slate-200 mb-6 pb-2 border-b border-slate-850 flex items-center gap-2">
          <Settings className="h-4 w-4 text-emerald-400" />
          Global Platform Preferences
        </h3>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Maintenance Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#080d18] border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">System Maintenance Mode</div>
              <p className="text-[10px] text-slate-400 mt-1 max-w-md">Redirect all tenant portals to the maintenance standby landing page. Prevents active transactions during server migrations.</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenance(!maintenance)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                maintenance
                  ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-850"
              }`}
            >
              {maintenance ? "ON (Redirecting)" : "OFF (Normal)"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Database backups */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-slate-500" />
                Database Backup Schedule
              </label>
              <select
                value={backupInterval}
                onChange={(e) => setBackupInterval(e.target.value)}
                className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="hourly">Hourly incremental (Hot Standby)</option>
                <option value="daily">Daily full capture (12:00 AM UTC)</option>
                <option value="weekly">Weekly archived mirror (AWS Glacier)</option>
              </select>
            </div>

            {/* Session Timeouts */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                Inactivity Session Timeout (Mins)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2 text-xs font-bold shadow-md shadow-emerald-500/10 flex items-center gap-1.5 transition-all"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Global Preferences Updated!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
