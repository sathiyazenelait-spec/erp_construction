"use client";
import React from "react";
import { ShieldCheck, Heart, AlertTriangle, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const safetyAudits = [
  { id: "sa-1", site: "Luxury Villa Project", inspector: "Vikas Kumar", score: 98, status: "Excellent" },
  { id: "sa-2", site: "Skyline Apartments", inspector: "Vikas Kumar", score: 92, status: "Good" },
  { id: "sa-3", site: "Commercial Complex", inspector: "Anand R", score: 86, status: "Needs Review" },
];

export default function SafetyCompliance() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">08. SAFETY CENTER</h2>
        <p className="text-xs text-slate-400">Incident reports, compliance checklists, site safety audits, and target parameters</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">Safety Index Score</div>
            <div className="text-2xl font-bold text-white mt-1">94%</div>
            <div className="text-[10px] text-emerald-400 mt-1">Class-A Standard</div>
          </div>
          <ShieldCheck className="h-8 w-8 text-blue-500/20" />
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Safe Man-Hours (YTD)</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">4.5 Lakhs</div>
          <div className="text-[10px] text-slate-500 mt-1">Zero fatalities logged</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Compliance Audit</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">100% Pass</div>
          <div className="text-[10px] text-emerald-400 mt-1">ISO 45001 Certified</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Incident Rate</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">0.12%</div>
          <div className="text-[10px] text-emerald-400 mt-1">↓ 0.04% MTD</div>
        </div>
      </div>

      {/* Audits Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Site Safety Audits</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/80 text-slate-405 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Audit Code</th>
                <th className="p-3 font-semibold">Construction Site</th>
                <th className="p-3 font-semibold">Chief Inspector</th>
                <th className="p-3 font-semibold text-center">Score</th>
                <th className="p-3 font-semibold rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {safetyAudits.map((audit, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-bold text-white">{audit.id}</td>
                  <td className="p-3 text-slate-205 font-medium">{audit.site}</td>
                  <td className="p-3 text-slate-300">{audit.inspector}</td>
                  <td className="p-3 text-center font-semibold text-white">{audit.score}%</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      audit.status === "Excellent" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      audit.status === "Good" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Compliance checklists", "Incident logs", "Safety score history", "Audit templates"]} />
    </div>
  );
}
