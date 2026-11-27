"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, Award, Star, RefreshCw, Plus, Check } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function CompetitorAnalysis() {
  const [marketShare, setMarketShare] = useState<any[]>([
    { name: "BuildWell Constructions", value: 30, color: "#10B981" },
    { name: "Competitor A", value: 25, color: "#3B82F6" },
    { name: "Competitor B", value: 20, color: "#F59E0B" },
    { name: "Competitor C", value: 15, color: "#8B5CF6" },
    { name: "Competitor D", value: 10, color: "#64748B" },
  ]);

  const [winRates, setWinRates] = useState<any[]>([
    { name: "BuildWell", rate: 58 },
    { name: "Competitor A", rate: 45 },
    { name: "Competitor B", rate: 42 },
    { name: "Competitor C", rate: 38 },
  ]);

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({ name: "", share: 10, winRate: 40 });

  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/competitors/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.marketShare) setMarketShare(data.marketShare);
        if (data.winRates) setWinRates(data.winRates);
      }
    } catch (err) {
      console.warn("Backend not reachable or using local cache:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitor.name) return;

    const colors = ["#EC4899", "#14B8A6", "#F97316", "#06B6D4", "#A855F7"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const updatedMarketShare = [...marketShare, { name: newCompetitor.name, value: Number(newCompetitor.share), color: randomColor }];
    const updatedWinRates = [...winRates, { name: newCompetitor.name, rate: Number(newCompetitor.winRate) }];

    setMarketShare(updatedMarketShare);
    setWinRates(updatedWinRates);
    setShowAddModal(false);

    try {
      await fetch(`http://localhost:8081/api/business-director/competitors/org/${orgId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketShare: updatedMarketShare, winRates: updatedWinRates })
      });
    } catch (e) {
      console.warn("Failed to persist competitor update to backend:", e);
    }
  };

  const handleResetSeed = async () => {
    setLoading(true);
    try {
      await fetch(`http://localhost:8081/api/business-director/seed/org/${orgId}`, { method: "POST" });
      await fetchData();
    } catch (e) {
      console.warn("Seed reset error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">09. COMPETITOR ANALYSIS</h2>
          <p className="text-xs text-slate-400">Live market share tracking, bidding win-rate benchmarks, and competitor SWOT index</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Competitor</span>
          </button>
          <button
            onClick={handleResetSeed}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Reseed Data</span>
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Market Share Donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Market Share (%)</h3>
          <div className="flex items-center justify-around h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={marketShare} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {marketShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {marketShare.find((m) => m.name.toLowerCase().includes("buildwell"))?.value || 30}%
                </span>
                <span className="text-[8px] text-slate-400">BuildWell</span>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px] max-h-40 overflow-y-auto pr-2">
              {marketShare.map((m, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="text-slate-300 font-medium truncate max-w-[140px]">{m.name} ({m.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Win Rate Bar Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Bidding Win Rate Comparison (%)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winRates} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="rate" fill="#10B981" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SWOT Insights */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Competitor Strengths & Market Gaps</h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-[#0e1628] rounded-lg border border-slate-850">
            <strong className="text-emerald-400 font-bold block mb-1">BuildWell Edge</strong>
            On-time project milestones, ISO safety certifications, and unified AI cost forecasting dashboards.
          </div>
          <div className="p-3 bg-[#0e1628] rounded-lg border border-slate-850">
            <strong className="text-blue-400 font-bold block mb-1">Competitor A (Primary Threat)</strong>
            Aggressive pricing benchmarks on institutional bids, but faces delayed delivery histories.
          </div>
        </div>
      </div>

      {/* Add Competitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add New Competitor Record</h3>
            <form onSubmit={handleAddCompetitor} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Competitor Firm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Infra Corp"
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Market Share (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newCompetitor.share}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, share: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Win Rate (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newCompetitor.winRate}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, winRate: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
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
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold"
                >
                  Save Competitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Winning bids SWOT", "Optimize public tenders specs", "Review market opportunities"]} />
    </div>
  );
}
