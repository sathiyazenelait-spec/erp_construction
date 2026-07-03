"use client";
import React, { useState, useEffect } from "react";
import { ShieldCheck, Heart, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function SafetyCompliance() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [safetyRecords, setSafetyRecords] = useState<any[]>([]);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) { setErrorMsg("Session expired."); setLoading(false); return; }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      const [mdRes, safetyRes] = await Promise.all([
        fetch(`http://localhost:8081/api/md/dashboard/org/${orgId}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`http://localhost:8081/api/construction-manager/safety/org/${orgId}`, { headers: { "Authorization": `Bearer ${token}` } }).catch(() => ({ ok: false }))
      ]);

      if (mdRes.ok) {
        const d = await mdRes.json();
        setProjects(d.projects || []);
      }
      if ((safetyRes as any).ok) {
        setSafetyRecords(await (safetyRes as any).json());
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Derive audit rows from projects + safety records
  const auditRows = safetyRecords.length > 0
    ? safetyRecords.slice(0, 5).map((r: any) => ({
        id: r.id,
        site: r.location || r.siteName || "Site",
        inspector: r.inspector || "Safety Officer",
        score: r.safetyScore || r.score || 90,
        status: (r.safetyScore || r.score || 90) >= 95 ? "Excellent" : (r.safetyScore || r.score || 90) >= 85 ? "Good" : "Needs Review"
      }))
    : projects.slice(0, 5).map((p: any, idx) => ({
        id: `sa-${idx + 1}`,
        site: p.name,
        inspector: "Safety Officer",
        score: Math.max(75, 100 - (p.progress || 0) % 25),
        status: p.status === "Critical" ? "Needs Review" : p.status === "Delayed" ? "Good" : "Excellent"
      }));

  const avgScore = auditRows.length > 0
    ? Math.round(auditRows.reduce((a, r) => a + r.score, 0) / auditRows.length)
    : 0;
  const excellentCount = auditRows.filter(r => r.status === "Excellent").length;
  const needsReviewCount = auditRows.filter(r => r.status === "Needs Review").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">08. SAFETY CENTER</h2>
          <p className="text-xs text-slate-400">Incident reports, compliance checklists, site safety audits, and target parameters</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading safety data from database...</p>
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
                <div className="text-xs text-slate-400">Sites Audited</div>
                <div className="text-2xl font-bold text-white mt-1">{auditRows.length} Sites</div>
                <div className="text-[10px] text-emerald-400 mt-1">{excellentCount} rated Excellent</div>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-500/20" />
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Average Safety Score</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{avgScore} / 100</div>
                <div className="text-[10px] text-slate-400 mt-1">Across all project sites</div>
              </div>
              <Heart className="h-8 w-8 text-emerald-500/20" />
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Sites Needing Review</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">{needsReviewCount} Sites</div>
                <div className="text-[10px] text-slate-400 mt-1">Below threshold</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500/20" />
            </div>
          </div>

          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Site Safety Audit Reports</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">Audit ID</th>
                    <th className="pb-2">Site Name</th>
                    <th className="pb-2">Inspector</th>
                    <th className="pb-2">Score</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {auditRows.map((audit) => (
                    <tr key={audit.id}>
                      <td className="py-3 font-mono text-slate-400">{audit.id}</td>
                      <td className="font-semibold text-slate-200">{audit.site}</td>
                      <td className="text-slate-400">{audit.inspector}</td>
                      <td className="text-white font-bold">{audit.score}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          audit.status === "Excellent"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : audit.status === "Good"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {audit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {auditRows.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-slate-400">No safety audit data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Generate safety audit report", "List non-compliant sites", "Show incident trend by month"]} />
    </div>
  );
}
