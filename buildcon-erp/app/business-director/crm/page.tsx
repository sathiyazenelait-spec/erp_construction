"use client";
import React from "react";
import { Users, Smile, Mail, Phone, Calendar } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const crmClients = [
  { name: "ABC Developers Pvt Ltd", contact: "Mr. Ramesh", phone: "+91 98765 43210", projects: 3, status: "Active", lastContact: "28 May 2025" },
  { name: "XYZ Constructions Ltd", contact: "Ms. Suresh", phone: "+91 87654 32109", projects: 2, status: "Active", lastContact: "26 May 2025" },
  { name: "Greenfield Builders Group", contact: "Mr. Rajan", phone: "+91 76543 21098", projects: 2, status: "Active", lastContact: "25 May 2025" },
  { name: "L&N Infraventures Inc", contact: "Mr. Karthik", phone: "+91 65432 10987", projects: 1, status: "Potential", lastContact: "27 May 2025" },
  { name: "Oceanic Resorts & Hotels", contact: "Mr. Vijay", phone: "+91 95432 10987", projects: 2, status: "Active", lastContact: "20 May 2025" },
];

export default function CRM() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">05. CLIENTS & CRM</h2>
        <p className="text-xs text-slate-400">Manage customer profile accounts, active accounts, and last touchpoints logs</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Clients</div>
          <div className="text-2xl font-bold text-white mt-1">320</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Active Accounts</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">180</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Potential Accounts</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">95</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Inactive Accounts</div>
          <div className="text-2xl font-bold text-red-400 mt-1">45</div>
        </div>
      </div>

      {/* CRM Registry */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Accounts Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Client Name</th>
                <th className="p-3 font-semibold">Contact Person</th>
                <th className="p-3 font-semibold">Phone</th>
                <th className="p-3 font-semibold text-center">Projects</th>
                <th className="p-3 font-semibold text-center">Status</th>
                <th className="p-3 rounded-r-lg text-right">Last Touchpoint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {crmClients.map((client, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                    <Smile className="h-3.5 w-3.5 text-blue-400" />
                    {client.name}
                  </td>
                  <td className="p-3 text-slate-300">{client.contact}</td>
                  <td className="p-3 font-mono">{client.phone}</td>
                  <td className="p-3 text-center text-white font-bold">{client.projects}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      client.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-400">{client.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Client billing summary", "Feedback reports summary", "Potential leads routing"]} />
    </div>
  );
}
