"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  ShieldCheck, AlertTriangle, CheckCircle, FileText, FlaskConical,
  HardHat, Bot, Settings, LogOut, Plus, Search, Filter,
  Building2, Calendar, Send, Activity, ChevronRight, X
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from "recharts";

interface Inspection {
  id?: number;
  inspectionCode: string;
  title: string;
  category: string;
  location: string;
  inspectorName: string;
  status: string;
  inspectionDate: string;
  remarks: string;
}

interface Ncr {
  id?: number;
  ncrNumber: string;
  title: string;
  severity: string;
  contractorName: string;
  location: string;
  defectDescription: string;
  rootCause: string;
  correctiveAction: string;
  status: string;
  targetDate: string;
  resolvedDate?: string;
}

interface MaterialTest {
  id?: number;
  testCode: string;
  materialName: string;
  testType: string;
  batchRef: string;
  supplierName: string;
  standardSpec: string;
  observedValue: string;
  result: string;
  testedDate: string;
  certDocRef: string;
}

interface SafetyAudit {
  id?: number;
  auditCode: string;
  area: string;
  ppeCompliancePercent: number;
  scaffoldingStatus: string;
  fireEquipmentStatus: string;
  safetyOfficer: string;
  auditDate: string;
  correctiveNotes: string;
}

