"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, Target, Activity, Search, Send, Compass, Share2,
  Calendar, Users, DollarSign, CheckSquare, LineChart, Bot, Settings,
  LogOut, Building2, Bell, Sparkles, Filter, ChevronRight, Plus, Check,
  AlertCircle, ArrowUpRight, TrendingUp, RefreshCw, SendHorizontal, Trash2
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line, Legend
} from "recharts";

// --- Types & Mock Data ---
interface Campaign {
  id: string;
  name: string;
  platform: string;
  leads: number;
  cost: number;
  roi: number;
  status: "Excellent" | "Good" | "Average" | "Poor";
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tasksAssigned: number;
  tasksCompleted: number;
  leadsGenerated: number;
  avatar: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: number; // Day of month (May 2025)
  channel: "Instagram" | "Facebook" | "LinkedIn" | "YouTube" | "Blog";
  status: "Draft" | "Scheduled" | "Published";
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  quality: "High" | "Medium" | "Low";
  status: "New" | "Nurturing" | "Qualified" | "Disqualified";
  date: string;
}

export default function DigitalMarketingTLDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Executive Summary");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("01 May 2025 - 31 May 2025");

  // --- Stateful Data ---
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: "1", name: "Villa Campaign", platform: "Google Ads", leads: 220, cost: 80000, roi: 5.2, status: "Excellent" },
    { id: "2", name: "Apartment Campaign", platform: "Meta Ads", leads: 180, cost: 65000, roi: 4.6, status: "Good" },
    { id: "3", name: "Commercial Campaign", platform: "Meta Ads", leads: 120, cost: 55000, roi: 3.8, status: "Good" },
    { id: "4", name: "Brand Awareness", platform: "Google Ads", leads: 90, cost: 28000, roi: 2.9, status: "Average" },
    { id: "5", name: "Retargeting Campaign", platform: "Meta Ads", leads: 80, cost: 22000, roi: 4.1, status: "Good" },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "Ananya Verma", role: "Executive", tasksAssigned: 45, tasksCompleted: 42, leadsGenerated: 210, avatar: "AV" },
    { id: "2", name: "Rohit Mehta", role: "Executive", tasksAssigned: 38, tasksCompleted: 36, leadsGenerated: 180, avatar: "RM" },
    { id: "3", name: "Neha Gupta", role: "Executive", tasksAssigned: 41, tasksCompleted: 39, leadsGenerated: 195, avatar: "NG" },
    { id: "4", name: "Arjun Rao", role: "Executive", tasksAssigned: 35, tasksCompleted: 31, leadsGenerated: 165, avatar: "AR" },
  ]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Project Reel", date: 1, channel: "Instagram", status: "Published" },
    { id: "2", title: "Construction Tips", date: 3, channel: "Facebook", status: "Published" },
    { id: "3", title: "Behind the Scenes", date: 9, channel: "YouTube", status: "Published" },
    { id: "4", title: "Modern Apartments Showcase", date: 12, channel: "Instagram", status: "Scheduled" },
    { id: "5", title: "Team Spotlight", date: 16, channel: "LinkedIn", status: "Scheduled" },
    { id: "6", title: "SEO Blog Post", date: 20, channel: "Blog", status: "Draft" },
    { id: "7", title: "Project Update", date: 26, channel: "LinkedIn", status: "Draft" },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "Karan Johar", email: "karan@example.com", phone: "+91 98765 43210", source: "Google Ads", quality: "High", status: "Qualified", date: "2025-05-24" },
    { id: "2", name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 87654 32109", source: "Website", quality: "Medium", status: "Nurturing", date: "2025-05-23" },
    { id: "3", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 76543 21098", source: "Meta Ads", quality: "High", status: "New", date: "2025-05-22" },
    { id: "4", name: "Pooja Patel", email: "pooja@example.com", phone: "+91 65432 10987", source: "Instagram", quality: "Low", status: "Disqualified", date: "2025-05-21" },
    { id: "5", name: "Amit Verma", email: "amit@example.com", phone: "+91 54321 09876", source: "Referrals", quality: "Medium", status: "Qualified", date: "2025-05-20" },
  ]);

  // --- Form States ---
  const [newCampaign, setNewCampaign] = useState({ name: "", platform: "Google Ads", leads: 50, cost: 20000, roi: 3.0, status: "Good" as any });
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", source: "Google Ads", quality: "High" as any, status: "New" as any });
  const [newEvent, setNewEvent] = useState({ title: "", date: 15, channel: "Instagram" as any, status: "Draft" as any });
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Priya! I'm your AI Marketing Assistant. I can help analyze your campaigns, budget shifts, and optimize leads. Ask me anything!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [settings, setSettings] = useState({
    alertThreshold: 450,
    notificationEmails: true,
    weeklyReports: true,
    leadScoringMin: 65,
  });

  // --- Dynamic Stats calculation ---
  const totalLeads = campaigns.reduce((acc, curr) => acc + curr.leads, 0) + 620; // adding baseline to match mockup visual 1,250
  const qualifiedLeadsCount = 520;
  const marketingSpendTotal = campaigns.reduce((acc, curr) => acc + curr.cost, 0); // ~2.5L + baseline = 4.8L
  const averageCpl = Math.round(480000 / 1250); // ₹384
  const averageRoi = 4.2;

  // --- Sidebar Items ---
  const sidebarItems = [
    { name: "Executive Summary", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Lead Generation Center", icon: <Target className="h-4 w-4" /> },
    { name: "Campaign Management", icon: <Activity className="h-4 w-4" /> },
    { name: "Ad Performance", icon: <Search className="h-4 w-4" /> },
    { name: "SEO Performance", icon: <Compass className="h-4 w-4" /> },
    { name: "Social Media Overview", icon: <Share2 className="h-4 w-4" /> },
    { name: "Content Calendar", icon: <Calendar className="h-4 w-4" /> },
    { name: "Team Performance", icon: <Users className="h-4 w-4" /> },
    { name: "Marketing Budget", icon: <DollarSign className="h-4 w-4" /> },
    { name: "Lead Quality Analysis", icon: <CheckSquare className="h-4 w-4" /> },
    { name: "Competitor Monitoring", icon: <LineChart className="h-4 w-4" /> },
    { name: "AI Marketing Assistant", icon: <Bot className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  // --- Chart Data ---
  const leadTrendData = [
    { m: "1 May", Leads: 250, Qualified: 110 },
    { m: "8 May", Leads: 450, Qualified: 200 },
    { m: "15 May", Leads: 680, Qualified: 310 },
    { m: "22 May", Leads: 950, Qualified: 420 },
    { m: "31 May", Leads: 1250, Qualified: 520 },
  ];

  const leadSourceData = [
    { name: "Google Ads", value: 425, color: "#3B82F6" },
    { name: "Website", value: 325, color: "#10B981" },
    { name: "Meta Ads", value: 225, color: "#8B5CF6" },
    { name: "Instagram", value: 150, color: "#EC4899" },
    { name: "Referrals", value: 75, color: "#F59E0B" },
    { name: "Others", value: 50, color: "#64748B" },
  ];

  const adPerformanceData = [
    { name: "Google Ads", clicks: 12850, conversions: 320, ctr: "4.85%", cost: "₹2.45 L" },
    { name: "Meta Ads", clicks: 8430, conversions: 210, ctr: "3.22%", cost: "₹1.55 L" },
  ];

  const budgetBreakdownData = [
    { name: "Google Ads", value: 245000 },
    { name: "Meta Ads", value: 155000 },
    { name: "SEO Tools", value: 45000 },
    { name: "Content Creation", value: 35000 },
  ];

  // --- Handlers ---
  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name) return;
    const item: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      platform: newCampaign.platform,
      leads: Number(newCampaign.leads),
      cost: Number(newCampaign.cost),
      roi: Number(newCampaign.roi),
      status: newCampaign.status
    };
    setCampaigns([...campaigns, item]);
    setNewCampaign({ name: "", platform: "Google Ads", leads: 50, cost: 20000, roi: 3.0, status: "Good" });
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email) return;
    const item: Lead = {
      id: Date.now().toString(),
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone || "+91 99999 88888",
      source: newLead.source,
      quality: newLead.quality,
      status: newLead.status,
      date: new Date().toISOString().split("T")[0]
    };
    setLeads([item, ...leads]);
    setNewLead({ name: "", email: "", phone: "", source: "Google Ads", quality: "High", status: "New" });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    const item: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: Number(newEvent.date),
      channel: newEvent.channel,
      status: newEvent.status
    };
    setCalendarEvents([...calendarEvents, item]);
    setNewEvent({ title: "", date: 15, channel: "Instagram", status: "Draft" });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let botResponse = "Let me look into that campaign metric for you. Google Ads optimization has improved ROI by 14% this month.";
      if (userMsg.toLowerCase().includes("roi")) {
        botResponse = "The overall ROI is at 4.2X. Google Ads leads lead the charts with high conversions, while Meta Ads remain cost-effective at ₹269 CPL.";
      } else if (userMsg.toLowerCase().includes("budget")) {
        botResponse = "You've used 68% (₹4.80 L) of your ₹7.00 L budget. Google Ads represents the highest spend at ₹2.45 L.";
      } else if (userMsg.toLowerCase().includes("lead")) {
        botResponse = "Our lead funnel generated 1,250 leads MTD, with 520 Qualified (41.6%) and 250 in Nurturing status.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
        <div>
          {/* Brand Logo */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center shadow-lg shadow-blue-500/20">
              <Building2 className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">BuildWell</div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">Constructions</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {sidebarItems.map((item) => {
              const active = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-250 ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-semibold shadow-md shadow-blue-500/15"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Widgets & Profile */}
        <div className="p-4 border-t border-slate-800 space-y-4 bg-[#0B1222]">
          {/* Today's Overview widget */}
          <div className="bg-[#111C30]/50 border border-slate-800/80 rounded-xl p-3 text-[11px] space-y-2.5">
            <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1.5 flex justify-between">
              <span>Today's Overview</span>
              <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono">MTD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tasks</span>
              <span className="text-white font-semibold font-mono">08 / 12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">New Leads</span>
              <span className="text-emerald-400 font-semibold font-mono">+46</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pending Approvals</span>
              <span className="text-yellow-450 text-yellow-400 font-semibold font-mono">05</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Budget Used</span>
              <span className="text-indigo-400 font-semibold font-mono">68%</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="h-9 w-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 grid place-items-center text-xs font-bold shadow-inner font-mono">
              PS
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Priya Sharma</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Digital Marketing TL</div>
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

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TOPBAR */}
        <header className="bg-[#0F182A]/70 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2 tracking-wide font-sans">
              Digital Marketing TL Dashboard <span className="animate-pulse">👋</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Welcome back, Priya Sharma! Manage campaigns, SEO targets, content calendar, and marketing budget.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Project Filter */}
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
                <option value="Commercial Hub">Commercial Hub</option>
              </select>
            </div>

            {/* Date Range Selection */}
            <div className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span>{dateFilter}</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-350 hover:text-white transition-colors">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            </button>
          </div>
        </header>

        {/* TAB CONTENTS CONTAINER */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">
          
          {/* 1. EXECUTIVE SUMMARY */}
          {activeTab === "Executive Summary" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { title: "Monthly Leads", val: "1,250", change: "↑ 18.5% vs Apr 2025", color: "#3B82F6", sub: "leadsTrend" },
                  { title: "Qualified Leads", val: "520", change: "↑ 22.7% vs Apr 2025", color: "#10B981", sub: "leadsTrend" },
                  { title: "Marketing Spend", val: "₹4.8 L", change: "↓ 12.3% vs Apr 2025", color: "#8B5CF6", sub: "spendTrend" },
                  { title: "Cost Per Lead", val: "₹384", change: "↓ 8.6% vs Apr 2025", color: "#F59E0B", sub: "spendTrend" },
                  { title: "ROI", val: "4.2X", change: "↑ 16.4% vs Apr 2025", color: "#06B6D4", sub: "leadsTrend" }
                ].map((c, i) => (
                  <div key={i} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
                    <div className="z-10">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{c.title}</span>
                      <div className="text-xl font-bold text-white mt-1 font-mono">{c.val}</div>
                    </div>
                    <div className="z-10 text-[9px] font-semibold mt-auto flex items-center gap-1" style={{ color: c.color }}>
                      {c.change}
                    </div>
                    {/* Sparkline approximation backdrop */}
                    <div className="absolute right-0 bottom-0 left-0 h-10 opacity-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={leadTrendData}>
                          <Area type="monotone" dataKey={c.sub === "leadsTrend" ? "Leads" : "Qualified"} stroke={c.color} fill={c.color} strokeWidth={1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid: Funnel & Campaigns & Donut */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Lead Gen Funnel */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Lead Generation Funnel</h3>
                    <p className="text-[9px] text-slate-400 mb-4">Total lead tracking from initial clicks to conversions</p>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="w-full bg-blue-600/25 border border-blue-500/40 text-center py-2.5 rounded-lg text-xs font-bold font-mono">
                        Total Leads: 1,250
                      </div>
                    </div>
                    <div className="relative flex justify-center">
                      <div className="w-[85%] bg-emerald-600/25 border border-emerald-500/40 text-center py-2.5 rounded-lg text-xs font-bold font-mono">
                        Qualified Leads: 520 (41.6%)
                      </div>
                    </div>
                    <div className="relative flex justify-center">
                      <div className="w-[70%] bg-amber-600/25 border border-amber-500/40 text-center py-2.5 rounded-lg text-xs font-bold font-mono text-amber-200">
                        Disqualified Leads: 480 (38.4%)
                      </div>
                    </div>
                    <div className="relative flex justify-center">
                      <div className="w-[55%] bg-purple-650/25 bg-purple-600/25 border border-purple-500/40 text-center py-2.5 rounded-lg text-xs font-bold font-mono text-purple-200">
                        Nurturing Leads: 250 (20.0%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaigns Performance Overview */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Campaign Performance Overview</h3>
                    <button onClick={() => setActiveTab("Campaign Management")} className="text-[10px] text-blue-400 font-semibold hover:underline flex items-center gap-0.5">
                      View All <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-3 overflow-y-auto max-h-56">
                    {campaigns.slice(0, 4).map((c) => (
                      <div key={c.id} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#0e1628] border border-slate-800/60 hover:border-slate-700 transition">
                        <div>
                          <div className="font-semibold text-white">{c.name}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{c.platform}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white font-mono">{c.leads} Leads</div>
                          <div className="text-[9px] text-emerald-400 font-semibold font-mono">{c.roi}X ROI</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead Source Breakdown */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Lead Source Breakdown</h3>
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-32 w-32 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={leadSourceData} dataKey="value" nameKey="name" innerRadius={28} outerRadius={46} paddingAngle={2}>
                            {leadSourceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-white font-mono">1,250</span>
                        <span className="text-[8px] text-slate-400 uppercase">Total Leads</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-[9px] w-full border-t border-slate-800/80 pt-3">
                      {leadSourceData.map((item) => (
                        <div key={item.name} className="flex items-center gap-1.5 truncate">
                          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-400 truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Grid 2: Mini analytics previews */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Ad Performance overview */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Ad Performance</h3>
                    <button onClick={() => setActiveTab("Ad Performance")} className="text-[10px] text-blue-400 font-semibold hover:underline">Details</button>
                  </div>
                  {adPerformanceData.map((platform, idx) => (
                    <div key={idx} className="p-3 bg-[#0e1628] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-100">{platform.name}</div>
                        <div className="text-[9px] text-slate-400 mt-1">Cost: {platform.cost} | CTR: {platform.ctr}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-400 font-mono">{platform.clicks} Clicks</div>
                        <div className="text-[10px] text-emerald-400 font-bold font-mono">{platform.conversions} Conv</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SEO overview */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">SEO Organic Stats</h3>
                    <button onClick={() => setActiveTab("SEO Performance")} className="text-[10px] text-blue-400 font-semibold hover:underline">Analytics</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-[#0e1628] border border-slate-800 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase">Traffic</span>
                      <div className="text-sm font-bold text-white font-mono mt-1">22.5K</div>
                    </div>
                    <div className="p-2 bg-[#0e1628] border border-slate-800 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase">Keywords</span>
                      <div className="text-sm font-bold text-emerald-400 font-mono mt-1">850</div>
                    </div>
                    <div className="p-2 bg-[#0e1628] border border-slate-800 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase">Authority</span>
                      <div className="text-sm font-bold text-blue-400 font-mono mt-1">32</div>
                    </div>
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={leadTrendData}>
                        <XAxis dataKey="m" stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC", fontSize: 9 }} />
                        <Area type="monotone" dataKey="Leads" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Team performance preview */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Team Activity</h3>
                    <button onClick={() => setActiveTab("Team Performance")} className="text-[10px] text-blue-400 font-semibold hover:underline font-medium">Details</button>
                  </div>
                  <div className="space-y-2.5 overflow-y-auto max-h-40">
                    {teamMembers.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20 text-[9px] grid place-items-center">{item.avatar}</div>
                          <div>
                            <div className="font-semibold text-slate-200">{item.name}</div>
                            <div className="text-[9px] text-slate-400">Leads MTD: {item.leadsGenerated}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-slate-350">{Math.round((item.tasksCompleted/item.tasksAssigned)*100)}% Tasks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bot Prompt suggestion widget */}
              <div className="p-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/40 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-xl grid place-items-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">AI Marketing Insights Recommendation</h4>
                    <p className="text-[10px] text-slate-300 mt-0.5">Campaign conversion ROI increased. Shift ₹30k from brand awareness to Google Search Villa Campaign immediately.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("AI Marketing Assistant")}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md transition"
                >
                  Consult AI
                </button>
              </div>

            </div>
          )}

          {/* 2. LEAD GENERATION CENTER */}
          {activeTab === "Lead Generation Center" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lead Generation Center</h3>
                  <p className="text-[10px] text-slate-400">Track and add qualified lead listings from Google Ads, Meta, social platforms, and website SEO</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Total Month Leads</div>
                  <div className="text-lg font-bold text-white font-mono">{leads.length + 1200}</div>
                </div>
              </div>

              {/* Quick Add Form */}
              <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-[#111C30] border border-slate-800 rounded-xl p-4 items-end">
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Lead Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Email</label>
                  <input
                    type="email"
                    placeholder="e.g. john@domain.com"
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765..."
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Source</label>
                  <select
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  >
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Website">Website SEO</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referrals">Referrals</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Quality Score</label>
                  <select
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newLead.quality}
                    onChange={(e) => setNewLead({ ...newLead, quality: e.target.value as any })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-1.5">
                    <Plus className="h-4 w-4" /> Add Lead
                  </button>
                </div>
              </form>

              {/* Leads Table */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Leads Listing MTD</h4>
                  <span className="text-[10px] text-blue-400 font-semibold">{leads.length} Records Shown</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/50">
                        <th className="p-4">Name</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Quality Score</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date Added</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-800/10 transition">
                          <td className="p-4 font-semibold text-white">{l.name}</td>
                          <td className="p-4">
                            <div>{l.email}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{l.phone}</div>
                          </td>
                          <td className="p-4 text-slate-350">{l.source}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              l.quality === "High" ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 text-emerald-400" :
                              l.quality === "Medium" ? "bg-amber-500/10 text-amber-450 border-amber-500/20 text-amber-400" :
                              "bg-red-500/10 text-red-450 border-red-500/20 text-red-400"
                            }`}>
                              {l.quality}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={l.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as any;
                                setLeads(leads.map(x => x.id === l.id ? { ...x, status: newStatus } : x));
                              }}
                              className="bg-[#0a1120] text-slate-300 border border-slate-800 rounded-md py-1 px-2 text-[10px]"
                            >
                              <option value="New">New</option>
                              <option value="Nurturing">Nurturing</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Disqualified">Disqualified</option>
                            </select>
                          </td>
                          <td className="p-4 text-slate-400 font-mono">{l.date}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setLeads(leads.filter(x => x.id !== l.id))}
                              className="text-red-400 hover:text-red-300 p-1 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. CAMPAIGN MANAGEMENT */}
          {activeTab === "Campaign Management" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Campaign Performance Overview</h3>
                  <p className="text-[10px] text-slate-400">Launch and track conversion metrics of Google & Meta campaigns</p>
                </div>
              </div>

              {/* Campaign Add Form */}
              <form onSubmit={handleAddCampaign} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-[#111C30] border border-slate-800 rounded-xl p-4 items-end">
                <div className="col-span-1 lg:col-span-2">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Skyline Residences Search"
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Platform</label>
                  <select
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newCampaign.platform}
                    onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}
                  >
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="LinkedIn Ads">LinkedIn Ads</option>
                    <option value="SEO Organic">SEO Organic</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Spends (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newCampaign.cost}
                    onChange={(e) => setNewCampaign({ ...newCampaign, cost: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Target Leads</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newCampaign.leads}
                    onChange={(e) => setNewCampaign({ ...newCampaign, leads: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-1.5">
                    <Plus className="h-4 w-4" /> Add Campaign
                  </button>
                </div>
              </form>

              {/* Campaign Table */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/50">
                      <th className="p-4">Campaign Name</th>
                      <th className="p-4">Platform</th>
                      <th className="p-4">Leads Generated</th>
                      <th className="p-4">Allocated Spend</th>
                      <th className="p-4">Avg CPL</th>
                      <th className="p-4">ROI Ratio</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/10 transition">
                        <td className="p-4 font-bold text-white">{c.name}</td>
                        <td className="p-4 text-slate-350">{c.platform}</td>
                        <td className="p-4 font-mono font-bold text-white">{c.leads}</td>
                        <td className="p-4 font-mono font-bold text-white">₹{c.cost.toLocaleString()}</td>
                        <td className="p-4 font-mono text-slate-350">₹{Math.round(c.cost / c.leads)}</td>
                        <td className="p-4 font-mono font-bold text-emerald-400">{c.roi}x</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            c.status === "Excellent" ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 text-emerald-400" :
                            c.status === "Good" ? "bg-blue-500/10 text-blue-450 border-blue-500/20 text-blue-400" :
                            "bg-amber-500/10 text-amber-450 border-amber-500/20 text-amber-400"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setCampaigns(campaigns.filter(x => x.id !== c.id))}
                            className="text-red-400 hover:text-red-300 p-1 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. AD PERFORMANCE */}
          {activeTab === "Ad Performance" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ad Performance Dashboard</h3>
                <p className="text-[10px] text-slate-400">Deep comparative analytics for Google search ads and Meta promotional spend</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Platform Click trends */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Click CTR Trends MTD</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={leadTrendData}>
                        <XAxis dataKey="m" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Line type="monotone" name="Google Clicks" dataKey="Leads" stroke="#3B82F6" strokeWidth={2} />
                        <Line type="monotone" name="Meta Clicks" dataKey="Qualified" stroke="#EC4899" strokeWidth={2} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Conversion Performance */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Ad Spend Allocations & Lead Acquisition</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platformShareData}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                        <Bar name="Spend (₹ L)" dataKey="spend" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        <Bar name="Leads" dataKey="leads" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Performance numbers */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Platform Level Ad Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Google Search Ads", clicks: "45,230", ctr: "3.62%", conv: "620", rate: "1.37%", cost: "₹2.80 L" },
                    { title: "Meta Promo Ads", clicks: "38,540", ctr: "4.12%", conv: "480", rate: "1.24%", cost: "₹2.00 L" }
                  ].map((x, i) => (
                    <div key={i} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="font-bold text-white flex justify-between">
                        <span>{x.title}</span>
                        <span className="text-[10px] text-blue-400 font-mono">{x.cost} Spend</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-2 border-t border-slate-800/80">
                        <div>
                          <span className="text-slate-400">Clicks</span>
                          <div className="text-white font-bold mt-1 font-mono">{x.clicks}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">CTR</span>
                          <div className="text-emerald-400 font-bold mt-1 font-mono">{x.ctr}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Conversions</span>
                          <div className="text-blue-400 font-bold mt-1 font-mono">{x.conv}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Conv. Rate</span>
                          <div className="text-white font-bold mt-1 font-mono">{x.rate}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. SEO PERFORMANCE */}
          {activeTab === "SEO Performance" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">SEO Analytics Dashboard</h3>
                <p className="text-[10px] text-slate-400">Monitor organic web traffic, keyword visibility, backlinks, and authority indices</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: "Organic Traffic MTD", val: "22,500", desc: "↑ 15.6% vs last month" },
                  { title: "Keywords Ranked", val: "850", desc: "↑ 12.3% active keywords" },
                  { title: "Top 10 Keywords", val: "145", desc: "↑ 8.7% index movement" },
                  { title: "Domain Authority", val: "32", desc: "Stable domain weight" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">{item.title}</span>
                    <div className="text-xl font-bold text-white mt-1 font-mono">{item.val}</div>
                    <span className="text-[9px] text-emerald-400 block mt-1">{item.desc}</span>
                  </div>
                ))}
              </div>

              {/* Keyword rankings table */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Top Ranking Search Keywords</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800">
                        <th className="pb-3">Keyword Search Term</th>
                        <th className="pb-3">SERP Position</th>
                        <th className="pb-3">Monthly Volume</th>
                        <th className="pb-3">Ranking Direction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {[
                        ["construction company in chennai", "Position 1", "3,800", "↑ Up 2 spots"],
                        ["house construction cost in coimbatore", "Position 2", "1,900", "↑ Up 4 spots"],
                        ["best builders in chennai", "Position 3", "1,200", "↑ Up 1 spot"],
                        ["villa construction chennai", "Position 4", "1,600", "↓ Down 1 spot"],
                        ["apartment builders chennai", "Position 5", "1,000", "Stable"]
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/10 transition">
                          <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                          <td className="py-3 text-white font-semibold font-mono">{row[1]}</td>
                          <td className="py-3 font-mono font-bold">{row[2]}</td>
                          <td className="py-3 font-semibold text-emerald-400">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. SOCIAL MEDIA OVERVIEW */}
          {activeTab === "Social Media Overview" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Social Media Overview</h3>
                <p className="text-[10px] text-slate-400">Track channels engagement, audience outreach, and brand followers counts</p>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { name: "Instagram", followers: "28K Followers", growth: "↑ 12% growth" },
                  { name: "Facebook", followers: "18K Followers", growth: "↑ 8% growth" },
                  { name: "LinkedIn", followers: "12K Followers", growth: "↑ 15% growth" },
                  { name: "YouTube", followers: "5.2K Subscribers", growth: "↑ 10% growth" }
                ].map((social, i) => (
                  <div key={i} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-xs font-bold text-white">{social.name}</span>
                    <div className="text-lg font-bold text-blue-400 mt-2 font-mono">{social.followers}</div>
                    <div className="text-[10px] text-emerald-400 mt-1">{social.growth}</div>
                  </div>
                ))}
              </div>

              {/* Engagement rates charts */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Average Engagement Rate MTD</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Instagram", rate: 6.8 },
                      { name: "Facebook", rate: 5.4 },
                      { name: "LinkedIn", rate: 4.8 },
                      { name: "YouTube", rate: 7.2 }
                    ]}>
                      <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B" }} />
                      <Bar name="Engagement Rate %" dataKey="rate" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 7. CONTENT CALENDAR */}
          {activeTab === "Content Calendar" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Content Calendar (May 2025)</h3>
                  <p className="text-[10px] text-slate-400">Schedule multi-channel social media creatives, blog posts, and site reels</p>
                </div>
              </div>

              {/* Add event inline form */}
              <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#111C30] border border-slate-800 rounded-xl p-4 items-end">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Creative Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Apartments Reel"
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Target Date (Day of May)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Channel Platform</label>
                  <select
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={newEvent.channel}
                    onChange={(e) => setNewEvent({ ...newEvent, channel: e.target.value as any })}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Blog">SEO Blog</option>
                  </select>
                </div>
                <div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-1.5">
                    <Plus className="h-4 w-4" /> Schedule Content
                  </button>
                </div>
              </form>

              {/* Visual Calendar Grid */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <div className="grid grid-cols-7 gap-2 text-center text-slate-400 text-[10px] font-bold mb-3 uppercase tracking-wider">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                  <div>Sun</div>
                </div>
                <div className="grid grid-cols-7 gap-3 min-h-[300px]">
                  {/* May starts on a Thursday (offset 3 days) */}
                  <div className="bg-slate-900/10 rounded-lg border border-slate-900/10 p-2"></div>
                  <div className="bg-slate-900/10 rounded-lg border border-slate-900/10 p-2"></div>
                  <div className="bg-slate-900/10 rounded-lg border border-slate-900/10 p-2"></div>
                  
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const dayEvents = calendarEvents.filter((e) => e.date === day);
                    return (
                      <div key={day} className="bg-[#0e1628] border border-slate-800/80 hover:border-slate-700 rounded-lg p-2 min-h-[70px] transition flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">{day}</span>
                        <div className="space-y-1 mt-1">
                          {dayEvents.map((evt) => (
                            <div
                              key={evt.id}
                              className={`text-[8px] px-1 py-0.5 rounded font-semibold truncate ${
                                evt.channel === "Instagram" ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" :
                                evt.channel === "Facebook" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                evt.channel === "LinkedIn" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                                evt.channel === "YouTube" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                "bg-amber-500/10 text-amber-450 text-amber-400 border border-amber-500/20"
                              }`}
                              title={`${evt.channel}: ${evt.title} (${evt.status})`}
                            >
                              {evt.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 8. TEAM PERFORMANCE */}
          {activeTab === "Team Performance" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Team Performance Analytics</h3>
                <p className="text-[10px] text-slate-400">Review tasks completion ratios, target allocations, and lead generation leaderboard</p>
              </div>

              {/* Team performance cards list */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.map((member) => {
                  const compRate = Math.round((member.tasksCompleted / member.tasksAssigned) * 100);
                  return (
                    <div key={member.id} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-600/15 text-blue-400 font-bold border border-blue-500/20 text-xs grid place-items-center">{member.avatar}</div>
                        <div>
                          <div className="font-bold text-white text-xs">{member.name}</div>
                          <div className="text-[9px] text-slate-400">{member.role}</div>
                        </div>
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-400">
                        <div className="flex justify-between">
                          <span>Tasks Completion:</span>
                          <span className="font-bold text-white font-mono">{member.tasksCompleted}/{member.tasksAssigned} ({compRate}%)</span>
                        </div>
                        <div className="w-full bg-[#0a1120] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${compRate}%` }}></div>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-800/80">
                          <span>Leads Contributed:</span>
                          <span className="text-emerald-400 font-bold font-mono">{member.leadsGenerated}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Task allocating tool */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-sans">Assign Direct Team Tasks</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const targetId = (e.target as any).targetMember.value;
                    setTeamMembers(teamMembers.map((m) => {
                      if (m.id === targetId) {
                        return { ...m, tasksAssigned: m.tasksAssigned + 1 };
                      }
                      return m;
                    }));
                    alert("Task assigned successfully to the selected digital executive!");
                  }}
                  className="grid md:grid-cols-3 gap-3 items-end"
                >
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Select Executive</label>
                    <select name="targetMember" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none">
                      {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Task Description</label>
                    <input type="text" placeholder="e.g. Meta Ads creative design" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none" required />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-1">
                    Assign Task
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 9. MARKETING BUDGET */}
          {activeTab === "Marketing Budget" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Marketing Budget Center</h3>
                <p className="text-[10px] text-slate-400">Compare allocated marketing funds vs real-time active campaign cost consumptions</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 col-span-1">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Budget Allocation Summary</h4>
                  <div className="flex flex-col items-center py-4">
                    <div className="h-32 w-32 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={budgetBreakdownData} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                            {budgetBreakdownData.map((e, idx) => (
                              <Cell key={`cell-${idx}`} fill={idx === 0 ? "#3B82F6" : idx === 1 ? "#EC4899" : idx === 2 ? "#F59E0B" : "#8B5CF6"} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-white font-mono">68%</span>
                        <span className="text-[8px] text-slate-400 uppercase">Used</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between"><span>Total Budget Limit:</span> <span className="text-white font-bold font-mono">₹7,00,000</span></div>
                    <div className="flex justify-between"><span>Total Active Spends:</span> <span className="text-blue-400 font-bold font-mono">₹4,76,000</span></div>
                    <div className="flex justify-between"><span>Remaining Reserves:</span> <span className="text-emerald-450 text-emerald-400 font-bold font-mono">₹2,24,000</span></div>
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 col-span-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Budget Spends Analysis by Channel</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={budgetBreakdownData}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B" }} />
                        <Bar name="Allocated Spend (₹)" dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. LEAD QUALITY ANALYSIS */}
          {activeTab === "Lead Quality Analysis" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lead Quality Analysis</h3>
                <p className="text-[10px] text-slate-400">Evaluate marketing qualified leads (MQL) conversion percentages</p>
              </div>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Lead Status Ratios</h4>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-[#0e1628] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Audited Leads</span>
                    <div className="text-2xl font-bold text-white mt-1 font-mono">1,250</div>
                  </div>
                  <div className="p-4 bg-[#0e1628] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">High Quality (MQL)</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">520</div>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-1">41.6% Conversion Rate</span>
                  </div>
                  <div className="p-4 bg-[#0e1628] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Medium Quality</span>
                    <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">480</div>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-1">38.4% Qualified Lead Rate</span>
                  </div>
                  <div className="p-4 bg-[#0e1628] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Low Quality / Junk</span>
                    <div className="text-2xl font-bold text-red-400 mt-1 font-mono">250</div>
                    <span className="text-[9px] text-slate-500 font-semibold block mt-1">20.0% Disqualified Rate</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 11. COMPETITOR MONITORING */}
          {activeTab === "Competitor Monitoring" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Competitor Keyword & Share of Voice</h3>
                <p className="text-[10px] text-slate-400">Compare BuildWell brand outreach metrics with direct industry competitors</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Traffic comparison chart */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Competitor Organic Traffic Share</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "BuildWell", traffic: 22500 },
                        { name: "Competitor A", traffic: 18400 },
                        { name: "Competitor B", traffic: 15300 },
                        { name: "Competitor C", traffic: 9800 }
                      ]}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#0E1726" }} />
                        <Bar dataKey="traffic" fill="#10B981" radius={[4, 4, 0, 0]}>
                          <Cell fill="#3B82F6" />
                          <Cell fill="#64748B" />
                          <Cell fill="#64748B" />
                          <Cell fill="#64748B" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Shared Keyword gaps */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Keyword Gap Overlaps</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-white">luxury flats in chennai</span>
                        <div className="text-[9px] text-slate-400 mt-0.5">BuildWell rank: #3 | Competitor A rank: #1</div>
                      </div>
                      <span className="text-amber-400 font-semibold text-[10px]">High Gap priority</span>
                    </div>
                    <div className="p-3 bg-[#0e1628] border border-slate-800 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-white">builders in coimbatore</span>
                        <div className="text-[9px] text-slate-400 mt-0.5">BuildWell rank: #2 | Competitor B rank: #5</div>
                      </div>
                      <span className="text-emerald-450 text-emerald-400 font-semibold text-[10px]">Market Dominance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 12. AI MARKETING ASSISTANT */}
          {activeTab === "AI Marketing Assistant" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Marketing Assistant</h3>
                <p className="text-[10px] text-slate-400">Ask questions, audit campaigns, and generate high converting ad copies immediately</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Chat Panel */}
                <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2 mb-4">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 rounded-xl max-w-sm text-xs ${
                          msg.sender === "user" ? "bg-blue-600 text-white" : "bg-[#0e1628] border border-slate-800 text-slate-200"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Message Input */}
                  <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                    <input
                      type="text"
                      placeholder="Ask anything about campaigns, SEO, or ROI..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition">
                      <SendHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Suggestions & Insights panel */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 h-[450px] overflow-y-auto">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Automated Insights & Recommendations</h4>
                  <div className="space-y-3 text-xs">
                    {[
                      { type: "Opportunity", text: "Villa Campaign is performing 27% better than other campaigns. Consider switching more budget.", color: "text-emerald-400", border: "border-emerald-500/20 bg-emerald-500/5" },
                      { type: "Critical Alert", text: "Increase budget for Google Ads - high ROI detected and search volumes are surging.", color: "text-blue-400", border: "border-blue-500/20 bg-blue-500/5" },
                      { type: "Weekly Diagnosis", text: "Lead quality improved by 18% compared to last month. SEO push on Coimbatore Hub contributed 410 Leads.", color: "text-purple-400", border: "border-purple-500/20 bg-purple-500/5" }
                    ].map((rec, i) => (
                      <div key={i} className={`p-3 border rounded-xl space-y-1 ${rec.border}`}>
                        <span className={`text-[9px] font-bold uppercase ${rec.color}`}>{rec.type}</span>
                        <p className="text-[10.5px] text-slate-300 leading-relaxed">{rec.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13. SETTINGS */}
          {activeTab === "Settings" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dashboard Settings</h3>
                <p className="text-[10px] text-slate-400">Configure lead score thresholds, notifications alerts, and API settings</p>
              </div>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-6 max-w-2xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-white block">Lead Scoring threshold</span>
                      <span className="text-[10px] text-slate-400">Minimum score to qualify a lead automatically</span>
                    </div>
                    <input
                      type="number"
                      className="bg-[#0a1120] text-slate-100 border border-slate-800 rounded-md p-1.5 w-20 text-center font-mono font-bold"
                      value={settings.leadScoringMin}
                      onChange={(e) => setSettings({ ...settings, leadScoringMin: Number(e.target.value) })}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-850">
                    <div>
                      <span className="font-semibold text-white block">Email Alerts</span>
                      <span className="text-[10px] text-slate-400">Receive instant updates on daily MQL spikes</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notificationEmails}
                      onChange={(e) => setSettings({ ...settings, notificationEmails: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-850">
                    <div>
                      <span className="font-semibold text-white block">Weekly Summary reports</span>
                      <span className="text-[10px] text-slate-400">Receive campaign ROI diagnostic reports directly</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.weeklyReports}
                      onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => alert("Settings saved successfully!")}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-md transition"
                >
                  Save Configurations
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// --- Secondary Mock Data Helper ---
const platformShareData = [
  { name: "Google Ads", spend: 2.8, leads: 620 },
  { name: "Meta Ads", spend: 2.0, leads: 480 },
  { name: "SEO Organic", spend: 0.8, leads: 150 }
];
