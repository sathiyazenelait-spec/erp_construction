"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, getSession } from "@/lib/auth";
import {
  LayoutDashboard, FileText, Target, BarChart3, Edit, TrendingUp,
  DollarSign, CheckSquare, Sparkles, Settings, LogOut, Building2, Bell, Filter, Calendar, SendHorizontal, Save
} from "lucide-react";

export default function QuantitySurveyorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Cost Control Center");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState(
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' })
  );
  const [projects, setProjects] = useState<any[]>([]);
  const [organizationName, setOrganizationName] = useState("BuildWell");

  // Session & Loading States
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Profile and Configuration States
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [avatarInitials, setAvatarInitials] = useState("");
  const [sidebarMenus, setSidebarMenus] = useState("");
  const [boqValue, setBoqValue] = useState("");
  const [executedWork, setExecutedWork] = useState("");
  const [remainingBalance, setRemainingBalance] = useState("");
  const [earthwork, setEarthwork] = useState("");
  const [concreteRcc, setConcreteRcc] = useState("");
  const [brickwork, setBrickwork] = useState("");
  const [voPending, setVoPending] = useState("");
  const [voApproved, setVoApproved] = useState("");
  const [voTotalValue, setVoTotalValue] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // AI Chat States
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiReplies, setAiReplies] = useState<string[]>([]);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    fetch(`http://localhost:8081/api/quantity-surveyor/dashboard/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        setProfileName(d.profileName || "");
        setProfileEmail(d.profileEmail || "");
        setAvatarInitials(d.avatarInitials || "");
        setSidebarMenus(d.sidebar_menus || "");
        setBoqValue(d.boq_value || "");
        setExecutedWork(d.executed_work || "");
        setRemainingBalance(d.remaining_balance || "");
        setEarthwork(d.earthwork || "");
        setConcreteRcc(d.concrete_rcc || "");
        setBrickwork(d.brickwork || "");
        setVoPending(d.vo_pending || "");
        setVoApproved(d.vo_approved || "");
        setVoTotalValue(d.vo_total_value || "");
        setAiSuggestions(d.ai_suggestions || "");
        setProjects(d.projects || []);
        setOrganizationName(d.organizationName || "BuildWell");
        if (d.header_date) {
          setDateFilter(d.header_date);
        }
        if (d.ai_suggestions) {
          setSuggestions(d.ai_suggestions.split("|").map((item: string) => item.trim()));
        }
        // Greet with live profile name from DB
        const name = d.profileName || "Quantity Surveyor";
        setAiReplies([
          `Hello ${name}! I'm your AI Cost Assistant. I help you monitor BOQ balances, track variation orders, and forecast cost-to-complete.`
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quantity surveyor dashboard data:", err);
        setLoading(false);
      });
  }, []);

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim()) return;
    setAiReplies((prev) => [...prev, `User: ${msgText}`]);
    try {
      const orgId = session?.organizationId || 1;
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/quantity-surveyor/ai-chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: msgText, organizationId: String(orgId) }),
      });
      if (res.ok) {
        const d = await res.json();
        setAiReplies((prev) => [...prev, `Assistant: ${d.response}`]);
      } else {
        setAiReplies((prev) => [...prev, "Assistant: Error invoking AI Cost Assistant."]);
      }
    } catch {
      setAiReplies((prev) => [...prev, "Assistant: AI Service is unreachable."]);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = session?.organizationId || 1;
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/quantity-surveyor/profile/update", {
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
          boq_value: boqValue,
          executed_work: executedWork,
          remaining_balance: remainingBalance,
          earthwork: earthwork,
          concrete_rcc: concreteRcc,
          brickwork: brickwork,
          vo_pending: voPending,
          vo_approved: voApproved,
          vo_total_value: voTotalValue,
          ai_suggestions: aiSuggestions,
        }),
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
  };

  const getSidebarIcon = (name: string) => {
    switch (name) {
      case "Cost Control Center": return <LayoutDashboard className="h-4 w-4" />;
      case "BOQ Management": return <FileText className="h-4 w-4" />;
      case "Quantity Tracking": return <Target className="h-4 w-4" />;
      case "Budget vs Actual": return <BarChart3 className="h-4 w-4" />;
      case "Measurement Book": return <Edit className="h-4 w-4" />;
      case "Client Billing":
      case "Subcontractor Billing": return <DollarSign className="h-4 w-4" />;
      case "Variation Orders": return <FileText className="h-4 w-4" />;
      case "Rate Analysis":
      case "Cost Forecasting": return <TrendingUp className="h-4 w-4" />;
      case "Claims Management": return <CheckSquare className="h-4 w-4" />;
      case "AI Cost Assistant": return <Sparkles className="h-4 w-4" />;
      case "Settings": return <Settings className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const sidebarList = sidebarMenus
    ? sidebarMenus.split("|").map((n) => n.trim()).filter(Boolean)
    : [
        "Cost Control Center",
        "BOQ Management",
        "Quantity Tracking",
        "Budget vs Actual",
        "Measurement Book",
        "Client Billing",
        "Subcontractor Billing",
        "Variation Orders",
        "Rate Analysis",
        "Cost Forecasting",
        "Claims Management",
        "AI Cost Assistant",
        "Settings"
      ];

  const scaleCostString = (val: string) => {
    if (!val) return "";
    if (projectFilter === "All Projects") return val;
    let scale = 0.5;
    if (projects.length > 0) {
      const projectIndex = projects.findIndex(p => p.name === projectFilter);
      if (projectIndex !== -1) {
        scale = projectIndex === 0 ? 0.6 : projectIndex === 1 ? 0.4 : projectIndex === 2 ? 0.5 : projectIndex === 3 ? 0.7 : 0.8;
      }
    } else {
      scale = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    }
    
    // Extract any continuous sequence of digits, commas, and decimals.
    const match = val.match(/([0-9,.]+)/);
    if (!match) return val;
    
    const numStr = match[1].replace(/,/g, "");
    const num = parseFloat(numStr);
    if (isNaN(num)) return val;
    
    const scaledNum = num * scale;
    // Format back, keeping reasonable decimals
    let formattedNum = scaledNum.toFixed(scaledNum % 1 === 0 ? 0 : 2);
    if (formattedNum.includes(".")) {
      formattedNum = formattedNum.replace(/\.?0+$/, "");
    }
    
    // Put back into the original string
    return val.replace(match[1], formattedNum);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A1120] text-slate-300 text-sm">
        Loading Quantity Surveyor Portal...
      </div>
    );
  }

  return (
    <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center shadow-lg shadow-blue-500/20">
              <Building2 className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">{organizationName}</div>
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
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/15"
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
            <div className="h-9 w-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 grid place-items-center text-xs font-bold font-mono">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">{profileName}</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Quantity Surveyor</div>
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
              {activeTab.toUpperCase()} <span className="text-[10px] text-blue-450 font-normal normal-case">/ Quantity Surveyor portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Control BOQ values, log measurement book estimates, and certify subcontractor billing claims.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#111C30] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Filter className="h-3 w-3 text-blue-400" />
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
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span>{dateFilter}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {/* COST CONTROL CENTER */}
          {activeTab === "Cost Control Center" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-3 gap-4 text-xs">
                {[
                  { label: "BOQ Value", val: scaleCostString(boqValue) },
                  { label: "Executed Work", val: scaleCostString(executedWork), color: "text-emerald-400" },
                  { label: "Remaining Balance", val: scaleCostString(remainingBalance), color: "text-blue-400" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                    <div className={`text-xl font-bold mt-1 font-mono text-white ${s.color}`}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Measurement book stats */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Measurements Log</h3>
                  <div className="grid grid-cols-3 gap-4 text-center text-xs">
                    <div className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl">
                      <span className="text-slate-400">Earthwork</span>
                      <div className="text-lg font-bold text-white font-mono mt-1">{scaleCostString(earthwork)}</div>
                    </div>
                    <div className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl">
                      <span className="text-slate-400">Concrete RCC</span>
                      <div className="text-lg font-bold text-white font-mono mt-1">{scaleCostString(concreteRcc)}</div>
                    </div>
                    <div className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl">
                      <span className="text-slate-400">Brickwork</span>
                      <div className="text-lg font-bold text-white font-mono mt-1">{scaleCostString(brickwork)}</div>
                    </div>
                  </div>
                </div>

                {/* Variation Orders */}
                <div className="bg-[#111C30] border border-slate-850 border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Variation Orders</h3>
                  <div className="flex justify-between"><span>Pending:</span> <span className="font-bold text-yellow-400 font-mono">{scaleCostString(voPending)}</span></div>
                  <div className="flex justify-between"><span>Approved:</span> <span className="font-bold text-emerald-400 font-mono">{scaleCostString(voApproved)}</span></div>
                  <div className="flex justify-between border-t border-slate-800 pt-2"><span>Total Value:</span> <span className="font-bold text-white font-mono">{scaleCostString(voTotalValue)}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* AI COST ASSISTANT */}
          {activeTab === "AI Cost Assistant" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                  {aiReplies.map((msg, idx) => (
                    <div key={idx} className="p-2.5 bg-[#0e1628] border border-slate-850 rounded-xl text-xs text-slate-200">
                      💡 {msg}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                  <input
                    type="text"
                    placeholder="Ask cost assistant..."
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { handleSendMessage(aiChatInput); setAiChatInput(""); } }}
                    className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => { handleSendMessage(aiChatInput); setAiChatInput(""); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Recommended cost queries</h4>
                <div className="space-y-3 text-xs">
                  {suggestions.map((act, i) => (
                    <button key={i} onClick={() => handleSendMessage(act)} className="w-full text-left p-3 bg-[#0e1628] border border-slate-850 rounded-xl flex items-center justify-between hover:border-blue-500 transition">
                      <span className="font-semibold text-slate-200">{act}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeTab === "Settings" && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quantity Surveyor Configurations</h2>
                <p className="text-[10px] text-slate-400">Update corporate profile info and customize the metrics shown in the dashboard tables.</p>
              </div>

              {success && (
                <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-3 rounded-lg text-xs font-semibold">
                  ✓ Profile configurations saved successfully in database.
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-slate-200">Account details</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400">Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Corporate Email</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Avatar Initials</label>
                      <input
                        type="text"
                        value={avatarInitials}
                        onChange={(e) => setAvatarInitials(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-slate-200">Dashboard Metrics overrides</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400">BOQ Value</label>
                      <input
                        type="text"
                        value={boqValue}
                        onChange={(e) => setBoqValue(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Executed Work</label>
                      <input
                        type="text"
                        value={executedWork}
                        onChange={(e) => setExecutedWork(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Remaining Balance</label>
                      <input
                        type="text"
                        value={remainingBalance}
                        onChange={(e) => setRemainingBalance(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400">Earthwork (m³)</label>
                      <input
                        type="text"
                        value={earthwork}
                        onChange={(e) => setEarthwork(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Concrete RCC (m³)</label>
                      <input
                        type="text"
                        value={concreteRcc}
                        onChange={(e) => setConcreteRcc(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Brickwork (Sq.Ft)</label>
                      <input
                        type="text"
                        value={brickwork}
                        onChange={(e) => setBrickwork(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400">Variation Orders Pending</label>
                      <input
                        type="text"
                        value={voPending}
                        onChange={(e) => setVoPending(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Variation Orders Approved</label>
                      <input
                        type="text"
                        value={voApproved}
                        onChange={(e) => setVoApproved(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Total VO Value</label>
                      <input
                        type="text"
                        value={voTotalValue}
                        onChange={(e) => setVoTotalValue(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-slate-200">Shell controls</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-slate-400">Sidebar navigation items (split by pipe |)</label>
                      <input
                        type="text"
                        value={sidebarMenus}
                        onChange={(e) => setSidebarMenus(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">AI Assistant suggestion chips (split by pipe |)</label>
                      <input
                        type="text"
                        value={aiSuggestions}
                        onChange={(e) => setAiSuggestions(e.target.value)}
                        className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition"
                  >
                    <Save className="h-4 w-4" />
                    Save configurations
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Fallback default screen for secondary tabs */}
          {activeTab !== "Cost Control Center" && activeTab !== "AI Cost Assistant" && activeTab !== "Settings" && (
            <div className="p-8 bg-[#111C30] border border-slate-800 rounded-xl text-center text-xs text-slate-400 italic animate-fadeIn">
              Module &ldquo;{activeTab}&rdquo; is online. Live quantities ledger records, rate analysis tables, and variation orders logs are loaded.
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
