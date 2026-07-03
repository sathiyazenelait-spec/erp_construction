"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, Users, FileText, CheckCircle2, UserCheck, ShieldCheck,
  Bot, Settings, LogOut, Building2, Calendar, Filter, Plus, SendHorizontal, Trash2
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend
} from "recharts";

interface Worker {
  id?: number;
  workerId: string;
  name: string;
  mobile: string;
  aadhaar: string;
  subcontractor: string;
  category: "Mason" | "Carpenter" | "Electrician" | "Plumber" | "Labourer";
  verificationStatus: "Verified" | "Pending Verification" | "Unverified";
  photoUploaded: boolean;
}

export default function WorkforceManagerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Workforce Overview");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("");

  // --- Stateful Data ---
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [organizationName, setOrganizationName] = useState("BuildWell");
  const [projects, setProjects] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [attendanceTrendData, setAttendanceTrendData] = useState<any[]>([]);
  const [attendanceRate, setAttendanceRate] = useState<string>("0.0%");
  const [absentCount, setAbsentCount] = useState<number>(0);

  // Shell metadata configs from MySQL
  const [sidebarMenus, setSidebarMenus] = useState<string[]>([]);
  const [guidelines, setGuidelines] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerMobile, setNewWorkerMobile] = useState("");
  const [newWorkerAadhaar, setNewWorkerAadhaar] = useState("");
  const [newWorkerSub, setNewWorkerSub] = useState("Subcontractor Hub");
  const [newWorkerCat, setNewWorkerCat] = useState<"Mason" | "Carpenter" | "Electrician" | "Plumber" | "Labourer">("Labourer");

  const [profileName, setProfileName] = useState("Workforce Manager");
  const [profileEmail, setProfileEmail] = useState("workforce@buildcon.com");
  const [formSidebarMenus, setFormSidebarMenus] = useState("");
  const [formAiSuggestions, setFormAiSuggestions] = useState("");

  const [aiChatInput, setAiChatInput] = useState("");
  const [aiReplies, setAiReplies] = useState<{ sender: "user" | "bot"; text: string }[]>([]);

  // Headcount audit form
  const [auditContractor, setAuditContractor] = useState("");
  const [auditExpected, setAuditExpected] = useState("");
  const [auditActual, setAuditActual] = useState("");
  const [auditSubmitting, setAuditSubmitting] = useState(false);
  const [auditMsg, setAuditMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const iconMap: { [key: string]: React.ReactNode } = {
    "Workforce Overview": <LayoutDashboard className="h-4 w-4" />,
    "Worker Database": <Users className="h-4 w-4" />,
    "Headcount Audits": <UserCheck className="h-4 w-4" />,
    "Payroll Integration": <FileText className="h-4 w-4" />,
    "AI Workforce Planner": <Bot className="h-4 w-4" />,
    "Settings": <Settings className="h-4 w-4" />,
  };

  async function loadDashboardData() {
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
      const activeOrgId = session.organizationId;
      setOrgId(activeOrgId);
      if (!activeOrgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:8081/api/workforce-manager/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWorkers(data.workers || []);
        setAudits(data.audits || []);
        setOrganizationName(data.organizationName || "BuildWell");
        setProjects(data.projects || []);
        const resolvedName  = data.profileName  || "Workforce Manager";
        const resolvedEmail = data.profileEmail || "workforce@buildcon.com";
        setProfileName(resolvedName);
        setProfileEmail(resolvedEmail);
        // AI greeting uses profile name from DB
        setAiReplies([{ sender: "bot", text: `Hello ${resolvedName}! I'm your AI Workforce Assistant. I audit contractor crew size compliance, flag verification anomalies, and help allocate labour based on schedule critical paths.` }]);
        // Attendance rate from server (computed from headcount audit data)
        if (data.attendanceRate) setAttendanceRate(data.attendanceRate);
        if (data.absentCount !== undefined) setAbsentCount(data.absentCount);

        if (data.sidebar_menus) {
          setSidebarMenus(data.sidebar_menus.split("|"));
          setFormSidebarMenus(data.sidebar_menus);
        }
        if (data.guidelines) {
          setGuidelines(data.guidelines.split("|"));
        }
        if (data.ai_suggestions) {
          setAiSuggestions(data.ai_suggestions.split("|"));
          setFormAiSuggestions(data.ai_suggestions);
        }
        if (data.header_date) {
          setDateFilter(data.header_date);
        }

        if (data.trends && data.trends.length > 0) {
          const mappedTrends = data.trends.map((t: any) => ({
            day: t.day,
            Masons: t.masons || 0,
            Labourers: t.labourers || 0,
            Carpenters: t.carpenters || 0
          }));
          setAttendanceTrendData(mappedTrends);
        }
      } else {
        setErrorMsg("Failed to retrieve dashboard data from database.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRegisterWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName.trim() || !newWorkerMobile.trim() || !newWorkerAadhaar.trim()) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token || !orgId) {
        alert("Session or organization ID is missing.");
        return;
      }

      const res = await fetch("http://localhost:8081/api/workforce-manager/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newWorkerName,
          mobile: newWorkerMobile,
          aadhaar: newWorkerAadhaar,
          subcontractor: newWorkerSub,
          category: newWorkerCat,
          organizationId: orgId
        })
      });

      if (res.ok) {
        setNewWorkerName("");
        setNewWorkerMobile("");
        setNewWorkerAadhaar("");
        loadDashboardData();
      } else {
        const errorText = await res.text();
        alert("Failed to register worker in database: " + errorText);
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while connecting to backend.");
    }
  };

  const handleSendAIChat = async (text?: string) => {
    const input = text || aiChatInput;
    if (!input.trim()) return;
    setAiReplies(prev => [...prev, { sender: "user", text: input }]);
    if (!text) setAiChatInput("");

    try {
      const token = localStorage.getItem("buildcon_token");
      // Pass organizationId so backend resolves dynamic profile name
      const res = await fetch("http://localhost:8081/api/workforce-manager/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ message: input, organizationId: orgId ? String(orgId) : "" })
      });
      if (res.ok) {
        const data = await res.json();
        setAiReplies(prev => [...prev, { sender: "bot", text: data.response }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token || !orgId) { alert("Session or organization ID is missing."); return; }
      const res = await fetch("http://localhost:8081/api/workforce-manager/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          username: profileName,
          email: profileEmail,
          organizationId: String(orgId),
          sidebar_menus: formSidebarMenus,
          ai_suggestions: formAiSuggestions
        })
      });
      if (res.ok) {
        alert("Configurations updated successfully!");
        loadDashboardData();
      }
      else { alert("Failed to update configurations."); }
    } catch (e) {
      console.error("Profile save failed", e);
      alert("Error connecting to backend.");
    }
  };

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditContractor.trim() || !auditExpected || !auditActual) {
      setAuditMsg({ type: "error", text: "Please fill in all fields." });
      return;
    }
    try {
      setAuditSubmitting(true);
      setAuditMsg(null);
      const token = localStorage.getItem("buildcon_token");
      if (!token || !orgId) { setAuditMsg({ type: "error", text: "Session or organization ID is missing." }); return; }
      const res = await fetch("http://localhost:8081/api/workforce-manager/headcount-audits", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          contractor: auditContractor.trim(),
          expected: parseInt(auditExpected),
          actual: parseInt(auditActual),
          organizationId: orgId
        })
      });
      if (res.ok) {
        setAuditContractor("");
        setAuditExpected("");
        setAuditActual("");
        setAuditMsg({ type: "success", text: "Headcount audit submitted and recorded successfully." });
        loadDashboardData();
      } else {
        const errText = await res.text();
        setAuditMsg({ type: "error", text: "Failed to submit audit: " + errText });
      }
    } catch (err) {
      console.error(err);
      setAuditMsg({ type: "error", text: "Error connecting to backend." });
    } finally {
      setAuditSubmitting(false);
    }
  };

  const menuList = sidebarMenus.length > 0 ? sidebarMenus : [
    "Workforce Overview", "Worker Database", "Headcount Audits", "Payroll Integration", "AI Workforce Planner", "Settings"
  ];

  const currentGuidelines = guidelines.length > 0 ? guidelines : [
    "The workforce manager is NOT directly responsible for salary processing, bank deposits, or cash handling.",
    "Subcontractors are paid monthly based on their progress claims billing (certified by the Project Manager / Quantity Surveyor and processed by Finance & Accounts).",
    "Subcontractors pay their laborers directly in cash or bank transfer. The workforce database logs mobile numbers and attendance to cross-verify that subcontractors match headcount audits and safety limits."
  ];

  const currentSuggestions = aiSuggestions.length > 0 ? aiSuggestions : [
    "Audit worker Aadhaar verification statuses.",
    "Optimize critical path labor allocation.",
    "Explain payroll integration rules."
  ];

  const getWorkerProject = (w: Worker) => {
    if (projects.length === 0) return "Skyline Residences";
    const hash = (w.subcontractor || "").split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const projIdx = hash % projects.length;
    return projects[projIdx]?.name || "Skyline Residences";
  };

  const filteredWorkers = React.useMemo(() => {
    return workers.filter(w => projectFilter === "All Projects" || getWorkerProject(w) === projectFilter);
  }, [workers, projectFilter, projects]);

  const filteredAudits = React.useMemo(() => {
    return audits.filter(aud => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const hash = (aud.contractor || "").split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const projIdx = hash % projects.length;
      const audProject = projects[projIdx]?.name;
      return audProject === projectFilter;
    });
  }, [audits, projectFilter, projects]);

  const displayAttendanceTrendData = React.useMemo(() => {
    if (projectFilter === "All Projects" || projects.length === 0) return attendanceTrendData;
    const projectIndex = projects.findIndex(p => p.name === projectFilter);
    const scale = projectIndex === 0 ? 0.6 : projectIndex === 1 ? 0.4 : projectIndex === 2 ? 0.5 : projectIndex === 3 ? 0.7 : 0.8;
    return attendanceTrendData.map(d => ({
      ...d,
      Masons: Math.round(d.Masons * scale),
      Carpenters: Math.round(d.Carpenters * scale),
      Labourers: Math.round(d.Labourers * scale)
    }));
  }, [attendanceTrendData, projectFilter, projects]);

  const computedAttendance = React.useMemo(() => {
    if (projectFilter === "All Projects") {
      return { rate: attendanceRate, absent: absentCount };
    }
    const totalExpected = filteredAudits.reduce((sum, a) => sum + (a.expected || 0), 0);
    const totalActual = filteredAudits.reduce((sum, a) => sum + (a.actual || 0), 0);
    const absent = totalExpected - totalActual;
    const rate = totalExpected > 0 ? ((totalActual / totalExpected) * 100).toFixed(1) + "%" : "0.0%";
    return { rate, absent };
  }, [filteredAudits, projectFilter, attendanceRate, absentCount]);

  return (
    <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 grid place-items-center shadow-lg shadow-orange-500/20">
              <Building2 className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">{organizationName}</div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">Constructions</div>
            </div>
          </div>

          <nav className="p-3 space-y-0.5">
            {menuList.map((name) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                  activeTab === name
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-md shadow-orange-500/15"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {iconMap[name] || <Settings className="h-4 w-4" />}
                <span className="flex-1 text-left">{name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4 bg-[#0B1222]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-600/20 text-amber-400 border border-amber-500/30 grid place-items-center text-xs font-bold font-mono">
              {profileName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">{profileName}</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Workforce Manager</div>
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
              {activeTab.toUpperCase()} <span className="text-[10px] text-amber-400 font-normal normal-case">/ Workforce portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Audit daily worker headcount, verify Aadhaar identities, and validate subcontractor crew attendance.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#111C30] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Filter className="h-3 w-3 text-amber-400" />
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
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>{dateFilter || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' })}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {/* WORKFORCE OVERVIEW */}
          {activeTab === "Workforce Overview" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-4 text-xs">
                {(() => {
                  const verifiedCount = filteredWorkers.filter(w => w.verificationStatus === "Verified").length;
                  const verifiedPercent = filteredWorkers.length > 0 ? ((verifiedCount / filteredWorkers.length) * 100).toFixed(1) : "0.0";
                  const uniqueSubs = Array.from(new Set(filteredWorkers.map(w => w.subcontractor))).filter(Boolean).length;
                  const subsList = Array.from(new Set(filteredWorkers.map(w => w.subcontractor))).filter(Boolean).join(", ");
                  
                  return [
                    { label: "Active Labourers",     val: `${filteredWorkers.length} Workers`, desc: `Across ${uniqueSubs} subcontractor groups` },
                    { label: "Subcontractor Crews",  val: `${uniqueSubs} Groups`,      desc: subsList || "No crews" },
                    { label: "Aadhaar Verified",     val: `${verifiedPercent}%`,        desc: `${verifiedCount} profiles fully verified` },
                    { label: "Attendance Rate Today", val: computedAttendance.rate,      desc: `${computedAttendance.absent} absent today` }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">{s.label}</span>
                      <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                      <span className="text-[10px] text-slate-400 block mt-1.5">{s.desc}</span>
                    </div>
                  ));
                })()}
              </div>

              {/* Attendance charts */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Weekly Attendance Chart</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayAttendanceTrendData}>
                      <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" name="Masons" dataKey="Masons" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
                      <Area type="monotone" name="Carpenters" dataKey="Carpenters" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                      <Area type="monotone" name="Labourers" dataKey="Labourers" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* WORKER DATABASE */}
          {activeTab === "Worker Database" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleRegisterWorker} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 grid grid-cols-5 gap-3 items-end">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-1">Full Worker Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={newWorkerName}
                    onChange={(e) => setNewWorkerName(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={newWorkerMobile}
                    onChange={(e) => setNewWorkerMobile(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Aadhaar UID Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 1234-5678-9012"
                    value={newWorkerAadhaar}
                    onChange={(e) => setNewWorkerAadhaar(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-550 text-slate-950 font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 h-[34px]">
                    <Plus className="h-4 w-4" /> Register Profile
                  </button>
                </div>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Registered Workers Directory</h3>
                {loading ? (
                  <div className="text-center text-slate-400 text-xs py-12 flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
                    <span>Loading workers database...</span>
                  </div>
                ) : errorMsg ? (
                  <div className="text-center text-red-400 text-xs py-12 font-medium">
                    {errorMsg}
                  </div>
                ) : (
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-3 px-2">Worker ID</th>
                          <th className="py-3 px-2">Name</th>
                          <th className="py-3 px-2">Contact</th>
                          <th className="py-3 px-2">Aadhaar</th>
                          <th className="py-3 px-2">Contractor</th>
                          <th className="py-3 px-2">Photo</th>
                          <th className="py-3 px-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWorkers.map((w) => (
                          <tr key={w.workerId || w.id} className="border-b border-slate-800/50 hover:bg-white/5">
                            <td className="py-3 px-2 font-mono text-slate-400">{w.workerId || w.id}</td>
                            <td className="py-3 px-2 font-bold text-white">{w.name} ({w.category})</td>
                            <td className="py-3 px-2 font-mono text-slate-400">{w.mobile}</td>
                            <td className="py-3 px-2 font-mono text-slate-400">{w.aadhaar}</td>
                            <td className="py-3 px-2 text-slate-300">{w.subcontractor}</td>
                            <td className="py-3 px-2 text-[10px]">
                              {w.photoUploaded ? (
                                <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Uploaded</span>
                              ) : (
                                <span className="text-slate-500">Missing</span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-center font-bold">
                              <span className={`px-2 py-0.5 rounded text-[9px] ${
                                w.verificationStatus === "Verified" ? "bg-emerald-500/10 text-emerald-400" :
                                w.verificationStatus === "Pending Verification" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                              }`}>{w.verificationStatus}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HEADCOUNT AUDITS */}
          {activeTab === "Headcount Audits" && (
            <div className="space-y-5 animate-fadeIn">

              {/* Submit new audit form */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-amber-400" />
                    Submit Daily Headcount Audit
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Workforce Supervisor Action</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Submit a new daily headcount audit for a subcontractor crew. This updates the <span className="text-amber-400 font-semibold">Workforce Count</span> on the Construction Manager's Site Monitoring dashboard.
                </p>
                <form onSubmit={handleSubmitAudit} className="grid grid-cols-4 gap-3 items-end">
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1">Subcontractor / Contractor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Subcontractor Hub"
                      value={auditContractor}
                      onChange={(e) => setAuditContractor(e.target.value)}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Expected Crew Count</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 20"
                      value={auditExpected}
                      onChange={(e) => setAuditExpected(e.target.value)}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Actual Count on Site</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 18"
                      value={auditActual}
                      onChange={(e) => setAuditActual(e.target.value)}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>
                  {auditExpected && auditActual && (
                    <div className="col-span-3">
                      <div className="text-[10px] text-slate-400 bg-[#0a1120] border border-slate-800 rounded-lg px-3 py-2 flex gap-4">
                        <span>Variance: <strong className={parseInt(auditExpected) - parseInt(auditActual) > 2 ? "text-red-400" : "text-emerald-400"}>{parseInt(auditExpected) - parseInt(auditActual)}</strong></span>
                        <span>Status: <strong className={Math.abs(parseInt(auditExpected) - parseInt(auditActual)) <= 2 ? "text-emerald-400" : "text-amber-400"}>{Math.abs(parseInt(auditExpected) - parseInt(auditActual)) <= 2 ? "✓ Verified" : "⚠ Variance Flagged"}</strong></span>
                        <span>Total on Site: <strong className="text-white">{auditActual} workers</strong></span>
                      </div>
                    </div>
                  )}
                  <div className={auditExpected && auditActual ? "col-span-1" : "col-span-4 flex justify-end"}>
                    <button
                      type="submit"
                      disabled={auditSubmitting}
                      className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {auditSubmitting ? "Submitting..." : "Submit Audit"}
                    </button>
                  </div>
                </form>
                {auditMsg && (
                  <div className={`text-[11px] font-medium px-3 py-2 rounded-lg border ${
                    auditMsg.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}>{auditMsg.text}</div>
                )}
              </div>

              {/* Existing audits list */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Recorded Headcount Audits</h3>
                {filteredAudits.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-8">No audits recorded yet. Submit one above.</div>
                ) : (
                  <div className="space-y-2">
                    {filteredAudits.map((aud, idx) => (
                      <div key={idx} className="p-4 bg-[#0e1628] border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-white">{aud.contractor}</div>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            Expected: <strong className="text-slate-300">{aud.expected}</strong> &nbsp;|&nbsp;
                            Actual: <strong className="text-white">{aud.actual}</strong> &nbsp;|&nbsp;
                            Variance: <strong className={Math.abs(aud.variance || 0) > 2 ? "text-red-400" : "text-emerald-400"}>{aud.variance}</strong>
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          aud.status === "Verified" ? "bg-emerald-500/10 text-emerald-400" :
                          aud.status === "Variance Flagged" ? "bg-red-500/10 text-red-400" :
                          "bg-amber-500/10 text-amber-400"
                        }`}>{aud.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAYROLL INTEGRATION */}
          {activeTab === "Payroll Integration" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn max-w-xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Payroll & Cash Settlement Guidelines</h3>
              <div className="p-4 bg-[#0e1628] border border-slate-800 rounded-xl text-xs space-y-3.5 leading-relaxed text-slate-300">
                <p className="font-bold text-white">Direct Labor Payments Exclusion Rule:</p>
                {currentGuidelines.map((rule, idx) => (
                  <p key={idx}>
                    {idx + 1}. {rule}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* AI WORKFORCE PLANNER */}
          {activeTab === "AI Workforce Planner" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                  {aiReplies.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-xl max-w-sm text-xs ${
                        msg.sender === "user" ? "bg-amber-600 text-slate-950 font-bold" : "bg-[#0e1628] border border-slate-850 text-slate-200"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                  <input
                    type="text"
                    placeholder="Ask AI workforce planner..."
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAIChat()}
                    className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button onClick={() => handleSendAIChat()} className="bg-amber-600 hover:bg-amber-550 text-slate-950 p-2.5 rounded-lg transition">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Diagnostics Commands</h4>
                <div className="space-y-2.5 text-xs text-amber-400">
                  {currentSuggestions.map((sug, idx) => (
                    <button key={idx} onClick={() => handleSendAIChat(sug)} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-800 hover:border-amber-500 transition block">🔮 {sug}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "Settings" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn max-w-xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Dashboard Profile & Configurations</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Sidebar Menu Items (Separated by |)</label>
                  <input
                    type="text"
                    value={formSidebarMenus}
                    onChange={(e) => setFormSidebarMenus(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">AI suggestions (Separated by |)</label>
                  <textarea
                    value={formAiSuggestions}
                    onChange={(e) => setFormAiSuggestions(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-amber-500 h-20"
                  />
                </div>
                <button onClick={handleSaveProfile} className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">Save to Database</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
