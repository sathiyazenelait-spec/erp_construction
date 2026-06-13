"use client";
import React, { useState } from "react";
import { Check, X, Shield, Clock, CheckCircle2, AlertTriangle, AlertCircle, FileText } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface ApprovalRequest {
  id: number;
  type: string;
  details: string;
  requester: string;
  amount: string;
  priority: string;
  date: string;
}

const INITIAL_PENDING: ApprovalRequest[] = [
  { id: 1, type: "PO", details: "Steel Procurement - Commercial Complex", requester: "Rajesh Kumar", amount: "₹ 75.0 Lakhs", priority: "High", date: "26 May 2025" },
  { id: 2, type: "Investment", details: "Coimbatore Branch Opening", requester: "Board", amount: "₹ 1.5 Cr", priority: "High", date: "27 May 2025" },
  { id: 3, type: "Capex", details: "Tower Crane CAPEX - IT Park I", requester: "Karthik R", amount: "₹ 1.2 Cr", priority: "Medium", date: "28 May 2025" },
  { id: 4, type: "Opex", details: "Sub-Contractor Invoice ABC Ltd", requester: "Amit Kumar", amount: "₹ 15.0 Lakhs", priority: "Low", date: "28 May 2025" },
  { id: 5, type: "Material", details: "Cement Supply Order - Skyline", requester: "Vijay Kumar", amount: "₹ 45.0 Lakhs", priority: "Medium", date: "28 May 2025" },
  { id: 6, type: "Project", details: "Additional Civil Work (Variations)", requester: "Priya Raj", amount: "₹ 8.5 Lakhs", priority: "Medium", date: "29 May 2025" },
];

const INITIAL_APPROVED: ApprovalRequest[] = [
  { id: 101, type: "Capex", details: "Excavator Purchase Tier-2", requester: "Karthik R", amount: "₹ 85.0 Lakhs", priority: "High", date: "20 May 2025" },
  { id: 102, type: "Opex", details: "Labor Settlement Week 20", requester: "Anita Sharma", amount: "₹ 24.5 Lakhs", priority: "High", date: "22 May 2025" },
];

const INITIAL_REJECTED: ApprovalRequest[] = [
  { id: 201, type: "Material", details: "Premium Wood Panels for Clubhouse", requester: "Vijay Kumar", amount: "₹ 18.0 Lakhs", priority: "Low", date: "15 May 2025" },
];

