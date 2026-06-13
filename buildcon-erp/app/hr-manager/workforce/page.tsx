"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Users, Hammer, Users2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const headcountData = [
  { group: "Engineers", count: 35 },
  { group: "Supervisors", count: 22 },
  { group: "HR Staff", count: 6 },
  { group: "Finance Staff", count: 8 },
  { group: "Workers", count: 420 },
];

export default function WorkforceOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">WORKFORCE OVERVIEW</h2>
        <p className="text-xs text-slate-400">Detailed overview of company headcount, active project roles, staff distributions, and site labor forces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Staff Headcount</div>
            <div className="text-xl font-bold text-white mt-1">71 Staff</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Hammer className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Active Workers On-Site</div>
            <div className="text-xl font-bold text-white mt-1">420 Workers</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Users2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Managed Workforce</div>
            <div className="text-xl font-bold text-purple-400 mt-1">491 Total</div>
          </div>
        </div>
      </div>

      {/* Headcount Bar Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Workforce Headcount Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={headcountData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="group" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Bar name="Headcount" dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AIAssistantBar suggestions={["Export complete staff listing", "Filter workforce by Chennai site", "Check supervisor allocations"]} />
    </div>
  );
}
