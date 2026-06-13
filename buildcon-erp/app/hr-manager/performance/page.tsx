"use client";
import React from "react";
import { Award, Zap, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function PerformanceManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">PERFORMANCE MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Review employee appraisal ratings, performance metrics feedback, top achievers, and career improvement roadmaps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Top Performers (Achievers)</div>
            <div className="text-xl font-bold text-white mt-1">18 Evaluated</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 grid place-items-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Needs Improvement (PIP)</div>
            <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400 mt-1">7 Evaluated</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Average Appraisals Score</div>
            <div className="text-xl font-bold text-white mt-1">4.2 / 5.0</div>
          </div>
        </div>
      </div>

      {/* Performers Details */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Employee Appraisal & Ratings Ledger</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Employee Name</th>
                <th className="pb-2">Role / Title</th>
                <th className="pb-2">Department</th>
                <th className="pb-2">Self Rating</th>
                <th className="pb-2">Manager Rating</th>
                <th className="pb-2">Appraisal Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["Karthik R.", "Construction Manager", "Projects", "4.8", "4.9", "Top Performer"],
                ["Ananya Sharma", "Marketing Manager", "Sales & Marketing", "4.5", "4.6", "Top Performer"],
                ["Amit Patel", "Site Supervisor", "Projects", "4.2", "4.2", "Strong Performer"],
                ["Rohan Sharma", "Civil Engineer", "Engineering", "3.2", "3.0", "Needs Improvement"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-slate-450 text-slate-400">{row[2]}</td>
                  <td className="text-slate-350 font-mono">{row[3]}</td>
                  <td className="text-white font-mono font-bold">{row[4]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[5] === "Top Performer" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : row[5].includes("Needs")
                        ? "bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 border-rose-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {row[5]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Suggest PIP roadmap template", "List top performers with pending appraisal reviews", "Export evaluations log"]} />
    </div>
  );
}
