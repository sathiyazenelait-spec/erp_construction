"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ArrowDownLeft, ArrowUpRight, ShieldCheck, Wallet } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const cashFlowData = [
  { m: "Jan", inflow: 1.2, outflow: 0.9, net: 0.3 },
  { m: "Feb", inflow: 1.5, outflow: 1.1, net: 0.4 },
  { m: "Mar", inflow: 1.8, outflow: 1.2, net: 0.6 },
  { m: "Apr", inflow: 1.4, outflow: 1.3, net: 0.1 },
  { m: "May", inflow: 2.1, outflow: 1.4, net: 0.7 },
  { m: "Jun", inflow: 2.5, outflow: 1.6, net: 0.9 },
];

export default function CashFlowCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">CASH FLOW CENTER</h2>
        <p className="text-xs text-slate-400">Monitor corporate liquidity, operating cash inflows, capital outflows, and net reserve status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Inflow (MTD)</div>
            <div className="text-xl font-bold text-white">₹14.8 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 grid place-items-center">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Outflow (MTD)</div>
            <div className="text-xl font-bold text-white">₹9.2 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Net Cash Position</div>
            <div className="text-xl font-bold text-emerald-400">₹12.1 Cr</div>
          </div>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Cash Inflow vs Outflow Trend (in Cr)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Area name="Inflow" type="monotone" dataKey="inflow" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#inflowGrad)" />
              <Area name="Outflow" type="monotone" dataKey="outflow" stroke="#EF4444" strokeWidth={1.5} fillOpacity={1} fill="url(#outflowGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Ledger table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Liquidity Projection & Treasury Reserves</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Month</th>
                <th className="pb-2">Forecast Inflow</th>
                <th className="pb-2">Forecast Outflow</th>
                <th className="pb-2">Estimated Balance</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["June 2025", "₹15.2 Cr", "₹9.8 Cr", "₹17.5 Cr", "Optimal"],
                ["July 2025", "₹16.5 Cr", "₹10.5 Cr", "₹23.5 Cr", "Optimal"],
                ["August 2025", "₹14.0 Cr", "₹11.2 Cr", "₹26.3 Cr", "Satisfactory"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-slate-200">{row[0]}</td>
                  <td className="text-emerald-400 font-bold">{row[1]}</td>
                  <td className="text-rose-400 font-bold">{row[2]}</td>
                  <td className="text-blue-400 font-bold">{row[3]}</td>
                  <td>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {row[4]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Check cash reserves projection", "Calculate operating cash flow", "Any upcoming heavy payment?"]} />
    </div>
  );
}
