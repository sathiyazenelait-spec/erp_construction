"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, FileText, CheckSquare, Layers, AlertOctagon,
  Bot, Settings, LogOut, Building2, Calendar, Filter, Plus, SendHorizontal, Trash2
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar
} from "recharts";

interface CubeTest {
  id: string;
  mixGrade: "M25" | "M30" | "M40";
  castDate: string;
  testAge: "7 Days" | "28 Days";
  strengthAchieved: number; // N/mm²
  targetStrength: number; // N/mm²
  status: "Pass" | "Fail" | "Pending";
}

interface BlueprintDrawing {
  id: string;
  title: string;
  category: "Structural" | "Architectural" | "MEP";
  status: "Approved" | "Under Revision" | "Clash Detected";
}

export default function SeniorSiteEngineerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Quality Control");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("09 June 2026, Tuesday");

  // --- Stateful Data ---
  const [cubeTests, setCubeTests] = useState<CubeTest[]>([
    { id: "CUB-401", mixGrade: "M30", castDate: "12 May 2026", testAge: "28 Days", strengthAchieved: 32.4, targetStrength: 30.0, status: "Pass" },
    { id: "CUB-402", mixGrade: "M40", castDate: "15 May 2026", testAge: "28 Days", strengthAchieved: 42.8, targetStrength: 40.0, status: "Pass" },
    { id: "CUB-403", mixGrade: "M30", castDate: "02 Jun 2026", testAge: "7 Days", strengthAchieved: 21.2, targetStrength: 20.0, status: "Pass" },
    { id: "CUB-404", mixGrade: "M40", castDate: "05 Jun 2026", testAge: "7 Days", strengthAchieved: 18.5, targetStrength: 26.0, status: "Fail" },
    { id: "CUB-405", mixGrade: "M30", castDate: "08 Jun 2026", testAge: "7 Days", strengthAchieved: 0, targetStrength: 20.0, status: "Pending" }
  ]);

  const [drawings, setDrawings] = useState<BlueprintDrawing[]>([
    { id: "DWG-101", title: "Tower A Structural Column Rebar Layout", category: "Structural", status: "Approved" },
    { id: "DWG-102", title: "Tower B HVAC Duct Routing Plan", category: "MEP", status: "Clash Detected" },
    { id: "DWG-103", title: "Ground Level Entrance Lobby Elevation", category: "Architectural", status: "Approved" },
    { id: "DWG-104", title: "Basement Drainage and Riser Plumbing Layout", category: "MEP", status: "Under Revision" }
  ]);

  const [newGrade, setNewGrade] = useState<"M25" | "M30" | "M40">("M30");
  const [newAge, setNewAge] = useState<"7 Days" | "28 Days">("7 Days");
  const [newStrength, setNewStrength] = useState("");

  const [aiChatInput, setAiChatInput] = useState("");
  const [aiReplies, setAiReplies] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Karthick! I'm your AI Quality Control & Engineering Assistant. Ask me to analyze concrete strength variations, highlight drawings conflicts, or log Non-Conformity reports." }
  ]);

  // Chart datasets
  const strengthChartData = cubeTests.filter(t => t.status !== "Pending").map(t => ({
    id: t.id,
    Grade: t.mixGrade,
    Achieved: t.strengthAchieved,
    Required: t.targetStrength
  }));

  const sidebarItems = [
    { name: "Quality Control", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Cube Testing Logs", icon: <FileText className="h-4 w-4" /> },
    { name: "Blueprint Catalog", icon: <Layers className="h-4 w-4" /> },
    { name: "NCR Records", icon: <AlertOctagon className="h-4 w-4" /> },
    { name: "AI Quality Engineer", icon: <Bot className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const handleAddCubeTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrength.trim()) return;
    const strengthVal = parseFloat(newStrength);
    let targetVal = 20;
    if (newGrade === "M30") targetVal = 30;
    if (newGrade === "M40") targetVal = 40;
    if (newAge === "7 Days") targetVal = targetVal * 0.67; // approx 67% strength in 7 days

    setCubeTests([
      ...cubeTests,
      {
        id: `CUB-${Math.floor(400 + Math.random() * 90)}`,
        mixGrade: newGrade,
        castDate: "09 Jun 2026",
        testAge: newAge,
        strengthAchieved: strengthVal,
        targetStrength: Math.round(targetVal * 10) / 10,
        status: strengthVal >= targetVal ? "Pass" : "Fail"
      }
    ]);
    setNewStrength("");
  };

  const handleSendAIChat = (text?: string) => {
    const input = text || aiChatInput;
    if (!input.trim()) return;
    setAiReplies(prev => [...prev, { sender: "user", text: input }]);
    if (!text) setAiChatInput("");

    setTimeout(() => {
      let response = "I am processing quality compliance sheets. Cube test success rate stands at 91.6%.";
      if (input.toLowerCase().includes("cube") || input.toLowerCase().includes("strength")) {
        response = "Concrete Quality Alert: Cube test CUB-404 (Grade M40, 7 Days age) achieved 18.5 N/mm² vs required 26.0 N/mm² target. This marks a significant strength deficit. Recommend checking water-cement ratio logs.";
      } else if (input.toLowerCase().includes("clash") || input.toLowerCase().includes("drawing")) {
        response = "Blueprint Conflict: DWG-102 HVAC Duct Routing Plan clashes with main structural beam structural anchors in Tower B (Sector 3). Re-routing recommended to avoid Core cuts.";
      } else if (input.toLowerCase().includes("ncr") || input.toLowerCase().includes("conformity")) {
        response = "NCR Report Needed: Cube test fail on CUB-404 requires a formal Non-Conformity Report issued to the Concrete Specialist Subcontractor.";
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
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 grid place-items-center shadow-lg shadow-purple-500/20">
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
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md shadow-purple-500/15"
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
            <div className="h-9 w-9 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 grid place-items-center text-xs font-bold font-mono">
              KS
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">Karthick Swaminathan</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Senior Site Engineer</div>
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
              {activeTab.toUpperCase()} <span className="text-[10px] text-purple-400 font-normal normal-case">/ Senior Engineer portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Release drawing revisions, track concrete cube test logs, and inspect CAD clash reports.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#111C30] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Filter className="h-3 w-3 text-purple-400" />
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
              <Calendar className="h-3.5 w-3.5 text-purple-400" />
              <span>{dateFilter}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {/* QUALITY CONTROL */}
          {activeTab === "Quality Control" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-4 text-xs">
                {[
                  { label: "Total Cube Tests MTD", val: "24 Tests", desc: "For structural concrete mixes" },
                  { label: "Passed Tests", val: "22 Passed", desc: "91.6% success rate" },
                  { label: "Active NCRs", val: "1 Alert", desc: "CUB-404 compressive failure" },
                  { label: "Drawing Conflicts", val: "1 Conflict", desc: "Tower B HVAC clash detected" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                    <span className="text-[10px] text-slate-555 text-slate-400 block mt-1.5">{s.desc}</span>
                  </div>
                ))}
              </div>

              {/* Compressive strength chart */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Compressive Strength Trends (N/mm²)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={strengthChartData}>
                      <XAxis dataKey="id" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" name="Achieved Strength" dataKey="Achieved" stroke="#A855F7" fill="#A855F7" fillOpacity={0.1} />
                      <Area type="monotone" name="Required Strength" dataKey="Required" stroke="#64748B" fill="#64748B" fillOpacity={0.05} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* CUBE TESTING LOGS */}
          {activeTab === "Cube Testing Logs" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleAddCubeTest} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex gap-3 items-end">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Mix Concrete Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as "M25" | "M30" | "M40")}
                    className="w-full bg-[#0a1120] text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs outline-none"
                  >
                    <option value="M25">M25 Grade</option>
                    <option value="M30">M30 Grade</option>
                    <option value="M40">M40 Grade</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Testing Age Interval</label>
                  <select
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value as "7 Days" | "28 Days")}
                    className="w-full bg-[#0a1120] text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs outline-none"
                  >
                    <option value="7 Days">7 Days Interval</option>
                    <option value="28 Days">28 Days Interval</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-1">Compaction Compressive Force Achieved (N/mm²)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 24.5"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition flex items-center gap-1.5 h-[34px]">
                  <Plus className="h-4 w-4" /> Log Test Result
                </button>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Historical Cube Compaction Logs</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-3 px-2">Test ID</th>
                        <th className="py-3 px-2">Grade</th>
                        <th className="py-3 px-2">Cast Date</th>
                        <th className="py-3 px-2">Age</th>
                        <th className="py-3 px-2 text-right">Strength (N/mm²)</th>
                        <th className="py-3 px-2 text-right">Target Strength (N/mm²)</th>
                        <th className="py-3 px-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cubeTests.map((t) => (
                        <tr key={t.id} className="border-b border-slate-800/50 hover:bg-white/5">
                          <td className="py-3 px-2 font-mono text-slate-400">{t.id}</td>
                          <td className="py-3 px-2 font-bold text-white">{t.mixGrade}</td>
                          <td className="py-3 px-2 text-slate-400">{t.castDate}</td>
                          <td className="py-3 px-2 text-slate-400">{t.testAge}</td>
                          <td className="py-3 px-2 text-right font-mono font-bold text-white">{t.strengthAchieved || "-"}</td>
                          <td className="py-3 px-2 text-right font-mono text-slate-400">{t.targetStrength}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              t.status === "Pass" ? "bg-emerald-500/10 text-emerald-400" :
                              t.status === "Fail" ? "bg-red-500/10 text-red-400" : "bg-slate-850 text-slate-400"
                            }`}>{t.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BLUEPRINT CATALOG */}
          {activeTab === "Blueprint Catalog" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">CAD Blueprints Catalog</h3>
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                {drawings.map((dwg) => (
                  <div key={dwg.id} className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-mono text-[9px] text-purple-400 font-bold uppercase">{dwg.category}</div>
                      <div className="font-bold text-white mt-0.5">{dwg.title}</div>
                      <span className="text-[10px] text-slate-500 font-mono">Drawing Ref: {dwg.id}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      dwg.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" :
                      dwg.status === "Clash Detected" ? "bg-red-500/10 text-red-450 text-red-450 text-red-450 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400"
                    }`}>{dwg.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NCR RECORDS */}
          {activeTab === "NCR Records" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Non-Conformity Reports (NCR)</h3>
              <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl text-xs space-y-2">
                <div className="font-bold text-red-400 flex items-center gap-1.5">
                  <AlertOctagon className="h-4 w-4" /> NCR-2026-001: M40 Concrete Compressive Deficit (Tower A columns)
                </div>
                <p className="text-slate-300">
                  Slab concrete cast on June 5 failed Compaction Cube test limit (measured 18.5 N/mm² against required 26.0 N/mm²).
                </p>
                <div className="flex gap-4 text-[10px] text-slate-500 font-mono pt-1">
                  <span>Logged Date: 09 Jun 2026</span>
                  <span>Issued To: Concrete Specialist Contractor</span>
                  <span>Status: Open / Under Inspection</span>
                </div>
              </div>
            </div>
          )}

          {/* AI QUALITY ENGINEER */}
          {activeTab === "AI Quality Engineer" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                  {aiReplies.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-xl max-w-sm text-xs ${
                        msg.sender === "user" ? "bg-purple-600 text-white font-semibold shadow-md" : "bg-[#0e1628] border border-slate-850 text-slate-200"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                  <input
                    type="text"
                    placeholder="Ask AI quality checker..."
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAIChat()}
                    className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button onClick={() => handleSendAIChat()} className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-lg transition">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Diagnostics Commands</h4>
                <div className="space-y-2.5 text-xs text-purple-400">
                  <button onClick={() => handleSendAIChat("Audit concrete cube test compressive variations.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-purple-500 transition block">🔮 Audit concrete cube test compressive variations.</button>
                  <button onClick={() => handleSendAIChat("Check drawing structural clashes.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-purple-500 transition block">🔮 Check drawing structural clashes.</button>
                  <button onClick={() => handleSendAIChat("Draft NCR for failed cube tests.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-purple-500 transition block">🔮 Draft NCR for failed cube tests.</button>
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
                  <input type="text" readOnly defaultValue="Karthick Swaminathan" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                  <input type="text" readOnly defaultValue="senior-eng@buildcon.com" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <button onClick={() => alert("Configurations updated successfully!")} className="bg-purple-600 hover:bg-purple-550 text-white font-bold py-2 px-4 rounded-lg text-xs transition">Save configurations</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
