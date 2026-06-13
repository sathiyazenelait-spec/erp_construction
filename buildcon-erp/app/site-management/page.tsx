"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, ClipboardList, ShieldCheck, Thermometer, Construction,
  Bot, Settings, LogOut, Building2, Calendar, Filter, Plus, SendHorizontal, Check,
  Sparkles, UploadCloud
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line
} from "recharts";

interface SiteLog {
  id: string;
  activity: string;
  zone: string;
  workforceCount: number;
  status: "Completed" | "In Progress" | "Delayed";
}

interface SafetyItem {
  id: string;
  rule: string;
  checked: boolean;
}

export default function SiteManagementDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Daily Logs");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("09 June 2026, Tuesday");

  // --- AI Progress & Delay states ---
  const [sitePhotoName, setSitePhotoName] = useState("");
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [visionReport, setVisionReport] = useState<any | null>(null);
  const [alertDispatched, setAlertDispatched] = useState(false);

  // --- Stateful Data ---
  const [siteLogs, setSiteLogs] = useState<SiteLog[]>([
    { id: "LOG-01", activity: "Tower B - Slab 12 Concrete Casting", zone: "Zone A", workforceCount: 28, status: "Completed" },
    { id: "LOG-02", activity: "Basement - Foundation waterproofing membrane placement", zone: "Basement", workforceCount: 12, status: "In Progress" },
    { id: "LOG-03", activity: "Tower A - Exterior Brick Masonry plastering", zone: "Zone B", workforceCount: 15, status: "In Progress" },
    { id: "LOG-04", activity: "Plumbing shafts riser installations", zone: "Zone C", workforceCount: 6, status: "Delayed" }
  ]);

  const [newLogActivity, setNewLogActivity] = useState("");
  const [newLogZone, setNewLogZone] = useState("Zone A");
  const [newLogWorkers, setNewLogWorkers] = useState("");

  const [safetyRules, setSafetyRules] = useState<SafetyItem[]>([
    { id: "S-01", rule: "All crew members wearing ISI helmets and steel-toe safety boots", checked: true },
    { id: "S-02", rule: "Scaffolding scaffolding anchoring rings verified & tagged green", checked: true },
    { id: "S-03", rule: "Temporary electrical grounding boxes and cables fully insulated", checked: false },
    { id: "S-04", rule: "Safety netting deployed around high-rise slab edges on Tower B", checked: true },
  ]);

  const [aiChatInput, setAiChatInput] = useState("");
  const [aiReplies, setAiReplies] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Vijay! I'm your AI Site Operations Assistant. Ask me to forecast concrete curing rates, inspect safety risk metrics, or predict precipitation delays." }
  ]);

  // Chart datasets
  const productivityData = [
    { day: "Mon", Target: 100, Achieved: 95 },
    { day: "Tue", Target: 100, Achieved: 98 },
    { day: "Wed", Target: 100, Achieved: 85 }, // Rain delay
    { day: "Thu", Target: 100, Achieved: 105 },
    { day: "Fri", Target: 100, Achieved: 102 },
  ];

  const sidebarItems = [
    { name: "Daily Logs", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Safety Audits", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Productivity Index", icon: <Construction className="h-4 w-4" /> },
    { name: "On-site Materials Request", icon: <ClipboardList className="h-4 w-4" /> },
    { name: "AI Progress & Delay Analyzer", icon: <Sparkles className="h-4 w-4 text-amber-400" /> },
    { name: "AI Site Operations", icon: <Bot className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogActivity.trim() || !newLogWorkers.trim()) return;
    setSiteLogs([
      ...siteLogs,
      {
        id: `LOG-${Math.floor(10 + Math.random() * 90)}`,
        activity: newLogActivity,
        zone: newLogZone,
        workforceCount: parseInt(newLogWorkers),
        status: "In Progress"
      }
    ]);
    setNewLogActivity("");
    setNewLogWorkers("");
  };

  const toggleSafetyItem = (id: string) => {
    setSafetyRules(safetyRules.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleSendAIChat = (text?: string) => {
    const input = text || aiChatInput;
    if (!input.trim()) return;
    setAiReplies(prev => [...prev, { sender: "user", text: input }]);
    if (!text) setAiChatInput("");

    setTimeout(() => {
      let response = "I am tracking site meteorological trends. The local sensor registers 34°C with 62% relative humidity.";
      if (input.toLowerCase().includes("cure") || input.toLowerCase().includes("concrete")) {
        response = "Concrete Curing Forecast: Tower B Slab-12 requires approximately 7 days of moist curing to reach 70% characteristic compressive strength. Current ambient heat demands hydration spray cycles twice daily.";
      } else if (input.toLowerCase().includes("weather") || input.toLowerCase().includes("rain")) {
        response = "Weather Alert: 45% probability of brief thundershowers forecast tomorrow afternoon. Suggest completing exterior brickwork plastering before 1 PM and securing electrical panels.";
      } else if (input.toLowerCase().includes("safety") || input.toLowerCase().includes("hazard")) {
        response = "Safety Check: Item S-03 (Temporary electrical grounding boxes) is unchecked. High risk of electrical hazards during rain. Recommend immediate inspection.";
      }
      setAiReplies(prev => [...prev, { sender: "bot", text: response }]);
  };

  const handleUploadSitePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sitePhotoName) return;
    setIsScanningPhoto(true);
    setVisionReport(null);
    setAlertDispatched(false);

    try {
      const formData = new FormData();
      const fileBlob = new Blob(["site-photo-data"], { type: "image/jpeg" });
      formData.append("file", fileBlob, sitePhotoName);

      const res = await fetch("http://localhost:8000/api/ai/analyze-progress", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setVisionReport(data);
      } else {
        throw new Error("FastAPI vision error");
      }
    } catch (err) {
      console.warn("AI vision backend unreachable, falling back to simulated pipeline:", err);
      setTimeout(() => {
        setVisionReport({
          progressRatio: "74%",
          predictedDelayDays: 12,
          detectedIssues: [
            "Tower B Slab-12 scaffolding alignment shows 3.5cm skew. Corrective anchoring required.",
            "Warning: Reinforcement steel rebar laying is 2 days behind scheduling timeline.",
            "High delay risk warning: Concrete mixer accessibility path blocked by raw earth piles."
          ]
        });
      }, 1000);
    } finally {
      setIsScanningPhoto(false);
    }
  };

  const handleDispatchAlert = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chairman_delay_alert_msg", "Tower B Concreting delayed by 12 days. Scaffolding alignment skew detected at Sector 2.");
      localStorage.setItem("chairman_delay_alert_time", new Date().toLocaleTimeString());
      setAlertDispatched(true);
      alert("Delay warning alert has been sent to Chairman & Board portal successfully.");
    }
  };

  return (
    <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 grid place-items-center shadow-lg shadow-orange-500/20">
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
              VR
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">Vijay Raghavan</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Site Management</div>
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
              {activeTab.toUpperCase()} <span className="text-[10px] text-amber-400 font-normal normal-case">/ Site management portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Audit site safety standards, track daily logs diary, and submit material requests.</p>
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

          {/* DAILY LOGS */}
          {activeTab === "Daily Logs" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleAddLog} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-1">On-Site Activity Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Masonry wall alignment checks Tower A"
                    value={newLogActivity}
                    onChange={(e) => setNewLogActivity(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
                <div className="w-32">
                  <label className="text-[10px] text-slate-400 block mb-1">Zone / Area</label>
                  <select
                    value={newLogZone}
                    onChange={(e) => setNewLogZone(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none"
                  >
                    <option value="Zone A">Zone A</option>
                    <option value="Zone B">Zone B</option>
                    <option value="Zone C">Zone C</option>
                    <option value="Basement">Basement</option>
                  </select>
                </div>
                <div className="w-28">
                  <label className="text-[10px] text-slate-400 block mb-1">Crew Count</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={newLogWorkers}
                    onChange={(e) => setNewLogWorkers(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition flex items-center gap-1.5 h-[34px]">
                  <Plus className="h-4 w-4" /> Add Log Entry
                </button>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Today's Active Logs Diary</h3>
                <div className="space-y-3">
                  {siteLogs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0e1628] border border-slate-850 text-xs">
                      <div>
                        <div className="font-bold text-white">{log.activity}</div>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {log.id} | Location: {log.zone} | Workforce: {log.workforceCount} labourers</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        log.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" :
                        log.status === "In Progress" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                      }`}>{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SAFETY AUDITS */}
          {activeTab === "Safety Audits" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Site Safety Checklists</h3>
              <div className="space-y-3">
                {safetyRules.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleSafetyItem(item.id)}
                    className="w-full text-left flex items-start gap-3 p-3.5 bg-[#0e1628] rounded-xl border border-slate-850 hover:bg-white/5 transition text-xs"
                  >
                    <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                      item.checked ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-700 bg-[#0a1120]"
                    }`}>
                      {item.checked && <Check className="h-3 w-3" />}
                    </div>
                    <div>
                      <div className={`font-semibold ${item.checked ? "text-slate-400 line-through" : "text-white"}`}>{item.rule}</div>
                      <span className="text-[9px] text-slate-500 uppercase mt-0.5 font-mono">{item.id}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTIVITY INDEX */}
          {activeTab === "Productivity Index" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Daily Site Work Accomplished vs Target (Sft/Day)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivityData}>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar name="Target Performance" dataKey="Target" fill="#475569" radius={[4, 4, 0, 0]} />
                    <Bar name="Actual Output" dataKey="Achieved" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ON-SITE MATERIALS REQUEST */}
          {activeTab === "On-site Materials Request" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Raise Site Store Indent</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert("Site material request submitted to Procurement!");
              }} className="space-y-4 text-xs max-w-lg">
                <div>
                  <label className="text-[10px] text-slate-450 text-slate-400 block mb-1">Select Material Name</label>
                  <select className="w-full bg-[#0a1120] text-slate-200 border border-slate-800 rounded-lg p-2.5 outline-none">
                    <option>OPC 53 Cement Bags</option>
                    <option>River Sand (m³)</option>
                    <option>Rebar Steel Ties (Tons)</option>
                    <option>PVC Conduit Cones</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-450 text-slate-400 block mb-1">Urgent Delivery Quantity</label>
                  <input type="text" placeholder="e.g. 50 Bags" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] text-slate-450 text-slate-400 block mb-1">Purpose / Sector Details</label>
                  <textarea placeholder="e.g. Columns concreting Sector 2 foundation" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none h-20" required />
                </div>
                <button type="submit" className="bg-amber-600 hover:bg-amber-550 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs transition">Submit Indent Request</button>
              </form>
            </div>
          )}

          {/* AI PROGRESS & DELAY ANALYZER */}
          {activeTab === "AI Progress & Delay Analyzer" && (
            <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500" /> Daily Site Progress vision check
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  During construction, upload daily pictures of active building zones. The Python Generative AI scans structural layouts via computer vision to calculate timeline progress percentages and predict delays.
                </p>

                <form onSubmit={handleUploadSitePhoto} className="space-y-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Upload Daily Photo of Active Concreting / Construction Zone</label>
                    <div className="border border-dashed border-slate-700 bg-[#0a1120] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-colors" onClick={() => {
                      const fileNames = ["DSC_0492_towerB_slab12.jpg", "site_view_columns_ground.png", "elevation_brickwork_sector4.jpg"];
                      setSitePhotoName(fileNames[Math.floor(Math.random() * fileNames.length)]);
                    }}>
                      <UploadCloud className="h-9 w-9 text-slate-500 mb-2" />
                      <span className="text-slate-350 font-bold">{sitePhotoName || "Capture or upload site photo"}</span>
                      <span className="text-[9px] text-slate-500 mt-1">Accepts PNG, JPG, JPEG up to 25MB</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isScanningPhoto}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition shadow-md shadow-orange-500/10 disabled:opacity-50"
                  >
                    {isScanningPhoto ? "Computer Vision Model Segmenting Layout..." : "Submit Photo for AI Timeline Analysis"}
                  </button>
                </form>
              </div>

              {/* AI VISION OUTPUT */}
              <div className="bg-[#111C30]/40 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">AI Image Inspection Output</h3>

                {visionReport ? (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    <div className="p-4 bg-[#0e1628] border border-slate-800 rounded-xl grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Calculated Concreting Progress</span>
                        <span className="text-base font-bold font-mono text-emerald-400">{visionReport.progressRatio}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Predicted Time Delay</span>
                        <span className="text-base font-bold font-mono text-rose-400">{visionReport.predictedDelayDays} Days</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">AI Detected On-Site Inconsistencies:</span>
                      {visionReport.detectedIssues.map((issue: string, idx: number) => (
                        <div key={idx} className="p-3 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl text-[11px] leading-relaxed">
                          ⚠️ {issue}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={handleDispatchAlert}
                        disabled={alertDispatched}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                          alertDispatched ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-650/10"
                        }`}
                      >
                        {alertDispatched ? "✓ Delay Warning Sent" : "Dispatch Delay Warning to Chairman & Heads"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center text-slate-500 p-6">
                    <Bot className="h-8 w-8 text-slate-600 mb-2" />
                    <span>Upload a daily zone snapshot on the left to trigger the AI Computer Vision analysis report.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI SITE OPERATIONS */}
          {activeTab === "AI Site Operations" && (
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
                    placeholder="Ask AI site planner..."
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
                  <button onClick={() => handleSendAIChat("Forecast concrete curing rate for Slab-12.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-amber-500 transition block">🔮 Forecast concrete curing rate for Slab-12.</button>
                  <button onClick={() => handleSendAIChat("Show precipitation/weather risks.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-amber-500 transition block">🔮 Show precipitation/weather risks.</button>
                  <button onClick={() => handleSendAIChat("Check safety check compliance issues.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-amber-500 transition block">🔮 Check safety check compliance issues.</button>
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
                  <input type="text" readOnly defaultValue="Vijay Raghavan" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                  <input type="text" readOnly defaultValue="site@buildcon.com" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
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
