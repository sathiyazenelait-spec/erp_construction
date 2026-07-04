"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { TrendingUp, Clock, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function ProjectProgress() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    fetch(`https://erp-construction.onrender.com/api/projects/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setProjects(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects for progress:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-350 text-xs font-semibold">
        Loading Project Progress Analytics...
      </div>
    );
  }

  // Calculate dynamic metrics
  const totalActual = projects.reduce((acc, p) => acc + (p.actualProgress || 0), 0);
  const avgProgress = projects.length > 0 ? (totalActual / projects.length).toFixed(1) : "0.0";

  const onTrackCount = projects.filter((p) => (p.actualProgress || 0) >= (p.plannedProgress || 0)).length;
  const onTrackPercent = projects.length > 0 ? Math.round((onTrackCount / projects.length) * 100) : 0;

  const criticalCount = projects.filter((p) => ((p.actualProgress || 0) - (p.plannedProgress || 0)) <= -10).length;

  // Generate dynamic monthly trend from project portfolio
  const generateProgressTrend = (projectList: any[]) => {
    const months = [
      { name: "Jan", date: new Date("2026-01-31") },
      { name: "Feb", date: new Date("2026-02-28") },
      { name: "Mar", date: new Date("2026-03-31") },
      { name: "Apr", date: new Date("2026-04-30") },
      { name: "May", date: new Date("2026-05-31") },
      { name: "Jun", date: new Date("2026-06-25") },
    ];

    if (!projectList || projectList.length === 0) {
      return months.map(m => ({ m: m.name, Planned: 0, Actual: 0 }));
    }

    return months.map(m => {
      let totalPlanned = 0;
      let totalActual = 0;

      projectList.forEach(p => {
        const start = p.startDate ? new Date(p.startDate) : new Date("2026-01-01");
        const currentValPlanned = p.plannedProgress || 0;
        const currentValActual = p.actualProgress || 0;
        const today = new Date("2026-06-25"); // Anchor today to context date

        if (m.date < start) {
          // Project hasn't started yet
          totalPlanned += 0;
          totalActual += 0;
        } else if (m.date >= today) {
          // Current/future month gets the current progress
          totalPlanned += currentValPlanned;
          totalActual += currentValActual;
        } else {
          // Interpolate monthly progress from start to today
          const totalDuration = today.getTime() - start.getTime();
          const elapsedDuration = m.date.getTime() - start.getTime();
          const fraction = totalDuration > 0 ? Math.max(0, Math.min(1, elapsedDuration / totalDuration)) : 0;

          totalPlanned += Math.round(fraction * currentValPlanned);
          totalActual += Math.round(fraction * currentValActual);
        }
      });

      return {
        m: m.name,
        Planned: Math.round(totalPlanned / projectList.length),
        Actual: Math.round(totalActual / projectList.length)
      };
    });
  };

  const progressTrend = generateProgressTrend(projects);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide font-sans">01. PROJECT PROGRESS</h2>
        <p className="text-xs text-slate-400">Detailed overview of target completions, milestone progress trends, and variances across active sites.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Average Portfolio Progress</div>
            <div className="text-xl font-bold text-white">{avgProgress}%</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Projects On Track</div>
            <div className="text-xl font-bold text-white">{onTrackPercent}% ({onTrackCount} {onTrackCount === 1 ? "Site" : "Sites"})</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 grid place-items-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Critical Delays</div>
            <div className="text-xl font-bold text-rose-400">{criticalCount} {criticalCount === 1 ? "Project" : "Projects"}</div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Milestone Progress Trend (Planned vs Actual %)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Area name="Planned Progress" type="monotone" dataKey="Planned" stroke="#3B82F6" strokeWidth={1.5} fillOpacity={1} fill="url(#plannedGrad)" />
              <Area name="Actual Progress" type="monotone" dataKey="Actual" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#actualGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project detailed table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Detailed Project Milestones Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Project Name</th>
                <th className="pb-2">Planned Progress</th>
                <th className="pb-2">Actual Progress</th>
                <th className="pb-2">Variance</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {projects.map((p, idx) => {
                const planned = p.plannedProgress || 0;
                const actual = p.actualProgress || 0;
                const variance = actual - planned;
                const varianceStr = variance >= 0 ? `+${variance}%` : `${variance}%`;
                
                let status = "On Track";
                if (variance <= -10) {
                  status = "Critical";
                } else if (variance < 0) {
                  status = "Behind";
                }

                return (
                  <tr key={p.id || idx}>
                    <td className="py-3 font-medium text-slate-200">{p.name}</td>
                    <td className="text-slate-350">{planned}%</td>
                    <td className="text-white font-bold">{actual}%</td>
                    <td className={variance < 0 ? "text-rose-455 text-rose-450 text-rose-400 font-semibold" : "text-emerald-450 text-emerald-400 font-semibold"}>
                      {varianceStr}
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        status === "Critical" 
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                          : status === "Behind"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400">
                    No projects found for this organization.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Export progress audit log", "Compare Chennai vs Madurai site progress", "Check delayed tasks detail"]} />
    </div>
  );
}
