"use client";
import React from "react";
import { FileText, Trophy, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const tendersLog = [
  { name: "IT Park Phase - 2", value: "₹ 25.0 Cr", status: "Shortlisted", date: "15 June 2025" },
  { name: "Govt School Building", value: "₹ 12.0 Cr", status: "Won", date: "28 May 2025" },
  { name: "Highway Rest Area - ECR", value: "₹ 8.0 Cr", status: "Participated", date: "25 May 2025" },
  { name: "Medical College - Madurai", value: "₹ 40.0 Cr", status: "Lost", date: "18 May 2025" },
  { name: "Police Station - Coimbatore", value: "₹ 6.0 Cr", status: "Shortlisted", date: "02 June 2025" },
  { name: "Bus Terminal - Salem", value: "₹ 16.0 Cr", status: "Won", date: "12 May 2025" },
  { name: "Smart City Project - Chennai", value: "₹ 80.0 Cr", status: "Participated", date: "10 July 2025" },
  { name: "University Building - Trichy", value: "₹ 35.0 Cr", status: "Participated", date: "01 June 2025" },
  { name: "Industrial Park - Coimbatore", value: "₹ 50.0 Cr", status: "Lost", date: "10 April 2025" },
  { name: "Water Treatment Plant - Erode", value: "₹ 19.5 Cr", status: "Won", date: "08 May 2025" },
];

export default function TenderManagement() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">03. TENDERS</h2>
        <p className="text-xs text-slate-400">Manage government bids, private tenders, status logs, and deadlines</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">Total Tenders</div>
            <div className="text-2xl font-bold text-white mt-1">35</div>
          </div>
          <FileText className="h-8 w-8 text-blue-500/20" />
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Participated</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">22 Bids</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Shortlisted</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">8 Bids</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Won Value</div>
          <div className="text-2xl font-bold text-emerald-450 text-emerald-400 mt-1">4 Won</div>
        </div>
      </div>

      {/* Tenders Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Tenders Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Tender Name</th>
                <th className="p-3 font-semibold">Value</th>
                <th className="p-3 font-semibold text-center">Bidding Status</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">Expiry / Close Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tendersLog.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-medium text-white">{t.name}</td>
                  <td className="p-3 font-semibold text-white">{t.value}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === "Won" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      t.status === "Shortlisted" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      t.status === "Participated" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-400">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Winning ratios by tier", "Detailed bids analysis", "Government sectors deadlines"]} />
    </div>
  );
}
