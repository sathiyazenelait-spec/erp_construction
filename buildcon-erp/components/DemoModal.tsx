"use client";
import React, { useState } from "react";
import { Sparkles, Building2, Crown, ShieldAlert, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  // Chairman States
  const [chairmanName, setChairmanName] = useState("");
  const [chairmanUsername, setChairmanUsername] = useState("");
  const [chairmanEmail, setChairmanEmail] = useState("");
  const [chairmanPassword, setChairmanPassword] = useState("");
  const [chairmanPhone, setChairmanPhone] = useState("");

  // Org States
  const [orgName, setOrgName] = useState("");
  const [orgDomain, setOrgDomain] = useState("");
  const [orgLocation, setOrgLocation] = useState("");
  const [orgPhone, setOrgPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdOrg, setCreatedOrg] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: orgName.trim(),
        domain: orgDomain.trim(),
        subscriptionTier: "Trial",
        location: orgLocation.trim(),
        phone: orgPhone.trim(),
        chairmanEmail: chairmanEmail.trim(),
        chairmanPassword: chairmanPassword.trim(),
        chairmanUsername: chairmanUsername.trim(),
        chairmanName: chairmanName.trim(),
        chairmanPhone: chairmanPhone.trim()
      };

      const res = await fetch("https://erp-construction.onrender.com/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create demo workspace.");
      }

      setCreatedOrg(data);
    } catch (err: any) {
      setError(err.message || "Could not register trial workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#0c1322] via-[#0d172a] to-[#120f22] border-2 border-blue-500/50 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-[#FF2E93]/5 blur-[60px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-blue-400" /> Start 3-Day Free Demo
          </h3>
          <button
            onClick={() => {
              onClose();
              setCreatedOrg(null);
              setError("");
            }}
            className="text-slate-400 hover:text-white transition font-bold"
          >
            ✕
          </button>
        </div>

        {!createdOrg ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-6 text-left">
            <p className="text-xs text-slate-400 leading-relaxed">
              Create a free trial workspace instantly. Fill in the details to setup your corporate profile and the first Chairman account.
            </p>

            {/* Chairman section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-blue-900/30 pb-2">
                <Crown className="h-4 w-4" /> Chairman (Owner) Account Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={chairmanName}
                    onChange={(e) => setChairmanName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. johndoe"
                    className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={chairmanUsername}
                    onChange={(e) => setChairmanUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@domain.com"
                    className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={chairmanEmail}
                    onChange={(e) => setChairmanEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={chairmanPassword}
                    onChange={(e) => setChairmanPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={chairmanPhone}
                  onChange={(e) => setChairmanPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Org section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-blue-900/30 pb-2">
                <Building2 className="h-4 w-4" /> Organization Workspace Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Builders Ltd"
                    className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Domain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. apexbuilders.com"
                    className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={orgDomain}
                    onChange={(e) => setOrgDomain(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location / Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, India"
                    className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={orgLocation}
                    onChange={(e) => setOrgLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Company Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 22 12345678"
                    className="w-full bg-[#0a1120] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 p-3 rounded-xl">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-900 shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:brightness-110 text-white font-bold py-3.5 rounded-xl text-xs transition duration-300 active:scale-98 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Registering Demo Workspace...
                  </>
                ) : (
                  <>
                    Start Demo <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-bounce" />
            
            <div>
              <h4 className="text-lg font-bold text-white">Demo Created Successfully!</h4>
              <p className="text-xs text-slate-400 mt-2 max-w-sm">
                Your 3-day free trial has started. Please note down your organization credentials to unlock the portal entrance gate:
              </p>
            </div>

            <div className="bg-slate-900/80 border border-blue-900/30 rounded-2xl p-5 w-full max-w-sm space-y-3 font-mono text-left text-xs">
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-2">Gate Credentials</div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-500">Org Name:</span>
                <span className="col-span-2 text-white font-bold">{createdOrg.name}</span>
                <span className="text-slate-500">Username:</span>
                <span className="col-span-2 text-emerald-400 select-all font-bold">{createdOrg.orgUsername}</span>
                <span className="text-slate-500">Password:</span>
                <span className="col-span-2 text-emerald-400 select-all font-bold">{createdOrg.orgPassword}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
              Use these credentials in the <strong>Get Into Portal</strong> gate on the landing page first, then use your Chairman email & password to sign into the Chairman Portal.
            </p>

            <button
              onClick={() => {
                onClose();
                setCreatedOrg(null);
                // Pre-fill organization name in local storage if possible
                localStorage.setItem("selected_login_org", createdOrg.name);
                localStorage.setItem("selected_login_tier", "Trial");
                localStorage.setItem("selected_login_org_id", createdOrg.id.toString());
                window.location.reload();
              }}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/10 hover:brightness-110 active:scale-98"
            >
              Done, Go to Portals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
