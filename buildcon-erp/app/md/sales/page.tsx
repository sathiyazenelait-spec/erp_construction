"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp, Award, Star, RefreshCw } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function SalesPipeline() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>({});
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) { setErrorMsg("Session expired."); setLoading(false); return; }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      const [mdRes, mktRes] = await Promise.all([
        fetch(`https://erp-construction.onrender.com/api/md/dashboard/org/${orgId}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`https://erp-construction.onrender.com/api/marketing-manager/dashboard/org/${orgId}`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      if (mdRes.ok) setMetrics(await mdRes.json());
      if (mktRes.ok) {
        const mkt = await mktRes.json();
        setCampaigns(mkt.campaigns || []);
        setLeads(mkt.leads || []);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const totalLeads = campaigns.reduce((a: number, c: any) => a + (c.leads || 0), 0);
  const totalSpend = campaigns.reduce((a: number, c: any) => a + (c.cost || 0), 0);
  const wonValue = metrics.revenue_mtd || "N/A";

  // Platform funnel data
  const platformGroups: {[k: string]: {leads: number; spend: number}} = {};
  campaigns.forEach((c: any) => {
    const p = c.platform || "Others";
    if (!platformGroups[p]) platformGroups[p] = { leads: 0, spend: 0 };
    platformGroups[p].leads += c.leads || 0;
    platformGroups[p].spend += c.cost || 0;
  });
  const funnelData = Object.keys(platformGroups).map((key, idx) => ({
    stage: key,
    count: platformGroups[key].leads,
    color: ["#3B82F6","#10B981","#F59E0B","#8B5CF6","#EF4444"][idx % 5]
  }));

  const avgProposal = campaigns.length > 0
    ? `₹ ${(campaigns.reduce((a: number, c: any) => a + (c.cost || 0), 0) / campaigns.length / 100000).toFixed(1)} L`
    : "N/A";

  const convRate = totalLeads > 0 ? `${((campaigns.filter((c: any) => (c.roi || 0) > 1).length / campaigns.length) * 100).toFixed(1)}%` : "N/A";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">04. SALES &amp; OPPORTUNITIES</h2>
          <p className="text-xs text-slate-400">Marketing metrics, leads funnel conversion, and signed contracts value</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading sales data from database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Won Value (MTD)</div>
                <div className="text-2xl font-bold text-white mt-1">{wonValue}</div>
                <div className="text-[10px] text-emerald-400 mt-1">From active campaigns</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500/20" />
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Total Leads Generated</div>
                <div className="text-2xl font-bold text-white mt-1">{totalLeads.toLocaleString("en-IN")}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Across {campaigns.length} campaigns</div>
              </div>
              <Award className="h-8 w-8 text-emerald-500/20" />
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Avg Campaign Spend</div>
                <div className="text-2xl font-bold text-white mt-1">{avgProposal}</div>
                <div className="text-[10px] text-emerald-400 mt-1">ROI Positive: {convRate}</div>
              </div>
              <Star className="h-8 w-8 text-yellow-500/20" />
            </div>
          </div>

          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Lead Generation by Platform</h3>
            <div className="h-56">
              {funnelData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="stage" stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F182A", borderColor: "#1E293B", color: "#F8FAFC" }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {funnelData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">No campaign data available.</div>
              )}
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Show conversion rates by platform", "Identify highest ROI campaign", "Forecast next month leads"]} />
    </div>
  );
}
