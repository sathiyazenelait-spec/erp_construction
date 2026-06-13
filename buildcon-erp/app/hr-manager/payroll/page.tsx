"use client";
import React from "react";
import { Landmark, FileCheck, ShieldAlert } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function PayrollCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">PAYROLL CENTER</h2>
        <p className="text-xs text-slate-400">Review monthly payroll structures, salary processing progress, tax deductions status, and payment logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Net Salary (May)</div>
            <div className="text-xl font-bold text-white mt-1">₹48,00,000</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Processing Status</div>
            <div className="text-xl font-bold text-emerald-450 text-emerald-400 mt-1">100% Processed</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Disbursed Bank Date</div>
            <div className="text-xl font-bold text-white mt-1">01 Jun 2026</div>
          </div>
        </div>
      </div>

      {/* Salary Breakdown Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Wise Salary Summary</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Department Name</th>
                <th className="pb-2">Employees Count</th>
                <th className="pb-2">Basic Component</th>
                <th className="pb-2">Deductions (PF/TDS)</th>
                <th className="pb-2">Total Net Payout</th>
                <th className="pb-2">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["Engineering / Projects", "57 Staff", "₹18.5 L", "₹1.4 L", "₹17.1 L", "Processed"],
                ["Sales & Marketing", "15 Staff", "₹5.8 L", "₹48,000", "₹5.32 L", "Processed"],
                ["Accounts & Finance", "8 Staff", "₹3.2 L", "₹25,000", "₹2.95 L", "Processed"],
                ["HR & Admin Operations", "6 Staff", "₹2.1 L", "₹18,000", "₹1.92 L", "Processed"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                  <td className="text-white font-bold">{row[1]}</td>
                  <td className="text-slate-350">{row[2]}</td>
                  <td className="text-rose-400 font-semibold">{row[3]}</td>
                  <td className="text-emerald-400 font-bold">{row[4]}</td>
                  <td>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {row[5]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Generate salary slip PDFs template", "Confirm overall PF deduction transfer", "Check pending reimbursement vouchers"]} />
    </div>
  );
}
