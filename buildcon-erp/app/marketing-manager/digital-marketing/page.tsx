"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Globe, Users, TrendingUp } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const platformShare = [
  { platform: "Google Search", spend: 2.2, leads: 750 },
  { platform: "Facebook Ads", spend: 0.9, leads: 320 },
  { platform: "Instagram Ads", spend: 0.5, leads: 200 },
  { platform: "LinkedIn Ads", spend: 0.4, leads: 70 },
  { platform: "YouTube Video", spend: 0.8, leads: 100 },
];

export default function DigitalMarketing() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">DIGITAL MARKETING</h2>
        <p className="text-xs text-slate-400">Manage multi-channel online marketing spend, social traffic shares, and digital presence statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Digital Reach (Monthly)</div>
            <div className="text-xl font-bold text-white mt-1">1.2M Impressions</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Active Channels</div>
            <div className="text-xl font-bold text-white mt-1">5 Platforms</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Avg ROI Ratio</div>
            <div className="text-xl font-bold text-purple-400 mt-1">3.8x</div>
          </div>
        </div>
      </div>

      {/* Spend Share Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Platform Spend (Lakhs) & Lead Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformShare} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="platform" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Bar name="Spend (₹ L)" dataKey="spend" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar name="Leads" dataKey="leads" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platforms Details */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Multi-Platform Performance Summary</h3>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          {[
            { platform: "Google Search Ads", spend: "₹2.2 L", conversions: "750", cpl: "₹293" },
            { platform: "Facebook & Instagram", spend: "₹1.4 L", conversions: "520", cpl: "₹269" },
            { platform: "YouTube Video Promos", spend: "₹80k", conversions: "100", cpl: "₹800" }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-semibold text-white">{item.platform}</div>
              <div className="text-[10px] text-slate-400 space-y-1 mt-2">
                <div className="flex justify-between"><span>Spend:</span> <span className="text-white font-bold">{item.spend}</span></div>
                <div className="flex justify-between"><span>Conversions:</span> <span className="text-emerald-400 font-bold">{item.conversions}</span></div>
                <div className="flex justify-between"><span>Avg CPL:</span> <span className="text-white font-semibold">{item.cpl}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimize YouTube spends", "Compare cost per acquisition channels", "Check CPC targets"]} />
    </div>
  );
}
