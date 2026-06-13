"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, ShieldAlert, Sparkles, Activity } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const employeeDistribution = [
  { name: "Management", value: 15, color: "#8B5CF6" },
  { name: "Engineers", value: 40, color: "#3B82F6" },
  { name: "Site Supervisors", value: 30, color: "#EC4899" },
  { name: "Skilled Workers", value: 100, color: "#10B981" },
  { name: "Others", value: 30, color: "#64748B" },
];

export default function ResourceManagement() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">06. RESOURCE MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Manage payroll registry, workforce distributions, and site capacities</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Employees</div>
          <div className="text-2xl font-bold text-white mt-1">215</div>
          <div className="text-[10px] text-slate-500 mt-1">Full-time staff</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Labour Strength</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">420 / 460</div>
          <div className="text-[10px] text-slate-500 mt-1">91.3% capacity utilized</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Attrition Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">3.2%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Acceptable limit (4.0%)</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Productivity Index</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">89%</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 1.5% vs target</div>
        </div>
      </div>

      {/* Content Chart & Distribution */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Labour Roster & Deployment</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-slate-300">Luxury Villa Project site</span>
              <span className="text-emerald-400 font-bold">120 Workers (Full Strength)</span>
            </div>
            <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-slate-300">Skyline Apartments site</span>
              <span className="text-emerald-400 font-bold">95 Workers (Full Strength)</span>
            </div>
            <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-slate-300">Commercial Complex site</span>
              <span className="text-red-400 font-bold">140 Workers (40 under requirement)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Employee Distribution</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={employeeDistribution} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {employeeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">215</span>
                <span className="text-[8px] text-slate-400">Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Labour roster details", "Attrition history", "Roster scheduling reports", "Payroll audits"]} />
    </div>
  );
}
