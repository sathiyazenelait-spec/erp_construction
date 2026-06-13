"use client";
import React from "react";
import { Target, TrendingUp, ShieldAlert, Award, ArrowUpRight, BarChart2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const strategicGoals = [
  { name: "Revenue Growth", target: "₹ 500 Cr", progress: 60, color: "bg-blue-500" },
  { name: "Market Expansion", target: "Open 2 new branches", progress: 80, color: "bg-emerald-500" },
  { name: "Operational Excellence", target: "Improve productivity by 10%", progress: 50, color: "bg-amber-500" },
  { name: "Client Satisfaction", target: "Achieve a 4.8+ rating", progress: 92, color: "bg-pink-500" },
];

const strategicInitiatives = [
  { name: "Digital Transformation", owner: "Karthik R", timeline: "Dec 2025", progress: 65, status: "On Track" },
  { name: "Green Construction Certs", owner: "Priya Raj", timeline: "Aug 2025", progress: 85, status: "On Track" },
  { name: "Talent Acquisition", owner: "Vijay Kumar", timeline: "Oct 2025", progress: 40, status: "Delayed" },
  { name: "Vendor Consolidation", owner: "Amit Kumar", timeline: "Jul 2025", progress: 95, status: "On Track" },
  { name: "Ventures Fund", owner: "Board", timeline: "Mar 2026", progress: 15, status: "On Track" },
];

export default function StrategicPlanning() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">11. STRATEGIC PLANNING</h2>
        <p className="text-xs text-slate-400">Plan, track and execute strategy goals</p>
      </div>

      {/* Row 1: SWOT and Goals */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goals */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Strategic Goals (2025-2026)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {strategicGoals.map((g, idx) => (
              <div key={idx} className="p-4 bg-[#0E1726]/60 border border-slate-800/80 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] text-slate-450 text-slate-450 uppercase font-bold text-slate-400 tracking-wider">Goal #{idx+1}</div>
                    <div className="text-xs font-bold text-white mt-0.5">{g.name}</div>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold">{g.target}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Progress</span>
                    <span className="text-white">{g.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-850 rounded overflow-hidden">
                    <div className={`h-full rounded ${g.color}`} style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SWOT Analysis */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">SWOT Analysis</h3>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {/* Strengths */}
            <div className="p-2.5 rounded bg-emerald-950/10 border border-emerald-900/20">
              <div className="font-bold text-emerald-400 uppercase tracking-wide">Strengths</div>
              <ul className="list-disc list-inside text-slate-350 mt-1 space-y-0.5">
                <li>Experienced PMs</li>
                <li>Good reputation</li>
                <li>Cash stability</li>
              </ul>
            </div>
            {/* Weaknesses */}
            <div className="p-2.5 rounded bg-red-950/10 border border-red-900/20">
              <div className="font-bold text-red-400 uppercase tracking-wide">Weaknesses</div>
              <ul className="list-disc list-inside text-slate-350 mt-1 space-y-0.5">
                <li>High material costs</li>
                <li>Labour shortages</li>
                <li>Tech gaps</li>
              </ul>
            </div>
            {/* Opportunities */}
            <div className="p-2.5 rounded bg-blue-950/10 border border-blue-900/20">
              <div className="font-bold text-blue-400 uppercase tracking-wide">Opportunities</div>
              <ul className="list-disc list-inside text-slate-350 mt-1 space-y-0.5">
                <li>Green tech market</li>
                <li>Government infra</li>
                <li>AI ERP integration</li>
              </ul>
            </div>
            {/* Threats */}
            <div className="p-2.5 rounded bg-amber-950/10 border border-amber-900/20">
              <div className="font-bold text-amber-400 uppercase tracking-wide">Threats</div>
              <ul className="list-disc list-inside text-slate-350 mt-1 space-y-0.5">
                <li>Inflation risks</li>
                <li>Regulatory shifts</li>
                <li>Local competition</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Initiatives table */}
      <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Strategic Initiatives</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Initiative Name</th>
                <th className="p-3 font-semibold">Owner</th>
                <th className="p-3 font-semibold">Timeline</th>
                <th className="p-3 font-semibold">Progress</th>
                <th className="p-3 font-semibold rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {strategicInitiatives.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{item.name}</td>
                  <td className="p-3">{item.owner}</td>
                  <td className="p-3 text-slate-400">{item.timeline}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-slate-850 rounded-full w-24 overflow-hidden border border-slate-700/50">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] w-6 text-right">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === "Delayed" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Q4 milestone timeline", "Modify strategic targets", "Initiative budget utilization", "SWOT updates"]} />
    </div>
  );
}
