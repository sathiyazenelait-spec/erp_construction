"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Send, Instagram, Facebook, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function MetaAdsConsole() {
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

      const res = await fetch(`http://localhost:8081/api/marketing-manager/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
        setMetrics(data.metrics || []);
      } else {
        setErrorMsg("Failed to retrieve Meta Ads data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Filter Meta (Facebook/Instagram) campaigns
  const metaCampaigns = useMemo(() =>
    campaigns.filter(c =>
      c.platform === "Meta Ads" || c.platform === "Facebook" ||
      c.platform === "Instagram" || c.platform === "Meta"
    ),
    [campaigns]
  );

  const totalMetaSpend = metaCampaigns.reduce((acc, c) => acc + (c.cost || 0), 0);
  const totalMetaLeads = metaCampaigns.reduce((acc, c) => acc + (c.leads || 0), 0);

  const avgCtr = useMemo(() => {
    const valid = metaCampaigns.filter(c => c.ctr);
    if (valid.length === 0) return "N/A";
    const sum = valid.reduce((acc, c) => acc + parseFloat(c.ctr || "0"), 0);
    return `${(sum / valid.length).toFixed(1)}%`;
  }, [metaCampaigns]);

  const avgCpl = useMemo(() => {
    if (totalMetaLeads === 0) return "N/A";
    return `₹${Math.round(totalMetaSpend / totalMetaLeads).toLocaleString("en-IN")}`;
  }, [totalMetaSpend, totalMetaLeads]);

  const spendInLakhs = (totalMetaSpend / 100000).toFixed(1);

  const chartData = useMemo(() =>
    metaCampaigns.map(c => ({
      campaign: (c.name || c.campaignName || "").substring(0, 20),
      spend: parseFloat(((c.cost || 0) / 100000).toFixed(2)),
      leads: c.leads || 0,
    })),
    [metaCampaigns]
  );

  // Instagram leads: campaigns with "Instagram" in name or platform
  const instaLeads = metaCampaigns.filter(c =>
    (c.platform || "").toLowerCase().includes("instagram") ||
    (c.name || "").toLowerCase().includes("instagram") ||
    (c.name || "").toLowerCase().includes("insta")
  ).reduce((acc, c) => acc + (c.leads || 0), 0);

  const fbLeads = totalMetaLeads - instaLeads;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">META ADS CONSOLE</h2>
          <p className="text-xs text-slate-400">Manage Facebook &amp; Instagram campaigns, custom audiences reach, cost per result, and lead forms submissions.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading Meta Ads data from database...</p>
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
              <div className="text-slate-400">Meta Ads Spend MTD</div>
              <div className="text-xl font-bold text-white mt-1">₹{spendInLakhs} Lakhs</div>
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400">Conversions Generated</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{totalMetaLeads} Leads</div>
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
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Conversions vs Spend (in Lakhs) by Meta Campaign</h3>
              <div className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="campaign" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                      <Bar name="Spend (₹ L)" dataKey="spend" fill="#EC4899" radius={[4, 4, 0, 0]} />
                      <Bar name="Leads" dataKey="leads" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No Meta Ads campaigns in database.
                  </div>
                )}
              </div>
            </div>

            {/* Platform breakdown */}
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Platform Share</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center p-3 rounded bg-[#0e1628] border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-400" />
                      <span className="text-slate-200 font-semibold">Instagram Feed &amp; Stories</span>
                    </div>
                    <span className="text-white font-mono font-bold">{instaLeads} Leads</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded bg-[#0e1628] border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-200 font-semibold">Facebook Newsfeed</span>
                    </div>
                    <span className="text-white font-mono font-bold">{fbLeads > 0 ? fbLeads : totalMetaLeads} Leads</span>
                  </div>
                  {totalMetaLeads === 0 && (
                    <p className="text-xs text-slate-400 text-center py-2">No Meta Ads data in database.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Optimize custom lead forms design", "Setup Instagram retargeting audience", "Calculate cost per result metric"]} />
    </div>
  );
}
