"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Megaphone, Activity, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function CampaignPerformance() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);

  async function loadData() {
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
      const activeOrgId = session.organizationId;
      if (!activeOrgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:8081/api/marketing-manager/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
        setTrends(data.trends || []);
      } else {
        setErrorMsg("Failed to retrieve campaign data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Compute dynamic stats from campaigns
  const activeCampaigns = campaigns.filter(c => c.status === "Active" || !c.status).length;

  const avgCtr = useMemo(() => {
    const valid = campaigns.filter(c => c.ctr);
    if (valid.length === 0) return "N/A";
    const sum = valid.reduce((acc, c) => acc + parseFloat(c.ctr || "0"), 0);
    return `${(sum / valid.length).toFixed(2)}%`;
  }, [campaigns]);

  const avgCpc = useMemo(() => {
    const valid = campaigns.filter(c => c.cpc);
    if (valid.length === 0) return "N/A";
    const sum = valid.reduce((acc, c) => acc + parseFloat(c.cpc || "0"), 0);
    return `₹${(sum / valid.length).toFixed(2)}`;
  }, [campaigns]);

  // Build CTR vs CPC trend chart from trends data
  const trendChartData = useMemo(() => {
    return trends.map(t => ({
      m: t.month || t.label,
      CTR: t.value1 || 0,
      CPC: t.value2 || 0,
    }));
  }, [trends]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">CAMPAIGN PERFORMANCE</h2>
          <p className="text-xs text-slate-400">Monitor click-through rates (CTR), cost-per-click (CPC), impressions, and conversion trends across active campaigns.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading campaign performance data from database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Active Campaigns</div>
                <div className="text-xl font-bold text-white mt-1">{activeCampaigns} Campaigns</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Avg CTR %</div>
                <div className="text-xl font-bold text-white mt-1">{avgCtr} (MTD)</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Avg Cost Per Click (CPC)</div>
                <div className="text-xl font-bold text-purple-400 mt-1">{avgCpc}</div>
              </div>
            </div>
          </div>

          {/* Line Chart - trends */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">CTR (%) vs CPC (INR) Trends</h3>
            <div className="h-64">
              {trendChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                    <Line name="CTR (%)" type="monotone" dataKey="CTR" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line name="CPC (INR)" type="monotone" dataKey="CPC" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No trend data available.
                </div>
              )}
            </div>
          </div>

          {/* Campaigns diagnostics table */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Campaign Detailed Diagnostics</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">Campaign ID</th>
                    <th className="pb-2">Campaign Name</th>
                    <th className="pb-2">Impressions</th>
                    <th className="pb-2">Clicks</th>
                    <th className="pb-2">CTR %</th>
                    <th className="pb-2">CPC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {campaigns.map((c, idx) => (
                    <tr key={c.id || idx}>
                      <td className="py-3 font-semibold text-slate-400">{c.campaignId || `CMP-${String(idx + 1).padStart(3, "0")}`}</td>
                      <td className="text-slate-200 font-medium">{c.name || c.campaignName}</td>
                      <td className="text-slate-350">{c.impressions != null ? Number(c.impressions).toLocaleString("en-IN") : "N/A"}</td>
                      <td className="text-slate-350 font-bold">{c.clicks != null ? Number(c.clicks).toLocaleString("en-IN") : "N/A"}</td>
                      <td className="text-emerald-400 font-bold">{c.ctr != null ? `${c.ctr}%` : "N/A"}</td>
                      <td className="text-white font-semibold">{c.cpc != null ? `₹${c.cpc}` : "N/A"}</td>
                    </tr>
                  ))}
                  {campaigns.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400">No campaigns registered in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Suggest bid adjustments for top campaign", "Compare Google vs Meta CTR logs", "Generate campaign performance report"]} />
    </div>
  );
}
