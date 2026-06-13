"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileCheck, AlertTriangle, ShieldCheck } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const qcCategoryData = [
  { name: "Concrete Strength", value: 45, color: "#10B981" },
  { name: "Steel Reinforcement", value: 30, color: "#3B82F6" },
  { name: "Masonry Alignment", value: 18, color: "#F59E0B" },
  { name: "Finishing & Plaster", value: 7, color: "#EF4444" },
];

export default function QualityControl() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">07. QUALITY CONTROL</h2>
        <p className="text-xs text-slate-400">Track structural QC inspections, compressive concrete tests, slab alignments, and supervisor approvals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">QC Inspections (MTD)</div>
          <div className="text-xl font-bold text-white mt-1">158 Checks</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Passed / Complied</div>
          <div className="text-xl font-bold text-emerald-450 text-emerald-400 mt-1">152 passed</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Failed / Gaps</div>
          <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400 mt-1">6 failures</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Pending Approvals</div>
          <div className="text-xl font-bold text-amber-400 mt-1">4 pending</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Inspections by Type</h3>
            <div className="space-y-2 text-[10px]">
              {qcCategoryData.map((qc) => (
                <div key={qc.name} className="flex items-center justify-between text-slate-355 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: qc.color }} />
                    <span>{qc.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{qc.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={qcCategoryData} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {qcCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failed items log */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            Active Non-Compliance & QC Failures
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Voucher ID</th>
                  <th className="pb-2">QC Category / Test</th>
                  <th className="pb-2">Active Site</th>
                  <th className="pb-2">Inspection Finding</th>
                  <th className="pb-2">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["QC-MIX-981", "Concrete Cube Strength Test", "Site C - Chennai", "Strength 18 N/mm² (Target 25)", "Recast Slab Block B"],
                  ["QC-STL-975", "Steel Reinforcement Check", "Site B - Coimbatore", "Binding spacing spacing > 200mm", "Re-bind structural steel"],
                  ["QC-MAS-970", "Brick Masonry Alignment", "Site D - Madurai", "Vertical deviation > 5mm", "Demolish and rebuild wall"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-white">{row[0]}</td>
                    <td className="text-slate-200">{row[1]}</td>
                    <td className="text-slate-400">{row[2]}</td>
                    <td className="text-rose-400 font-semibold">{row[3]}</td>
                    <td>
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
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

      <AIAssistantBar suggestions={["Export QC pass certificate template", "Suggest concrete strength correction steps", "Alert Site C engineer"]} />
    </div>
  );
}
