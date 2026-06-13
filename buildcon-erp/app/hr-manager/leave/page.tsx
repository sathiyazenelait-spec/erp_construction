"use client";
import React, { useState } from "react";
import { Check, X, ClipboardCheck, AlertCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface LeaveRequest {
  id: string;
  name: string;
  role: string;
  type: string;
  duration: string;
  reason: string;
}

const initialRequests: LeaveRequest[] = [
  { id: "LVR-101", name: "Amit Patel", role: "Site Supervisor", type: "Sick Leave", duration: "3 Days (29 May - 31 May)", reason: "Medical Treatment & recovery" },
  { id: "LVR-102", name: "Rohan Sharma", role: "Civil Engineer", type: "Earned Leave", duration: "5 Days (02 Jun - 06 Jun)", reason: "Family wedding event" },
  { id: "LVR-103", name: "Vikram Singh", role: "Accounts Lead", type: "Casual Leave", duration: "1 Day (30 May)", reason: "Personal work at registry office" }
];

export default function LeaveManagement() {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [message, setMessage] = useState<string | null>(null);

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
    setMessage(`Leave request ${id} has been ${action}.`);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">LEAVE MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Review employee leave applications, check balances history, and authorize leave request approvals.</p>
      </div>

      {message && (
        <div className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 p-3 rounded-lg text-xs font-semibold text-emerald-400">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Pending Leave Requests</div>
          <div className="text-xl font-bold text-white mt-1">{requests.length} Requests</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Approved (MTD)</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">32 Approved</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Rejected (MTD)</div>
          <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400 mt-1">4 Rejected</div>
        </div>
      </div>

      {/* Requests Queue */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Pending Leave Approvals Queue</h3>
        {requests.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            🎉 All pending leave applications are processed!
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((item) => (
              <div key={item.id} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.id}</span>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-slate-200 font-semibold">{item.name} ({item.role})</div>
                  <div className="text-slate-400">Reason: {item.reason}</div>
                  <div className="text-[10px] text-slate-500">{item.duration}</div>
                </div>
                <div className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
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
            ))}
          </div>
        )}
      </div>

      <AIAssistantBar suggestions={["Show leave balances history", "Alert manager about high pending count", "Check company holiday calendar"]} />
    </div>
  );
}
