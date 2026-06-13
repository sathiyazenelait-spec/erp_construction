"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Wallet, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { projects } from "@/lib/data";

const budgetHistory = [
  { m: "Jan", budget: 110, actual: 105 },
  { m: "Feb", budget: 120, actual: 118 },
  { m: "Mar", budget: 130, actual: 132 },
  { m: "Apr", budget: 135, actual: 129 },
  { m: "May", budget: 138.6, actual: 105.4 },
];

export default function BudgetMonitoring() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">04. BUDGET MONITORING</h2>
        <p className="text-xs text-slate-400">Track corporate project value limits, cost incurred, and budget variances</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Budget (Active)</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 138.6 Cr</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Cost Incurred</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">₹ 105.4 Cr</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Budget Utilization</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">76%</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Financial Variance</div>
          <div className="text-2xl font-bold text-red-400 mt-1">₹ 33.2 Cr Rem</div>
        </div>
      </div>

      {/* Main Budget table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Budget Utilization by Project</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Project Name</th>
                <th className="p-3 font-semibold text-right">Budget (₹)</th>
                <th className="p-3 font-semibold text-right">Actual Cost (₹)</th>
                <th className="p-3 font-semibold text-center">Utilization</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((p, idx) => {
                const util = Math.round((p.actual / p.budget) * 100);
                return (
                  <tr key={idx} className="hover:bg-slate-850/40">
                    <td className="p-3 font-medium text-white">{p.name}</td>
                    <td className="p-3 text-right font-mono">₹ {p.budget} Cr</td>
                    <td className="p-3 text-right font-mono text-white">₹ {p.actual} Cr</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-1.5 bg-slate-800 rounded-full w-20 overflow-hidden border border-slate-700/50">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(util, 100)}%`,
                              backgroundColor: util > 100 ? "#ef4444" : util > 90 ? "#f59e0b" : "#10b981",
                            }}
                          />
                        </div>
                        <span className="text-[10px] w-6 text-right font-mono font-bold">{util}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        util > 100 ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {util > 100 ? "Over Budget" : "Within Budget"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Detailed cost overrun audit", "Optimize steel procurement budgets", "Verify monthly invoice records"]} />
    </div>
  );
}
