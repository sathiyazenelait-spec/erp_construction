"use client";
import React from "react";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const topRisks = [
  { id: "risk-1", category: "Financial", description: "Increase in steel and cement procurement indexes.", impact: "High", mitigation: "Pre-order raw material with fixed pricing options." },
  { id: "risk-2", category: "Operational", description: "Labour shortage at Commercial Complex site.", impact: "Medium", mitigation: "Subcontract workforce assignment via local recruitment hubs." },
  { id: "risk-3", category: "Regulatory", description: "Pending approvals for Coimbatore branch opening.", impact: "Low", mitigation: "Compliance desk coordinating with local municipality authorities." },
];

export default function RiskManagement() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">09. RISK MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Identify, monitor, and mitigate active operational and financial risks</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Logged Risks</div>
            <div className="text-2xl font-bold text-white mt-1">8 Risks</div>
            <div className="text-[10px] text-emerald-400 mt-1">3 mitigated this month</div>
          </div>
          <AlertCircle className="h-8 w-8 text-blue-500/20" />
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Critical Threats</div>
            <div className="text-2xl font-bold text-red-400 mt-1">1 Critical</div>
            <div className="text-[10px] text-slate-500 mt-1">Steel procurement spikes</div>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-500/20 animate-pulse" />
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Mitigation Rate</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">87.5%</div>
            <div className="text-[10px] text-emerald-400 mt-1">Optimal recovery rating</div>
          </div>
          <CheckCircle2 className="h-8 w-8 text-emerald-500/20" />
        </div>
      </div>

      {/* Risks Directory */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Operational Risk Register</h3>
        <div className="space-y-4">
          {topRisks.map((risk, idx) => (
            <div key={idx} className="bg-[#0e1628] border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    risk.impact === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    risk.impact === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {risk.impact} Impact
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{risk.category}</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-relaxed">{risk.description}</h4>
                <p className="text-xs text-slate-400 leading-relaxed"><span className="text-emerald-400 font-bold">Mitigation Strategy:</span> {risk.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIAssistantBar suggestions={["Mitigation timelines", "Detail cost risk calculations", "Contractor performance records"]} />
    </div>
  );
}
