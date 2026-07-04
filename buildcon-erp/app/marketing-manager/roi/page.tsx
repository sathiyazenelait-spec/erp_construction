"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, Award, Coins, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function MarketingROI() {
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
        setErrorMsg("Failed to retrieve ROI data.");
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

  // Compute KPIs dynamically from campaigns
  const totalCost = campaigns.reduce((acc, c) => acc + (c.cost || 0), 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + (c.leads || 0), 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + ((c.cost || 0) * (c.roi || 0)), 0);

  const overallROI = totalCost > 0 ? (totalRevenue / totalCost).toFixed(1) : getMetricValue("mgr_roi", 0).toFixed(1);
  const avgCAC = totalLeads > 0 ? Math.round(totalCost / totalLeads) : 0;
  const estimatedLTV = avgCAC > 0 ? avgCAC * parseFloat(String(overallROI)) : 0;
  const ltvCacRatio = avgCAC > 0 ? (estimatedLTV / avgCAC).toFixed(1) : "N/A";

  // Build segment-level chart from campaigns grouped by segment/type
  const ltvCacData = useMemo(() => {
    const segmentMap: { [key: string]: { cost: number; leads: number; revenue: number } } = {};
    campaigns.forEach(c => {
      const seg = c.segment || c.campaignType || c.platform || "General";
      if (!segmentMap[seg]) segmentMap[seg] = { cost: 0, leads: 0, revenue: 0 };
      segmentMap[seg].cost += c.cost || 0;
      segmentMap[seg].leads += c.leads || 0;
      segmentMap[seg].revenue += (c.cost || 0) * (c.roi || 0);
    });

    return Object.keys(segmentMap).map(seg => {
      const { cost, leads, revenue } = segmentMap[seg];
      const cac = leads > 0 ? Math.round(cost / leads) : 0;
      const ltv = cost > 0 && revenue > 0 ? Math.round(revenue / leads) : cac * 5;
      return { segment: seg, CAC: cac, LTV: ltv };
    });
  }, [campaigns]);

  const revenueInLakhs = (totalRevenue / 100000).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">MARKETING ROI ANALYSIS</h2>
          <p className="text-xs text-slate-400">Track Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), overall marketing efficiency ratios, and conversion margins.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading ROI analytics from database...</p>
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
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Average CAC</div>
                <div className="text-xl font-bold text-white mt-1">
                  {avgCAC > 0 ? `₹${avgCAC.toLocaleString("en-IN")}` : "N/A"}
                </div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Average LTV</div>
                <div className="text-xl font-bold text-white mt-1">
                  {estimatedLTV > 0 ? `₹${Math.round(estimatedLTV).toLocaleString("en-IN")}` : "N/A"}
                </div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">LTV:CAC Ratio</div>
                <div className="text-xl font-bold text-purple-400 mt-1">{ltvCacRatio}x</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LTV vs CAC chart */}
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">LTV vs CAC comparison (INR) by Campaign Platform</h3>
              <div className="h-64">
                {ltvCacData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ltvCacData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="segment" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                      <Bar name="LTV" dataKey="LTV" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar name="CAC" dataKey="CAC" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No ROI segment data available.
                  </div>
                )}
              </div>
            </div>

            {/* Detailed ROI stats */}
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Performance Metrics</h3>
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-xl space-y-1">
                    <div className="text-slate-400 font-semibold">Overall ROI MTD</div>
                    <div className="text-xl font-bold text-emerald-400">{overallROI}x</div>
                  </div>
                  <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-xl space-y-1">
                    <div className="text-slate-400 font-semibold">Total Revenue Generated</div>
                    <div className="text-xl font-bold text-white">
                      {totalRevenue > 0 ? `₹${revenueInLakhs} Lakhs` : "N/A"}
                    </div>
                  </div>
                  <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-xl space-y-1">
                    <div className="text-slate-400 font-semibold">Total Ad Spend MTD</div>
                    <div className="text-xl font-bold text-blue-400">
                      ₹{(totalCost / 100000).toFixed(1)} Lakhs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Suggest CAC reduction strategies", "Compare LTV curves", "Export ROI report data"]} />
    </div>
  );
}
