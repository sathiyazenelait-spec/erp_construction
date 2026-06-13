"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { FolderKanban, Star, Award } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const opportunitiesData = [
  { p: "IT Park Project - Chennai", v: 20.0, w: 70, stage: "Proposal" },
  { p: "Villa Community - ECR", v: 8.0, w: 60, stage: "Negotiation" },
  { p: "Government School - Trichy", v: 15.0, w: 65, stage: "Proposal" },
  { p: "Hospital Building - Madurai", v: 12.0, w: 40, stage: "Inquiry" },
];

export default function OpportunitiesOverview() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">03. OPPORTUNITIES</h2>
        <p className="text-xs text-slate-400">Track incoming client deals, estimates, and win probability matrices</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Pipeline Opportunities</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 55.0 Cr</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Weighted Value</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">₹ 35.8 Cr</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Average Win Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">58.7%</div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Pipeline Registry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Opportunity Project</th>
                <th className="p-3 font-semibold">Stage</th>
                <th className="p-3 font-semibold text-right">Value (₹ Cr)</th>
                <th className="p-3 font-semibold text-center">Probability</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">Weighted (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {opportunitiesData.map((o, idx) => {
                const weighted = ((o.v * o.w) / 100).toFixed(1);
                return (
                  <tr key={idx} className="hover:bg-slate-850/40">
                    <td className="p-3 font-medium text-white flex items-center gap-1.5">
                      <FolderKanban className="h-3.5 w-3.5 text-blue-400" />
                      {o.p}
                    </td>
                    <td className="p-3 text-slate-300">{o.stage}</td>
                    <td className="p-3 text-right font-mono text-white">₹ {o.v} Cr</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-400">{o.w}%</td>
                    <td className="p-3 text-right font-mono text-slate-300">₹ {weighted} Cr</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Detailed opportunities summaries", "Conversion projections MTD"]} />
    </div>
  );
}
