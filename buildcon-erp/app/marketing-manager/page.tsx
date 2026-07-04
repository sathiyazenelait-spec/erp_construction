"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Target, TrendingUp, Megaphone, Share2, HelpCircle, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  leads: number;
  cost: number;
  roi: number;
  status: string;
  cpl: string;
}

interface Metric {
  metricKey: string;
  metricValue: number;
  category: string;
  label: string;
}

export default function MarketingExecutiveSummary() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

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
      const activeUsername = session.name;
      setOrgId(activeOrgId);
      setUsername(activeUsername);

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
        setTrends(data.trends || []);
        setAiSuggestions(data.aiSuggestions || []);
      } else {
        setErrorMsg("Failed to retrieve dashboard data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncChannels = async () => {
    if (!orgId) return;
    try {
      setSyncing(true);
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("https://erp-construction.onrender.com/api/marketing-manager/sync-external", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ organizationId: orgId })
      });
      if (res.ok) {
        alert("Synced Google Ads, Meta Ads, GA4, GBP & SEO search keyword metrics successfully!");
        await loadData();
      } else {
        alert("Failed to sync external channels.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const getMetricValue = (key: string, fallback: number) => {
    const found = metrics.find(m => m.metricKey === key);
    return found ? found.metricValue : fallback;
  };

  const getMetricLabel = (key: string, fallback: string) => {
    const found = metrics.find(m => m.metricKey === key);
    return found ? found.label : fallback;
  };

  // 1. Group campaigns by platform to get leads by channel dynamically
  const leadsByChannelDynamic = React.useMemo(() => {
    if (campaigns.length === 0) return [];
    const groups: { [key: string]: number } = {};
    campaigns.forEach(c => {
      groups[c.platform] = (groups[c.platform] || 0) + (c.leads || 0);
    });
    return Object.keys(groups).map((platform, idx) => ({
      name: platform,
      value: groups[platform],
      color: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"][idx % 5]
    }));
  }, [campaigns]);

  const leadsByChannel = leadsByChannelDynamic;

  // 2. Spend vs Conv trends
  const trendMetrics = trends.filter(t => t.chartName === "spend_vs_conv");
  const spendVsConv = trendMetrics.map(t => ({
    m: t.label,
    Spend: t.value1,
    Leads: t.value2
  }));

  const totalLeadsCalculated = Math.round(leadsByChannel.reduce((acc, curr) => acc + curr.value, 0));

  // Compute dynamic trend growth comparison for Total Leads (MTD)
  const leadsComparisonText = React.useMemo(() => {
    if (spendVsConv.length >= 2) {
      const currentLeads = spendVsConv[spendVsConv.length - 1].Leads;
      const prevLeads = spendVsConv[spendVsConv.length - 2].Leads;
      if (prevLeads > 0) {
        const percent = ((currentLeads - prevLeads) / prevLeads) * 100;
        const sign = percent >= 0 ? "↑" : "↓";
        return `${sign} ${Math.abs(percent).toFixed(1)}% vs Last Month`;
      }
    }
    return "0.0% vs Last Month";
  }, [spendVsConv]);

  // Compute dynamic overall spends & ROI from campaigns
  const totalCost = campaigns.reduce((acc, c) => acc + (c.cost || 0), 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + ((c.cost || 0) * (c.roi || 0)), 0);
  const dynamicAdSpends = totalCost > 0 ? totalCost / 100000.0 : getMetricValue("mgr_ad_spends", 0.0);
  const dynamicOverallRoi = totalCost > 0 ? (totalRevenue / totalCost) : getMetricValue("mgr_roi", 0.0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">MARKETING EXECUTIVE SUMMARY</h2>
          <p className="text-xs text-slate-400">Welcome, {username || "Ananya Sharma"} — consolidated brand awareness, lead generation performance, and digital ad ROI.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncChannels}
            disabled={syncing}
            className="bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow"
          >
            {syncing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : "Sync External Channels"}
          </button>
          <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Fetching live marketing manager data from MySQL database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-650 hover:bg-red-550 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          {/* KPI Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400">Total Leads (MTD)</span>
                <Target className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white font-mono">{totalLeadsCalculated.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">{leadsComparisonText}</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400">Ad Spends MTD</span>
                <Megaphone className="h-4 w-4 text-purple-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white font-mono">₹{dynamicAdSpends.toFixed(2)} Lakhs</div>
                <div className="text-[10px] text-slate-400 mt-1">{getMetricLabel("mgr_spend_sub", "No spend label")}</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400">Avg Lead Conv. Rate</span>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white font-mono">{getMetricValue("mgr_conv_rate", 0.0)}%</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">{getMetricLabel("mgr_conv_rate_sub", "No trend info")}</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400">Overall Marketing ROI</span>
                <Share2 className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-amber-400 font-mono">{dynamicOverallRoi.toFixed(2)}x</div>
                <div className="text-[10px] text-slate-400 mt-1">{getMetricLabel("mgr_roi_sub", "No ROI label")}</div>
              </div>
            </div>
          </div>

          {/* Row 2: Charts */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Ad Spend vs Leads Generated Chart */}
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Ad Spend (Lakhs) vs Leads Generated</h3>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Monthly Trends</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendVsConv} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                    <Area name="Ad Spend (₹ L)" type="monotone" dataKey="Spend" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#spendGrad)" />
                    <Area name="Leads Generated" type="monotone" dataKey="Leads" stroke="#10B981" strokeWidth={1.5} fillOpacity={1} fill="url(#leadsGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Lead Channels Donut */}
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Leads by Channel</h3>
              <div className="flex flex-col items-center justify-center h-48">
                <div className="h-32 w-32 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={leadsByChannel} dataKey="value" nameKey="name" innerRadius={28} outerRadius={46} paddingAngle={2}>
                        {leadsByChannel.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-white font-mono">{totalLeadsCalculated.toLocaleString('en-IN')}</span>
                    <span className="text-[8px] text-slate-400">Total Leads</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 text-[9px]">
                  {leadsByChannel.map((item: any) => (
                    <div key={item.name} className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-350">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Campaigns Table */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Active Marketing Campaigns Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">Campaign Name</th>
                    <th className="pb-2">Platform</th>
                    <th className="pb-2">Spend MTD</th>
                    <th className="pb-2">Leads Generated</th>
                    <th className="pb-2">Cost Per Lead (CPL)</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {campaigns.map((row) => (
                    <tr key={row.id}>
                      <td className="py-3 font-semibold text-slate-200">{row.name}</td>
                      <td className="text-slate-350">{row.platform}</td>
                      <td className="text-white font-bold font-mono">
                        {row.cost >= 1000 ? `₹${(row.cost / 100000).toFixed(2)} L` : `₹${row.cost}`}
                      </td>
                      <td className="text-emerald-400 font-bold font-mono">{row.leads.toLocaleString('en-IN')} Leads</td>
                      <td className="text-slate-350 font-semibold font-mono">₹{row.cpl}</td>
                      <td>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {campaigns.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400">
                        No active campaigns registered in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {aiSuggestions.length > 0 && (
        <AIAssistantBar suggestions={aiSuggestions} />
      )}
    </div>
  );
}
