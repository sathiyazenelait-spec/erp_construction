"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { FileText, TrendingUp, DollarSign, Award, Target, Sparkles } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const commandTimeline = [
  { m: "Jan", index: 88 },
  { m: "Feb", index: 90 },
  { m: "Mar", index: 89 },
  { m: "Apr", index: 91 },
  { m: "May", index: 92 },
  { m: "Jun", index: 94 },
];

export default function ExecutiveCommand() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">01. EXECUTIVE COMMAND</h2>
        <p className="text-xs text-slate-400">Strategic decisions, health indexes, and corporate benchmarks</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Command Health Index</div>
            <div className="text-2xl font-bold text-white mt-1">94.2%</div>
            <div className="text-[10px] text-emerald-400 mt-1">↑ 1.2% MTD</div>
          </div>
          <Target className="h-8 w-8 text-blue-500/20" />
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Target Efficiency</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">98.4%</div>
            <div className="text-[10px] text-slate-500 mt-1">Target threshold: 95.0%</div>
          </div>
          <Award className="h-8 w-8 text-emerald-500/20" />
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Profit Forecast</div>
            <div className="text-2xl font-bold text-white mt-1">₹ 32.4 Cr</div>
            <div className="text-[10px] text-emerald-400 mt-1">Yearly target on track</div>
          </div>
          <DollarSign className="h-8 w-8 text-yellow-500/20" />
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Operation Speed Index</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">A+ Optimal</div>
            <div className="text-[10px] text-slate-500 mt-1">Avg cycle: 14 days</div>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-500/20" />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Operational Efficiency Index Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={commandTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis domain={[80, 100]} stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0F182A", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Area type="monotone" dataKey="index" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIndex)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AIAssistantBar suggestions={["Operational summaries", "Strategic options", "Forecast reports", "Audit telemetry"]} />
    </div>
  );
}
