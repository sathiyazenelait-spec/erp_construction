"use client";
import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileEdit, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const coStatus = [
  { name: "Approved", value: 16, color: "#10B981" },
  { name: "Pending", value: 6, color: "#F59E0B" },
  { name: "Rejected", value: 2, color: "#EF4444" },
];

const INITIAL_CHANGES = [
  { id: "co-24", project: "Phoenix Commercial Complex", desc: "Additional Foundation Works", amount: "₹ 12.3 Lakhs", status: "Approved" },
  { id: "co-23", project: "Greenfield Apartments", desc: "Premium Tile Upgrades", amount: "₹ 8.2 Lakhs", status: "Pending" },
  { id: "co-22", project: "IT Park Phase - 1", desc: "Extra Cable Racks Installation", amount: "₹ 5.4 Lakhs", status: "Pending" },
  { id: "co-21", project: "Skyline Residences", desc: "Clubhouse Facade Design change", amount: "₹ 7.8 Lakhs", status: "Approved" },
];

export default function ChangeOrders() {
  const [changes, setChanges] = useState(INITIAL_CHANGES);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">10. CHANGE ORDERS</h2>
        <p className="text-xs text-slate-400">Track and approve project modifications, design variations, and budget revisions</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Change Orders</div>
          <div className="text-2xl font-bold text-white mt-1">24 COs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Approved</div>
          <div className="text-2xl font-bold text-emerald-450 text-emerald-400 mt-1">16 COs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Pending</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">6 COs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Rejected</div>
          <div className="text-2xl font-bold text-red-400 mt-1">2 COs</div>
        </div>
      </div>

      {/* Charts & Lists Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Status donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Change Orders by Status</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={coStatus} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {coStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">24</span>
                <span className="text-[8px] text-slate-400">Total COs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change orders table log */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Change Orders Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-350">
              <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 font-semibold rounded-l-lg">ID</th>
                  <th className="p-3 font-semibold">Project</th>
                  <th className="p-3 font-semibold">Description</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {changes.map((co, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/40">
                    <td className="p-3 font-bold text-white">{co.id}</td>
                    <td className="p-3 text-slate-205 font-medium">{co.project}</td>
                    <td className="p-3 text-slate-300">{co.desc}</td>
                    <td className="p-3 font-semibold text-white">{co.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        co.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        co.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {co.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Detailed change description", "Audit active changes list", "Verify variation budgets"]} />
    </div>
  );
}
