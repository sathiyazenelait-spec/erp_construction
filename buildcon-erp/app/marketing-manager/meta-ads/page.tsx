"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Send, Instagram, Facebook } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const metaAdPerformance = [
  { campaign: "Skyline FB Lead Gen", spend: 0.6, leads: 240 },
  { campaign: "Greenfield Instagram Video", spend: 0.5, leads: 210 },
  { campaign: "Coimbatore Carousel Ads", spend: 0.2, leads: 50 },
  { campaign: "Retargeting Dynamic Ads", spend: 0.1, leads: 20 },
];

export default function MetaAdsConsole() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">META ADS CONSOLE</h2>
        <p className="text-xs text-slate-400">Manage Facebook & Instagram campaigns, custom audiences reach, cost per result, and lead forms submissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Meta Ads Spend MTD</div>
          <div className="text-xl font-bold text-white mt-1">₹1.4 Lakhs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Conversions Generated</div>
          <div className="text-xl font-bold text-emerald-450 text-emerald-400 mt-1">520 Leads</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Avg CTR</div>
          <div className="text-xl font-bold text-white mt-1">2.4%</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Avg Cost Per Lead (CPL)</div>
          <div className="text-xl font-bold text-purple-400 mt-1">₹269</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaigns Bar Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Conversions vs Spend (in Lakhs) by Meta Campaign</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metaAdPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="campaign" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar name="Spend (₹ L)" dataKey="spend" fill="#EC4899" radius={[4, 4, 0, 0]} />
                <Bar name="Leads" dataKey="leads" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Platform Share</h3>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center p-3 rounded bg-[#0e1628] border border-slate-800">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-400" />
                  <span className="text-slate-200 font-semibold">Instagram Feed & Stories</span>
                </div>
                <span className="text-white font-mono font-bold">290 Leads</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-[#0e1628] border border-slate-800">
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-200 font-semibold">Facebook Newsfeed</span>
                </div>
                <span className="text-white font-mono font-bold">230 Leads</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimize custom lead forms design", "Setup Instagram retargeting audience", "Calculate cost per result metric"]} />
    </div>
  );
}
