"use client";
import React from "react";
import { ShoppingCart, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const procurementLog = [
  { id: "po-101", item: "TMT Steel Reinforcement", vendor: "Tata Tiscon", quantity: "150 Tons", amount: "₹ 45.0 Lakhs", status: "Delivered" },
  { id: "po-102", item: "OPC Cement 53 Grade", vendor: "UltraTech Cement", quantity: "2500 Bags", amount: "₹ 12.5 Lakhs", status: "In Transit" },
  { id: "po-103", item: "Ready Mix Concrete (RMC)", vendor: "L&T Concrete", quantity: "450 Cub.m", amount: "₹ 18.0 Lakhs", status: "Approved" },
];

export default function ProcurementOverview() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">07. PROCUREMENT OVERVIEW</h2>
        <p className="text-xs text-slate-400">Inventory levels, active vendor contracts, purchase order values, and logistic schedules</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">PO Value (MTD)</div>
            <div className="text-2xl font-bold text-white mt-1">₹ 75.5 Lakhs</div>
            <div className="text-[10px] text-emerald-400 mt-1">3 active vendor profiles</div>
          </div>
          <ShoppingCart className="h-8 w-8 text-blue-500/20" />
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Inventory Capacity</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">84% Optimal</div>
            <div className="text-[10px] text-slate-500 mt-1">Ready stock for 30 days</div>
          </div>
          <Layers className="h-8 w-8 text-emerald-500/20" />
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Vendor Compliance</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">96.8%</div>
            <div className="text-[10px] text-emerald-400 mt-1">On-time delivery average</div>
          </div>
          <CheckCircle2 className="h-8 w-8 text-blue-500/20" />
        </div>
      </div>

      {/* Procurement table log */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Material Purchase Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/80 text-slate-405 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">PO Code</th>
                <th className="p-3 font-semibold">Material Item</th>
                <th className="p-3 font-semibold">Vendor</th>
                <th className="p-3 font-semibold">Quantity</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {procurementLog.map((po, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-bold text-white">{po.id}</td>
                  <td className="p-3 text-slate-205 font-medium">{po.item}</td>
                  <td className="p-3 text-slate-300">{po.vendor}</td>
                  <td className="p-3 text-slate-400">{po.quantity}</td>
                  <td className="p-3 font-semibold text-white">{po.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      po.status === "Delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      po.status === "In Transit" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Compare steel pricing", "Show vendor compliance reports", "Verify material deliveries", "Inventory alerts"]} />
    </div>
  );
}
