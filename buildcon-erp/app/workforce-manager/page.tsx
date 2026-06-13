"use client";
import React, { useState } from "react";
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
  id: string;
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
  const [dateFilter, setDateFilter] = useState("09 June 2026, Tuesday");

  // --- Stateful Data ---
  const [workers, setWorkers] = useState<Worker[]>([
    { id: "WRK-001", name: "Ramesh Kumar", mobile: "9876543210", aadhaar: "4532-8765-1092", subcontractor: "Subcontractor Hub", category: "Mason", verificationStatus: "Verified", photoUploaded: true },
    { id: "WRK-002", name: "Murugan Swamy", mobile: "8765432109", aadhaar: "9812-7634-9012", subcontractor: "Subcontractor Hub", category: "Labourer", verificationStatus: "Verified", photoUploaded: true },
    { id: "WRK-003", name: "Shankar Das", mobile: "7654321098", aadhaar: "1098-2345-6712", subcontractor: "Subcontractor Hub", category: "Carpenter", verificationStatus: "Pending Verification", photoUploaded: false },
    { id: "WRK-004", name: "Amit Sharma", mobile: "9012345678", aadhaar: "7612-9834-0192", subcontractor: "Indo Builders", category: "Electrician", verificationStatus: "Verified", photoUploaded: true },
    { id: "WRK-005", name: "Vicky Yadav", mobile: "9988776655", aadhaar: "3490-1289-5634", subcontractor: "Indo Builders", category: "Labourer", verificationStatus: "Unverified", photoUploaded: false },
  ]);

  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerMobile, setNewWorkerMobile] = useState("");
  const [newWorkerAadhaar, setNewWorkerAadhaar] = useState("");
  const [newWorkerSub, setNewWorkerSub] = useState("Subcontractor Hub");
  const [newWorkerCat, setNewWorkerCat] = useState<"Mason" | "Carpenter" | "Electrician" | "Plumber" | "Labourer">("Labourer");

  const [aiChatInput, setAiChatInput] = useState("");
  const [aiReplies, setAiReplies] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Arunachalam! I'm your AI Workforce Assistant. I audit contractor crew size compliance, flag verification anomalies, and help allocate labour based on schedule critical paths." }
  ]);

  // Chart datasets
  const attendanceTrendData = [
    { day: "Mon", Masons: 22, Labourers: 85, Carpenters: 14 },
    { day: "Tue", Masons: 24, Labourers: 90, Carpenters: 15 },
    { day: "Wed", Masons: 18, Labourers: 72, Carpenters: 12 }, // rainy day
    { day: "Thu", Masons: 25, Labourers: 94, Carpenters: 16 },
    { day: "Fri", Masons: 25, Labourers: 92, Carpenters: 15 },
  ];

  const sidebarItems = [
    { name: "Workforce Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Worker Database", icon: <Users className="h-4 w-4" /> },
    { name: "Headcount Audits", icon: <UserCheck className="h-4 w-4" /> },
    { name: "Payroll Integration", icon: <FileText className="h-4 w-4" /> },
    { name: "AI Workforce Planner", icon: <Bot className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const handleRegisterWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName.trim() || !newWorkerMobile.trim() || !newWorkerAadhaar.trim()) return;
    setWorkers([
      ...workers,
      {
        id: `WRK-${Math.floor(100 + Math.random() * 900)}`,
        name: newWorkerName,
        mobile: newWorkerMobile,
        aadhaar: newWorkerAadhaar,
        subcontractor: newWorkerSub,
        category: newWorkerCat,
        verificationStatus: "Pending Verification",
        photoUploaded: false
      }
    ]);
    setNewWorkerName("");
    setNewWorkerMobile("");
    setNewWorkerAadhaar("");
  };

  const handleSendAIChat = (text?: string) => {
    const input = text || aiChatInput;
    if (!input.trim()) return;
    setAiReplies(prev => [...prev, { sender: "user", text: input }]);
    if (!text) setAiChatInput("");

    setTimeout(() => {
      let response = "I am analyzing workforce metrics. Active headcount is 132 across all contractors.";
      if (input.toLowerCase().includes("aadhaar") || input.toLowerCase().includes("verify")) {
        response = "Aadhaar Compliance Alert: 2 profiles require urgent document verification. Shankar Das (WRK-003) and Vicky Yadav (WRK-005) have unsubmitted details or photo mismatches.";
      } else if (input.toLowerCase().includes("allocation") || input.toLowerCase().includes("critical")) {
        response = "Allocation Suggestion: Critical concrete pour planned for Tower A on Thursday. Recommend shifting 5 general labourers from excavation team to Concrete Specialist crew.";
      } else if (input.toLowerCase().includes("payroll") || input.toLowerCase().includes("subcontractor")) {
        response = "Payroll Notice: Attendance data is automatically mapped to Subcontractor Hub billing. Cash payments processed by contractors are cross-referenced with daily supervisor attendance checklists.";
      }
      setAiReplies(prev => [...prev, { sender: "bot", text: response }]);
    }, 1000);
  };

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
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-md shadow-orange-500/15"
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
            <div className="h-9 w-9 rounded-full bg-amber-600/20 text-amber-400 border border-amber-500/30 grid place-items-center text-xs font-bold font-mono">
              AP
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">Arunachalam P.</div>
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
                <option value="Skyline Residences">Skyline Residences</option>
                <option value="Greenfield Apartments">Greenfield Apartments</option>
              </select>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>{dateFilter}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {/* WORKFORCE OVERVIEW */}
          {activeTab === "Workforce Overview" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-4 text-xs">
                {[
                  { label: "Active Labourers", val: "131 Workers", desc: "Across 2 subcontractor groups" },
                  { label: "Subcontractor Crews", val: "2 Groups", desc: "Subcontractor Hub, Indo Builders" },
                  { label: "Aadhaar Verified", val: "92.4%", desc: "121 profiles fully verified" },
                  { label: "Attendance Rate Today", val: "94.2%", desc: "10 absent today" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                    <span className="text-[10px] text-slate-550 text-slate-400 block mt-1.5">{s.desc}</span>
                  </div>
                ))}
              </div>

              {/* Attendance charts */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Weekly Attendance Attendance Chart</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceTrendData}>
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
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 h-[34px]">
                    <Plus className="h-4 w-4" /> Register Profile
                  </button>
                </div>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Registered Workers Directory</h3>
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
                      {workers.map((w) => (
                        <tr key={w.id} className="border-b border-slate-800/50 hover:bg-white/5">
                          <td className="py-3 px-2 font-mono text-slate-400">{w.id}</td>
                          <td className="py-3 px-2 font-bold text-white">{w.name} ({w.category})</td>
                          <td className="py-3 px-2 font-mono text-slate-400">{w.mobile}</td>
                          <td className="py-3 px-2 font-mono text-slate-400">{w.aadhaar}</td>
                          <td className="py-3 px-2 text-slate-300">{w.subcontractor}</td>
                          <td className="py-3 px-2 text-[10px] text-slate-450">
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
              </div>
            </div>
          )}

          {/* HEADCOUNT AUDITS */}
          {activeTab === "Headcount Audits" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Daily Subcontractor Headcount Verification</h3>
              <div className="space-y-3">
                {[
                  { contractor: "Subcontractor Hub", expected: 80, actual: 78, variance: -2, status: "Verified" },
                  { contractor: "Indo Builders", expected: 55, actual: 54, variance: -1, status: "Verified" }
                ].map((aud, idx) => (
                  <div key={idx} className="p-4 bg-[#0e1628] border border-slate-855 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{aud.contractor}</div>
                      <span className="text-[10px] text-slate-500 mt-0.5">Expected Crew: {aud.expected} | Actual Count: {aud.actual} | Variance: {aud.variance}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{aud.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYROLL INTEGRATION */}
          {activeTab === "Payroll Integration" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn max-w-xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Payroll & Cash Settlement Guidelines</h3>
              <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl text-xs space-y-3 leading-relaxed text-slate-300">
                <p className="font-bold text-white">Direct Labor Payments Exclusion Rule:</p>
                <p>
                  1. The workforce manager is <strong>NOT</strong> directly responsible for salary processing, bank deposits, or cash handling.
                </p>
                <p>
                  2. Subcontractors are paid monthly based on their progress claims billing (certified by the Project Manager / Quantity Surveyor and processed by Finance & Accounts).
                </p>
                <p>
                  3. Subcontractors pay their laborers directly in cash or bank transfer. The workforce database logs mobile numbers and attendance to cross-verify that subcontractors match headcount audits and safety limits.
                </p>
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
                  <button onClick={() => handleSendAIChat()} className="bg-amber-600 hover:bg-amber-500 text-slate-950 p-2.5 rounded-lg transition">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Diagnostics Commands</h4>
                <div className="space-y-2.5 text-xs text-amber-400">
                  <button onClick={() => handleSendAIChat("Audit worker Aadhaar verification statuses.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-amber-500 transition block">🔮 Audit worker Aadhaar verification statuses.</button>
                  <button onClick={() => handleSendAIChat("Optimize critical path labor allocation.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-amber-500 transition block">🔮 Optimize critical path labor allocation.</button>
                  <button onClick={() => handleSendAIChat("Explain payroll integration rules.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-amber-500 transition block">🔮 Explain payroll integration rules.</button>
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
                  <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                  <input type="text" readOnly defaultValue="Arunachalam P." className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                  <input type="text" readOnly defaultValue="workforce@buildcon.com" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <button onClick={() => alert("Configurations updated successfully!")} className="bg-amber-600 hover:bg-amber-550 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">Save configurations</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
