"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Search, Compass, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function GoogleAdsConsole() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

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

      const res = await fetch(`https://erp-construction.onrender.com/api/marketing-manager/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
        setMetrics(data.metrics || []);
      } else {
        setErrorMsg("Failed to retrieve Google Ads data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const getMetricValue = (key: string, fallback: number) => {
    const found = metrics.find((m: any) => m.metricKey === key);
    return found ? found.metricValue : fallback;
  };

  // Filter Google Ads campaigns
  const googleCampaigns = useMemo(() =>
    campaigns.filter(c => c.platform === "Google Ads" || c.platform === "Google"),
    [campaigns]
  );

  const totalGoogleSpend = googleCampaigns.reduce((acc, c) => acc + (c.cost || 0), 0);
  const totalGoogleLeads = googleCampaigns.reduce((acc, c) => acc + (c.leads || 0), 0);

  const avgCtr = useMemo(() => {
    const valid = googleCampaigns.filter(c => c.ctr);
    if (valid.length === 0) return "N/A";
    const sum = valid.reduce((acc, c) => acc + parseFloat(c.ctr || "0"), 0);
    return `${(sum / valid.length).toFixed(1)}%`;
  }, [googleCampaigns]);

  const avgCpl = useMemo(() => {
    if (totalGoogleLeads === 0) return "N/A";
    return `₹${Math.round(totalGoogleSpend / totalGoogleLeads).toLocaleString("en-IN")}`;
  }, [totalGoogleSpend, totalGoogleLeads]);

  const spendInLakhs = (totalGoogleSpend / 100000).toFixed(1);

  const chartData = useMemo(() =>
    googleCampaigns.map(c => ({
      campaign: c.name || c.campaignName,
      spend: parseFloat(((c.cost || 0) / 100000).toFixed(2)),
      conversions: c.leads || 0,
    })),
    [googleCampaigns]
  );

  // Keywords from metrics (mgr_keyword_* keys or fallback)
  const keywordMetrics = metrics.filter(m => m.category === "google_keyword" || m.category === "seo_keyword");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">GOOGLE ADS PERFORMANCE</h2>
          <p className="text-xs text-slate-400">Track real-time search campaign metrics, search impression shares, click costs, and keyword conversion goals.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading Google Ads data from database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400">Google Ads Spend MTD</div>
              <div className="text-xl font-bold text-white mt-1">₹{spendInLakhs} Lakhs</div>
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400">Conversions Generated</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{totalGoogleLeads} Leads</div>
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400">Avg CTR</div>
              <div className="text-xl font-bold text-white mt-1">{avgCtr}</div>
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400">Avg Cost Per Lead (CPL)</div>
              <div className="text-xl font-bold text-purple-400 mt-1">{avgCpl}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Campaigns Bar Chart */}
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Conversions vs Spend (in Lakhs) by Campaign</h3>
              <div className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="campaign" stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                      <Bar name="Spend (₹ L)" dataKey="spend" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar name="Conversions" dataKey="conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No Google Ads campaign data available.
                  </div>
                )}
              </div>
            </div>

            {/* Keywords panel */}
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Keywords in Focus</h3>
              <div className="space-y-4 text-xs">
                {keywordMetrics.length > 0 ? keywordMetrics.slice(0, 4).map((kw, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#0e1628] border border-slate-800">
                    <div>
                      <div className="font-semibold text-slate-200">{kw.metricLabel}</div>
                      <div className="text-[10px] text-slate-400">Value: {kw.metricValue}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Active
                    </span>
                  </div>
                )) : googleCampaigns.slice(0, 4).map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#0e1628] border border-slate-800">
                    <div>
                      <div className="font-semibold text-slate-200">{c.name || c.campaignName}</div>
                      <div className="text-[10px] text-slate-400">CPL: {c.cpl ? `₹${c.cpl}` : "N/A"} • Leads: {c.leads || 0}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      c.status === "Paused"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {c.status || "Active"}
                    </span>
                  </div>
                ))}
                {googleCampaigns.length === 0 && keywordMetrics.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No Google Ads data in database.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Adjust keyword match types", "Show google search term reports", "Calculate optimal keyword bids"]} />
    </div>
  );
}
