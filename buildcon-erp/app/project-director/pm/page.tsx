"use client";
import React from "react";
import { Users, Award, Star, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const pmPerformance = [
  { name: "Rohit Kumar", projects: 4, onTime: 85, budget: 92, quality: 90, overall: 92 },
  { name: "Vijay Prakash", projects: 3, onTime: 75, budget: 88, quality: 85, overall: 88 },
  { name: "Karthik S", projects: 5, onTime: 70, budget: 85, quality: 80, overall: 85 },
  { name: "Suresh Babu", projects: 2, onTime: 90, budget: 95, quality: 93, overall: 95 },
  { name: "Arun Kumar", projects: 2, onTime: 80, budget: 90, quality: 90, overall: 90 },
];

export default function PMPerformance() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">03. PM PERFORMANCE</h2>
        <p className="text-xs text-slate-400">Review project manager execution scorecards, budget adherence, and quality pass rates</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total PMs</div>
          <div className="text-2xl font-bold text-white mt-1">8 PMs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Active Projects</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">18 Projects</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Average Performance</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">87%</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">On-Time Delivery</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">78%</div>
        </div>
      </div>

      {/* Scorecard Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Project Manager Leaderboard</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">PM Name</th>
                <th className="p-3 font-semibold text-center">Active Projects</th>
                <th className="p-3 font-semibold text-center">On-Time Delivery</th>
                <th className="p-3 font-semibold text-center">Budget Score</th>
                <th className="p-3 font-semibold text-center">Quality Score</th>
                <th className="p-3 font-semibold rounded-r-lg text-center">Overall Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {pmPerformance.map((pm, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-medium text-white flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                    {pm.name}
                  </td>
                  <td className="p-3 text-center text-white font-semibold">{pm.projects}</td>
                  <td className="p-3 text-center font-mono font-semibold text-slate-300">{pm.onTime}%</td>
                  <td className="p-3 text-center font-mono font-semibold text-slate-300">{pm.budget}%</td>
                  <td className="p-3 text-center font-mono font-semibold text-slate-300">{pm.quality}%</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {pm.overall}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Best performing manager", "Review low budget scores", "PM audit logs"]} />
    </div>
  );
}
