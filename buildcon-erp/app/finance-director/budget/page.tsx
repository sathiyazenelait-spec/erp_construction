"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart3, Coins, PieChart as PieIcon } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const budgetData = [
  { dept: "Civil Works", Allocated: 80, Consumed: 72 },
  { dept: "Machinery Rental", Allocated: 40, Consumed: 38 },
  { dept: "Procurement", Allocated: 50, Consumed: 48 },
  { dept: "Site Admin", Allocated: 20, Consumed: 15 },
  { dept: "Taxes & Levies", Allocated: 15, Consumed: 14 },
];

export default function BudgetMonitoring() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">BUDGET MONITORING</h2>
        <p className="text-xs text-slate-400">Allocate and monitor budget performance, check department-wise limits, and consumption metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">FY26 Overall Budget</div>
            <div className="text-xl font-bold text-white">₹205 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Budget Consumed</div>
            <div className="text-xl font-bold text-white">₹187 Cr (91.2%)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <PieIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Remaining Balance</div>
            <div className="text-xl font-bold text-white">₹18 Cr</div>
          </div>
        </div>
      </div>

      {/* Budget consumption chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Wise Budget Consumption (in Cr)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="dept" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Bar name="Allocated" dataKey="Allocated" fill="#1E293B" radius={[4, 4, 0, 0]} stroke="#3B82F6" strokeWidth={1} />
              <Bar name="Consumed" dataKey="Consumed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Threshold warnings */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Budget Alert Metrics</h3>
        <div className="space-y-3">
          {[
            { dept: "Civil Works Chennai Project", limit: "90%", consumed: "₹72 L", status: "Nearing Limit" },
            { dept: "Machinery Rentals Site B", limit: "95%", consumed: "₹38 L", status: "Critical" },
            { dept: "Site Admin Madurai Office", limit: "75%", consumed: "₹15 L", status: "Healthy" }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-[#0e1628] border border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-200">{item.dept}</span>
                <span className="text-slate-400 ml-2">({item.limit} consumed)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-white">{item.consumed}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  item.status === "Critical" 
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                    : item.status === "Nearing Limit"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIAssistantBar suggestions={["Release extra budget for Civil Works", "Which department has highest budget deficit?", "Alert managers about over-consumption"]} />
    </div>
  );
}
