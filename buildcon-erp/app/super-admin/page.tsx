"use client";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Building2, Briefcase, DollarSign, Users, Cpu, Activity, Sparkles, ArrowUpRight } from "lucide-react";

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTelemetry = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      const res = await fetch("https://erp-construction.onrender.com/api/super-admin/telemetry", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Failed to load telemetry statistics.");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTelemetry();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
        <p className="text-xs text-slate-400">Loading system telemetry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center">
        <p className="text-sm text-red-400 font-semibold">{error}</p>
        <button
          onClick={loadTelemetry}
          className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const platformRevenue = data?.platformRevenue || [];
  const aiModelUsage = data?.aiModelUsage || [];

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
            <div className="text-2xl font-bold text-white">{data?.totalOrganizations ?? 0}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ Active in multi-tenant cloud</div>
          </div>
        </div>

        {/* Total Projects */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Projects</span>
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{data?.totalProjects ?? 0}</div>
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
            <div className="text-2xl font-bold text-white">{data?.platformMRR ?? "₹ 0 Lakhs"}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ Calculated from active tiers</div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Active Users</span>
            <Users className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{data?.activeUsers ?? 0}</div>
            <div className="text-[10px] text-slate-400 mt-1">Concurrency rate managed</div>
          </div>
        </div>

        {/* AI Usage Statistics */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">AI Tokens / Calls MTD</span>
            <Cpu className="h-4 w-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{data?.aiCallsMTD ?? "0 Calls"}</div>
            <div className="text-[10px] text-teal-400 font-semibold mt-1">↑ Platform request rate</div>
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
                    {aiModelUsage.map((entry: any, index: number) => (
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
              {aiModelUsage.map((m: any) => (
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
        {/* System Health Telemetry Info Summary */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Infrastructure Status</h3>
            </div>
            <span className="text-xs text-slate-400">SLA: <span className="text-emerald-400 font-bold">99.98% MTD</span></span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#080d18] border border-slate-800/40">
              <span className="text-slate-300">Auth Microservice</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">Online <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span></span>
            </div>
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#080d18] border border-slate-800/40">
              <span className="text-slate-300">PostgreSQL Primary DB Cluster</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">Online <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span></span>
            </div>
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#080d18] border border-slate-800/40">
              <span className="text-slate-300">AI Prompt Router Node</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">Online <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span></span>
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
              {data?.aiOperationsSuggestion || "Switch background queries to Gemini 1.5 Flash to optimize monthly expenses."}
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
