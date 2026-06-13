"use client";
import React from "react";
import { FileText, Download, ShieldCheck, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function FinancialReports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">FINANCIAL REPORTS CENTER</h2>
        <p className="text-xs text-slate-400">Export audited Profit & Loss accounts, corporate Balance Sheets, Cash Flow Statements, and Site Cost Ledgers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Profit & Loss (P&L)", desc: "Consolidated statement of revenues & operating expenses.", doc: "PDF / CSV" },
          { title: "Balance Sheet", desc: "Enterprise capital structure, assets, and liabilities register.", doc: "PDF / Excel" },
          { title: "Cash Flow Statement", desc: "Treasury operating cash flows, direct and indirect methods.", doc: "PDF / CSV" },
          { title: "Project Cost Variance", desc: "Detailed cost analysis broken down by each construction site.", doc: "Excel / PDF" }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center mb-3">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-200 text-sm">{item.title}</h4>
              <p className="text-[11px] text-slate-450 text-slate-400 mt-1">{item.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{item.doc}</span>
              <button className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded transition font-medium">
                <Download className="h-3 w-3" />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reports history log */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Statutory Submissions & Archive Logs</h3>
          <button className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]">
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Report Reference</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Generated On</th>
                <th className="pb-2">Signatory Approval</th>
                <th className="pb-2">Format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["REP-PL-2025-Q4", "Profit & Loss Account", "28 May 2025", "Approved (Suresh Kumar)", "PDF / Excel"],
                ["REP-BS-2025-YE", "Year End Balance Sheet", "15 May 2025", "Signed & Audited", "PDF Only"],
                ["REP-TAX-GST-05", "GSTR-3B Auto Ledger Summary", "10 May 2025", "Verified (GST Officer)", "CSV Ledger"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-slate-400">{row[2]}</td>
                  <td className="text-emerald-400 font-semibold flex items-center gap-1 pt-3">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {row[3]}
                  </td>
                  <td className="text-slate-350">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Export consolidated ledger for 2024", "Generate project health report summary", "Download sign-off document for auditors"]} />
    </div>
  );
}
