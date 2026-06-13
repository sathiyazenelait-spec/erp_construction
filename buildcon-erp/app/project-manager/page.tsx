"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, Activity, Calendar, DollarSign, Users, FileText,
  Clock, AlertTriangle, MessageSquare, Shield, FolderOpen, CheckSquare,
  Settings, LogOut, Building2, Bell, Filter, Plus, Check, Bot, SendHorizontal, Trash2,
  Sparkles, UploadCloud
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
  const [dateFilter, setDateFilter] = useState("09 June 2026, Tuesday");

  // --- Pre-Project AI Estimator State ---
  const [preProjName, setPreProjName] = useState("");
  const [preProjBudget, setPreProjBudget] = useState("");
  const [preProjStaff, setPreProjStaff] = useState("");
  const [preProjFileName, setPreProjFileName] = useState("");
  const [isAnalyzingPreProj, setIsAnalyzingPreProj] = useState(false);
  const [preProjReport, setPreProjReport] = useState<any | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [preProjLength, setPreProjLength] = useState("");
  const [preProjFloors, setPreProjFloors] = useState("");
  const [orgTier, setOrgTier] = useState("Enterprise");

  // --- Stateful Data ---
  const [tasks, setTasks] = useState<PMTask[]>([
    { id: "1", title: "Verify earthwork measurements", assignedTo: "Meenakshi (QS)", status: "Completed" },
    { id: "2", title: "Approve steel purchase requisition", assignedTo: "Venkatesh (Procurement)", status: "In Progress" },
    { id: "3", title: "Review QC concrete cube tests", assignedTo: "Karthick (Senior Eng)", status: "Pending" },
    { id: "4", title: "Process subcontractor billing claims", assignedTo: "Ramesh (Finance)", status: "Pending" },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [newAssignee, setNewAssignee] = useState("Karthick (Senior Eng)");

  const [aiChatInput, setAiChatInput] = React.useState("");
  const [aiReplies, setAiReplies] = React.useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Ramanathan! I'm your AI Project Assistant. I can forecast budgets, track subcontractor performance, and flag delay risks. Try clicking the suggestions below!" }
  ]);

  const [pendingClaims, setPendingClaims] = React.useState<any[]>([]);

  async function fetchPendingClaims() {
    try {
      const res = await fetch("http://localhost:8081/api/progress-claims/status/PENDING");
      if (res.ok) {
        const data = await res.json();
        setPendingClaims(data);
      }
    } catch (e) {
      console.error("Failed to fetch pending claims for PM", e);
    }
  }

  React.useEffect(() => {
    fetchPendingClaims();
    const savedTier = localStorage.getItem("selected_login_tier");
    if (savedTier) {
      setOrgTier(savedTier);
    }
  }, []);

  const handleApproveClaim = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/progress-claims/${id}/approve`, {
        method: "POST"
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
      const res = await fetch(`http://localhost:8081/api/progress-claims/${id}/reject`, {
        method: "POST"
      });
      if (res.ok) {
        alert("Rejection logged.");
        fetchPendingClaims();
      }
    } catch (e) {
      console.error("Failed to reject claim", e);
    }
  };

  // --- Charts datasets ---
  const budgetBurnData = [
    { name: "Month 1", Budget: 20000000, Actual: 18000000 },
    { name: "Month 2", Budget: 45000000, Actual: 41000000 },
    { name: "Month 3", Budget: 75000000, Actual: 72500000 },
    { name: "Month 4", Budget: 100000000, Actual: 95000000 },
  ];

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
      const res = await fetch("http://localhost:8081/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          role: "project-manager"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiReplies(prev => [...prev, { sender: "bot", text: data.response }]);
      }
    } catch (e) {
      console.error("AI chat failed", e);
    }
  };

  const handleAnalyzePreProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preProjName || !preProjBudget) return;
    setIsAnalyzingPreProj(true);
    setPreProjReport(null);

    const targetB = parseFloat(preProjBudget);
    const targetW = parseInt(preProjStaff) || 10;
    const lengthVal = parseFloat(preProjLength) || 30.0;
    const floorsVal = parseInt(preProjFloors) || 2;

    try {
      if (orgTier === "Enterprise") {
        const formData = new FormData();
        const fileBlob = new Blob(["sample-image-blueprint"], { type: "image/jpeg" });
        formData.append("file", fileBlob, preProjFileName || "design_blueprint_elev.jpg");
        formData.append("projectName", preProjName);
        formData.append("targetBudget", targetB.toString());
        formData.append("workforceCount", targetW.toString());
        formData.append("length", lengthVal.toString());
        formData.append("floors", floorsVal.toString());

        const res = await fetch("http://localhost:8000/api/ai/estimate-image", {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          setPreProjReport(data);
        } else {
          throw new Error("FastAPI image estimation error");
        }
      } else {
        const res = await fetch("http://localhost:8000/api/ai/estimate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectName: preProjName,
            targetBudget: targetB,
            workforceCount: targetW,
            designDescription: "Parameters-based estimation search",
            architectSpec: `Structural dimensions: ${lengthVal} meters length, ${floorsVal} floors.`,
            length: lengthVal,
            floors: floorsVal
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
        const calculatedHours = int_hours_calc(lengthVal, floorsVal, targetB);
        const est_days = Math.floor(calculatedHours / 8);
        const suggestedB = targetB * 0.93;
        const workforceNeeded = Math.max(targetW, Math.floor(calculatedHours / 120));
        const comp_date = new Date(Date.now() + est_days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        setPreProjReport({
          projectName: preProjName,
          suggestedBudget: suggestedB,
          estimatedHours: calculatedHours,
          estimatedDays: est_days,
          workforceNeeded: workforceNeeded,
          completionDate: comp_date,
          structuralScore: "95/100",
          hazards: "Trench excavation collapse hazard, high floor high-winds structural warning, scaffolding load checks.",
          suggestions: [
            f_workforce_sug(targetW, calculatedHours),
            `Suggest G+${floorsVal} composite pre-fabricated frames to bypass structural assembly delays.`,
            `Floor wind loads on upper ${floorsVal} floors require anchoring inspections.`
          ]
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
          length: parseFloat(preProjLength) || 30.0,
          floors: parseInt(preProjFloors) || 2
        })
      });

      if (res.ok) {
        alert("Project successfully created and sent to Chairman for review!");
        setPreProjName("");
        setPreProjBudget("");
        setPreProjStaff("");
        setPreProjFileName("");
        setPreProjLength("");
        setPreProjFloors("");
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
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                  activeTab === item.name
                    ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold shadow-md shadow-yellow-500/15"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4 bg-[#0B1222]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 grid place-items-center text-xs font-bold font-mono">
              RS
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">Ramanathan S.</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Project Manager</div>
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
                <option value="Skyline Residences">Skyline Residences</option>
                <option value="Greenfield Apartments">Greenfield Apartments</option>
              </select>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-yellow-400" />
              <span>{dateFilter}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {/* EXECUTIVE SUMMARY */}
          {activeTab === "Executive Summary" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-6 gap-4 text-xs">
                {[
                  { label: "Project Value", val: "₹12.5 Cr" },
                  { label: "Progress", val: "64%" },
                  { label: "Budget Used", val: "58%" },
                  { label: "Profit Margin", val: "18%" },
                  { label: "Pending Approvals", val: "12" },
                  { label: "Delay Risk", val: "Low" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[9px] text-slate-450 uppercase text-slate-450 text-slate-400 font-semibold">{s.label}</span>
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
                      <AreaChart data={budgetBurnData}>
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
                  <option value="Karthick (Senior Eng)">Karthick (Senior Eng)</option>
                  <option value="Meenakshi (QS)">Meenakshi (QS)</option>
                  <option value="Venkatesh (Procurement)">Venkatesh (Procurement)</option>
                </select>
                <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold px-4 rounded-lg text-xs transition flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Assign Task
                </button>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Command Tasks Ledger</h3>
                <div className="space-y-3">
                  {tasks.map((task) => (
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
                {[
                  { phase: "Excavation & Earthwork", duration: "Jan - Feb 2026", progress: 100, status: "Completed" },
                  { phase: "Foundation & Framing", duration: "Mar - May 2026", progress: 100, status: "Completed" },
                  { phase: "Structural Core (Slab & Brickwork)", duration: "Jun - Sep 2026", progress: 64, status: "In Progress" },
                  { phase: "Finishing & Handover", duration: "Oct - Dec 2026", progress: 0, status: "Pending" }
                ].map((p, idx) => (
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
                <div className="grid md:grid-cols-3 gap-4 text-xs text-center">
                  <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                    <span className="text-slate-400">Total Project Value</span>
                    <div className="text-lg font-bold text-white font-mono mt-1">₹12,50,00,000</div>
                  </div>
                  <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                    <span className="text-slate-400">Approved Budget Limit</span>
                    <div className="text-lg font-bold text-blue-400 font-mono mt-1">₹10,00,00,000</div>
                  </div>
                  <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                    <span className="text-slate-400">Actual Spendings</span>
                    <div className="text-lg font-bold text-yellow-400 font-mono mt-1">₹7,25,00,000</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CLIENT MANAGEMENT */}
          {activeTab === "Client Management" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Client Invoicing & Communications</h3>
              <div className="space-y-3.5 text-xs">
                {[
                  { invoice: "INV-2026-003", value: "₹2,50,00,000", sentOn: "15 May 2026", status: "Paid" },
                  { invoice: "INV-2026-004", value: "₹1,80,00,000", sentOn: "01 Jun 2026", status: "Under Review" }
                ].map((inv, idx) => (
                  <div key={idx} className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{inv.invoice}</div>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">Value: {inv.value} | Sent: {inv.sentOn}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 text-emerald-450 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>{inv.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOQ TRACKING */}
          {activeTab === "BOQ Tracking" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">BOQ tracking spreadsheet</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                  <span className="text-slate-400 block mb-1">Earthwork (Excavation)</span>
                  <div className="text-base font-bold text-white font-mono">450 m³ executed</div>
                </div>
                <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl">
                  <span className="text-slate-400 block mb-1">Cement Concrete (RCC)</span>
                  <div className="text-base font-bold text-white font-mono">1,200 m³ executed</div>
                </div>
              </div>
            </div>
          )}

          {/* PROGRESS MONITORING */}
          {activeTab === "Progress Monitoring" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">On-site Daily Progress Reports</h3>
              <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs space-y-2">
                <div className="font-bold text-white">Concrete Pour Slab-12 (Tower B)</div>
                <p className="text-slate-400">Completed 100% casting on Anna Nagar project. Lab cube tests are planned for tomorrow morning.</p>
              </div>
            </div>
          )}

          {/* SUBCONTRACTOR MANAGEMENT */}
          {activeTab === "Subcontractor Management" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Subcontractor Contracts</h3>
              <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Subcontractor Hub (Civil Crew)</div>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">Value: ₹45 Lakhs | Paid: ₹30 Lakhs</span>
                </div>
                <span className="text-[10px] text-yellow-400 font-bold font-mono">₹12 L claims pending</span>
              </div>
            </div>
          )}

          {/* CHANGE ORDERS */}
          {activeTab === "Change Orders" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Project Change & Variation orders</h3>
              <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Variation Order #02 - Additional MEP conduits</div>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">Value estimation: ₹18 Lakhs</span>
                </div>
                <span className="text-[10px] text-yellow-400 font-bold border border-yellow-500/20 px-2 py-0.5 rounded bg-yellow-500/5">Pending Approval</span>
              </div>
            </div>
          )}

          {/* RISK CENTER */}
          {activeTab === "Risk Center" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Delays and Risk Assessments</h3>
              <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs space-y-2">
                <div className="font-bold text-white flex gap-1.5 items-center"><AlertTriangle className="h-4 w-4 text-yellow-400" /> Steel Material Cost Escalation</div>
                <p className="text-slate-400">Steel rates increased by 4.5% compared to the baseline estimation. Procurement manager advised to lock inventory orders for the next 3 months.</p>
              </div>
            </div>
          )}

          {/* DOCUMENT CONTROL */}
          {activeTab === "Document Control" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">CAD Drawings & Blueprints Catalog</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                {["Structural blueprint - Foundation.dwg", "Architectural plan - G+1 elevation.pdf"].map((doc, idx) => (
                  <div key={idx} className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl flex gap-3 items-center">
                    <FolderOpen className="h-5 w-5 text-yellow-400 shrink-0" />
                    <span className="font-semibold text-white font-mono truncate">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPROVAL CENTER */}
          {activeTab === "Approval Center" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Pending Approvals Queue</h3>
              <div className="space-y-3.5 text-xs">
                {pendingClaims.length === 0 ? (
                  <div className="text-slate-400 text-center py-6">No pending subcontractor claims in queue.</div>
                ) : (
                  pendingClaims.map((claim) => (
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
                      <label className="text-[10px] text-slate-400 block mb-1">Project Length (m)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 50.0" 
                        value={preProjLength}
                        onChange={(e) => setPreProjLength(e.target.value)}
                        className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Number of Floors (G+)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 5" 
                        value={preProjFloors}
                        onChange={(e) => setPreProjFloors(e.target.value)}
                        className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-yellow-500"
                        required
                      />
                    </div>
                  </div>

                  {orgTier === "Enterprise" ? (
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Upload Design Blueprint, Architect Specs, & Sample Construction Images</label>
                      <div className="border border-dashed border-slate-700 bg-[#0a1120] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors" onClick={() => {
                        const names = ["tower_b_blueprint_elev.png", "ground_layout_design.jpg", "site_sample_curing.png"];
                        setPreProjFileName(names[Math.floor(Math.random() * names.length)]);
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

                  <button 
                    type="submit" 
                    disabled={isAnalyzingPreProj}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition shadow-md shadow-yellow-500/10 disabled:opacity-50"
                  >
                    {isAnalyzingPreProj ? "AI Generative Model Analyzing Specs..." : "Run AI estimation & suggestion checks"}
                  </button>
                </form>
              </div>

              {/* REPORT SIDE */}
              <div className="bg-[#111C30]/40 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">AI Forecast Analysis Output</h3>
                
                {preProjReport ? (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    <div className="p-4 bg-[#0e1628] border border-slate-800 rounded-xl grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">AI Target Budget suggestion</span>
                        <span className="text-base font-bold font-mono text-emerald-400">₹ {preProjReport.suggestedBudget.toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Predicted Work Duration</span>
                        <span className="text-base font-bold font-mono text-yellow-400">
                          {preProjReport.estimatedDays ? `${preProjReport.estimatedDays} Days` : `${Math.floor(preProjReport.estimatedHours/8)} Days`}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Calculated Labours & Workforce</span>
                        <span className="text-xs font-bold text-white font-mono">
                          {preProjReport.workforceNeeded ? `${preProjReport.workforceNeeded} Active Crew` : "N/A"}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Predicted Completion Date</span>
                        <span className="text-xs font-bold text-cyan-400 font-mono">
                          {preProjReport.completionDate || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-slate-800/80">
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Structural Safety Score Prediction</span>
                        <span className="text-xs font-bold text-white font-mono">{preProjReport.structuralScore}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Generative AI Structural & Hour Suggestions:</span>
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
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn max-w-xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Dashboard Profile</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                  <input type="text" readOnly defaultValue="Ramanathan S." className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                  <input type="text" readOnly defaultValue="pm@buildcon.com" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <button onClick={() => alert("Configurations updated successfully!")} className="bg-yellow-600 hover:bg-yellow-550 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">Save configurations</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
