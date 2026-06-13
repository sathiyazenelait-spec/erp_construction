"use client";
import React from "react";
import { Building, Filter, CheckCircle2, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const monitoringData = [
  { name: "Skyline Residences", progress: 72, time: "On Track", cost: "On Budget", quality: "Good", safety: "Good", overall: "On Track" },
  { name: "Greenfield Apartments", progress: 48, time: "Delayed", cost: "Over Budget", quality: "Good", safety: "Good", overall: "Delayed" },
  { name: "Phoenix Commercial Complex", progress: 30, time: "Delayed", cost: "Over Budget", quality: "At Risk", safety: "At Risk", overall: "Critical" },
  { name: "Lakeview Villas", progress: 65, time: "On Track", cost: "On Budget", quality: "Good", safety: "Good", overall: "On Track" },
  { name: "IT Park Phase - 1", progress: 35, time: "On Track", cost: "On Budget", quality: "Good", safety: "Good", overall: "On Track" },
  { name: "Hospital Building", progress: 85, time: "On Track", cost: "On Budget", quality: "Good", safety: "Good", overall: "On Track" },
];

export default function ProjectMonitoring() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">02. PROJECT MONITORING</h2>
          <p className="text-xs text-slate-400">Live operational matrix across time, cost, quality and safety parameters</p>
        </div>
        <button className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filter
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Monitored Sites</div>
          <div className="text-2xl font-bold text-white mt-1">18 Sites</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">On Track</div>
          <div className="text-2xl font-bold text-emerald-450 text-emerald-400 mt-1">12 Sites</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Delayed</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">4 Sites</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Critical Status</div>
          <div className="text-2xl font-bold text-red-400 mt-1">2 Sites</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Project Name</th>
                <th className="p-3 font-semibold">Progress</th>
                <th className="p-3 font-semibold">Time</th>
                <th className="p-3 font-semibold">Cost</th>
                <th className="p-3 font-semibold">Quality</th>
                <th className="p-3 font-semibold">Safety</th>
                <th className="p-3 font-semibold rounded-r-lg">Overall Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {monitoringData.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-medium text-white flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-slate-500" />
                    {p.name}
                  </td>
                  <td className="p-3 font-mono font-semibold">{p.progress}%</td>
                  <td className={`p-3 font-semibold ${p.time === "On Track" ? "text-emerald-400" : "text-amber-400"}`}>{p.time}</td>
                  <td className={`p-3 font-semibold ${p.cost === "On Budget" ? "text-emerald-400" : "text-red-400"}`}>{p.cost}</td>
                  <td className={`p-3 font-semibold ${p.quality === "Good" ? "text-emerald-400" : "text-red-400"}`}>{p.quality}</td>
                  <td className={`p-3 font-semibold ${p.safety === "Good" ? "text-emerald-400" : "text-red-400"}`}>{p.safety}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      p.overall === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      p.overall === "Delayed" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {p.overall}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Audit delay triggers", "QC inspection history", "Workforce logs"]} />
    </div>
  );
}
