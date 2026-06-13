"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { LineChart, Clock, Eye, ShieldAlert } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const trafficData = [
  { m: "1 May", value: 1200 },
  { m: "7 May", value: 1450 },
  { m: "14 May", value: 1350 },
  { m: "21 May", value: 1680 },
  { m: "28 May", value: 1850 },
];

export default function WebsiteAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">WEBSITE ANALYTICS</h2>
        <p className="text-xs text-slate-400">Monitor everyday unique visitors counts, average session durations, site bounce rates, and active page views.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Unique Visitors</div>
            <div className="text-xl font-bold text-white mt-1">45k Visitors</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Avg Session Duration</div>
            <div className="text-xl font-bold text-white mt-1">2m 45s</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <LineChart className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Page Views (MTD)</div>
            <div className="text-xl font-bold text-white mt-1">182k Views</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 grid place-items-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Bounce Rate</div>
            <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400 mt-1">38.2%</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visitors Area Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Daily Unique Visitors Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Area name="Unique Visitors" type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#visitorGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most visited pages */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Visited Pages Summary</h3>
          <div className="space-y-4 text-xs">
            {[
              { path: "/projects/skyline-residences", views: "14,500 views", duration: "3m 12s" },
              { path: "/projects/greenfield-apartments", views: "12,200 views", duration: "2m 54s" },
              { path: "/contact-us", views: "4,500 views", duration: "1m 15s" },
              { path: "/home", views: "18,200 views", duration: "0m 45s" }
            ].map((p, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#0e1628] border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">{p.path}</div>
                  <div className="text-[10px] text-slate-400">Duration: {p.duration}</div>
                </div>
                <span className="text-emerald-450 text-emerald-450 text-emerald-400 font-bold font-mono">{p.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Suggest landing page optimizations", "Track clickstream path of convert leads", "Show site speed diagnostic report"]} />
    </div>
  );
}
