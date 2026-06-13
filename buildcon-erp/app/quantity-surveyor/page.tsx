"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, FileText, Target, BarChart3, Edit, TrendingUp,
  DollarSign, CheckSquare, Sparkles, Settings, LogOut, Building2, Bell, Filter, Calendar
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function QuantitySurveyorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Cost Control Center");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("09 June 2026, Tuesday");

  // --- AI States ---
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiReplies, setAiReplies] = useState<string[]>([
    "Current BOQ balance stands at ₹5.3 Cr.",
    "Steel wastage rate on slab reinforcement is 4.8% (above target 3%).",
    "Estimated cost to complete is ₹12.65 Cr based on materials index shifts."
  ]);

  const sidebarItems = [
    { name: "Cost Control Center", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "BOQ Management", icon: <FileText className="h-4 w-4" /> },
    { name: "Quantity Tracking", icon: <Target className="h-4 w-4" /> },
    { name: "Budget vs Actual", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Measurement Book", icon: <Edit className="h-4 w-4" /> },
    { name: "Client Billing", icon: <DollarSign className="h-4 w-4" /> },
    { name: "Subcontractor Billing", icon: <DollarSign className="h-4 w-4" /> },
    { name: "Variation Orders", icon: <FileText className="h-4 w-4" /> },
    { name: "Rate Analysis", icon: <TrendingUp className="h-4 w-4" /> },
    { name: "Cost Forecasting", icon: <TrendingUp className="h-4 w-4" /> },
    { name: "Claims Management", icon: <CheckSquare className="h-4 w-4" /> },
    { name: "AI Cost Assistant", icon: <Sparkles className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

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
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/15"
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
            <div className="h-9 w-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 grid place-items-center text-xs font-bold font-mono">
              MS
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">Meenakshi Sundaram</div>
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
              {activeTab.toUpperCase()} <span className="text-[10px] text-blue-450 text-blue-450 text-blue-450 text-blue-450 text-blue-400 font-normal normal-case">/ Quantity Surveyor portal</span>
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
                <option value="Skyline Residences">Skyline Residences</option>
                <option value="Greenfield Apartments">Greenfield Apartments</option>
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
                  { label: "BOQ Value", val: "₹12.5 Cr" },
                  { label: "Executed Work", val: "₹7.2 Cr", color: "text-emerald-400" },
                  { label: "Remaining Balance", val: "₹5.3 Cr", color: "text-blue-400" }
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
                      <div className="text-lg font-bold text-white font-mono mt-1">450 m³</div>
                    </div>
                    <div className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl">
                      <span className="text-slate-400">Concrete RCC</span>
                      <div className="text-lg font-bold text-white font-mono mt-1">1,200 m³</div>
                    </div>
                    <div className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl">
                      <span className="text-slate-400">Brickwork</span>
                      <div className="text-lg font-bold text-white font-mono mt-1">8,500 Sq.Ft</div>
                    </div>
                  </div>
                </div>

                {/* Variation Orders */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Variation Orders</h3>
                  <div className="flex justify-between"><span>Pending:</span> <span className="font-bold text-yellow-405 text-yellow-400 font-mono">8</span></div>
                  <div className="flex justify-between"><span>Approved:</span> <span className="font-bold text-emerald-450 text-emerald-400 font-mono">4</span></div>
                  <div className="flex justify-between border-t border-slate-800 pt-2"><span>Total Value:</span> <span className="font-bold text-white font-mono">₹18 Lakhs</span></div>
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
                    className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      if (!aiChatInput.trim()) return;
                      setAiReplies([...aiReplies, aiChatInput]);
                      setAiChatInput("");
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Recommended cost checks</h4>
                <div className="space-y-3 text-xs">
                  {["Predict final project cost.", "Which item exceeds budget?", "Material wastage analysis.", "Profitability forecast."].map((act, i) => (
                    <button key={i} onClick={() => setAiReplies([...aiReplies, `Checking request: ${act}`])} className="w-full text-left p-3 bg-[#0e1628] border border-slate-850 rounded-xl flex items-center justify-between hover:border-blue-500 transition">
                      <span className="font-semibold text-slate-200">{act}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fallback default screen for secondary tabs */}
          {activeTab !== "Cost Control Center" && activeTab !== "AI Cost Assistant" && (
            <div className="p-8 bg-[#111C30] border border-slate-800 rounded-xl text-center text-xs text-slate-400 italic animate-fadeIn">
              Module "{activeTab}" is online. Live quantities ledger records, rate analysis tables, and variation orders logs are loaded.
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
