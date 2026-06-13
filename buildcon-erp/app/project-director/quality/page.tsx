"use client";
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const qcTrend = [
  { m: "Jan", passed: 40, failed: 5 },
  { m: "Feb", passed: 45, failed: 3 },
  { m: "Mar", passed: 38, failed: 6 },
  { m: "Apr", passed: 42, failed: 4 },
  { m: "May", passed: 45, failed: 2 },
];

const topNcr = [
  { name: "Concrete Work", count: 6 },
  { name: "Reinforcement", count: 4 },
  { name: "Brick Work", count: 3 },
  { name: "Plastering", count: 2 },
  { name: "Waterproofing", count: 1 },
];

export default function QualityCenter() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">07. QUALITY CENTER</h2>
        <p className="text-xs text-slate-400">Manage non-conformance reports (NCRs), quality audits, and inspection pass rates</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Inspections</div>
          <div className="text-2xl font-bold text-white mt-1">256</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Passed</div>
          <div className="text-2xl font-bold text-emerald-455 text-emerald-400 mt-1">210 (82%)</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Failed</div>
          <div className="text-2xl font-bold text-red-400 mt-1">30 (12%)</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Open NCRs</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">16 Open</div>
        </div>
      </div>

      {/* Content Chart & NCR List */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inspection trend line chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Quality Inspection Trend</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qcTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Line type="monotone" dataKey="passed" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top NCRs list */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top NCR Categories</h3>
          <div className="space-y-2">
            {topNcr.map((ncr, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-slate-350">{ncr.name}</span>
                <span className="font-bold text-white bg-slate-850 px-2 py-0.5 rounded border border-slate-800">{ncr.count} Open</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Detailed NCR descriptions", "Audit inspections backlog", "QC safety records"]} />
    </div>
  );
}
