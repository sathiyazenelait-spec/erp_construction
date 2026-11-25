"use client";
import React, { useState, useEffect } from "react";
import {
  Check, X, Shield, Clock, CheckCircle2, AlertTriangle,
  AlertCircle, FileText, MessageSquare, Send, Award,
  Sparkles, User, Calendar, DollarSign, Tag, ArrowUpRight,
  HelpCircle, Eye, ChevronRight
} from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface BoardApprovalItem {
  id: number;
  type: string;
  details: string;
  requester: string;
  requesterRole?: string;
  amount: string;
  priority: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  chairmanRemarks?: string;
  approvedBy?: string;
  actionDate?: string;
  organizationId?: number;
}

const INITIAL_BOARD_APPROVALS: BoardApprovalItem[] = [
  {
    id: 1,
    type: "PO",
    details: "Steel Procurement - Commercial Complex Tower B (Fe550D TMT Rebar)",
    requester: "Rajesh Kumar",
    requesterRole: "Senior Site Engineer",
    amount: "₹ 75.0 Lakhs",
    priority: "High",
    date: "26 May 2026",
    status: "Pending"
  },
  {
    id: 2,
    type: "Investment",
    details: "Coimbatore Branch Operations Hub Expansion",
    requester: "Executive Board",
    requesterRole: "Corporate Strategy TL",
    amount: "₹ 1.5 Cr",
    priority: "High",
    date: "27 May 2026",
    status: "Pending"
  },
  {
    id: 3,
    type: "Capex",
    details: "Tower Crane High-Rise CAPEX - Skyline IT Park",
    requester: "Karthik R",
    requesterRole: "Project Director",
    amount: "₹ 1.2 Cr",
    priority: "Medium",
    date: "28 May 2026",
    status: "Pending"
  },
  {
    id: 4,
    type: "Opex",
    details: "Sub-Contractor Structural Invoice - ABC Foundations Ltd",
    requester: "Amit Kumar",
    requesterRole: "Procurement Manager",
    amount: "₹ 15.0 Lakhs",
    priority: "Low",
    date: "28 May 2026",
    status: "Pending"
  },
  {
    id: 5,
    type: "Material",
    details: "Bulk OPC 53 Grade Cement Supply Order - Skyline Heights",
    requester: "Vijay Kumar",
    requesterRole: "Store Manager",
    amount: "₹ 45.0 Lakhs",
    priority: "Medium",
    date: "28 May 2026",
    status: "Pending"
  },
  {
    id: 6,
    type: "Project",
    details: "Additional Civil Variations & Foundation Deepening",
    requester: "Priya Raj",
    requesterRole: "Construction Manager",
    amount: "₹ 8.5 Lakhs",
    priority: "Medium",
    date: "29 May 2026",
    status: "Pending"
  },
  {
    id: 101,
    type: "Capex",
    details: "Heavy Hydraulic Excavator Purchase (Tier-2 Fleet)",
    requester: "Karthik R",
    requesterRole: "Project Director",
    amount: "₹ 85.0 Lakhs",
    priority: "High",
    date: "20 May 2026",
    status: "Approved",
    chairmanRemarks: "Approved: Release 20% mobilization advance immediately. Balance linked to manufacturer commissioning certificate and 3-year warranty sign-off.",
    approvedBy: "Chairman (Executive Directive)",
    actionDate: "21 May 2026"
  },
  {
    id: 102,
    type: "Opex",
    details: "Skilled & Semi-Skilled Labor Biometric Settlement Week 20",
    requester: "Anita Sharma",
    requesterRole: "HR & Workforce Manager",
    amount: "₹ 24.5 Lakhs",
    priority: "High",
    date: "22 May 2026",
    status: "Approved",
    chairmanRemarks: "Approved on fast-track: Verified with biometric access gates at North Site. Finance to disburse direct DBT within 24 hours.",
    approvedBy: "Chairman (Executive Directive)",
    actionDate: "22 May 2026"
  },
  {
    id: 201,
    type: "Material",
    details: "Imported Premium Walnut Paneling for Clubhouse",
    requester: "Vijay Kumar",
    requesterRole: "Store Manager",
    amount: "₹ 18.0 Lakhs",
    priority: "Low",
    date: "15 May 2026",
    status: "Rejected",
    chairmanRemarks: "Rejected: Non-essential luxury finish upgrade exceeding baseline BOQ by 22%. Utilize local engineered seasoned teak or renegotiate vendor rates.",
    approvedBy: "Chairman (Executive Directive)",
    actionDate: "16 May 2026"
  }
];

