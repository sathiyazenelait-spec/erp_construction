"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, Award, Star } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const marketShare = [
  { name: "BuildWell Constructions", value: 30, color: "#10B981" },
  { name: "Competitor A", value: 25, color: "#3B82F6" },
  { name: "Competitor B", value: 20, color: "#F59E0B" },
  { name: "Competitor C", value: 15, color: "#8B5CF6" },
  { name: "Competitor D", value: 10, color: "#64748B" },
];

const winRates = [
  { name: "BuildWell", rate: 58 },
  { name: "Competitor A", rate: 45 },
  { name: "Competitor B", rate: 42 },
  { name: "Competitor C", rate: 38 },
];

export default function CompetitorAnalysis() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">09. COMPETITOR ANALYSIS</h2>
        <p className="text-xs text-slate-400">Market share tracking, bidding win-rate benchmarks, and competitor SWOT index</p>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Market Share Donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Market Share (%)</h3>
          <div className="flex items-center justify-around h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={marketShare} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {marketShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">30%</span>
                <span className="text-[8px] text-slate-400">BuildWell</span>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px]">
              {marketShare.map((m, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-slate-300 font-medium">{m.name} ({m.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Win Rate Bar Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Bidding Win Rate Comparison (%)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winRates} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="rate" fill="#10B981" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SWOT Insights */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Competitor Strengths & Market Gaps</h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-[#0e1628] rounded-lg border border-slate-850">
            <strong className="text-emerald-400 font-bold block mb-1">BuildWell Edge</strong>
            On-time project milestones, ISO safety certifications, and unified AI cost forecasting dashboards.
          </div>
          <div className="p-3 bg-[#0e1628] rounded-lg border border-slate-850">
            <strong className="text-blue-400 font-bold block mb-1">Competitor A (Primary Threat)</strong>
            Aggressive pricing benchmarks on institutional bids, but faces delayed delivery histories.
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Winning bids SWOT", "Optimize public tenders specs", "Review market opportunities"]} />
    </div>
  );
}
