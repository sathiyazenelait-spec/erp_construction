"use client";
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { CreditCard, Landmark, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const revenueTrend = [
  { m: "Jan", r: 18.2, e: 14.1 },
  { m: "Feb", r: 19.5, e: 15.0 },
  { m: "Mar", r: 20.8, e: 15.9 },
  { m: "Apr", r: 22.0, e: 16.8 },
  { m: "May", r: 23.4, e: 17.9 },
  { m: "Jun", r: 24.5, e: 18.7 },
];

const expenseBreakdown = [
  { name: "Direct Cost", value: 45.2, color: "#3B82F6" },
  { name: "Indirect Cost", value: 18.5, color: "#10B981" },
  { name: "Overheads", value: 12.3, color: "#8B5CF6" },
  { name: "Finance Cost", value: 9.8, color: "#F59E0B" },
  { name: "Marketing", value: 6.2, color: "#EC4899" },
  { name: "Others", value: 8.0, color: "#64748B" },
];

const cashFlowForecast = [
  { month: "Jun", Inflow: 25.5, Outflow: 18.8 },
  { month: "Jul", Inflow: 28.0, Outflow: 21.0 },
  { month: "Aug", Inflow: 24.0, Outflow: 19.5 },
  { month: "Sep", Inflow: 30.5, Outflow: 22.0 },
];

const receivablesAging = [
  { name: "< 30 Days", value: 5.2, color: "#10B981" },
  { name: "30-60 Days", value: 2.1, color: "#F59E0B" },
  { name: "> 60 Days", value: 0.9, color: "#EF4444" },
];

const payablesAging = [
  { name: "< 30 Days", value: 2.4, color: "#10B981" },
  { name: "30-60 Days", value: 0.8, color: "#F59E0B" },
  { name: "> 60 Days", value: 0.2, color: "#EF4444" },
];

export default function FinancialCommand() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">03. FINANCIAL COMMAND CENTER</h2>
        <p className="text-xs text-slate-400">Complete financial overview and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Revenue (YTD)</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 132.6 Cr</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 14% vs last year</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Net Profit (YTD)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹ 24.3 Cr</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 10% vs last year</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Gross Margin %</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">22.7%</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 2.1% vs target</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Cash Position</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 12.1 Cr</div>
          <div className="text-[10px] text-slate-400 mt-1">Available balance</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Working Capital</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">₹ 15.6 Cr</div>
          <div className="text-[10px] text-emerald-400 mt-1">Healthy liquidity ratio</div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Trend vs Expense */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Revenue vs Expense Trend</h3>
            <span className="text-[10px] text-slate-400 font-bold bg-[#1B2A4A] px-2 py-0.5 rounded border border-slate-700">₹ Cr</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="r" name="Revenue" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="e" name="Expense" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Expense Breakdown (YTD)</h3>
          <div className="flex items-center justify-around h-56">
            <div className="h-36 w-36 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseBreakdown} dataKey="value" innerRadius={36} outerRadius={54} paddingAngle={2}>
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-white">₹ 99.5 Cr</span>
                <span className="text-[8px] text-slate-400">Total Expense</span>
              </div>
            </div>
            <div className="space-y-1">
              {expenseBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-300 w-16 truncate">{item.name}</span>
                  <span className="text-[10px] font-semibold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Forecast & Aging */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cash Flow Forecast */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Cash Flow Forecast</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowForecast} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="Inflow" name="Expected In" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Outflow" name="Expected Out" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Receivables Aging */}
        <div className="bg-[#111A2E] border border-slate-850 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-2">Receivables Aging</h3>
          <div className="flex items-center justify-around h-36">
            <div className="h-28 w-28 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={receivablesAging} dataKey="value" innerRadius={28} outerRadius={42} paddingAngle={2}>
                    {receivablesAging.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-white">₹ 8.2 Cr</span>
                <span className="text-[8px] text-slate-400">Total</span>
              </div>
            </div>
            <div className="space-y-1">
              {receivablesAging.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-300">{item.name}</span>
                  <span className="text-[10px] font-semibold text-white">₹{item.value} Cr</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payables Aging */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-2">Payables Aging</h3>
          <div className="flex items-center justify-around h-36">
            <div className="h-28 w-28 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={payablesAging} dataKey="value" innerRadius={28} outerRadius={42} paddingAngle={2}>
                    {payablesAging.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-white">₹ 3.4 Cr</span>
                <span className="text-[8px] text-slate-400">Total</span>
              </div>
            </div>
            <div className="space-y-1">
              {payablesAging.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-300">{item.name}</span>
                  <span className="text-[10px] font-semibold text-white">₹{item.value} Cr</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profit & Loss Summary */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Profit & Loss Summary (YTD)</h3>
          <table className="w-full text-xs text-left text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2">Particulars</th>
                <th className="py-2 text-right">Value (₹ Cr)</th>
                <th className="py-2 text-right">% Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-2.5">Revenue</td>
                <td className="py-2.5 text-right text-white font-bold">132.6</td>
                <td className="py-2.5 text-right text-emerald-400 font-semibold">+14.0%</td>
              </tr>
              <tr>
                <td className="py-2.5">Direct Costs</td>
                <td className="py-2.5 text-right font-semibold">60.2</td>
                <td className="py-2.5 text-right text-emerald-400 font-semibold">+11.2%</td>
              </tr>
              <tr>
                <td className="py-2.5">Gross Profit</td>
                <td className="py-2.5 text-right text-white font-bold">72.4</td>
                <td className="py-2.5 text-right text-emerald-400 font-semibold">+16.5%</td>
              </tr>
              <tr>
                <td className="py-2.5">Overheads</td>
                <td className="py-2.5 text-right font-semibold">48.1</td>
                <td className="py-2.5 text-right text-red-400 font-semibold">+18.0%</td>
              </tr>
              <tr>
                <td className="py-2.5">Net Profit</td>
                <td className="py-2.5 text-right text-emerald-400 font-bold">24.3</td>
                <td className="py-2.5 text-right text-emerald-400 font-semibold">+10.0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Top Cost Overruns */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Cost Overruns</h3>
          <table className="w-full text-xs text-left text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2">Project Name</th>
                <th className="py-2 text-right">Budget (₹ Cr)</th>
                <th className="py-2 text-right">Actual (₹ Cr)</th>
                <th className="py-2 text-right">Overrun (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-2.5 font-medium text-white">Commercial Complex</td>
                <td className="py-2.5 text-right">10.0</td>
                <td className="py-2.5 text-right">11.0</td>
                <td className="py-2.5 text-right text-red-400 font-bold">+1.0</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-white">Hospital Building</td>
                <td className="py-2.5 text-right">15.0</td>
                <td className="py-2.5 text-right">14.5</td>
                <td className="py-2.5 text-right text-emerald-400 font-bold">-0.5</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-white">IT Park Phase - I</td>
                <td className="py-2.5 text-right">7.5</td>
                <td className="py-2.5 text-right">6.9</td>
                <td className="py-2.5 text-right text-emerald-400 font-bold">-0.6</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Receivables aging report", "Expenses breakdown breakdown", "Project level profitability", "Q3 Cash forecasts"]} />
    </div>
  );
}
