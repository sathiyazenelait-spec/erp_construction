"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import { Building2, Briefcase, DollarSign, Users, Cpu, ShieldAlert, Sparkles, Activity, ArrowUpRight } from "lucide-react";

const platformRevenue = [
  { m: "Jan", rev: 120000, aiCalls: 45000 },
  { m: "Feb", rev: 135000, aiCalls: 52000 },
  { m: "Mar", rev: 150000, aiCalls: 68000 },
  { m: "Apr", rev: 185000, aiCalls: 85000 },
  { m: "May", rev: 210000, aiCalls: 110000 },
  { m: "Jun", rev: 245000, aiCalls: 142000 },
];

const aiModelUsage = [
  { name: "Gemini 1.5 Pro", value: 55, color: "#10B981" },
  { name: "Gemini 1.5 Flash", value: 30, color: "#3B82F6" },
  { name: "Claude 3.5 Sonnet", value: 15, color: "#8B5CF6" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">SYSTEM OVERVIEW</h2>
          <p className="text-xs text-slate-400">Global ERP platform telemetry and business statistics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">All Services Operational</span>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Organizations */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Organizations</span>
            <Building2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">42</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 4 new this month</div>
          </div>
        </div>

        {/* Total Projects */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Projects</span>
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">186</div>
            <div className="text-[10px] text-blue-400 font-semibold mt-1">Active construction sites</div>
          </div>
        </div>

        {/* Global Platform Revenue */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Platform MRR</span>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹ 24.5 Lakhs</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 18.2% Q/Q growth</div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Active Users</span>
            <Users className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">8,450</div>
            <div className="text-[10px] text-slate-400 mt-1">98.4% concurrency rate</div>
          </div>
        </div>

        {/* AI Usage Statistics */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">AI Tokens / Calls MTD</span>
            <Cpu className="h-4 w-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">142K Calls</div>
            <div className="text-[10px] text-teal-400 font-semibold mt-1">↑ 29% AI request surge</div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subscription & Platform Revenue Growth */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Platform Monthly Recurring Revenue (₹)</h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active Invoicing</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0c1220", borderColor: "#1e293b", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="rev" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMRR)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Model Preference Pie Chart */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">AI Model Usage Share</h3>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="h-44 w-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={aiModelUsage} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62} paddingAngle={5}>
                    {aiModelUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="text-[10px] text-slate-400">Total API Route</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-[10px]">
              {aiModelUsage.map((m) => (
                <div key={m.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }}></span>
                  <span className="text-slate-400 font-medium">{m.name} ({m.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Action center and System health logs */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Health Telemetry */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Infrastructure Status</h3>
            </div>
            <span className="text-xs text-slate-400">CPU Load: <span className="text-emerald-400 font-bold">14%</span></span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#080d18] border border-slate-800/40">
              <span className="text-slate-300">Auth Microservice</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">Online <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span></span>
            </div>
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#080d18] border border-slate-800/40">
              <span className="text-slate-300">PostgreSQL Primary DB Cluster</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">Online <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span></span>
            </div>
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#080d18] border border-slate-800/40">
              <span className="text-slate-300">AI Prompt Router Node</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">Online <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span></span>
            </div>
          </div>
        </div>

        {/* Global Admin Tasks */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Operations Suggestion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Platform AI utilization spiked by **29%** in the past week. Consider switching high-concurrency background routing queries to <strong>Gemini 1.5 Flash</strong> to optimize monthly API expenses.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 hover:brightness-110 transition-all">
              Switch API Tiers <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
