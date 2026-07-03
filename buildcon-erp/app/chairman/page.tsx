"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { AlertTriangle, TrendingUp, TrendingDown, Sparkles, Trophy, DollarSign, CheckCircle2, ShieldAlert, Briefcase, Users, Hammer, CreditCard } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const revenueTrend = [
  { m: "Jan", r: 18.2, p: 4.1 },
  { m: "Feb", r: 19.5, p: 4.5 },
  { m: "Mar", r: 20.8, p: 4.9 },
  { m: "Apr", r: 22.0, p: 5.2 },
  { m: "May", r: 23.4, p: 5.5 },
  { m: "Jun", r: 24.5, p: 5.8 },
];

const projectStatus = [
  { name: "On Track", value: 12, color: "#10B981" },
  { name: "Delayed", value: 4, color: "#F59E0B" },
  { name: "Critical", value: 2, color: "#EF4444" },
];

export default function ChairmanDashboard() {
  const [liveAlert, setLiveAlert] = useState<string | null>(null);
  const [liveAlertTime, setLiveAlertTime] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [dbAlerts, setDbAlerts] = useState<any[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    notifyCuringDelay: true,
    notifyBudgetDeficit: true,
    notifyMaterialDelay: true,
  });
  const [stats, setStats] = useState({
    totalProjects: 18,
    activeProjects: 12,
    delayedProjects: 4,
    planningProjects: 2,
    totalBudget: 125000000.0,
    totalExpenses: 95000000.0,
    staffCount: 1240,
    labourCount: 15000,
    orgName: "BuildCon Organization",
    subscriptionTier: "Enterprise"
  });
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleResolveAlert = async (alertId: number, projectName: string) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/alerts/${alertId}/resolve`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setDbAlerts(prev => prev.filter(a => a.id !== alertId));
        const noticeMsg = `Chairman noticed progress warning: Project '${projectName}' delay alert has been acknowledged and dismissed.`;
        localStorage.setItem("chairman_noticed_alert_msg", noticeMsg);
        window.dispatchEvent(new Event("storage"));
      } else {
        alert("Failed to resolve alert.");
      }
    } catch (e) {
      console.error("Error resolving alert", e);
    }
  };

  const handleResolveLiveAlert = () => {
    localStorage.removeItem("chairman_delay_alert_msg");
    localStorage.removeItem("chairman_delay_alert_time");
    setLiveAlert(null);
    const noticeMsg = `Chairman noticed live warning: AI Site Delay Alert has been acknowledged and dismissed.`;
    localStorage.setItem("chairman_noticed_alert_msg", noticeMsg);
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const msg = localStorage.getItem("chairman_delay_alert_msg");
      const time = localStorage.getItem("chairman_delay_alert_time");
      if (msg) {
        setLiveAlert(msg);
        setLiveAlertTime(time);
      }
    }

    async function fetchStats() {
      try {
        const sessionStr = localStorage.getItem("buildcon_session");
        const token = localStorage.getItem("buildcon_token");
        if (!sessionStr || !token) {
          setLoadingStats(false);
          return;
        }
        const session = JSON.parse(sessionStr);
        const orgId = session.organizationId;
        if (!orgId) {
          setLoadingStats(false);
          return;
        }

        const res = await fetch(`http://localhost:8081/api/chairman/dashboard/${orgId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalProjects: data.totalProjects ?? 0,
            activeProjects: data.activeProjects ?? 0,
            delayedProjects: data.delayedProjects ?? 0,
            planningProjects: data.planningProjects ?? 0,
            totalBudget: data.totalBudget ?? 0.0,
            totalExpenses: data.totalExpenses ?? 0.0,
            staffCount: data.staffCount ?? 0,
            labourCount: data.labourCount ?? 0,
            orgName: data.orgName ?? "BuildCon Organization",
            subscriptionTier: data.subscriptionTier ?? "Enterprise"
          });
          if (data.ai_suggestions) {
            setAiSuggestions(data.ai_suggestions.split("|").map((item: string) => item.trim()));
          }
          if (data.subscriptionTier) {
            localStorage.setItem("selected_login_tier", data.subscriptionTier);
          }
        }

        // Fetch DB project alerts
        const alertsRes = await fetch(`http://localhost:8081/api/alerts/org/${orgId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setDbAlerts(alertsData);
        }

        // Fetch Settings for Alert Filtering
        const settingsRes = await fetch("http://localhost:8081/api/chairman/settings", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setNotificationSettings({
            notifyCuringDelay: settingsData.notifyCuringDelay !== false,
            notifyBudgetDeficit: settingsData.notifyBudgetDeficit !== false,
            notifyMaterialDelay: settingsData.notifyMaterialDelay !== false,
          });
        }
      } catch (e) {
        console.error("Failed to fetch chairman dashboard stats", e);
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();

    // Listen to storage events to refresh settings if edited in another tab
    const handleStorage = async () => {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;
      try {
        const settingsRes = await fetch("http://localhost:8081/api/chairman/settings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setNotificationSettings({
            notifyCuringDelay: settingsData.notifyCuringDelay !== false,
            notifyBudgetDeficit: settingsData.notifyBudgetDeficit !== false,
            notifyMaterialDelay: settingsData.notifyMaterialDelay !== false,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const shouldShowAlert = (alertItem: any) => {
    const issues = (alertItem.detectedIssues || "").toLowerCase();
    
    // Check if curing alert
    if (issues.includes("curing") || issues.includes("concrete") || issues.includes("hydration")) {
      return notificationSettings.notifyCuringDelay;
    }
    // Check if budget/cost alert
    if (issues.includes("budget") || issues.includes("deficit") || issues.includes("cost") || issues.includes("price") || issues.includes("expense")) {
      return notificationSettings.notifyBudgetDeficit;
    }
    // Check if material alert
    if (issues.includes("material") || issues.includes("steel") || issues.includes("cement") || issues.includes("supply") || issues.includes("ties") || issues.includes("aggregate")) {
      return notificationSettings.notifyMaterialDelay;
    }
    return true;
  };

  const shouldShowLiveAlert = () => {
    if (!liveAlert) return false;
    const alertText = liveAlert.toLowerCase();
    
    if (alertText.includes("curing") || alertText.includes("concrete") || alertText.includes("hydration")) {
      return notificationSettings.notifyCuringDelay;
    }
    if (alertText.includes("budget") || alertText.includes("deficit") || alertText.includes("cost") || alertText.includes("price") || alertText.includes("expense")) {
      return notificationSettings.notifyBudgetDeficit;
    }
    if (alertText.includes("material") || alertText.includes("steel") || alertText.includes("cement") || alertText.includes("supply") || alertText.includes("ties") || alertText.includes("aggregate") || alertText.includes("lagging")) {
      return notificationSettings.notifyCuringDelay || notificationSettings.notifyMaterialDelay;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* 01. Title bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">01. EXECUTIVE SUMMARY</h2>
          <p className="text-xs text-slate-400 font-medium">
            Real-time snapshot of <span className="text-amber-400 font-semibold">{stats.orgName}</span> ({stats.subscriptionTier} Tier)
          </p>
        </div>
      </div>

      {/* Database AI Delay Alerts */}
      {dbAlerts.filter(a => !a.resolved && shouldShowAlert(a)).map((alertItem: any) => (
        <div key={alertItem.id} className="bg-red-950/40 border border-red-500/30 text-red-400 p-4 rounded-xl flex flex-col gap-2 relative animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
              <span className="font-bold text-xs">AI Progress Warning: Project '{alertItem.projectName}' is lagging!</span>
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
          <div className="text-xs space-y-1.5 mt-1 border-t border-slate-800/80 pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
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
            <button
              onClick={() => handleResolveAlert(alertItem.id, alertItem.projectName)}
              className="bg-red-850 hover:bg-red-800 text-white border border-red-700/40 hover:border-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wide shrink-0 h-fit"
            >
              Remove Warning & Notify
            </button>
          </div>
        </div>
      ))}

      {/* Dynamic AI Alert Banner */}
      {shouldShowLiveAlert() && (
        <div className="bg-red-950/45 border border-red-500/30 text-red-400 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            <div className="text-xs">
              <span className="font-bold">Live AI Site Delay Alert:</span> {liveAlert}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] text-slate-500 font-mono font-semibold">{liveAlertTime}</span>
            <button
              onClick={handleResolveLiveAlert}
              className="bg-red-850 hover:bg-red-800 text-white border border-red-700/40 hover:border-red-600 px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all uppercase tracking-wide"
            >
              Remove Warning & Notify
            </button>
          </div>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Projects */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Projects</span>
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
            <div className="text-[9px] text-slate-400 flex flex-wrap gap-1.5 mt-1">
              <span className="text-emerald-400 font-semibold">{stats.activeProjects} Active</span>
              <span className="text-amber-400">{stats.delayedProjects} Delayed</span>
              <span className="text-blue-400">{stats.planningProjects} Planning</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Total Budget Value</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹ {(stats.totalBudget / 10000000).toFixed(2)} Cr</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">From active project profiles</div>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Claims Expense (MTD)</span>
            <CreditCard className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">₹ {(stats.totalExpenses / 10000000).toFixed(2)} Cr</div>
            <div className="text-[10px] text-slate-400 mt-1">Sum of approved subcontractor claims</div>
          </div>
        </div>

        {/* Staff Count */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Active Staff</span>
            <Users className="h-4 w-4 text-violet-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{stats.staffCount}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">94% active on-site</div>
          </div>
        </div>

        {/* Equipment Status */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400">Equipment Status</span>
            <Hammer className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">94%</div>
            <div className="text-[10px] text-yellow-400 font-semibold mt-1">2 cranes under service</div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Revenue Trend (Last 6 Months)</h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">₹ Cr</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="r" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Profit Trend (Last 6 Months)</h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">₹ Cr</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="p" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects status Donut */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Projects by Status</h3>
          <div className="flex items-center justify-around h-56">
            <div className="h-40 w-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={projectStatus} dataKey="value" nameKey="name" innerRadius={48} outerRadius={68} paddingAngle={4}>
                    {projectStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">18</span>
                <span className="text-[10px] text-slate-400">Total Projects</span>
              </div>
            </div>
            <div className="space-y-3">
              {projectStatus.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }}></span>
                  <span className="text-xs text-slate-300 font-medium">{status.name}</span>
                  <span className="text-xs font-bold text-white">{status.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Insights & risk highlights */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* AI Insights */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">AI Insights</h3>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 bg-blue-500 rounded-full shrink-0"></span>
              <span>Commercial Complex project is **30%** over budget, due to concrete price increases. Action required.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0"></span>
              <span>Profit margins improved by **1.8%** compared to last month across high-value luxury sectors.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 bg-purple-500 rounded-full shrink-0"></span>
              <span>Cash flow health forecast is healthy for the next 60 days with strong receivable collections.</span>
            </li>
          </ul>
        </div>

        {/* Highlight components */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Trophy className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Top Performing Project</h4>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-white">Skyline Apartments</div>
            <div className="text-xs text-slate-400">Progress: <span className="text-white font-semibold">48%</span></div>
            <div className="text-xs text-slate-400">Profit Margin: <span className="text-emerald-400 font-semibold">18%</span></div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-bold">On Track</div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <ShieldAlert className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Top Risk Alert</h4>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-white">Commercial Complex</div>
            <p className="text-xs text-slate-400">Concrete price increase & labour shortage are impacting timeline.</p>
          </div>
          <div className="mt-3">
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">Immediate attention required</span>
          </div>
        </div>
      </div>

      {/* AI Performance Audits */}
      <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Post-Project Performance Audits</h3>
        </div>
        <p className="text-xs text-slate-400">
          Historical evaluations generated by the Python post-construction AI performance models.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            { project: "Prestige Plaza (Completed)", efficiency: "94.2%", budgetVariance: "-2.4% (Under Budget)", remarks: "Exceptional concrete curing and scaffolding synchronization. Pre-fabricated cores saved 11 days." },
            { project: "Skyline Residences Phase 1 (Completed)", efficiency: "88.6%", budgetVariance: "+1.8% (Over Budget)", remarks: "Minor budget variance due to Q1 cement surge. Overall logistics execution rate is highly optimal." },
            { project: "Greenfield Park (Completed)", efficiency: "91.0%", budgetVariance: "-0.5% (On Budget)", remarks: "Laborer distribution matched planned targets. Materials buffer optimized surplus stock to 0.4% wastage." }
          ].map((audit, idx) => (
            <div key={idx} className="p-4 bg-[#0E1726]/60 border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-white truncate max-w-[150px]">{audit.project}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">{audit.efficiency} Eff.</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                <span className="text-slate-500 font-semibold uppercase">Cost Variance: </span>
                <span className={audit.budgetVariance.includes("-") ? "text-emerald-400" : "text-amber-400 font-semibold"}>{audit.budgetVariance}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-800/80 pt-2">
                &ldquo;{audit.remarks}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>

      <AIAssistantBar suggestions={aiSuggestions.length > 0 ? aiSuggestions : ["Show delayed projects", "Revenue forecast", "Department performance", "Cash flow prediction"]} />
    </div>
  );
}
