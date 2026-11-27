"use client";
import React, { useState, useEffect } from "react";
import { Users, Award, TrendingUp, CheckCircle2, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function TeamPerformance() {
  const [teamPerformance, setTeamPerformance] = useState<any[]>([
    { id: 1, name: "Arun Kumar", leads: 312, proposals: 45, wins: 12, value: "₹ 28.4 Cr", achieved: 126 },
    { id: 2, name: "Priya Sharma", leads: 299, proposals: 38, wins: 9, value: "₹ 22.7 Cr", achieved: 108 },
    { id: 3, name: "Vijay Prakash", leads: 245, proposals: 30, wins: 7, value: "₹ 18.5 Cr", achieved: 100 },
    { id: 4, name: "Karthik S", leads: 190, proposals: 26, wins: 8, value: "₹ 16.5 Cr", achieved: 92 },
    { id: 5, name: "Sneha Reddy", leads: 154, proposals: 22, wins: 5, value: "₹ 11.2 Cr", achieved: 88 },
  ]);

  const [kpi, setKpi] = useState({
    totalMembers: "15 Members",
    activeMembers: "15 Members",
    topPerformer: "Arun Kumar",
    teamAchievement: "118%"
  });

  const [loading, setLoading] = useState(false);
  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/team/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.team) setTeamPerformance(data.team);
        if (data.kpi) setKpi(data.kpi);
      }
    } catch (err) {
      console.warn("Backend team fetch failed, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">13. TEAM PERFORMANCE</h2>
          <p className="text-xs text-slate-400">Track and review sales team quotas, individual win values, and leads allocations</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Team Members</div>
          <div className="text-2xl font-bold text-white mt-1">{kpi.totalMembers}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Active This Month</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{kpi.activeMembers}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Top Performer</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{kpi.topPerformer}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Team Achievement</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">{kpi.teamAchievement}</div>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">BDD Executive Leaderboard ({teamPerformance.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Team Member</th>
                <th className="p-3 font-semibold text-center">Leads Handled</th>
                <th className="p-3 font-semibold text-center">Proposals Sent</th>
                <th className="p-3 font-semibold text-center">Deals Won</th>
                <th className="p-3 font-semibold text-right">Won Value</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">Quota Achieved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {teamPerformance.map((m, idx) => (
                <tr key={m.id || idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>{m.name}</span>
                  </td>
                  <td className="p-3 text-center text-slate-300">{m.leads}</td>
                  <td className="p-3 text-center text-slate-300">{m.proposals}</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">{m.wins}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">{m.value}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.achieved >= 100 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {m.achieved}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Team member bonus distribution", "Reallocate lead pipelines", "Top performers breakdown"]} />
    </div>
  );
}
