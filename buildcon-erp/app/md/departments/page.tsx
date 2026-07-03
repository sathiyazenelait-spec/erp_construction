"use client";
import React, { useState, useEffect } from "react";
import { Users, Award, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function DepartmentPerformance() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});

  async function loadData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) { setErrorMsg("Session expired."); setLoading(false); return; }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      const res = await fetch(`http://localhost:8081/api/md/dashboard/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setProjects(d.projects || []);
        setMetrics(d);
      } else {
        setErrorMsg("Failed to retrieve department data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Derive department-level stats from projects
  const deptStats = [
    { name: "Projects / Engineering", color: "#3B82F6", score: projects.length > 0 ? Math.round((projects.filter(p => p.status === "On Track" || p.status === "Active").length / projects.length) * 100) : 0, projects: projects.length },
    { name: "Finance & Accounts", color: "#10B981", score: projects.length > 0 ? Math.round(100 - ((projects.filter(p => (p.actual||0) > (p.budget||0)).length / projects.length) * 100)) : 0, projects: projects.filter(p => (p.budget||0) > 0).length },
    { name: "Procurement", color: "#F59E0B", score: 0, projects: 0 },
    { name: "Human Resources", color: "#8B5CF6", score: 0, projects: 0 },
    { name: "Sales & Marketing", color: "#EF4444", score: 0, projects: 0 },
  ];

  const topDept = [...deptStats].sort((a, b) => b.score - a.score)[0];
  const onTrack = projects.filter(p => p.status === "On Track" || p.status === "Active").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">03. DEPARTMENT PERFORMANCE</h2>
          <p className="text-xs text-slate-400">Track and manage departmental execution efficiency and manager scorecards</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading department data from database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 grid place-items-center text-emerald-400 border border-emerald-500/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Top Performing Dept</div>
                <div className="text-sm font-bold text-white mt-1">{topDept?.name || "N/A"}</div>
                <div className="text-[10px] text-emerald-400">{topDept?.score || 0}% on-track rate</div>
              </div>
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 grid place-items-center text-blue-400 border border-blue-500/20">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Active Projects</div>
                <div className="text-sm font-bold text-white mt-1">{projects.length} Total</div>
                <div className="text-[10px] text-blue-400">{onTrack} on-track</div>
              </div>
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 grid place-items-center text-amber-400 border border-amber-500/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Budget Overruns</div>
                <div className="text-sm font-bold text-amber-400 mt-1">{projects.filter(p => (p.actual||0) > (p.budget||0)).length} Projects</div>
                <div className="text-[10px] text-slate-400">Needs review</div>
              </div>
            </div>
          </div>

          {/* Department Scorecards */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Scorecards</h3>
            <div className="space-y-4">
              {deptStats.map((dept, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{dept.name}</span>
                    <span className="text-white font-bold">{dept.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${dept.score}%`, backgroundColor: dept.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project-Level Table */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Project Execution Summary</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">Project Name</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Progress</th>
                    <th className="pb-2">Budget</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 font-semibold text-slate-200">{p.name}</td>
                      <td className="text-slate-400">{p.location || "N/A"}</td>
                      <td className="text-white font-bold">{p.progress || 0}%</td>
                      <td className="text-slate-350">₹ {((p.budget||0)/100000).toFixed(1)} L</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          p.status === "On Track" || p.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : p.status === "Critical"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {p.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-slate-400">No project data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Rank departments by efficiency", "Show delayed project owners", "Budget variance analysis"]} />
    </div>
  );
}
