"use client";
import React from "react";
import { Target, Search, Filter } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const leadsLog = [
  { name: "Ravi Kumar", source: "Google Ads", phone: "+91 98765 43210", location: "Chennai", budget: "₹80 Lakhs - 1.2 Cr", status: "Qualified" },
  { name: "Anita Verma", source: "Website", phone: "+91 87654 32109", location: "Chennai", budget: "₹1.5 Cr - 2.0 Cr", status: "Qualified" },
  { name: "Manoj Singh", source: "Referral", phone: "+91 76543 21098", location: "Coimbatore", budget: "₹75 Lakhs - 1.0 Cr", status: "Working" },
  { name: "Priya Iyer", source: "Website", phone: "+91 65432 10987", location: "Bangalore", budget: "₹2.0 Cr - 3.0 Cr", status: "New" },
  { name: "Arun Prakash", source: "Social Media", phone: "+91 95432 10987", location: "Trichy", budget: "₹50 Lakhs - 80 Lakhs", status: "Working" },
];

export default function LeadsManagement() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">02. LEADS MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Incoming inquiries, marketing leads, and customer details</p>
        </div>
        <button className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Filter
        </button>
      </div>

      {/* Main Leads Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Lead Name</th>
                <th className="p-3 font-semibold">Source</th>
                <th className="p-3 font-semibold">Phone Contact</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Budget (₹)</th>
                <th className="p-3 font-semibold rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leadsLog.map((lead, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-medium text-white flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-blue-400" />
                    {lead.name}
                  </td>
                  <td className="p-3 text-slate-300">{lead.source}</td>
                  <td className="p-3 font-mono">{lead.phone}</td>
                  <td className="p-3 text-slate-400">{lead.location}</td>
                  <td className="p-3 text-white font-semibold">{lead.budget}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lead.status === "Qualified" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      lead.status === "Working" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Best converting source?", "Qualified leads summary", "Uncontacted leads"]} />
    </div>
  );
}
