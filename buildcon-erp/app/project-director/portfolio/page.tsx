"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Building, MapPin, Globe } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { projects } from "@/lib/data";

const portfolioByType = [
  { name: "Residential", value: 84.5, color: "#10B981" },
  { name: "Commercial", value: 175.0, color: "#3B82F6" },
  { name: "Institutional", value: 182.0, color: "#F59E0B" },
];

export default function PortfolioOverview() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">01. PORTFOLIO OVERVIEW</h2>
        <p className="text-xs text-slate-400">Detailed performance review by asset types and regions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Residential Assets</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 84.5 Cr</div>
          <div className="text-[10px] text-slate-500 mt-1">7 active locations</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Commercial Assets</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">₹ 175.0 Cr</div>
          <div className="text-[10px] text-slate-500 mt-1">6 active locations</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Institutional Assets</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹ 182.0 Cr</div>
          <div className="text-[10px] text-slate-500 mt-1">5 active locations</div>
        </div>
      </div>

      {/* Asset Values Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Portfolio Asset Values</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={portfolioByType} margin={{ left: -15, right: 10, top: 10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40}>
                {portfolioByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AIAssistantBar suggestions={["Region breakdown", "Property list", "Historical asset analysis"]} />
    </div>
  );
}
