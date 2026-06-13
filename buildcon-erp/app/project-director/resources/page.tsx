"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Hammer, Boxes, AlertCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const labourAllocation = [
  { name: "Skyline Residences", value: 120, color: "#3B82F6" },
  { name: "Greenfield Apartments", value: 95, color: "#10B981" },
  { name: "Phoenix Commercial Complex", value: 80, color: "#F59E0B" },
  { name: "IT Park Phase - 1", value: 65, color: "#8B5CF6" },
  { name: "Others", value: 60, color: "#64748B" },
];

const equipmentAllocation = [
  { name: "Excavators", count: "8/10", pct: 80 },
  { name: "Transit Mixers", count: "6/8", pct: 75 },
  { name: "Tower Cranes", count: "4/5", pct: 80 },
  { name: "Loaders", count: "3/5", pct: 60 },
  { name: "Piling Rigs", count: "2/3", pct: 66 },
];

export default function ResourceAllocation() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">05. RESOURCE ALLOCATION</h2>
        <p className="text-xs text-slate-400">Manage labour deployment, machinery capacities, and inventory availability</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Labour Force</div>
          <div className="text-2xl font-bold text-white mt-1">420</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Labour Deployed</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">392</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Equipment Deployed</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">32 Items</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Material Availability</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">85%</div>
        </div>
      </div>

      {/* Content Chart & Equipment List */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Labour chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Labour Allocation by Project</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={labourAllocation} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {labourAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">392</span>
                <span className="text-[8px] text-slate-400">Deployed</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-[9px]">
              {labourAllocation.map((la, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: la.color }}></span>
                  <span className="text-slate-450 text-slate-400">{la.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment list */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Equipment Allocation</h3>
          <div className="space-y-3">
            {equipmentAllocation.map((eq, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-350">{eq.name}</span>
                  <span className="text-white font-bold">{eq.count} active</span>
                </div>
                <div className="h-2 bg-[#0E1726] rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${eq.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimise machine allocation", "Track idle equipment", "Labour deployment logs"]} />
    </div>
  );
}
