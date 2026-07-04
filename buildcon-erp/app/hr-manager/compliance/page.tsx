"use client";
import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, 
  Search, Filter, Plus, FileSpreadsheet, Eye, RefreshCw
} from "lucide-react";

interface AuditLog {
  id: number;
  auditName: string;
  category: "Labour Law" | "Safety" | "Training" | "Internal Financial";
  date: string;
  status: "Completed" | "Pending" | "Action Required";
  auditor: string;
  score: string;
}

interface ChecklistItem {
  id: number;
  task: string;
  category: string;
  dueDate: string;
  status: "done" | "pending";
}

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<"audits" | "checklist">("audits");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadComplianceData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) {
        setErrorMsg("Session expired or missing authentication.");
        setLoading(false);
        return;
      }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      // Fetch Audits
      const auRes = await fetch(`https://erp-construction.onrender.com/api/hr-manager/compliance/audits/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (auRes.ok) {
        const auData = await auRes.json();
        setAudits(auData);
      }

      // Fetch Checklist
      const chRes = await fetch(`https://erp-construction.onrender.com/api/hr-manager/compliance/checklist/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (chRes.ok) {
        const chData = await chRes.json();
        setChecklist(chData);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplianceData();
  }, []);

  const toggleChecklist = async (id: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`https://erp-construction.onrender.com/api/hr-manager/compliance/checklist/${id}/toggle`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const updated = await res.json();
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, status: updated.status } : item));
      } else {
        alert("Failed to toggle checklist status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#111C30]/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs italic flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span>Synchronizing compliance logs with database...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
        <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
        <p className="font-semibold text-rose-455 text-rose-400 mb-2">{errorMsg}</p>
        <button onClick={loadComplianceData} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">
          Retry Load
        </button>
      </div>
    );
  }

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
        <button
          onClick={loadComplianceData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
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
                    <td className="p-4 font-mono font-medium text-emerald-400">AUD-{audit.id}</td>
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
                          : "bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 border border-rose-500/20"
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
