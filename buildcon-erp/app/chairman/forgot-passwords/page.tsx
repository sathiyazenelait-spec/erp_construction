"use client";
import React, { useState, useEffect } from "react";
import { KeyRound, Check, X, ShieldAlert, Clock, RefreshCw, CheckCircle2, User } from "lucide-react";
import { getSession } from "@/lib/auth";
import AIAssistantBar from "@/components/AIAssistantBar";

interface ResetRequest {
  id: number;
  username: String;
  email: String;
  role: string;
  requestedPassword: String;
  status: String;
  createdAt: string;
}

export default function ChairmanForgotPasswordRequests() {
  const [requests, setRequests] = useState<ResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("buildcon_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      
      const s = getSession();
      if (!s || !s.organizationId) {
        throw new Error("No active organization found in your session.");
      }

      const res = await fetch(`https://erp-construction.onrender.com/api/forgot-password/chairman/pending/${s.organizationId}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to load staff forgot password requests.");
      const data = await res.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setActioningId(id);
      setError("");
      setSuccessMsg("");
      const res = await fetch(`https://erp-construction.onrender.com/api/forgot-password/approve/${id}`, {
        method: "POST",
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to approve request.");
      setSuccessMsg("Reset request approved! User password has been reset.");
      await fetchRequests();
    } catch (err: any) {
      setError(err.message || "Failed to approve request.");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActioningId(id);
      setError("");
      setSuccessMsg("");
      const res = await fetch(`https://erp-construction.onrender.com/api/forgot-password/reject/${id}`, {
        method: "POST",
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reject request.");
      setSuccessMsg("Request rejected successfully.");
      await fetchRequests();
    } catch (err: any) {
      setError(err.message || "Failed to reject request.");
    } finally {
      setActioningId(null);
    }
  };

  const cleanRoleName = (rawRole: string) => {
    return rawRole.replace("ROLE_", "").replace(/_/g, " ");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">STAFF PASSWORD RESET APPROVALS</h2>
          <p className="text-xs text-slate-400">Manage password recovery and resets requested by your organization employees.</p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="p-2 bg-[#111A2E] hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-white rounded-lg transition duration-200"
          title="Reload Requests"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-400 flex items-center gap-2 bg-red-950/20 border border-red-500/20 p-4 rounded-xl">
          <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="text-xs text-emerald-400 flex items-center gap-2 bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading && requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-xs gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-amber-500" />
          <span>Loading pending employee requests...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#111A2E]/50 border border-slate-800 rounded-2xl text-center">
          <KeyRound className="h-10 w-10 text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-white">No Pending Reset Requests</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">There are no employee password recovery requests pending for your organization at this time.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#111A2E] border border-slate-850 rounded-2xl">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold bg-[#15223e]/50">
                <th className="p-4">Staff Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Requested Password</th>
                <th className="p-4">Submission Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition duration-150">
                  <td className="p-4 font-semibold text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-amber-400" />
                    {req.username}
                  </td>
                  <td className="p-4 text-slate-350 capitalize">
                    <span className="bg-slate-800 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                      {cleanRoleName(req.role)}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-amber-400 bg-amber-950/10 px-2 py-1 rounded select-all inline-block mt-2">
                    {req.requestedPassword}
                  </td>
                  <td className="p-4 text-slate-450 flex items-center gap-1.5 mt-2">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    {new Date(req.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={actioningId !== null}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg flex items-center gap-1 font-bold shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 transition"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={actioningId !== null}
                        className="px-3 py-1.5 bg-red-650 hover:bg-red-650/90 text-white border border-red-500/20 rounded-lg flex items-center gap-1 font-bold active:scale-95 transition"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AIAssistantBar suggestions={["Security policies", "Password reset history", "Access controls logs"]} />
    </div>
  );
}
