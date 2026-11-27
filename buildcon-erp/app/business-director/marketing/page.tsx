"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Megaphone, DollarSign, Target, Percent, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function MarketingAnalytics() {
  const [spendBySource, setSpendBySource] = useState<any[]>([
    { name: "Google Ads", value: 45, color: "#10B981" },
    { name: "Website SEO", value: 25, color: "#3B82F6" },
    { name: "Social Media", value: 20, color: "#F59E0B" },
    { name: "Referrals", value: 10, color: "#8B5CF6" },
  ]);

  const [campaignsData, setCampaignsData] = useState<any[]>([
    { name: "Search Ads", channel: "Google Ads", spend: "₹9,00,000", leads: 420, cpl: "₹185", conv: "9.2%", roi: "310%" },
    { name: "Display Ads", channel: "Google Ads", spend: "₹3,50,000", leads: 120, cpl: "₹210", conv: "7.0%", roi: "210%" },
    { name: "Facebook Ads", channel: "Social Media", spend: "₹4,20,000", leads: 180, cpl: "₹220", conv: "6.5%", roi: "250%" },
    { name: "Instagram Ads", channel: "Social Media", spend: "₹3,80,000", leads: 150, cpl: "₹230", conv: "6.1%", roi: "240%" },
    { name: "Email Campaigns", channel: "Email", spend: "₹1,50,000", leads: 95, cpl: "₹150", conv: "10.2%", roi: "380%" },
  ]);

  const [kpi, setKpi] = useState({
    totalSpend: "₹ 24.5 L",
    totalLeads: "1,250",
    cpl: "₹ 196",
    convRate: "8.1%"
  });

  const [loading, setLoading] = useState(false);
  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/marketing/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.spendBySource) setSpendBySource(data.spendBySource);
        if (data.campaigns) setCampaignsData(data.campaigns);
        if (data.kpi) setKpi(data.kpi);
      }
    } catch (err) {
      console.warn("Backend marketing fetch failed, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">06. MARKETING ANALYTICS</h2>
          <p className="text-xs text-slate-400">Live campaign performance metrics, cost per lead, and channel conversion ROI</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Spend (YTD)</div>
          <div className="text-2xl font-bold text-white mt-1">{kpi.totalSpend}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Leads</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{kpi.totalLeads}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Cost Per Lead (Avg)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{kpi.cpl}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Conversion Rate</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">{kpi.convRate}</div>
        </div>
      </div>

      {/* Channel Spend Allocation Pie */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Spend by Channel Allocation</h3>
        <div className="flex items-center justify-around h-48">
          <div className="h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendBySource} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                  {spendBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-[10px]">
            {spendBySource.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-300 font-medium">{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Details Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Active Campaigns Registry ({campaignsData.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Campaign Name</th>
                <th className="p-3 font-semibold">Channel</th>
                <th className="p-3 font-semibold text-right">Spend</th>
                <th className="p-3 font-semibold text-center">Leads</th>
                <th className="p-3 font-semibold text-center">CPL</th>
                <th className="p-3 font-semibold text-center">Conv %</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {campaignsData.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-semibold text-white">{c.name}</td>
                  <td className="p-3 text-slate-400">{c.channel}</td>
                  <td className="p-3 text-right font-mono text-white">{c.spend}</td>
                  <td className="p-3 text-center text-blue-400 font-bold">{c.leads}</td>
                  <td className="p-3 text-center text-slate-300 font-mono">{c.cpl}</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">{c.conv}</td>
                  <td className="p-3 text-right font-bold text-violet-400">{c.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Optimizing Google Ads CPA", "Lead conversion rate tips", "Review campaigns ROI"]} />
    </div>
  );
}
