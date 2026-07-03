"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { FileText, TrendingUp, DollarSign, Award, Target, AlertCircle, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface TimelineItem {
  m: string;
  index: number;
}

interface ExecutiveMetrics {
  healthIndex: string;
  targetEfficiency: string;
  totalProfitForecast: string;
  operationSpeedIndex: string;
  timeline: TimelineItem[];
}

export default function ExecutiveCommand() {
  const [metrics, setMetrics] = useState<ExecutiveMetrics>({
    healthIndex: "0.0%",
    targetEfficiency: "0.0%",
    totalProfitForecast: "₹ 0.0 Cr",
    operationSpeedIndex: "Pending",
    timeline: []
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadMetrics() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const token = localStorage.getItem("buildcon_token");
      if (!token) {
        setErrorMsg("Session expired or missing authentication.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8081/api/md/executive/metrics", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      } else {
        setErrorMsg("Failed to retrieve executive command metrics from database.");
      }
    } catch (err) {
      console.error("Failed to load executive metrics:", err);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            01. EXECUTIVE COMMAND
          </h2>
          <p className="text-xs text-slate-400">Strategic decisions, health indexes, and corporate benchmarks</p>
        </div>
        <button
          onClick={loadMetrics}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-xs text-slate-400">Loading system metrics from server...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl p-5 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="text-xs font-semibold">{errorMsg}</div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Command Health Index</div>
                <div className="text-2xl font-bold text-white mt-1">{metrics.healthIndex}</div>
                <div className="text-[10px] text-emerald-400 mt-1">↑ Dynamic Index</div>
              </div>
              <Target className="h-8 w-8 text-blue-500/20" />
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Target Efficiency</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.targetEfficiency}</div>
                <div className="text-[10px] text-slate-500 mt-1">On-Track projects count</div>
              </div>
              <Award className="h-8 w-8 text-emerald-500/20" />
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Total Profit Forecast</div>
                <div className="text-2xl font-bold text-white mt-1">{metrics.totalProfitForecast}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Estimated 15% net margin</div>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500/20" />
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Operation Speed Index</div>
                <div className="text-2xl font-bold text-blue-400 mt-1">{metrics.operationSpeedIndex}</div>
                <div className="text-[10px] text-slate-500 mt-1">Based on delay tracking</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500/20" />
            </div>
          </div>

          {/* Chart */}
          {metrics.timeline && metrics.timeline.length > 0 && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-lg animate-fadeIn">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Operational Efficiency Index Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.timeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis domain={[20, 100]} stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F182A", borderColor: "#1E293B", color: "#F8FAFC" }} />
                    <Area type="monotone" dataKey="index" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIndex)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      <AIAssistantBar suggestions={["Operational summaries", "Strategic options", "Forecast reports", "Audit telemetry"]} />
    </div>
  );
}