export default function ApprovalCenter() {
  const [pending, setPending] = useState<ApprovalRequest[]>(INITIAL_PENDING);
  const [approved, setApproved] = useState<ApprovalRequest[]>(INITIAL_APPROVED);
  const [rejected, setRejected] = useState<ApprovalRequest[]>(INITIAL_REJECTED);
  const [tab, setTab] = useState("pending");
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const fetchPendingProjects = async () => {
    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) return;
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) return;

      const res = await fetch(`http://localhost:8081/api/projects/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDbProjects(data.filter((p: any) => p.status === "Planning" || p.status === "Pending"));
      }
    } catch (e) {
      console.error("Failed to fetch pending projects for chairman approvals", e);
    } finally {
      setLoadingProjects(false);
    }
  };

  React.useEffect(() => {
    fetchPendingProjects();
  }, []);

  const handleApproveProject = async (projId: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`http://localhost:8081/api/projects/${projId}/approve`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Project successfully approved and launched to site operations!");
        fetchPendingProjects();
      } else {
        alert("Failed to approve project.");
      }
    } catch (e) {
      console.error(e);
      alert("Error approving project.");
    }
  };

  const handleAction = (id: number, approve: boolean) => {
    const item = pending.find((ap) => ap.id === id);
    if (!item) return;

    if (approve) {
      setApproved([item, ...approved]);
    } else {
      setRejected([item, ...rejected]);
    }
    setPending(pending.filter((ap) => ap.id !== id));
  };

  const currentList = tab === "pending" ? pending : tab === "approved" ? approved : rejected;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">08. APPROVAL CENTER</h2>
        <p className="text-xs text-slate-400">Review pending purchase orders, budgets and investment decisions</p>
      </div>

      {/* AI Project Launch Approvals Section */}
      {dbProjects.length > 0 && (
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-yellow-500 animate-spin" /> Pending AI-Powered Project Launch Approvals
              </h3>
              <p className="text-[11px] text-slate-400">New project proposals utilizing design plans & workforce models with AI suggested limits</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-bold font-mono">
              {dbProjects.length} Pending
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 text-xs">
            {dbProjects.map((proj) => (
              <div key={proj.id} className="p-4 bg-[#0E1726]/80 border border-slate-850 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                    <span className="text-[10px] text-slate-400">
                      Location: {proj.location} | Dimensions: {proj.length ? `${proj.length}m` : "N/A"} / {proj.floors ? `G+${proj.floors}` : "N/A"} Floors
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold">
                    PLANNING STATUS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-[#0B111E] rounded-lg">
                  <div>
                    <span className="text-[9px] text-slate-500 block font-semibold">PM Target Budget</span>
                    <span className="font-bold font-mono text-white">₹ {proj.budget.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block font-semibold">AI Suggested Budget</span>
                    <span className="font-bold font-mono text-emerald-400">
                      ₹ {proj.aiSuggestedBudget ? proj.aiSuggestedBudget.toLocaleString("en-IN") : "N/A"}
                    </span>
                  </div>
                   <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[9px] text-slate-500 block font-semibold">AI Predicted Duration</span>
                    <span className="font-bold font-mono text-yellow-400">
                      {proj.aiEstimatedHours ? `${Math.floor(proj.aiEstimatedHours / 8)} Days` : "N/A"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[9px] text-slate-500 block font-semibold">AI Predicted Date of Completion</span>
                    <span className="font-bold font-mono text-cyan-400">
                      {proj.aiEstimatedHours ? new Date(Date.now() + Math.floor(proj.aiEstimatedHours / 8) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : "N/A"}
                    </span>
                  </div>
                </div>

                {proj.aiHazardWarnings && (
                  <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-xl leading-relaxed text-[11px] flex gap-1.5 items-start">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <div>
                      <span className="font-semibold block text-[10px] text-red-300">AI Hazard Detection Warnings:</span>
                      {proj.aiHazardWarnings}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => handleApproveProject(proj.id)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-2 rounded-lg text-[11px] hover:brightness-110 transition shadow-md shadow-emerald-500/10"
                  >
                    Approve & Launch Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Row */}
      <div className="flex gap-2 border-b border-slate-800 pb-px">
        <button onClick={() => setTab("pending")} className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${tab === "pending" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-white"}`}>
          Pending Approvals ({pending.length})
        </button>
        <button onClick={() => setTab("approved")} className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${tab === "approved" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-white"}`}>
          Approved ({approved.length})
        </button>
        <button onClick={() => setTab("rejected")} className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${tab === "rejected" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-white"}`}>
          Rejected ({rejected.length})
        </button>
      </div>

      {/* Content table */}
      <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
        {currentList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 font-semibold rounded-l-lg">Request Type</th>
                  <th className="p-3 font-semibold">Details</th>
                  <th className="p-3 font-semibold">Requested By</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Priority</th>
                  {tab === "pending" && <th className="p-3 font-semibold rounded-r-lg text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {currentList.map((ap) => (
                  <tr key={ap.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase">{ap.type}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-200">{ap.details}</td>
                    <td className="p-3">{ap.requester}</td>
                    <td className="p-3 text-slate-400">{ap.date}</td>
                    <td className="p-3 font-semibold text-white">{ap.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${ap.priority === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" : ap.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                        {ap.priority}
                      </span>
                    </td>
                    {tab === "pending" && (
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleAction(ap.id, true)} className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors" title="Approve">
                            <Check className="h-4.5 w-4.5" />
                          </button>
                          <button onClick={() => handleAction(ap.id, false)} className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors" title="Reject">
                            <X className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
            <div className="text-sm font-bold text-white">No items found</div>
            <div className="text-xs text-slate-400 mt-1">This list category is currently empty.</div>
          </div>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Pending</div>
          <div className="text-2xl font-bold text-white mt-1">{pending.length} Requests</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">High Priority</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{pending.filter(p => p.priority === "High").length} Requests</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Approved Total</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{approved.length} Requests</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Rejected Total</div>
          <div className="text-2xl font-bold text-slate-300 mt-1">{rejected.length} Requests</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Audit Status</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">Verified</div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Show limits criteria", "Approve all high priority POs", "Approval audit logs", "Vendor statistics"]} />
    </div>
  );
}
