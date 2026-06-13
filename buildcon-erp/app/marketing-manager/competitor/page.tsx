"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart3, HelpCircle, Layers } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const competitorShare = [
  { company: "BuildWell (Us)", marketShare: 35 },
  { company: "Apex Builders", marketShare: 28 },
  { company: "Prime Realty", marketShare: 22 },
  { company: "Global Infra", marketShare: 15 },
];

export default function CompetitorAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">COMPETITOR ANALYSIS</h2>
        <p className="text-xs text-slate-400">Review competitor organic traffic metrics, share of voice, active ad campaigns, and brand keyword positions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Our Market Share</div>
            <div className="text-xl font-bold text-white mt-1">35% (Leader)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Tracked Competitors</div>
            <div className="text-xl font-bold text-white mt-1">3 Companies</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Competitor Ad Spends Est.</div>
            <div className="text-xl font-bold text-purple-400 mt-1">₹8.4 L (Total)</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Share of voice */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Market Share of Voice (%)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitorShare} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="company" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="marketShare" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Competitor Breakdown Overview</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Competitor</th>
                  <th className="pb-2">Estimated Traffic</th>
                  <th className="pb-2">Primary Ad Channel</th>
                  <th className="pb-2">Organic Rank Keywords</th>
                  <th className="pb-2">Estimated Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["Apex Builders", "42,000 / mo", "Google Ads", "240 keywords", "₹3.2 L"],
                  ["Prime Realty", "38,000 / mo", "Meta Ads", "180 keywords", "₹2.8 L"],
                  ["Global Infra Corp", "15,000 / mo", "LinkedIn Ads", "95 keywords", "₹2.4 L"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                    <td className="text-slate-350">{row[1]}</td>
                    <td className="text-slate-350">{row[2]}</td>
                    <td className="text-white font-bold">{row[3]}</td>
                    <td className="text-rose-400 font-bold">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Generate competitor SEO keywords list", "Suggest ad copy countering Apex Builders", "Show SOV updates"]} />
    </div>
  );
}
