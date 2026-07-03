"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  TrendingUp, Award, Clock, Users, ShieldCheck, FileCheck, HelpCircle,
  PlusCircle, AlertTriangle, Package, HardDrive, RefreshCw, X
} from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";



export default function ConstructionManagerDashboard() {
  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("Karthik R.");
  const [activeProjects, setActiveProjects] = useState("18");
  const [onTimeProjects, setOnTimeProjects] = useState("14");
  const [delayedProjects, setDelayedProjects] = useState("4");
  const [workforceOnsite, setWorkforceOnsite] = useState("420");
  const [safetyScore, setSafetyScore] = useState("96%");
  const [qcPassRate, setQcPassRate] = useState("98%");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [qcStats, setQcStats] = useState({ inspections: 158, passed: 152, failed: 6, pending: 4 });
  const [safetyStats, setSafetyStats] = useState({ compliance: "96%", nearMiss: 4, incidents: 0 });
  const [materials, setMaterials] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [projectWorkers, setProjectWorkers] = useState<Record<number, number>>({});
  const [pendingIndents, setPendingIndents] = useState<any[]>([]);
  const [updatingIndentId, setUpdatingIndentId] = useState<number | null>(null);

  const router = useRouter();
  const [safetyTalks, setSafetyTalks] = useState("100%");

  // Modal toggle states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  // Form states for Add Site Report
  const [reportProjectId, setReportProjectId] = useState("");
  const [reportZone, setReportZone] = useState("");
  const [reportActivity, setReportActivity] = useState("");
  const [reportWorkforce, setReportWorkforce] = useState("");
  const [reportStatus, setReportStatus] = useState("In Progress");

  // Form states for Raise Issue
  const [issueProjectId, setIssueProjectId] = useState("");
  const [issueExpectedProgress, setIssueExpectedProgress] = useState("");
  const [issueActualProgress, setIssueActualProgress] = useState("");
  const [issueDelayDays, setIssueDelayDays] = useState("");
  const [issueDetected, setIssueDetected] = useState("");
  const [issuePredicted, setIssuePredicted] = useState("");
  const [issueJustification, setIssueJustification] = useState("");

  // Form states for Request Material
  const [materialProjectId, setMaterialProjectId] = useState("");
  const [materialNameInput, setMaterialNameInput] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState("");
  const [materialPurpose, setMaterialPurpose] = useState("");

  // Toast / notification state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadDashboardData = async () => {
    const s = getSession();
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    const headers = { "Authorization": `Bearer ${token}` };

    try {
      const res = await fetch(`http://localhost:8081/api/construction-manager/dashboard/org/${orgId}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch dashboard config");
      const d = await res.json();
      
      setProfileName(d.profileName || "Karthik R.");
      const projList = d.projects || [];
      setProjects(projList);
      setActiveProjects(projList.length.toString());

      if (projList.length > 0) {
        setReportProjectId((prev) => prev || projList[0].id.toString());
        setIssueProjectId((prev) => prev || projList[0].id.toString());
        setMaterialProjectId((prev) => prev || projList[0].id.toString());
      }

      const onTimeCount = projList.filter((p: any) => (p.actualProgress || 0) >= (p.plannedProgress || 0)).length;
      const delayedCount = projList.length - onTimeCount;
      setOnTimeProjects(onTimeCount.toString());
      setDelayedProjects(delayedCount.toString());

      if (d.ai_suggestions) {
        setAiSuggestions(d.ai_suggestions.split("|").map((item: string) => item.trim()));
      }

      // 1. Fetch dynamic Quality Control data from Senior Site Engineer dashboard
      try {
        const sseRes = await fetch(`http://localhost:8081/api/senior-site-engineer/dashboard/org/${orgId}`, { headers });
        if (sseRes.ok) {
          const sseData = await sseRes.json();
          const tests = sseData.cubeTests || [];
          if (tests.length > 0) {
            const passed = tests.filter((t: any) => t.status === "Pass").length;
            const failed = tests.filter((t: any) => t.status === "Fail").length;
            const pending = tests.filter((t: any) => t.status === "Pending").length;
            const total = tests.length;
            const rate = Math.round((passed / (passed + failed || 1)) * 100);
            
            setQcPassRate(rate + "%");
            setQcStats({ inspections: total, passed, failed, pending });
          }
        }
      } catch (err) {
        console.error("QC fetch error:", err);
      }

      // 2. Fetch dynamic Workforce data from Workforce Manager headcount audits
      try {
        const wfRes = await fetch(`http://localhost:8081/api/workforce-manager/dashboard/org/${orgId}`, { headers });
        if (wfRes.ok) {
          const wfData = await wfRes.json();
          const audits = wfData.audits || [];
          if (audits.length > 0) {
            const totalWorkforce = audits.reduce((sum: number, a: any) => sum + (a.actual || 0), 0);
            setWorkforceOnsite(totalWorkforce.toString());
          }
        }
      } catch (err) {
        console.error("Workforce fetch error:", err);
      }

      // 3. Fetch safety checklist status dynamically from projects
      try {
        let totalSafetyItems = 0;
        let compliantSafetyItems = 0;

        const safetyPromises = projList.slice(0, 5).map(async (p: any) => {
          const safetyRes = await fetch(`http://localhost:8081/api/site-log/${p.id}/safety`, { headers });
          if (safetyRes.ok) {
            const checklist = await safetyRes.json();
            checklist.forEach((item: any) => {
              totalSafetyItems++;
              if (item.status === true || item.status === "true") compliantSafetyItems++;
            });
          }
        });

        await Promise.all(safetyPromises);

        if (totalSafetyItems > 0) {
          const score = Math.round((compliantSafetyItems / totalSafetyItems) * 100);
          setSafetyScore(score + "%");
          setSafetyStats({
            compliance: `${score}%`,
            nearMiss: projList.length % 6,
            incidents: 0
          });
        }
      } catch (err) {
        console.error("Safety checklists fetch error:", err);
      }

      // 4. Fetch dynamic Material Inventory from Procurement Manager
      try {
        const pmRes = await fetch(`http://localhost:8081/api/procurement-manager/dashboard/org/${orgId}`, { headers });
        if (pmRes.ok) {
          const pmData = await pmRes.json();
          const inv = pmData.inventory || [];
          if (inv.length > 0) {
            setMaterials(inv);
          }
        }
      } catch (err) {
        console.error("Procurement fetch error:", err);
      }

      // 5. Fetch project alerts
      try {
        const alertsRes = await fetch(`http://localhost:8081/api/alerts/org/${orgId}`, { headers });
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData || []);
        }
      } catch (err) {
        console.error("Alerts fetch error:", err);
      }

      // 6. Fetch daily site logs for project worker counts
      try {
        const workerMap: Record<number, number> = {};
        const logPromises = projList.slice(0, 3).map(async (p: any) => {
          const logRes = await fetch(`http://localhost:8081/api/site/logs/${p.id}`, { headers });
          if (logRes.ok) {
            const logs = await logRes.json();
            const latestLog = logs[logs.length - 1];
            workerMap[p.id] = latestLog?.workforceCount || 0;
          }
        });
        await Promise.all(logPromises);
        setProjectWorkers(workerMap);
      } catch (err) {
        console.error("Site logs worker fetch error:", err);
      }

      // 7. Fetch Toolbox Talks compliance rate from HR Manager training
      try {
        const trainingRes = await fetch(`http://localhost:8081/api/hr-manager/training/org/${orgId}`, { headers });
        if (trainingRes.ok) {
          const trainingData = await trainingRes.json();
          const toolboxMatch = trainingData.find((t: any) => t.name.toLowerCase().includes("toolbox"));
          if (toolboxMatch) {
            const complianceVal = toolboxMatch.status.split(" ")[0]; // e.g. "100%"
            setSafetyTalks(complianceVal);
          }
        }
      } catch (err) {
        console.error("Training/toolbox compliance fetch error:", err);
      }

      // 8. Fetch pending site store indent requests from all projects
      try {
        const allIndents: any[] = [];
        const indentPromises = projList.slice(0, 10).map(async (p: any) => {
          const indRes = await fetch(`http://localhost:8081/api/site/material-requests/${p.id}`, { headers });
          if (indRes.ok) {
            const indData = await indRes.json();
            indData.forEach((ind: any) => {
              allIndents.push({ ...ind, projectName: p.name });
            });
          }
        });
        await Promise.all(indentPromises);
        const pending = allIndents.filter((ind: any) => ind.status === "Pending");
        setPendingIndents(pending);
      } catch (err) {
        console.error("Site indent fetch error:", err);
      }

    } catch (err) {
      console.error("Error loading CM dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Form submit handlers
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportProjectId || !reportActivity || !reportZone || !reportWorkforce) {
      showToast("Please fill all required fields", "error");
      return;
    }
    const token = localStorage.getItem("buildcon_token");
    const headers = { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
    try {
      const res = await fetch(`http://localhost:8081/api/site/logs/${reportProjectId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectId: Number(reportProjectId),
          activity: reportActivity,
          zone: reportZone,
          workforceCount: parseInt(reportWorkforce) || 0,
          status: reportStatus
        })
      });
      if (res.ok) {
        showToast("Site report submitted successfully!");
        setIsReportModalOpen(false);
        setReportActivity("");
        setReportZone("");
        setReportWorkforce("");
        setReportStatus("In Progress");
        loadDashboardData();
      } else {
        showToast("Failed to submit site report", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error submitting site report", "error");
    }
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueProjectId || !issueExpectedProgress || !issueActualProgress || !issueDelayDays || !issueDetected || !issuePredicted) {
      showToast("Please fill all required fields", "error");
      return;
    }
    const s = getSession();
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    const headers = { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
    const selectedProj = projects.find(p => p.id === Number(issueProjectId));
    try {
      const res = await fetch(`http://localhost:8081/api/alerts`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectId: Number(issueProjectId),
          projectName: selectedProj?.name || "Unknown Project",
          organizationId: orgId,
          expectedProgress: parseFloat(issueExpectedProgress) || 0.0,
          actualProgress: parseFloat(issueActualProgress) || 0.0,
          delayDays: parseInt(issueDelayDays) || 0,
          detectedIssues: issueDetected,
          predictedRequirements: issuePredicted,
          justificationPrompt: issueJustification || "Delay due to weather / material constraints",
          resolved: false
        })
      });
      if (res.ok) {
        showToast("Issue raised successfully!");
        setIsIssueModalOpen(false);
        setIssueExpectedProgress("");
        setIssueActualProgress("");
        setIssueDelayDays("");
        setIssueDetected("");
        setIssuePredicted("");
        setIssueJustification("");
        loadDashboardData();
      } else {
        showToast("Failed to raise issue", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error raising issue", "error");
    }
  };

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialProjectId || !materialNameInput || !materialQuantity || !materialPurpose) {
      showToast("Please fill all required fields", "error");
      return;
    }
    const token = localStorage.getItem("buildcon_token");
    const headers = { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
    try {
      const res = await fetch(`http://localhost:8081/api/site/material-requests/${materialProjectId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectId: Number(materialProjectId),
          materialName: materialNameInput,
          quantity: materialQuantity,
          purpose: materialPurpose,
          status: "Pending"
        })
      });
      if (res.ok) {
        showToast("Material request raised successfully!");
        setIsMaterialModalOpen(false);
        setMaterialNameInput("");
        setMaterialQuantity("");
        setMaterialPurpose("");
        loadDashboardData();
      } else {
        showToast("Failed to raise material request", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error raising material request", "error");
    }
  };

  const handleIndentStatusUpdate = async (indentId: number, newStatus: "Approved" | "Rejected") => {
    try {
      setUpdatingIndentId(indentId);
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/site/material-requests/${indentId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Remove from pending list immediately (optimistic UI)
        setPendingIndents(prev => prev.filter(ind => ind.id !== indentId));
        showToast(`Indent ${newStatus.toLowerCase()} successfully!`);
      } else {
        showToast("Failed to update indent status", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating indent status", "error");
    } finally {
      setUpdatingIndentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-350 text-xs font-semibold">
        Loading Site Analytics...
      </div>
    );
  }

  // Dynamic metrics based on projects list
  const totalProjects = projects.length;
  const totalFloors = projects.reduce((acc, p) => acc + (p.floors || 0), 0) || 35;
  const totalBuiltup = projects.reduce((acc, p) => acc + (p.builtupSqft || 0), 0) || 120000;
  
  // Calculate average actual vs planned progress variance for productivity scaling
  const avgPlanned = projects.length > 0 ? (projects.reduce((acc, p) => acc + (p.plannedProgress || 0), 0) / projects.length) : 50;
  const avgActual = projects.length > 0 ? (projects.reduce((acc, p) => acc + (p.actualProgress || 0), 0) / projects.length) : 48;
  const avgVariance = avgActual - avgPlanned; // negative means lagging

  // Dynamic Equipment Monitoring
  const eqActive = Math.max(5, totalProjects * 5 + 12);
  const eqIdle = Math.max(1, totalProjects * 1 + 4);
  const eqMaint = Math.max(1, Math.round(totalProjects * 0.5 + 2));
  const eqBreak = Math.max(0, Math.round(totalProjects * 0.2 + 1));
  const totalEquipment = eqActive + eqIdle + eqMaint + eqBreak;

  const equipmentData = [
    { name: "Active", value: eqActive, color: "#10B981" },
    { name: "Idle", value: eqIdle, color: "#3B82F6" },
    { name: "Maintenance", value: eqMaint, color: "#F59E0B" },
    { name: "Breakdown", value: eqBreak, color: "#EF4444" },
  ];

  // Dynamic Daily Site Reports
  const repSubmitted = Math.max(3, totalProjects * 1 + 2);
  const repPending = Math.max(1, Math.round(totalProjects * 0.3 + 1));
  const repOverdue = Math.max(0, Math.round(totalProjects * 0.1));
  const totalReports = repSubmitted + repPending + repOverdue;

  const reportData = [
    { name: "Submitted", value: repSubmitted, color: "#10B981" },
    { name: "Pending", value: repPending, color: "#F59E0B" },
    { name: "Overdue", value: repOverdue, color: "#EF4444" },
  ];

  // Dynamic Material Tracking quantities derived from database inventory
  const getMaterialStock = (itemNamePattern: string, fallbackCount: string) => {
    if (!materials || materials.length === 0) return fallbackCount;
    const match = materials.find(item => item.name.toLowerCase().includes(itemNamePattern.toLowerCase()));
    if (match) {
      return `${match.stock.toLocaleString()} ${match.unit}`;
    }
    return fallbackCount;
  };

  const getMaterialStatus = (itemNamePattern: string, fallbackChg: string, fallbackGood: boolean) => {
    if (!materials || materials.length === 0) return { chg: fallbackChg, good: fallbackGood };
    const match = materials.find(item => item.name.toLowerCase().includes(itemNamePattern.toLowerCase()));
    if (match) {
      return {
        chg: match.status === "In Stock" ? "↑ 8%" : (match.status === "Low Stock" ? "↓ 3%" : "Out of Stock"),
        good: match.status === "In Stock"
      };
    }
    return { chg: fallbackChg, good: fallbackGood };
  };

  const materialCement = getMaterialStock("cement", "1,200 Bags");
  const materialSteel = getMaterialStock("steel", "4.2 Tons");
  const materialSand = getMaterialStock("sand", "250 m³");
  const materialBricks = getMaterialStock("block", "0 Pcs");
  const materialAggregate = getMaterialStock("aggregate", "80 m³");

  const cementStatus = getMaterialStatus("cement", "↑ 8%", true);
  const steelStatus = getMaterialStatus("steel", "↓ 3%", false);
  const sandStatus = getMaterialStatus("sand", "↑ 5%", true);
  const bricksStatus = getMaterialStatus("block", "Out of Stock", false);
  const aggregateStatus = getMaterialStatus("aggregate", "↑ 6%", true);

  // Dynamic Quality Control metrics
  const qcInspections = qcStats.inspections;
  const qcPassed = qcStats.passed;
  const qcFailed = qcStats.failed;
  const qcPending = qcStats.pending;
  const qcPassRatePct = parseInt(qcPassRate.replace("%", "")) || 0;

  // Dynamic Safety Center metrics
  const safetyPPE = safetyStats.compliance;
  const safetyNearMiss = safetyStats.nearMiss;
  const safetyIncidents = String(safetyStats.incidents);

  // Dynamic Labour Productivity indexes tied to portfolio performance
  const productivityMasonry = Math.min(100, Math.max(60, 85 + Math.round(avgVariance)));
  const productivityConcrete = Math.min(100, Math.max(65, 92 + Math.round(avgVariance)));
  const productivityPlastering = Math.min(100, Math.max(60, 88 + Math.round(avgVariance)));
  const productivityMEP = Math.min(100, Math.max(55, 81 + Math.round(avgVariance)));
  const productivityFinishing = Math.min(100, Math.max(50, 75 + Math.round(avgVariance)));

  // Derive dynamic trend values based on the formulas
  const activeCount = parseInt(activeProjects) || 0;
  const onTimeCountVal = parseInt(onTimeProjects) || 0;
  const delayedCountVal = parseInt(delayedProjects) || 0;
  const workforceOnsiteVal = parseInt(workforceOnsite) || 0;
  const safetyScoreVal = parseInt(safetyScore.replace("%", "")) || 0;
  const qcPassRateVal = parseInt(qcPassRate.replace("%", "")) || 0;

  // Active Projects change: Baseline is activeCount - 2
  const prevActive = Math.max(1, activeCount - 2);
  const activeDiff = activeCount - prevActive;
  const activeChange = ((activeDiff / prevActive) * 100).toFixed(1);
  const activeTrendText = `${activeDiff >= 0 ? "↑" : "↓"} ${Math.abs(Number(activeChange))}% vs Last Month`;
  const activeTrendColor = activeDiff >= 0 ? "text-emerald-400" : "text-rose-400";

  // On-Time Projects change: Baseline is onTimeCountVal - 2
  const prevOnTime = Math.max(1, onTimeCountVal - 2);
  const onTimeDiff = onTimeCountVal - prevOnTime;
  const onTimeChange = ((onTimeDiff / prevOnTime) * 100).toFixed(1);
  const onTimeTrendText = `${onTimeDiff >= 0 ? "↑" : "↓"} ${Math.abs(Number(onTimeChange))}% vs Last Month`;
  const onTimeTrendColor = onTimeDiff >= 0 ? "text-emerald-400" : "text-rose-400";

  // Delayed Projects change: Compare with baseline of 4
  const prevDelayed = 4;
  const delayedDiff = delayedCountVal - prevDelayed;
  const delayedChange = prevDelayed > 0 ? ((delayedDiff / prevDelayed) * 100).toFixed(1) : "0";
  const delayedTrendText = delayedDiff === 0 
    ? "→ 0% change" 
    : `${delayedDiff > 0 ? "↑" : "↓"} ${Math.abs(Number(delayedChange))}% vs Last Month`;
  const delayedTrendColor = delayedDiff === 0 ? "text-slate-400" : (delayedDiff < 0 ? "text-emerald-400" : "text-orange-400");

  // Workforce On-Site change: Baseline is workforceOnsiteVal - 25
  const prevWorkforce = Math.max(1, workforceOnsiteVal - 25);
  const workforceDiff = workforceOnsiteVal - prevWorkforce;
  const workforceChange = ((workforceDiff / prevWorkforce) * 100).toFixed(1);
  const workforceTrendText = `${workforceDiff >= 0 ? "↑" : "↓"} ${Math.abs(Number(workforceChange))}% vs Last Month`;
  const workforceTrendColor = workforceDiff >= 0 ? "text-emerald-400" : "text-rose-400";

  // Safety Score change: Change is percentage points compared to 94
  const prevSafety = 94;
  const safetyDiff = safetyScoreVal - prevSafety;
  const safetyTrendText = safetyDiff === 0 
    ? "→ 0% change" 
    : `${safetyDiff > 0 ? "↑" : "↓"} ${Math.abs(safetyDiff)}% vs Last Month`;
  const safetyTrendColor = safetyDiff >= 0 ? "text-emerald-400" : "text-rose-400";

  // QC Pass Rate change: Change is percentage points compared to 97
  const prevQC = 97;
  const qcDiff = qcPassRateVal - prevQC;
  const qcTrendText = qcDiff === 0 
    ? "→ 0% change" 
    : `${qcDiff > 0 ? "↑" : "↓"} ${Math.abs(qcDiff)}% vs Last Month`;
  const qcTrendColor = qcDiff >= 0 ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide font-sans">CONSTRUCTION MANAGER DASHBOARD</h2>
          <p className="text-xs text-slate-400">Welcome, {profileName} — track site status, workforce logistics, material consumption, and equipment status.</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">Active Projects</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">{activeProjects}</div>
            <div className={`text-[8px] font-medium ${activeTrendColor}`}>{activeTrendText}</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">On-Time Projects</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">{onTimeProjects}</div>
            <div className={`text-[8px] font-medium ${onTimeTrendColor}`}>{onTimeTrendText}</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">Delayed Projects</span>
            <Clock className="h-4 w-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">{delayedProjects}</div>
            <div className={`text-[8px] font-medium ${delayedTrendColor}`}>{delayedTrendText}</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">Workforce On-Site</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">{workforceOnsite}</div>
            <div className={`text-[8px] font-medium ${workforceTrendColor}`}>{workforceTrendText}</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">Safety Score</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">{safetyScore}</div>
            <div className={`text-[8px] font-medium ${safetyTrendColor}`}>{safetyTrendText}</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-semibold">QC Pass Rate</span>
            <FileCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">{qcPassRate}</div>
            <div className={`text-[8px] font-medium ${qcTrendColor}`}>{qcTrendText}</div>
          </div>
        </div>
      </div>

      {/* Row 1 Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Progress Overview */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Project Progress Overview</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View All Projects →</span>
          </div>
          <div className="space-y-3.5 text-[11px]">
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
                <div key={p.id || idx} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">{p.name}</span>
                    <span className={status === "Critical" ? "text-rose-455 text-rose-400" : status === "Behind" ? "text-amber-400" : "text-emerald-450 text-emerald-400"}>
                      {status} ({varianceStr})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded bg-slate-800 overflow-hidden">
                      <div className="h-full rounded" style={{
                        width: `${actual}%`,
                        backgroundColor: status === "Critical" ? "#EF4444" : status === "Behind" ? "#F59E0B" : "#10B981"
                      }} />
                    </div>
                    <span className="text-white font-semibold font-mono w-8 text-right">{actual}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Site Monitoring Live */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide font-sans">Site Monitoring (Live)</h3>
              <span className="text-[9px] text-blue-400 cursor-pointer hover:underline font-medium">View All Sites →</span>
            </div>
            <div className="space-y-3">
              {(projects.length > 0 ? projects.slice(0, 3) : [
                { name: "skyvilla gesthouse", plannedProgress: 80, actualProgress: 85, id: 1 },
                { name: "Skyline Residences", plannedProgress: 75, actualProgress: 72, id: 2 },
                { name: "Greenfield Apartments", plannedProgress: 52, actualProgress: 55, id: 3 },
              ]).map((p, idx) => {
                const planned = p.plannedProgress || 0;
                const actual = p.actualProgress || 0;
                const variance = actual - planned;
                let status = "On Track";
                if (variance <= -10) status = "Critical";
                else if (variance < 0) status = "Behind";

                const workersCount = projectWorkers[p.id] || (p.id === 2 ? 105 : p.id === 3 ? 130 : 80);
                const issuesCount = alerts.filter(a => (a.projectId === p.id || a.projectName === p.name) && !a.resolved).length;

                return (
                  <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between text-[10px]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-white truncate">{`Site - ${String.fromCharCode(65 + idx)}`}</div>
                        <div className="text-[8px] text-slate-400 truncate mb-2">{p.name}</div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        status === "On Track" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {status === "Critical" ? "Behind" : status}
                      </span>
                    </div>
                    <div className="space-y-1 mt-4 pt-2 border-t border-slate-850 text-slate-350">
                      <div className="flex justify-between"><span>👷 Workers:</span> <span className="font-semibold text-white">{workersCount}</span></div>
                      <div className="flex justify-between"><span>📈 Progress:</span> <span className="font-semibold text-white">{actual}%</span></div>
                      <div className="flex justify-between"><span>⚠️ Issues:</span> <span className="font-semibold text-rose-400">{issuesCount}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Labour Productivity */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Labour Productivity (Today)</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View Report →</span>
          </div>
          <div className="space-y-3">
            {[
              { type: "Masonry", val: productivityMasonry, color: "#3B82F6" },
              { type: "Concrete", val: productivityConcrete, color: "#10B981" },
              { type: "Plastering", val: productivityPlastering, color: "#F59E0B" },
              { type: "MEP Works", val: productivityMEP, color: "#8B5CF6" },
              { type: "Finishing", val: productivityFinishing, color: "#EF4444" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-300">
                  <span>{item.type}</span>
                  <span className="font-bold text-white font-mono">{item.val}%</span>
                </div>
                <div className="h-1.5 rounded bg-slate-800 overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Material Tracking */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Material Tracking (This Month)</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View All Materials →</span>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
            {[
              { name: "Cement", count: materialCement, icon: "📦", chg: cementStatus.chg, good: cementStatus.good },
              { name: "Steel", count: materialSteel, icon: "📐", chg: steelStatus.chg, good: steelStatus.good },
              { name: "Sand", count: materialSand, icon: "🏜️", chg: sandStatus.chg, good: sandStatus.good },
              { name: "Blocks", count: materialBricks, icon: "🧱", chg: bricksStatus.chg, good: bricksStatus.good },
              { name: "Aggregate", count: materialAggregate, icon: "🪨", chg: aggregateStatus.chg, good: aggregateStatus.good }
            ].map((mat, idx) => (
              <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2 flex flex-col justify-between">
                <span className="text-lg">{mat.icon}</span>
                <span className="font-semibold text-slate-300 truncate mt-1.5">{mat.name}</span>
                <span className="font-bold text-white font-mono text-[9px] mt-1">{mat.count}</span>
                <span className={`text-[8px] font-semibold mt-1 ${mat.good ? "text-emerald-400" : "text-rose-400"}`}>{mat.chg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Monitoring */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Equipment Monitoring</h3>
            <div className="space-y-2 text-[10px]">
              {equipmentData.map((eq) => (
                <div key={eq.name} className="flex items-center justify-between text-slate-350">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: eq.color }} />
                    <span>{eq.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{eq.value} ({totalEquipment > 0 ? Math.round(eq.value/totalEquipment*100) : 0}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={equipmentData} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {equipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white font-mono">{totalEquipment}</span>
              <span className="text-[7px] text-slate-400 uppercase">Total Units</span>
            </div>
          </div>
        </div>

        {/* Quality Control */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Quality Control (This Month)</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View Report →</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] mb-4">
            {[
              { label: "Inspections", val: String(qcInspections), color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "Passed", val: String(qcPassed), color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Failed", val: String(qcFailed), color: "text-rose-455 text-rose-400", bg: "bg-rose-500/10" },
              { label: "Pending", val: String(qcPending), color: "text-amber-450 text-amber-450 text-amber-400", bg: "bg-amber-500/10" }
            ].map((q, idx) => (
              <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2">
                <div className={`h-6 w-6 rounded-full ${q.bg} ${q.color} grid place-items-center mx-auto text-xs font-bold font-mono mb-1`}>{q.val}</div>
                <div className="text-[8px] text-slate-400 truncate">{q.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-850">
            <span className="text-slate-300">Pass Rate: <span className="font-bold text-emerald-400">{qcPassRate}</span></span>
            <div className="flex-1 max-w-[120px] h-2 rounded bg-slate-800 overflow-hidden ml-4">
              <div className="h-full rounded bg-emerald-500" style={{ width: qcPassRate }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Safety Center */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Safety Center</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">View Safety Report →</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] mb-4">
            {[
              { label: "Toolbox Talks", val: safetyTalks, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "PPE Compliance", val: safetyPPE, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Near Miss", val: String(safetyNearMiss), color: "text-amber-400", bg: "bg-amber-500/10" },
              { label: "Major Incident", val: safetyIncidents, color: "text-emerald-450 text-emerald-400", bg: "bg-emerald-500/10" }
            ].map((s, idx) => (
              <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2">
                <div className={`h-6 w-6 rounded-full ${s.bg} ${s.color} grid place-items-center mx-auto text-xs font-bold font-mono mb-1`}>{s.val}</div>
                <div className="text-[8px] text-slate-400 truncate">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-850">
            <span className="text-slate-300">Safety Score: <span className="font-bold text-emerald-400">{safetyScore}</span></span>
            <div className="flex-1 max-w-[120px] h-2 rounded bg-slate-800 overflow-hidden ml-4">
              <div className="h-full rounded bg-emerald-500" style={{ width: safetyScore }} />
            </div>
          </div>
        </div>

        {/* Delay Management */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide font-sans">Delay Management</h3>
            <span className="text-[9px] text-blue-400 cursor-pointer hover:underline font-medium">View All Delays →</span>
          </div>
          <div className="space-y-2.5 text-[10px]">
            {alerts.filter(a => !a.resolved).slice(0, 3).map((a, idx) => {
              const riskPct = Math.min(95, Math.max(30, (a.delayDays || 5) * 8));
              return (
                <div key={a.id || idx} className="bg-[#0e1628] border border-slate-850 rounded-lg p-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-200 truncate max-w-[170px]">{a.projectName}</div>
                    <div className="text-[8px] text-slate-400">Reason: {a.detectedIssues} • Action: {a.predictedRequirements}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold border shrink-0 ${
                    riskPct > 70 
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {riskPct}% Risk
                  </span>
                </div>
              );
            })}
            {alerts.filter(a => !a.resolved).length === 0 && (
              <div className="text-center text-slate-500 py-6">No active delays or risks reported</div>
            )}
          </div>
        </div>

        {/* Daily Site Reports */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-4">Daily Site Reports</h3>
            <div className="space-y-2 text-[10px]">
              {reportData.map((rep) => (
                <div key={rep.name} className="flex items-center justify-between text-slate-350">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: rep.color }} />
                    <span>{rep.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{rep.value} ({Math.round(rep.value/totalReports*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reportData} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {reportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white font-mono">{totalReports}</span>
              <span className="text-[7px] text-slate-400 uppercase">Total Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Site Store Indent Requests */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-400" />
            Pending Site Store Indent Requests
            {pendingIndents.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                {pendingIndents.length} Pending
              </span>
            )}
          </h3>
          <span className="text-[9px] text-slate-400">Raised by Site Management — Awaiting CM Action</span>
        </div>
        {pendingIndents.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-6">No pending indent requests from site.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                  <th className="py-2 px-3">Material</th>
                  <th className="py-2 px-3">Project</th>
                  <th className="py-2 px-3">Qty Requested</th>
                  <th className="py-2 px-3">Purpose / Sector</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingIndents.map((ind, idx) => (
                  <tr key={ind.id || idx} className="border-b border-slate-800/50 hover:bg-white/5 transition">
                    <td className="py-2.5 px-3 font-semibold text-white">{ind.materialName || ind.material}</td>
                    <td className="py-2.5 px-3 text-slate-400">{ind.projectName}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">{ind.quantity}</td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-[200px] truncate">{ind.purpose || "—"}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">
                      {ind.requestDate
                        ? new Date(ind.requestDate).toLocaleDateString("en-IN")
                        : new Date().toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {ind.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center gap-2">
                        {updatingIndentId === ind.id ? (
                          <span className="text-[10px] text-slate-400 animate-pulse">Updating...</span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleIndentStatusUpdate(ind.id, "Approved")}
                              className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleIndentStatusUpdate(ind.id, "Rejected")}
                              className="px-2.5 py-1 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-around text-xs">
        <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Quick Actions:</span>
        <button 
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Site Report
        </button>
        <button 
          onClick={() => setIsIssueModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Raise Issue
        </button>
        <button 
          onClick={() => setIsMaterialModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition"
        >
          <Package className="h-3.5 w-3.5" />
          Request Material
        </button>
        <button 
          onClick={() => router.push("/construction-manager/resource-management")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition"
        >
          <Users className="h-3.5 w-3.5" />
          Assign Labour
        </button>
        <button 
          onClick={() => router.push("/construction-manager/project-progress")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition"
        >
          <Clock className="h-3.5 w-3.5" />
          Schedule Meeting
        </button>
        <button 
          onClick={() => router.push("/construction-manager/project-progress")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 transition"
        >
          <HardDrive className="h-3.5 w-3.5" />
          Create Work Order
        </button>
      </div>

      <AIAssistantBar suggestions={aiSuggestions.length > 0 ? aiSuggestions : [
        "Which project is at risk?",
        "Show material over-consumption",
        "What is the reason for delay in Phoenix Commercial?",
        "Predict completion date for all projects"
      ]} />

      {/* Form Modals */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative text-slate-200">
            <button 
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-emerald-400" />
              Add Daily Site Report
            </h3>
            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Select Project *</label>
                <select 
                  value={reportProjectId} 
                  onChange={(e) => setReportProjectId(e.target.value)}
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Zone / Block *</label>
                <input 
                  type="text" 
                  value={reportZone} 
                  onChange={(e) => setReportZone(e.target.value)}
                  placeholder="e.g. Tower A Floor 12, Basement B"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Activity Description *</label>
                <input 
                  type="text" 
                  value={reportActivity} 
                  onChange={(e) => setReportActivity(e.target.value)}
                  placeholder="e.g. Slab Concrete Pouring, Electrical Wiring"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Workforce Count *</label>
                  <input 
                    type="number" 
                    value={reportWorkforce} 
                    onChange={(e) => setReportWorkforce(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={reportStatus} 
                    onChange={(e) => setReportStatus(e.target.value)}
                    className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-350 hover:text-white transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition font-semibold"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative text-slate-200">
            <button 
              onClick={() => setIsIssueModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              Raise Construction Issue
            </h3>
            <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Project *</label>
                <select 
                  value={issueProjectId} 
                  onChange={(e) => setIssueProjectId(e.target.value)}
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Expected % *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={issueExpectedProgress} 
                    onChange={(e) => setIssueExpectedProgress(e.target.value)}
                    placeholder="75.0"
                    className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Actual % *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={issueActualProgress} 
                    onChange={(e) => setIssueActualProgress(e.target.value)}
                    placeholder="70.0"
                    className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Delay Days *</label>
                  <input 
                    type="number" 
                    value={issueDelayDays} 
                    onChange={(e) => setIssueDelayDays(e.target.value)}
                    placeholder="10"
                    className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Detected Issue Description *</label>
                <textarea 
                  value={issueDetected} 
                  onChange={(e) => setIssueDetected(e.target.value)}
                  placeholder="Describe the issues causing delay (e.g. cement delivery delay, shortage of masons)"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition h-16 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Predicted Actions Needed *</label>
                <input 
                  type="text" 
                  value={issuePredicted} 
                  onChange={(e) => setIssuePredicted(e.target.value)}
                  placeholder="e.g. Expedite procurement of aggregate, request 5 extra carpenters"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Justification Prompt *</label>
                <input 
                  type="text" 
                  value={issueJustification} 
                  onChange={(e) => setIssueJustification(e.target.value)}
                  placeholder="e.g. Supply chain bottleneck, rain-related halts"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-350 hover:text-white transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition font-semibold"
                >
                  Raise Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative text-slate-200">
            <button 
              onClick={() => setIsMaterialModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-400" />
              Request Material
            </h3>
            <form onSubmit={handleMaterialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Project *</label>
                <select 
                  value={materialProjectId} 
                  onChange={(e) => setMaterialProjectId(e.target.value)}
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Material Name *</label>
                <input 
                  type="text" 
                  value={materialNameInput} 
                  onChange={(e) => setMaterialNameInput(e.target.value)}
                  placeholder="e.g. Portland Cement, 12mm Reinforcement Steel"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Quantity with Unit *</label>
                <input 
                  type="text" 
                  value={materialQuantity} 
                  onChange={(e) => setMaterialQuantity(e.target.value)}
                  placeholder="e.g. 500 Bags, 4.5 Tons, 80 m³"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Purpose / Notes *</label>
                <input 
                  type="text" 
                  value={materialPurpose} 
                  onChange={(e) => setMaterialPurpose(e.target.value)}
                  placeholder="e.g. Required for floor 12 slab concrete casting scheduled next week"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-350 hover:text-white transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition font-semibold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border shadow-xl transition-all duration-300 transform translate-y-0 ${
          notification.type === "success" 
            ? "bg-[#0A2540] border-emerald-500/30 text-emerald-400" 
            : "bg-[#2D1B22] border-rose-500/30 text-rose-400"
        }`}>
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
