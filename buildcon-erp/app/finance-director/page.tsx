"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";
import { TrendingUp, Banknote, Wallet, ArrowUpFromLine, ArrowDownToLine, CheckSquare } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const revenueTrend = [
  { m: "Jun 24", rev: 18.5, exp: 14.2 },
  { m: "Jul 24", rev: 19.2, exp: 14.8 },
  { m: "Aug 24", rev: 20.1, exp: 15.5 },
  { m: "Sep 24", rev: 21.5, exp: 16.0 },
  { m: "Oct 24", rev: 22.0, exp: 16.8 },
  { m: "Nov 24", rev: 21.8, exp: 16.5 },
  { m: "Dec 24", rev: 23.4, exp: 17.2 },
  { m: "Jan 25", rev: 22.8, exp: 17.0 },
  { m: "Feb 25", rev: 23.9, exp: 17.8 },
  { m: "Mar 25", rev: 25.2, exp: 18.5 },
  { m: "Apr 25", rev: 24.1, exp: 18.0 },
  { m: "May 25", rev: 24.5, exp: 18.2 },
];

export default function FinanceDirectorDashboard() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">FINANCIAL COMMAND CENTER</h2>
          <p className="text-xs text-slate-400">Welcome Suresh Kumar — consolidated cash flow, profit margins, and statutory control.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Revenue (MTD)</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹24.5 Cr</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 15.6% vs Last Month</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Gross Profit Margin</span>
            <Banknote className="h-4 w-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹7.6 Cr</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">31.02% Profit Margin</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Net Profit</span>
            <Wallet className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹5.8 Cr</div>
            <div className="text-[10px] text-slate-400 mt-1">Margin 23.6% (Consistent)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Cash Position</span>
            <Wallet className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-amber-400">₹12.1 Cr</div>
            <div className="text-[10px] text-slate-400 mt-1">Liquid Cash Available</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Revenue vs Expenditures</h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">INR (in Crores)</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                <Area name="Revenue" type="monotone" dataKey="rev" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area name="Expenditure" type="monotone" dataKey="exp" stroke="#F59E0B" strokeWidth={1.5} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Forecast Card */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Cash Flow Forecast (AI Powered)</h3>
            <div className="space-y-4">
              <div className="bg-[#0e1628] border border-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400">Current Balance</div>
                <div className="text-xl font-bold text-white mt-1">₹12.1 Cr</div>
              </div>
              <div className="bg-[#0e1628] border border-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400">Forecasted (30 Days)</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">₹14.3 Cr <span className="text-[10px] text-emerald-500 font-normal">↑ 18%</span></div>
              </div>
              <div className="bg-[#0e1628] border border-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400">Forecasted (60 Days)</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">₹16.8 Cr <span className="text-[10px] text-emerald-500 font-normal">↑ 28%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receivables & Payables Quick view */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Top Outstanding Receivables</h3>
            <ArrowUpFromLine className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800"><th className="pb-2">Client</th><th className="pb-2">Outstanding</th><th className="pb-2">Days Overdue</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["ABC Builders", "₹1.2 Cr", "45 Days"],
                  ["XYZ Developers", "₹85 L", "30 Days"],
                  ["Villa Client", "₹32 L", "15 Days"]
                ].map((r) => (
                  <tr key={r[0]}><td className="py-2.5 font-medium text-slate-200">{r[0]}</td><td className="text-emerald-400 font-bold">{r[1]}</td><td className="text-slate-450 text-slate-450 text-slate-450 text-amber-500">{r[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Upcoming Payables</h3>
            <ArrowDownToLine className="h-4 w-4 text-rose-450 text-rose-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800"><th className="pb-2">Vendor / Contractor</th><th className="pb-2">Amount Due</th><th className="pb-2">Due Date</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["Cement Supplier Corp", "₹48 L", "In 7 Days"],
                  ["Global Steel Inc", "₹62 L", "In 15 Days"],
                  ["MEP Contracting Ltd", "₹22 L", "In 21 Days"]
                ].map((r) => (
                  <tr key={r[0]}><td className="py-2.5 font-medium text-slate-200">{r[0]}</td><td className="text-rose-450 text-rose-400 font-bold">{r[1]}</td><td className="text-slate-400">{r[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Why profit margin decreased?", "Least profitable project", "Year-end profit forecast"]} />
    </div>
  );
}
