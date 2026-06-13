"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { TrendingUp, Clock, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const progressTrend = [
  { m: "Jan", Planned: 45, Actual: 42 },
  { m: "Feb", Planned: 50, Actual: 48 },
  { m: "Mar", Planned: 58, Actual: 54 },
  { m: "Apr", Planned: 65, Actual: 60 },
  { m: "May", Planned: 72, Actual: 72 },
];

export default function ProjectProgress() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">01. PROJECT PROGRESS</h2>
        <p className="text-xs text-slate-400">Detailed overview of target completions, milestone progress trends, and variances across active sites.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Average Portfolio Progress</div>
            <div className="text-xl font-bold text-white">54.2%</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Projects On Track</div>
            <div className="text-xl font-bold text-white">78% (14 Sites)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-450 text-rose-450 text-rose-400 grid place-items-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Critical Delays</div>
            <div className="text-xl font-bold text-rose-450 text-rose-450 text-rose-400">2 Projects</div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Milestone Progress Trend (Planned vs Actual %)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Area name="Planned Progress" type="monotone" dataKey="Planned" stroke="#3B82F6" strokeWidth={1.5} fillOpacity={1} fill="url(#plannedGrad)" />
              <Area name="Actual Progress" type="monotone" dataKey="Actual" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#actualGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project detailed table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Detailed Project Milestones Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Project Name</th>
                <th className="pb-2">Planned Progress</th>
                <th className="pb-2">Actual Progress</th>
                <th className="pb-2">Variance</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["Skyline Residences", "75%", "72%", "-3%", "Behind"],
                ["Greenfield Apartments", "52%", "55%", "+3%", "On Track"],
                ["Phoenix Commercial", "42%", "30%", "-12%", "Critical"],
                ["Lakeview Villas", "60%", "65%", "+5%", "On Track"],
                ["IT Park Phase - 1", "45%", "40%", "-5%", "Behind"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-white font-bold">{row[2]}</td>
                  <td className={row[3].includes("-") ? "text-rose-400 font-semibold" : "text-emerald-450 text-emerald-400 font-semibold"}>
                    {row[3]}
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[4] === "Critical" 
                        ? "bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 border-rose-500/20" 
                        : row[4] === "Behind"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-450 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {row[4]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Export progress audit log", "Compare Chennai vs Madurai site progress", "Check delayed tasks detail"]} />
    </div>
  );
}
