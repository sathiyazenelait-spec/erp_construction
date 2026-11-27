"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { FolderKanban, Star, Award, Plus, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function OpportunitiesOverview() {
  const [opportunitiesData, setOpportunitiesData] = useState<any[]>([
    { id: 1, p: "IT Park Project - Chennai", v: 20.0, w: 70, stage: "Proposal" },
    { id: 2, p: "Villa Community - ECR", v: 8.0, w: 60, stage: "Negotiation" },
    { id: 3, p: "Government School - Trichy", v: 15.0, w: 65, stage: "Proposal" },
    { id: 4, p: "Hospital Building - Madurai", v: 12.0, w: 40, stage: "Inquiry" },
  ]);

  const [kpi, setKpi] = useState({
    pipelineValue: "₹ 55.0 Cr",
    weightedValue: "₹ 35.8 Cr",
    avgWinRate: "58.7%"
  });

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOpp, setNewOpp] = useState({
    p: "",
    v: 10.0,
    w: 60,
    stage: "Proposal"
  });

  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/opportunities/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.opportunities) setOpportunitiesData(data.opportunities);
        if (data.kpi) setKpi(data.kpi);
      }
    } catch (err) {
      console.warn("Backend opportunities fetch failed, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleAddOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.p) return;

    const payload = { ...newOpp, id: opportunitiesData.length + 1 };
    setOpportunitiesData([payload, ...opportunitiesData]);
    setShowAddModal(false);

    try {
      await fetch(`http://localhost:8081/api/business-director/opportunities/org/${orgId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Failed to persist opportunity:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">03. OPPORTUNITIES</h2>
          <p className="text-xs text-slate-400">Track incoming client deals, estimates, and win probability matrices</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Deal</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Pipeline Opportunities</div>
          <div className="text-2xl font-bold text-white mt-1">{kpi.pipelineValue}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Weighted Value</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{kpi.weightedValue}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Average Win Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{kpi.avgWinRate}</div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Pipeline Registry ({opportunitiesData.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Opportunity Project</th>
                <th className="p-3 font-semibold">Stage</th>
                <th className="p-3 font-semibold text-right">Value (₹ Cr)</th>
                <th className="p-3 font-semibold text-center">Probability</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">Weighted (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {opportunitiesData.map((op, idx) => (
                <tr key={op.id || idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                    <FolderKanban className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>{op.p}</span>
                  </td>
                  <td className="p-3 text-slate-400">{op.stage}</td>
                  <td className="p-3 font-bold text-right font-mono text-white">₹ {Number(op.v).toFixed(1)} Cr</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {op.w}%
                    </span>
                  </td>
                  <td className="p-3 font-bold text-right font-mono text-blue-400">
                    ₹ {((Number(op.v) * Number(op.w)) / 100).toFixed(1)} Cr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Opportunity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create New Opportunity</h3>
            <form onSubmit={handleAddOpp} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Extension Line B"
                  value={newOpp.p}
                  onChange={(e) => setNewOpp({ ...newOpp, p: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Value (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={newOpp.v}
                    onChange={(e) => setNewOpp({ ...newOpp, v: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Win Probability (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newOpp.w}
                    onChange={(e) => setNewOpp({ ...newOpp, w: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Deal Stage</label>
                <select
                  value={newOpp.stage}
                  onChange={(e) => setNewOpp({ ...newOpp, stage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Inquiry">Inquiry</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Contract Finalization">Contract Finalization</option>
                </select>
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
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Opportunities with high win probability", "Follow-up suggestions", "Pipeline overview"]} />
    </div>
  );
}
