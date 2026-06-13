"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, FileText, ClipboardList, PackagePlus, ShieldAlert,
  Bot, Settings, LogOut, Building2, Calendar, Filter, Plus, SendHorizontal
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

interface SubContract {
  id: string;
  scopeName: string;
  progress: number;
  value: number;
  certified: number;
  status: "Active" | "Completed" | "Disputed";
}

interface ProgressClaim {
  id: string;
  contractId: string;
  workDone: string;
  amount: number;
  status: "Draft" | "Submitted" | "Certified" | "Paid";
}

export default function SubcontractorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("My Contracts");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("09 June 2026, Tuesday");

  // --- Stateful Data ---
  const [contracts, setContracts] = React.useState<SubContract[]>([
    { id: "CON-301", scopeName: "Foundation RCC Concreting", progress: 100, value: 3500000, certified: 3500000, status: "Completed" },
    { id: "CON-302", scopeName: "Tower B - Slab Framing & Rebar Placement", progress: 75, value: 4500000, certified: 3000000, status: "Active" },
    { id: "CON-303", scopeName: "Masonry Brick Walls (1st - 5th Floor)", progress: 40, value: 2500000, certified: 800000, status: "Active" }
  ]);

  const [claims, setClaims] = React.useState<ProgressClaim[]>([]);

  const [newClaimWork, setNewClaimWork] = React.useState("");
  const [newClaimAmount, setNewClaimAmount] = React.useState("");
  const [selectedContract, setSelectedContract] = React.useState("CON-302");

  const [aiChatInput, setAiChatInput] = React.useState("");
  const [aiReplies, setAiReplies] = React.useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Contractor! I'm your AI Subcontractor Assistant. I help you track progress milestones, predict invoice certification lead times, and optimize material indents." }
  ]);

  // Load claims from backend
  async function fetchClaims() {
    try {
      const res = await fetch("http://localhost:8081/api/progress-claims");
      if (res.ok) {
        const data = await res.json();
        // Map backend claim format to UI format
        const mapped = data.map((d: any) => ({
          id: `CLM-${d.id}`,
          contractId: d.projectId === 2 ? "CON-303" : "CON-302",
          workDone: d.description || "Subcontractor Claim Works",
          amount: d.amountRequested || 0,
          status: d.status === "PENDING" ? "Submitted" : d.status === "APPROVED" ? "Certified" : d.status === "PAID" ? "Paid" : "Draft"
        }));
        setClaims(mapped);
      }
    } catch (err) {
      console.error("Failed to load claims", err);
    }
  }

  React.useEffect(() => {
    fetchClaims();
  }, []);

  // Chart datasets
  const contractProgressData = contracts.map(c => ({
    name: c.scopeName.substring(0, 15),
    Progress: c.progress,
    Value: c.value / 100000 // In Lakhs
  }));

  const sidebarItems = [
    { name: "My Contracts", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Progress Claims", icon: <FileText className="h-4 w-4" /> },
    { name: "Crew Attendance", icon: <ClipboardList className="h-4 w-4" /> },
    { name: "Material Indents", icon: <PackagePlus className="h-4 w-4" /> },
    { name: "AI Contract Assistant", icon: <Bot className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaimWork.trim() || !newClaimAmount.trim()) return;

    try {
      const pId = selectedContract === "CON-303" ? 2 : 1;
      const res = await fetch("http://localhost:8081/api/progress-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: pId,
          subcontractorId: 1,
          description: newClaimWork,
          amountRequested: parseFloat(newClaimAmount)
        })
      });
      if (res.ok) {
        setNewClaimWork("");
        setNewClaimAmount("");
        fetchClaims();
      }
    } catch (err) {
      console.error("Failed to submit claim", err);
    }
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
          role: "subcontractor"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiReplies(prev => [...prev, { sender: "bot", text: data.response }]);
      }
    } catch (err) {
      console.error("AI assistant chat failed", err);
    }
  };

  return (
    <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-500 to-red-500 grid place-items-center shadow-lg shadow-rose-500/20">
              <Building2 className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">BuildWell</div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">Constructions</div>
            </div>
          </div>

          <nav className="p-3 space-y-0.5">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                  activeTab === item.name
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold shadow-md shadow-rose-500/15"
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
            <div className="h-9 w-9 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 grid place-items-center text-xs font-bold font-mono">
              SH
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">Subcontractor Hub</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Partner Dashboard</div>
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
              {activeTab.toUpperCase()} <span className="text-[10px] text-rose-400 font-normal normal-case">/ Subcontractor portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Submit measurement certificates progress claims, log crew counts, and request structural inventory materials.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#111C30] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Filter className="h-3 w-3 text-rose-400" />
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
              <Calendar className="h-3.5 w-3.5 text-rose-400" />
              <span>{dateFilter}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {/* MY CONTRACTS */}
          {activeTab === "My Contracts" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-3 gap-4 text-xs">
                {[
                  { label: "Active Contracts", val: "2 Scopes", desc: "Basement and Tower B" },
                  { label: "Total Contract Value", val: "₹1.05 Cr", desc: "Across all active scopes" },
                  { label: "Certified Earnings", val: "₹73.0 Lakhs", desc: "Claims processed & released" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                    <span className="text-[10px] text-slate-555 text-slate-400 block mt-1.5">{s.desc}</span>
                  </div>
                ))}
              </div>

              {/* Progress visualizer */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Scope Progress & Values (Lakhs ₹)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contractProgressData}>
                      <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar name="Scope Progress (%)" dataKey="Progress" fill="#EC4899" radius={[4, 4, 0, 0]} />
                      <Bar name="Scope Value (Lakhs)" dataKey="Value" fill="#475569" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* PROGRESS CLAIMS */}
          {activeTab === "Progress Claims" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleSubmitClaim} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 grid grid-cols-4 gap-3 items-end">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Select Contract Scope</label>
                  <select
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs outline-none"
                  >
                    <option value="CON-302">CON-302: Tower B Slab</option>
                    <option value="CON-303">CON-303: Brick Walls Masonry</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-1">Detailed Description of Work Done</label>
                  <input
                    type="text"
                    placeholder="e.g. Masonry plastering complete Sector 3"
                    value={newClaimWork}
                    onChange={(e) => setNewClaimWork(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Claim Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={newClaimAmount}
                    onChange={(e) => setNewClaimAmount(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-rose-500"
                    required
                  />
                </div>
                <button type="submit" className="col-span-4 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 h-[34px]">
                  <Plus className="h-4 w-4" /> Submit Progress Claim
                </button>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Claims Logs</h3>
                <div className="space-y-3">
                  {claims.map((clm) => (
                    <div key={clm.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0e1628] border border-slate-850 text-xs">
                      <div>
                        <div className="font-bold text-white">{clm.workDone}</div>
                        <span className="text-[10px] text-slate-500 font-mono">Claim ID: {clm.id} | Contract: {clm.contractId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-white font-bold">₹{clm.amount.toLocaleString("en-IN")}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          clm.status === "Certified" ? "bg-emerald-500/10 text-emerald-450" : "bg-amber-500/10 text-amber-400"
                        }`}>{clm.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CREW ATTENDANCE */}
          {activeTab === "Crew Attendance" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn max-w-lg">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Daily Crew Headcount Logs</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert("Attendance figures submitted to site supervisor!");
              }} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Skilled Masons</label>
                    <input type="number" defaultValue="25" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Carpenters / Framers</label>
                    <input type="number" defaultValue="15" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">General Labor Crew</label>
                  <input type="number" defaultValue="42" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none" required />
                </div>
                <button type="submit" className="bg-rose-600 hover:bg-rose-550 text-white font-bold py-2 px-4 rounded-lg text-xs transition">Submit Crew Sheet</button>
              </form>
            </div>
          )}

          {/* MATERIAL INDENTS */}
          {activeTab === "Material Indents" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">On-site Material Indents Status</h3>
              <div className="space-y-3">
                {[
                  { mat: "OPC 53 Cement (300 Bags)", status: "Approved & Released", date: "08 Jun 2026" },
                  { mat: "TMT Steel Ties (12mm, 5 Tons)", status: "Under Review", date: "09 Jun 2026" }
                ].map((ind, idx) => (
                  <div key={idx} className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{ind.mat}</div>
                      <span className="text-[10px] text-slate-500">Requested: {ind.date}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      ind.status === "Approved & Released" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>{ind.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI CONTRACT ASSISTANT */}
          {activeTab === "AI Contract Assistant" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                  {aiReplies.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-xl max-w-sm text-xs ${
                        msg.sender === "user" ? "bg-rose-600 text-white font-semibold shadow-md" : "bg-[#0e1628] border border-slate-850 text-slate-200"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                  <input
                    type="text"
                    placeholder="Ask AI contract assistant..."
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAIChat()}
                    className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <button onClick={() => handleSendAIChat()} className="bg-rose-600 hover:bg-rose-500 text-white p-2.5 rounded-lg transition">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Diagnostics Commands</h4>
                <div className="space-y-2.5 text-xs text-rose-450 text-rose-400">
                  <button onClick={() => handleSendAIChat("Audit recent progress claims.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-rose-500 transition block">🔮 Audit recent progress claims.</button>
                  <button onClick={() => handleSendAIChat("Predict material indent approval times.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-rose-500 transition block">🔮 Predict material indent approval times.</button>
                  <button onClick={() => handleSendAIChat("Are concrete framing milestones delayed?")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-rose-500 transition block">🔮 Are concrete framing milestones delayed?</button>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "Settings" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn max-w-xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Dashboard Profile</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Company Partner Name</label>
                  <input type="text" readOnly defaultValue="Subcontractor Hub" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Auth Email</label>
                  <input type="text" readOnly defaultValue="sub@buildcon.com" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <button onClick={() => alert("Configurations updated successfully!")} className="bg-rose-600 hover:bg-rose-550 text-white font-bold py-2 px-4 rounded-lg text-xs transition">Save configurations</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
