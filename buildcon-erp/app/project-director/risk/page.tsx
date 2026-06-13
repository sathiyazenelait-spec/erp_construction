"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const riskStatus = [
  { name: "Cost Overruns", value: 30, color: "#EF4444" },
  { name: "Delay Risk", value: 30, color: "#F59E0B" },
  { name: "Resource Gap", value: 20, color: "#3B82F6" },
  { name: "Quality Defect", value: 10, color: "#EC4899" },
  { name: "Safety Gap", value: 10, color: "#10B981" },
];

const topRisksList = [
  { name: "Steel Price Increase", impact: "High" },
  { name: "Monsoon Delays", impact: "Medium" },
  { name: "Labour Shortage", impact: "Medium" },
  { name: "Equipment Breakdown", impact: "Low" },
  { name: "Permit Delays", impact: "Low" },
];

export default function RiskCenter() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">09. RISK CENTER</h2>
        <p className="text-xs text-slate-400">Track and mitigate construction, budget, and supply chain project risks</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">High Risks</div>
            <div className="text-2xl font-bold text-red-400 mt-1">6 Active</div>
          </div>
          <AlertCircle className="h-8 w-8 text-red-500/20" />
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Medium Risks</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">12 Active</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Low Risks</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">8 Active</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Closed Risks</div>
          <div className="text-2xl font-bold text-emerald-450 text-emerald-400 mt-1">15 Resolved</div>
        </div>
      </div>

      {/* Charts & Lists Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk by category donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Risk by Category</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskStatus} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {riskStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Risks table */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Risks</h3>
          <div className="space-y-3">
            {topRisksList.map((r, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#0e1628] border border-slate-850">
                <span className="text-slate-300 font-medium">{r.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  r.impact === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                  r.impact === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {r.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Review High risks detail", "Action plans", "Vendor compliance rating"]} />
    </div>
  );
}
