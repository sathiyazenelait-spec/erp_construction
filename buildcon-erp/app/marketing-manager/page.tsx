"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Target, TrendingUp, Megaphone, Share2, HelpCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const leadsByChannel = [
  { name: "Google Ads", value: 750, color: "#10B981" },
  { name: "Meta Ads", value: 520, color: "#3B82F6" },
  { name: "SEO Organic", value: 410, color: "#F59E0B" },
  { name: "Referrals", value: 170, color: "#8B5CF6" },
];

const spendVsConv = [
  { m: "Jan", Spend: 1.8, Leads: 680 },
  { m: "Feb", Spend: 2.2, Leads: 850 },
  { m: "Mar", Spend: 2.5, Leads: 920 },
  { m: "Apr", Spend: 3.2, Leads: 1250 },
  { m: "May", Spend: 4.8, Leads: 1850 },
];

export default function MarketingExecutiveSummary() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">MARKETING EXECUTIVE SUMMARY</h2>
          <p className="text-xs text-slate-400">Welcome, Ananya Sharma — consolidated brand awareness, lead generation performance, and digital ad ROI.</p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Leads (MTD)</span>
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">1,850</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 14.2% vs Last Month</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Ad Spends MTD</span>
            <Megaphone className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹4.8 Lakhs</div>
            <div className="text-[10px] text-slate-400 mt-1">Within budget allocations</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Avg Lead Conv. Rate</span>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">4.82%</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 0.8% increase</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Overall Marketing ROI</span>
            <Share2 className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-amber-450 text-amber-400">3.8x</div>
            <div className="text-[10px] text-slate-400 mt-1">Optimal efficiency ratio</div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ad Spend vs Leads Generated Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Ad Spend (Lakhs) vs Leads Generated</h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Monthly Trends</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendVsConv} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                <Area name="Ad Spend (₹ L)" type="monotone" dataKey="Spend" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#spendGrad)" />
                <Area name="Leads Generated" type="monotone" dataKey="Leads" stroke="#10B981" strokeWidth={1.5} fillOpacity={1} fill="url(#leadsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Channels Donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Leads by Channel</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadsByChannel} dataKey="value" nameKey="name" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {leadsByChannel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white font-mono">1,850</span>
                <span className="text-[8px] text-slate-400">Total Leads</span>
              </div>
            </div>
            <div className="flex gap-3 mt-4 text-[9px]">
              {leadsByChannel.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-350">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Active Marketing Campaigns Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Campaign Name</th>
                <th className="pb-2">Platform</th>
                <th className="pb-2">Spend MTD</th>
                <th className="pb-2">Leads Generated</th>
                <th className="pb-2">Cost Per Lead (CPL)</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["Skyline Residences Launch", "Google Ads", "₹2.2 L", "750 Leads", "₹293", "Active"],
                ["Greenfield Apartments Promo", "Meta Ads", "₹1.4 L", "520 Leads", "₹269", "Active"],
                ["Coimbatore Hub SEO push", "SEO Organic", "₹80k", "410 Leads", "₹195", "Active"],
                ["Villa Community Referrals", "Offline Hub", "₹40k", "170 Leads", "₹235", "Active"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-white font-bold">{row[2]}</td>
                  <td className="text-emerald-450 text-emerald-455 text-emerald-400 font-bold">{row[3]}</td>
                  <td className="text-slate-350 font-semibold">{row[4]}</td>
                  <td>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {row[5]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={[
        "Which platform has the lowest CPL?",
        "Show Google Ads search trends",
        "Forecast leads next month",
        "Analyze competitor traffic metrics"
      ]} />
    </div>
  );
}
