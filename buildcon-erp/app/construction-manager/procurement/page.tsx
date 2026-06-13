"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ShoppingCart, FileText, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const procurementPie = [
  { name: "Approved", value: 45, color: "#10B981" },
  { name: "In-Progress", value: 15, color: "#3B82F6" },
  { name: "Completed", value: 40, color: "#8B5CF6" },
];

export default function Procurement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">08. PROCUREMENT & REQUISITIONS</h2>
        <p className="text-xs text-slate-400">Review material requisitions (MR), active purchase orders (PO) logs, supplier delivery dates, and vendor performance audits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Total Site Requisitions</div>
          <div className="text-xl font-bold text-white mt-1">125 MRs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Open Purchase Orders</div>
          <div className="text-xl font-bold text-white mt-1">45 POs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Pending Approvals</div>
          <div className="text-xl font-bold text-amber-400 mt-1">35 POs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Overdue Deliveries</div>
          <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400 mt-1">5 Deliveries</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Procurement pie */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Requisitions Status</h3>
            <div className="space-y-2 text-[10px]">
              {procurementPie.map((proc) => (
                <div key={proc.name} className="flex items-center justify-between text-slate-355 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: proc.color }} />
                    <span>{proc.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{proc.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={procurementPie} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {procurementPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Purchase Orders table */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-emerald-450 text-emerald-450 text-emerald-400" />
            Recent Purchase Orders
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">PO ID</th>
                  <th className="pb-2">Vendor Name</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Order Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["PO-5287", "ABC Steel Corp", "₹7,45,000", "28 May 2025", "Open"],
                  ["PO-5286", "BuildCon Cement Ltd", "₹12,00,000", "28 May 2025", "In-Progress"],
                  ["PO-5280", "Sand Suppliers Inc", "₹85,000", "25 May 2025", "Completed"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-white">{row[0]}</td>
                    <td className="text-slate-200">{row[1]}</td>
                    <td className="text-emerald-400 font-bold">{row[2]}</td>
                    <td className="text-slate-400">{row[3]}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        row[4] === "Completed" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : row[4] === "In-Progress"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
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

      <AIAssistantBar suggestions={["Create material requisition for cement", "Suggest alternative steel vendors", "Track order PO-5286"]} />
    </div>
  );
}
