"use client";
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Megaphone, Activity, HelpCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const campaignPerformanceTrend = [
  { m: "1 May", CTR: 2.1, CPC: 28 },
  { m: "7 May", CTR: 2.4, CPC: 26 },
  { m: "14 May", CTR: 2.2, CPC: 27 },
  { m: "21 May", CTR: 2.8, CPC: 24 },
  { m: "28 May", CTR: 3.1, CPC: 22 },
];

export default function CampaignPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">CAMPAIGN PERFORMANCE</h2>
        <p className="text-xs text-slate-400">Monitor click-through rates (CTR), cost-per-click (CPC), impressions, and conversion trends across active campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Active Campaigns</div>
            <div className="text-xl font-bold text-white mt-1">4 Campaigns</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Avg CTR %</div>
            <div className="text-xl font-bold text-white mt-1">2.56% (MTD)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Avg Cost Per Click (CPC)</div>
            <div className="text-xl font-bold text-purple-400 mt-1">₹25.40</div>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">CTR (%) vs CPC (INR) Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={campaignPerformanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Line name="CTR (%)" type="monotone" dataKey="CTR" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line name="CPC (INR)" type="monotone" dataKey="CPC" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaigns log table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Campaign Detailed Diagnostics</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Campaign ID</th>
                <th className="pb-2">Campaign Name</th>
                <th className="pb-2">Impressions</th>
                <th className="pb-2">Clicks</th>
                <th className="pb-2">CTR %</th>
                <th className="pb-2">CPC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["CMP-2025-001", "Skyline Residences Launch", "380,000", "11,780", "3.1%", "₹28.00"],
                ["CMP-2025-002", "Greenfield Apartments Promo", "260,050", "6,240", "2.4%", "₹26.50"],
                ["CMP-2025-003", "Coimbatore Hub SEO push", "180,000", "3,960", "2.2%", "₹19.50"],
                ["CMP-2025-004", "Villa Community Referrals", "45,000", "3,150", "7.0%", "₹12.00"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-400">{row[0]}</td>
                  <td className="text-slate-200 font-medium">{row[1]}</td>
                  <td className="text-slate-350">{row[2]}</td>
                  <td className="text-slate-350 font-bold">{row[3]}</td>
                  <td className="text-emerald-450 text-emerald-450 text-emerald-400 font-bold">{row[4]}</td>
                  <td className="text-white font-semibold">{row[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Suggest bid adjustments for CMP-001", "Compare Google vs Meta CTR logs", "Generate campaign performance report"]} />
    </div>
  );
}
