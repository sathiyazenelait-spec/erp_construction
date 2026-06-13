"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Target, Users, Zap } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const leadSourceData = [
  { name: "Google Ads", MQL: 450, SQL: 300 },
  { name: "Meta Ads", MQL: 320, SQL: 200 },
  { name: "Organic SEO", MQL: 280, SQL: 130 },
  { name: "Referrals", MQL: 120, SQL: 50 },
];

export default function LeadGenCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">LEAD GENERATION CENTER</h2>
        <p className="text-xs text-slate-400">Track and filter Marketing Qualified Leads (MQL), Sales Qualified Leads (SQL), and overall conversions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total MQL Generated</div>
            <div className="text-xl font-bold text-white mt-1">1,850 Leads</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total SQL (Sales Ready)</div>
            <div className="text-xl font-bold text-white mt-1">680 Leads (36.7%)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Avg Cost Per Lead (CPL)</div>
            <div className="text-xl font-bold text-purple-400 mt-1">₹259</div>
          </div>
        </div>
      </div>

      {/* Leads Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Marketing vs Sales Qualified Leads by Channel</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadSourceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Bar name="MQL" dataKey="MQL" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar name="SQL" dataKey="SQL" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads list table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Leads Captured</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Lead Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Phone</th>
                <th className="pb-2">Source Channel</th>
                <th className="pb-2">Lead Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["Rohan Sharma", "rohan@gmail.com", "+91 98765 43210", "Google Ads", "Hot Lead"],
                ["Meera Patel", "meera.patel@yahoo.com", "+91 87654 32109", "Organic SEO", "Warm Lead"],
                ["Vikram Singh", "vikram.singh@outlook.com", "+91 76543 21098", "Meta Ads", "Cold Lead"],
                ["Priya Nair", "nair.priya@gmail.com", "+91 65432 10987", "Referrals", "Hot Lead"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-slate-350 font-mono">{row[2]}</td>
                  <td className="text-slate-400">{row[3]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[4] === "Hot Lead" 
                        ? "bg-emerald-500/10 text-emerald-450 text-emerald-400 border-emerald-500/20" 
                        : row[4] === "Warm Lead"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 border-rose-500/20"
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

      <AIAssistantBar suggestions={["Export lead list to Excel", "Filter hot leads from Facebook ads", "Calculate total conversion spend"]} />
    </div>
  );
}
