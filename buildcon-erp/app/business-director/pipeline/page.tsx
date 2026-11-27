"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { TrendingUp, DollarSign, Award, Target, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function SalesPipeline() {
  const [pipelineData, setPipelineData] = useState<any[]>([
    { id: 1, name: "IT Park Project", value: 25.0, stage: "Proposal", prob: "70%" },
    { id: 2, name: "Commercial Complex", value: 12.0, stage: "Negotiation", prob: "80%" },
    { id: 3, name: "Apartment Project", value: 18.0, stage: "Qualification", prob: "50%" },
  ]);

  const [byOwner, setByOwner] = useState<any[]>([
    { owner: "Arun Kumar", value: "₹22.5 Cr" },
    { owner: "Priya Sharma", value: "₹18.0 Cr" },
    { owner: "Vijay Prakash", value: "₹15.5 Cr" },
    { owner: "Karthik S", value: "₹12.5 Cr" },
  ]);

  const [kpi, setKpi] = useState({
    totalPipeline: "₹ 68.5 Cr",
    weightedValue: "₹ 28.4 Cr",
    activeDeals: 42,
    targetValue: "₹ 15.0 Cr"
  });

  const [loading, setLoading] = useState(false);
  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/pipeline/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.deals) setPipelineData(data.deals);
        if (data.byOwner) setByOwner(data.byOwner);
        if (data.kpi) setKpi(data.kpi);
      }
    } catch (err) {
      console.warn("Backend pipeline fetch failed, using fallback:", err);
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
          <h2 className="text-xl font-bold text-white tracking-wide">07. SALES PIPELINE</h2>
          <p className="text-xs text-slate-400">Live stages analysis, deals in pipeline, and weighted forecasts</p>
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
          <div className="text-xs text-slate-400">Total Pipeline</div>
          <div className="text-2xl font-bold text-white mt-1">{kpi.totalPipeline}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Weighted Value</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{kpi.weightedValue}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Active Deals</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{kpi.activeDeals}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Target Value</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">{kpi.targetValue}</div>
        </div>
      </div>

      {/* Pipeline Stages Funnel */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Pipeline by Owner</h3>
          <div className="space-y-3 text-xs">
            {byOwner.map((o, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-[#0e1628] border border-slate-800">
                <span className="text-slate-350">{o.owner}</span>
                <span className="text-white font-bold">{o.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Win Probability */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Key Deals in Flight</h3>
          <div className="space-y-3 text-xs">
            {pipelineData.map((d, idx) => (
              <div key={d.id || idx} className="p-3 bg-[#0e1628] rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{d.name}</span>
                  <span className="text-emerald-400 font-bold font-mono">₹ {d.value} Cr</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Stage: {d.stage}</span>
                  <span className="text-blue-400 font-bold">{d.prob} prob</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Deals likely to close this month", "Owner performance forecast", "Target gap analysis"]} />
    </div>
  );
}
