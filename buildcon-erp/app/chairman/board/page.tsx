"use client";
import React from "react";
import { FileText, Download, BarChart2, Calendar, FileSpreadsheet, ShieldAlert, Sparkles, Plus } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const quickReports = [
  { title: "Financial Summary", desc: "Balance sheet, P&L statements & metrics", format: "PDF", color: "from-blue-500 to-blue-600" },
  { title: "Project Performance", desc: "Timeline, progress & budgets summary", format: "PDF", color: "from-emerald-500 to-emerald-600" },
  { title: "Cash Flow Report", desc: "Detailed cash forecast & inflow logs", format: "XLSX", color: "from-violet-500 to-violet-600" },
  { title: "Sales Report", desc: "Leads funnel, performance & targets", format: "PDF", color: "from-amber-500 to-amber-600" },
  { title: "Workforce Analytics", desc: "Productivity, attrition & headcount logs", format: "PDF", color: "from-pink-500 to-pink-600" },
  { title: "Safety Report", desc: "Compliance score, audits & incident log", format: "XLSX", color: "from-teal-500 to-teal-600" },
];

const recentReports = [
  { name: "Monthly Board Report - April 2025", date: "20 May 2025" },
  { name: "Quarterly Financial Report - Q1 2025", date: "15 May 2025" },
  { name: "Project Performance Report - April 2025", date: "10 May 2025" },
  { name: "Cash Flow Statement - April 2025", date: "05 May 2025" },
  { name: "Safety Compliance Report - April 2025", date: "02 May 2025" },
];

export default function BoardReports() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">09. BOARD REPORTS</h2>
          <p className="text-xs text-slate-400">Access comprehensive board-level reporting</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 hover:brightness-110 transition-all">
          <Plus className="h-4 w-4" />
          Request Custom Report
        </button>
      </div>

      {/* Grid: Quick Reports / Recent Reports */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Reports */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Quick Reports</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {quickReports.map((rep, idx) => (
              <div key={idx} className="p-4 bg-[#0E1726]/60 border border-slate-800/80 rounded-lg flex justify-between items-start hover:border-slate-700 transition-all cursor-pointer group">
                <div className="space-y-1.5 flex-1 pr-3">
                  <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{rep.title}</div>
                  <div className="text-[10px] text-slate-400 leading-relaxed">{rep.desc}</div>
                </div>
                <div className={`h-8 w-12 rounded flex flex-col justify-center items-center text-[9px] font-bold text-white bg-gradient-to-br ${rep.color} shadow-sm shrink-0`}>
                  {rep.format}
                  <Download className="h-3 w-3 mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Recent Reports</h3>
            <button className="text-xs text-blue-400 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {recentReports.map((rep, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded bg-[#0E1726]/60 border border-slate-800/80 hover:bg-slate-800/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-300 truncate max-w-[140px] group-hover:text-white">{rep.name}</span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="text-[9px] text-slate-500">{rep.date}</span>
                  <Download className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Reports Generated (YTD)</div>
          <div className="text-2xl font-bold text-white mt-1">45</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Scheduled Reports</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">12</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Ad-hoc Reports Requests</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">33</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Last Report Generated</div>
          <div className="text-2xl font-bold text-white mt-1">28 May 2025</div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Generate Q2 draft report", "Scheduled configurations", "Audit log files", "Export all active lists"]} />
    </div>
  );
}
