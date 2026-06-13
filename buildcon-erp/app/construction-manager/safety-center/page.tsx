"use client";
import React from "react";
import { ShieldCheck, Users, HelpCircle, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function SafetyCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">09. SAFETY CENTER</h2>
        <p className="text-xs text-slate-400">Manage site toolbox safety talks, PPE audits, fire safety drills compliance, and incident reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Safety Score</div>
          <div className="text-xl font-bold text-emerald-450 text-emerald-400 mt-1">96% (Excellent)</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">PPE Compliance Rate</div>
          <div className="text-xl font-bold text-white mt-1">97%</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Toolbox Talks Completed</div>
          <div className="text-xl font-bold text-white mt-1">100%</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Major Incidents</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">0 Incidents</div>
        </div>
      </div>

      {/* Safety checklists & Logs */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Site Safety Audits & Incident Register</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Audit Date</th>
                <th className="pb-2">Active Site</th>
                <th className="pb-2">Toolbox Topic</th>
                <th className="pb-2">PPE Compliance</th>
                <th className="pb-2">Near Misses Reported</th>
                <th className="pb-2">Safety Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["28 May 2025", "Skyline Residences", "Working at Heights safety guidance", "98%", "0", "Excellent"],
                ["28 May 2025", "Greenfield Apartments", "Electrical safety earthing checks", "97%", "1", "Excellent"],
                ["27 May 2025", "Phoenix Commercial", "Heavy crane rigging protocols", "92%", "3", "Warning Alert"],
                ["26 May 2025", "Lakeview Villas", "General site housekeeping hazards", "99%", "0", "Excellent"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-400">{row[0]}</td>
                  <td className="text-slate-200 font-medium">{row[1]}</td>
                  <td className="text-slate-350">{row[2]}</td>
                  <td className="text-white font-bold">{row[3]}</td>
                  <td className={parseInt(row[4]) > 0 ? "text-amber-400 font-bold" : "text-slate-400"}>{row[4]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[5] === "Warning Alert" 
                        ? "bg-rose-500/10 text-rose-450 text-rose-400 border-rose-500/20" 
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {row[5]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Schedule high altitude rigging audit", "Export safety meeting templates", "Log near miss details for Site C"]} />
    </div>
  );
}
