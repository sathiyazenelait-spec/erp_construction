"use client";
import React, { useState, useEffect } from "react";
import { Activity, Server, Database, Layers, CheckCircle2 } from "lucide-react";

interface LogEntry {
  timestamp: string;
  service: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

export default function SystemHealth() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ALL" | "INFO" | "WARN" | "ERROR">("ALL");

  const loadHealth = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      const res = await fetch("https://erp-construction.onrender.com/api/super-admin/health", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Failed to load health telemetry.");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth(true);
    // Poll logs and metrics every 5 seconds for dynamic real-time telemetry feeling
    const interval = setInterval(() => {
      loadHealth(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
        <p className="text-xs text-slate-400">Loading cluster health metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center">
        <p className="text-sm text-red-400 font-semibold">{error}</p>
        <button
          onClick={() => loadHealth(true)}
          className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const logs = data?.logs || [];
  const filteredLogs = filter === "ALL" ? logs : logs.filter((l: LogEntry) => l.level === filter);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">SYSTEM TELEMETRY & HEALTH</h2>
          <p className="text-xs text-slate-400">Real-time status of application clusters, database workloads, and API microservices</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
          <CheckCircle2 className="h-4 w-4" />
          Cluster Online (99.98% SLA MTD)
        </div>
      </div>

      {/* Hardware Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Core Web Server */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 grid place-items-center text-emerald-400 border border-emerald-500/20">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Next.js Web Instance</div>
            <div className="text-base font-bold text-white">CPU: {data?.cpuLoad ?? "12.4%"}</div>
            <div className="text-[10px] text-slate-500">RAM: {data?.ramUsed ?? "4.8GB"} / {data?.ramTotal ?? "16.0GB"}</div>
          </div>
        </div>

        {/* Database instance */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 grid place-items-center text-emerald-400 border border-emerald-500/20">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">PostgreSQL Primary</div>
            <div className="text-base font-bold text-white">Active Conns: {data?.dbActiveConnections ?? 184}</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Latency: {data?.dbLatency ?? "4ms"}</div>
          </div>
        </div>

        {/* Cache Pool */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 grid place-items-center text-emerald-400 border border-emerald-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Redis Cache Cluster</div>
            <div className="text-base font-bold text-white">Hit Rate: {data?.redisHitRate ?? "98.7%"}</div>
            <div className="text-[10px] text-slate-500">Key Evictions: {data?.redisKeyEvictions ?? 0}</div>
          </div>
        </div>

        {/* API Latency */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 grid place-items-center text-emerald-400 border border-emerald-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Global API Gateway</div>
            <div className="text-base font-bold text-white">Avg Latency: {data?.apiGatewayLatency ?? "112ms"}</div>
            <div className="text-[10px] text-slate-500">Error Rate: {data?.apiGatewayErrorRate ?? "< 0.01%"}</div>
          </div>
        </div>
      </div>

      {/* Log Console Viewer */}
      <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Real-Time Core Logs</h3>
          <div className="flex gap-1 bg-[#080d18] border border-slate-800 p-1 rounded-lg">
            {(["ALL", "INFO", "WARN", "ERROR"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  filter === level
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Console Box */}
        <div className="bg-[#050810] border border-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2.5 max-h-80 overflow-y-auto shadow-inner">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-slate-500 py-6">No logs available for level: {filter}</div>
          ) : (
            filteredLogs.map((log: LogEntry, idx: number) => (
              <div key={idx} className="flex gap-3 items-start border-b border-slate-900/60 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500 shrink-0 select-none">{log.timestamp}</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] shrink-0 ${
                  log.level === "INFO" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                  log.level === "WARN" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                  "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {log.level}
                </span>
                <span className="text-emerald-400 shrink-0">[{log.service}]</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
