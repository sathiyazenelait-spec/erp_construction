"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Wallet, DollarSign, TrendingUp, ArrowUpRight, Percent } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { revenueTrend } from "@/lib/data";

const expenseCategories = [
  { name: "Direct Construction Cost", value: 48, color: "#3B82F6" },
  { name: "Material Procurement", value: 24, color: "#10B981" },
  { name: "Labor & Payroll", value: 12, color: "#F59E0B" },
  { name: "Equipment Rent / CAPEX", value: 8, color: "#8B5CF6" },
  { name: "Other Overheads", value: 8, color: "#64748B" },
];

export default function FinancialOverview() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">03. FINANCIAL COMMAND</h2>
        <p className="text-xs text-slate-400">Company ledger, gross profit, cash flow forecasts, and aging receivables</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Group Revenue</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 132.6 Cr</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 18.4% YOY</div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Gross Profit (YTD)</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">₹ 28.4 Cr</div>
          <div className="text-[10px] text-slate-500 mt-1">GP Margin: 21.4%</div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Net Profit (YTD)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹ 24.3 Cr</div>
          <div className="text-[10px] text-emerald-400 mt-1">Net Margin: 18.3%</div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Cash Position</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 12.1 Cr</div>
          <div className="text-[10px] text-slate-500 mt-1">Liquid holdings</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue trend Area */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Revenue vs Profit Trend (Last 6 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense distribution */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Expense Distribution (YTD)</h3>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="h-40 w-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseCategories} dataKey="value" innerRadius={36} outerRadius={54} paddingAngle={3}>
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">100%</span>
                <span className="text-[8px] text-slate-400">Total Expenses</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-[9px]">
              {expenseCategories.map((ec, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ec.color }}></span>
                  <span className="text-slate-400">{ec.name} ({ec.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Cash flow prediction", "Accounts Aging", "Outstanding PO values", "Tax statements"]} />
    </div>
  );
}
