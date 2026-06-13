"use client";
import React from "react";
import { ShieldCheck, Heart, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function SafetyMonitoring() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">08. SAFETY MONITORING</h2>
        <p className="text-xs text-slate-400">Track corporate safe hours, compliance checklists, site incidents, and safety certifications</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">Safety Score Average</div>
            <div className="text-2xl font-bold text-white mt-1">94%</div>
            <div className="text-[10px] text-slate-550 text-slate-400 mt-1">Class-A Standard</div>
          </div>
          <ShieldCheck className="h-8 w-8 text-blue-500/20" />
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Safe Hours</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">4.5 Lakhs</div>
          <div className="text-[10px] text-slate-500 mt-1">Zero critical events logged</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Compliance Pass Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">100% Pass</div>
          <div className="text-[10px] text-emerald-450 text-slate-450 mt-1">ISO Safety Audit Met</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Incident Rate</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">0.12%</div>
          <div className="text-[10px] text-emerald-400 mt-1">↓ 0.04% vs Apr 2025</div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Regulatory Compliance Inspections</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#0e1628] border border-slate-800">
            <span className="text-slate-350">1. Scaffold erection certification</span>
            <span className="text-emerald-400 font-bold">Verified (All Sites)</span>
          </div>
          <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#0e1628] border border-slate-800">
            <span className="text-slate-350">2. Personal Protective Equipment (PPE) checks</span>
            <span className="text-emerald-400 font-bold">Verified (All Sites)</span>
          </div>
          <div className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#0e1628] border border-slate-800">
            <span className="text-slate-350">3. Material storage audits</span>
            <span className="text-amber-400 font-bold">Pending Review (Phoenix site)</span>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Compliance checklists", "Safety logs history", "Material checks reports"]} />
    </div>
  );
}
