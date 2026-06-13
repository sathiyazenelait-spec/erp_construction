"use client";
import React from "react";
import { UserPlus, Star, CheckSquare } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function RecruitmentCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">RECRUITMENT CENTER</h2>
        <p className="text-xs text-slate-400">Manage open recruitment applications, candidate stages from screening to selected, and onboarding checklists.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Open Positions</div>
            <div className="text-xl font-bold text-white mt-1">18 Open Roles</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Active Applications</div>
            <div className="text-xl font-bold text-white mt-1">650 Received (MTD)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Joined This Month</div>
            <div className="text-xl font-bold text-purple-400 mt-1">12 Onboarded</div>
          </div>
        </div>
      </div>

      {/* Hiring Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Hiring Pipeline & Active Openings</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Job Designation</th>
                <th className="pb-2">Department</th>
                <th className="pb-2">Target Hires</th>
                <th className="pb-2">Applications</th>
                <th className="pb-2">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["Senior Structural Engineer", "Projects / Engineering", "2 Positions", "120 Applied", "Interviewing"],
                ["Billing & Cost Accountant", "Finance / Accounts", "1 Position", "45 Applied", "Selected (Offer Sent)"],
                ["Site Safety Inspector", "EHS / Quality", "3 Positions", "75 Applied", "Screening"],
                ["Senior Procurement Lead", "Procurement / Purchase", "1 Position", "30 Applied", "Interviewing"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-slate-400">{row[2]}</td>
                  <td className="text-white font-bold">{row[3]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[4].includes("Selected") 
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

      <AIAssistantBar suggestions={["Create job description for Site Safety Inspector", "Compare cost per hire metrics", "Draft offer letter template"]} />
    </div>
  );
}