export default function QaQcEngineerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [orgId, setOrgId] = useState<number>(1);
  const [profileName, setProfileName] = useState("R. Senthil Nathan");
  const [profileEmail, setProfileEmail] = useState("qaqc@buildcon.com");
  const [avatarInitials, setAvatarInitials] = useState("QA");

  // Data states
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [ncrs, setNcrs] = useState<Ncr[]>([]);
  const [materialTests, setMaterialTests] = useState<MaterialTest[]>([]);
  const [safetyAudits, setSafetyAudits] = useState<SafetyAudit[]>([]);
  const [kpiStats, setKpiStats] = useState({
    totalInspections: 0,
    passRate: 98.4,
    openNcrs: 2,
    closedNcrs: 1,
    passMaterialTests: 4,
    totalMaterialTests: 4
  });

  // Modal states
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showNcrModal, setShowNcrModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  // Form states
  const [newInsp, setNewInsp] = useState({
    title: "", category: "Structural", location: "", inspectorName: "R. Senthil Nathan", status: "PASSED", remarks: ""
  });
  const [newNcr, setNewNcr] = useState({
    title: "", severity: "MAJOR", contractorName: "", location: "", defectDescription: "", rootCause: "", correctiveAction: "", targetDate: ""
  });
  const [newTest, setNewTest] = useState({
    materialName: "", testType: "Tensile Strength", batchRef: "", supplierName: "", standardSpec: "", observedValue: "", result: "PASS", certDocRef: "NABL-ACCREDITED"
  });

  // AI Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello Senthil! I am your AI QA/QC Copilot. I analyze IS/ASTM construction compliance, concrete curing benchmarks, and root-cause resolution strategies. How can I assist you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrgId = localStorage.getItem("selected_login_org_id");
      const currentOrgId = savedOrgId ? parseInt(savedOrgId, 10) : 1;
      setOrgId(currentOrgId);
      fetchDashboard(currentOrgId);
    }
  }, []);

  async function fetchDashboard(id: number) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/qa-qc/dashboard/org/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setProfileName(data.profileName || "R. Senthil Nathan");
        setProfileEmail(data.profileEmail || "qaqc@buildcon.com");
        setAvatarInitials(data.avatarInitials || "QA");
        setInspections(data.inspections || []);
        setNcrs(data.ncrs || []);
        setMaterialTests(data.materialTests || []);
        setSafetyAudits(data.safetyAudits || []);
        setKpiStats({
          totalInspections: data.totalInspections || 0,
          passRate: data.passRate || 95.0,
          openNcrs: data.openNcrs || 0,
          closedNcrs: data.closedNcrs || 0,
          passMaterialTests: data.passMaterialTests || 0,
          totalMaterialTests: data.totalMaterialTests || 0
        });
      }
    } catch (e) {
      console.error("Failed fetching QA/QC dashboard:", e);
    }
  }

  async function handleAddInspection(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("buildcon_token");
      const payload = { ...newInsp, organizationId: orgId };
      const res = await fetch("http://localhost:8081/api/qa-qc/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowInspectionModal(false);
        fetchDashboard(orgId);
        setNewInsp({ title: "", category: "Structural", location: "", inspectorName: profileName, status: "PASSED", remarks: "" });
      }
    } catch (e) {
      console.error("Add inspection error:", e);
    }
  }

  async function handleCreateNcr(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("buildcon_token");
      const payload = { ...newNcr, organizationId: orgId };
      const res = await fetch("http://localhost:8081/api/qa-qc/ncrs", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowNcrModal(false);
        fetchDashboard(orgId);
        setNewNcr({ title: "", severity: "MAJOR", contractorName: "", location: "", defectDescription: "", rootCause: "", correctiveAction: "", targetDate: "" });
      }
    } catch (e) {
      console.error("Create NCR error:", e);
    }
  }

  async function handleUpdateNcrStatus(id: number, status: string) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/qa-qc/ncrs/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDashboard(orgId);
      }
    } catch (e) {
      console.error("Update NCR status error:", e);
    }
  }

  async function handleAddMaterialTest(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("buildcon_token");
      const payload = { ...newTest, organizationId: orgId };
      const res = await fetch("http://localhost:8081/api/qa-qc/material-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowTestModal(false);
        fetchDashboard(orgId);
        setNewTest({ materialName: "", testType: "Tensile Strength", batchRef: "", supplierName: "", standardSpec: "", observedValue: "", result: "PASS", certDocRef: "NABL-ACCREDITED" });
      }
    } catch (e) {
      console.error("Add test error:", e);
    }
  }

  async function sendAiMessage(promptText?: string) {
    const textToSend = promptText || chatInput;
    if (!textToSend.trim()) return;

    const newMsgs = [...chatMessages, { sender: "user" as const, text: textToSend }];
    setChatMessages(newMsgs);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/qa-qc/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ message: textToSend, organizationId: orgId })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages([...newMsgs, { sender: "ai", text: data.response }]);
      }
    } catch (e) {
      setChatMessages([...newMsgs, { sender: "ai", text: "Quality Audit Engine: Connection to AI services disrupted. All logged tests remain validated in MySQL." }]);
    } finally {
      setIsAiLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-[#0A1120] text-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 bg-[#0c1427] flex flex-col justify-between shrink-0">
        <div>
          {/* LOGO */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">BuildWell</div>
              <div className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">QA/QC Engine</div>
            </div>
          </div>

          {/* NAV ITEMS */}
          <nav className="p-3 space-y-1">
            {[
              { name: "Overview", icon: Activity },
              { name: "Inspections", icon: CheckCircle },
              { name: "NCR Center", icon: AlertTriangle },
              { name: "Lab Testing", icon: FlaskConical },
              { name: "Safety Audits", icon: HardHat },
              { name: "AI Assistant", icon: Bot },
              { name: "Settings", icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  {tab.name}
                  {tab.name === "NCR Center" && kpiStats.openNcrs > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {kpiStats.openNcrs}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* USER FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-[#090f1d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
              {avatarInitials}
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-xs font-semibold text-white truncate max-w-[110px]">{profileName}</div>
              <div className="text-[10px] text-cyan-400 font-mono">QA/QC Manager</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/login/manager"); }}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* HEADER */}
        <header className="h-16 border-b border-slate-800 bg-[#0c1427]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-wide">{activeTab}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              ISO 9001:2015 Compliant
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-2 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            {activeTab === "Inspections" && (
              <button
                onClick={() => setShowInspectionModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                <Plus className="h-3.5 w-3.5" /> Log Inspection
              </button>
            )}
            {activeTab === "NCR Center" && (
              <button
                onClick={() => setShowNcrModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                <AlertTriangle className="h-3.5 w-3.5" /> Raise NCR
              </button>
            )}
            {activeTab === "Lab Testing" && (
              <button
                onClick={() => setShowTestModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Lab Test
              </button>
            )}
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="p-6 space-y-6 flex-1">
          {/* TAB: OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pass Rate</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{kpiStats.passRate}%</div>
                  <div className="text-[11px] text-slate-400 mt-1">Inspections meeting IS Specs</div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active NCRs</span>
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-bold text-rose-400 font-mono">{kpiStats.openNcrs}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Requiring immediate CAPA</div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Inspections</span>
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{kpiStats.totalInspections}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Logged across all active zones</div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Lab Certificates</span>
                    <FlaskConical className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-amber-400 font-mono">
                    {kpiStats.passMaterialTests}/{kpiStats.totalMaterialTests}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">NABL test batches cleared</div>
                </div>
              </div>

              {/* RECENT INSPECTIONS & CRITICAL NCR HIGHLIGHT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RECENT INSPECTIONS */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400" /> Recent Site Quality Inspections
                    </h3>
                    <button onClick={() => setActiveTab("Inspections")} className="text-xs text-cyan-400 hover:underline">
                      View all ({inspections.length})
                    </button>
                  </div>
                  <div className="space-y-3">
                    {inspections.slice(0, 4).map((insp, idx) => (
                      <div key={idx} className="p-3 bg-[#0c1427] border border-slate-800/80 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{insp.title}</span>
                            <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                              {insp.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{insp.location} • {insp.inspectionDate}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          insp.status === "PASSED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                          insp.status === "CONDITIONAL" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                          "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}>
                          {insp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CRITICAL NCRs */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400" /> Open Non-Conformance Reports
                    </h3>
                    <button onClick={() => setActiveTab("NCR Center")} className="text-xs text-rose-400 hover:underline">
                      Manage NCRs
                    </button>
                  </div>
                  <div className="space-y-3">
                    {ncrs.filter(n => n.status !== "CLOSED").slice(0, 3).map((ncr, idx) => (
                      <div key={idx} className="p-3 bg-[#0c1427] border border-rose-900/30 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-rose-400">{ncr.ncrNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-rose-500/20 text-rose-300">
                            {ncr.severity}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white">{ncr.title}</div>
                        <div className="text-[11px] text-slate-400">{ncr.defectDescription}</div>
                        <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex justify-between">
                          <span>Subcontractor: {ncr.contractorName}</span>
                          <span>Target: {ncr.targetDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INSPECTIONS */}
          {activeTab === "Inspections" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Formal quality inspection checklists verified against IS 456 & NBC guidelines.</p>
                <button
                  onClick={() => setShowInspectionModal(true)}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Inspection
                </button>
              </div>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c1427] text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">Code</th>
                      <th className="p-3.5">Title & Scope</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Inspector</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {inspections.map((insp, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-mono text-cyan-400 font-bold">{insp.inspectionCode}</td>
                        <td className="p-3.5 font-semibold text-white">
                          {insp.title}
                          {insp.remarks && <div className="text-[10px] text-slate-400 font-normal mt-0.5">{insp.remarks}</div>}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                            {insp.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-300">{insp.location}</td>
                        <td className="p-3.5 text-slate-400 font-mono">{insp.inspectionDate}</td>
                        <td className="p-3.5 text-slate-300">{insp.inspectorName}</td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            insp.status === "PASSED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                            insp.status === "CONDITIONAL" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                            "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}>
                            {insp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: NCR CENTER */}
          {activeTab === "NCR Center" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Non-Conformance Reports (NCR) tracking root causes, subcontractor corrective actions, and closure sign-offs.</p>
                <button
                  onClick={() => setShowNcrModal(true)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> Raise NCR
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ncrs.map((ncr, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800">
                          {ncr.ncrNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          ncr.severity === "CRITICAL" ? "bg-red-600 text-white" :
                          ncr.severity === "MAJOR" ? "bg-amber-600 text-white" : "bg-blue-600 text-white"
                        }`}>
                          {ncr.severity}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        ncr.status === "CLOSED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                        ncr.status === "RECTIFIED" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}>
                        {ncr.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{ncr.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">{ncr.defectDescription}</p>
                    </div>

                    <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800 text-xs space-y-1">
                      <div className="text-slate-400"><strong className="text-slate-200">Root Cause:</strong> {ncr.rootCause}</div>
                      <div className="text-slate-400"><strong className="text-slate-200">CAPA:</strong> {ncr.correctiveAction}</div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>Assigned to: <strong className="text-white">{ncr.contractorName}</strong></span>
                      <span>Target: <strong className="text-white">{ncr.targetDate}</strong></span>
                    </div>

                    {/* STATUS ACTION BUTTONS */}
                    <div className="flex gap-2 pt-1">
                      {ncr.status === "OPEN" && (
                        <button
                          onClick={() => ncr.id && handleUpdateNcrStatus(ncr.id, "UNDER_REVIEW")}
                          className="flex-1 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-600/40 rounded text-xs font-semibold transition"
                        >
                          Mark Under Review
                        </button>
                      )}
                      {ncr.status === "UNDER_REVIEW" && (
                        <button
                          onClick={() => ncr.id && handleUpdateNcrStatus(ncr.id, "RECTIFIED")}
                          className="flex-1 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-600/40 rounded text-xs font-semibold transition"
                        >
                          Verify Rectification
                        </button>
                      )}
                      {ncr.status === "RECTIFIED" && (
                        <button
                          onClick={() => ncr.id && handleUpdateNcrStatus(ncr.id, "CLOSED")}
                          className="flex-1 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-600/40 rounded text-xs font-semibold transition"
                        >
                          Sign-off & Close NCR
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LAB TESTING */}
          {activeTab === "Lab Testing" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">NABL Accredited Third-Party & Field Laboratory Material Quality Certificates.</p>
                <button
                  onClick={() => setShowTestModal(true)}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Log Material Test
                </button>
              </div>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c1427] text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">Test Code</th>
                      <th className="p-3.5">Material & Type</th>
                      <th className="p-3.5">Batch / Supplier</th>
                      <th className="p-3.5">Standard Spec</th>
                      <th className="p-3.5">Observed Test Value</th>
                      <th className="p-3.5">Tested Date</th>
                      <th className="p-3.5">Certificate</th>
                      <th className="p-3.5">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {materialTests.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-mono text-cyan-400 font-bold">{t.testCode}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{t.materialName}</div>
                          <div className="text-[10px] text-cyan-400">{t.testType}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-white">{t.supplierName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{t.batchRef}</div>
                        </td>
                        <td className="p-3.5 text-slate-300 font-mono text-[11px]">{t.standardSpec}</td>
                        <td className="p-3.5 font-mono text-emerald-400 font-semibold">{t.observedValue}</td>
                        <td className="p-3.5 text-slate-400 font-mono">{t.testedDate}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {t.certDocRef}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            t.result === "PASS" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}>
                            {t.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SAFETY AUDITS */}
          {activeTab === "Safety Audits" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Site Safety Inspections, Hazard Audits, and PPE Compliance Tracking.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safetyAudits.map((aud, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">{aud.auditCode}</span>
                      <span className="text-xs font-mono text-slate-400">{aud.auditDate}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <HardHat className="h-4 w-4 text-amber-400" /> {aud.area}
                    </h4>

                    {/* PPE METER */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">PPE Compliance Score</span>
                        <span className="font-mono font-bold text-emerald-400">{aud.ppeCompliancePercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${aud.ppeCompliancePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-[#0c1427] rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400">Scaffolding Status</div>
                        <div className="font-semibold text-emerald-400">{aud.scaffoldingStatus}</div>
                      </div>
                      <div className="p-2 bg-[#0c1427] rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400">Fire Safeguards</div>
                        <div className="font-semibold text-emerald-400">{aud.fireEquipmentStatus}</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                      <strong>Remarks:</strong> {aud.correctiveNotes}
                    </div>

                    <div className="text-[10px] text-slate-500 text-right">
                      Auditor: {aud.safetyOfficer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AI ASSISTANT */}
          {activeTab === "AI Assistant" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl h-[600px] flex flex-col overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-800 bg-[#0c1427] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold text-white">QA/QC Quality AI Copilot</div>
                    <div className="text-[10px] text-cyan-400">Trained on Indian IS Codes, NBC & ASTM Standards</div>
                  </div>
                </div>
              </div>

              {/* QUICK PROMPT CHIPS */}
              <div className="px-4 py-2.5 bg-[#090f1d] border-b border-slate-800/80 flex flex-wrap gap-2 text-xs">
                {[
                  "Explain Honeycombing Repair Procedure",
                  "What is M35 Curing Water-Cement Ratio?",
                  "TMT Rebar Fe500D Tensile Thresholds",
                  "Site PPE & Perimeter Scaffolding Audit"
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendAiMessage(chip)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-900/40 hover:text-cyan-300 text-slate-300 border border-slate-700/60 text-[11px] transition"
                  >
                    ✨ {chip}
                  </button>
                ))}
              </div>

              {/* CHAT MESSAGES */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-cyan-600 text-white rounded-br-none shadow-md"
                          : "bg-[#0c1427] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0c1427] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-400 flex items-center gap-2 font-mono">
                      <span className="animate-spin">⚙</span> Consulting IS & ASTM Quality Code Standards...
                    </div>
                  </div>
                )}
              </div>

              {/* INPUT BAR */}
              <div className="p-3 border-t border-slate-800 bg-[#0c1427] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendAiMessage()}
                  placeholder="Ask about slump tests, curing periods, concrete mix grades, or NCR root-causes..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => sendAiMessage()}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
                >
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "Settings" && (
            <div className="max-w-xl bg-[#111C30] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-white">QA/QC Engineer Profile Settings</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("buildcon_token");
                    await fetch("http://localhost:8081/api/qa-qc/profile/update", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ username: profileName, email: profileEmail, organizationId: orgId })
                    });
                    alert("Profile updated successfully!");
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs transition"
                >
                  Save Profile to Database
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* INSPECTION MODAL */}
      {showInspectionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Log Quality Inspection</h3>
              <button onClick={() => setShowInspectionModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddInspection} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Inspection Title & Activity</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Beam B-12 Shuttering & Clear Cover Check"
                  value={newInsp.title}
                  onChange={(e) => setNewInsp({ ...newInsp, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={newInsp.category}
                    onChange={(e) => setNewInsp({ ...newInsp, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 text-white"
                  >
                    <option value="Structural">Structural</option>
                    <option value="Pre-Pour Concrete">Pre-Pour Concrete</option>
                    <option value="MEP">MEP</option>
                    <option value="Civil Finishing">Civil Finishing</option>
                    <option value="Waterproofing">Waterproofing</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <select
                    value={newInsp.status}
                    onChange={(e) => setNewInsp({ ...newInsp, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 text-white"
                  >
                    <option value="PASSED">PASSED</option>
                    <option value="CONDITIONAL">CONDITIONAL</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Location on Site</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Tower A, Level 4, Grid C2-D4"
                  value={newInsp.location}
                  onChange={(e) => setNewInsp({ ...newInsp, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Technical Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Notes on cover block spacing, rebar lap length, plumb line check..."
                  value={newInsp.remarks}
                  onChange={(e) => setNewInsp({ ...newInsp, remarks: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowInspectionModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold">Save Inspection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NCR MODAL */}
      {showNcrModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" /> Raise Non-Conformance Report (NCR)
              </h3>
              <button onClick={() => setShowNcrModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateNcr} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">NCR Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Honeycombing in Lift Core Shear Wall"
                  value={newNcr.title}
                  onChange={(e) => setNewNcr({ ...newNcr, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Severity</label>
                  <select
                    value={newNcr.severity}
                    onChange={(e) => setNewNcr({ ...newNcr, severity: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 text-white"
                  >
                    <option value="CRITICAL">CRITICAL (Stop Work)</option>
                    <option value="MAJOR">MAJOR (Rework Required)</option>
                    <option value="MINOR">MINOR (Touch-up / Rectification)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Subcontractor</label>
                  <input
                    required
                    type="text"
                    placeholder="Contractor Name"
                    value={newNcr.contractorName}
                    onChange={(e) => setNewNcr({ ...newNcr, contractorName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Location on Site</label>
                <input
                  required
                  type="text"
                  placeholder="Tower / Floor / Grid"
                  value={newNcr.location}
                  onChange={(e) => setNewNcr({ ...newNcr, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Defect Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detailed observations on failure..."
                  value={newNcr.defectDescription}
                  onChange={(e) => setNewNcr({ ...newNcr, defectDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Root Cause</label>
                  <input
                    type="text"
                    placeholder="e.g. Over-vibration or coarse mix"
                    value={newNcr.rootCause}
                    onChange={(e) => setNewNcr({ ...newNcr, rootCause: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Target Rectification Date</label>
                  <input
                    required
                    type="date"
                    value={newNcr.targetDate}
                    onChange={(e) => setNewNcr({ ...newNcr, targetDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNcrModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold">Issue Official NCR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LAB TEST MODAL */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Log Material Lab Test</h3>
              <button onClick={() => setShowTestModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddMaterialTest} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Material Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. TMT Steel Rebar Fe500D (20mm)"
                  value={newTest.materialName}
                  onChange={(e) => setNewTest({ ...newTest, materialName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Test Type</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Tensile & Yield Stress"
                    value={newTest.testType}
                    onChange={(e) => setNewTest({ ...newTest, testType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Result</label>
                  <select
                    value={newTest.result}
                    onChange={(e) => setNewTest({ ...newTest, result: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 text-white"
                  >
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Standard IS/ASTM Spec</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Yield >= 500 N/mm²"
                    value={newTest.standardSpec}
                    onChange={(e) => setNewTest({ ...newTest, standardSpec: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Observed Test Value</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Yield 546 N/mm²"
                    value={newTest.observedValue}
                    onChange={(e) => setNewTest({ ...newTest, observedValue: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Supplier</label>
                  <input
                    type="text"
                    placeholder="e.g. Tata Steel"
                    value={newTest.supplierName}
                    onChange={(e) => setNewTest({ ...newTest, supplierName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Batch Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. LOT-4029"
                    value={newTest.batchRef}
                    onChange={(e) => setNewTest({ ...newTest, batchRef: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTestModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold">Record Test</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

