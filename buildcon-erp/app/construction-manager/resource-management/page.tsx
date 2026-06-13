"use client";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Users, ShieldCheck, HelpCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const resourceAllocation = [
  { name: "Engineers", value: 32, color: "#10B981" },
  { name: "Supervisors", value: 25, color: "#3B82F6" },
  { name: "Skilled Labour", value: 210, color: "#F59E0B" },
  { name: "Unskilled Labour", value: 210, color: "#8B5CF6" },
];

const availabilityData = [
  { role: "Engineers", Deployed: 32, Available: 5 },
  { role: "Supervisors", Deployed: 25, Available: 8 },
  { role: "Skilled", Deployed: 210, Available: 45 },
  { role: "Unskilled", Deployed: 210, Available: 80 },
];

export default function ResourceManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">03. RESOURCE MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Allocate site engineers, track labor headcount, request extra resource allocations, and monitor availability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Total Workers On-Site</div>
          <div className="text-xl font-bold text-white mt-1">420</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Active Engineers</div>
          <div className="text-xl font-bold text-white mt-1">32</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Supervisors Count</div>
          <div className="text-xl font-bold text-white mt-1">25</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Skilled / Unskilled</div>
          <div className="text-xl font-bold text-white mt-1">210 / 210</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Resource allocation pie */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Resource Allocation</h3>
            <div className="space-y-2 text-[10px]">
              {resourceAllocation.map((res) => (
                <div key={res.name} className="flex items-center justify-between text-slate-350">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: res.color }} />
                    <span>{res.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{res.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resourceAllocation} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {resourceAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white font-mono">477</span>
              <span className="text-[7px] text-slate-400 uppercase">Total Staff</span>
            </div>
          </div>
        </div>

        {/* Resource Availability Bar Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Resource Availability (Deployed vs Bench Reserves)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={availabilityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="role" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                <Bar name="Deployed" dataKey="Deployed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar name="Available" dataKey="Available" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resource Requests */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Pending Resource Requests Queue</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Request ID</th>
                <th className="pb-2">Resource Type</th>
                <th className="pb-2">Requested By</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Date Requested</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["REQ-105", "3x Heavy Cranes Operators", "Site Manager Chennai", "Approved", "28 May 2025"],
                ["REQ-106", "10x Masonry Workers", "Site Supervisor Coimbatore", "Requested", "28 May 2025"],
                ["REQ-107", "1x Electrical Quality Auditor", "QC Lead Madurai", "Pending", "27 May 2025"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-white">{row[0]}</td>
                  <td className="text-slate-200">{row[1]}</td>
                  <td className="text-slate-400">{row[2]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[3] === "Approved" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : row[3] === "Requested"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {row[3]}
                    </span>
                  </td>
                  <td className="text-slate-400">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Request 5 more carpenters for Site B", "List supervisors with zero allocations", "Examine overall availability limits"]} />
    </div>
  );
}
