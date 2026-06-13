"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Sparkles, Trophy, DollarSign, CheckCircle2, ShieldAlert, Briefcase, Users, Hammer, CreditCard, Star, Heart } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { departments, revenueTrend } from "@/lib/data";

const projectStatus = [
  { name: "On Track", value: 12, color: "#10B981" },
  { name: "Delayed", value: 4, color: "#F59E0B" },
  { name: "Critical", value: 2, color: "#EF4444" },
];

export default function MDDashboard() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">01. EXECUTIVE SUMMARY</h2>
          <p className="text-xs text-slate-400">Real-time operational dashboard for BuildWell Constructions</p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Revenue MTD */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Revenue (MTD)</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹ 24.5 Cr</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 15.6% vs last month</div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Net Profit (MTD)</span>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹ 5.8 Cr</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">Margin 23.6%</div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Active Projects</span>
            <Briefcase className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">18</div>
            <div className="text-[10px] text-slate-400 flex gap-2 mt-1">
              <span className="text-emerald-400">12 OT</span>
              <span className="text-amber-400">4 Dly</span>
              <span className="text-red-400">2 Crit</span>
            </div>
          </div>
        </div>

        {/* Leads Generated */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Leads Generated</span>
            <Users className="h-4 w-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">1,250</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 10.2% vs Apr 2025</div>
          </div>
        </div>

        {/* Cash Position */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Cash Position</span>
            <CreditCard className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹ 12.1 Cr</div>
            <div className="text-[10px] text-slate-500 mt-1">Available balance</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Business Performance Overview</h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Revenue vs Profit</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0F182A", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Projects Status</h3>
          <div className="flex items-center justify-around h-56">
            <div className="h-36 w-36 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={projectStatus} dataKey="value" nameKey="name" innerRadius={42} outerRadius={56} paddingAngle={4}>
                    {projectStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">18</span>
                <span className="text-[9px] text-slate-400">Total Projects</span>
              </div>
            </div>
            <div className="space-y-3">
              {projectStatus.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }}></span>
                  <span className="text-[10px] text-slate-350">{status.name}</span>
                  <span className="text-xs font-bold text-white">{status.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* KPI metrics */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-around">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Leads Generated</span>
            <span>Employees</span>
            <span>Client Satisfaction</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <div className="text-base font-bold text-white">1,250</div>
              <div className="text-[9px] text-emerald-400">↑ 10.2% vs Apr 2025</div>
            </div>
            <div>
              <div className="text-base font-bold text-white">215</div>
              <div className="text-[9px] text-emerald-400">↑ 3% vs Apr 2025</div>
            </div>
            <div>
              <div className="text-base font-bold text-white">4.8 / 5</div>
              <div className="text-[9px] text-slate-500">Based on 128 reviews</div>
            </div>
          </div>
        </div>

        {/* Risk / Alerts */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-4 w-4 text-red-400 animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Alert Highlights</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex justify-between items-center">
              <span>Phoenix Commercial Complex</span>
              <span className="text-red-400 font-semibold">Delay risk High</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Budget overrun in 2 projects</span>
              <span className="text-amber-405 text-amber-400">Monitor closely</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Material price increase by 12%</span>
              <span className="text-red-400">Action Required</span>
            </li>
          </ul>
        </div>
      </div>

      <AIAssistantBar suggestions={["Show delayed projects", "Revenue forecast", "Department performance", "Cash flow prediction"]} />
    </div>
  );
}
