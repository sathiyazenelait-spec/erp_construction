"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Briefcase, Building, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { projects } from "@/lib/data";

export default function ProjectsCommandCenter() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">02. PROJECTS COMMAND CENTER</h2>
        <p className="text-xs text-slate-400">Monitor multi-site construction status, actual cost logs, and active progress</p>
      </div>

      {/* Main projects table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Construction Sites Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/80 text-slate-450 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Project Name</th>
                <th className="p-3 font-semibold">Budget (₹ Cr)</th>
                <th className="p-3 font-semibold">Actual Cost (₹ Cr)</th>
                <th className="p-3 font-semibold">Progress</th>
                <th className="p-3 font-semibold">Variance / Profit</th>
                <th className="p-3 font-semibold rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-medium text-white flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-slate-500" />
                    {p.name}
                  </td>
                  <td className="p-3 text-white">₹ {p.budget} Cr</td>
                  <td className="p-3">₹ {p.actual} Cr</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-slate-800 rounded-full w-20 overflow-hidden border border-slate-700/50">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${p.progress}%`,
                            backgroundColor: p.status === "Critical" ? "#ef4444" : p.status === "Delayed" ? "#f59e0b" : "#10b981",
                          }}
                        />
                      </div>
                      <span className="text-[10px] w-6 text-right font-mono">{p.progress}%</span>
                    </div>
                  </td>
                  <td className={`p-3 font-bold ${p.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {p.profit >= 0 ? `+${p.profit}%` : `${p.profit}%`}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      p.status === "Delayed" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Highlight high budget delays", "Show delayed sites", "Detailed profit analysis", "Material forecast"]} />
    </div>
  );
}
