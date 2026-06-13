"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ArrowDownToLine, Tag, Landmark } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const expenseData = [
  { category: "Materials", value: 8.5, color: "#EF4444" },
  { category: "Labor / Subcontract", value: 5.2, color: "#F59E0B" },
  { category: "Equipment Rental", value: 2.8, color: "#3B82F6" },
  { category: "Site Overhead & Fuel", value: 1.5, color: "#10B981" },
  { category: "Office Admin", value: 0.8, color: "#8B5CF6" },
];

export default function ExpensesLedger() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">EXPENSES LEDGER</h2>
        <p className="text-xs text-slate-400">Review corporate expense distribution, site operating costs, administrative overheads, and vendor payments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 grid place-items-center">
            <ArrowDownToLine className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Expenses MTD</div>
            <div className="text-xl font-bold text-white">₹18.8 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Largest Expense Category</div>
            <div className="text-xl font-bold text-white">Materials (45.2%)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Operational Margin</div>
            <div className="text-xl font-bold text-emerald-400">23.6%</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Expense Categories Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-1 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Expenses by Category</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseData} dataKey="value" nameKey="category" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">₹18.8C</span>
                <span className="text-[8px] text-slate-400">Total Spent</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4 text-[9px]">
              {expenseData.map((item) => (
                <div key={item.category} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-350">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Ledger Table */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Transactions & Disbursals</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Voucher No</th>
                  <th className="pb-2">Beneficiary</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["EXP-2026-981", "Ultratech Cement Corp", "Materials", "₹48.0 L", "05 Jun 2026"],
                  ["EXP-2026-979", "Apex Subcontracting", "Labor / Subcontract", "₹22.5 L", "04 Jun 2026"],
                  ["EXP-2026-975", "L&T Equipment Rentals", "Equipment Rental", "₹14.2 L", "02 Jun 2026"],
                  ["EXP-2026-972", "Bharat Petroleum Co", "Site Overhead & Fuel", "₹8.5 L", "01 Jun 2026"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-slate-400">{row[0]}</td>
                    <td className="text-slate-200 font-semibold">{row[1]}</td>
                    <td className="text-slate-350">{row[2]}</td>
                    <td className="text-rose-450 text-rose-450 text-rose-400 font-bold">{row[3]}</td>
                    <td className="text-slate-400">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["List top overhead drivers", "Which site has highest fuel expense?", "Verify invoice EXP-2026-981"]} />
    </div>
  );
}
