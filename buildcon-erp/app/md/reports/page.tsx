"use client";
import React from "react";
import { FileText, Download, Calendar } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const reportList = [
  { name: "Monthly Performance Report - May 2025", type: "PDF", size: "4.2 MB", date: "28 May 2025" },
  { name: "Project Status Ledger - May 2025", type: "XLSX", size: "12.8 MB", date: "27 May 2025" },
  { name: "Financial Summary Report - Q1 2025", type: "PDF", size: "8.5 MB", date: "20 May 2025" },
  { name: "Labour Strength Audit - Q1 2025", type: "PDF", size: "2.1 MB", date: "15 May 2025" },
];

export default function ReportsCenter() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">14. REPORTS CENTER</h2>
        <p className="text-xs text-slate-400">View and download company financial, operational, and site audit reports</p>
      </div>

      {/* Reports List */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Available Downloads</h3>
        <div className="space-y-3">
          {reportList.map((r, idx) => (
            <div key={idx} className="bg-[#0e1628] border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-slate-800 transition">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 grid place-items-center text-blue-400 border border-blue-500/20">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{r.name}</h4>
                  <div className="text-[10px] text-slate-400 mt-1 flex gap-3">
                    <span>Format: <strong className="text-slate-300">{r.type}</strong></span>
                    <span>Size: <strong className="text-slate-300">{r.size}</strong></span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-slate-500" /> {r.date}</span>
                  </div>
                </div>
              </div>

              <button className="bg-slate-850 hover:bg-slate-800 hover:text-white border border-slate-800 text-slate-400 rounded-lg p-2 transition-colors" title="Download">
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AIAssistantBar suggestions={["Export custom reports", "Roster reports history", "Safety audits archive"]} />
    </div>
  );
}
