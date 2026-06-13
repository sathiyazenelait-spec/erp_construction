"use client";
import React from "react";
import { Users, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const teamPerformance = [
  { name: "Arun Kumar", leads: 312, proposals: 45, wins: 12, value: "₹ 28.4 Cr", achieved: 126 },
  { name: "Priya Sharma", leads: 299, proposals: 38, wins: 9, value: "₹ 22.7 Cr", achieved: 108 },
  { name: "Vijay Prakash", leads: 245, proposals: 30, wins: 7, value: "₹ 18.5 Cr", achieved: 100 },
  { name: "Karthik S", leads: 190, proposals: 26, wins: 8, value: "₹ 16.5 Cr", achieved: 92 },
  { name: "Sneha Reddy", leads: 154, proposals: 22, wins: 5, value: "₹ 11.2 Cr", achieved: 88 },
];

export default function TeamPerformance() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">13. TEAM PERFORMANCE</h2>
        <p className="text-xs text-slate-400">Track and review sales team quotas, individual win values, and leads allocations</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Team Members</div>
          <div className="text-2xl font-bold text-white mt-1">15 Members</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Active This Month</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">15 Members</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Top Performer</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">Arun Kumar</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Team Achievement</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">118%</div>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">BDD Executive Leaderboard</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Team Member</th>
                <th className="p-3 font-semibold text-center">Leads</th>
                <th className="p-3 font-semibold text-center">Proposals</th>
                <th className="p-3 font-semibold text-center">Wins</th>
                <th className="p-3 font-semibold">Value (₹)</th>
                <th className="p-3 font-semibold rounded-r-lg text-center">Achievement %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {teamPerformance.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                    {t.name}
                  </td>
                  <td className="p-3 text-center text-slate-300 font-bold">{t.leads}</td>
                  <td className="p-3 text-center font-semibold text-slate-300">{t.proposals}</td>
                  <td className="p-3 text-center font-bold text-white">{t.wins}</td>
                  <td className="p-3 font-semibold text-white">{t.value}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      t.achieved >= 100 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {t.achieved}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimise lead routing", "Incentive reports", "Quarterly sales goals"]} />
    </div>
  );
}
