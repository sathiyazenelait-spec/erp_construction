"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowDownToLine, Truck, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const agingData = [
  { range: "0-15 Days", amount: 1.8 },
  { range: "16-30 Days", amount: 1.2 },
  { range: "31-45 Days", amount: 0.6 },
  { range: "45+ Days", amount: 0.3 },
];

export default function Payables() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">PAYABLES (AP)</h2>
        <p className="text-xs text-slate-400">Track vendor obligations, subcontractor bill approvals, material payments, and payouts schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 grid place-items-center">
            <ArrowDownToLine className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Payables</div>
            <div className="text-xl font-bold text-white">₹3.9 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Active Vendors</div>
            <div className="text-xl font-bold text-white">28 Vendors</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Urgent Payables</div>
            <div className="text-xl font-bold text-amber-400">₹48 L</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payables Aging */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Payables Aging Analysis</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="range" type="category" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="amount" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Outstanding Payables Table */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Vendor Outstandings & Bills</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Vendor Name</th>
                  <th className="pb-2">Material / Service</th>
                  <th className="pb-2">Amount Due</th>
                  <th className="pb-2">Due Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["Cement Supplier Corp", "Cement Supply", "₹48 L", "In 7 Days", "Critical"],
                  ["Global Steel Inc", "TMT Bars", "₹62 L", "In 15 Days", "On Track"],
                  ["MEP Contracting Ltd", "Electrical Works", "₹22 L", "In 21 Days", "On Track"],
                  ["Precast Structure Ltd", "Concrete Blocks", "₹35 L", "In 25 Days", "On Track"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-slate-200">{row[0]}</td>
                    <td className="text-slate-350">{row[1]}</td>
                    <td className="text-rose-400 font-bold">{row[2]}</td>
                    <td className="text-slate-400 font-semibold">{row[3]}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        row[4] === "Critical" 
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {row[4]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimize payable terms", "When is the next bulk steel payment?", "Pending subcontractor bills"]} />
    </div>
  );
}
