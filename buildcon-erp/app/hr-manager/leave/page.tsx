"use client";
import React, { useState, useEffect } from "react";
import { Check, X, ClipboardCheck, AlertCircle, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface LeaveRequest {
  id: number;
  employeeName: string;
  employeeRole: string;
  leaveType: string;
  duration: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function LeaveManagement() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadRequests() {
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

      const res = await fetch(`https://erp-construction.onrender.com/api/hr-manager/leave/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        setErrorMsg("Failed to retrieve leave requests queue.");
      }
    } catch (e) {
      console.error("Failed to load leave requests:", e);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id: number, action: "Approved" | "Rejected") => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`https://erp-construction.onrender.com/api/hr-manager/leave/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(action)
      });

      if (res.ok) {
        setMessage(`Leave request LVR-${id} has been ${action}.`);
        setTimeout(() => setMessage(null), 3000);
        loadRequests();
      } else {
        alert("Failed to update leave request status.");
      }
    } catch (err) {
      console.error("Error processing leave request:", err);
    }
  };

  const pendingRequests = requests.filter(r => r.status === "Pending");
  const approvedCount = requests.filter(r => r.status === "Approved").length;
  const rejectedCount = requests.filter(r => r.status === "Rejected").length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">LEAVE MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Review employee leave applications, check balances history, and authorize leave request approvals.</p>
        </div>
        <button
          onClick={loadRequests}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-3 rounded-lg text-xs font-semibold">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-955/20 border border-red-500/20 text-red-400 rounded-xl p-5 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="text-xs font-semibold">{errorMsg}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Pending Leave Requests</div>
          <div className="text-xl font-bold text-white mt-1">{pendingRequests.length} Requests</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Approved (MTD)</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{approvedCount} Approved</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Rejected (MTD)</div>
          <div className="text-xl font-bold text-rose-400 mt-1">{rejectedCount} Rejected</div>
        </div>
      </div>

      {/* Requests Queue */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Pending Leave Approvals Queue</h3>
        {loading ? (
          <div className="py-8 text-center text-slate-450 text-xs flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
            <span>Fetching leave requests queue...</span>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            🎉 All pending leave applications are processed!
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((item) => (
              <div key={item.id} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">LVR-{item.id}</span>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {item.leaveType}
                    </span>
                  </div>
                  <div className="text-slate-200 font-semibold">{item.employeeName} ({item.employeeRole})</div>
                  <div className="text-slate-400">Reason: {item.reason}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.duration}</div>
                </div>
                <div className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                  <button
                    onClick={() => handleAction(item.id, "Rejected")}
                    className="h-8 w-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 grid place-items-center text-rose-450 text-rose-400 transition"
                    title="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "Approved")}
                    className="h-8 w-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 grid place-items-center text-emerald-450 text-emerald-400 transition"
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
