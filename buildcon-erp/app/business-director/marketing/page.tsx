"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Megaphone, DollarSign, Target, Percent } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const spendBySource = [
  { name: "Google Ads", value: 45, color: "#10B981" },
  { name: "Website SEO", value: 25, color: "#3B82F6" },
  { name: "Social Media", value: 20, color: "#F59E0B" },
  { name: "Referrals", value: 10, color: "#8B5CF6" },
];

const campaignsData = [
  { name: "Search Ads", channel: "Google Ads", spend: "₹9,00,000", leads: 420, cpl: "₹185", conv: "9.2%", roi: "310%" },
  { name: "Display Ads", channel: "Google Ads", spend: "₹3,50,000", leads: 120, cpl: "₹210", conv: "7.0%", roi: "210%" },
  { name: "Facebook Ads", channel: "Social Media", spend: "₹4,20,000", leads: 180, cpl: "₹220", conv: "6.5%", roi: "250%" },
  { name: "Instagram Ads", channel: "Social Media", spend: "₹3,80,000", leads: 150, cpl: "₹230", conv: "6.1%", roi: "240%" },
  { name: "Email Campaigns", channel: "Email", spend: "₹1,50,000", leads: 95, cpl: "₹150", conv: "10.2%", roi: "380%" },
];

export default function MarketingAnalytics() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">06. MARKETING ANALYTICS</h2>
        <p className="text-xs text-slate-400">Campaign performance metrics, cost per lead, and channel conversion ROI</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Spend (YTD)</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 24.5 L</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Leads</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">1,250</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Cost Per Lead (Avg)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹ 196</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Conversion Rate</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">8.1%</div>
        </div>
      </div>

      {/* Campaign performance table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Campaign Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Campaign</th>
                <th className="p-3 font-semibold">Channel</th>
                <th className="p-3 font-semibold">Spend (₹)</th>
                <th className="p-3 font-semibold text-center">Leads</th>
                <th className="p-3 font-semibold">Cost Per Lead</th>
                <th className="p-3 font-semibold text-center">Conversion %</th>
                <th className="p-3 rounded-r-lg text-right">ROI %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {campaignsData.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-medium text-white">{c.name}</td>
                  <td className="p-3 text-slate-305">{c.channel}</td>
                  <td className="p-3 font-semibold text-slate-300">{c.spend}</td>
                  <td className="p-3 text-center text-white font-bold">{c.leads}</td>
                  <td className="p-3 font-semibold text-white">{c.cpl}</td>
                  <td className="p-3 text-center font-bold text-emerald-450 text-emerald-400">{c.conv}</td>
                  <td className="p-3 text-right font-bold text-emerald-400 font-mono">{c.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimise ad copy spends", "Compare channels CAC", "Marketing budget planner"]} />
    </div>
  );
}
