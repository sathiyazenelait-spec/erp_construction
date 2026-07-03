"use client";
import React, { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function RiskManagement() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) { setErrorMsg("Session expired."); setLoading(false); return; }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      const [alertRes, mdRes] = await Promise.all([
        fetch(`http://localhost:8081/api/alerts/org/${orgId}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`http://localhost:8081/api/md/dashboard/org/${orgId}`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      if (alertRes.ok) setAlerts(await alertRes.json());
      if (mdRes.ok) {
        const d = await mdRes.json();
        setProjects(d.projects || []);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const delayedProjects = projects.filter(p => p.status === "Delayed" || p.status === "Critical");
  const overBudgetProjects = projects.filter(p => (p.actual || 0) > (p.budget || 0));
  const mitigated = alerts.filter(a => a.resolved).length;

  const riskRows = [
    ...delayedProjects.slice(0, 2).map(p => ({
      id: `risk-delay-${p.id}`,
      category: "Operational",
      description: `${p.name} is ${p.status} — site at ${p.location || "N/A"}.`,
      impact: p.status === "Critical" ? "High" : "Medium",
      mitigation: "Escalate to site management and accelerate resource deployment."
    })),
    ...overBudgetProjects.slice(0, 1).map(p => ({
      id: `risk-budget-${p.id}`,
      category: "Financial",
      description: `Budget overrun detected in ${p.name}. Actual ₹${((p.actual||0)/100000).toFixed(1)}L vs Budget ₹${((p.budget||0)/100000).toFixed(1)}L.`,
      impact: "High",
      mitigation: "Freeze discretionary spending and review vendor contracts."
    })),
    ...unresolvedAlerts.slice(0, 2).map((a: any) => ({
      id: `risk-alert-${a.id}`,
      category: "Project Delay",
      description: `AI alert: ${a.projectName} delayed by ${a.delayDays} days. Expected ${a.expectedProgress}% vs Actual ${a.actualProgress}%.`,
      impact: "High",
      mitigation: a.predictedRequirements || "Review site progress and adjust schedule."
    }))
  ];

  const impactColor = (impact: string) =>
    impact === "High" ? "text-red-400" : impact === "Medium" ? "text-amber-400" : "text-emerald-400";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">09. RISK MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Identify, monitor, and mitigate active operational and financial risks</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading risk data from database...</p>
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
                <div className="text-xs text-slate-400">Total Logged Risks</div>
                <div className="text-2xl font-bold text-white mt-1">{riskRows.length} Risks</div>
                <div className="text-[10px] text-emerald-400 mt-1">{mitigated} mitigated (resolved alerts)</div>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500/20" />
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">High Impact Risks</div>
                <div className="text-2xl font-bold text-red-400 mt-1">{riskRows.filter(r => r.impact === "High").length} Critical</div>
                <div className="text-[10px] text-slate-400 mt-1">Requires immediate action</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500/20" />
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Mitigation Status</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{mitigated} Resolved</div>
                <div className="text-[10px] text-slate-400 mt-1">{unresolvedAlerts.length} still active</div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500/20" />
            </div>
          </div>

          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Active Risk Register</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Risk Description</th>
                    <th className="pb-2">Impact</th>
                    <th className="pb-2">Mitigation Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {riskRows.map(risk => (
                    <tr key={risk.id}>
                      <td className="py-3 font-semibold text-slate-200">{risk.category}</td>
                      <td className="text-slate-350 max-w-xs">{risk.description}</td>
                      <td className={`font-bold ${impactColor(risk.impact)}`}>{risk.impact}</td>
                      <td className="text-slate-400 max-w-xs">{risk.mitigation}</td>
                    </tr>
                  ))}
                  {riskRows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">No active risks detected. All projects on track.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Prioritize risk mitigation plan", "Generate risk summary report", "Identify budget overrun projects"]} />
    </div>
  );
}
