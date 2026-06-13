"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Clock, AlertTriangle, PlayCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const delayRiskData = [
  { name: "On Track", value: 14, color: "#10B981" },
  { name: "Delayed", value: 3, color: "#F59E0B" },
  { name: "Critical", value: 1, color: "#EF4444" },
];

export default function DelayManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">10. DELAY MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Identify risk hotspots, critical bottlenecks, materials and labor shortages, and execute mitigation workflows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Projects At Risk</div>
          <div className="text-xl font-bold text-white mt-1">3 Projects</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">High Risk Delays</div>
          <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400 mt-1">2 Sites</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Medium Risk Delays</div>
          <div className="text-xl font-bold text-amber-400 mt-1">1 Site</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Low Risk Delays</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">0 Sites</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Donut Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Delay Risk Overview</h3>
            <div className="space-y-2 text-[10px]">
              {delayRiskData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-slate-355 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={delayRiskData} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {delayRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white font-mono">18</span>
              <span className="text-[7px] text-slate-400 uppercase">Total Sites</span>
            </div>
          </div>
        </div>

        {/* Detailed Risk Table */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-450 text-amber-400" />
            Delay Risks & Mitigation Log
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Project</th>
                  <th className="pb-2">Delay Risk</th>
                  <th className="pb-2">Primary Cause</th>
                  <th className="pb-2">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["Phoenix Commercial", "82% Risk", "Material Shortage", "Expedite Delivery"],
                  ["IT Park Phase - 1", "65% Risk", "Design Changes", "Client Approval"],
                  ["Lakeview Villas", "45% Risk", "Labour Shortage", "Increase Labour"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-white">{row[0]}</td>
                    <td className="text-rose-400 font-bold">{row[1]}</td>
                    <td className="text-slate-300 font-medium">{row[2]}</td>
                    <td>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {row[3]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Suggest labor transfer between sites", "Analyze Phoenix Commercial delay factors", "Generate mitigation workflow report"]} />
    </div>
  );
}
