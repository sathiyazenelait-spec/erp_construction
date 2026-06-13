"use client";
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const delayTimeline = [
  { m: "Jan", days: 30 },
  { m: "Feb", days: 45 },
  { m: "Mar", days: 62 },
  { m: "Apr", days: 70 },
  { m: "May", days: 80 },
];

const delayReasons = [
  { reason: "Material Delay", days: 30, color: "#3B82F6" },
  { reason: "Design Changes", days: 20, color: "#F59E0B" },
  { reason: "Approval Delay", days: 15, color: "#EF4444" },
  { reason: "Labour Shortage", days: 10, color: "#8B5CF6" },
  { reason: "Weather Conditions", days: 5, color: "#10B981" },
];

export default function DelayManagement() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">08. DELAY MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Track delay reasons, construction timelines, and schedule impacts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Delayed Projects</div>
          <div className="text-2xl font-bold text-white mt-1">4 Projects</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Delay (Days)</div>
          <div className="text-2xl font-bold text-red-400 mt-1">80 Days</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Critical Delay</div>
          <div className="text-2xl font-bold text-red-400 mt-1">45 Days</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Avg Delay / Project</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">20 Days</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Delay reasons bar */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Delay Reasons</h3>
          <div className="space-y-3">
            {delayReasons.map((dr, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-350">{dr.reason}</span>
                  <span className="text-white font-bold">{dr.days} Days</span>
                </div>
                <div className="h-2 bg-[#0E1726] rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full rounded-full" style={{ width: `${(dr.days / 30) * 100}%`, backgroundColor: dr.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delay timeline line chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Delay Timeline</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={delayTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Line type="monotone" dataKey="days" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimize material delays", "Verify critical milestones schedule", "Report delays reasons"]} />
    </div>
  );
}
