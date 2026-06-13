"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowUpFromLine, Users, BellRing } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const agingData = [
  { range: "0-30 Days", amount: 2.8 },
  { range: "31-60 Days", amount: 1.5 },
  { range: "61-90 Days", amount: 0.9 },
  { range: "90+ Days", amount: 0.4 },
];

export default function Receivables() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">RECEIVABLES (AR)</h2>
        <p className="text-xs text-slate-400">Manage pending client receipts, invoice payment progress, aging accounts, and collections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <ArrowUpFromLine className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Outstanding</div>
            <div className="text-xl font-bold text-white">₹5.6 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Active Debtors</div>
            <div className="text-xl font-bold text-white">12 Clients</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 grid place-items-center">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Overdue (60+ Days)</div>
            <div className="text-xl font-bold text-amber-400">₹1.3 Cr</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Receivables Aging */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Receivables Aging Analysis</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="range" type="category" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Outstanding Table */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Client Wise Outstanding Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Client Name</th>
                  <th className="pb-2">Invoice Amount</th>
                  <th className="pb-2">Outstanding</th>
                  <th className="pb-2">Days Overdue</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["ABC Builders", "₹2.5 Cr", "₹1.2 Cr", "45 Days", "Remind"],
                  ["XYZ Developers", "₹1.8 Cr", "₹85 L", "30 Days", "Remind"],
                  ["Villa Client Partner", "₹50 L", "₹32 L", "15 Days", "Remind"],
                  ["Metro Rail Corp", "₹3.0 Cr", "₹2.1 Cr", "8 Days", "Remind"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-slate-200">{row[0]}</td>
                    <td className="text-slate-350">{row[1]}</td>
                    <td className="text-emerald-400 font-bold">{row[2]}</td>
                    <td className="text-amber-500 font-semibold">{row[3]}</td>
                    <td>
                      <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-semibold transition">
                        {row[4]}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Create collection reminder letter template", "Who has the longest outstanding balance?", "Forecast incoming AR for June"]} />
    </div>
  );
}
