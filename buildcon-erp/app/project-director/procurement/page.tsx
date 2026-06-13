"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ShoppingCart, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const poStatus = [
  { name: "Delivered", value: 102, color: "#10B981" },
  { name: "In Transit", value: 28, color: "#3B82F6" },
  { name: "Pending", value: 18, color: "#F59E0B" },
  { name: "Delayed", value: 8, color: "#EF4444" },
];

const pendingMaterials = [
  { name: "Steel", qty: "120 MT" },
  { name: "Cement", qty: "3400 Bags" },
  { name: "Bricks", qty: "25,000 Nos" },
  { name: "Electrical Items", qty: "120 Lots" },
  { name: "Plumbing Items", qty: "80 Lots" },
];

export default function ProcurementTracking() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">06. PROCUREMENT TRACKING</h2>
        <p className="text-xs text-slate-400">Track purchase order lifecycles, active material requests, and vendor delays</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total POs</div>
          <div className="text-2xl font-bold text-white mt-1">156 POs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">PD Value</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">₹ 42.8 Cr</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">POs Delivered</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">102 (65%)</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Pending POs</div>
          <div className="text-2xl font-bold text-red-400 mt-1">54 POs</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* PO status donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">PO Status</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={poStatus} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {poStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">156</span>
                <span className="text-[8px] text-slate-400">Total POs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending materials list */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Pending Materials</h3>
          <div className="space-y-3 text-xs">
            {pendingMaterials.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628] border border-slate-800">
                <span className="text-slate-300 font-medium">{m.name}</span>
                <span className="text-white font-bold">{m.qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimize material orders", "Top delayed shipments", "Vendor compliance score"]} />
    </div>
  );
}
