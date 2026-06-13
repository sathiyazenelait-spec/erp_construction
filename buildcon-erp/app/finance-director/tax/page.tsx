"use client";
import React from "react";
import { Receipt, FileText, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function TaxCompliance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">TAX & COMPLIANCE</h2>
        <p className="text-xs text-slate-400">Track statutory GST returns filings, TDS deductions status, income tax advance filings, and corporate legal compliance logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">GST Filing Status (May)</div>
            <div className="text-xl font-bold text-white">Filed (On Time)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total TDS Paid (Q1)</div>
            <div className="text-xl font-bold text-white">₹1.82 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Advance Tax Due</div>
            <div className="text-xl font-bold text-amber-400">₹2.4 Cr (Due 15 Jun)</div>
          </div>
        </div>
      </div>

      {/* Compliance Log Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Statutory Returns Filing Calendar & History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Tax Head / Type</th>
                <th className="pb-2">Period / Quarter</th>
                <th className="pb-2">Due Date</th>
                <th className="pb-2">Amount Paid</th>
                <th className="pb-2">Filing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["GSTR-1 (Sales Return)", "May 2026", "11 Jun 2026", "₹42.5 L", "Filed"],
                ["GSTR-3B (Summary Return)", "May 2026", "20 Jun 2026", "₹78.2 L", "Pending Payment"],
                ["TDS Section 194C (Contractors)", "May 2026", "07 Jun 2026", "₹12.4 L", "Filed"],
                ["Advance Income Tax (Instalment 1)", "Q1 FY26", "15 Jun 2026", "₹2.4 Cr", "Approved"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-slate-400 font-semibold">{row[2]}</td>
                  <td className="text-white font-bold">{row[3]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[4] === "Filed" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : row[4] === "Approved"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
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

      <AIAssistantBar suggestions={["Generate TDS summary report", "GST liability matching ledger", "Income tax projection calculator"]} />
    </div>
  );
}
