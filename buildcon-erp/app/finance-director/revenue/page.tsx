"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Award, Layers } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const revenueData = [
  { segment: "Residential", value: 12.5, color: "#10B981" },
  { segment: "Commercial", value: 8.2, color: "#3B82F6" },
  { segment: "Infrastructure", value: 3.8, color: "#F59E0B" },
];

const revenueVsTarget = [
  { m: "Q1 FY25", Actual: 68.2, Target: 65.0 },
  { m: "Q2 FY25", Actual: 72.4, Target: 70.0 },
  { m: "Q3 FY25", Actual: 78.5, Target: 80.0 },
  { m: "Q4 FY25", Actual: 85.0, Target: 85.0 },
];

export default function RevenueManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">REVENUE MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Track company invoicing, project billing cycles, and quarterly revenue targets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Revenue MTD</div>
            <div className="text-xl font-bold text-white">₹24.5 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Target Achievement</div>
            <div className="text-xl font-bold text-white">103.4%</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Contracts Backlog</div>
            <div className="text-xl font-bold text-white">₹182 Cr</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Actual vs Target */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Actual Billings vs Target Goals (in Cr)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsTarget} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                <Bar name="Actual" dataKey="Actual" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar name="Target" dataKey="Target" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Breakdown */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Revenue by Segment</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueData} dataKey="value" nameKey="segment" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">₹24.5C</span>
                <span className="text-[8px] text-slate-400">Total Revenue</span>
              </div>
            </div>
            <div className="flex gap-4 mt-4 text-[10px]">
              {revenueData.map((item) => (
                <div key={item.segment} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.segment}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Analyze Q3 revenue lag", "Segment breakdown reports", "Check backlog billing dates"]} />
    </div>
  );
}
