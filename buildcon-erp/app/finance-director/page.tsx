"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";
import { TrendingUp, Banknote, Wallet, ArrowUpFromLine, ArrowDownToLine, CheckSquare } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function FinanceDirectorDashboard() {
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("Suresh Kumar");
  const [revenueMtd, setRevenueMtd] = useState("₹24.5 Cr");
  const [grossProfit, setGrossProfit] = useState("₹7.6 Cr");
  const [netProfit, setNetProfit] = useState("₹5.8 Cr");
  const [cashPosition, setCashPosition] = useState("₹12.1 Cr");
  const [cash30Days, setCash30Days] = useState("₹14.3 Cr");
  const [cash60Days, setCash60Days] = useState("₹16.8 Cr");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [receivables, setReceivables] = useState<any[]>([]);
  const [payables, setPayables] = useState<any[]>([]);

  const formatAmount = (val: any) => {
    const amount = Number(val);
    if (isNaN(amount)) return val;
    if (amount >= 10000000) {
      return "₹" + (amount / 10000000).toFixed(1) + " Cr";
    }
    if (amount >= 100000) {
      return "₹" + (amount / 100000).toFixed(0) + " L";
    }
    return "₹" + amount.toLocaleString();
  };

  useEffect(() => {
    const s = getSession();
    const orgId = s?.organizationId || 1;
    const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
    fetch(`https://erp-construction.onrender.com/api/finance-director/dashboard/org/${orgId}`, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    })
      .then((res) => res.json())
      .then((d) => {
        setProfileName(d.profileName || "Suresh Kumar");
        setRevenueMtd(d.revenue_mtd || "₹24.5 Cr");
        setGrossProfit(d.gross_profit || "₹7.6 Cr");
        setNetProfit(d.net_profit || "₹5.8 Cr");
        setCashPosition(d.cash_position || "₹12.1 Cr");
        setCash30Days(d.cash_30_days || "₹14.3 Cr");
        setCash60Days(d.cash_60_days || "₹16.8 Cr");
        if (d.ai_suggestions) {
          setAiSuggestions(d.ai_suggestions.split("|").map((item: string) => item.trim()));
        }

        if (d.forecasts) {
          const mappedTrend = d.forecasts.map((f: any) => ({
            m: f.month,
            rev: f.inflow,
            exp: f.outflow
          }));
          setRevenueTrend(mappedTrend);
        } else {
          setRevenueTrend([]);
        }

        if (d.transactions) {
          const recs = d.transactions.filter((t: any) => t.type === "Receivable" && t.status !== "Paid");
          const pays = d.transactions.filter((t: any) => t.type === "Payable" && t.status !== "Paid");
          setReceivables(recs);
          setPayables(pays);
        } else {
          setReceivables([]);
          setPayables([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading FD dashboard stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-350 text-xs font-semibold">
        Loading Financial Metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">FINANCIAL COMMAND CENTER</h2>
          <p className="text-xs text-slate-400">Welcome {profileName} — consolidated cash flow, profit margins, and statutory control.</p>
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
            <div className="text-2xl font-bold text-white">{revenueMtd}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 15.6% vs Last Month</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Gross Profit Margin</span>
            <Banknote className="h-4 w-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{grossProfit}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">31.02% Profit Margin</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Net Profit</span>
            <Wallet className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{netProfit}</div>
            <div className="text-[10px] text-slate-400 mt-1">Margin 23.6% (Consistent)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Cash Position</span>
            <Wallet className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-amber-400">{cashPosition}</div>
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
                <div className="text-xl font-bold text-white mt-1">{cashPosition}</div>
              </div>
              <div className="bg-[#0e1628] border border-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400">Forecasted (30 Days)</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{cash30Days} <span className="text-[10px] text-emerald-500 font-normal">↑ 18%</span></div>
              </div>
              <div className="bg-[#0e1628] border border-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400">Forecasted (60 Days)</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{cash60Days} <span className="text-[10px] text-emerald-500 font-normal">↑ 28%</span></div>
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
                {receivables.map((r, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium text-slate-200">{r.party}</td>
                    <td className="text-emerald-400 font-bold">{formatAmount(r.amount)}</td>
                    <td className="text-amber-500">{r.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Upcoming Payables</h3>
            <ArrowDownToLine className="h-4 w-4 text-rose-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800"><th className="pb-2">Vendor / Contractor</th><th className="pb-2">Amount Due</th><th className="pb-2">Due Date</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {payables.map((r, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium text-slate-200">{r.party}</td>
                    <td className="text-rose-400 font-bold">{formatAmount(r.amount)}</td>
                    <td className="text-slate-400">{r.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={aiSuggestions.length > 0 ? aiSuggestions : ["Why profit margin decreased?", "Least profitable project", "Year-end profit forecast"]} />
    </div>
  );
}
