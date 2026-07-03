"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Target, Users, Zap, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function LeadGenCenter() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
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

      // Fetch leads from digital-marketing-tl dashboard (which includes the TlmLeads)
      const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setCampaigns(data.campaigns || []);
      } else {
        setErrorMsg("Failed to retrieve lead data.");
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

  const totalLeads = leads.length;

  // MQLs: All leads captured in marketing
  const totalMQL = totalLeads;

  // SQLs: Leads qualified as high quality or marked as qualified
  const totalSQL = leads.filter(l => l.status === "Qualified" || l.quality === "High").length;
  const sqlPercentage = totalLeads > 0 ? ((totalSQL / totalLeads) * 100).toFixed(1) : "0.0";

  // Calculate dynamic average CPL from campaign costs/leads
  const totalCost = campaigns.reduce((acc, c) => acc + (c.cost || 0), 0);
  const totalCampaignLeads = campaigns.reduce((acc, c) => acc + (c.leads || 0), 0);
  const avgCpl = totalCampaignLeads > 0 
    ? `₹${Math.round(totalCost / totalCampaignLeads).toLocaleString('en-IN')}` 
    : "N/A (No active campaigns)";

  // Group leads by channel dynamically
  const leadSourceData = React.useMemo(() => {
    const channelMap: { [key: string]: { MQL: number, SQL: number } } = {};
    leads.forEach(l => {
      let chName = l.source || "Others";
      if (chName === "SEO Organic") chName = "Organic SEO";
      if (!channelMap[chName]) {
        channelMap[chName] = { MQL: 0, SQL: 0 };
      }
      if (l.status === "Qualified" || l.quality === "High") {
        channelMap[chName].SQL += 1;
      } else {
        channelMap[chName].MQL += 1;
      }
    });

    return Object.keys(channelMap).map(name => ({
      name,
      MQL: channelMap[name].MQL,
      SQL: channelMap[name].SQL
    }));
  }, [leads]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">LEAD GENERATION CENTER</h2>
          <p className="text-xs text-slate-400">Track and filter Marketing Qualified Leads (MQL), Sales Qualified Leads (SQL), and overall conversions.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Fetching dynamic leads from database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-650 hover:bg-red-550 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Total MQL Generated</div>
                <div className="text-xl font-bold text-white mt-1">{totalMQL} Leads</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Total SQL (Sales Ready)</div>
                <div className="text-xl font-bold text-white mt-1">{totalSQL} Leads ({sqlPercentage}%)</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Avg Cost Per Lead (CPL)</div>
                <div className="text-xl font-bold text-purple-400 mt-1">{avgCpl}</div>
              </div>
            </div>
          </div>

          {/* Leads Chart */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Marketing vs Sales Qualified Leads by Channel</h3>
            <div className="h-64">
              {leadSourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadSourceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                    <Bar name="MQL" dataKey="MQL" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar name="SQL" dataKey="SQL" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No source data available for chart.
                </div>
              )}
            </div>
          </div>

          {/* Leads list table */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Leads Captured</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">Lead Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Phone</th>
                    <th className="pb-2">Source Channel</th>
                    <th className="pb-2">Lead Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {leads.map((row, idx) => (
                    <tr key={row.id || idx}>
                      <td className="py-3 font-semibold text-slate-200">{row.name}</td>
                      <td className="text-slate-350">{row.email || "N/A"}</td>
                      <td className="text-slate-350 font-mono">{row.phone || "N/A"}</td>
                      <td className="text-slate-400">{row.source}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          row.quality === "High" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : row.quality === "Medium"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-rose-500/10 text-rose-455 text-rose-400 border-rose-500/20"
                        }`}>
                          {row.quality || "Medium"} Quality
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        No leads registered in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Export lead list to Excel", "Filter hot leads from Facebook ads", "Calculate total conversion spend"]} />
    </div>
  );
}
