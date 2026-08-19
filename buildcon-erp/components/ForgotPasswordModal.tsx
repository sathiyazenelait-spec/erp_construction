"use client";
import React, { useState } from "react";
import { KeyRound, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [requestedPassword, setRequestedPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("https://erp-construction.onrender.com/api/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, requestedPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request.");
      }

      setSuccess(true);
      setUsernameOrEmail("");
      setRequestedPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#0c1322] via-[#0d172a] to-[#120f22] border border-blue-900/40 rounded-3xl p-8 shadow-2xl shadow-blue-900/10 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-white">
            <KeyRound className="h-5 w-5 text-blue-400" /> Request Password Reset
          </h3>
          <button
            onClick={() => {
              onClose();
              setError("");
              setSuccess(false);
            }}
            className="text-slate-400 hover:text-white transition font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Submit your username or email and the password you wish to set. Chairmen requests will be sent to the Super Admin. Other requests will be sent to your Chairman.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Username or Email
            </label>
            <input
              type="text"
              required
              placeholder="e.g. john@buildcon.com"
              className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Requested New Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={requestedPassword}
              onChange={(e) => setRequestedPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 p-3 rounded-xl">
              <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl">
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Request submitted successfully! Please wait for approval.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:brightness-110 text-white font-bold py-3 rounded-xl text-xs transition duration-300 active:scale-98 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Submit Reset Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
