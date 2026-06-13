"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { TrendingUp, Award, Star, ShieldAlert } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { funnel } from "@/lib/data";

export default function SalesPipeline() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">04. SALES & OPPORTUNITIES</h2>
        <p className="text-xs text-slate-400">Marketing metrics, leads funnel conversion, and signed contracts value</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Won Value (MTD)</div>
            <div className="text-2xl font-bold text-white mt-1">₹ 14.5 Cr</div>
            <div className="text-[10px] text-emerald-400 mt-1">↑ 10.2% vs target</div>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-500/20" />
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Average Proposal Size</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">₹ 6.2 Cr</div>
            <div className="text-[10px] text-slate-500 mt-1">High conversion rating</div>
          </div>
          <Star className="h-8 w-8 text-yellow-500/20" />
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Conversion Rate</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">14.8%</div>
            <div className="text-[10px] text-emerald-400 mt-1">Industry standard: 12.0%</div>
          </div>
          <Award className="h-8 w-8 text-emerald-500/20" />
        </div>
      </div>

      {/* Sales Pipeline Funnel chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Signed Leased/Conversion Funnel (MTD)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnel} margin={{ left: -15, right: 10, top: 10, bottom: 5 }}>
              <XAxis dataKey="stage" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={35}>
                {funnel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AIAssistantBar suggestions={["Show pipeline lead sources", "Top pending proposal values", "Sales conversion audits", "Client win records"]} />
    </div>
  );
}
