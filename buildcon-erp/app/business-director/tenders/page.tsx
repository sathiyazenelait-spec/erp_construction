"use client";
import React, { useState, useEffect } from "react";
import { FileText, Trophy, Clock, CheckCircle2, AlertTriangle, Plus, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function TenderManagement() {
  const [tendersLog, setTendersLog] = useState<any[]>([
    { id: 1, name: "IT Park Phase - 2", value: "₹ 25.0 Cr", status: "Shortlisted", date: "15 June 2025" },
    { id: 2, name: "Govt School Building", value: "₹ 12.0 Cr", status: "Won", date: "28 May 2025" },
    { id: 3, name: "Highway Rest Area - ECR", value: "₹ 8.0 Cr", status: "Participated", date: "25 May 2025" },
    { id: 4, name: "Medical College - Madurai", value: "₹ 40.0 Cr", status: "Lost", date: "18 May 2025" },
    { id: 5, name: "Police Station - Coimbatore", value: "₹ 6.0 Cr", status: "Shortlisted", date: "02 June 2025" },
    { id: 6, name: "Bus Terminal - Salem", value: "₹ 16.0 Cr", status: "Won", date: "12 May 2025" },
  ]);

  const [kpi, setKpi] = useState({
    totalTenders: 35,
    participated: "22 Bids",
    shortlisted: "8 Bids",
    won: "4 Won"
  });

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTender, setNewTender] = useState({
    name: "",
    value: "₹ 15.0 Cr",
    status: "Participated"
  });

  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/tenders/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tenders) setTendersLog(data.tenders);
        if (data.kpi) setKpi(data.kpi);
      }
    } catch (err) {
      console.warn("Backend tenders fetch failed, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleAddTender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTender.name) return;

    const payload = {
      ...newTender,
      id: tendersLog.length + 1,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    };

    setTendersLog([payload, ...tendersLog]);
    setKpi({ ...kpi, totalTenders: kpi.totalTenders + 1 });
    setShowAddModal(false);

    try {
      await fetch(`http://localhost:8081/api/business-director/tenders/org/${orgId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Failed to persist tender:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">03. TENDERS</h2>
          <p className="text-xs text-slate-400">Manage government bids, private tenders, status logs, and deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Participate in Tender</span>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">Total Tenders</div>
            <div className="text-2xl font-bold text-white mt-1">{kpi.totalTenders}</div>
          </div>
          <FileText className="h-8 w-8 text-blue-500/20" />
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Participated</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{kpi.participated}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Shortlisted</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{kpi.shortlisted}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Won Value</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{kpi.won}</div>
        </div>
      </div>

      {/* Tenders Registry */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Tender Submissions Directory ({tendersLog.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Tender Name</th>
                <th className="p-3 font-semibold text-right">Value (₹)</th>
                <th className="p-3 font-semibold text-center">Status</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">Deadline / Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tendersLog.map((t, idx) => (
                <tr key={t.id || idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-medium text-white flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>{t.name}</span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-white">{t.value}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === "Won" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      t.status === "Shortlisted" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      t.status === "Participated" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-400 font-mono">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tender Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Record New Tender Bid</h3>
            <form onSubmit={handleAddTender} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Tender / Bid Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Municipal Flyover Phase 1"
                  value={newTender.name}
                  onChange={(e) => setNewTender({ ...newTender, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Estimated Value</label>
                  <input
                    type="text"
                    required
                    placeholder="₹ 20.0 Cr"
                    value={newTender.value}
                    onChange={(e) => setNewTender({ ...newTender, value: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <select
                    value={newTender.status}
                    onChange={(e) => setNewTender({ ...newTender, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Participated">Participated</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
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
                  Save Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Tenders closing this week", "Win probability estimation", "Competitor bidding strategy"]} />
    </div>
  );
}
