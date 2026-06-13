"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, Landmark, Award, BookOpen, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const workforceData = [
  { name: "Engineers", count: 35, color: "#3B82F6" },
  { name: "Supervisors", count: 22, color: "#10B981" },
  { name: "HR Staff", count: 6, color: "#8B5CF6" },
  { name: "Finance Staff", count: 8, color: "#EC4899" },
  { name: "Workers", count: 420, color: "#F59E0B" },
];

const recruitmentPipeline = [
  { stage: "Applications", count: 650, color: "#3B82F6" },
  { stage: "Screened", count: 210, color: "#8B5CF6" },
  { stage: "Interviewed", count: 80, color: "#EAB308" },
  { stage: "Selected", count: 18, color: "#F97316" },
  { stage: "Joined", count: 12, color: "#10B981" },
];

export default function HRExecutiveSummary() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">HR EXECUTIVE SUMMARY</h2>
          <p className="text-xs text-slate-400">Welcome, Meenakshi Iyer — workforce diagnostics, active hiring pipelines, and payroll disbursal controls.</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Employees</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">215</span>
            <span className="text-[9px] text-slate-400">Staff</span>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Labour Workforce</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">420</span>
            <span className="text-[9px] text-emerald-450 text-emerald-400 font-medium">On-Site</span>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Open Positions</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">18</span>
            <span className="text-[9px] text-amber-400 font-medium">Hiring</span>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Attrition Rate</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">3.2%</span>
            <span className="text-[9px] text-emerald-450 text-emerald-400 font-medium">Low</span>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Avg Attendance</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">94%</span>
            <span className="text-[9px] text-slate-400">Daily</span>
          </div>
        </div>
      </div>

      {/* Flow Information Diagram */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">HR Information Flow Hierarchy</h3>
        <div className="flex flex-col md:flex-row justify-around items-center gap-3 text-xs font-medium text-slate-200">
          <div className="bg-[#0e1628] border border-slate-850 p-2.5 rounded-lg text-center w-full max-w-[150px]">👷 Employees</div>
          <span className="hidden md:inline text-slate-500">➔</span>
          <div className="bg-[#0e1628] border border-slate-850 p-2.5 rounded-lg text-center w-full max-w-[150px]">👔 Dept Heads</div>
          <span className="hidden md:inline text-slate-500">➔</span>
          <div className="bg-[#0e1628] border border-slate-850 p-2.5 rounded-lg text-center w-full max-w-[150px]">👩‍💼 HR Executives</div>
          <span className="hidden md:inline text-slate-500">➔</span>
          <div className="bg-[#0e1628] border border-slate-850 p-2.5 rounded-lg text-center w-full max-w-[150px] border-emerald-500/30 text-emerald-400">👑 HR Manager</div>
          <span className="hidden md:inline text-slate-500">➔</span>
          <div className="bg-[#0e1628] border border-slate-850 p-2.5 rounded-lg text-center w-full max-w-[150px] border-blue-500/30 text-blue-400">🏢 Managing Director</div>
        </div>
      </div>

      {/* Row 1 Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Workforce Overview breakdown */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Workforce Overview</h3>
            <div className="space-y-2 text-[10px]">
              {workforceData.map((w) => (
                <div key={w.name} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: w.color }} />
                    <span>{w.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{w.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={workforceData} dataKey="count" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {workforceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white font-mono">491</span>
              <span className="text-[7px] text-slate-400 uppercase">Total Headcount</span>
            </div>
          </div>
        </div>

        {/* Recruitment pipeline */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Recruitment Pipeline</h3>
          <div className="space-y-2 text-[11px] font-semibold">
            {recruitmentPipeline.map((item, idx) => (
              <div key={idx} className="rounded text-white p-2 flex justify-between items-center" style={{ backgroundColor: item.color, opacity: 1 - idx * 0.12 }}>
                <span>{item.stage}</span>
                <span className="font-mono font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance widget */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Attendance (Today)</h3>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded bg-[#0e1628] border border-slate-850">
                <span className="text-emerald-400 font-semibold">Present Workforce</span>
                <span className="font-bold text-white font-mono">590 Staff/Labour</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-[#0e1628] border border-slate-850">
                <span className="text-rose-455 text-rose-450 text-rose-400 font-semibold">Absent (Unexcused)</span>
                <span className="font-bold text-white font-mono">35 Cases</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-[#0e1628] border border-slate-850">
                <span className="text-blue-400 font-semibold">Approved Leave / Off</span>
                <span className="font-bold text-white font-mono">10 Cases</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payroll center */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Payroll Disbursal Center</h3>
            <div className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-3.5 text-xs text-center">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Salary Payout</div>
                <div className="text-2xl font-bold text-white mt-1">₹48 Lakhs</div>
              </div>
              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
                <span className="text-slate-455 text-slate-450 text-slate-400">Processing Progress:</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">100% Processed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leave management */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Leave Requests MTD</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-lg">
                <div className="text-[16px] font-bold text-amber-400">14</div>
                <div className="text-[9px] text-slate-400 mt-1">Pending</div>
              </div>
              <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-lg">
                <div className="text-[16px] font-bold text-emerald-450 text-emerald-400">32</div>
                <div className="text-[9px] text-slate-400 mt-1">Approved</div>
              </div>
              <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-lg">
                <div className="text-[16px] font-bold text-rose-455 text-rose-450 text-rose-400">4</div>
                <div className="text-[9px] text-slate-400 mt-1">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance management */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Performance Evaluations</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-[#0e1628] border border-slate-850">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">🏆 Top Performers</span>
                <span className="font-bold text-white font-mono">18 Evaluated</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#0e1628] border border-slate-850">
                <span className="text-rose-400 font-semibold flex items-center gap-1">⚠️ Needs Improvement</span>
                <span className="font-bold text-white font-mono">7 Evaluated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={[
        "Predict employee attrition risk",
        "Show workforce absentee trends",
        "Identify skills and safety gaps",
        "Suggest corporate manpower requirements"
      ]} />
    </div>
  );
}
