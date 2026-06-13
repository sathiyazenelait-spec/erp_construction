"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Hammer, AlertTriangle, Layers } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const materialConsumption = [
  { item: "Cement", Planned: 1000, Actual: 1250 },
  { item: "Steel", Planned: 150, Actual: 145 },
  { item: "Sand", Planned: 350, Actual: 380 },
  { item: "Bricks", Planned: 80, Actual: 95 }, // in thousands
  { item: "Aggregate", Planned: 200, Actual: 210 },
];

export default function MaterialTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">05. MATERIAL TRACKING</h2>
        <p className="text-xs text-slate-400">Track cement bag stocks, structural steel tons, sand reserves, brick counts, and aggregate loads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Total Materials Tracked</div>
            <div className="text-xl font-bold text-white mt-1">245 Types</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Hammer className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Material Items in Stock</div>
            <div className="text-xl font-bold text-white mt-1">120 Items</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Low Stock Warnings</div>
            <div className="text-xl font-bold text-amber-400 mt-1">18 Items</div>
          </div>
        </div>
      </div>

      {/* Consumption Bar Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Material Consumption vs Planned Estimates (MTD)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={materialConsumption} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="item" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Bar name="Planned" dataKey="Planned" fill="#1E293B" stroke="#3B82F6" strokeWidth={1} radius={[4, 4, 0, 0]} />
              <Bar name="Actual" dataKey="Actual" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Stock Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Stock Ledger & Storage Logs</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Material Category</th>
                <th className="pb-2">In Stock Balances</th>
                <th className="pb-2">Storage Site Yard</th>
                <th className="pb-2">Reorder Threshold</th>
                <th className="pb-2">Safety Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["Cement Bags (Ultratech)", "1,250 Bags", "Yard A - Chennai", "500 Bags", "Safe"],
                ["Structural Steel (TMT)", "145 Tons", "Yard B - Coimbatore", "150 Tons", "Critical Low"],
                ["Fine River Sand", "380 Loads", "Yard C - Chennai", "100 Loads", "Safe"],
                ["Red Clay Bricks", "95,000 Nos", "Yard D - Madurai", "20,000 Nos", "Safe"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                  <td className="text-white font-bold">{row[1]}</td>
                  <td className="text-slate-400">{row[2]}</td>
                  <td className="text-slate-350">{row[3]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[4] === "Critical Low" 
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

      <AIAssistantBar suggestions={["Create reorder request for Steel", "Find materials matching Yard A", "Show daily sand receipts"]} />
    </div>
  );
}
