"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, Award, Coins } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const ltvCacData = [
  { segment: "Residential", CAC: 8500, LTV: 45000 },
  { segment: "Commercial", LTV: 150000, CAC: 25000 },
  { segment: "Infrastructure", LTV: 350000, CAC: 45000 },
];

export default function MarketingROI() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">MARKETING ROI ANALYSIS</h2>
        <p className="text-xs text-slate-400">Track Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), overall marketing efficiency ratios, and conversion margins.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Average CAC</div>
            <div className="text-xl font-bold text-white mt-1">₹8,500 (Residential)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Average LTV</div>
            <div className="text-xl font-bold text-white mt-1">₹45,000 (Residential)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">LTV:CAC Ratio</div>
            <div className="text-xl font-bold text-purple-400 mt-1">5.3x (Highly Optimal)</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LTV vs CAC chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">LTV vs CAC comparison (INR) by Business Segment</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ltvCacData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="segment" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar name="LTV" dataKey="LTV" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar name="CAC" dataKey="CAC" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed ROI stats */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Performance Metrics</h3>
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400 font-semibold">Overall ROI MTD</div>
                <div className="text-xl font-bold text-emerald-400">3.8x</div>
              </div>
              <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400 font-semibold">Total Revenue Generated</div>
                <div className="text-xl font-bold text-white">₹18.2 Lakhs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Suggest CAC reduction strategies", "Compare LTV curves", "Export ROI report data"]} />
    </div>
  );
}
