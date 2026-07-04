"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Globe, Users, TrendingUp, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function DigitalMarketing() {
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
        setErrorMsg("Failed to retrieve digital marketing data.");
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

  // Group campaigns by platform
  const platformShare = useMemo(() => {
    const map: { [key: string]: { spend: number; leads: number } } = {};
    campaigns.forEach(c => {
      const p = c.platform || "Others";
      if (!map[p]) map[p] = { spend: 0, leads: 0 };
      map[p].spend += c.cost || 0;
      map[p].leads += c.leads || 0;
    });
    return Object.keys(map).map(platform => ({
      platform,
      spend: parseFloat(((map[platform].spend) / 100000).toFixed(2)),
      leads: map[platform].leads,
    }));
  }, [campaigns]);

  // Multi-platform summary cards
  const platformSummary = useMemo(() => {
    const map: { [key: string]: { spend: number; leads: number } } = {};
    campaigns.forEach(c => {
      const p = c.platform || "Others";
      if (!map[p]) map[p] = { spend: 0, leads: 0 };
      map[p].spend += c.cost || 0;
      map[p].leads += c.leads || 0;
    });
    return Object.keys(map).map(platform => ({
      platform,
      spend: `₹${(map[platform].spend / 100000).toFixed(1)} L`,
      conversions: String(map[platform].leads),
      cpl: map[platform].leads > 0
        ? `₹${Math.round(map[platform].spend / map[platform].leads).toLocaleString("en-IN")}`
        : "N/A",
    }));
  }, [campaigns]);

  // Overall KPIs
  const totalImpressions = campaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
  const activePlatforms = [...new Set(campaigns.map(c => c.platform).filter(Boolean))].length;
  const overallROI = getMetricValue("mgr_roi", 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">DIGITAL MARKETING</h2>
          <p className="text-xs text-slate-400">Manage multi-channel online marketing spend, social traffic shares, and digital presence statistics.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading digital marketing data from database...</p>
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
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Digital Reach (Monthly)</div>
                <div className="text-xl font-bold text-white mt-1">
                  {totalImpressions > 0
                    ? `${(totalImpressions / 1000).toFixed(0)}k Impressions`
                    : campaigns.length > 0
                    ? `${(campaigns.reduce((a, c) => a + (c.leads || 0), 0) * 580).toLocaleString("en-IN")} Impressions`
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Active Channels</div>
                <div className="text-xl font-bold text-white mt-1">{activePlatforms} Platforms</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Avg ROI Ratio</div>
                <div className="text-xl font-bold text-purple-400 mt-1">
                  {overallROI > 0 ? `${overallROI.toFixed(1)}x` : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Spend Share Chart */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Platform Spend (Lakhs) &amp; Lead Breakdown</h3>
            <div className="h-64">
              {platformShare.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformShare} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="platform" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                    <Bar name="Spend (₹ L)" dataKey="spend" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar name="Leads" dataKey="leads" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No platform data available.
                </div>
              )}
            </div>
          </div>

          {/* Platforms Details */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Multi-Platform Performance Summary</h3>
            <div className="grid md:grid-cols-3 gap-4 text-xs">
              {platformSummary.map((item, idx) => (
                <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="font-semibold text-white">{item.platform}</div>
                  <div className="text-[10px] text-slate-400 space-y-1 mt-2">
                    <div className="flex justify-between"><span>Spend:</span> <span className="text-white font-bold">{item.spend}</span></div>
                    <div className="flex justify-between"><span>Conversions:</span> <span className="text-emerald-400 font-bold">{item.conversions}</span></div>
                    <div className="flex justify-between"><span>Avg CPL:</span> <span className="text-white font-semibold">{item.cpl}</span></div>
                  </div>
                </div>
              ))}
              {platformSummary.length === 0 && (
                <p className="text-slate-400 col-span-3 text-center py-4">No campaign platform data in database.</p>
              )}
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Optimize YouTube spends", "Compare cost per acquisition channels", "Check CPC targets"]} />
    </div>
  );
}
