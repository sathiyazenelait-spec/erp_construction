"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, getSession } from "@/lib/auth";
import {
  LayoutDashboard, Activity, Calendar, DollarSign, Users, FileText,
  Clock, AlertTriangle, MessageSquare, Shield, FolderOpen, CheckSquare,
  Settings, LogOut, Building2, Bell, Filter, Plus, Check, Bot, SendHorizontal, Trash2,
  Sparkles, UploadCloud, Save, X
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

interface PMTask {
  id: string;
  title: string;
  assignedTo: string;
  status: "Completed" | "In Progress" | "Pending";
}

export default function ProjectManagerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Executive Summary");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [projects, setProjects] = useState<any[]>([]);

  // Project properties edit states
  const [editProjName, setEditProjName] = useState("");
  const [editProjLoc, setEditProjLoc] = useState("");
  const [editProjBudget, setEditProjBudget] = useState("");
  const [editProjStatus, setEditProjStatus] = useState("Planning");
  const [editProjFloors, setEditProjFloors] = useState("");
  const [editProjArea, setEditProjArea] = useState("");
  const [editProjPlanned, setEditProjPlanned] = useState("");
  const [editProjActual, setEditProjActual] = useState("");

  const [dateFilter, setDateFilter] = useState("09 June 2026, Tuesday");

  // Session & Loading States
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Profile and Configuration States
  const [profileName, setProfileName] = useState("Ramanathan S.");
  const [profileEmail, setProfileEmail] = useState("pm@buildcon.com");
  const [avatarInitials, setAvatarInitials] = useState("RS");
  const [sidebarMenus, setSidebarMenus] = useState("");
  const [projectValue, setProjectValue] = useState("");
  const [progressVal, setProgressVal] = useState("");
  const [budgetUsed, setBudgetUsed] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [pendingApprovals, setPendingApprovals] = useState("");
  const [delayRisk, setDelayRisk] = useState("");
  const [budgetValueProject, setBudgetValueProject] = useState("");
  const [budgetValueApproved, setBudgetValueApproved] = useState("");
  const [budgetValueActual, setBudgetValueActual] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // --- Leave Requests State ---
  const [leaveList, setLeaveList] = useState<any[]>([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "Sick Leave",
    duration: "",
    reason: ""
  });

  // --- Pre-Project AI Estimator State ---
  const [preProjName, setPreProjName] = useState("");
  const [preProjBudget, setPreProjBudget] = useState("");
  const [preProjStaff, setPreProjStaff] = useState("");
  const [preProjFileName, setPreProjFileName] = useState("");
  const [preProjFile, setPreProjFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isAnalyzingPreProj, setIsAnalyzingPreProj] = useState(false);
  const [preProjReport, setPreProjReport] = useState<any | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [preProjArea, setPreProjArea] = useState("");
  const [preProjFloors, setPreProjFloors] = useState("");
  const [preProjLocationType, setPreProjLocationType] = useState("District HQ City");
  const [orgTier, setOrgTier] = useState("Enterprise");

  // --- Database Entities States ---
  const [employees, setEmployees] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [subcontractorContracts, setSubcontractorContracts] = useState<any[]>([]);
  const [drawings, setDrawings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dailyLogs, setDailyLogs] = useState<any[]>([]);

  // --- Stateful Data ---
  const [tasks, setTasks] = useState<PMTask[]>([
    { id: "1", title: "Verify earthwork measurements", assignedTo: "Meenakshi (QS)", status: "Completed" },
    { id: "2", title: "Approve steel purchase requisition", assignedTo: "Venkatesh (Procurement)", status: "In Progress" },
    { id: "3", title: "Review QC concrete cube tests", assignedTo: "Karthick (Senior Eng)", status: "Pending" },
    { id: "4", title: "Process subcontractor billing claims", assignedTo: "Ramesh (Finance)", status: "Pending" },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [newAssignee, setNewAssignee] = useState("");

  const [aiChatInput, setAiChatInput] = React.useState("");
  const [aiReplies, setAiReplies] = React.useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Ramanathan! I'm your AI Project Assistant. I can forecast budgets, track subcontractor performance, and flag delay risks. Try clicking the suggestions below!" }
  ]);

  const [pendingClaims, setPendingClaims] = React.useState<any[]>([]);

  // --- Fetching Helpers ---
  async function fetchEmployees(orgId: number) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/hr-manager/employees/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data || []);
        if (data.length > 0) {
          const assignables = data.filter((e: any) =>
            ["Senior Site Engineer", "Quantity Surveyor", "Procurement Manager", "Finance Lead", "Site Supervisor", "Subcontractor"].includes(e.role)
          );
          const defaultAssignee = assignables.length > 0 ? assignables[0] : data[0];
          setNewAssignee(`${defaultAssignee.name} (${defaultAssignee.role})`);
        }
      }
    } catch (e) {
      console.error("Failed to fetch employees", e);
    }
  }

  async function fetchTransactions(orgId: number) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/finance-accounts/dashboard/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (e) {
      console.error("Failed to fetch transactions", e);
    }
  }

  async function fetchSubcontractorContracts(orgId: number) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/subcontractor/dashboard/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubcontractorContracts(data.contracts || []);
      }
    } catch (e) {
      console.error("Failed to fetch subcontractor contracts", e);
    }
  }

  async function fetchDrawings(orgId: number) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/senior-site-engineer/dashboard/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDrawings(data.drawings || []);
      }
    } catch (e) {
      console.error("Failed to fetch drawings", e);
    }
  }

  async function fetchAlerts(orgId: number) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/alerts/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data || []);
      }
    } catch (e) {
      console.error("Failed to fetch alerts", e);
    }
  }

  async function fetchDailyLogs(projectsList: any[]) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const allLogs: any[] = [];
      for (const p of projectsList) {
        const res = await fetch(`http://localhost:8081/api/site/logs/${p.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const logs = await res.json();
          logs.forEach((log: any) => {
            log.projectName = p.name;
          });
          allLogs.push(...logs);
        }
      }
      setDailyLogs(allLogs);
    } catch (e) {
      console.error("Failed to fetch daily logs", e);
    }
  }

  // --- Dynamic Project Properties Override Metric Calculations ---
  const getProgress = (proj: any) => {
    if (!proj) return 64;
    if (proj.actualProgress !== undefined && proj.actualProgress !== null && proj.actualProgress > 0) {
      return proj.actualProgress;
    }
    if (proj.status === "Completed") return 100;
    if (proj.status === "Planning") return 15;
    if (proj.status === "Suspended") return 35;
    
    if (proj.startDate && proj.endDate) {
      const start = new Date(proj.startDate).getTime();
      const end = new Date(proj.endDate).getTime();
      const now = new Date().getTime();
      if (end > start) {
        const prog = Math.round(((now - start) / (end - start)) * 100);
        return Math.min(95, Math.max(10, prog));
      }
    }
    return 64;
  };

  const getBudgetUsedPercent = (proj: any) => {
    if (!proj) return 58;
    const projectContracts = subcontractorContracts.filter(c => c.projectId === proj.id);
    if (projectContracts.length > 0) {
      const totalSpent = projectContracts.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
      return proj.budget > 0 ? Math.min(100, Math.round((totalSpent / proj.budget) * 100)) : 0;
    }
    const prog = getProgress(proj);
    return Math.max(5, Math.round(prog * 0.9));
  };

  const getDelayRisk = (proj: any) => {
    if (!proj) return "Low";
    const projAlerts = alerts.filter(a => a.projectId === proj.id || a.projectName === proj.name);
    const maxDelayDays = projAlerts.reduce((max, a) => Math.max(max, a.delayDays || 0), 0);
    if (maxDelayDays > 10) return "High";
    if (maxDelayDays > 0) return "Medium";
    return "Low";
  };

  async function fetchPendingClaims() {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/progress-claims/status/PENDING", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingClaims(data);
      }
    } catch (e) {
      console.error("Failed to fetch pending claims for PM", e);
    }
  }

  const [notifiedReports, setNotifiedReports] = useState<any[]>([]);
  const [chairmanNotice, setChairmanNotice] = useState<string | null>(null);

  const selectedProject = React.useMemo(() => {
    if (projectFilter === "All Projects") return null;
    return projects.find(p => p.name === projectFilter);
  }, [projectFilter, projects]);

  useEffect(() => {
    if (selectedProject) {
      setEditProjName(selectedProject.name || "");
      setEditProjLoc(selectedProject.location || "");
      setEditProjBudget(String(selectedProject.budget || ""));
      setEditProjStatus(selectedProject.status || "Planning");
      setEditProjFloors(String(selectedProject.floors || ""));
      setEditProjArea(String(selectedProject.builtupSqft || ""));
      setEditProjPlanned(String(selectedProject.plannedProgress ?? "0"));
      setEditProjActual(String(selectedProject.actualProgress ?? "0"));
    }
  }, [selectedProject]);

  const fetchDashboardData = async (orgId: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/project-manager/dashboard/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setProfileName(d.profileName || "");
        setProfileEmail(d.profileEmail || "");
        setAvatarInitials(d.avatarInitials || "");
        setSidebarMenus(d.sidebar_menus || "");
        setProjectValue(d.project_value || "");
        setProgressVal(d.progress || "");
        setBudgetUsed(d.budget_used || "");
        setProfitMargin(d.profit_margin || "");
        setPendingApprovals(d.pending_approvals || "");
        setDelayRisk(d.delay_risk || "");
        setBudgetValueProject(d.budget_value_project || "");
        setBudgetValueApproved(d.budget_value_approved || "");
        setBudgetValueActual(d.budget_value_actual || "");
        setAiSuggestions(d.ai_suggestions || "");
        setProjects(d.projects || []);
        if (d.header_date) {
          setDateFilter(d.header_date);
        }
        if (d.ai_suggestions) {
          setSuggestions(d.ai_suggestions.split("|").map((item: string) => item.trim()));
        }
        // Set initial greetings
        setAiReplies([
          { sender: "bot", text: `Hello ${d.profileName}! I'm your AI Project Assistant. I can forecast budgets, track subcontractor performance, and flag delay risks. Try clicking the suggestions below!` }
        ]);
      }
    } catch (err) {
      console.error("Error fetching project manager dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPendingClaims();
    const savedTier = localStorage.getItem("selected_login_tier");
    if (savedTier) {
      setOrgTier(savedTier);
    }

    const loadReports = () => {
      const stored = localStorage.getItem("notified_reports_pm");
      if (stored) {
        setNotifiedReports(JSON.parse(stored));
      } else {
        setNotifiedReports([]);
      }
    };

    const handleStorage = () => {
      loadReports();
      setChairmanNotice(localStorage.getItem("chairman_noticed_alert_msg"));
    };

    handleStorage();
    window.addEventListener("storage", handleStorage);

    const s = getSession();
    setSession(s);
    const orgId = s?.organizationId || 1;
    fetchMyLeaves(orgId);
    fetchDashboardData(orgId);
    fetchEmployees(orgId);
    fetchTransactions(orgId);
    fetchSubcontractorContracts(orgId);
    fetchDrawings(orgId);
    fetchAlerts(orgId);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  React.useEffect(() => {
    if (projects.length > 0) {
      fetchDailyLogs(projects);
    }
  }, [projects]);

  const handleApproveClaim = async (id: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/progress-claims/${id}/approve`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Approved successfully!");
        fetchPendingClaims();
      }
    } catch (e) {
      console.error("Failed to approve claim", e);
    }
  };

  const handleRejectClaim = async (id: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/progress-claims/${id}/reject`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Rejection logged.");
        fetchPendingClaims();
      }
    } catch (e) {
      console.error("Failed to reject claim", e);
    }
  };

  const dismissReport = (id: number) => {
    const updated = notifiedReports.filter(r => r.id !== id);
    setNotifiedReports(updated);
    localStorage.setItem("notified_reports_pm", JSON.stringify(updated));
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
                <strong>Predicted Delay:</strong> ${report.predictedDelayDays} Days
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

  // --- Charts datasets ---
  const budgetBurnData = [
    { name: "Month 1", Budget: 20000000, Actual: 18000000 },
    { name: "Month 2", Budget: 45000000, Actual: 41000000 },
    { name: "Month 3", Budget: 75000000, Actual: 72500000 },
    { name: "Month 4", Budget: 100000000, Actual: 95000000 },
  ];

  // --- Project Filtering and Scaling Logic ---
  const formatProjectBudget = (budgetNum: number) => {
    if (!budgetNum) return "₹0.0 Cr";
    if (budgetNum >= 10000000) {
      return `₹ ${(budgetNum / 10000000).toFixed(1)} Cr`;
    } else {
      return `₹ ${(budgetNum / 100000).toFixed(1)} Lakhs`;
    }
  };

  const scaleCostString = (val: string) => {
    if (!val) return "";
    if (projectFilter === "All Projects") return val;
    let scale = 0.5;
    let isSkyline = false;
    if (projects.length > 0) {
      const projectIndex = projects.findIndex(p => p.name === projectFilter);
      if (projectIndex !== -1) {
        scale = projectIndex === 0 ? 0.6 : projectIndex === 1 ? 0.4 : projectIndex === 2 ? 0.5 : projectIndex === 3 ? 0.7 : 0.8;
        isSkyline = projectIndex % 2 === 0;
      }
    } else {
      isSkyline = projectFilter === "Skyline Residences";
      scale = isSkyline ? 0.6 : 0.4;
    }
    
    if (val.includes("%")) {
      const numMatch = val.match(/([0-9.]+)/);
      if (!numMatch) return val;
      const num = parseFloat(numMatch[1]);
      const scaledVal = isSkyline ? num + 3 : num - 5;
      return `${Math.min(100, Math.max(0, Math.round(scaledVal)))}%`;
    }

    const match = val.match(/([0-9,.]+)/);
    if (!match) return val;
    
    const numStr = match[1].replace(/,/g, "");
    const num = parseFloat(numStr);
    if (isNaN(num)) return val;
    
    const scaledNum = num * scale;
    let formattedNum = scaledNum.toFixed(scaledNum % 1 === 0 ? 0 : 2);
    if (formattedNum.includes(".")) {
      formattedNum = formattedNum.replace(/\.?0+$/, "");
    }
    return val.replace(match[1], formattedNum);
  };

  const getClaimProjectName = (claim: any) => {
    if (projects.length > 0) {
      const proj = projects.find(p => p.id === claim.projectId);
      if (proj) return proj.name;
      return projects[claim.projectId % projects.length]?.name || "Skyline Residences";
    }
    if (claim.projectId === 1) return "Skyline Residences";
    if (claim.projectId === 2) return "Greenfield Apartments";
    return claim.projectId % 2 === 1 ? "Skyline Residences" : "Greenfield Apartments";
  };

  const filteredPendingClaims = React.useMemo(() => {
    return pendingClaims.filter(c => projectFilter === "All Projects" || getClaimProjectName(c) === projectFilter);
  }, [pendingClaims, projectFilter, projects]);

  const displayPendingApprovals = React.useMemo(() => {
    return projectFilter === "All Projects" ? pendingApprovals : String(filteredPendingClaims.length);
  }, [projectFilter, pendingApprovals, filteredPendingClaims]);

  const getTaskProjectName = (task: PMTask) => {
    if (projects.length > 0) {
      const idNum = Number(task.id);
      return projects[idNum % projects.length]?.name || "Skyline Residences";
    }
    return Number(task.id) % 2 === 1 ? "Skyline Residences" : "Greenfield Apartments";
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter(t => projectFilter === "All Projects" || getTaskProjectName(t) === projectFilter);
  }, [tasks, projectFilter, projects]);

  const filteredNotifiedReports = React.useMemo(() => {
    return notifiedReports.filter(r => projectFilter === "All Projects" || r.projectName === projectFilter);
  }, [notifiedReports, projectFilter]);

  const displayBudgetBurnData = React.useMemo(() => {
    if (projectFilter === "All Projects") return budgetBurnData;
    let scale = 0.5;
    if (projects.length > 0) {
      const projectIndex = projects.findIndex(p => p.name === projectFilter);
      if (projectIndex !== -1) {
        scale = projectIndex === 0 ? 0.6 : projectIndex === 1 ? 0.4 : projectIndex === 2 ? 0.5 : projectIndex === 3 ? 0.7 : 0.8;
      }
    } else {
      scale = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    }
    return budgetBurnData.map(d => ({
      ...d,
      Budget: Math.round(d.Budget * scale),
      Actual: Math.round(d.Actual * scale)
    }));
  }, [projectFilter, budgetBurnData, projects]);

  const displayMetrics = React.useMemo(() => {
    if (projects.length === 0) {
      return [
        { label: "Project Value", val: "₹0.0 Cr" },
        { label: "Progress", val: "0%" },
        { label: "Budget Used", val: "0%" },
        { label: "Profit Margin", val: "0%" },
        { label: "Pending Approvals", val: "0" },
        { label: "Delay Risk", val: "Low" }
      ];
    }
    
    if (!selectedProject) {
      const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
      const avgProgress = Math.round(projects.reduce((sum, p) => sum + getProgress(p), 0) / projects.length);
      const avgBudgetUsed = Math.round(projects.reduce((sum, p) => sum + getBudgetUsedPercent(p), 0) / projects.length);
      
      const hasHigh = projects.some(p => getDelayRisk(p) === "High");
      const hasMedium = projects.some(p => getDelayRisk(p) === "Medium");
      const combinedRisk = hasHigh ? "High" : hasMedium ? "Medium" : "Low";

      return [
        { label: "Project Value", val: formatProjectBudget(totalBudget) },
        { label: "Progress", val: `${avgProgress}%` },
        { label: "Budget Used", val: `${avgBudgetUsed}%` },
        { label: "Profit Margin", val: "18%" },
        { label: "Pending Approvals", val: String(filteredPendingClaims.length) },
        { label: "Delay Risk", val: combinedRisk }
      ];
    } else {
      const formattedValue = formatProjectBudget(selectedProject.budget || 0);
      const progress = `${getProgress(selectedProject)}%`;
      const budgetUsedPercent = `${getBudgetUsedPercent(selectedProject)}%`;
      const risk = getDelayRisk(selectedProject);
      const margin = `${22 - (Number(selectedProject.id || 0) % 5) * 2}%`;

      return [
        { label: "Project Value", val: formattedValue },
        { label: "Progress", val: progress },
        { label: "Budget Used", val: budgetUsedPercent },
        { label: "Profit Margin", val: margin },
        { label: "Pending Approvals", val: String(filteredPendingClaims.length) },
        { label: "Delay Risk", val: risk }
      ];
    }
  }, [projects, selectedProject, filteredPendingClaims, subcontractorContracts, alerts]);

  // --- Sidebar Navigation ---
  const sidebarItems = [
    { name: "Executive Summary", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Project Command Center", icon: <Activity className="h-4 w-4" /> },
    { name: "Project Timeline", icon: <Calendar className="h-4 w-4" /> },
    { name: "Budget Monitoring", icon: <DollarSign className="h-4 w-4" /> },
    { name: "Client Management", icon: <Users className="h-4 w-4" /> },
    { name: "BOQ Tracking", icon: <FileText className="h-4 w-4" /> },
    { name: "Progress Monitoring", icon: <Clock className="h-4 w-4" /> },
    { name: "Subcontractor Management", icon: <Users className="h-4 w-4" /> },
    { name: "Change Orders", icon: <FileText className="h-4 w-4" /> },
    { name: "Risk Center", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "Document Control", icon: <FolderOpen className="h-4 w-4" /> },
    { name: "Approval Center", icon: <CheckSquare className="h-4 w-4" /> },
    { name: "Pre-Project AI Estimator", icon: <Sparkles className="h-4 w-4 text-yellow-400" /> },
    { name: "AI Project Assistant", icon: <Bot className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const fetchMyLeaves = async (orgId?: number) => {
    try {
      const targetOrgId = orgId || session?.organizationId || getSession()?.organizationId || 1;
      const token = localStorage.getItem("buildcon_token");
      const headers: any = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`http://localhost:8081/api/hr-manager/leave/org/${targetOrgId}`, {
        headers
      });
      if (res.ok) {
        const data = await res.json();
        setLeaveList(data);
      }
    } catch (e) {
      console.error("Failed to fetch leaves", e);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.duration || !leaveForm.reason) {
      alert("Please fill in duration and reason.");
      return;
    }

    try {
      const orgId = session?.organizationId || getSession()?.organizationId || 1;
      const token = localStorage.getItem("buildcon_token");
      const headers: any = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("http://localhost:8081/api/hr-manager/leave", {
        method: "POST",
        headers,
        body: JSON.stringify({
          employeeName: profileName,
          employeeRole: "Project Manager",
          leaveType: leaveForm.leaveType,
          duration: leaveForm.duration,
          reason: leaveForm.reason,
          status: "Pending",
          organizationId: orgId
        })
      });

      if (res.ok) {
        alert("Leave application submitted successfully!");
        setShowLeaveModal(false);
        setLeaveForm({ leaveType: "Sick Leave", duration: "", reason: "" });
        fetchMyLeaves(orgId);
      } else {
        alert("Failed to submit leave request.");
      }
    } catch (e) {
      console.error("Failed to submit leave request", e);
      alert("Error submitting leave request.");
    }
  };

  // --- Handlers ---
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: newTaskInput, assignedTo: newAssignee, status: "Pending" }]);
    setNewTaskInput("");
  };

  const handleSendAIChat = async (text?: string) => {
    const input = text || aiChatInput;
    if (!input.trim()) return;
    setAiReplies(prev => [...prev, { sender: "user", text: input }]);
    if (!text) setAiChatInput("");

    try {
      const orgId = session?.organizationId || 1;
      const res = await fetch("http://localhost:8081/api/project-manager/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          organizationId: String(orgId)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiReplies(prev => [...prev, { sender: "bot", text: data.response }]);
      } else {
        setAiReplies(prev => [...prev, { sender: "bot", text: "Assistant: Error invoking AI Assistant." }]);
      }
    } catch (e) {
      console.error("AI chat failed", e);
      setAiReplies(prev => [...prev, { sender: "bot", text: "Assistant: Connection to AI service failed." }]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPreProjFile(file);
      setPreProjFileName(file.name);
    }
  };

  const handleClearPreProjForm = () => {
    setPreProjName("");
    setPreProjBudget("");
    setPreProjStaff("");
    setPreProjFileName("");
    setPreProjFile(null);
    setPreProjArea("");
    setPreProjFloors("");
    setPreProjLocationType("District HQ City");
    setPreProjReport(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyzePreProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preProjName || !preProjBudget) return;
    setIsAnalyzingPreProj(true);
    setPreProjReport(null);

    const targetB = parseFloat(preProjBudget);
    const targetW = parseInt(preProjStaff) || 10;
    const areaSqftVal = parseFloat(preProjArea) || 69750.0;
    const floorsVal = parseInt(preProjFloors) || 2;

    try {
      if (orgTier === "Enterprise") {
        const formData = new FormData();
        if (preProjFile) {
          formData.append("file", preProjFile, preProjFileName);
        } else {
          const fileBlob = new Blob(["sample-image-blueprint"], { type: "image/jpeg" });
          formData.append("file", fileBlob, preProjFileName || "design_blueprint_elev.jpg");
        }
        formData.append("projectName", preProjName);
        formData.append("targetBudget", targetB.toString());
        formData.append("workforceCount", targetW.toString());
        formData.append("builtupSqft", areaSqftVal.toString());
        formData.append("floors", floorsVal.toString());
        formData.append("locationType", preProjLocationType);

        const res = await fetch("http://localhost:8001/api/ai/estimate-image", {
          method: "POST",
          headers: {
            "X-API-Key": "BuildconERPSecretKeyForSecurityAuthenticationJWT"
          },
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          setPreProjReport(data);
        } else {
          throw new Error("FastAPI image estimation error");
        }
      } else {
        const res = await fetch("http://localhost:8001/api/ai/estimate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": "BuildconERPSecretKeyForSecurityAuthenticationJWT"
          },
          body: JSON.stringify({
            projectName: preProjName,
            targetBudget: targetB,
            workforceCount: targetW,
            designDescription: "Parameters-based estimation search",
            architectSpec: `Structural dimensions: ${areaSqftVal} sq ft built-up area x ${floorsVal} floors.`,
            builtupSqft: areaSqftVal,
            floors: floorsVal,
            locationType: preProjLocationType
          })
        });
        if (res.ok) {
          const data = await res.json();
          setPreProjReport(data);
        } else {
          throw new Error("FastAPI text estimation error");
        }
      }
    } catch (err) {
      console.warn("AI blueprint vision estimator unreachable, falling back to simulated pipeline:", err);
      setTimeout(() => {
        const totalFloors = floorsVal + 1;
        const areaSqft = areaSqftVal;
        const area = areaSqft * 0.092903;
        
        // Location coefficients configs
        const locationConfigs: Record<string, any> = {
          "Rural / Village": {
            rate_sqft: 1800.0,
            concrete_rate: 6300.0,
            steel_rate: 75500.0,
            masonry_rate: 4200.0,
            special_cost: 4500000.0,
            labor_premium: -25.0,
            advice: "Village sites are cheapest but carry hidden costs: material transport (ready-mix concrete may not be available — site mixing adds quality risk), water tanker costs during curing, and skilled labour has to travel from towns (boarding + daily allowance adds ₹200–400/worker/day). Panchayat approval is faster and cheaper than DTCP but building plan scrutiny is limited — get a licensed structural engineer regardless."
          },
          "Small Town": {
            rate_sqft: 2100.0,
            concrete_rate: 6500.0,
            steel_rate: 76500.0,
            masonry_rate: 4500.0,
            special_cost: 0.0,
            labor_premium: -10.0,
            advice: "Small town sites offer moderate pricing and faster approvals, but you should verify regional cement supply chains and skilled contractor availability before scheduling foundation work."
          },
          "District HQ City": {
            rate_sqft: 2400.0,
            concrete_rate: 6800.0,
            steel_rate: 78000.0,
            masonry_rate: 4800.0,
            special_cost: 0.0,
            labor_premium: 12.0,
            advice: "District HQ construction (e.g. Salem, Tirunelveli, Vellore) is subject to standard municipal corporation zoning rules. Ready-mix concrete (RMC) access is highly available."
          },
          "State Highway / Landmark Zone": {
            rate_sqft: 2800.0,
            concrete_rate: 7000.0,
            steel_rate: 80000.0,
            masonry_rate: 5000.0,
            special_cost: 6000000.0,
            labor_premium: 15.0,
            advice: "Highway sites need mandatory setback compliance (NH rules: 75 m from centreline), NHAI NOC, and compound wall/access road. These compliance costs add ₹40–80 L easily. High commercial value but high compliance burden."
          },
          "Tier-1 City": {
            rate_sqft: 3200.0,
            concrete_rate: 7500.0,
            steel_rate: 82000.0,
            masonry_rate: 5500.0,
            special_cost: 0.0,
            labor_premium: 35.0,
            advice: "Metro city projects (e.g. Chennai, Coimbatore, Madurai prime zones) face high labor costs and Union zone scheduling constraints. Ensure DTCP/CMDA building plan clearance."
          },
          "Premium Metro": {
            rate_sqft: 3500.0,
            concrete_rate: 7500.0,
            steel_rate: 82000.0,
            masonry_rate: 5500.0,
            special_cost: 0.0,
            labor_premium: 40.0,
            advice: "Premium Metro city center prime zones require heavy material handling restrictions (no daytime truck entry). Material staging must occur off-site or overnight."
          }
        };

        const activeCfg = locationConfigs[preProjLocationType] || locationConfigs["District HQ City"];
        const rateSqft = activeCfg.rate_sqft;
        const baseRealisticBudget = (areaSqft * rateSqft) + activeCfg.special_cost;

        // Generate comparative data
        const defaults: Record<string, [number, string, number]> = {
          "Rural / Village": [78, "Moderate budget shortfall", 130050000.0],
          "Small Town": [70, "Significant budget gap", 146475000.0],
          "District HQ City": [62, "High budget risk", 167400000.0],
          "State Highway / Landmark Zone": [55, "Major budget deficiency", 201300000.0],
          "Tier-1 City": [48, "Not financially viable", 223200000.0],
          "Premium Metro": [42, "Not financially viable", 244125000.0]
        };

        const locationAnalysisList = Object.keys(locationConfigs).map((locName) => {
          const lCfg = locationConfigs[locName];
          const locEst = (areaSqft * lCfg.rate_sqft) + lCfg.special_cost;
          const locGap = targetB - locEst;
          
          const ratio = locEst > 0 ? targetB / locEst : 1.0;
          const [base_s, base_st, ex_est] = defaults[locName];
          const exRatio = 90000000.0 / ex_est;
          const diff = ratio - exRatio;
          let locScore = Math.round(base_s + diff * 50);
          locScore = Math.max(10, Math.min(100, locScore));
          
          let locStatus = "";
          if (ratio >= 1.0) locStatus = "Budget is fully sufficient";
          else if (ratio >= 0.85) locStatus = "Minor budget variance";
          else if (ratio >= 0.72) locStatus = "Moderate budget shortfall";
          else if (ratio >= 0.62) locStatus = "Significant budget gap";
          else if (ratio >= 0.52) locStatus = "High budget risk";
          else if (ratio >= 0.44) locStatus = "Major budget deficiency";
          else locStatus = `Not financially viable at ₹${(targetB/10000000).toFixed(1)} Cr`;

          const lowCr = locEst / 10000000 * 0.96;
          const highCr = locEst / 10000000 * 1.05;
          const locRange = `₹${lowCr.toFixed(2)} – ₹${highCr.toFixed(2)} Cr`;
          
          return {
            locationType: locName,
            ratePerSqft: lCfg.rate_sqft,
            estimatedCost: locEst,
            budgetGap: locGap,
            feasibilityScore: locScore,
            budgetStatus: locStatus,
            practicalBudgetRange: locRange
          };
        });

        const premiumFactor = 1.0 + (activeCfg.labor_premium / 100.0);
        const hoursPerSqft = 1.115 * premiumFactor;
        const totalHours = Math.floor(areaSqft * hoursPerSqft);
        
        let classification = "";
        if (area <= 500) {
          classification = "Residential Villa / Single Family Home";
        } else if (area <= 3000) {
          classification = "Medium Residential / Commercial Complex";
        } else if (area <= 10000) {
          classification = "Large Commercial / Multi-Family Apartment";
        } else {
          classification = "Mega-Scale Development (Apartment Block / Commercial Complex)";
        }
        
        let classAlert = null;
        if (preProjName.toLowerCase().includes("villa") && area > 1500) {
          classAlert = `Villa scale typically under 1,500 m². Current layout suggests large commercial/mega-scale development (${area.toLocaleString()} m²).`;
        }
        
        let suggestedB = 0;
        let budgetGap = 0;
        if (targetB > 0) {
          budgetGap = targetB - baseRealisticBudget;
          if (targetB < baseRealisticBudget * 0.7) {
            suggestedB = baseRealisticBudget * 0.90;
          } else {
            suggestedB = targetB * 0.93;
          }
        } else {
          budgetGap = 0;
          suggestedB = baseRealisticBudget * 0.95;
        }

        const workforceNeeded = Math.max(10, Math.floor(totalHours / (240 * 8 * 0.85)));
        const recommendedDays = Math.max(30, Math.floor(totalHours / (workforceNeeded * 8 * 0.85)));
        
        const plannedCrew = targetW > 0 ? targetW : 10;
        const est_days = Math.max(30, Math.floor(totalHours / (plannedCrew * 8 * 0.85)));
        const calculatedHours = est_days * 8;

        const concreteV = area * 0.35;
        const steelT = concreteV * 0.08;
        const masonryV = area * 0.12;

        const structC = suggestedB * 0.50;
        const mepC = suggestedB * 0.18;
        const finishC = suggestedB * 0.27;
        const contC = suggestedB * 0.05;

        const comp_date = new Date(Date.now() + est_days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        
        setPreProjReport({
          projectName: preProjName,
          suggestedBudget: suggestedB,
          estimatedHours: calculatedHours,
          estimatedDays: est_days,
          recommendedDays: recommendedDays,
          workforceNeeded: workforceNeeded,
          completionDate: comp_date,
          structuralScore: targetB > 0 && targetB < (baseRealisticBudget * 0.8) ? "87/100 (Low budget compromise risk)" : "95/100",
          hazards: totalFloors >= 4 ? "High elevation wind shear, tower crane swing interference, scaffolding load checks." : "Excavation wall collapse hazard, scaffolding load checks.",
          suggestions: [
            targetW < workforceNeeded
              ? `Crew Deployment: Planned workforce of ${targetW} is below the recommendation of ${workforceNeeded} active workers. Suggest hiring ${workforceNeeded - targetW} additional personnel to maintain concrete pouring schedules.`
              : `Crew Deployment: Planned crew of ${plannedCrew} is adequate for G+${floorsVal} floor scheduling blocks.`,
            `RCC curing: Maintain constant wet curing (hydration sprays) on column frames for 14 days strictly.`,
            `Steel Reinforcement: Utilize Grade FE500D TMT bars to save steel weight volume by 5.2% over basic FE500.`,
            totalFloors >= 4 ? `Wind Safety: Attach temporary wind stabilizers on G+3 and upper floor formworks during slab pours.` : `Slab Integrity: Implement concrete expansion joints at every 30-meter interval along the floor layout to prevent curing shrink cracks.`,
            `Regional Insight: ${activeCfg.advice}`
          ],
          builtUpArea: area,
          builtUpAreaSqft: areaSqft,
          concreteVolume: concreteV,
          steelTonnage: steelT,
          structuralCost: structC,
          mepCost: mepC,
          finishingCost: finishC,
          contingencyCost: contC,
          costPerSqm: baseRealisticBudget / area,
          costPerSqft: rateSqft,
          standardMarketEstimate: baseRealisticBudget,
          budgetGap: budgetGap,
          projectClassification: classification,
          classificationAlert: classAlert,
          masonryVolume: masonryV,
          locationType: preProjLocationType,
          concreteRate: activeCfg.concrete_rate,
          steelRate: activeCfg.steel_rate,
          masonryRate: activeCfg.masonry_rate,
          locationAnalysis: locationAnalysisList,
          specialLocationCost: activeCfg.special_cost || null
        });
      }, 1000);
    } finally {
      setIsAnalyzingPreProj(false);
    }
  };

  const int_hours_calc = (l: number, f: number, b: number) => {
    return Math.floor((l * f * 75) + (b / 22000));
  };

  const f_workforce_sug = (w: number, hours: number) => {
    const recommended = Math.floor(hours / 120);
    return w < recommended
      ? `Warning: Workforce of ${w} is below recommendation (${recommended}). Recommend increasing size.`
      : `Planned crew of ${w} is optimal for G-level structural scale.`;
  };

  const generateAndDownloadExcel = (report: any, plannedBudget: string, plannedStaff: string) => {
    const rows = [
      ["BUILDCON ERP - AI PRE-PROJECT ESTIMATION REPORT"],
      ["Generated on", new Date().toLocaleString()],
      [],
      ["1. PROJECT METRICS"],
      ["Project Name", report.projectName],
      ["Project Classification", report.projectClassification || "Standard Development"],
      ["Selected Location Type", report.locationType || "District HQ City"],
      ["Built-Up Area (sq ft)", report.builtUpAreaSqft || (report.builtUpArea ? Math.round(report.builtUpArea / 0.092903) : 0)],
      ["Built-Up Area (sqm Equivalent)", report.builtUpArea],
      ["Cost Rate (INR / sq ft)", report.costPerSqft || 2044],
      ["Cost Rate (INR / sqm Equivalent)", report.costPerSqm || 22000],
      ["Structural Safety Score", report.structuralScore || "95/100"],
      [],
      ["2. FINANCIAL FEASIBILITY & SAVINGS ANALYSIS"],
      ["Standard Market Estimate (INR)", report.standardMarketEstimate],
      ["Planned Target Budget Limit (INR)", plannedBudget || "0"],
      ["Budget Variance / Gap (INR)", report.budgetGap],
      ["AI Optimized Budget Suggestion (INR)", report.suggestedBudget],
      ["Special Location Cost (Transport/Setbacks) (INR)", report.specialLocationCost || 0],
      [],
      ["3. SCHEDULING FORECAST & PRODUCTIVITY MATH"],
      ["Total Labor Hours (hrs)", report.builtUpAreaSqft ? Math.round(report.builtUpAreaSqft * 1.115) : (report.builtUpArea ? Math.round(report.builtUpArea * 12) : 0)],
      ["Planned Crew Size (workers)", plannedStaff || 10],
      ["Planned Crew Duration (days)", report.estimatedDays],
      ["Optimal Crew Size (workers)", report.workforceNeeded],
      ["Recommended Crew Duration (days)", report.recommendedDays],
      [],
      ["4. QUANTITY TAKEOFF (BOQ ESTIMATE)"],
      ["Material / Parameter", "Quantity", "Unit", "Rate (INR)", "Total Cost (INR)"],
      [
        "Est. Concrete Volume (RCC)",
        report.concreteVolume,
        "m3",
        report.concreteRate || 6800,
        report.concreteVolume ? report.concreteVolume * (report.concreteRate || 6800) : 0
      ],
      [
        "Est. Reinforcement Steel Weight",
        report.steelTonnage,
        "Tons",
        report.steelRate || 78000,
        report.steelTonnage ? report.steelTonnage * (report.steelRate || 78000) : 0
      ],
      [
        "Conceptual Masonry Factor (Est.)",
        report.masonryVolume,
        "m3",
        report.masonryRate || 4800,
        report.masonryVolume ? report.masonryVolume * (report.masonryRate || 4800) : 0
      ],
      [],
      ["5. STRUCTURAL COST BREAKDOWN (INR)"],
      ["Structural Works (50%)", report.structuralCost],
      ["MEP Layout Install (18%)", report.mepCost],
      ["Finishes & Masonry (27%)", report.finishingCost],
      ["Contingency & Supervision (5%)", report.contingencyCost],
      [],
      ["6. HAZARDS & ENGINEERING RECOMMENDATIONS"],
      ["Safety Hazards", report.hazards],
    ];

    if (report.suggestions && report.suggestions.length > 0) {
      rows.push(["Generative AI Engineering Advice"]);
      report.suggestions.forEach((sug: string, index: number) => {
        rows.push([`Advice ${index + 1}`, sug]);
      });
    }

    const csvContent = "\uFEFF" + rows.map(e => e.map(val => {
      if (val === undefined || val === null) return "";
      const strVal = val.toString().replace(/"/g, '""');
      return strVal.includes(",") || strVal.includes("\n") || strVal.includes('"') ? `"${strVal}"` : strVal;
    }).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${report.projectName.replace(/\s+/g, "_")}_AI_Estimation_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAndLaunchProject = async () => {
    if (!preProjName || !preProjReport) return;
    setIsSavingProject(true);
    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) {
        alert("Session or authorization token not found. Please log in again.");
        return;
      }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) {
        alert("Organization session missing.");
        return;
      }

      const res = await fetch("http://localhost:8081/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: preProjName,
          location: "Corporate Complex Hub",
          budget: parseFloat(preProjBudget),
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "Planning",
          organizationId: orgId,
          designPlanName: preProjFileName || "design_blueprint_elev.jpg",
          architectSpecName: "Architectural blueprint specifications manual",
          workforceDetails: preProjStaff || "20",
          aiSuggestedBudget: preProjReport.suggestedBudget,
          aiEstimatedHours: preProjReport.estimatedHours,
          aiHazardWarnings: preProjReport.hazards,
          builtupSqft: parseFloat(preProjArea) || 69750.0,
          floors: parseInt(preProjFloors) || 2,
          locationType: preProjReport.locationType || "District HQ City"
        })
      });

      if (res.ok) {
        generateAndDownloadExcel(preProjReport, preProjBudget, preProjStaff);
        alert("Project successfully created, sent to Chairman for review, and estimation report downloaded!");
        setPreProjName("");
        setPreProjBudget("");
        setPreProjStaff("");
        setPreProjFileName("");
        setPreProjArea("");
        setPreProjFloors("");
        setPreProjLocationType("District HQ City");
        setPreProjReport(null);
      } else {
        const txt = await res.text();
        alert("Error creating project: " + txt);
      }
    } catch (e) {
      console.error("Failed to submit project", e);
      alert("Network error: Could not submit project to the server.");
    } finally {
      setIsSavingProject(false);
    }
  };
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = session?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    if (selectedProject) {
      // Save project properties override directly to the database
      try {
        const res = await fetch(`http://localhost:8081/api/projects/${selectedProject.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            ...selectedProject,
            name: editProjName,
            location: editProjLoc,
            budget: parseFloat(editProjBudget) || 0,
            status: editProjStatus,
            floors: parseInt(editProjFloors) || 0,
            builtupSqft: parseFloat(editProjArea) || 0,
            plannedProgress: parseInt(editProjPlanned) || 0,
            actualProgress: parseInt(editProjActual) || 0
          })
        });
        if (res.ok) {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
          // If name changed, update the active projectFilter to match
          if (editProjName !== selectedProject.name) {
            setProjectFilter(editProjName);
          }
          fetchDashboardData(orgId);
        } else {
          alert("Failed to update project properties.");
        }
      } catch (err) {
        console.error("Error saving project properties:", err);
      }
    } else {
      // Save global configuration overrides
      try {
        const res = await fetch("http://localhost:8081/api/project-manager/profile/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            username: profileName,
            email: profileEmail,
            avatarInitials: avatarInitials,
            organizationId: String(orgId),
            sidebar_menus: sidebarMenus,
            project_value: projectValue,
            progress: progressVal,
            budget_used: budgetUsed,
            profit_margin: profitMargin,
            pending_approvals: pendingApprovals,
            delay_risk: delayRisk,
            budget_value_project: budgetValueProject,
            budget_value_approved: budgetValueApproved,
            budget_value_actual: budgetValueActual,
            ai_suggestions: aiSuggestions
          })
        });
        if (res.ok) {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
          if (session) {
            const newSession = { ...session, name: profileName };
            localStorage.setItem("buildcon_session", JSON.stringify(newSession));
          }
          if (aiSuggestions) {
            setSuggestions(aiSuggestions.split("|").map((item: string) => item.trim()));
          }
        }
      } catch (err) {
        console.error("Error saving profile settings:", err);
      }
    }
  };

  const getTransactionProjectName = (tx: any, projectsList: any[]) => {
    if (!projectsList || projectsList.length === 0) return "Skyline Residences";
    if (tx.party && tx.party.toLowerCase().includes("skyline")) {
      const p = projectsList.find(proj => proj.name.toLowerCase().includes("skyline"));
      if (p) return p.name;
    }
    if (tx.party && tx.party.toLowerCase().includes("greenfield")) {
      const p = projectsList.find(proj => proj.name.toLowerCase().includes("greenfield"));
      if (p) return p.name;
    }
    const index = Number(tx.id || 0) % projectsList.length;
    return projectsList[index]?.name || projectsList[0]?.name;
  };

  const getContractProjectName = (c: any, projectsList: any[]) => {
    if (!projectsList || projectsList.length === 0) return "";
    const index = Number(c.id || 0) % projectsList.length;
    return projectsList[index]?.name || "";
  };

  const getPendingClaimsForContract = (c: any) => {
    if (projects.length === 0) return 0;
    const projName = getContractProjectName(c, projects);
    const proj = projects.find(p => p.name === projName);
    if (!proj) return 0;
    const claims = pendingClaims.filter(cl => cl.status === "PENDING" && cl.projectId === proj.id);
    return claims.reduce((acc, cl) => acc + cl.amountRequested, 0);
  };

  const getProjectDefaultRisks = (proj: any, employeesList: any[]) => {
    const sseName = employeesList.find(e => e.role === "Senior Site Engineer")?.name || "buildcon senior site engineer";
    const pmName = employeesList.find(e => e.role === "Procurement Manager")?.name || "Venkatesh";
    
    if (proj.status === "Planning") {
      return [
        {
          id: `RISK-${proj.id}-1`,
          title: "Approvals Lead Time Delay",
          description: "Municipal clearance and environmental permits pending submission.",
          justification: "Awaiting architect structural specifications design release.",
          level: "Low",
          date: proj.startDate ? new Date(proj.startDate).toLocaleDateString() : new Date().toLocaleDateString(),
          responsible: `${sseName} (Senior Site Engineer)`
        }
      ];
    } else {
      return [
        {
          id: `RISK-${proj.id}-2`,
          title: "Steel Material Cost Escalation",
          description: "Steel rates increased by 4.5% compared to the baseline estimation. Procurement manager advised to lock inventory orders for the next 3 months.",
          justification: "Market supply chain bottlenecks causing steel index shifts.",
          level: "Medium",
          date: new Date().toLocaleDateString(),
          responsible: `${pmName} (Procurement Manager)`
        }
      ];
    }
  };

  const formatAmountLakhs = (amt: number) => {
    if (amt >= 10000000) {
      return `₹ ${(amt / 10000000).toFixed(2)} Cr`;
    }
    return `₹ ${(amt / 100000).toFixed(1)} Lakhs`;
  };

  const projectMilestones = React.useMemo(() => {
    if (projects.length === 0) {
      return [
        { phase: "Excavation & Earthwork", duration: "Jan - Feb 2026", progress: 100, status: "Completed" },
        { phase: "Foundation & Framing", duration: "Mar - May 2026", progress: 100, status: "Completed" },
        { phase: "Structural Core (Slab & Brickwork)", duration: "Jun - Sep 2026", progress: 64, status: "In Progress" },
        { phase: "Finishing & Handover", duration: "Oct - Dec 2026", progress: 0, status: "Pending" }
      ];
    }
    
    let start = new Date();
    let end = new Date(Date.now() + 365*24*60*60*1000);
    
    if (selectedProject) {
      start = selectedProject.startDate ? new Date(selectedProject.startDate) : new Date();
      end = selectedProject.endDate ? new Date(selectedProject.endDate) : new Date(start.getTime() + 365*24*60*60*1000);
    } else {
      const startDates = projects.map(p => p.startDate ? new Date(p.startDate).getTime() : Date.now());
      const endDates = projects.map(p => p.endDate ? new Date(p.endDate).getTime() : Date.now() + 365*24*60*60*1000);
      start = new Date(Math.min(...startDates));
      end = new Date(Math.max(...endDates));
    }
    
    const totalMs = end.getTime() - start.getTime();
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    };
    
    const p1Start = new Date(start.getTime());
    const p1End = new Date(start.getTime() + totalMs * 0.15);
    
    const p2Start = new Date(p1End.getTime() + 24*60*60*1000);
    const p2End = new Date(start.getTime() + totalMs * 0.45);
    
    const p3Start = new Date(p2End.getTime() + 24*60*60*1000);
    const p3End = new Date(start.getTime() + totalMs * 0.80);
    
    const p4Start = new Date(p3End.getTime() + 24*60*60*1000);
    const p4End = new Date(end.getTime());
    
    const now = new Date().getTime();
    
    const getPhaseStats = (pStart: Date, pEnd: Date) => {
      const sTime = pStart.getTime();
      const eTime = pEnd.getTime();
      if (now > eTime) {
        return { progress: 100, status: "Completed" };
      } else if (now < sTime) {
        return { progress: 0, status: "Pending" };
      } else {
        const progress = Math.round(((now - sTime) / (eTime - sTime)) * 100);
        return { progress: Math.min(99, Math.max(1, progress)), status: "In Progress" };
      }
    };
    
    const st1 = getPhaseStats(p1Start, p1End);
    const st2 = getPhaseStats(p2Start, p2End);
    const st3 = getPhaseStats(p3Start, p3End);
    const st4 = getPhaseStats(p4Start, p4End);
    
    return [
      { phase: "Excavation & Earthwork", duration: `${formatDate(p1Start)} - ${formatDate(p1End)}`, ...st1 },
      { phase: "Foundation & Framing", duration: `${formatDate(p2Start)} - ${formatDate(p2End)}`, ...st2 },
      { phase: "Structural Core (Slab & Brickwork)", duration: `${formatDate(p3Start)} - ${formatDate(p3End)}`, ...st3 },
      { phase: "Finishing & Handover", duration: `${formatDate(p4Start)} - ${formatDate(p4End)}`, ...st4 }
    ];
  }, [projects, selectedProject]);

  const clientInvoices = React.useMemo(() => {
    const receivables = transactions.filter(t => t.type === "Receivable");
    return receivables.filter(t => projectFilter === "All Projects" || getTransactionProjectName(t, projects) === projectFilter);
  }, [transactions, projectFilter, projects]);

  const getLogSubmitter = (log: any, idx: number, employeesList: any[]) => {
    const sse = employeesList.find(e => e.role === "Senior Site Engineer");
    const sm = employeesList.find(e => e.role === "Site Supervisor");
    if (idx % 2 === 0) {
      return sse ? `${sse.name} (Senior Site Engineer)` : "buildcon senior site engineer (Senior Site Engineer)";
    } else {
      return sm ? `${sm.name} (Site Supervisor)` : "Amit Patel (Site Supervisor)";
    }
  };

  const filteredLogs = React.useMemo(() => {
    return dailyLogs.filter(log => projectFilter === "All Projects" || log.projectName === projectFilter);
  }, [dailyLogs, projectFilter]);

  const filteredContracts = React.useMemo(() => {
    return subcontractorContracts.filter(c => projectFilter === "All Projects" || getContractProjectName(c, projects) === projectFilter);
  }, [subcontractorContracts, projectFilter, projects]);

  const changeOrders = React.useMemo(() => {
    const qsName = employees.find(e => e.role === "Quantity Surveyor")?.name || "buildcon quantity surveyor";
    return projects.map((p, idx) => {
      const voNum = String(idx + 1).padStart(2, "0");
      const valueEst = Math.round((p.budget || 50000000) * 0.0018);
      const details = [
        "Additional MEP conduits in basement layout",
        "Foundation rebar reinforcement specification shift",
        "HVAC system re-routing in Tower B",
        "Alternative safety containment netting on upper floors",
        "Extra granite flooring in main entrance lobby"
      ][idx % 5];
      
      return {
        id: `VO-${p.id}-${idx}`,
        title: `Variation Order #${voNum} - ${details}`,
        value: valueEst,
        status: idx % 3 === 0 ? "Pending Approval" : idx % 3 === 1 ? "Approved" : "Under Review",
        projectName: p.name,
        submittedBy: `${qsName} (Quantity Surveyor)`
      };
    }).filter(vo => projectFilter === "All Projects" || vo.projectName === projectFilter);
  }, [projects, projectFilter, employees]);

  const riskCenterItems = React.useMemo(() => {
    const sseName = employees.find(e => e.role === "Senior Site Engineer")?.name || "buildcon senior site engineer";
    const pmName = employees.find(e => e.role === "Procurement Manager")?.name || "Venkatesh";
    
    const filteredAlerts = alerts.filter(a => projectFilter === "All Projects" || a.projectId === selectedProject?.id || a.projectName === projectFilter);
    
    if (filteredAlerts.length > 0) {
      return filteredAlerts.map(a => ({
        id: `RISK-ALERT-${a.id}`,
        title: a.detectedIssues ? a.detectedIssues.split("|")[0] : "Site Curing/Timeline Warning",
        description: a.justificationPrompt || "Progress deviation detected on critical path.",
        justification: a.siteEngineerJustification || "Awaiting site team analysis.",
        level: (a.delayDays || 0) > 10 ? "High" : "Medium",
        date: a.alertTime ? new Date(a.alertTime).toLocaleDateString() : new Date().toLocaleDateString(),
        responsible: a.detectedIssues && a.detectedIssues.toLowerCase().includes("cost") ? `${pmName} (Procurement Manager)` : `${sseName} (Senior Site Engineer)`
      }));
    }
    
    return selectedProject 
      ? getProjectDefaultRisks(selectedProject, employees) 
      : projects.flatMap(p => getProjectDefaultRisks(p, employees));
  }, [alerts, projects, selectedProject, projectFilter, employees]);

  const documentControlItems = React.useMemo(() => {
    const sseName = employees.find(e => e.role === "Senior Site Engineer")?.name || "buildcon senior site engineer";
    let list: any[] = [];
    
    const addProjectDocs = (p: any) => {
      list.push({
        id: `DOC-PLAN-${p.id}`,
        name: p.designPlanName || `${p.name.toLowerCase().replace(/\s+/g, "_")}_structural_foundation.dwg`,
        category: "Structural Blueprint",
        projectName: p.name,
        submittedBy: `${sseName} (Senior Site Engineer)`
      });
      list.push({
        id: `DOC-ARCH-${p.id}`,
        name: p.architectSpecName || `${p.name.toLowerCase().replace(/\s+/g, "_")}_architectural_g1.pdf`,
        category: "Architectural Specification",
        projectName: p.name,
        submittedBy: `${sseName} (Senior Site Engineer)`
      });
    };

    if (selectedProject) {
      addProjectDocs(selectedProject);
    } else {
      projects.forEach(p => addProjectDocs(p));
    }
    
    drawings.forEach((d, idx) => {
      const projIndex = idx % (projects.length || 1);
      const projName = projects[projIndex]?.name || "";
      if (projectFilter === "All Projects" || projName === projectFilter) {
        list.push({
          id: `DOC-SSE-${d.id || idx}`,
          name: `${d.drawingId}_${d.title.toLowerCase().replace(/\s+/g, "_")}.dwg`,
          category: d.category || "CAD Drawing",
          projectName: projName,
          submittedBy: `${sseName} (Senior Site Engineer)`
        });
      }
    });
    
    return list;
  }, [drawings, projects, selectedProject, projectFilter, employees]);

  const handleDownloadDoc = (doc: any) => {
    const blob = new Blob([`BUILDWELL ERP DOCUMENT ARCHIVE\n===========================\nDocument ID: ${doc.id}\nFilename: ${doc.name}\nCategory: ${doc.category}\nProject: ${doc.projectName}\nSubmitted By: ${doc.submittedBy}\nStatus: Certified\n\nThis is a mock CAD/PDF specification file for construction planning.`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", doc.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSidebarIcon = (name: string) => {
    switch (name) {
      case "Executive Summary": return <LayoutDashboard className="h-4 w-4" />;
      case "Project Command Center": return <Activity className="h-4 w-4" />;
      case "Project Timeline": return <Calendar className="h-4 w-4" />;
      case "Budget Monitoring": return <DollarSign className="h-4 w-4" />;
      case "Client Management": return <Users className="h-4 w-4" />;
      case "BOQ Tracking": return <FileText className="h-4 w-4" />;
      case "Progress Monitoring": return <Clock className="h-4 w-4" />;
      case "Subcontractor Management": return <Users className="h-4 w-4" />;
      case "Change Orders": return <FileText className="h-4 w-4" />;
      case "Risk Center": return <AlertTriangle className="h-4 w-4" />;
      case "Document Control": return <FolderOpen className="h-4 w-4" />;
      case "Approval Center": return <CheckSquare className="h-4 w-4" />;
      case "Pre-Project AI Estimator": return <Sparkles className="h-4 w-4 text-yellow-400" />;
      case "AI Project Assistant": return <Bot className="h-4 w-4" />;
      case "Leave Requests": return <Calendar className="h-4 w-4" />;
      case "Settings": return <Settings className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const sidebarList = sidebarMenus
    ? sidebarMenus.split("|").map((n) => n.trim()).filter(Boolean)
    : [
        "Executive Summary",
        "Project Command Center",
        "Project Timeline",
        "Budget Monitoring",
        "Client Management",
        "BOQ Tracking",
        "Progress Monitoring",
        "Subcontractor Management",
        "Change Orders",
        "Risk Center",
        "Document Control",
        "Approval Center",
        "Leave Requests",
        "Pre-Project AI Estimator",
        "AI Project Assistant",
        "Settings"
      ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A1120] text-slate-300 text-sm">
        Loading Project Manager Portal...
      </div>
    );
  }

  return (
    <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 grid place-items-center shadow-lg shadow-yellow-500/20">
              <Building2 className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">BuildWell</div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">Constructions</div>
            </div>
          </div>

          <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-270px)]">
            {sidebarList.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                  activeTab === item
                    ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-slate-950 font-semibold shadow-md shadow-yellow-500/15"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {getSidebarIcon(item)}
                <span className="flex-1 text-left">{item}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4 bg-[#0B1222]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 grid place-items-center text-xs font-bold font-mono">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">{profileName}</div>
              <div className="text-[10px] text-slate-400 font-medium truncate font-sans">Project Manager</div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login/manager");
              }}
              className="p-1.5 rounded-md text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-[#0F182A]/70 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2 font-sans tracking-wide">
              {activeTab.toUpperCase()} <span className="text-[10px] text-yellow-400 font-normal normal-case">/ Project Manager portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Manage scope, budget compliance, subcontractor performance, and approval pipelines.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#111C30] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Filter className="h-3 w-3 text-yellow-400" />
              <select
                className="bg-transparent text-[11px] font-semibold text-slate-200 outline-none cursor-pointer border-0 p-0 pr-4"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="All Projects">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-yellow-400" />
              <span>{dateFilter}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

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

          {/* EXECUTIVE SUMMARY */}
          {activeTab === "Executive Summary" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Notified progress reports list */}
              {filteredNotifiedReports.map((report: any) => (
                <div key={report.id} className="bg-gradient-to-r from-amber-950/40 to-[#221e15]/40 border border-amber-500/30 text-slate-200 p-4.5 rounded-xl flex flex-col gap-3 relative animate-fadeIn shadow-lg shadow-amber-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-500 animate-pulse" />
                      <span className="font-bold text-sm text-white">PM Progress Vision Report Alert: '{report.projectName}'</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono bg-[#1c1a15] px-2 py-0.5 rounded border border-slate-800">
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

              <div className="grid grid-cols-6 gap-4 text-xs">
                {displayMetrics.map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[9px] text-slate-450 uppercase text-slate-400 font-semibold">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Budget burn */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Project Budget Burn MTD (₹)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={displayBudgetBurnData}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" name="Budget" dataKey="Budget" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                        <Area type="monotone" name="Actual Spend" dataKey="Actual" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Subcontractor progress */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Subcontractors Progress Rating</h3>
                  <div className="space-y-3.5 text-xs">
                    {[
                      { name: "Concrete Specialist", rate: "90%", status: "On Track" },
                      { name: "MEP Contractor", rate: "78%", status: "Needs Attention" },
                      { name: "Interior Finisher", rate: "85%", status: "On Track" }
                    ].map((s, idx) => (
                      <div key={idx} className="p-3 bg-[#0e1628] rounded-xl border border-slate-850 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">{s.name}</div>
                          <span className="text-[9px] text-slate-500 mt-0.5">Completion: {s.rate}</span>
                        </div>
                        <span className={`text-[10px] font-bold ${s.status === "On Track" ? "text-emerald-400" : "text-amber-400"}`}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROJECT COMMAND CENTER */}
          {activeTab === "Project Command Center" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleAddTask} className="flex gap-2 bg-[#111C30] border border-slate-800 rounded-xl p-4">
                <input
                  type="text"
                  placeholder="Assign new task request..."
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-850 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-yellow-500"
                  required
                />
                <select value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)} className="bg-[#0a1120] text-slate-100 border border-slate-850 p-2.5 rounded-lg text-xs outline-none">
                  {employees.length === 0 ? (
                    <>
                      <option value="Karthick (Senior Eng)">Karthick (Senior Eng)</option>
                      <option value="Meenakshi (QS)">Meenakshi (QS)</option>
                      <option value="Venkatesh (Procurement)">Venkatesh (Procurement)</option>
                    </>
                  ) : (
                    employees.map((emp) => (
                      <option key={emp.id} value={`${emp.name} (${emp.role})`}>
                        {emp.name} ({emp.role})
                      </option>
                    ))
                  )}
                </select>
                <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold px-4 rounded-lg text-xs transition flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Assign Task
                </button>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Command Tasks Ledger</h3>
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0e1628] border border-slate-850">
                      <div>
                        <div className="font-bold text-white text-xs">{task.title}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">Assigned to: {task.assignedTo}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        task.status === "Completed" ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                      }`}>{task.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROJECT TIMELINE */}
          {activeTab === "Project Timeline" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Project Timeline (Gantt Milestones)</h3>
              <div className="space-y-3 text-xs">
                {projectMilestones.map((p, idx) => (
                  <div key={idx} className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">{p.phase}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{p.duration} ({p.progress}%)</span>
                    </div>
                    <div className="w-full bg-[#0a1120] rounded-full h-2 overflow-hidden">
                      <div className="bg-yellow-500 h-full rounded-full transition-all duration-300" style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUDGET MONITORING */}
          {activeTab === "Budget Monitoring" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Budget Variance Analysis</h3>
                {(() => {
                  let total = 0;
                  let approved = 0;
                  let actual = 0;
                  if (projects.length > 0) {
                    if (!selectedProject) {
                      total = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
                      approved = projects.reduce((sum, p) => sum + (p.aiSuggestedBudget || p.budget * 0.95), 0);
                      actual = subcontractorContracts.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
                      if (actual === 0) actual = total * 0.58;
                    } else {
                      total = selectedProject.budget || 0;
                      approved = selectedProject.aiSuggestedBudget || total * 0.95;
                      const projContracts = subcontractorContracts.filter(c => c.projectId === selectedProject.id);
                      actual = projContracts.length > 0 ? projContracts.reduce((sum, c) => sum + (c.paidAmount || 0), 0) : total * 0.58;
                    }
                  }
                  return (
                    <div className="grid md:grid-cols-3 gap-4 text-xs text-center">
                      <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                        <span className="text-slate-400">Total Project Value</span>
                        <div className="text-lg font-bold text-white font-mono mt-1">{formatProjectBudget(total)}</div>
                      </div>
                      <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                        <span className="text-slate-400">Approved Budget Limit</span>
                        <div className="text-lg font-bold text-blue-400 font-mono mt-1">{formatProjectBudget(approved)}</div>
                      </div>
                      <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                        <span className="text-slate-400">Actual Spendings</span>
                        <div className="text-lg font-bold text-yellow-400 font-mono mt-1">{formatProjectBudget(actual)}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* CLIENT MANAGEMENT */}
          {activeTab === "Client Management" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Client Invoicing & Communications</h3>
              <div className="space-y-3.5 text-xs">
                {clientInvoices.length === 0 ? (
                  <div className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl text-center text-slate-500">
                    No client invoices recorded for this project.
                  </div>
                ) : (
                  clientInvoices.map((inv, idx) => (
                    <div key={inv.id || idx} className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{inv.party} ({inv.txId || `INV-2026-${String(idx + 3).padStart(3, "0")}`})</div>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">Value: ₹{inv.amount?.toLocaleString("en-IN")} | Due Date: {inv.dueDate}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400"
                      }`}>{inv.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* BOQ TRACKING */}
          {activeTab === "BOQ Tracking" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">BOQ tracking spreadsheet</h3>
                <span className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                  Entered by: {employees.find(e => e.role === "Quantity Surveyor")?.name || "buildcon quantity surveyor"} (QS)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                  <span className="text-slate-400 block mb-1">Earthwork (Excavation)</span>
                  <div className="text-base font-bold text-white font-mono">
                    {selectedProject ? Math.round((selectedProject.builtupSqft || 50000) * 0.15).toLocaleString() : projects.reduce((sum, p) => sum + Math.round((p.builtupSqft || 50000) * 0.15), 0).toLocaleString()} m³ executed
                  </div>
                </div>
                <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                  <span className="text-slate-400 block mb-1">Cement Concrete (RCC)</span>
                  <div className="text-base font-bold text-white font-mono">
                    {selectedProject ? Math.round((selectedProject.builtupSqft || 50000) * 0.4).toLocaleString() : projects.reduce((sum, p) => sum + Math.round((p.builtupSqft || 50000) * 0.4), 0).toLocaleString()} m³ executed
                  </div>
                </div>
                <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                  <span className="text-slate-400 block mb-1">Masonry & Brickwork</span>
                  <div className="text-base font-bold text-white font-mono">
                    {selectedProject ? Math.round((selectedProject.builtupSqft || 50000) * 2.5).toLocaleString() : projects.reduce((sum, p) => sum + Math.round((p.builtupSqft || 50000) * 2.5), 0).toLocaleString()} Sq.Ft executed
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROGRESS MONITORING */}
          {activeTab === "Progress Monitoring" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">On-site Daily Progress Reports</h3>
              <div className="space-y-3.5">
                {filteredLogs.length === 0 ? (
                  <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs text-center text-slate-500">
                    No daily progress reports recorded for this project filter.
                  </div>
                ) : (
                  filteredLogs.map((log, idx) => (
                    <div key={log.id || idx} className="p-4 bg-[#0e1628] border border-slate-855 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-white">{log.activity}</div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          log.status === "Completed" ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-emerald-400" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}>{log.status}</span>
                      </div>
                      <p className="text-slate-400">Zone: <span className="text-slate-200 font-medium">{log.zone}</span> | Workforce: <span className="text-slate-200 font-medium">{log.workforceCount} workers</span> | Project: <span className="text-slate-200 font-medium">{log.projectName}</span></p>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-850/50">
                        <span>Date: {log.date || new Date().toLocaleDateString("en-IN")}</span>
                        <span>Logged by: <span className="text-yellow-500/90 font-medium">{getLogSubmitter(log, idx, employees)}</span></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SUBCONTRACTOR MANAGEMENT */}
          {activeTab === "Subcontractor Management" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Subcontractor Contracts</h3>
              <div className="space-y-3.5">
                {filteredContracts.length === 0 ? (
                  <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs text-center text-slate-500">
                    No active subcontractor contracts found for this project filter.
                  </div>
                ) : (
                  filteredContracts.map((c, idx) => {
                    const pendingClaimsSum = getPendingClaimsForContract(c);
                    return (
                      <div key={c.id || idx} className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">{c.scopeName || "Civil Crew Works"} ({c.contractId || `CON-30${idx+1}`})</div>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Value: {formatAmountLakhs(c.value || 0)} | Paid: {formatAmountLakhs(c.certified || 0)} | Status: <span className="text-slate-350">{c.status}</span>
                          </span>
                        </div>
                        {pendingClaimsSum > 0 ? (
                          <span className="text-[10px] text-yellow-400 font-bold font-mono">
                            {formatAmountLakhs(pendingClaimsSum)} claims pending
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">No pending claims</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* CHANGE ORDERS */}
          {activeTab === "Change Orders" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Project Change & Variation orders</h3>
              <div className="space-y-3.5">
                {changeOrders.length === 0 ? (
                  <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs text-center text-slate-500">
                    No variation or change orders found.
                  </div>
                ) : (
                  changeOrders.map((vo) => (
                    <div key={vo.id} className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{vo.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Value estimation: {formatAmountLakhs(vo.value)} | Project: {vo.projectName}
                        </div>
                        <div className="text-[9px] text-yellow-500/80 mt-1">Submitted by: {vo.submittedBy}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        vo.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}>{vo.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* RISK CENTER */}
          {activeTab === "Risk Center" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Delays and Risk Assessments</h3>
              <div className="space-y-4">
                {riskCenterItems.length === 0 ? (
                  <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs text-center text-slate-500">
                    No delays or risk warnings recorded.
                  </div>
                ) : (
                  riskCenterItems.map((risk) => (
                    <div key={risk.id} className="p-4 bg-[#0e1628] border border-slate-855 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-white flex gap-1.5 items-center">
                          <AlertTriangle className={`h-4 w-4 ${risk.level === "High" ? "text-red-400" : risk.level === "Medium" ? "text-yellow-400" : "text-blue-400"}`} />
                          {risk.title}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          risk.level === "High" ? "bg-red-500/10 text-red-450 text-red-400" : risk.level === "Medium" ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"
                        }`}>{risk.level} Risk</span>
                      </div>
                      <p className="text-slate-400">{risk.description}</p>
                      {risk.justification && (
                        <p className="text-slate-500 italic bg-[#090e1b] p-2 rounded border border-slate-850/50">
                          <span className="font-semibold text-slate-400">Site Status:</span> {risk.justification}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-850/50">
                        <span>Raised Date: {risk.date}</span>
                        <span>Responsible: <span className="text-yellow-500/90 font-medium">{risk.responsible}</span></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* DOCUMENT CONTROL */}
          {activeTab === "Document Control" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">CAD Drawings & Blueprints Catalog</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                {documentControlItems.length === 0 ? (
                  <div className="col-span-2 p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-center text-slate-500">
                    No documents or drawings available in catalog.
                  </div>
                ) : (
                  documentControlItems.map((doc, idx) => (
                    <div key={doc.id || idx} className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl flex justify-between items-center">
                      <div className="flex gap-3 items-center min-w-0">
                        <FolderOpen className="h-5 w-5 text-yellow-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-semibold text-white font-mono truncate block">{doc.name}</span>
                          <span className="text-[10px] text-slate-500 block">{doc.category} | Project: {doc.projectName}</span>
                          <span className="text-[9px] text-yellow-500/80 block mt-0.5">Submitted by: {doc.submittedBy}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDownloadDoc(doc)} className="bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold px-2 py-1 rounded text-[10px] shrink-0 transition">
                        Download
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* APPROVAL CENTER */}
          {activeTab === "Approval Center" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Pending Approvals Queue</h3>
              <div className="space-y-3.5 text-xs">
                {filteredPendingClaims.length === 0 ? (
                  <div className="text-slate-400 text-center py-6">No pending subcontractor claims in queue.</div>
                ) : (
                  filteredPendingClaims.map((claim) => (
                    <div key={claim.id} className="p-4 bg-[#0e1628] border border-slate-855 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{claim.description || "Subcontractor Claim Works"}</div>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Amount: ₹{claim.amountRequested.toLocaleString("en-IN")} | Subcontractor: Sub-{claim.subcontractorId}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveClaim(claim.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded">Approve</button>
                        <button onClick={() => handleRejectClaim(claim.id)} className="bg-red-650 text-white font-bold px-3 py-1 rounded">Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* LEAVE REQUESTS */}
          {activeTab === "Leave Requests" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Leave Applications</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Submit your leave applications and track their approval status.</p>
                </div>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md shadow-yellow-500/10"
                >
                  <Plus className="h-4 w-4" /> Apply for Leave
                </button>
              </div>

              {/* Leave statistics cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0e1628] border border-slate-800/85 rounded-xl p-4">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Total Applied Leaves</span>
                  <div className="text-xl font-bold mt-1 font-mono text-white">
                    {leaveList.filter(l => l.employeeName === profileName).length} Requests
                  </div>
                </div>
                <div className="bg-[#0e1628] border border-slate-800/85 rounded-xl p-4">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Pending Approvals</span>
                  <div className="text-xl font-bold mt-1 font-mono text-yellow-500">
                    {leaveList.filter(l => l.employeeName === profileName && l.status === "Pending").length} Pending
                  </div>
                </div>
                <div className="bg-[#0e1628] border border-slate-800/85 rounded-xl p-4">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Approved Leaves</span>
                  <div className="text-xl font-bold mt-1 font-mono text-emerald-400">
                    {leaveList.filter(l => l.employeeName === profileName && l.status === "Approved").length} Approved
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-355 text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-mono">
                      <th className="pb-3 font-semibold">Leave Type</th>
                      <th className="pb-3 font-semibold">Duration / Dates</th>
                      <th className="pb-3 font-semibold">Reason</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveList.filter(l => l.employeeName === profileName).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500 font-sans">
                          No leave requests submitted yet.
                        </td>
                      </tr>
                    ) : (
                      leaveList.filter(l => l.employeeName === profileName).map((leave: any) => (
                        <tr key={leave.id} className="border-b border-slate-800/40 hover:bg-slate-800/10">
                          <td className="py-3 font-semibold text-white">{leave.leaveType}</td>
                          <td className="py-3 text-slate-300 font-mono">{leave.duration}</td>
                          <td className="py-3 text-slate-400 max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                          <td className="py-3 text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              leave.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 text-emerald-400"
                                : leave.status === "Rejected"
                                ? "bg-rose-500/10 text-rose-455 border-rose-500/20 text-rose-450 text-rose-400"
                                : "bg-yellow-500/10 text-yellow-450 border-yellow-500/25 text-yellow-405 text-yellow-400"
                            }`}>
                              {leave.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI PROJECT ASSISTANT */}
          {activeTab === "AI Project Assistant" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                  {aiReplies.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-xl max-w-sm text-xs ${
                        msg.sender === "user" ? "bg-yellow-600 text-slate-950 font-bold" : "bg-[#0e1628] border border-slate-850 text-slate-200"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                  <input
                    type="text"
                    placeholder="Ask AI project planner..."
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAIChat()}
                    className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                  <button onClick={() => handleSendAIChat()} className="bg-yellow-600 hover:bg-yellow-500 text-slate-950 p-2.5 rounded-lg transition">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Quick Diagnostics Queries</h4>
                <div className="space-y-2.5 text-xs text-yellow-405 text-yellow-450">
                  <button onClick={() => handleSendAIChat("Predict completion date.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-yellow-500 transition block">🔮 Predict completion date.</button>
                  <button onClick={() => handleSendAIChat("Which subcontractor is underperforming?")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-yellow-500 transition block">🔮 Which subcontractor is underperforming?</button>
                  <button onClick={() => handleSendAIChat("Budget overrun forecast.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-yellow-500 transition block">🔮 Budget overrun forecast.</button>
                </div>
              </div>
            </div>
          )}

          {/* PRE-PROJECT AI ESTIMATOR */}
          {activeTab === "Pre-Project AI Estimator" && (
            <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-yellow-500" /> Pre-Project AI Analysis & Estimator
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Before committing to a construction project, upload architectural plans, structural designs, and planned resource volumes. The Python-based Generative AI analyzes raw specifications to suggest optimized budgets and predict total hours.
                </p>

                <form onSubmit={handleAnalyzePreProject} className="space-y-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Project Name Target</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Skyline Residences Tower C" 
                      value={preProjName}
                      onChange={(e) => setPreProjName(e.target.value)}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Target Budget Limit (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 8500000" 
                        value={preProjBudget}
                        onChange={(e) => setPreProjBudget(e.target.value)}
                        className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Target Workforce Staff Count</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 35" 
                        value={preProjStaff}
                        onChange={(e) => setPreProjStaff(e.target.value)}
                        className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Built-Up Area (sq ft)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 69750" 
                        value={preProjArea}
                        onChange={(e) => setPreProjArea(e.target.value)}
                        className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Floors (G+)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 2" 
                        value={preProjFloors}
                        onChange={(e) => setPreProjFloors(e.target.value)}
                        className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Location Type & Compliance Zone</label>
                    <select
                      value={preProjLocationType}
                      onChange={(e) => setPreProjLocationType(e.target.value)}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500 text-xs"
                    >
                      <option value="Rural / Village">Rural / Village (₹1,800/sq ft)</option>
                      <option value="Small Town">Small Town (₹2,100/sq ft)</option>
                      <option value="District HQ City">District HQ City (₹2,400/sq ft)</option>
                      <option value="State Highway / Landmark Zone">State Highway / Landmark Zone (₹2,800/sq ft)</option>
                      <option value="Tier-1 City">Tier-1 City (₹3,200/sq ft)</option>
                      <option value="Premium Metro">Premium Metro (₹3,500/sq ft)</option>
                    </select>
                  </div>

                  {orgTier === "Enterprise" ? (
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Upload Design Blueprint, Architect Specs, & Sample Construction Images</label>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <div className="border border-dashed border-slate-700 bg-[#0a1120] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors" onClick={() => {
                        fileInputRef.current?.click();
                      }}>
                        <UploadCloud className="h-8 w-8 text-slate-500 mb-2" />
                        <span className="text-slate-300 font-semibold">{preProjFileName || "Select or drop design/curing sample images here"}</span>
                        <span className="text-[10px] text-slate-500 mt-1">Accepts PNG, JPG, JPEG up to 50MB</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#0a1120] border border-slate-800 rounded-xl text-center">
                      <span className="text-[10px] text-yellow-500 font-mono font-semibold block">⚡ Text & Structured Parameter Input Mode</span>
                      <span className="text-[9px] text-slate-500 block mt-1">Image uploader analysis is exclusive to Enterprise subscription tier.</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      disabled={isAnalyzingPreProj}
                      className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition shadow-md shadow-yellow-500/10 disabled:opacity-50"
                    >
                      {isAnalyzingPreProj ? "AI Generative Model Analyzing Specs..." : "Run AI estimation & suggestion checks"}
                    </button>
                    <button 
                      type="button"
                      onClick={handleClearPreProjForm}
                      className="px-4 bg-[#1e293b] hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition border border-slate-700"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>

              {/* REPORT SIDE */}
              <div className="bg-[#111C30]/40 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">AI Forecast Analysis Output</h3>
                
                {preProjReport ? (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    {preProjReport.classificationAlert && (
                      <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-[11px] text-red-400 flex items-start gap-2.5 animate-pulse">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                        <div>
                          <strong className="block font-bold">Scale Advisory: Large Built-Up Area</strong>
                          {preProjReport.classificationAlert}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-[#0e1628] border border-slate-800 rounded-xl grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Project Classification</span>
                        <span className="text-xs font-bold text-cyan-400">{preProjReport.projectClassification || "Standard Development"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Built-Up Area Forecast</span>
                        <span className="text-sm font-bold font-mono text-white">
                          {preProjReport.builtUpAreaSqft ? `${preProjReport.builtUpAreaSqft.toLocaleString()} sq ft` : (preProjReport.builtUpArea ? `${Math.round(preProjReport.builtUpArea / 0.092903).toLocaleString()} sq ft` : "N/A")}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          ({preProjReport.builtUpArea ? `${preProjReport.builtUpArea.toLocaleString()} m²` : "N/A"} Equivalent)
                        </span>
                        <span className="text-[9px] text-slate-500 block">Rate: ₹{preProjReport.costPerSqft?.toLocaleString("en-IN") || "2,044"}/sq ft</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Structural Safety Score</span>
                        <span className="text-sm font-bold text-white font-mono">{preProjReport.structuralScore || "95/100"}</span>
                      </div>
                    </div>

                    {/* Target Budget comparison card */}
                    <div className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Financial Feasibility & Savings Analysis</h4>
                      <div className="space-y-1.5 text-[11px] text-slate-350">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Standard Market Estimate:</span>
                          <span className="font-mono text-white font-semibold">₹ {preProjReport.standardMarketEstimate?.toLocaleString("en-IN") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Planned Target Budget Limit:</span>
                          <span className="font-mono text-white font-semibold">₹ {parseFloat(preProjBudget || "0")?.toLocaleString("en-IN") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
                          <span className="text-slate-400">Budget Variance / Gap:</span>
                          <span className={`font-mono font-bold ${preProjReport.budgetGap < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                            {preProjReport.budgetGap < 0 ? "-" : "+"} ₹ {Math.abs(preProjReport.budgetGap || 0)?.toLocaleString("en-IN") || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
                          <span className="text-emerald-400 font-semibold">AI Optimized Budget Suggestion:</span>
                          <span className="font-mono font-bold text-emerald-400">₹ {preProjReport.suggestedBudget?.toLocaleString("en-IN") || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scheduling Results Card */}
                    <div className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Planned Crew Duration</span>
                        <span className="text-sm font-bold font-mono text-yellow-500">
                          {preProjReport.estimatedDays ? `${preProjReport.estimatedDays} Days` : "N/A"}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Crew Size: {preProjStaff || "10"} Workers</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Recommended Crew Duration</span>
                        <span className="text-sm font-bold font-mono text-cyan-400">
                          {preProjReport.recommendedDays ? `${preProjReport.recommendedDays} Days` : "N/A"}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Optimal Crew Size: {preProjReport.workforceNeeded || "N/A"} Workers</span>
                      </div>
                    </div>

                    {/* Quantity Takeoff Table */}
                    <div className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Engineering Quantity Takeoff (BOQ Estimate)</h4>
                      <table className="w-full text-left text-[11px] text-slate-300">
                        <thead>
                          <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-mono">
                            <th className="pb-1.5 font-semibold">Material / Parameter</th>
                            <th className="pb-1.5 font-semibold text-right">Qty</th>
                            <th className="pb-1.5 font-semibold text-right">Rate</th>
                            <th className="pb-1.5 font-semibold text-right">Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-800/40">
                            <td className="py-2 text-slate-400">Est. Concrete Volume (RCC)</td>
                            <td className="py-2 text-right font-mono text-white">{preProjReport.concreteVolume ? `${preProjReport.concreteVolume.toLocaleString()} m³` : "N/A"}</td>
                            <td className="py-2 text-right font-mono text-slate-400">₹{(preProjReport.concreteRate || 6800).toLocaleString("en-IN")}/m³</td>
                            <td className="py-2 text-right font-mono text-white">₹{preProjReport.concreteVolume ? (preProjReport.concreteVolume * (preProjReport.concreteRate || 6800)).toLocaleString("en-IN") : "N/A"}</td>
                          </tr>
                          <tr className="border-b border-slate-800/40">
                            <td className="py-2 text-slate-400">Est. Reinforcement Steel Weight</td>
                            <td className="py-2 text-right font-mono text-white">{preProjReport.steelTonnage ? `${preProjReport.steelTonnage.toFixed(2)} Tons` : "N/A"}</td>
                            <td className="py-2 text-right font-mono text-slate-400">₹{(preProjReport.steelRate || 78000).toLocaleString("en-IN")}/Ton</td>
                            <td className="py-2 text-right font-mono text-white">₹{preProjReport.steelTonnage ? (preProjReport.steelTonnage * (preProjReport.steelRate || 78000)).toLocaleString("en-IN") : "N/A"}</td>
                          </tr>
                          <tr className="border-b border-slate-800/40">
                            <td className="py-2 text-slate-400">Conceptual Masonry Factor (Est.)</td>
                            <td className="py-2 text-right font-mono text-white">{preProjReport.masonryVolume ? `${preProjReport.masonryVolume.toLocaleString()} m³` : "N/A"}</td>
                            <td className="py-2 text-right font-mono text-slate-400">₹{(preProjReport.masonryRate || 4800).toLocaleString("en-IN")}/m³</td>
                            <td className="py-2 text-right font-mono text-white">₹{preProjReport.masonryVolume ? (preProjReport.masonryVolume * (preProjReport.masonryRate || 4800)).toLocaleString("en-IN") : "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Cost Breakdown Details */}
                    <div className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Structural Cost Breakdown (INR)</h4>
                      <div className="space-y-1.5 text-[11px] text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">1. Structural Works (50%):</span>
                          <span className="font-mono text-white">₹{preProjReport.structuralCost?.toLocaleString("en-IN") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">2. MEP Layout Install (18%):</span>
                          <span className="font-mono text-white">₹{preProjReport.mepCost?.toLocaleString("en-IN") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">3. Finishes & Masonry (27%):</span>
                          <span className="font-mono text-white">₹{preProjReport.finishingCost?.toLocaleString("en-IN") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">4. Contingency & Supervision (5%):</span>
                          <span className="font-mono text-white">₹{preProjReport.contingencyCost?.toLocaleString("en-IN") || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location-Based Budget Model Comparison Grid */}
                    {preProjReport.locationAnalysis && (
                      <div className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-pulse" /> Location Cost & Feasibility Comparison Grid
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[10px] text-slate-350 border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-[9px] text-slate-500 uppercase font-mono">
                                <th className="pb-2 font-semibold">Location Zone</th>
                                <th className="pb-2 font-semibold text-right">Rate/sqft</th>
                                <th className="pb-2 font-semibold text-right">Est. Cost</th>
                                <th className="pb-2 font-semibold text-right text-yellow-405 text-yellow-400">Feas. Score</th>
                                <th className="pb-2 font-semibold text-right">Budget Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {preProjReport.locationAnalysis.map((loc: any, idx: number) => {
                                const isSelected = loc.locationType === preProjReport.locationType;
                                return (
                                  <tr 
                                    key={idx} 
                                    className={`border-b border-slate-805 border-slate-800/40 transition-colors ${
                                      isSelected ? "bg-yellow-500/10 text-white font-bold border-l-2 border-yellow-500 pl-1" : "hover:bg-slate-800/20 text-slate-400"
                                    }`}
                                  >
                                    <td className="py-2.5 font-medium flex items-center gap-1.5 pl-1.5">
                                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shrink-0"></span>}
                                      {loc.locationType}
                                    </td>
                                    <td className="py-2.5 text-right font-mono text-slate-300">₹{loc.ratePerSqft.toLocaleString("en-IN")}</td>
                                    <td className="py-2.5 text-right font-mono text-white">₹{(loc.estimatedCost / 10000000).toFixed(2)} Cr</td>
                                    <td className="py-2.5 text-right font-mono font-bold text-yellow-405 text-yellow-400">{loc.feasibilityScore}/100</td>
                                    <td className="py-2.5 text-right text-[9px] text-slate-450 max-w-[120px] truncate">{loc.budgetStatus}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="text-[9px] text-slate-500 pt-1 leading-relaxed border-t border-slate-850">
                          * Practical Budget Ranges: Rural/Village (₹12.5–13.5 Cr), Small Town (₹14.5–15.5 Cr), District HQ (₹16.5–18.0 Cr), Highway Zone (₹19.0–21.0 Cr), Tier-1 City (₹22.0–24.0 Cr), Premium Metro (₹24.0–27.0 Cr).
                        </div>
                      </div>
                    )}

                    {/* Transparent Scheduling Math */}
                    <div className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Scheduling Productivity Math</h4>
                      <div className="text-[10px] text-slate-400 leading-relaxed space-y-2 font-sans">
                        <div>
                          <strong>Total Labor Hours:</strong> {preProjReport.builtUpAreaSqft ? `${(Math.round(preProjReport.builtUpAreaSqft * 1.115)).toLocaleString()} Hours` : (preProjReport.builtUpArea ? `${(Math.round(preProjReport.builtUpArea * 12)).toLocaleString()} Hours` : "N/A")}
                          <span className="text-[9px] block text-slate-550 text-slate-500">(Built-up Area × 1.115 hours/sqft baseline)</span>
                        </div>
                        <div className="pt-1 border-t border-slate-800/60">
                          <strong>Duration Formula:</strong>
                          <span className="text-[10px] font-mono text-yellow-500 block mt-0.5">
                            Days = Total Hours / (Crew Size × 8 hrs × 85% efficiency)
                          </span>
                          <span className="text-[10px] font-mono text-slate-300 block mt-1">
                            Planned Crew ({preProjStaff || 10} workers): <br />
                            Days = {preProjReport.builtUpAreaSqft ? Math.round(preProjReport.builtUpAreaSqft * 1.115).toLocaleString() : (preProjReport.builtUpArea ? Math.round(preProjReport.builtUpArea * 12).toLocaleString() : "N/A")} / ({preProjStaff || 10} × 8 × 0.85) = <strong>{preProjReport.estimatedDays} Days</strong>
                          </span>
                          <span className="text-[10px] font-mono text-slate-300 block mt-1.5">
                            Recommended Crew ({preProjReport.workforceNeeded} workers): <br />
                            Days = {preProjReport.builtUpAreaSqft ? Math.round(preProjReport.builtUpAreaSqft * 1.115).toLocaleString() : (preProjReport.builtUpArea ? Math.round(preProjReport.builtUpArea * 12).toLocaleString() : "N/A")} / ({preProjReport.workforceNeeded} × 8 × 0.85) = <strong>{preProjReport.recommendedDays} Days</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Generative AI Engineering Advice:</span>
                      {preProjReport.suggestions.map((s: string, idx: number) => (
                        <div key={idx} className="p-3 bg-yellow-500/5 border border-yellow-500/15 text-yellow-400 rounded-xl text-[11px] leading-relaxed">
                          ⚡ {s}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSaveAndLaunchProject}
                      disabled={isSavingProject}
                      className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition shadow-md shadow-emerald-500/10 disabled:opacity-50"
                    >
                      {isSavingProject ? "Submitting to Chairman..." : "Create & Submit Project for Approval"}
                    </button>
                  </div>
                ) : (
                  <div className="h-64 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center text-slate-500 p-6">
                    <Bot className="h-8 w-8 text-slate-600 mb-2" />
                    <span>Provide project metrics and upload blueprints on the left to generate the AI Performance Estimation report.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "Settings" && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn text-xs">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Project Manager Configurations</h2>
                <p className="text-[10px] text-slate-400">Update corporate profile info and customize the metrics shown in the dashboard tables.</p>
              </div>

              {success && (
                <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-emerald-450 p-3 rounded-lg font-semibold text-emerald-400">
                  ✓ Profile configurations saved successfully in database.
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-slate-200">Account details</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400">Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Corporate Email</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Avatar Initials</label>
                      <input
                        type="text"
                        value={avatarInitials}
                        onChange={(e) => setAvatarInitials(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {selectedProject ? (
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 className="font-semibold text-slate-200">
                      Project Properties Overrides for <span className="text-yellow-400">{selectedProject.name}</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 italic">Editing these will save changes directly to the project database.</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-400">Project Name</label>
                        <input 
                          type="text" 
                          value={editProjName} 
                          onChange={(e) => setEditProjName(e.target.value)} 
                          className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-yellow-500 transition" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400">Location</label>
                        <input 
                          type="text" 
                          value={editProjLoc} 
                          onChange={(e) => setEditProjLoc(e.target.value)} 
                          className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-yellow-500 transition" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-400">Budget (₹)</label>
                        <input 
                          type="number" 
                          value={editProjBudget} 
                          onChange={(e) => setEditProjBudget(e.target.value)} 
                          className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-yellow-500 transition" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400">Status</label>
                        <select 
                          value={editProjStatus} 
                          onChange={(e) => setEditProjStatus(e.target.value)} 
                          className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none cursor-pointer focus:border-yellow-500 transition"
                        >
                          <option value="Planning">Planning</option>
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400">Floors</label>
                        <input 
                          type="number" 
                          value={editProjFloors} 
                          onChange={(e) => setEditProjFloors(e.target.value)} 
                          className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-yellow-500 transition" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400">Built-up Area (Sq.Ft)</label>
                        <input 
                          type="number" 
                          value={editProjArea} 
                          onChange={(e) => setEditProjArea(e.target.value)} 
                          className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-yellow-500 transition" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400">Planned Progress (%)</label>
                        <input 
                          type="number" 
                          min="0"
                          max="100"
                          value={editProjPlanned} 
                          onChange={(e) => setEditProjPlanned(e.target.value)} 
                          className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-yellow-500 transition" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400">Actual Progress (%)</label>
                        <input 
                          type="number" 
                          min="0"
                          max="100"
                          value={editProjActual} 
                          onChange={(e) => setEditProjActual(e.target.value)} 
                          className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-yellow-500 transition" 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                      <h3 className="font-semibold text-slate-200">Dashboard Metrics overrides</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">Project Value</label>
                          <input type="text" value={projectValue} onChange={(e) => setProjectValue(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Progress</label>
                          <input type="text" value={progressVal} onChange={(e) => setProgressVal(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Budget Used</label>
                          <input type="text" value={budgetUsed} onChange={(e) => setBudgetUsed(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">Profit Margin</label>
                          <input type="text" value={profitMargin} onChange={(e) => setProfitMargin(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Pending Approvals</label>
                          <input type="text" value={pendingApprovals} onChange={(e) => setPendingApprovals(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Delay Risk</label>
                          <input type="text" value={delayRisk} onChange={(e) => setDelayRisk(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">Total Project Budget</label>
                          <input type="text" value={budgetValueProject} onChange={(e) => setBudgetValueProject(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Approved Limit</label>
                          <input type="text" value={budgetValueApproved} onChange={(e) => setBudgetValueApproved(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Actual Spendings</label>
                          <input type="text" value={budgetValueActual} onChange={(e) => setBudgetValueActual(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                      <h3 className="font-semibold text-slate-200">Shell controls</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-slate-400">Sidebar navigation items (split by pipe |)</label>
                          <input type="text" value={sidebarMenus} onChange={(e) => setSidebarMenus(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">AI Assistant suggestion chips (split by pipe |)</label>
                          <input type="text" value={aiSuggestions} onChange={(e) => setAiSuggestions(e.target.value)} className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-slate-950 px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition">
                    <Save className="h-4 w-4" /> Save configurations
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Apply for Leave Modal */}
          {showLeaveModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-[#0F182A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Apply for Leave</h3>
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleApplyLeave} className="p-5 space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">Leave Type</label>
                    <select
                      value={leaveForm.leaveType}
                      onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500 text-xs"
                    >
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Earned Leave">Earned Leave</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">Duration / Dates</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Days (02 Jun - 06 Jun)"
                      value={leaveForm.duration}
                      onChange={(e) => setLeaveForm({ ...leaveForm, duration: e.target.value })}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-semibold">Reason for Request</label>
                    <textarea
                      placeholder="Provide a reason for the leave application..."
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                      rows={3}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500 text-xs resize-none"
                      required
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowLeaveModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition border border-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 text-slate-950 font-bold px-4 py-2 rounded-lg hover:brightness-110 transition shadow-md shadow-yellow-500/10"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
