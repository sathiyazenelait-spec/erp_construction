"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Award, Zap, HelpCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const productivityData = [
  { m: "1 May", value: 80 },
  { m: "5 May", value: 85 },
  { m: "10 May", value: 83 },
  { m: "15 May", value: 87 },
  { m: "20 May", value: 92 },
  { m: "25 May", value: 89 },
];

export default function LabourProductivity() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">04. LABOUR PRODUCTIVITY</h2>
        <p className="text-xs text-slate-400">Track labor outputs, work rates across concrete/masonry/finishing, and identify delay bottlenecks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Overall Productivity Index</div>
          <div className="text-xl font-bold text-white mt-1">85% (Optimal)</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Highest Category Output</div>
          <div className="text-xl font-bold text-white mt-1">Concrete Works (92%)</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Lowest Category Output</div>
          <div className="text-xl font-bold text-rose-400 mt-1">Finishing (75%)</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Productivity trend */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Labour Productivity Trend (Monthly %)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Area name="Productivity %" type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#prodGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low performance warnings */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-400" />
              Low Performing Site Blocks
            </h3>
            <div className="space-y-3.5 text-xs">
              {[
                { site: "Phoenix Commercial", task: "MEP Works", val: "61%", status: "Needs Improvement" },
                { site: "IT Park Phase - 1", task: "Finishing", val: "70%", status: "Needs Improvement" },
                { site: "Skyline Residences", task: "Masonry", val: "82%", status: "Good" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-[#0e1628] border border-slate-850 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-200">{item.site}</div>
                    <div className="text-[9px] text-slate-400">Activity: {item.task}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{item.val}</div>
                    <span className={`text-[8px] font-semibold ${item.status.includes("Needs") ? "text-rose-455 text-rose-450 text-rose-400" : "text-emerald-400"}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Why is finishing productivity low?", "Suggest training schedules for Site A team", "Calculate average bricklaying rate"]} />
    </div>
  );
}
