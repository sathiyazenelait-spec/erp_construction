"use client";
import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  TrendingUp, Award, Clock, Users, ShieldCheck, FileCheck, HelpCircle,
  PlusCircle, AlertTriangle, Package, HardDrive, RefreshCw
} from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const equipmentData = [
  { name: "Active", value: 32, color: "#10B981" },
  { name: "Idle", value: 8, color: "#3B82F6" },
  { name: "Maintenance", value: 3, color: "#F59E0B" },
  { name: "Breakdown", value: 2, color: "#EF4444" },
];

const reportData = [
  { name: "Submitted", value: 14, color: "#10B981" },
  { name: "Pending", value: 3, color: "#F59E0B" },
  { name: "Overdue", value: 1, color: "#EF4444" },
];

export default function ConstructionManagerDashboard() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">CONSTRUCTION MANAGER DASHBOARD</h2>
          <p className="text-xs text-slate-400">Welcome, Karthik R. — track site status, workforce logistics, material consumption, and equipment status.</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">Active Projects</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">18</div>
            <div className="text-[8px] text-emerald-400 font-medium">↑ 12.5% vs Last Month</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">On-Time Projects</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">14</div>
            <div className="text-[8px] text-emerald-400 font-medium">↑ 16.7% vs Last Month</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">Delayed Projects</span>
            <Clock className="h-4 w-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">4</div>
            <div className="text-[8px] text-slate-400 font-medium">→ 0% change</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">Workforce On-Site</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">420</div>
            <div className="text-[8px] text-emerald-400 font-medium">↑ 6.3% vs Last Month</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">Safety Score</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">96%</div>
            <div className="text-[8px] text-emerald-400 font-medium">↑ 2% vs Last Month</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">QC Pass Rate</span>
            <FileCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">98%</div>
            <div className="text-[8px] text-emerald-400 font-medium">↑ 1% vs Last Month</div>
          </div>
        </div>
      </div>

      {/* Row 1 Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Progress Overview */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Project Progress Overview</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View All Projects →</span>
          </div>
          <div className="space-y-3.5 text-[11px]">
            {[
              { name: "Skyline Residences", progress: 72, target: 75, delay: "-3%", status: "Behind" },
              { name: "Greenfield Apartments", progress: 55, target: 52, delay: "+3%", status: "On Track" },
              { name: "Phoenix Commercial", progress: 30, target: 42, delay: "-12%", status: "Critical" },
              { name: "Lakeview Villas", progress: 65, target: 60, delay: "+5%", status: "On Track" },
              { name: "IT Park Phase - 1", progress: 40, target: 45, delay: "-5%", status: "Behind" },
            ].map((p, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">{p.name}</span>
                  <span className={p.status === "Critical" ? "text-rose-400" : p.status === "Behind" ? "text-amber-400" : "text-emerald-400"}>
                    {p.status} ({p.delay})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded bg-slate-800 overflow-hidden">
                    <div className="h-full rounded" style={{
                      width: `${p.progress}%`,
                      backgroundColor: p.status === "Critical" ? "#EF4444" : p.status === "Behind" ? "#F59E0B" : "#10B981"
                    }} />
                  </div>
                  <span className="text-white font-semibold font-mono w-8 text-right">{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Site Monitoring Live */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Site Monitoring (Live)</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View All Sites →</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Site - A", desc: "Skyline Residences", workers: 120, progress: "65%", issues: 6, status: "On Track" },
              { name: "Site - B", desc: "Greenfield Apartments", workers: 85, progress: "55%", issues: 3, status: "On Track" },
              { name: "Site - C", desc: "Phoenix Commercial", workers: 150, progress: "30%", issues: 9, status: "Behind" }
            ].map((site, idx) => (
              <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between text-[10px]">
                <div>
                  <div className="font-semibold text-white truncate">{site.name}</div>
                  <div className="text-[8px] text-slate-400 truncate mb-2">{site.desc}</div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    site.status === "On Track" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {site.status}
                  </span>
                </div>
                <div className="space-y-1 mt-4 pt-2 border-t border-slate-850 text-slate-350">
                  <div className="flex justify-between"><span>👷 Workers:</span> <span className="font-semibold text-white">{site.workers}</span></div>
                  <div className="flex justify-between"><span>📈 Progress:</span> <span className="font-semibold text-white">{site.progress}</span></div>
                  <div className="flex justify-between"><span>⚠️ Issues:</span> <span className="font-semibold text-rose-400">{site.issues}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Labour Productivity */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Labour Productivity (Today)</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View Report →</span>
          </div>
          <div className="space-y-3">
            {[
              { type: "Masonry", val: 85, color: "#3B82F6" },
              { type: "Concrete", val: 92, color: "#10B981" },
              { type: "Plastering", val: 88, color: "#F59E0B" },
              { type: "MEP Works", val: 81, color: "#8B5CF6" },
              { type: "Finishing", val: 75, color: "#EF4444" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-300">
                  <span>{item.type}</span>
                  <span className="font-bold text-white font-mono">{item.val}%</span>
                </div>
                <div className="h-1.5 rounded bg-slate-800 overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Material Tracking */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Material Tracking (This Month)</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View All Materials →</span>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
            {[
              { name: "Cement", count: "1,250 Bags", icon: "📦", chg: "↑ 8%", good: true },
              { name: "Steel", count: "145 Tons", icon: "📐", chg: "↓ 3%", good: false },
              { name: "Sand", count: "380 Loads", icon: "🏜️", chg: "↑ 5%", good: true },
              { name: "Bricks", count: "95k Nos", icon: "🧱", chg: "↑ 12%", good: true },
              { name: "Aggregate", count: "210 Loads", icon: "🪨", chg: "↑ 6%", good: true }
            ].map((mat, idx) => (
              <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2 flex flex-col justify-between">
                <span className="text-lg">{mat.icon}</span>
                <span className="font-semibold text-slate-300 truncate mt-1.5">{mat.name}</span>
                <span className="font-bold text-white font-mono text-[9px] mt-1">{mat.count}</span>
                <span className={`text-[8px] font-semibold mt-1 ${mat.good ? "text-emerald-400" : "text-rose-400"}`}>{mat.chg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Monitoring */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Equipment Monitoring</h3>
            <div className="space-y-2 text-[10px]">
              {equipmentData.map((eq) => (
                <div key={eq.name} className="flex items-center justify-between text-slate-350">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: eq.color }} />
                    <span>{eq.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{eq.value} ({Math.round(eq.value/45*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={equipmentData} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {equipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white font-mono">45</span>
              <span className="text-[7px] text-slate-400 uppercase">Total Units</span>
            </div>
          </div>
        </div>

        {/* Quality Control */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Quality Control (This Month)</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View Report →</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] mb-4">
            {[
              { label: "Inspections", val: "158", color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "Passed", val: "152", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Failed", val: "6", color: "text-rose-450 text-rose-400", bg: "bg-rose-500/10" },
              { label: "Pending", val: "4", color: "text-amber-450 text-amber-450 text-amber-400", bg: "bg-amber-500/10" }
            ].map((q, idx) => (
              <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2">
                <div className={`h-6 w-6 rounded-full ${q.bg} ${q.color} grid place-items-center mx-auto text-xs font-bold font-mono mb-1`}>{q.val}</div>
                <div className="text-[8px] text-slate-400 truncate">{q.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-850">
            <span className="text-slate-300">Pass Rate: <span className="font-bold text-emerald-400">98%</span></span>
            <div className="flex-1 max-w-[120px] h-2 rounded bg-slate-800 overflow-hidden ml-4">
              <div className="h-full rounded bg-emerald-500" style={{ width: "98%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Safety Center */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Safety Center</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View Safety Report →</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] mb-4">
            {[
              { label: "Toolbox Talks", val: "100%", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "PPE Compliance", val: "97%", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Near Miss", val: "4", color: "text-amber-400", bg: "bg-amber-500/10" },
              { label: "Major Incident", val: "0", color: "text-emerald-450 text-emerald-400", bg: "bg-emerald-500/10" }
            ].map((s, idx) => (
              <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2">
                <div className={`h-6 w-6 rounded-full ${s.bg} ${s.color} grid place-items-center mx-auto text-xs font-bold font-mono mb-1`}>{s.val}</div>
                <div className="text-[8px] text-slate-400 truncate">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-850">
            <span className="text-slate-300">Safety Score: <span className="font-bold text-emerald-400">96%</span></span>
            <div className="flex-1 max-w-[120px] h-2 rounded bg-slate-800 overflow-hidden ml-4">
              <div className="h-full rounded bg-emerald-500" style={{ width: "96%" }} />
            </div>
          </div>
        </div>

        {/* Delay Management */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Delay Management</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View All Delays →</span>
          </div>
          <div className="space-y-2.5 text-[10px]">
            {[
              { project: "Phoenix Commercial", risk: "82% Risk", reason: "Material Shortage", action: "Expedite Delivery" },
              { project: "IT Park Phase - 1", risk: "65% Risk", reason: "Design Changes", action: "Client Approval" },
              { project: "Lakeview Villas", risk: "45% Risk", reason: "Labour Shortage", action: "Increase Labour" }
            ].map((d, idx) => (
              <div key={idx} className="bg-[#0e1628] border border-slate-850 rounded-lg p-2.5 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-200">{d.project}</div>
                  <div className="text-[8px] text-slate-400">Reason: {d.reason} • Action: {d.action}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                  d.risk.includes("82") 
                    ? "bg-rose-500/10 text-rose-450 text-rose-400 border border-rose-500/20" 
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>
                  {d.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Site Reports */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Daily Site Reports</h3>
            <div className="space-y-2 text-[10px]">
              {reportData.map((rep) => (
                <div key={rep.name} className="flex items-center justify-between text-slate-350">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: rep.color }} />
                    <span>{rep.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{rep.value} ({Math.round(rep.value/18*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reportData} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {reportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white font-mono">18</span>
              <span className="text-[7px] text-slate-400 uppercase">Total Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-around text-xs">
        <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Quick Actions:</span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition">
          <PlusCircle className="h-3.5 w-3.5" />
          Add Site Report
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition">
          <AlertTriangle className="h-3.5 w-3.5" />
          Raise Issue
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition">
          <Package className="h-3.5 w-3.5" />
          Request Material
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition">
          <Users className="h-3.5 w-3.5" />
          Assign Labour
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition">
          <Clock className="h-3.5 w-3.5" />
          Schedule Meeting
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition">
          <HardDrive className="h-3.5 w-3.5" />
          Create Work Order
        </button>
      </div>

      <AIAssistantBar suggestions={[
        "Which project is at risk?",
        "Show material over-consumption",
        "What is the reason for delay in Phoenix Commercial?",
        "Predict completion date for all projects"
      ]} />
    </div>
  );
}
