"use client";
import React from "react";
import { ClipboardList, Camera, RefreshCw, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function DailySiteReports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">11. DAILY SITE REPORTS (DSR)</h2>
        <p className="text-xs text-slate-400">Review everyday field notes, weather conditions summaries, material counts, safety checklists, and photo logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Reports Submitted (Today)</div>
            <div className="text-xl font-bold text-white mt-1">14 Reports</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 grid place-items-center">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Pending Submissions</div>
            <div className="text-xl font-bold text-white mt-1">3 Reports</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 grid place-items-center">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Overdue Reports</div>
            <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400 mt-1">1 Report</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400">Photos Uploaded</div>
            <div className="text-xl font-bold text-white mt-1">125 Photos</div>
          </div>
        </div>
      </div>

      {/* Reports history log */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Daily Site Reports Log & History</h3>
          <button className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]">
            <RefreshCw className="h-3 w-3" />
            Refresh Log
          </button>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">DSR Reference</th>
                <th className="pb-2">Active Site</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Weather Condition</th>
                <th className="pb-2">Photos Count</th>
                <th className="pb-2">DSR Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["DSR-SKY-981", "Skyline Residences", "28 May 2025", "Sunny (38°C)", "12 Photos", "Submitted"],
                ["DSR-GFD-980", "Greenfield Apartments", "28 May 2025", "Sunny (37°C)", "8 Photos", "Submitted"],
                ["DSR-PHX-975", "Phoenix Commercial", "28 May 2025", "Sunny (39°C)", "26 Photos", "Pending Review"],
                ["DSR-LKV-970", "Lakeview Villas", "28 May 2025", "Rainy (32°C)", "0 Photos", "Overdue"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-white">{row[0]}</td>
                  <td className="text-slate-200 font-medium">{row[1]}</td>
                  <td className="text-slate-400">{row[2]}</td>
                  <td className="text-slate-350">{row[3]}</td>
                  <td className="text-slate-350 font-bold">{row[4]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[5] === "Submitted" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : row[5] === "Overdue"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
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

      <AIAssistantBar suggestions={["Export complete DSR ledger for Yard A", "Remind Lakeview supervisor", "Download raw photos archive"]} />
    </div>
  );
}
