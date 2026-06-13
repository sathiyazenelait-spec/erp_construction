"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Calculator, AlertCircle, ShieldAlert } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const projectCostData = [
  { name: "IT Park Chennai", Budget: 45.0, Actual: 42.5 },
  { name: "Villa Coimbatore", Budget: 28.0, Actual: 29.8 },
  { name: "Mall Bengaluru", Budget: 85.0, Actual: 78.4 },
  { name: "Metro Madurai", Budget: 62.0, Actual: 58.2 },
];

export default function ProjectCostControl() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">PROJECT COST CONTROL</h2>
        <p className="text-xs text-slate-400">Perform comparison between allocated project budgets and actual expenditures incurred to date.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Active Budget</div>
            <div className="text-xl font-bold text-white">₹220.0 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Actual Spent To Date</div>
            <div className="text-xl font-bold text-white">₹208.9 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 grid place-items-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Overruns Triggered</div>
            <div className="text-xl font-bold text-rose-450 text-rose-450 text-rose-400">1 Project</div>
          </div>
        </div>
      </div>

      {/* Comparative chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Budget vs Actual Cost (in Cr)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectCostData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Bar name="Budget" dataKey="Budget" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar name="Actual" dataKey="Actual" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project details table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Site Wise Variance Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Project</th>
                <th className="pb-2">Total Budget</th>
                <th className="pb-2">Actual Exp</th>
                <th className="pb-2">Variance</th>
                <th className="pb-2">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["IT Park Chennai", "₹45.0 Cr", "₹42.5 Cr", "₹2.5 Cr Under", "Under Budget"],
                ["Villa Community Coimbatore", "₹28.0 Cr", "₹29.8 Cr", "₹1.8 Cr Over", "Over Budget"],
                ["Mall Bengaluru", "₹85.0 Cr", "₹78.4 Cr", "₹6.6 Cr Under", "Under Budget"],
                ["Metro Rail Madurai", "₹62.0 Cr", "₹58.2 Cr", "₹3.8 Cr Under", "Under Budget"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-slate-350">{row[2]}</td>
                  <td className={row[3].includes("Over") ? "text-rose-450 text-rose-450 text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                    {row[3]}
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[4] === "Over Budget" 
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

      <AIAssistantBar suggestions={["Why Coimbatore project is over budget?", "Which items caused overruns?", "Alert project directors"]} />
    </div>
  );
}
