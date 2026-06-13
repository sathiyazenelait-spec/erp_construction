"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { DollarSign, LineChart as LineIcon, Wallet, Percent, TrendingUp } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const investmentPortfolio = [
  { name: "Real Estate", value: 10.5, color: "#3B82F6" },
  { name: "Fixed Deposits", value: 5.0, color: "#10B981" },
  { name: "Equity Markets", value: 3.5, color: "#8B5CF6" },
  { name: "Debt Funds", value: 1.5, color: "#F59E0B" },
  { name: "Gold & Metal", value: 1.0, color: "#EC4899" },
];

const performanceTrend = [
  { m: "Jan", v: 18.5 },
  { m: "Feb", v: 19.2 },
  { m: "Mar", v: 19.8 },
  { m: "Apr", v: 20.4 },
  { m: "May", v: 21.0 },
  { m: "Jun", v: 21.5 },
];

export default function InvestmentTracker() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">12. INVESTMENT TRACKER</h2>
        <p className="text-xs text-slate-400">Track investments and returns</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Investment Value</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 21.5 Cr</div>
          <div className="text-[10px] text-slate-500 mt-1">Managed capital</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Active Portfolios</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">8</div>
          <div className="text-[10px] text-slate-500 mt-1">Across 5 asset classes</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Returns (YTD)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹ 4.2 Cr</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 12.3% vs last quarter</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">ROI (YTD)</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">14.7%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Target: 12.0%</div>
        </div>
      </div>

      {/* Row 2: Portfolio & Performance Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Portfolio Pie Chart */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Investment Portfolio</h3>
          <div className="flex items-center justify-around h-56">
            <div className="h-36 w-36 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={investmentPortfolio} dataKey="value" innerRadius={32} outerRadius={50} paddingAngle={2}>
                    {investmentPortfolio.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-white">₹ 21.5 Cr</span>
                <span className="text-[8px] text-slate-400">Total Value</span>
              </div>
            </div>
            <div className="space-y-1">
              {investmentPortfolio.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-350 w-16 truncate">{item.name}</span>
                  <span className="text-[10px] font-semibold text-white">₹{item.value} Cr</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Performance Area Chart */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Investment Performance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorInvest)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Detailed equity ledger", "FD maturity timelines", "Risk indicators audit", "Investment opportunities"]} />
    </div>
  );
}
