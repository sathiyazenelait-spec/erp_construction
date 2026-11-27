"use client";
import React, { useState, useEffect } from "react";
import { Trophy, Award, TrendingUp, DollarSign, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function TargetsIncentives() {
  const [kpi, setKpi] = useState({
    targetRevenue: "₹ 15.0 Cr",
    achievedRevenue: "₹ 12.4 Cr (83%)",
    incentivesEarned: "₹ 2.45 Cr",
    teamLimit: "₹ 48.5 L"
  });

  const [monthlyProgress, setMonthlyProgress] = useState<any[]>([
    { title: "Projects Target", current: 10, target: 10, label: "10 / 10 Won (100%)", percent: 100, color: "emerald" },
    { title: "Revenue Target", current: 12.4, target: 15.0, label: "₹12.4 Cr / ₹15.0 Cr (83%)", percent: 83, color: "blue" },
    { title: "Qualified Leads Quota", current: 520, target: 600, label: "520 / 600 Leads (87%)", percent: 87, color: "amber" },
    { title: "Tenders Won Rate", current: 4, target: 5, label: "4 / 5 Won (80%)", percent: 80, color: "violet" },
  ]);

  const [loading, setLoading] = useState(false);
  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/targets/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.kpi) setKpi(data.kpi);
        if (data.progress) setMonthlyProgress(data.progress);
      }
    } catch (err) {
      console.warn("Backend targets fetch failed, using fallback:", err);
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
          <h2 className="text-xl font-bold text-white tracking-wide">12. TARGETS & INCENTIVES</h2>
          <p className="text-xs text-slate-400">Track company sales quotas, active incentive structures, and monthly milestones progress</p>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Target Revenue</div>
          <div className="text-2xl font-bold text-white mt-1">{kpi.targetRevenue}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Achieved Revenue</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{kpi.achievedRevenue}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Incentives Earned</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{kpi.incentivesEarned}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Team Value Limit</div>
          <div className="text-2xl font-bold text-white mt-1">{kpi.teamLimit}</div>
        </div>
      </div>

      {/* Milestones and Structure */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Monthly Target Progress</h3>
          <div className="space-y-4 text-xs">
            {monthlyProgress.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-350">{m.title}</span>
                  <span className="font-bold text-white">{m.label}</span>
                </div>
                <div className="h-2 bg-[#0E1726] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.color === "emerald" ? "bg-emerald-500" :
                      m.color === "blue" ? "bg-blue-500" :
                      m.color === "amber" ? "bg-amber-500" : "bg-violet-500"
                    }`}
                    style={{ width: `${Math.min(100, m.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incentive Structure */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Tiered Sales Commission Scheme</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#0e1628] rounded-lg border border-slate-850 flex justify-between items-center">
              <div>
                <span className="font-bold text-emerald-400 block">Tier 1: Up to ₹5.0 Cr</span>
                <span className="text-slate-400 text-[10px]">Standard institutional tender commission</span>
              </div>
              <span className="font-mono font-bold text-white">0.50%</span>
            </div>
            <div className="p-3 bg-[#0e1628] rounded-lg border border-slate-850 flex justify-between items-center">
              <div>
                <span className="font-bold text-blue-400 block">Tier 2: ₹5.0 Cr - ₹15.0 Cr</span>
                <span className="text-slate-400 text-[10px]">Commercial & high-rise contracts</span>
              </div>
              <span className="font-mono font-bold text-white">0.85%</span>
            </div>
            <div className="p-3 bg-[#0e1628] rounded-lg border border-slate-850 flex justify-between items-center">
              <div>
                <span className="font-bold text-amber-400 block">Tier 3: Above ₹15.0 Cr</span>
                <span className="text-slate-400 text-[10px]">Mega turnkey infrastructure wins</span>
              </div>
              <span className="font-mono font-bold text-white">1.25%</span>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Calculate quarterly commission", "Team members near quota target", "Target simulation sandbox"]} />
    </div>
  );
}
