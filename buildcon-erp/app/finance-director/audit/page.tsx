"use client";
import React from "react";
import { ShieldCheck, FileSpreadsheet, Scale } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function AuditCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">AUDIT & STATUTORY CENTER</h2>
        <p className="text-xs text-slate-400">Oversee internal controls, statutory financial audits, CARO reporting compliance, and independent audits reviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Statutory Audit FY25</div>
            <div className="text-xl font-bold text-white">Completed (Clean Opinion)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Internal Audit Status</div>
            <div className="text-xl font-bold text-white">Q1 Phase 1 In-Progress</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">CARO Clauses Check</div>
            <div className="text-xl font-bold text-white">21 / 21 Complied</div>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Statutory Audits & Audit Notes Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Audit Type</th>
                <th className="pb-2">Auditor Firm</th>
                <th className="pb-2">Date Conducted</th>
                <th className="pb-2">Significant Findings</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["Annual Statutory Audit", "SR Batliboi & Associates", "Apr - May 2025", "0 Material Weaknesses", "Clean Opinion"],
                ["GST Audit & Matching", "KPMG India LLC", "Mar 2025", "Minor Input Reco (resolved)", "Completed"],
                ["Internal Site Cost Audit", "BDO India LLP", "Ongoing", "3 minor inventory gaps noted", "In Progress"],
                ["TDS Statutory Compliance Review", "Chitale & Co", "Jan 2025", "None", "Completed"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-slate-400">{row[2]}</td>
                  <td className="text-slate-350">{row[3]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[4] === "Clean Opinion" || row[4] === "Completed"
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

      <AIAssistantBar suggestions={["Show internal audit recommendations list", "Download CARO report checklist", "Request document review for Chitale & Co audit"]} />
    </div>
  );
}
