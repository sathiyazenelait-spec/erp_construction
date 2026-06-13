"use client";
import React, { useState } from "react";
import { Check, X, ShieldCheck, FileCheck, Landmark } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface ApprovalItem {
  id: string;
  type: string;
  requester: string;
  details: string;
  amount: string;
  date: string;
}

const initialApprovals: ApprovalItem[] = [
  { id: "APV-001", type: "Vendor Payout", requester: "Procurement Manager", details: "Ultratech Cement invoice payment", amount: "₹48,00,000", date: "28 May 2025" },
  { id: "APV-002", type: "Purchase Order", requester: "Project Director", details: "Structural Steel procurement - Site B", amount: "₹62,00,000", date: "28 May 2025" },
  { id: "APV-003", type: "Expense Reimbursement", requester: "Admin Lead", details: "Fuel & site logistics voucher clearance", amount: "₹8,50,000", date: "27 May 2025" },
  { id: "APV-004", type: "Contractor Advance", requester: "MD Office", details: "Mobilization advance for excavation vendor", amount: "₹15,00,000", date: "26 May 2025" }
];

export default function ApprovalsCenter() {
  const [items, setItems] = useState<ApprovalItem[]>(initialApprovals);
  const [message, setMessage] = useState<string | null>(null);

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setMessage(`Voucher ${id} has been successfully ${action}.`);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">APPROVALS CENTER</h2>
        <p className="text-xs text-slate-400">Review pending commercial requests, high-value purchase orders, contractor payments, and reimbursement vouchers.</p>
      </div>

      {message && (
        <div className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 p-3 rounded-lg text-xs font-semibold text-emerald-400 animate-fadeIn">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Pending Approvals</div>
            <div className="text-xl font-bold text-white">{items.length} Requests</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Approved (MTD)</div>
            <div className="text-xl font-bold text-white">₹8.4 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Treasury Budget Impact</div>
            <div className="text-xl font-bold text-white">₹1.33 Cr Pending</div>
          </div>
        </div>
      </div>

      {/* Pending Items */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Pending Authorization Queue</h3>
        {items.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            🎉 All pending financial vouchers and authorizations are cleared.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.id}</span>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-slate-200 font-medium">{item.details}</div>
                  <div className="text-[10px] text-slate-450 text-slate-400">
                    Requested by <span className="text-slate-300 font-semibold">{item.requester}</span> • {item.date}
                  </div>
                </div>
                <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-2.5 md:pt-0">
                  <span className="text-emerald-400 font-bold text-sm">{item.amount}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(item.id, "Rejected")}
                      className="h-8 w-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 grid place-items-center text-rose-400 transition"
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "Approved")}
                      className="h-8 w-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 grid place-items-center text-emerald-400 transition"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AIAssistantBar suggestions={["Approve all vendor payouts", "Check budget impact for APV-002", "Show audit trail for APV-001"]} />
    </div>
  );
}
