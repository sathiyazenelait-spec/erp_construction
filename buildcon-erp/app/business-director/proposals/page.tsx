"use client";
import React from "react";
import { FileEdit, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const proposalsLog = [
  { id: "prop-1", name: "IT Park Project", client: "ABC Developers", value: "₹ 25.0 Cr", status: "Under Review", date: "15 June 2025" },
  { id: "prop-2", name: "Luxury Villas", client: "Oceanic Resorts", value: "₹ 8.0 Cr", status: "Accepted", date: "20 June 2025" },
  { id: "prop-3", name: "Commercial Complex", client: "XYZ Constructions", value: "₹ 12.0 Cr", status: "Under Review", date: "26 June 2025" },
  { id: "prop-4", name: "Apartment Project", client: "PQR Builders", value: "₹ 18.0 Cr", status: "Under Review", date: "28 June 2025" },
  { id: "prop-5", name: "Resort Project", client: "Oceanic Resorts", value: "₹ 7.8 Cr", status: "Rejected", date: "10 May 2025" },
  { id: "prop-6", name: "School Building", client: "Govt Schools", value: "₹ 12.0 Cr", status: "Accepted", date: "28 May 2025" },
  { id: "prop-7", name: "Warehouse", client: "Urban Spaces", value: "₹ 15.0 Cr", status: "Under Review", date: "12 June 2025" },
  { id: "prop-8", name: "Hospital Building", client: "Healthcare Ltd", value: "₹ 18.0 Cr", status: "Under Review", date: "15 June 2025" },
  { id: "prop-9", name: "Hotel Project", client: "Sri Venkateswara", value: "₹ 9.5 Cr", status: "Accepted", date: "08 May 2025" },
];

export default function ProposalsCenter() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">08. PROPOSALS</h2>
        <p className="text-xs text-slate-400">Track sent proposals, accepted bids, and value distributions</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Proposals Sent</div>
          <div className="text-2xl font-bold text-white mt-1">180</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Under Review</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">60</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Accepted</div>
          <div className="text-2xl font-bold text-emerald-450 text-emerald-400 mt-1">90</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Rejected</div>
          <div className="text-2xl font-bold text-red-400 mt-1">15</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Conversion Rate</div>
          <div className="text-2xl font-bold text-white mt-1">25.0%</div>
        </div>
      </div>

      {/* Proposals table ledger */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Proposals Registry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Proposal Project</th>
                <th className="p-3 font-semibold">Client</th>
                <th className="p-3 font-semibold">Value</th>
                <th className="p-3 font-semibold text-center">Status</th>
                <th className="p-3 rounded-r-lg text-right">Valid Thru / Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {proposalsLog.map((prop, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-medium text-white flex items-center gap-1.5">
                    <FileEdit className="h-3.5 w-3.5 text-blue-400" />
                    {prop.name}
                  </td>
                  <td className="p-3 text-slate-300">{prop.client}</td>
                  <td className="p-3 font-bold text-white">{prop.value}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prop.status === "Accepted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      prop.status === "Under Review" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-400">{prop.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Average conversion rate reviews", "Shortlisted proposals value"]} />
    </div>
  );
}
