"use client";
import React, { useState } from "react";
import { Check, X, CheckCircle2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface ApprovalItem {
  id: number;
  type: string;
  details: string;
  requester: string;
  amount: string;
  priority: string;
}

const INITIAL_PENDING: ApprovalItem[] = [
  { id: 1, type: "PO", details: "Steel Procurement - Commercial Complex", requester: "Rajesh Kumar", amount: "₹ 75.0 Lakhs", priority: "High" },
  { id: 2, type: "Investment", details: "Coimbatore Branch Opening", requester: "Board", amount: "₹ 1.5 Cr", priority: "High" },
  { id: 3, type: "Capex", details: "Tower Crane CAPEX - IT Park I", requester: "Karthik R", amount: "₹ 1.2 Cr", priority: "Medium" },
  { id: 4, type: "Opex", details: "Sub-Contractor Invoice ABC Ltd", requester: "Amit Kumar", amount: "₹ 15.0 Lakhs", priority: "Low" },
  { id: 5, type: "Material", details: "Cement Supply Order - Skyline", requester: "Vijay Kumar", amount: "₹ 45.0 Lakhs", priority: "Medium" },
  { id: 6, type: "Project", details: "Additional Civil Work (Variations)", requester: "Priya Raj", amount: "₹ 8.5 Lakhs", priority: "Medium" },
];

export default function ApprovalsCenter() {
  const [pending, setPending] = useState<ApprovalItem[]>(INITIAL_PENDING);
  const [approvedCount, setApprovedCount] = useState(24);
  const [rejectedCount, setRejectedCount] = useState(2);

  const handleAction = (id: number, approve: boolean) => {
    if (approve) {
      setApprovedCount(approvedCount + 1);
    } else {
      setRejectedCount(rejectedCount + 1);
    }
    setPending(pending.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">10. APPROVAL CENTER</h2>
        <p className="text-xs text-slate-400">Review pending purchase orders, contractor invoices, variations and budget releases</p>
      </div>

      {/* Approvals Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Pending Corporate Approvals ({pending.length})</h3>

        {pending.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-350">
              <thead className="bg-[#0E1726]/80 text-slate-405 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 font-semibold rounded-l-lg">Type</th>
                  <th className="p-3 font-semibold">Details</th>
                  <th className="p-3 font-semibold">Requester</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Priority</th>
                  <th className="p-3 font-semibold rounded-r-lg text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pending.map((ap) => (
                  <tr key={ap.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase">{ap.type}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-200">{ap.details}</td>
                    <td className="p-3">{ap.requester}</td>
                    <td className="p-3 font-semibold text-white">{ap.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        ap.priority === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        ap.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {ap.priority}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleAction(ap.id, true)} className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors" title="Approve">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleAction(ap.id, false)} className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors" title="Reject">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
            <div className="text-sm font-bold text-white">All caught up!</div>
            <div className="text-xs text-slate-400 mt-1">No pending approvals remaining.</div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Pending Approvals</div>
          <div className="text-2xl font-bold text-white mt-1">{pending.length}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Approved (MTD)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{approvedCount}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Rejected (MTD)</div>
          <div className="text-2xl font-bold text-slate-400 mt-1">{rejectedCount}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">High Priority Limit</div>
          <div className="text-2xl font-bold text-red-400 mt-1">₹ 50 Lakhs</div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Audit logs", "Procurement limits criteria", "Vendor details"]} />
    </div>
  );
}
