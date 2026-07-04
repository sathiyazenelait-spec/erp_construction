"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Sparkles, Trophy, DollarSign, CheckCircle2, ShieldAlert, Briefcase, Users, Hammer, CreditCard, Star, Heart, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { departments, revenueTrend } from "@/lib/data";
import { getSession } from "@/lib/auth";



export default function MDDashboard() {
  const [dbAlerts, setDbAlerts] = useState<any[]>([]);
  const [notifiedReports, setNotifiedReports] = useState<any[]>([]);
  const [chairmanNotice, setChairmanNotice] = useState<string | null>(null);

  // Dynamic States
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [revenueMtd, setRevenueMtd] = useState("");
  const [netProfitMtd, setNetProfitMtd] = useState("");
  const [activeProjectsCount, setActiveProjectsCount] = useState("0");
  const [leadsGenerated, setLeadsGenerated] = useState("0");
  const [cashPosition, setCashPosition] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [projectList, setProjectList] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleStorage = () => {
        setChairmanNotice(localStorage.getItem("chairman_noticed_alert_msg"));
      };
      handleStorage();
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, []);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const sessionStr = localStorage.getItem("buildcon_session");
        const token = localStorage.getItem("buildcon_token");
        if (!sessionStr || !token) return;
        const session = JSON.parse(sessionStr);
        const orgId = session.organizationId;
        if (!orgId) return;

        const res = await fetch(`https://erp-construction.onrender.com/api/alerts/org/${orgId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDbAlerts(data);
        }
      } catch (e) {
        console.error("Failed to fetch alerts in MD dashboard", e);
      }
    }
    fetchAlerts();

    const loadReports = () => {
      const stored = localStorage.getItem("notified_reports_md");
      if (stored) {
        setNotifiedReports(JSON.parse(stored));
      } else {
        setNotifiedReports([]);
      }
    };
    loadReports();
    window.addEventListener("storage", loadReports);
    return () => window.removeEventListener("storage", loadReports);
  }, []);

  useEffect(() => {
    const s = getSession();
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    fetch(`https://erp-construction.onrender.com/api/md/dashboard/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        setProfileName(d.profileName || s?.name || "Managing Director");
        setRevenueMtd(d.revenue_mtd || "N/A");
        setNetProfitMtd(d.net_profit_mtd || "N/A");
        setActiveProjectsCount(d.active_projects_count || String((d.projects || []).length));
        setLeadsGenerated(d.leads_generated || "N/A");
        setCashPosition(d.cash_position || "N/A");
        if (d.ai_suggestions) {
          setAiSuggestions(d.ai_suggestions.split("|").map((item: string) => item.trim()));
        }
        if (d.projects) {
          setProjectList(d.projects);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading MD dashboard metrics:", err);
        setLoading(false);
      });
  }, []);

  const dismissReport = (id: number) => {
    const updated = notifiedReports.filter(r => r.id !== id);
    setNotifiedReports(updated);
    localStorage.setItem("notified_reports_md", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const downloadPDF = (report: any, proj: any) => {
    if (!report || !proj) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download the PDF report.");
      return;
    }
    const start = proj.startDate || "N/A";
    const end = proj.endDate || "N/A";
    printWindow.document.write(`
      <html>
        <head>
          <title>AI Progress Report - ${proj.name}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #1e293b;
              margin: 40px;
              line-height: 1.5;
            }
            .header {
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo-section h1 {
              margin: 0;
              font-size: 24px;
              color: #f59e0b;
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .logo-section p {
              margin: 2px 0 0 0;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #64748b;
            }
            .report-meta {
              text-align: right;
              font-size: 12px;
              color: #475569;
            }
            .title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #0f172a;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .card {
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              background-color: #f8fafc;
            }
            .card-title {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .card-value {
              font-size: 18px;
              font-weight: bold;
              color: #0f172a;
            }
            .section-title {
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #475569;
              margin-bottom: 12px;
              border-left: 3px solid #f59e0b;
              padding-left: 8px;
            }
            .bullet-list {
              padding-left: 20px;
              margin-bottom: 30px;
            }
            .bullet-list li {
              font-size: 13px;
              margin-bottom: 8px;
              color: #334155;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
            }
            .badge-on-track {
              background-color: #d1fae5;
              color: #065f46;
              padding: 3px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: bold;
            }
            .badge-delayed {
              background-color: #fee2e2;
              color: #991b1b;
              padding: 3px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <h1>BUILDWELL</h1>
              <p>Constructions ERP</p>
            </div>
            <div class="report-meta">
              <div><strong>Document:</strong> Daily AI Site Progress Inspection</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <div><strong>Generated by:</strong> Vijay Raghavan (Site Eng.)</div>
            </div>
          </div>

          <div class="title">AI Progress Inspection Report: ${proj.name}</div>

          <div class="grid">
            <div class="card">
              <div class="card-title">Project Curing Timeline</div>
              <div style="font-size: 13px; color: #334155; margin-top: 5px;">
                <strong>Start Date:</strong> ${start} <br />
                <strong>End Date:</strong> ${end} <br />
                <strong>Status:</strong> <span class="${report.status === 'Delayed' ? 'badge-delayed' : 'badge-on-track'}">${report.status}</span>
              </div>
            </div>
            <div class="card">
              <div class="card-title">Timeline Curing Analytics</div>
              <div style="font-size: 13px; color: #334155; margin-top: 5px;">
                <strong>Expected Progress:</strong> ${report.expectedProgress}% <br />
                <strong>Visual Progress:</strong> ${report.actualProgress}% <br />
                <strong>Predicted Delay:</strong> ${report.delayDays} Days
              </div>
            </div>
          </div>

          <div class="section-title">AI Detected On-Site Inconsistencies</div>
          ${
            report.detectedIssues && report.detectedIssues.length > 0
              ? `<ul class="bullet-list">${report.detectedIssues.map((issue: string) => `<li>⚠️ ${issue}</li>`).join("")}</ul>`
              : `<p style="font-size: 13px; color: #64748b; margin-bottom: 30px; font-style: italic">No major structural or material anomalies detected in this active building zone.</p>`
          }

          <div class="section-title">AI Curing & Recovery Suggestions</div>
          <ul class="bullet-list">
            ${
              report.suggestions && report.suggestions.length > 0
                ? report.suggestions.map((sug: string) => `<li>✓ ${sug}</li>`).join("")
                : `<li>✓ Maintain standard concrete watering hydration cycles.</li>`
            }
          </ul>

          <div class="section-title">AI Requirements Forecast</div>
          <div class="card" style="margin-bottom: 30px;">
            <p style="font-size: 13px; font-weight: bold; margin: 0; color: #0f172a;">🔮 ${report.predictedRequirements}</p>
          </div>

          <div class="footer">
            BuildWell Constructions ERP • Automated AI Progress Check Reports System • Confidential
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadExcel = (report: any, proj: any) => {
    if (!report || !proj) return;
    const rows = [
      ["BUILDWELL CONSTRUCTIONS - DAILY SITE PROGRESS CHECK REPORT"],
      ["Project Name", proj.name],
      ["Status", report.status],
      ["Start Date", proj.startDate || ""],
      ["End Date", proj.endDate || ""],
      ["Generated Date", new Date().toLocaleDateString()],
      [],
      ["METRIC", "VALUE"],
      ["Expected Progress (%)", report.expectedProgress],
      ["Visual Progress (%)", report.actualProgress],
      ["Predicted Delay (Days)", report.predictedDelayDays],
      [],
      ["AI DETECTED ON-SITE INCONSISTENCIES"],
      ...((report.detectedIssues && report.detectedIssues.length > 0) 
        ? report.detectedIssues.map((issue: string) => [issue]) 
        : [["No structural inconsistencies or safety anomalies detected."]]),
      [],
      ["AI RECOVERY SUGGESTIONS"],
      ...((report.suggestions && report.suggestions.length > 0) 
        ? report.suggestions.map((sug: string) => [sug]) 
        : [["Maintain current curing wet Hessian wrap schedules."]]),
      [],
      ["AI REQUIREMENTS FORECAST"],
      [report.predictedRequirements]
    ];

    const csvContent = "\uFEFF" + rows.map((e: any[]) => e.map((val: any) => {
      if (val === undefined || val === null) return "";
      const strVal = val.toString().replace(/"/g, '""');
      return strVal.includes(",") || strVal.includes("\n") || strVal.includes('"') ? `"${strVal}"` : strVal;
    }).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${proj.name.replace(/\s+/g, "_")}_AI_Progress_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-350 text-xs font-semibold bg-[#0A1120]">
        Loading Executive Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {chairmanNotice && (
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-emerald-400 p-4 rounded-xl flex items-center justify-between animate-fadeIn shadow-lg shadow-emerald-900/5">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{chairmanNotice}</span>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem("chairman_noticed_alert_msg");
              setChairmanNotice(null);
              window.dispatchEvent(new Event("storage"));
            }}
            className="text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-colors pl-3 border-l border-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">01. EXECUTIVE SUMMARY</h2>
          <p className="text-xs text-slate-400 font-sans">Welcome {profileName} — Real-time operational dashboard for BuildWell Constructions</p>
        </div>
      </div>

      {/* Notified progress reports list */}
      {notifiedReports.map((report: any) => (
        <div key={report.id} className="bg-gradient-to-r from-amber-950/40 to-[#1e152f]/40 border border-amber-500/30 text-slate-200 p-4.5 rounded-xl flex flex-col gap-3 relative animate-fadeIn shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-500 animate-pulse" />
              <span className="font-bold text-sm text-white">MD Progress Vision Report Alert: '{report.projectName}'</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono bg-[#1a1120] px-2 py-0.5 rounded border border-slate-800">
                {report.notifiedDate} {report.notifiedTime}
              </span>
              <button 
                onClick={() => dismissReport(report.id)} 
                className="text-[10px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition border border-slate-750 font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 text-xs bg-[#0b0f19]/60 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-[9px] text-slate-450 uppercase block font-semibold">Expected Progress</span>
              <span className="text-sm font-bold font-mono text-blue-400">{report.expectedProgress}%</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-450 uppercase block font-semibold">Visual Progress</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{report.actualProgress}%</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-450 uppercase block font-semibold">Predicted Delay</span>
              <span className="text-sm font-bold font-mono text-rose-400">{report.delayDays} Days</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-450 uppercase block font-semibold">Project Status</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${report.status === 'Delayed' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{report.status}</span>
            </div>
          </div>

          <div className="text-xs space-y-1.5 bg-[#0b0f19]/30 p-2.5 rounded border border-slate-850">
            {report.detectedIssues && report.detectedIssues.length > 0 && (
              <div>
                <span className="font-bold text-slate-300">Detected Inconsistencies:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-350 mt-1">
                  {report.detectedIssues.map((issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {report.suggestions && report.suggestions.length > 0 && (
              <div className="mt-1">
                <span className="font-bold text-emerald-400">Recovery Suggestions:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-emerald-300 mt-1">
                  {report.suggestions.map((sug: string, idx: number) => (
                    <li key={idx}>{sug}</li>
                  ))}
                </ul>
              </div>
            )}

            {report.predictedRequirements && (
              <div className="mt-2 text-blue-400 text-[11px] font-semibold font-mono">
                🔮 AI Forecast: {report.predictedRequirements}
              </div>
            )}

            {report.siteEngineerJustification && (
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-[11px] text-amber-300 mt-2">
                <span className="font-bold block text-slate-450 uppercase text-[9px] mb-0.5">Site Engineer's Justification:</span>
                &ldquo;{report.siteEngineerJustification}&rdquo;
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => downloadPDF(report, { name: report.projectName, startDate: report.startDate, endDate: report.endDate })}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-[10px] font-bold border border-slate-750 transition flex items-center gap-1"
            >
              Download PDF Report
            </button>
            <button
              onClick={() => downloadExcel(report, { name: report.projectName, startDate: report.startDate, endDate: report.endDate })}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-[10px] font-bold border border-slate-750 transition flex items-center gap-1"
            >
              Download Excel Report
            </button>
          </div>
        </div>
      ))}

      {/* Database AI Delay Alerts */}
      {dbAlerts.filter(a => !a.resolved).map((alertItem: any) => (
        <div key={alertItem.id} className="bg-red-950/40 border border-red-500/30 text-red-400 p-4 rounded-xl flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
              <span className="font-bold text-xs">MD AI Progress Report: Project '{alertItem.projectName}' is delayed!</span>
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
        {/* Revenue MTD */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Revenue (MTD)</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{revenueMtd}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 15.6% vs last month</div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Net Profit (MTD)</span>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{netProfitMtd}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">Margin 23.6%</div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Active Projects</span>
            <Briefcase className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{activeProjectsCount}</div>
            <div className="text-[10px] text-slate-400 flex gap-2 mt-1">
              <span className="text-emerald-400">12 OT</span>
              <span className="text-amber-400">4 Dly</span>
              <span className="text-red-400">2 Crit</span>
            </div>
          </div>
        </div>

        {/* Leads Generated */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Leads Generated</span>
            <Users className="h-4 w-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{leadsGenerated}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">↑ 10.2% vs Apr 2025</div>
          </div>
        </div>

        {/* Cash Position */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Cash Position</span>
            <CreditCard className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{cashPosition}</div>
            <div className="text-[10px] text-slate-500 mt-1">Available balance</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Business Performance Overview</h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Revenue vs Profit</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectList.map((p, i) => ({ m: `P${i+1}`, v: Math.round((p.budget||0)/100000) })).slice(0,8)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0F182A", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Donut — dynamic */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Projects Status</h3>
          {(() => {
            const onTrack = projectList.filter(p => p.status === "On Track" || p.status === "Active").length;
            const delayed = projectList.filter(p => p.status === "Delayed").length;
            const critical = projectList.filter(p => p.status === "Critical").length;
            const dynStatus = [
              { name: "On Track", value: onTrack || 0, color: "#10B981" },
              { name: "Delayed", value: delayed || 0, color: "#F59E0B" },
              { name: "Critical", value: critical || 0, color: "#EF4444" },
            ].filter(s => s.value > 0);
            return (
              <div className="flex items-center justify-around h-56">
                <div className="h-36 w-36 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dynStatus.length > 0 ? dynStatus : [{name:"No Data",value:1,color:"#334155"}]} dataKey="value" nameKey="name" innerRadius={42} outerRadius={56} paddingAngle={4}>
                        {(dynStatus.length > 0 ? dynStatus : [{name:"No Data",value:1,color:"#334155"}]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{activeProjectsCount}</span>
                    <span className="text-[9px] text-slate-400">Total Projects</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {dynStatus.map((status) => (
                    <div key={status.name} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }}></span>
                      <span className="text-[10px] text-slate-350">{status.name}</span>
                      <span className="text-xs font-bold text-white">{status.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* KPI metrics - dynamic */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-around">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Leads Generated</span>
            <span>Active Projects</span>
            <span>On-Track Rate</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <div className="text-base font-bold text-white">{leadsGenerated}</div>
              <div className="text-[9px] text-emerald-400">From campaigns</div>
            </div>
            <div>
              <div className="text-base font-bold text-white">{activeProjectsCount}</div>
              <div className="text-[9px] text-emerald-400">Running now</div>
            </div>
            <div>
              <div className="text-base font-bold text-white">
                {projectList.length > 0 ? `${Math.round((projectList.filter(p => p.status === "On Track" || p.status === "Active").length / projectList.length) * 100)}%` : "N/A"}
              </div>
              <div className="text-[9px] text-slate-500">On-track projects</div>
            </div>
          </div>
        </div>

        {/* Risk / Alerts - dynamic from DB */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-4 w-4 text-red-400 animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Alert Highlights</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {dbAlerts.filter(a => !a.resolved).slice(0, 3).map((a: any) => (
              <li key={a.id} className="flex justify-between items-center">
                <span>{a.projectName}</span>
                <span className="text-red-400 font-semibold">{a.delayDays} Day Delay Risk</span>
              </li>
            ))}
            {projectList.filter(p => (p.actual || 0) > (p.budget || 0)).slice(0, 2).map((p: any) => (
              <li key={`budget-${p.id}`} className="flex justify-between items-center">
                <span>Budget overrun: {p.name}</span>
                <span className="text-amber-400">Monitor closely</span>
              </li>
            ))}
            {dbAlerts.filter(a => !a.resolved).length === 0 && projectList.filter(p => (p.actual || 0) > (p.budget || 0)).length === 0 && (
              <li className="text-emerald-400">✓ No active alerts — all projects healthy</li>
            )}
          </ul>
        </div>
      </div>

      <AIAssistantBar suggestions={aiSuggestions.length > 0 ? aiSuggestions : ["Show delayed projects", "Revenue forecast", "Department performance", "Cash flow prediction"]} />
    </div>
  );
}
