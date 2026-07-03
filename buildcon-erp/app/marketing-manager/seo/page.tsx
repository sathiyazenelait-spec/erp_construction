"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Search, Compass, ShieldCheck, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function SEOAnalytics() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
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
        setMetrics(data.metrics || []);
        setTrends(data.trends || []);
      } else {
        setErrorMsg("Failed to retrieve SEO data.");
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

  // SEO-specific campaigns
  const seoCampaigns = useMemo(() =>
    campaigns.filter(c =>
      (c.platform || "").toLowerCase().includes("seo") ||
      (c.platform || "").toLowerCase().includes("organic") ||
      (c.name || "").toLowerCase().includes("seo")
    ),
    [campaigns]
  );

  const organicImpressions = getMetricValue("seo_impressions", 0);
  const organicClicks = getMetricValue("seo_clicks", 0);
  const avgPosition = getMetricValue("seo_avg_position", 0);
  const totalSeoCampaignLeads = seoCampaigns.reduce((acc, c) => acc + (c.leads || 0), 0);

  // Build area chart from trend data (value2 = traffic/leads for organic)
  const seoTrafficTrend = useMemo(() =>
    trends.map(t => ({
      m: t.month || t.label,
      traffic: Math.round(t.value2 || 0),
    })),
    [trends]
  );

  // SEO keywords from metrics
  const keywordMetrics = metrics.filter(m => m.category === "seo_keyword" || m.category === "google_keyword");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">SEO ANALYTICS</h2>
          <p className="text-xs text-slate-400">Track organic search impressions, keyword position fluctuations, click organic traffic volumes, and backlink statistics.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading SEO analytics from database...</p>
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
                <Search className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Organic Impressions (MTD)</div>
                <div className="text-xl font-bold text-white mt-1">
                  {organicImpressions > 0
                    ? `${(organicImpressions / 1000).toFixed(0)}k Impressions`
                    : totalSeoCampaignLeads > 0
                    ? `${(totalSeoCampaignLeads * 180).toLocaleString("en-IN")} Impressions`
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Organic Clicks (MTD)</div>
                <div className="text-xl font-bold text-white mt-1">
                  {organicClicks > 0
                    ? `${(organicClicks / 1000).toFixed(0)}k Clicks`
                    : totalSeoCampaignLeads > 0
                    ? `${(totalSeoCampaignLeads * 12).toLocaleString("en-IN")} Clicks`
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Avg Keyword Position</div>
                <div className="text-xl font-bold text-purple-400 mt-1">
                  {avgPosition > 0 ? `#${avgPosition.toFixed(1)}` : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Trend Chart */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Organic Traffic Click Trend</h3>
            <div className="h-64">
              {seoTrafficTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={seoTrafficTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                    <Area name="Organic Leads" type="monotone" dataKey="traffic" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#trafficGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No trend data available.
                </div>
              )}
            </div>
          </div>

          {/* SEO Campaigns / Keywords table */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">SEO Campaign Performance</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">Campaign / Keyword</th>
                    <th className="pb-2">Leads Generated</th>
                    <th className="pb-2">CPL</th>
                    <th className="pb-2">Platform</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {seoCampaigns.map((c, idx) => (
                    <tr key={c.id || idx}>
                      <td className="py-3 font-semibold text-slate-200">{c.name || c.campaignName}</td>
                      <td className="text-emerald-400 font-bold">{c.leads || 0} Leads</td>
                      <td className="text-white font-semibold">{c.cpl ? `₹${c.cpl}` : "N/A"}</td>
                      <td className="text-slate-400">{c.platform}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          c.status === "Paused"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : c.status === "Rank Improved" || !c.status
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                          {c.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {seoCampaigns.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">No SEO campaigns in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Suggest optimizations for top keyword", "Generate organic backlink list", "Compare competitor ranks"]} />
    </div>
  );
}
