"use client";
import React, { useState, useEffect } from "react";
import { FileEdit, CheckCircle2, AlertTriangle, XCircle, Plus, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function ProposalsCenter() {
  const [proposalsLog, setProposalsLog] = useState<any[]>([
    { id: "prop-1", name: "IT Park Project", client: "ABC Developers", value: "₹ 25.0 Cr", status: "Under Review", date: "15 June 2025" },
    { id: "prop-2", name: "Luxury Villas", client: "Oceanic Resorts", value: "₹ 8.0 Cr", status: "Accepted", date: "20 June 2025" },
    { id: "prop-3", name: "Commercial Complex", client: "XYZ Constructions", value: "₹ 12.0 Cr", status: "Under Review", date: "26 June 2025" },
    { id: "prop-4", name: "Apartment Project", client: "PQR Builders", value: "₹ 18.0 Cr", status: "Under Review", date: "28 June 2025" },
    { id: "prop-5", name: "Resort Project", client: "Oceanic Resorts", value: "₹ 7.8 Cr", status: "Rejected", date: "10 May 2025" },
    { id: "prop-6", name: "School Building", client: "Govt Schools", value: "₹ 12.0 Cr", status: "Accepted", date: "28 May 2025" },
  ]);

  const [kpi, setKpi] = useState({
    sent: 180,
    underReview: 60,
    accepted: 90,
    rejected: 15,
    conversionRate: "25.0%"
  });

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProp, setNewProp] = useState({
    name: "",
    client: "",
    value: "₹ 10.0 Cr",
    status: "Under Review"
  });

  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/proposals/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.proposals) setProposalsLog(data.proposals);
        if (data.kpi) setKpi(data.kpi);
      }
    } catch (err) {
      console.warn("Backend proposals fetch failed, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleAddProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.name) return;

    const payload = {
      ...newProp,
      id: "prop-" + (proposalsLog.length + 1),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    };

    setProposalsLog([payload, ...proposalsLog]);
    setKpi({ ...kpi, sent: kpi.sent + 1, underReview: kpi.underReview + 1 });
    setShowAddModal(false);

    try {
      await fetch(`http://localhost:8081/api/business-director/proposals/org/${orgId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Failed to persist proposal:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">08. PROPOSALS</h2>
          <p className="text-xs text-slate-400">Track sent proposals, accepted bids, and value distributions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Proposal</span>
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Proposals Sent</div>
          <div className="text-2xl font-bold text-white mt-1">{kpi.sent}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Under Review</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{kpi.underReview}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Accepted</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{kpi.accepted}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Rejected</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{kpi.rejected}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Conversion Rate</div>
          <div className="text-2xl font-bold text-white mt-1">{kpi.conversionRate}</div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Registry ({proposalsLog.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Project Title</th>
                <th className="p-3 font-semibold">Client Name</th>
                <th className="p-3 font-semibold text-right">Value</th>
                <th className="p-3 font-semibold text-center">Status</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">Submission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {proposalsLog.map((prop, idx) => (
                <tr key={prop.id || idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                    <FileEdit className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>{prop.name}</span>
                  </td>
                  <td className="p-3 text-slate-300">{prop.client}</td>
                  <td className="p-3 font-mono font-bold text-right text-white">{prop.value}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prop.status === "Accepted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      prop.status === "Under Review" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-400 font-mono">{prop.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Proposal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create Client Proposal</h3>
            <form onSubmit={handleAddProposal} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Proposal / Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IT Park Expansion"
                  value={newProp.name}
                  onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Client Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC Developers Ltd"
                  value={newProp.client}
                  onChange={(e) => setNewProp({ ...newProp, client: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Bid Value</label>
                  <input
                    type="text"
                    required
                    placeholder="₹ 15.0 Cr"
                    value={newProp.value}
                    onChange={(e) => setNewProp({ ...newProp, value: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <select
                    value={newProp.status}
                    onChange={(e) => setNewProp({ ...newProp, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Proposals awaiting signature", "Acceptance rate benchmarks", "High value bids"]} />
    </div>
  );
}
