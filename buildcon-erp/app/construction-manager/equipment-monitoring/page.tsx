"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { HardDrive, Settings, AlertCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const equipmentStatus = [
  { name: "Active", value: 32, color: "#10B981" },
  { name: "Idle", value: 8, color: "#3B82F6" },
  { name: "Maintenance", value: 3, color: "#F59E0B" },
  { name: "Breakdown", value: 2, color: "#EF4444" },
];

export default function EquipmentMonitoring() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">06. EQUIPMENT MONITORING</h2>
        <p className="text-xs text-slate-400">Monitor active heavy machinery, equipment utilization metrics, diagnostic codes, and maintenance schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Total Machinery Units</div>
          <div className="text-xl font-bold text-white mt-1">45 Units</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Active Deployments</div>
          <div className="text-xl font-bold text-emerald-450 text-emerald-400 mt-1">32 Units (71%)</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Under Maintenance</div>
          <div className="text-xl font-bold text-amber-400 mt-1">3 Units</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Breakdowns Reported</div>
          <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400 mt-1">2 Units</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Status Donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Equipment Fleet Status</h3>
            <div className="space-y-2 text-[10px]">
              {equipmentStatus.map((eq) => (
                <div key={eq.name} className="flex items-center justify-between text-slate-355 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: eq.color }} />
                    <span>{eq.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{eq.value} ({Math.round(eq.value/45*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={equipmentStatus} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {equipmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white font-mono">45</span>
              <span className="text-[7px] text-slate-400 uppercase">Total Units</span>
            </div>
          </div>
        </div>

        {/* Maintenance scheduler */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-450 text-amber-400" />
            Upcoming Maintenance & Breakdowns
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Equipment ID</th>
                  <th className="pb-2">Machinery Type</th>
                  <th className="pb-2">Allocated Site</th>
                  <th className="pb-2">Diagnostics / Status</th>
                  <th className="pb-2">Scheduled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["EQ-102", "Liebherr Tower Crane 150", "Site A - Chennai", "Hydraulics Check", "30 May 2025"],
                  ["EQ-104", "CAT Hydraulic Excavator 320", "Site C - Chennai", "Engine Breakdown", "Immediate (Repairs)"],
                  ["EQ-108", "Mobile Concrete Mixer Truck", "Site B - Coimbatore", "Routine Service", "05 Jun 2025"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-white">{row[0]}</td>
                    <td className="text-slate-200">{row[1]}</td>
                    <td className="text-slate-400">{row[2]}</td>
                    <td className={row[3].includes("Breakdown") ? "text-rose-400 font-semibold animate-pulse" : "text-slate-350"}>
                      {row[3]}
                    </td>
                    <td className="text-slate-400">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Schedule breakdown repairs for EQ-104", "Report machinery idling details", "Export diagnostic logs"]} />
    </div>
  );
}
