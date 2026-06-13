"use client";
import React from "react";
import { Users, Award, ShieldAlert, Sparkles, Sliders } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { departments } from "@/lib/data";

export default function DepartmentPerformance() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">03. DEPARTMENT PERFORMANCE</h2>
        <p className="text-xs text-slate-400">Track and manage departmental execution efficiency and manager scorecards</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 grid place-items-center text-emerald-400 border border-emerald-500/20">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Best Performing Dept</div>
            <div className="text-sm font-bold text-white">Sales & Marketing (94%)</div>
            <div className="text-[10px] text-slate-500">PM close second (92%)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 grid place-items-center text-blue-400 border border-blue-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Department Count</div>
            <div className="text-sm font-bold text-white">6 Active Divisions</div>
            <div className="text-[10px] text-slate-500 font-semibold">12 Managers assigned</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-red-500/10 grid place-items-center text-red-400 border border-red-500/20">
            <ShieldAlert className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Needs Review</div>
            <div className="text-sm font-bold text-red-400">HR & Admin (85%)</div>
            <div className="text-[10px] text-slate-500">Recruitment delays</div>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-blue-400" />
          Corporate Divisions Overview
        </h3>

        <div className="space-y-4">
          {departments.map((d, idx) => (
            <div key={idx} className="bg-[#0e1628] border border-slate-800/80 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="text-xs font-bold text-white">{d.name}</h4>
                  <span className="text-xs font-bold text-blue-400">{d.score}% Score</span>
                </div>
                <div className="h-2 bg-[#0A1120] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.score}%`,
                      backgroundColor: d.score >= 90 ? "#10B981" : d.score >= 87 ? "#3B82F6" : "#EF4444",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-slate-400">Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  d.score >= 90 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {d.score >= 90 ? "Excellent" : "Satisfactory"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIAssistantBar suggestions={["Department audits", "Manager contact lists", "Efficiency reports", "Logistics status"]} />
    </div>
  );
}
