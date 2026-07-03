"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Building, Globe, ShieldAlert, Sparkles, TrendingUp, DollarSign, Clock, Users, ArrowUpRight, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

const progressDistributionData = [
  { name: "Residential", value: 7, color: "#10B981" },
  { name: "Commercial", value: 6, color: "#3B82F6" },
  { name: "Institutional", value: 4, color: "#F59E0B" },
  { name: "Industrial", value: 1, color: "#8B5CF6" },
];

const projectsByType = [
  { name: "On Track", value: 12, color: "#10B981" },
  { name: "Delayed", value: 4, color: "#F59E0B" },
  { name: "Critical", value: 2, color: "#EF4444" },
];

const locationsData = [
  { name: "Chennai", count: 8 },
  { name: "Coimbatore", count: 4 },
  { name: "Madurai", count: 3 },
  { name: "Trichy", count: 2 },
  { name: "Pondicherry", count: 1 },
];

export default function ProjectDirectorDashboard() {
  const [dbAlerts, setDbAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("Arvind Menon");
  const [totalProjects, setTotalProjects] = useState("18");
  const [totalProjectValue, setTotalProjectValue] = useState("₹ 138.6 Cr");
  const [totalCostIncurred, setTotalCostIncurred] = useState("₹ 105.4 Cr");
  const [averageProgress, setAverageProgress] = useState("56%");
  const [overallProfitMargin, setOverallProfitMargin] = useState("12.8%");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [projectList, setProjectList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const sessionStr = localStorage.getItem("buildcon_session");
        const token = localStorage.getItem("buildcon_token");
        if (!sessionStr || !token) return;
        const session = JSON.parse(sessionStr);
        const orgId = session.organizationId;
        if (!orgId) return;

        const res = await fetch(`http://localhost:8081/api/alerts/org/${orgId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDbAlerts(data);
        }
      } catch (e) {
        console.error("Failed to fetch alerts in Project Director dashboard", e);
      }
    }
    fetchAlerts();
  }, []);

  useEffect(() => {
    const s = getSession();
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    fetch(`http://localhost:8081/api/project-director/dashboard/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        setProfileName(d.profileName || "Arvind Menon");
        setTotalProjects(d.total_projects || "18");
        setTotalProjectValue(d.total_project_value || "₹ 138.6 Cr");
        setTotalCostIncurred(d.total_cost_incurred || "₹ 105.4 Cr");
        setAverageProgress(d.average_progress || "56%");
        setOverallProfitMargin(d.overall_profit_margin || "12.8%");
        if (d.ai_suggestions) {
          setAiSuggestions(d.ai_suggestions.split("|").map((item: string) => item.trim()));
        }
        if (d.projects) {
          setProjectList(d.projects);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading PD dashboard metrics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-350 text-xs font-semibold">
        Loading Portfolio Metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">PORTFOLIO OVERVIEW</h2>
          <p className="text-xs text-slate-400">Welcome, {profileName} — real-time portfolio metrics across all construction projects</p>
        </div>
      </div>

      {/* Database AI Delay Alerts */}
      {dbAlerts.filter(a => !a.resolved).map((alertItem: any) => (
        <div key={alertItem.id} className="bg-red-950/40 border border-red-500/30 text-red-400 p-4 rounded-xl flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
              <span className="font-bold text-xs">Project Director Alert: Project '{alertItem.projectName}' is delayed!</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{alertItem.alertTime ? alertItem.alertTime.replace('T', ' ').substring(0, 16) : ""}</span>
          </div>
          <div className="grid md:grid-cols-4 gap-4 text-xs mt-1 bg-[#16131F]/50 p-3 rounded-lg border border-red-900/20">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Expected Progress</span>
              <span className="text-sm font-bold font-mono text-blue-400">{alertItem.expectedProgress}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Actual progress</span>
              <span className="text-sm font-bold font-mono text-amber-400">{alertItem.actualProgress}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Timeline Delay</span>
              <span className="text-sm font-bold font-mono text-red-400">{alertItem.delayDays} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold font-mono">Predicted Requirements</span>
              <span className="text-[11px] text-slate-200">{alertItem.predictedRequirements}</span>
            </div>
          </div>
          <div className="text-xs space-y-1.5 mt-1 border-t border-slate-800/80 pt-2">
            <div><span className="font-semibold text-slate-300">Detected Issues:</span> {alertItem.detectedIssues}</div>
            {alertItem.siteEngineerJustification ? (
              <div className="bg-slate-900/40 p-2.5 rounded border border-slate-800 text-[11px] text-emerald-300">
                <span className="font-bold block text-slate-400 uppercase text-[9px] mb-0.5">Site Engineer's Justification:</span>
                &ldquo;{alertItem.siteEngineerJustification}&rdquo;
              </div>
            ) : (
              <div className="text-slate-500 italic text-[11px]">
                Waiting for Site Engineer delay justification...
              </div>
            )}
          </div>
        </div>
      ))}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Projects */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Projects</span>
            <Building className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <div className="text-[10px] text-slate-500 mt-1">12 On Track • 4 Delayed • 2 Critical</div>
          </div>
        </div>

        {/* Total Project Value */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Project Value</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-emerald-400">{totalProjectValue}</div>
            <div className="text-[10px] text-slate-500 mt-1">Active Projects</div>
          </div>
        </div>

        {/* Total Cost Incurred */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Cost Incurred</span>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{totalCostIncurred}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">76% of Budget</div>
          </div>
        </div>

        {/* Average Progress */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Average Progress</span>
            <Clock className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{averageProgress}</div>
            <div className="text-[10px] text-slate-500 mt-1">All Projects</div>
          </div>
        </div>

        {/* Overall Profit Margin */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Overall Profit Margin</span>
            <span className="text-xs text-emerald-400 font-bold">{overallProfitMargin}</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{overallProfitMargin}</div>
            <div className="text-[10px] text-emerald-400 mt-1">On Active Projects</div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Portfolio Overview Donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Project Portfolio Overview</h3>
          <div className="flex items-center justify-around h-56">
            <div className="h-36 w-36 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={projectsByType} dataKey="value" nameKey="name" innerRadius={42} outerRadius={56} paddingAngle={4}>
                    {projectsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{totalProjects}</span>
                <span className="text-[9px] text-slate-400">Total Projects</span>
              </div>
            </div>
            <div className="space-y-3">
              {projectsByType.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }}></span>
                  <span className="text-[10px] text-slate-350">{status.name}</span>
                  <span className="text-xs font-bold text-white">{status.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Summary list */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Projects Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-350">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2">Project Name</th>
                  <th className="py-2">Location</th>
                  <th className="py-2">Value</th>
                  <th className="py-2">Start Date</th>
                  <th className="py-2">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projectList.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="py-2.5 text-white font-medium">{p.name}</td>
                    <td className="py-2.5 text-slate-400">{p.location || "N/A"}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">₹ {(p.targetBudget / 10000000).toFixed(1)} Cr</td>
                    <td className="py-2.5 text-slate-300">{p.startDate || "N/A"}</td>
                    <td className="py-2.5 text-slate-300">{p.endDate || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Progress Distribution & Location */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Distribution */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Progress Distribution</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressDistributionData} margin={{ left: -20, right: 0, top: 5, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={25}>
                  {progressDistributionData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Stats */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Projects by Location</h3>
          <div className="space-y-2.5">
            {locationsData.map((loc, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-slate-350 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-400" />
                  {loc.name}
                </span>
                <span className="font-bold text-white">{loc.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Risks */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-slate-200 mb-2">Top Risk Projects</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Phoenix Commercial Complex</span>
              <span className="text-red-400 font-bold">78% Risk (45 Days)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Greenfield Apartments</span>
              <span className="text-amber-400 font-bold">35% Risk (15 Days)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">IT Park Phase - 1</span>
              <span className="text-amber-400 font-bold">28% Risk (20 Days)</span>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={aiSuggestions.length > 0 ? aiSuggestions : ["Highlight commercial risks", "Cities breakdown", "Which projects are delayed?", "Profitability forecast"]} />
    </div>
  );
}
