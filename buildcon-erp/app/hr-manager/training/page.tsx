"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { BookOpen, Award, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const trainingModules = [
  { module: "Safety Training", progress: 100 },
  { module: "Technical Training", progress: 85 },
  { module: "Leadership Training", progress: 72 },
];

export default function TrainingCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">TRAINING CENTER</h2>
        <p className="text-xs text-slate-400">Manage site safety inductions, machinery handling certifications, and leadership appraisal modules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Active Training Modules</div>
            <div className="text-xl font-bold text-white mt-1">12 Modules</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Overall Completion Rate</div>
            <div className="text-xl font-bold text-white mt-1">85.6% Completed</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Certificates Issued (MTD)</div>
            <div className="text-xl font-bold text-purple-400 mt-1">45 Issued</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress bar chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Training Completion Progress (%)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingModules} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="module" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed modules list */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Training Schedules & Attendees Log</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Training Name</th>
                  <th className="pb-2">Assigned Group</th>
                  <th className="pb-2">Attendees Count</th>
                  <th className="pb-2">Completion Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  ["Toolbox Heights Safety Safety Inductions", "All site workers / staff", "420 Workers", "28 May 2025", "100% Completed"],
                  ["Heavy Equipment Operation", "Crane & Mixer Operators", "15 Operators", "10 Jun 2025", "In Progress"],
                  ["EHS Site Audits compliance", "Site Managers", "8 Managers", "15 Jun 2025", "Scheduled"],
                  ["Executive Leadership Program", "Directors & Managers", "12 Attendees", "20 May 2025", "72% Completed"]
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                    <td className="text-slate-350">{row[1]}</td>
                    <td className="text-slate-400 font-bold">{row[2]}</td>
                    <td className="text-slate-350">{row[3]}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        row[4].includes("100%") 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {row[4]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Create safety training registration template", "List attendees with incomplete technical modules", "Audit credentials list"]} />
    </div>
  );
}
