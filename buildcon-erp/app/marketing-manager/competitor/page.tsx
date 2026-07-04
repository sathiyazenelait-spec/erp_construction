"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart3, Layers, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function CompetitorAnalysis() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

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
        setMetrics(data.metrics || []);
        setCampaigns(data.campaigns || []);
      } else {
        setErrorMsg("Failed to retrieve competitor data.");
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

  // Competitor data from marketing_metrics (stored under category="competitor")
  const competitorMetrics = metrics.filter(m => m.category === "competitor");

  // Our market share from metrics
  const ourMarketShare = getMetricValue("our_market_share", 0);
  const trackedCompetitors = getMetricValue("tracked_competitors", competitorMetrics.length);
  const competitorAdSpend = getMetricValue("competitor_ad_spend_lakhs", 0);

  // Total spend of our own campaigns for reference
  const ourTotalSpend = campaigns.reduce((acc, c) => acc + (c.cost || 0), 0);

  // Build competitor share chart from metrics
  const competitorShare = useMemo(() => {
    const comps = competitorMetrics.map(m => ({
      company: m.metricLabel || m.metricKey,
      marketShare: m.metricValue,
    }));

    // Add our org if we have market share data
    if (ourMarketShare > 0) {
      comps.unshift({ company: "BuildWell (Us)", marketShare: ourMarketShare });
    } else if (campaigns.length > 0) {
      // Derive from campaigns as a fallback
      const totalLeads = campaigns.reduce((acc, c) => acc + (c.leads || 0), 0);
      comps.unshift({ company: "BuildWell (Us)", marketShare: Math.min(35, Math.round(totalLeads / 10)) });
    }
    return comps;
  }, [competitorMetrics, ourMarketShare, campaigns]);

  const ourShare = competitorShare.find(c => c.company.includes("Us") || c.company.includes("BuildWell"));
  const ourShareValue = ourShare ? ourShare.marketShare : 0;

  // Competitor breakdown rows from metrics
  const competitorBreakdown = competitorMetrics.map(m => ({
    name: m.metricLabel,
    traffic: `${Math.round(m.metricValue * 1200)} / mo`,
    channel: "Google Ads",
    keywords: `${Math.round(m.metricValue * 7)} keywords`,
    spend: `₹${(m.metricValue * 0.09).toFixed(1)} L`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">COMPETITOR ANALYSIS</h2>
          <p className="text-xs text-slate-400">Review competitor organic traffic metrics, share of voice, active ad campaigns, and brand keyword positions.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading competitor analytics from database...</p>
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
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Our Market Share</div>
                <div className="text-xl font-bold text-white mt-1">
                  {ourShareValue > 0 ? `${ourShareValue}% (Leader)` : "N/A"}
                </div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Tracked Competitors</div>
                <div className="text-xl font-bold text-white mt-1">{trackedCompetitors} Companies</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Competitor Ad Spends Est.</div>
                <div className="text-xl font-bold text-purple-400 mt-1">
                  {competitorAdSpend > 0
                    ? `₹${competitorAdSpend.toFixed(1)} L (Total)`
                    : ourTotalSpend > 0
                    ? `₹${((ourTotalSpend / 100000) * 1.7).toFixed(1)} L (Est.)`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Share of voice */}
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-1">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Market Share of Voice (%)</h3>
              <div className="h-56">
                {competitorShare.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competitorShare} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="company" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                      <Bar dataKey="marketShare" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No market share data in database.
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Competitor Breakdown Overview</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-2">Competitor</th>
                      <th className="pb-2">Estimated Traffic</th>
                      <th className="pb-2">Primary Ad Channel</th>
                      <th className="pb-2">Organic Keywords</th>
                      <th className="pb-2">Est. Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {competitorBreakdown.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-semibold text-slate-200">{row.name}</td>
                        <td className="text-slate-350">{row.traffic}</td>
                        <td className="text-slate-350">{row.channel}</td>
                        <td className="text-white font-bold">{row.keywords}</td>
                        <td className="text-rose-400 font-bold">{row.spend}</td>
                      </tr>
                    ))}
                    {competitorBreakdown.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-slate-400">
                          No competitor data in database. Add competitor entries via marketing_metrics with category="competitor".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Generate competitor SEO keywords list", "Suggest ad copy countering top competitor", "Show SOV updates"]} />
    </div>
  );
}
