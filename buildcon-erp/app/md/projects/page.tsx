"use client";
import React, { useState, useEffect } from "react";
import { Briefcase, Building, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface ProjectItem {
  id: number;
  name: string;
  budget: number;
  actual: number;
  progress: number;
  profit: number;
  status: string;
  location: string;
  siteManagementId?: number | null;
}

export default function ProjectsCommandCenter() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [siteManagers, setSiteManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadSiteManagers(orgId: number, token: string) {
    try {
      const res = await fetch(`https://erp-construction.onrender.com/api/site-management/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSiteManagers(data);
      }
    } catch (e) {
      console.error("Failed to load site managers:", e);
    }
  }

  const handleAssignSiteManager = async (projectId: number, managerIdStr: string) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const managerId = managerIdStr ? parseInt(managerIdStr) : null;
      if (!managerId) return;

      const res = await fetch(`https://erp-construction.onrender.com/api/projects/${projectId}/assign-site/${managerId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Site manager assigned successfully!");
        loadProjects();
      } else {
        alert("Failed to assign site manager");
      }
    } catch (err) {
      console.error("Error assigning site manager:", err);
    }
  };

  async function loadProjects() {
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
      const orgId = session.organizationId;
      if (!orgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      await loadSiteManagers(orgId, token);

      const res = await fetch(`https://erp-construction.onrender.com/api/projects/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const mapped: ProjectItem[] = data.map((p: any) => {
          const budgetInCr = p.budget > 1000 ? p.budget / 10000000.0 : p.budget;
          const progressPct = parseInt(p.workforceDetails) || 0;
          
          let actualInCr = budgetInCr * (progressPct / 100.0);
          if (p.status === "Critical") {
            actualInCr = budgetInCr * 1.1;
          } else if (p.status === "Delayed") {
            actualInCr = budgetInCr * 0.97;
          }
          
          const diffPct = budgetInCr > 0 ? ((budgetInCr - actualInCr) / budgetInCr) * 100.0 : 0;
          const profitPct = parseFloat(diffPct.toFixed(1));

          return {
            id: p.id,
            name: p.name,
            budget: parseFloat(budgetInCr.toFixed(2)),
            actual: parseFloat(actualInCr.toFixed(2)),
            progress: progressPct,
            profit: profitPct,
            status: p.status || "Planning",
            location: p.location || "N/A",
            siteManagementId: p.siteManagementId
          };
        });
        setProjects(mapped);
      } else {
        setErrorMsg("Failed to retrieve construction projects from backend.");
      }
    } catch (err) {
      console.error("Error loading projects command center:", err);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-500" />
            02. PROJECTS COMMAND CENTER
          </h2>
          <p className="text-xs text-slate-400">Monitor multi-site construction status, actual cost logs, and active progress</p>
        </div>
        <button
          onClick={loadProjects}
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
          <p className="text-xs text-slate-400">Retrieving project updates from the database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl p-5 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="text-xs font-semibold">{errorMsg}</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs italic">
          No projects registered in your organization yet.
        </div>
      ) : (
        /* Main projects table */
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-lg shadow-slate-950/20">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Building className="h-4 w-4 text-slate-450" />
            Construction Sites Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 font-semibold rounded-l-lg">Project Name</th>
                  <th className="p-3 font-semibold">Location</th>
                  <th className="p-3 font-semibold">Budget (₹ Cr)</th>
                  <th className="p-3 font-semibold">Actual Cost (₹ Cr)</th>
                  <th className="p-3 font-semibold">Progress</th>
                  <th className="p-3 font-semibold">Variance / Margin</th>
                  <th className="p-3 font-semibold">Site Manager</th>
                  <th className="p-3 font-semibold rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 font-medium text-white flex items-center gap-2">
                      <Building className="h-3.5 w-3.5 text-blue-400" />
                      {p.name}
                    </td>
                    <td className="p-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                        {p.location}
                      </div>
                    </td>
                    <td className="p-3 text-white">₹ {p.budget} Cr</td>
                    <td className="p-3 text-slate-300">₹ {p.actual} Cr</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-slate-800 rounded-full w-20 overflow-hidden border border-slate-700/50">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${p.progress}%`,
                              backgroundColor: p.status === "Critical" ? "#ef4444" : p.status === "Delayed" ? "#f59e0b" : "#10b981",
                            }}
                          />
                        </div>
                        <span className="text-[10px] w-6 text-right font-mono font-bold text-slate-200">{p.progress}%</span>
                      </div>
                    </td>
                    <td className={`p-3 font-bold ${p.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {p.profit >= 0 ? `+${p.profit}%` : `${p.profit}%`}
                    </td>
                    <td className="p-3">
                      <select
                        value={p.siteManagementId || ""}
                        onChange={(e) => handleAssignSiteManager(p.id, e.target.value)}
                        className="bg-[#0E1726] text-xs text-slate-200 border border-slate-800 rounded px-2.5 py-1 outline-none cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        {siteManagers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.username}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        p.status === "Delayed" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Highlight high budget delays", "Show delayed sites", "Detailed profit analysis", "Material forecast"]} />
    </div>
  );
}
