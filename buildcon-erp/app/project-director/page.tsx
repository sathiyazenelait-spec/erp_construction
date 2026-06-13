"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Building, Globe, ShieldAlert, Sparkles, TrendingUp, DollarSign, Clock, Users, ArrowUpRight } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { projects } from "@/lib/data";

const progressDistributionData = [
  { name: "Residential", value: 7, color: "#10B981" },
  { name: "Commercial", value: 6, color: "#3B82F6" },
  { name: "Institutional", value: 4, color: "#F59E0B" },
  { name: "Industrial", value: 1, color: "#8B5CF6" },
];

const projectsByType = [
  { name: "On Track", value: 12, color: "#10B981" },
  { name: "Delayed", value: 4, color: "#F59E0B" },
  { name: "Critical", value: 2, color: "#EF4444" },
];

const locationsData = [
  { name: "Chennai", count: 8 },
  { name: "Coimbatore", count: 4 },
  { name: "Madurai", count: 3 },
  { name: "Trichy", count: 2 },
  { name: "Pondicherry", count: 1 },
];

export default function ProjectDirectorDashboard() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">PORTFOLIO OVERVIEW</h2>
          <p className="text-xs text-slate-400">Welcome, Arvind Menon — real-time portfolio metrics across all construction projects</p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Projects */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Projects</span>
            <Building className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">18</div>
            <div className="text-[10px] text-slate-500 mt-1">12 On Track • 4 Delayed • 2 Critical</div>
          </div>
        </div>

        {/* Total Project Value */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Project Value</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-emerald-400">₹ 138.6 Cr</div>
            <div className="text-[10px] text-slate-500 mt-1">Active Projects</div>
          </div>
        </div>

        {/* Total Cost Incurred */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Cost Incurred</span>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹ 105.4 Cr</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">76% of Budget</div>
          </div>
        </div>

        {/* Average Progress */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Average Progress</span>
            <Clock className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">56%</div>
            <div className="text-[10px] text-slate-500 mt-1">All Projects</div>
          </div>
        </div>

        {/* Overall Profit Margin */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Overall Profit Margin</span>
            <span className="text-xs text-emerald-400 font-bold">12.8%</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">12.8%</div>
            <div className="text-[10px] text-emerald-400 mt-1">On Active Projects</div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Portfolio Overview Donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Project Portfolio Overview</h3>
          <div className="flex items-center justify-around h-56">
            <div className="h-36 w-36 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={projectsByType} dataKey="value" nameKey="name" innerRadius={42} outerRadius={56} paddingAngle={4}>
                    {projectsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">18</span>
                <span className="text-[9px] text-slate-400">Total Projects</span>
              </div>
            </div>
            <div className="space-y-3">
              {projectsByType.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }}></span>
                  <span className="text-[10px] text-slate-350">{status.name}</span>
                  <span className="text-xs font-bold text-white">{status.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Summary list */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Projects Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-350">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2">Project Name</th>
                  <th className="py-2">Location</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Progress</th>
                  <th className="py-2">Budget</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projects.slice(0, 5).map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="py-2.5 text-white font-medium">{p.name}</td>
                    <td className="py-2.5 text-slate-450">{p.location || "Chennai"}</td>
                    <td className="py-2.5 text-slate-300">{"Residential"}</td>
                    <td className="py-2.5 font-bold text-white">{p.progress}%</td>
                    <td className="py-2.5 text-slate-300">₹ {p.budget} Cr</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
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
      </div>

      {/* Row 3: Progress Distribution & Location */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Distribution */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Progress Distribution</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressDistributionData} margin={{ left: -20, right: 0, top: 5, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={25}>
                  {progressDistributionData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Stats */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Projects by Location</h3>
          <div className="space-y-2.5">
            {locationsData.map((loc, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-slate-350 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-400" />
                  {loc.name}
                </span>
                <span className="font-bold text-white">{loc.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Risks */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-slate-200 mb-2">Top Risk Projects</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Phoenix Commercial Complex</span>
              <span className="text-red-405 font-bold text-red-450 text-red-400">78% Risk (45 Days)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Greenfield Apartments</span>
              <span className="text-amber-400 font-bold">35% Risk (15 Days)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">IT Park Phase - 1</span>
              <span className="text-amber-400 font-bold">28% Risk (20 Days)</span>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Highlight commercial risks", "Cities breakdown", "Which projects are delayed?", "Profitability forecast"]} />
    </div>
  );
}
