"use client";
import React from "react";
import { Trophy, Award, TrendingUp, DollarSign } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function TargetsIncentives() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">12. TARGETS & INCENTIVES</h2>
        <p className="text-xs text-slate-400">Track company sales quotas, active incentive structures, and monthly milestones progress</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Target Revenue</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 15.0 Cr</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Achieved Revenue</div>
          <div className="text-2xl font-bold text-emerald-450 text-emerald-400 mt-1">₹ 12.4 Cr (83%)</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Incentives Earned</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">₹ 2.45 Cr</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Team Value Limit</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 48.5 L</div>
        </div>
      </div>

      {/* Milestones and Structure */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Monthly Target Progress</h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-350">Projects Target</span>
                <span className="font-bold text-white">10 / 10 Won (100%)</span>
              </div>
              <div className="h-2 bg-[#0E1726] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-350">Win Rate Target</span>
                <span className="font-bold text-amber-400">12% / 15% (80%)</span>
              </div>
              <div className="h-2 bg-[#0E1726] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Incentive Structure</h3>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between p-2.5 rounded-lg bg-[#0e1628] border border-slate-850">
              <span>Achieved 80% - 90%</span>
              <span className="font-bold text-white">1.5% Incentives</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-[#0e1628] border border-slate-850">
              <span>Achieved 90% - 100%</span>
              <span className="font-bold text-emerald-400">3.0% Incentives</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-[#0e1628] border border-slate-850">
              <span>Above 100%</span>
              <span className="font-bold text-emerald-400">5.0% Incentives</span>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimise ad spends", "Review next quarter goals", "Forecast sales"]} />
    </div>
  );
}
