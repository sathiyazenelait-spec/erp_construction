"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Search, Compass, ShieldCheck } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const seoTrafficTrend = [
  { m: "Jan", traffic: 24000 },
  { m: "Feb", traffic: 28000 },
  { m: "Mar", traffic: 35000 },
  { m: "Apr", traffic: 41000 },
  { m: "May", traffic: 54000 },
];

export default function SEOAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">SEO ANALYTICS</h2>
        <p className="text-xs text-slate-400">Track organic search impressions, keyword position fluctuations, click organic traffic volumes, and backlink statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Organic Impressions (MTD)</div>
            <div className="text-xl font-bold text-white mt-1">450k Impressions</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Organic Clicks (MTD)</div>
            <div className="text-xl font-bold text-white mt-1">54k Clicks</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Avg Keyword Position</div>
            <div className="text-xl font-bold text-purple-400 mt-1">#4.2</div>
          </div>
        </div>
      </div>

      {/* Traffic Trend Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Organic Traffic Click Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={seoTrafficTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Area name="Organic Clicks" type="monotone" dataKey="traffic" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#trafficGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Keywords table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Performing Organic Keywords</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Target Keyword</th>
                <th className="pb-2">Search Volume</th>
                <th className="pb-2">Avg Position</th>
                <th className="pb-2">Organic Clicks</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["luxury villas chennai", "12,000", "#2", "2,450 Clicks", "Rank Improved"],
                ["best apartments coimbatore", "8,500", "#4", "1,850 Clicks", "Rank Stable"],
                ["top builders madurai", "4,200", "#3", "920 Clicks", "Rank Improved"],
                ["construction ERP system", "3,500", "#8", "410 Clicks", "Needs Optimization"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-white font-bold">{row[2]}</td>
                  <td className="text-emerald-400 font-bold">{row[3]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[4] === "Rank Improved" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : row[4] === "Rank Stable"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 border-rose-500/20"
                    }`}>
                      {row[4]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Suggest optimizations for construction ERP keyword", "Generate organic backlink list", "Compare competitor ranks"]} />
    </div>
  );
}
