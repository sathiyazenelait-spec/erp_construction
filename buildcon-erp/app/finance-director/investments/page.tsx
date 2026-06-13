"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Banknote, TrendingUp, Compass } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const yieldData = [
  { fund: "HDFC Liquid Fund", yield: 7.2 },
  { fund: "SBI Treasury Bills", yield: 6.8 },
  { fund: "ICICI Fixed Deposit", yield: 7.5 },
  { fund: "Kotak Arbitrage", yield: 6.5 },
];

export default function InvestmentTracker() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">INVESTMENT TRACKER</h2>
        <p className="text-xs text-slate-400">Manage surplus cash investments, treasury yields, short term fixed deposits, and corporate arbitrage funds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Treasury Portfolio</div>
            <div className="text-xl font-bold text-white">₹15.0 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Average Portfolio Yield</div>
            <div className="text-xl font-bold text-white">7.15% p.a.</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Maturity Alert (30 Days)</div>
            <div className="text-xl font-bold text-amber-400">₹5.0 Cr (FD SBI)</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Yield Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Treasury Yields Comparison (%)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="fund" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="yield" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Investment Portfolio */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Active Cash Placement Register</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Institution / Mutual Fund</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Invested Amount</th>
                  <th className="pb-2">Current Value</th>
                  <th className="pb-2">Maturity Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["State Bank of India", "Fixed Deposit", "₹5.0 Cr", "₹5.18 Cr", "15 Jun 2026"],
                  ["HDFC Liquid Mutual Fund", "Liquid Fund", "₹4.0 Cr", "₹4.12 Cr", "Daily Liquidity"],
                  ["ICICI Prudential Arbitrage", "Arbitrage Fund", "₹3.0 Cr", "₹3.08 Cr", "Weekly Liquidity"],
                  ["RBI 91-Day Treasury Bills", "Govt Sovereign", "₹3.0 Cr", "₹3.05 Cr", "10 Aug 2026"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-slate-200">{row[0]}</td>
                    <td className="text-slate-350">{row[1]}</td>
                    <td className="text-white font-bold">{row[2]}</td>
                    <td className="text-emerald-400 font-bold">{row[3]}</td>
                    <td className="text-slate-400 font-semibold">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Calculate return on SBI FD", "Move ₹2 Cr to HDFC Liquid", "Compare arbitrage vs liquid yields"]} />
    </div>
  );
}
