"use client";
import React, { useState } from "react";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, 
  Search, Filter, Plus, FileSpreadsheet, Eye, RefreshCw
} from "lucide-react";

interface AuditLog {
  id: string;
  auditName: string;
  category: "Labour Law" | "Safety" | "Training" | "Internal Financial";
  date: string;
  status: "Completed" | "Pending" | "Action Required";
  auditor: string;
  score: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  dueDate: string;
  status: "done" | "pending";
}

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<"audits" | "checklist">("audits");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [audits, setAudits] = useState<AuditLog[]>([
    { id: "AUD-101", auditName: "Q1 Labour Law Compliance", category: "Labour Law", date: "2025-03-15", status: "Completed", auditor: "S. K. Sharma & Co.", score: "98.5%" },
    { id: "AUD-102", auditName: "Site Safety Regulation Audit", category: "Safety", date: "2025-04-10", status: "Completed", auditor: "State Safety Board", score: "97.0%" },
    { id: "AUD-103", auditName: "Mandatory Employee Training Audit", category: "Training", date: "2025-05-02", status: "Completed", auditor: "Internal HR Committee", score: "100%" },
    { id: "AUD-104", auditName: "Contractor Wage & PF Compliance Audit", category: "Labour Law", date: "2025-05-20", status: "Action Required", auditor: "District Labour Commissioner", score: "89.2%" },
    { id: "AUD-105", auditName: "Q2 Internal Financial Audit", category: "Internal Financial", date: "2025-06-15", status: "Pending", auditor: "Verma & Associates", score: "Pending" },
  ]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "CL-01", task: "Submit PF & ESI Monthly Returns", category: "Labour Law", dueDate: "2025-06-15", status: "done" },
    { id: "CL-02", task: "Submit Gratuity Act Annual Returns", category: "Labour Law", dueDate: "2025-06-30", status: "pending" },
    { id: "CL-03", task: "Verify Construction Site Labour Safety Certifications", category: "Safety", dueDate: "2025-06-18", status: "pending" },
    { id: "CL-04", task: "Conduct Workplace Harassment (POSH) Refresher", category: "Training", dueDate: "2025-06-25", status: "pending" },
    { id: "CL-05", task: "Renew Workman Compensation Insurance Policy", category: "Labour Law", dueDate: "2025-07-05", status: "done" },
    { id: "CL-06", task: "Submit Minimum Wages Compliance Declaration", category: "Labour Law", dueDate: "2025-06-20", status: "pending" }
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, status: item.status === "done" ? "pending" : "done" } : item));
  };

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.auditName.toLowerCase().includes(searchTerm.toLowerCase()) || audit.auditor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || audit.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Upper header action area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Compliance Center</h2>
          <p className="text-xs text-slate-400">Track audits, labour regulations, certification statuses, and policy compliance checklists.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors self-start sm:self-center">
          <Plus className="h-4 w-4" />
          Schedule Audit
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Compliance</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">98.5%</span>
            <span className="text-xs font-medium text-emerald-400">+0.8% MoM</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Meets statutory standards</p>
        </div>

        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Internal Audits</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">4 / 5</span>
            <span className="text-xs font-medium text-slate-400">Completed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">1 pending this quarter</p>
        </div>

        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Labour Law Audits</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">96.3%</span>
            <span className="text-xs font-medium text-amber-500">1 Warning</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Contractor PF review needed</p>
        </div>

        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Safety Certifications</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">100%</span>
            <span className="text-xs font-medium text-emerald-400">All Sites</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Active clearance verified</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("audits")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "audits"
              ? "border-emerald-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Compliance Audits
        </button>
        <button
          onClick={() => setActiveTab("checklist")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "checklist"
              ? "border-emerald-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Statutory Checklist
        </button>
      </div>

      {/* Audit Log Tab */}
      {activeTab === "audits" && (
        <div className="bg-[#0F182A] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 max-w-sm w-full">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit names or auditors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-400 w-full"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Category:</span>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Labour Law">Labour Law</option>
                <option value="Safety">Safety</option>
                <option value="Training">Training</option>
                <option value="Internal Financial">Internal Financial</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#111C30]/50 text-slate-400 text-xs font-semibold">
                  <th className="p-4">Audit ID</th>
                  <th className="p-4">Audit Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Audit Date</th>
                  <th className="p-4">Auditor</th>
                  <th className="p-4 text-center">Score</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800/50">
                {filteredAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-medium text-emerald-400">{audit.id}</td>
                    <td className="p-4 font-semibold text-white">{audit.auditName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#111C30] border border-slate-800 text-slate-300">
                        {audit.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{audit.date}</td>
                    <td className="p-4 text-slate-300">{audit.auditor}</td>
                    <td className="p-4 text-center font-bold text-white">{audit.score}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                        audit.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : audit.status === "Pending"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white" title="View details">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white" title="Download report">
                          <FileSpreadsheet className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Checklist Tab */}
      {activeTab === "checklist" && (
        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Statutory Filings & Renewals Checklist</h3>
            <span className="text-xs text-slate-400">
              Completed: {checklist.filter(c => c.status === "done").length} of {checklist.length} items
            </span>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-start sm:items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  item.status === "done" 
                    ? "bg-[#111C30]/40 border-slate-800/60 opacity-60" 
                    : "bg-[#111C30] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={item.status === "done"} 
                      onChange={() => {}} // toggling handled on parent div
                      className="accent-emerald-500 h-4 w-4 cursor-pointer"
                    />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold text-white ${item.status === "done" ? "line-through text-slate-500" : ""}`}>
                      {item.task}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#0F182A] rounded border border-slate-850 text-slate-400">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Due Date: {item.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {item.status === "done" ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Filed
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