export default function ApprovalCenter() {
  const [approvals, setApprovals] = useState<BoardApprovalItem[]>(INITIAL_BOARD_APPROVALS);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Decision & Remarks Modal State
  const [decisionModal, setDecisionModal] = useState<{
    isOpen: boolean;
    itemType: "BOARD_APPROVAL" | "PROJECT_LAUNCH";
    itemId: number;
    title: string;
    requester: string;
    amount?: string;
    isApprove: boolean;
    remarksText: string;
  } | null>(null);

  // View Detailed Remarks Modal
  const [viewRemarksModal, setViewRemarksModal] = useState<BoardApprovalItem | any | null>(null);

  const fetchApprovalsAndProjects = async () => {
    try {
      const sessionStr = typeof window !== "undefined" ? localStorage.getItem("buildcon_session") : null;
      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      let orgId = 1;
      if (sessionStr) {
        try {
          const s = JSON.parse(sessionStr);
          if (s.organizationId) orgId = s.organizationId;
        } catch (e) {
          console.warn("Session parse error", e);
        }
      }

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // 1. Fetch Board Approvals from Spring Boot backend
      try {
        const appRes = await fetch(`http://localhost:8081/api/chairman/approvals/org/${orgId}`, { headers });
        if (appRes.ok) {
          const data: BoardApprovalItem[] = await appRes.json();
          if (data && data.length > 0) {
            setApprovals(data);
          }
        }
      } catch (e) {
        console.warn("Failed to fetch approvals from backend, checking localStorage", e);
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem(`chairman_approvals_org_${orgId}`);
          if (saved) {
            setApprovals(JSON.parse(saved));
          }
        }
      }

      // 2. Fetch Pending Projects
      try {
        const projRes = await fetch(`http://localhost:8081/api/projects/org/${orgId}`, { headers });
        if (projRes.ok) {
          const pData = await projRes.json();
          setDbProjects(pData.filter((p: any) => p.status === "Planning" || p.status === "Pending"));
        }
      } catch (e) {
        console.warn("Failed to fetch pending projects from backend", e);
      }
    } catch (e) {
      console.error("Global fetch error in chairman approvals", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalsAndProjects();
  }, []);

  // Save state to localStorage helper
  const syncLocalApprovals = (newList: BoardApprovalItem[]) => {
    setApprovals(newList);
    if (typeof window !== "undefined") {
      try {
        const sessionStr = localStorage.getItem("buildcon_session");
        const orgId = sessionStr ? JSON.parse(sessionStr).organizationId || 1 : 1;
        localStorage.setItem(`chairman_approvals_org_${orgId}`, JSON.stringify(newList));
      } catch (e) {}
    }
  };

  // Open Decision & Remarks Modal
  const handleOpenDecisionModal = (
    itemType: "BOARD_APPROVAL" | "PROJECT_LAUNCH",
    itemId: number,
    title: string,
    requester: string,
    amount: string | undefined,
    isApprove: boolean
  ) => {
    // Default remark pre-fill based on action
    const defaultRemark = isApprove
      ? "Approved: Milestone payment authorized. Ensure full QA/QC checklist compliance before site execution."
      : "Rejected: Re-quote required with alternate vendor specifications to align with quarterly budget limits.";

    setDecisionModal({
      isOpen: true,
      itemType,
      itemId,
      title,
      requester,
      amount,
      isApprove,
      remarksText: defaultRemark
    });
  };

  // Submit Chairman Decision with Remarks
  const handleSubmitDecision = async () => {
    if (!decisionModal) return;
    const { itemType, itemId, isApprove, remarksText } = decisionModal;
    const actionStr = isApprove ? "Approved" : "Rejected";
    const dateFormatted = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (itemType === "BOARD_APPROVAL") {
      // 1. Update in backend API
      try {
        await fetch(`http://localhost:8081/api/chairman/approvals/${itemId}/action`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            action: actionStr,
            remarks: remarksText
          })
        });
      } catch (e) {
        console.warn("Backend action call failed, updating local state", e);
      }

      // 2. Update local state
      const updatedList = approvals.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status: actionStr as "Approved" | "Rejected",
            chairmanRemarks: remarksText,
            approvedBy: "Chairman (Executive Directive)",
            actionDate: `${dateFormatted}, ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
          };
        }
        return item;
      });
      syncLocalApprovals(updatedList);
    } else {
      // PROJECT_LAUNCH
      try {
        const endpoint = isApprove
          ? `http://localhost:8081/api/projects/${itemId}/approve`
          : `http://localhost:8081/api/projects/${itemId}/reject`;

        await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({ remarks: remarksText })
        });
      } catch (e) {
        console.warn("Backend project approve/reject failed", e);
      }
      setDbProjects(dbProjects.filter((p) => p.id !== itemId));
    }

    setDecisionModal(null);
  };

  // Filtered lists
  const pendingApprovals = approvals.filter((a) => a.status === "Pending");
  const approvedApprovals = approvals.filter((a) => a.status === "Approved");
  const rejectedApprovals = approvals.filter((a) => a.status === "Rejected");

  const currentList =
    tab === "pending" ? pendingApprovals : tab === "approved" ? approvedApprovals : rejectedApprovals;

  // Preset quick remark chips
  const quickRemarksTemplates = decisionModal?.isApprove
    ? [
        "Approved in full. Proceed with site procurement and ensure compliance with QA/QC standards.",
        "Approved with conditional 5% milestone retention pending structural audit.",
        "Approved up to negotiated cap limit. Finance to disburse in 2 tranches.",
        "Fast-tracked approval: Urgent concrete pour scheduled. Verified by Senior Site Engineer."
      ]
    : [
        "Rejected: Budget exceeds allocated quarterly capex allocation by 18%.",
        "Rejected: Missing structural soil test and QA signoff reports. Resubmit with attachments.",
        "Deferred: Requires alternative 3-quote vendor comparative evaluation before approval.",
        "Rejected: Non-essential luxury finish upgrade exceeding baseline BOQ by 22%."
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-amber-400" />
              Executive Governance Portal
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            08. CHAIRMAN BOARD APPROVALS & REPLIES
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review capital expenditures, purchase orders, and project launches. Requesters will receive your official executive remarks and directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{pendingApprovals.length + dbProjects.length} Total Pending</span>
          </div>
        </div>
      </div>

      {/* AI-Powered Project Launch Approvals Section */}
      {dbProjects.length > 0 && (
        <div className="bg-[#111A2E] border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
                Pending Project Launch Directives (PM Requests)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                New structural project proposals submitted by Project Managers. Approve or reject with your Chairman remarks.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
              {dbProjects.length} Projects Awaiting Decision
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 text-xs">
            {dbProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 bg-[#0E1726]/90 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      📍 {proj.location} • {proj.floors ? `${proj.floors} Stories` : "G+4"} • {proj.builtupSqft ? `${proj.builtupSqft.toLocaleString()} sqft` : "24,000 sqft"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold">
                    PLANNING REVIEW
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-[#0B111E] rounded-lg">
                  <div>
                    <span className="text-[9px] text-slate-500 block font-semibold">PM Target Budget</span>
                    <span className="font-bold font-mono text-white">
                      ₹ {proj.budget ? proj.budget.toLocaleString("en-IN") : "2.40 Cr"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block font-semibold">AI Recommended Budget</span>
                    <span className="font-bold font-mono text-emerald-400">
                      ₹ {proj.aiSuggestedBudget ? proj.aiSuggestedBudget.toLocaleString("en-IN") : "2.25 Cr"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[9px] text-slate-500 block font-semibold">AI Duration Forecast</span>
                    <span className="font-bold font-mono text-yellow-400">
                      {proj.aiEstimatedHours ? `${Math.floor(proj.aiEstimatedHours / 8)} Days` : "180 Days"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[9px] text-slate-500 block font-semibold">Estimated Completion</span>
                    <span className="font-bold font-mono text-cyan-400">
                      {proj.endDate || "2027-04-15"}
                    </span>
                  </div>
                </div>

                {proj.aiHazardWarnings && (
                  <div className="p-2.5 bg-red-950/25 border border-red-900/40 text-red-400 rounded-lg text-[11px] flex gap-2 items-start">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                    <div>
                      <span className="font-bold text-[10px] text-red-300">Hazard Warning: </span>
                      {proj.aiHazardWarnings}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleOpenDecisionModal(
                        "PROJECT_LAUNCH",
                        proj.id,
                        proj.name,
                        "Project Manager",
                        proj.budget ? `₹ ${proj.budget.toLocaleString("en-IN")}` : undefined,
                        true
                      )
                    }
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Add Remarks</span>
                  </button>

                  <button
                    onClick={() =>
                      handleOpenDecisionModal(
                        "PROJECT_LAUNCH",
                        proj.id,
                        proj.name,
                        "Project Manager",
                        proj.budget ? `₹ ${proj.budget.toLocaleString("en-IN")}` : undefined,
                        false
                      )
                    }
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px">
        <button
          onClick={() => setTab("pending")}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 ${
            tab === "pending"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approvals ({pendingApprovals.length})</span>
        </button>

        <button
          onClick={() => setTab("approved")}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 ${
            tab === "approved"
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved with Chairman Remarks ({approvedApprovals.length})</span>
        </button>

        <button
          onClick={() => setTab("rejected")}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 ${
            tab === "rejected"
              ? "text-rose-400 border-b-2 border-rose-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <X className="w-3.5 h-3.5" />
          <span>Rejected ({rejectedApprovals.length})</span>
        </button>
      </div>

      {/* Main Approvals Table */}
      <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-5 shadow-xl">
        {currentList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-[#0E1726]/90 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 font-bold rounded-l-xl">Type</th>
                  <th className="p-3.5 font-bold">Details & Proposal</th>
                  <th className="p-3.5 font-bold">Requester</th>
                  <th className="p-3.5 font-bold">Date</th>
                  <th className="p-3.5 font-bold">Amount</th>
                  <th className="p-3.5 font-bold">Priority</th>
                  {tab !== "pending" && <th className="p-3.5 font-bold">Chairman Reply / Directive</th>}
                  <th className="p-3.5 font-bold rounded-r-xl text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {currentList.map((ap) => (
                  <tr key={ap.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-white whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase">
                        {ap.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-200 max-w-xs">
                      <div>{ap.details}</div>
                      {ap.details && ap.details.includes("3D Building Model") && (
                        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono text-[9px] font-bold flex items-center gap-1">
                            🏢 3D BIM Model Attached
                          </span>
                          <a
                            href="/drawings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-[10px] font-bold underline flex items-center gap-0.5 transition"
                          >
                            <span>Inspect 3D</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}
                      {tab !== "pending" && ap.chairmanRemarks && (
                        <div className="mt-1 text-[11px] text-amber-300/90 font-serif italic line-clamp-1">
                          &ldquo;{ap.chairmanRemarks}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-white">{ap.requester}</div>
                      {ap.requesterRole && (
                        <div className="text-[10px] text-slate-400">{ap.requesterRole}</div>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">{ap.date}</td>
                    <td className="p-3.5 font-bold text-white whitespace-nowrap font-mono">{ap.amount}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          ap.priority === "High"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : ap.priority === "Medium"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {ap.priority}
                      </span>
                    </td>

                    {/* Chairman Remarks Column for Approved / Rejected */}
                    {tab !== "pending" && (
                      <td className="p-3.5 max-w-sm">
                        <div
                          className={`p-2.5 rounded-xl border text-[11px] ${
                            ap.status === "Approved"
                              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                              : "bg-rose-950/20 border-rose-500/30 text-rose-300"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold text-[10px] text-amber-400 uppercase tracking-wider mb-0.5">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Chairman Directive ({ap.actionDate || ap.date})</span>
                          </div>
                          <p className="italic text-slate-200 font-serif">
                            &ldquo;{ap.chairmanRemarks || "Approved without remarks."}&rdquo;
                          </p>
                        </div>
                      </td>
                    )}

                    <td className="p-3.5 text-center whitespace-nowrap">
                      {tab === "pending" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleOpenDecisionModal(
                                "BOARD_APPROVAL",
                                ap.id,
                                ap.details,
                                ap.requester,
                                ap.amount,
                                true
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1 transition"
                            title="Approve & Send Remarks"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() =>
                              handleOpenDecisionModal(
                                "BOARD_APPROVAL",
                                ap.id,
                                ap.details,
                                ap.requester,
                                ap.amount,
                                false
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 font-semibold text-xs flex items-center gap-1 transition"
                            title="Reject with Remarks"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setViewRemarksModal(ap)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 mx-auto transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Dossier</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
            <div className="text-sm font-bold text-white">No items found</div>
            <div className="text-xs text-slate-400 mt-1">This approval category is currently up to date.</div>
          </div>
        )}
      </div>

      {/* Executive Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Total Pending</div>
          <div className="text-2xl font-bold text-white mt-1">{pendingApprovals.length + dbProjects.length} Requests</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">High Priority POs</div>
          <div className="text-2xl font-bold text-red-400 mt-1">
            {pendingApprovals.filter((p) => p.priority === "High").length} Requests
          </div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Approved Total</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{approvedApprovals.length} Orders</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Rejected Total</div>
          <div className="text-2xl font-bold text-slate-300 mt-1">{rejectedApprovals.length} Orders</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Chairman Remark Audit</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">100% Signed</div>
        </div>
      </div>

      {/* Decision & Remarks Modal */}
      {decisionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl ${
                    decisionModal.isApprove ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {decisionModal.isApprove ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {decisionModal.isApprove ? "Approve Request & Issue Directive" : "Reject Request with Feedback"}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Requested by <span className="text-white font-semibold">{decisionModal.requester}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDecisionModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Request Summary Box */}
            <div className="p-3 bg-[#0B111E] rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400 font-semibold">Request Description:</div>
              <div className="font-bold text-white">{decisionModal.title}</div>
              {decisionModal.title && decisionModal.title.includes("3D Building Model") && (
                <div className="p-2.5 mt-2 bg-gradient-to-r from-cyan-950/40 via-slate-800/60 to-slate-800/80 border border-cyan-500/30 rounded-xl text-cyan-300 text-[11px] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">🏢 3D Architectural Model & IS 1200 BOQ Attached</span>
                  </div>
                  <a
                    href="/drawings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold underline flex items-center gap-1 transition shrink-0"
                  >
                    <span>Inspect 3D in Studio</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              )}
              {decisionModal.amount && (
                <div className="text-emerald-400 font-mono font-bold mt-1">Amount: {decisionModal.amount}</div>
              )}
            </div>

            {/* Chairman Remarks Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Chairman Official Remarks & Directives:
              </label>
              <textarea
                rows={3}
                value={decisionModal.remarksText}
                onChange={(e) =>
                  setDecisionModal({
                    ...decisionModal,
                    remarksText: e.target.value
                  })
                }
                placeholder="Type your official executive remarks here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-sans"
              />
            </div>

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-semibold block">Quick Executive Templates:</span>
              <div className="flex flex-wrap gap-1.5">
                {quickRemarksTemplates.map((template, idx) => (
                  <button
                    key={`tmpl-${idx}`}
                    type="button"
                    onClick={() =>
                      setDecisionModal({
                        ...decisionModal,
                        remarksText: template
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700 transition text-left"
                  >
                    {template.slice(0, 48)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDecisionModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition ${
                  decisionModal.isApprove
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-500/20"
                    : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-500/20"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {decisionModal.isApprove ? "Confirm Approval & Dispatch Remarks" : "Confirm Rejection"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Detailed Dossier Modal */}
      {viewRemarksModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Executive Approval Record</h3>
              </div>
              <button
                onClick={() => setViewRemarksModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#0B111E] rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Proposal</div>
                <div className="text-sm font-bold text-white mt-0.5">{viewRemarksModal.details}</div>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                  <div>
                    <span className="text-slate-400">Requested By: </span>
                    <span className="text-slate-200 font-semibold">{viewRemarksModal.requester}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Order Amount: </span>
                    <span className="text-emerald-400 font-mono font-bold">{viewRemarksModal.amount}</span>
                  </div>
                </div>
              </div>

              {/* Chairman Signed Remarks Box */}
              <div
                className={`p-4 rounded-xl border ${
                  viewRemarksModal.status === "Approved"
                    ? "bg-emerald-950/25 border-emerald-500/40"
                    : "bg-rose-950/25 border-rose-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    Official Chairman Directive
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {viewRemarksModal.actionDate || viewRemarksModal.date}
                  </span>
                </div>
                <p className="text-sm text-slate-100 font-serif italic leading-relaxed">
                  &ldquo;{viewRemarksModal.chairmanRemarks || "Approved without remarks."}&rdquo;
                </p>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Authorized by: {viewRemarksModal.approvedBy || "Chairman"}</span>
                  <span className="text-emerald-400 font-bold">Status: {viewRemarksModal.status}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewRemarksModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      <AIAssistantBar
        suggestions={[
          "Show pending purchase orders",
          "Approve high priority materials with advance release remarks",
          "Review rejected Capex requests",
          "Export chairman directive log"
        ]}
      />
    </div>
  );
}
