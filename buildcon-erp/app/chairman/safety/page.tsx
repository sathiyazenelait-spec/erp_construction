"use client";
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { ShieldCheck, ShieldAlert, Award, FileSpreadsheet, PlusCircle, CheckCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const safetyTrend = [
  { m: "Jan", rating: 91 },
  { m: "Feb", rating: 92 },
  { m: "Mar", rating: 93 },
  { m: "Apr", rating: 95 },
  { m: "May", rating: 96 },
  { m: "Jun", rating: 96 },
];

const incidentOverview = [
  { name: "Near Misses", value: 8, color: "#3B82F6" },
  { name: "Minor Incidents", value: 2, color: "#F59E0B" },
  { name: "Major Incidents", value: 0, color: "#EF4444" },
];

const siteAudits = [
  { site: "Luxury Villa Chennai", date: "15 May 2025", score: 98, status: "Passed" },
  { site: "Skyline Apartments", date: "18 May 2025", score: 94, status: "Passed" },
  { site: "Commercial Complex", date: "20 May 2025", score: 86, status: "Passed" },
  { site: "IT Park Phase - I", date: "24 May 2025", score: 92, status: "Passed" },
];

export default function SafetyCenter() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">07. SAFETY CENTER</h2>
        <p className="text-xs text-slate-400">Monitor safety performance and incident compliance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Circle progress for safety score */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-16 w-16 relative flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" className="text-slate-800" strokeWidth="4" stroke="currentColor" fill="transparent" />
              <circle cx="32" cy="32" r="28" className="text-emerald-500" strokeWidth="4" strokeDasharray={175} strokeDashoffset={175 - (175 * 96) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" />
            </svg>
            <span className="absolute text-sm font-bold text-white">96%</span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Safety Score</div>
            <div className="text-sm font-bold text-emerald-400">Excellent</div>
            <div className="text-[10px] text-slate-500">↑ 91% in Jan</div>
          </div>
        </div>

        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Sites</div>
          <div className="text-2xl font-bold text-white mt-1">18</div>
          <div className="text-[10px] text-slate-500 mt-1">Audits complete</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Days Without Incident</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">112 Days</div>
          <div className="text-[10px] text-emerald-400 mt-1">Record: 180 Days</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Minor Incidents</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">2</div>
          <div className="text-[10px] text-slate-500 mt-1">No lost time</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Major Incidents</div>
          <div className="text-2xl font-bold text-white mt-1">0</div>
          <div className="text-[10px] text-emerald-400 mt-1">Zero-accident target met</div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Safety score trend */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Safety Score Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safetyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[80, 100]} stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Line type="monotone" dataKey="rating" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents overview donut */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Incidents Overview</h3>
          <div className="flex items-center justify-around h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={incidentOverview} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {incidentOverview.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">10</span>
                <span className="text-[8px] text-slate-400">Total Cases</span>
              </div>
            </div>
            <div className="space-y-2">
              {incidentOverview.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-350">{item.name}:</span>
                  <span className="text-[10px] font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Site audits & alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Site Audits */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Site Safety Audits</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-350">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2">Project Site</th>
                  <th className="py-2">Audit Date</th>
                  <th className="py-2 text-right">Score</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {siteAudits.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="py-2.5 font-medium text-white">{item.site}</td>
                    <td className="py-2.5 text-slate-400">{item.date}</td>
                    <td className={`py-2.5 text-right font-bold ${item.score >= 90 ? "text-emerald-400" : "text-yellow-400"}`}>{item.score}%</td>
                    <td className="py-2.5 text-right">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">Passed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Safety Alerts */}
        <div className="bg-red-950/10 border border-red-900/20 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <ShieldAlert className="h-5 w-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Safety Alert</h4>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold text-white">High-Risk Operations</div>
            <p className="text-xs text-slate-400">Excavation & deep foundation work at Commercial Complex site requires safety auditor oversight.</p>
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <div>
              <div className="text-slate-400">Risk Level</div>
              <div className="text-red-400 font-bold">High</div>
            </div>
            <div>
              <div className="text-slate-400">PPE Compliance</div>
              <div className="text-emerald-450 font-bold text-emerald-400">98%</div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Safety guidelines checklist", "Incident reporting history", "Training completion ratios", "Safety compliance logs"]} />
    </div>
  );
}
