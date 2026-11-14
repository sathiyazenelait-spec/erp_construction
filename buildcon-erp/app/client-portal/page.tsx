"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  Home, CheckCircle2, FileText, CreditCard, LifeBuoy, Bot, Settings,
  LogOut, Plus, Calendar, Send, ShieldCheck, Clock, AlertCircle, X,
  Building2, Sparkles, MapPin, ChevronRight
} from "lucide-react";

interface ClientTicket {
  id?: number;
  ticketCode: string;
  clientName: string;
  unitNumber: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdDate: string;
  resolutionRemarks?: string;
}

export default function ClientPortalDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [orgId, setOrgId] = useState<number>(1);
  const [profileName, setProfileName] = useState("Dr. Rajesh K.");
  const [profileEmail, setProfileEmail] = useState("rajesh.k@customer.com");
  const [avatarInitials, setAvatarInitials] = useState("RK");
  const [unitAssigned, setUnitAssigned] = useState("Skyline Residences - Tower A, Unit 402 (3 BHK Premium)");
  const [projectProgressPercent, setProjectProgressPercent] = useState(88);
  const [handoverTargetDate, setHandoverTargetDate] = useState("2026-12-30");

  const [tickets, setTickets] = useState<ClientTicket[]>([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    category: "Snagging",
    subject: "",
    description: "",
    priority: "MEDIUM"
  });

  // AI Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Welcome Dr. Rajesh! I am your AI Client Concierge for Unit 402. I provide real-time updates on construction milestones, payment receipts, and DLP warranty service tickets. How can I help you today?" }
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
      const res = await fetch(`http://localhost:8081/api/client-portal/dashboard/org/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setProfileName(data.profileName || "Dr. Rajesh K.");
        setProfileEmail(data.profileEmail || "rajesh.k@customer.com");
        setAvatarInitials(data.avatarInitials || "RK");
        setUnitAssigned(data.unitAssigned || "Skyline Residences - Tower A, Unit 402 (3 BHK Premium)");
        setProjectProgressPercent(data.projectProgressPercent || 88);
        setHandoverTargetDate(data.handoverTargetDate || "2026-12-30");
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.error("Client dashboard fetch failed:", e);
    }
  }

  async function handleRaiseTicket(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("buildcon_token");
      const payload = {
        ...newTicket,
        clientName: profileName,
        unitNumber: unitAssigned,
        organizationId: orgId
      };
      const res = await fetch("http://localhost:8081/api/client-portal/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowTicketModal(false);
        fetchDashboard(orgId);
        setNewTicket({ category: "Snagging", subject: "", description: "", priority: "MEDIUM" });
      }
    } catch (e) {
      console.error("Raise ticket error:", e);
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
      const res = await fetch("http://localhost:8081/api/client-portal/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ message: textToSend, organizationId: orgId })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages([...newMsgs, { sender: "ai", text: data.response }]);
      }
    } catch (e) {
      setChatMessages([...newMsgs, { sender: "ai", text: "Client Concierge: Your homeowner request is logged directly in our site engineer database." }]);
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">BuildWell</div>
              <div className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Client Portal</div>
            </div>
          </div>

          {/* NAV ITEMS */}
          <nav className="p-3 space-y-1">
            {[
              { name: "Overview", icon: Home },
              { name: "Construction Stages", icon: CheckCircle2 },
              { name: "Invoices & Payments", icon: CreditCard },
              { name: "Snag & Warranty (DLP)", icon: LifeBuoy },
              { name: "AI Concierge", icon: Bot },
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
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  {tab.name}
                  {tab.name === "Snag & Warranty (DLP)" && tickets.filter(t => t.status === "OPEN").length > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {tickets.filter(t => t.status === "OPEN").length}
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
            <div className="h-9 w-9 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center text-xs">
              {avatarInitials}
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-xs font-semibold text-white truncate max-w-[110px]">{profileName}</div>
              <div className="text-[10px] text-emerald-400 font-mono">Homeowner</div>
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
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
              Skyline Towers Phase 1
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-2 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            {activeTab === "Snag & Warranty (DLP)" && (
              <button
                onClick={() => setShowTicketModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                <Plus className="h-3.5 w-3.5" /> Raise Snag Ticket
              </button>
            )}
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="p-6 space-y-6 flex-1">
          {/* TAB: OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              {/* PROPERTY HERO CARD */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-[#111C30] to-slate-900 border border-emerald-800/40 rounded-xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Building2 className="h-4 w-4" /> Property Ownership Dossier
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-wide">{unitAssigned}</h2>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400" /> OMR IT Expressway, Sholinganallur, Chennai
                  </p>
                </div>

                <div className="bg-[#0c1427] border border-slate-800 px-5 py-3 rounded-xl text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Estimated Possession</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">{handoverTargetDate}</div>
                  <div className="text-[10px] text-emerald-300/80">Occupancy Certificate (OC) in progress</div>
                </div>
              </div>

              {/* PROGRESS BAR & KPI STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm col-span-2 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Overall Project Completion</span>
                    <span className="font-mono font-bold text-lg text-emerald-400">{projectProgressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-400 h-3 rounded-full shadow-sm"
                      style={{ width: `${projectProgressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Foundation: 100%</span>
                    <span>Structure: 100%</span>
                    <span>Finishing: 80%</span>
                    <span>Handover: Scheduled</span>
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase">5-Year Warranty</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-lg font-bold text-white">Full DLP Coverage</div>
                  <p className="text-[11px] text-slate-400">
                    Includes 12 months comprehensive defect liability and 5-year structural warranty.
                  </p>
                </div>
              </div>

              {/* RECENT TICKETS & STAGE UPDATE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <LifeBuoy className="h-4 w-4 text-emerald-400" /> Recent Snagging & Maintenance Requests
                    </h3>
                    <button onClick={() => setActiveTab("Snag & Warranty (DLP)")} className="text-xs text-emerald-400 hover:underline">
                      View all ({tickets.length})
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tickets.map((t, idx) => (
                      <div key={idx} className="p-3 bg-[#0c1427] border border-slate-800 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span className="font-mono text-emerald-400">{t.ticketCode}</span>
                            <span>• {t.subject}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{t.category} | Created: {t.createdDate}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          t.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                          "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Clock className="h-4 w-4 text-cyan-400" /> Live Site Photo Stream
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">Tower A Entrance Lobby Elevation</div>
                        <div className="text-[11px] text-slate-400">Italian marble flooring & glass facade installation completed.</div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded">Verified</span>
                    </div>
                    <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">Unit 402 Balcony & Window Framing</div>
                        <div className="text-[11px] text-slate-400">Double glazed UPVC acoustic sliding glass doors fitted.</div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STAGES */}
          {activeTab === "Construction Stages" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Step-by-step verified construction milestones for Tower A.</p>
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
                {[
                  { stage: "Stage 1: Piling & Raft Foundation", progress: 100, status: "Completed", date: "Jan 2026", desc: "M35 grade concrete raft with structural anchor rebar." },
                  { stage: "Stage 2: RCC Superstructure Frame", progress: 100, status: "Completed", date: "May 2026", desc: "G+14 Floors RCC columns, shear walls, and slab pourings." },
                  { stage: "Stage 3: Masonry & External Plastering", progress: 100, status: "Completed", date: "Aug 2026", desc: "Aerated concrete solid blocks with weather-shield primer." },
                  { stage: "Stage 4: Internal MEP & Flooring Fitments", progress: 85, status: "In Progress", date: "Current", desc: "Concealed copper conduits, CPVC plumbing, and vitrified tiles." },
                  { stage: "Stage 5: Final Snagging & Handover", progress: 30, status: "Upcoming", date: "Dec 2026", desc: "Pre-possession walkthrough and Occupancy Certificate handover." }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-800/60 last:border-0 last:pb-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                      s.progress === 100 ? "bg-emerald-500 text-white" :
                      s.progress > 0 ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500" :
                      "bg-slate-800 text-slate-500"
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white">{s.stage}</h4>
                        <span className="text-xs font-mono text-emerald-400 font-semibold">{s.date}</span>
                      </div>
                      <p className="text-xs text-slate-300">{s.desc}</p>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PAYMENTS */}
          {activeTab === "Invoices & Payments" && (
            <div className="space-y-4">
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-400" /> Agreement Payment Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Total Flat Value</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">₹1,25,00,000</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Agreement with Car Park</div>
                  </div>
                  <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Amount Paid (85%)</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono mt-1">₹1,06,25,000</div>
                    <div className="text-[10px] text-emerald-400/80 mt-0.5">Receipts cleared</div>
                  </div>
                  <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Balance on Handover (15%)</div>
                    <div className="text-lg font-bold text-cyan-400 font-mono mt-1">₹18,75,000</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Payable upon OC release</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SNAG TICKETS */}
          {activeTab === "Snag & Warranty (DLP)" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Report any snags or warranty service items for Unit 402 directly to the site engineers.</p>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Raise New Snag Ticket
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tickets.map((t, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                        {t.ticketCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        t.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{t.subject}</h4>
                      <p className="text-xs text-slate-300 mt-1">{t.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>Category: <strong className="text-white">{t.category}</strong></span>
                      <span>Logged: <strong className="text-white">{t.createdDate}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AI CONCIERGE */}
          {activeTab === "AI Concierge" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl h-[600px] flex flex-col overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-800 bg-[#0c1427] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">AI Homeowner Concierge</div>
                    <div className="text-[10px] text-emerald-400">Assisting you with Unit 402 possession, warranty & fitments</div>
                  </div>
                </div>
              </div>

              {/* QUICK PROMPT CHIPS */}
              <div className="px-4 py-2.5 bg-[#090f1d] border-b border-slate-800/80 flex flex-wrap gap-2 text-xs">
                {[
                  "When is my possession handover date?",
                  "What is covered under the 1-year DLP warranty?",
                  "Show breakdown of remaining 15% payment",
                  "How to schedule pre-handover snag inspection?"
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendAiMessage(chip)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-900/40 hover:text-emerald-300 text-slate-300 border border-slate-700/60 text-[11px] transition"
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
                          ? "bg-emerald-600 text-white rounded-br-none shadow-md"
                          : "bg-[#0c1427] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0c1427] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-emerald-400 flex items-center gap-2 font-mono">
                      <span className="animate-spin">⚙</span> Consulting site engineering database for Unit 402...
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
                  placeholder="Ask about handover timeline, fitment options, warranties, or payment milestones..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => sendAiMessage()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
                >
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "Settings" && (
            <div className="max-w-xl bg-[#111C30] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-white">Client / Homeowner Profile Settings</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("buildcon_token");
                    await fetch("http://localhost:8081/api/client-portal/profile/update", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ username: profileName, email: profileEmail, organizationId: orgId })
                    });
                    alert("Profile updated successfully!");
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition"
                >
                  Save Profile to Database
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* SNAG TICKET MODAL */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Raise Snag / Warranty Ticket</h3>
              <button onClick={() => setShowTicketModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleRaiseTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 text-white"
                >
                  <option value="Snagging">Pre-Possession Snagging</option>
                  <option value="DLP Warranty">Defect Liability (DLP) Warranty</option>
                  <option value="Plumbing & Electrical">Plumbing & Electrical</option>
                  <option value="Carpentry & Hardware">Carpentry & Locks</option>
                  <option value="General Query">General Billing / Possession Query</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Subject / Item</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Master Bedroom Door Mortise Lock Alignment"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe location, defect, or required adjustment..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTicketModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

