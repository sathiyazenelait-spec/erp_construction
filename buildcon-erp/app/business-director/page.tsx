"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Target, FileText, TrendingUp, Trophy, Building2, Star, MessageSquare } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { funnel, revenueTrend } from "@/lib/data";

const leadsBySource = [
  { name: "Google Ads", value: 40, color: "#10B981" },
  { name: "Website", value: 30, color: "#3B82F6" },
  { name: "Referrals", value: 20, color: "#F59E0B" },
  { name: "Social Media", value: 10, color: "#8B5CF6" },
];

export default function BusinessDirectorDashboard() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">BUSINESS DEVELOPMENT OVERVIEW</h2>
          <p className="text-xs text-slate-400">Welcome, Rajesh Verma — real-time sales pipeline, tenders, and conversion analytics</p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Leads */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Leads</span>
            <Target className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">1,250</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 10% vs Apr 2025</div>
          </div>
        </div>

        {/* Qualified Leads */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Qualified Leads</span>
            <Trophy className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-emerald-400">520</div>
            <div className="text-[10px] text-slate-500 mt-1">41.6% Qualification rate</div>
          </div>
        </div>

        {/* Proposals Sent */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Proposals Sent</span>
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">180</div>
            <div className="text-[10px] text-slate-500 mt-1">34.6% Proposal conversion</div>
          </div>
        </div>

        {/* Projects Won */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Projects Won</span>
            <Star className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">42</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">23.3% Win Ratio</div>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Pipeline Value</span>
            <TrendingUp className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹ 124.8 Cr</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 22.6% YOY</div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lead Funnel Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Lead Funnel</h3>
          <div className="space-y-2.5">
            {funnel.map((f, i) => (
              <div key={f.stage} className="rounded text-white text-xs font-semibold py-2.5 px-3 flex justify-between items-center transition hover:brightness-110" style={{ background: f.color, width: `${100 - i * 10}%` }}>
                <span>{f.stage}</span>
                <span className="font-mono font-bold">{f.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend Area Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Revenue Trend (12 Months)</h3>
            <span className="text-[10px] text-emerald-450 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active Billings</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Sources & High-value Opportunities */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leads by Source donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Leads by Source</h3>
          <div className="flex items-center justify-around h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadsBySource} dataKey="value" nameKey="name" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {leadsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">100%</span>
                <span className="text-[8px] text-slate-400">Total Leads</span>
              </div>
            </div>
            <div className="space-y-1">
              {leadsBySource.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }}></span>
                  <span className="text-[10px] text-slate-350">{status.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top opportunities list */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Opportunities</h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-slate-300 font-medium">IT Park Project - Chennai</span>
              <span className="text-emerald-400 font-bold">₹ 20.0 Cr (70% Win Prob)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-slate-300 font-medium">Villa Community - Coimbatore</span>
              <span className="text-emerald-400 font-bold">₹ 8.0 Cr (60% Win Prob)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-slate-300 font-medium">Government School - Madurai</span>
              <span className="text-emerald-400 font-bold">₹ 15.0 Cr (65% Win Prob)</span>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Best converting channel?", "Leads likely to close", "Forecast next month sales"]} />
    </div>
  );
}
