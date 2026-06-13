"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  CheckSquare, Target, Search, Send, Compass, Share2, Calendar,
  Globe, Star, Briefcase, Award, Sparkles, Settings, LogOut,
  Building2, Bell, Filter, Plus, Check, Play, FileText, CheckCircle2,
  Trash2, ArrowUpRight, TrendingUp, RefreshCw, SendHorizontal, MessageSquare, AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

// --- Types & Mock Data ---
interface Task {
  id: string;
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  due: string;
  status: "In Progress" | "Pending" | "Completed";
}

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  reply?: string;
}

interface ContentPlan {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
}

export default function DigitalMarketingExecutiveDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("My Tasks");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("01 May 2025 - 31 May 2025");

  // --- 01. MY TASKS STATES ---
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Create Instagram Reel", project: "Villa Project", priority: "High", due: "11:00 AM", status: "In Progress" },
    { id: "2", title: "Write Blog - Construction Tips", project: "SEO Blog", priority: "Medium", due: "01:00 PM", status: "Pending" },
    { id: "3", title: "Google Ads Optimization", project: "Villa Campaign", priority: "High", due: "02:30 PM", status: "Pending" },
    { id: "4", title: "Update Project Photos", project: "Commercial Project", priority: "Low", due: "03:30 PM", status: "Pending" },
    { id: "5", title: "Respond to GMB Reviews", project: "GMB Profile", priority: "Medium", due: "04:30 PM", status: "Pending" },
    { id: "6", title: "Facebook Ad Creatives", project: "Apartment Project", priority: "High", due: "05:00 PM", status: "Pending" },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("Villa Project");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");

  // --- 07. CONTENT CREATION STATES ---
  const [activeContentTab, setActiveContentTab] = useState("Content Ideas");
  const [contentItems, setContentItems] = useState<ContentPlan[]>([
    { id: "1", title: "Blog - How to reduce construction cost", type: "Blog", dueDate: "30 May 2025", priority: "High" },
    { id: "2", title: "Reel - Villa construction steps", type: "Reel", dueDate: "30 May 2025", priority: "High" },
    { id: "3", title: "YouTube - Site walkthrough video", type: "Video", dueDate: "31 May 2025", priority: "Medium" },
    { id: "4", title: "Post - Client testimonial", type: "Carousel", dueDate: "04 Jun 2025", priority: "Medium" },
    { id: "5", title: "Carousel - Construction tips", type: "Carousel", dueDate: "05 Jun 2025", priority: "Low" },
  ]);

  // --- 09. GOOGLE BUSINESS PROFILE REVIEWS ---
  const [reviews, setReviews] = useState<Review[]>([
    { id: "1", author: "Rajesh Pillai", rating: 5, text: "Excellent construction quality and timely delivery of Skyline Residences!", date: "2025-05-24" },
    { id: "2", author: "Deepika Sen", rating: 4, text: "Very professional staff and beautiful sample flats. Recommended.", date: "2025-05-22" },
    { id: "3", author: "Vikram Malhotra", rating: 5, text: "Customer service at Greenfield apartments is top-notch. Love the garden amenities.", date: "2025-05-20" },
  ]);
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // --- 12. AI CONTENT ASSISTANT STATES ---
  const [aiTab, setAiTab] = useState<"Blog" | "Ad Copy" | "Social Media" | "Email" | "Keywords">("Blog");
  const [aiTopicInput, setAiTopicInput] = useState("Modern House Construction Tips");
  const [aiTone, setAiTone] = useState("Professional");
  const [aiLang, setAiLang] = useState("English");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const sidebarItems = [
    { name: "My Tasks", icon: <CheckSquare className="h-4 w-4" /> },
    { name: "Lead Sources", icon: <Target className="h-4 w-4" /> },
    { name: "SEO Tasks", icon: <Compass className="h-4 w-4" /> },
    { name: "Google Ads", icon: <Search className="h-4 w-4" /> },
    { name: "Meta Ads", icon: <Send className="h-4 w-4" /> },
    { name: "Social Media", icon: <Share2 className="h-4 w-4" /> },
    { name: "Content Creation", icon: <Calendar className="h-4 w-4" /> },
    { name: "Website Management", icon: <Globe className="h-4 w-4" /> },
    { name: "Google Business Profile", icon: <Star className="h-4 w-4" /> },
    { name: "Project Portfolio", icon: <Briefcase className="h-4 w-4" /> },
    { name: "Performance Tracker", icon: <Award className="h-4 w-4" /> },
    { name: "AI Content Assistant", icon: <Sparkles className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  // --- Chart Data sets matching mockup visuals ---
  const taskSummaryData = [
    { name: "Pending", value: 30, color: "#EC4899" },
    { name: "In Progress", value: 10, color: "#3B82F6" },
    { name: "Completed", value: 40, color: "#10B981" },
    { name: "Overdue", value: 20, color: "#EF4444" },
  ];

  const leadSourceData = [
    { name: "Website", value: 540, color: "#10B981" },
    { name: "Google Ads", value: 320, color: "#3B82F6" },
    { name: "Instagram", value: 180, color: "#EC4899" },
    { name: "Facebook", value: 120, color: "#06B6D4" },
    { name: "Referrals", value: 90, color: "#F59E0B" },
  ];

  const leadsTrendData = [
    { name: "1 May", ThisMonth: 250, LastMonth: 210 },
    { name: "8 May", ThisMonth: 480, LastMonth: 410 },
    { name: "15 May", ThisMonth: 720, LastMonth: 630 },
    { name: "22 May", ThisMonth: 980, LastMonth: 850 },
    { name: "31 May", ThisMonth: 1250, LastMonth: 1100 },
  ];

  const clickTrendData = [
    { name: "1 May", ThisMonth: 2800, LastMonth: 2400 },
    { name: "8 May", ThisMonth: 5400, LastMonth: 4800 },
    { name: "15 May", ThisMonth: 8200, LastMonth: 7500 },
    { name: "22 May", ThisMonth: 10500, LastMonth: 9500 },
    { name: "31 May", ThisMonth: 12850, LastMonth: 11500 },
  ];

  const metaPerformanceTrendData = [
    { name: "1 May", Reach: 60000, Leads: 45 },
    { name: "8 May", Reach: 140000, Leads: 90 },
    { name: "15 May", Reach: 210000, Leads: 135 },
    { name: "22 May", Reach: 270000, Leads: 180 },
    { name: "31 May", Reach: 320000, Leads: 220 },
  ];

  const contentDistributionData = [
    { name: "Blog", value: 20, color: "#3B82F6" },
    { name: "Reel", value: 30, color: "#EC4899" },
    { name: "Video", value: 20, color: "#EF4444" },
    { name: "Post", value: 15, color: "#F59E0B" },
    { name: "Carousel", value: 15, color: "#10B981" },
  ];

  const gbpActionsData = [
    { name: "Views", value: 48, color: "#3B82F6" },
    { name: "Calls", value: 24, color: "#10B981" },
    { name: "Directions", value: 18, color: "#F59E0B" },
    { name: "Website", value: 10, color: "#EC4899" },
  ];

  // --- Handlers ---
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const item: Task = {
      id: Date.now().toString(),
      title: newTaskInput,
      project: newTaskProject,
      priority: newTaskPriority,
      due: "05:00 PM",
      status: "Pending"
    };
    setTasks([...tasks, item]);
    setNewTaskInput("");
  };

  const handlePostReviewReply = (id: string) => {
    if (!replyText.trim()) return;
    setReviews(reviews.map(r => r.id === id ? { ...r, reply: replyText } : r));
    setReplyText("");
    setReplyReviewId(null);
  };

  const handleGenerateAI = () => {
    if (!aiTopicInput.trim()) return;
    setAiLoading(true);
    setAiOutput("");
    setTimeout(() => {
      let output = "";
      if (aiTab === "Blog") {
        output = `### Blog Post: ${aiTopicInput}\n\nChoosing the right builders can impact project timelines and build safety. Learn key steps about sustainable foundation selection, heat-proofing modular brick walls, and solar setups.`;
      } else if (aiTab === "Ad Copy") {
        output = `🔥 **Google Ads Headline:** Premium 3 BHK Smart-Villas | ₹1.2 Cr*\n**Description:** Solar-equipped residences, private pools, and green surroundings. Download brochure now!`;
      } else {
        output = `✨ Generated Copy for "${aiTopicInput}" in ${aiTone} tone.\n\nReady for social publishing with #BuildWellConstructions #PropertyMarketing!`;
      }
      setAiOutput(output);
      setAiLoading(false);
    }, 1000);
  };

  return (
    <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
      
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
        <div>
          {/* Brand Logo */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center shadow-lg shadow-indigo-500/20">
              <Building2 className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">BuildWell</div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">Constructions</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-260px)]">
            {sidebarItems.map((item) => {
              const active = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/15"
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

        {/* Sidebar Footer Widget */}
        <div className="p-4 border-t border-slate-800 space-y-4 bg-[#0B1222]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 grid place-items-center text-xs font-bold font-mono">
              KK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Karthik Kumar</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Marketing Executive</div>
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

      {/* MAIN LAYOUT */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* TOPBAR */}
        <header className="bg-[#0F182A]/70 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2 font-sans tracking-wide">
              {activeTab.toUpperCase()} <span className="text-[10px] text-indigo-400 font-normal normal-case">/ Digital Marketing Executive Portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Welcome back, Karthik Kumar! Perform task lists, configure ad parameters, and utilize AI Content helpers.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Project dropdown */}
            <div className="flex items-center gap-1 bg-[#111C30] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Filter className="h-3 w-3 text-indigo-405 text-indigo-400" />
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

            {/* Date filter range */}
            <div className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span>{dateFilter}</span>
            </div>

            <button className="relative p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-350 hover:text-white transition-colors">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            </button>
          </div>
        </header>

        {/* DETAILS SUB-PANELS */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {/* 01. MY TASKS */}
          {activeTab === "My Tasks" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 text-xs">
                  {[
                    { label: "Pending Tasks", val: "14", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                    { label: "In Progress", val: "6", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                    { label: "Completed Today", val: "8", bg: "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 text-emerald-400" },
                    { label: "Overdue", val: "2", bg: "bg-red-500/10 text-red-400 border-red-500/20" }
                  ].map((s, idx) => (
                    <div key={idx} className={`p-4 border rounded-xl flex flex-col justify-between ${s.bg}`}>
                      <span className="font-semibold text-[10px] uppercase text-slate-400">{s.label}</span>
                      <div className="text-xl font-bold mt-2 font-mono">{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* Tasks Table */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Today's Tasks</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                          <th className="p-3">Task</th>
                          <th className="p-3">Project / Campaign</th>
                          <th className="p-3">Priority</th>
                          <th className="p-3">Due Time</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {tasks.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-800/10 transition">
                            <td className="p-3 font-semibold text-white">{t.title}</td>
                            <td className="p-3 text-slate-350">{t.project}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                t.priority === "High" ? "bg-red-500/10 text-red-400" :
                                t.priority === "Medium" ? "bg-amber-500/10 text-amber-400" :
                                "bg-slate-800 text-slate-400"
                              }`}>{t.priority}</span>
                            </td>
                            <td className="p-3 text-slate-400 font-mono">{t.due}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                t.status === "In Progress" ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-450"
                              }`}>{t.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right column: Task summary and upcoming */}
              <div className="space-y-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Task Summary</h3>
                  <div className="h-44 relative flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={taskSummaryData} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                          {taskSummaryData.map((e, idx) => (
                            <Cell key={`cell-${idx}`} fill={e.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-white font-mono">30</span>
                      <span className="text-[8px] text-slate-400 uppercase font-semibold">Total</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                    {taskSummaryData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-400">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 text-xs space-y-3">
                  <div className="font-bold text-white uppercase tracking-wider text-[11px]">Productivity</div>
                  <div className="text-2xl font-bold text-emerald-450 text-emerald-450 text-emerald-400 font-mono">80%</div>
                  <p className="text-[10px] text-slate-400">Your productivity is excellent today!</p>
                </div>
              </div>
            </div>
          )}

          {/* 02. LEAD SOURCES */}
          {activeTab === "Lead Sources" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { label: "Total Leads", val: "1,250", color: "text-white" },
                  { label: "Website", val: "540", color: "text-emerald-400" },
                  { label: "Google Ads", val: "320", color: "text-blue-400" },
                  { label: "Instagram", val: "180", color: "text-pink-400" },
                  { label: "Facebook", val: "120", color: "text-cyan-400" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                    <div className={`text-xl font-bold mt-1 font-mono ${s.color}`}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Lead Source Breakdown</h3>
                  <div className="h-64 flex flex-col justify-center items-center">
                    <div className="h-44 w-44 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={leadSourceData} dataKey="value" innerRadius={42} outerRadius={64}>
                            {leadSourceData.map((e, idx) => (
                              <Cell key={`cell-${idx}`} fill={e.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-white font-mono">1,250</span>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase">Leads</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Leads Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={leadsTrendData}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" name="This Month" dataKey="ThisMonth" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                        <Area type="monotone" name="Last Month" dataKey="LastMonth" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.05} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 03. SEO TASKS */}
          {activeTab === "SEO Tasks" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">SEO Checklist</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                        <th className="p-3">Task</th>
                        <th className="p-3">Keywords / Page</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {[
                        ["Optimize Page Title", "Home Page", "High", "28 May 2025", "In Progress"],
                        ["Meta Description Update", "Services Page", "Medium", "30 May 2025", "Pending"],
                        ["Add Keywords in Blog", "Construction Cost", "High", "31 May 2025", "Pending"],
                        ["Image Alt Text Optimization", "Portfolio Page", "Low", "01 Jun 2025", "Pending"],
                        ["Internal Linking", "Blog Page", "Medium", "01 Jun 2025", "Pending"],
                        ["Schema Markup Update", "All Pages", "High", "01 Jun 2025", "Pending"],
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/10 transition">
                          <td className="p-3 font-semibold text-white">{row[0]}</td>
                          <td className="p-3 text-slate-350">{row[1]}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              row[2] === "High" ? "bg-red-500/10 text-red-400" :
                              row[2] === "Medium" ? "bg-amber-500/10 text-amber-400" :
                              "bg-slate-850 text-slate-400"
                            }`}>{row[2]}</span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono">{row[3]}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              row[4] === "In Progress" ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-450"
                            }`}>{row[4]}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: SEO stats */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">SEO Overview</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628]">
                    <span className="text-slate-450 text-slate-400">Organic Traffic</span>
                    <span className="font-bold text-white font-mono">22,500</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628]">
                    <span className="text-slate-450 text-slate-400">Keywords Ranked</span>
                    <span className="font-bold text-emerald-450 text-emerald-400 font-mono">850</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628]">
                    <span className="text-slate-450 text-slate-400">Top 10 Keywords</span>
                    <span className="font-bold text-blue-400 font-mono">145</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628]">
                    <span className="text-slate-450 text-slate-400">Backlinks</span>
                    <span className="font-bold text-violet-400 font-mono">1.25K</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 04. GOOGLE ADS */}
          {activeTab === "Google Ads" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: "Clicks", val: "12,850" },
                  { label: "Impressions", val: "2.15M" },
                  { label: "CTR Rate", val: "4.85%" },
                  { label: "Conversions", val: "320" },
                  { label: "Total Cost", val: "₹1.80 L" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Clicks Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={clickTrendData}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" name="Clicks" dataKey="ThisMonth" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Campaign Table */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Campaign Performance</h3>
                  <div className="space-y-3 overflow-y-auto max-h-64">
                    {[
                      { name: "Villa Campaign", clicks: "4,250", cost: "₹80,000" },
                      { name: "Apartment Campaign", clicks: "3,100", cost: "₹55,000" },
                      { name: "Commercial Campaign", clicks: "2,850", cost: "₹30,000" },
                      { name: "Remarketing Campaign", clicks: "1,280", cost: "₹15,000" }
                    ].map((c, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#0e1628] border border-slate-850 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-semibold text-white">{c.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{c.clicks} clicks</div>
                        </div>
                        <span className="font-bold text-blue-400 font-mono">{c.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 05. META ADS */}
          {activeTab === "Meta Ads" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-6 gap-4">
                {[
                  { label: "Reach", val: "320K" },
                  { label: "Impressions", val: "1.25M" },
                  { label: "Clicks", val: "18,620" },
                  { label: "Leads", val: "220" },
                  { label: "Total Cost", val: "₹58,000" },
                  { label: "Cost Per Lead", val: "₹264" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                    <div className="text-lg font-bold mt-1 font-mono text-white">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Performance Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metaPerformanceTrendData}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" name="Reach" dataKey="Reach" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
                        <Area type="monotone" name="Leads" dataKey="Leads" stroke="#EC4899" fill="#EC4899" fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Audience Insights</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#0e1628] rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase">Primary Age Group</span>
                      <div className="text-base font-bold text-white font-mono mt-1">25-34 Years (46%)</div>
                    </div>
                    <div className="p-3 bg-[#0e1628] rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase">Gender Distribution</span>
                      <div className="text-base font-bold text-white font-mono mt-1">Male (58%) | Female (42%)</div>
                    </div>
                    <div className="p-3 bg-[#0e1628] rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase">Top Location</span>
                      <div className="text-base font-bold text-white font-mono mt-1">Chennai (35%)</div>
                    </div>
                    <div className="p-3 bg-[#0e1628] rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase">Device Share</span>
                      <div className="text-base font-bold text-white font-mono mt-1">Mobile (82%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 06. SOCIAL MEDIA */}
          {activeTab === "Social Media" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { channel: "Instagram", followers: "28K Followers" },
                  { channel: "Facebook", followers: "18K Followers" },
                  { channel: "LinkedIn", followers: "12K Followers" },
                  { channel: "YouTube", followers: "5.2K Subscribers" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.channel}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-indigo-400">{s.followers}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Top Social Media Posts</h3>
                <div className="grid md:grid-cols-4 gap-4 text-xs">
                  {[
                    { title: "Luxury Villa Walkthrough", reach: "25K Reach", eng: "2.5K Eng" },
                    { title: "Construction Timelapse", reach: "18K Reach", eng: "1.8K Eng" },
                    { title: "Interior Design Ideas", reach: "15K Reach", eng: "1.5K Eng" },
                    { title: "Site Progress Update", reach: "12K Reach", eng: "1.2K Eng" }
                  ].map((post, idx) => (
                    <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-3">
                      <span className="font-bold text-white block">{post.title}</span>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>{post.reach}</span>
                        <span className="font-bold text-indigo-400">{post.eng}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 07. CONTENT CREATION */}
          {activeTab === "Content Creation" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs">
                  {["Content Ideas", "In Progress", "Scheduled", "Published"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveContentTab(tab)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                        activeContentTab === tab ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                        <th className="p-3">Title</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {contentItems.map((item) => (
                        <tr key={item.id}>
                          <td className="p-3 font-semibold text-white">{item.title}</td>
                          <td className="p-3 text-slate-350">{item.type}</td>
                          <td className="p-3 font-mono text-slate-400">{item.dueDate}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              item.priority === "High" ? "bg-red-500/10 text-red-400" : "bg-slate-800 text-slate-400"
                            }`}>{item.priority}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Type distribution */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Content Type Distribution</h3>
                <div className="h-44 relative flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={contentDistributionData} dataKey="value" innerRadius={28} outerRadius={46}>
                        {contentDistributionData.map((e, idx) => (
                          <Cell key={`cell-${idx}`} fill={e.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white font-mono">20</span>
                    <span className="text-[8px] text-slate-400 uppercase font-semibold">Total</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 08. WEBSITE MANAGEMENT */}
          {activeTab === "Website Management" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Total Visitors", val: "12,500" },
                  { label: "Page Views", val: "28,450" },
                  { label: "Bounce Rate", val: "34.5%" },
                  { label: "Avg. Session", val: "04:20" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Top Pages</h3>
                  {[
                    { name: "/home", views: "12,500" },
                    { name: "/services", views: "8,200" },
                    { name: "/projects", views: "5,400" },
                    { name: "/about-us", views: "2,350" }
                  ].map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#0e1628] border border-slate-800">
                      <span className="font-semibold text-white font-mono">{p.name}</span>
                      <span className="font-bold text-indigo-400 font-mono">{p.views} views</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Website Health</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between"><span>SSL Certificate</span> <span className="text-emerald-450 text-emerald-400 font-bold">Valid</span></div>
                    <div className="flex justify-between"><span>Broken Links</span> <span className="text-emerald-455 text-emerald-400 font-bold">0</span></div>
                    <div className="flex justify-between"><span>Page Speed Index</span> <span className="text-indigo-400 font-bold font-mono">1.4s</span></div>
                    <div className="flex justify-between"><span>Mobile Optimization</span> <span className="text-emerald-400 font-bold">Good</span></div>
                    <div className="flex justify-between"><span>SEO Score</span> <span className="text-indigo-400 font-bold font-mono">92/100</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 09. GOOGLE BUSINESS PROFILE */}
          {activeTab === "Google Business Profile" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: "Views", val: "8,520" },
                  { label: "Searches", val: "5,450" },
                  { label: "Calls", val: "320" },
                  { label: "Directions", val: "210" },
                  { label: "Website Clicks", val: "450" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                    <div className="text-lg font-bold mt-1 font-mono text-white">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Customer Actions</h3>
                  <div className="h-44 relative flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={gbpActionsData} dataKey="value" innerRadius={28} outerRadius={46}>
                          {gbpActionsData.map((e, idx) => (
                            <Cell key={`cell-${idx}`} fill={e.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Latest Reviews</h3>
                  {reviews.map((r) => (
                    <div key={r.id} className="p-3.5 bg-[#0e1628] border border-slate-850 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-white">{r.author}</span>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold font-mono">
                          {r.rating} <Star className="h-3.5 w-3.5 fill-yellow-400" />
                        </div>
                      </div>
                      <p className="text-slate-300">"{r.text}"</p>
                      
                      {r.reply ? (
                        <div className="p-2 bg-indigo-950/20 rounded border border-indigo-500/20 text-[10px] text-indigo-300">
                          <strong>Your reply:</strong> "{r.reply}"
                        </div>
                      ) : (
                        <div>
                          {replyReviewId === r.id ? (
                            <div className="space-y-2 mt-2">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full p-2 bg-[#0a1120] text-slate-200 border border-slate-850 text-xs rounded-lg resize-none h-16"
                                placeholder="Write response..."
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handlePostReviewReply(r.id)} className="bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 hover:bg-indigo-550 text-white font-bold px-3 py-1 rounded text-[10px]">Submit</button>
                                <button onClick={() => setReplyReviewId(null)} className="bg-slate-800 text-slate-350 px-3 py-1 rounded text-[10px]">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setReplyReviewId(r.id);
                                setReplyText(`Thank you for your feedback, ${r.author}! BuildWell is dedicated to creating top-tier premium home environments.`);
                              }}
                              className="text-[10px] text-indigo-400 hover:underline"
                            >
                              Write reply
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 10. PROJECT PORTFOLIO */}
          {activeTab === "Project Portfolio" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Project Portfolio Media Hub</h3>
                <p className="text-[10px] text-slate-400">Drone visual clips, layouts, and creative photos library</p>
              </div>

              <div className="grid md:grid-cols-4 gap-4 text-xs">
                {[
                  { name: "Luxury Villa", loc: "Skyline Residences", views: 2450, leads: 120, enq: 62 },
                  { name: "Apartment Project", loc: "Greenfield Apartments", views: 1850, leads: 95, enq: 32 },
                  { name: "Commercial Building", loc: "Coimbatore Hub", views: 1680, leads: 80, enq: 25 },
                  { name: "Interior Project", loc: "Show Flats Chennai", views: 1250, leads: 60, enq: 22 }
                ].map((p, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500 transition">
                    <div>
                      <div className="font-bold text-white">{p.name}</div>
                      <span className="text-[9px] text-slate-500 font-medium block mt-0.5">{p.loc}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[9px] pt-3 border-t border-slate-800/80 mt-4">
                      <div>
                        <span className="text-slate-500">Views</span>
                        <div className="text-white font-bold font-mono mt-0.5">{p.views}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Leads</span>
                        <div className="text-emerald-450 text-emerald-450 text-emerald-400 font-bold font-mono mt-0.5">{p.leads}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Enquiries</span>
                        <div className="text-indigo-400 font-bold font-mono mt-0.5">{p.enq}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. PERFORMANCE TRACKER */}
          {activeTab === "Performance Tracker" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Total Leads", val: "1,250" },
                  { label: "Conversions", val: "320" },
                  { label: "Conversion Rate", val: "25.6%" },
                  { label: "Cost Per Lead", val: "₹384" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-sans">Monthly Leads Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={leadsTrendData}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" name="Leads" dataKey="ThisMonth" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Channel Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                          <th className="p-3">Channel</th>
                          <th className="p-3">Leads</th>
                          <th className="p-3">Conversions</th>
                          <th className="p-3">Conv. Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {[
                          ["Website", "540", "150", "27.7%"],
                          ["Google ads", "320", "95", "29.6%"],
                          ["Facebook", "120", "35", "29.1%"],
                          ["Instagram", "180", "28", "15.5%"],
                          ["Referrals", "90", "12", "13.3%"]
                        ].map((row, idx) => (
                          <tr key={idx}>
                            <td className="p-3 font-semibold text-white">{row[0]}</td>
                            <td className="p-3 font-mono font-bold">{row[1]}</td>
                            <td className="p-3 font-mono font-bold">{row[2]}</td>
                            <td className="p-3 font-mono font-bold text-emerald-450 text-emerald-450 text-emerald-400">{row[3]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 12. AI CONTENT ASSISTANT */}
          {activeTab === "AI Content Assistant" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                <div>
                  <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs mb-4">
                    {["Blog", "Ad Copy", "Social Media", "Email", "Keywords"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setAiTab(tab as any)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                          aiTab === tab ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Enter Topic or Keywords</label>
                      <input
                        type="text"
                        value={aiTopicInput}
                        onChange={(e) => setAiTopicInput(e.target.value)}
                        className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Tone</label>
                        <select value={aiTone} onChange={(e) => setAiTone(e.target.value)} className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none">
                          <option value="Professional">Professional</option>
                          <option value="Casual">Casual</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Language</label>
                        <select value={aiLang} onChange={(e) => setAiLang(e.target.value)} className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none">
                          <option value="English">English</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Hindi">Hindi</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAI}
                  disabled={aiLoading}
                  className="w-full bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 hover:bg-indigo-550 text-white font-bold py-2.5 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  {aiLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Generate Content"}
                </button>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 h-[450px] overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">AI Suggestions</h4>
                <div className="space-y-2.5 text-[11px] text-slate-350">
                  <div className="p-2.5 bg-[#0e1628] rounded-lg border border-slate-850">💡 "10 tips for modern house construction"</div>
                  <div className="p-2.5 bg-[#0e1628] rounded-lg border border-slate-850">💡 "Cost saving ideas for your dream home"</div>
                  <div className="p-2.5 bg-[#0e1628] rounded-lg border border-slate-850">💡 "How to choose the right construction company"</div>
                </div>
                {aiOutput && (
                  <div className="p-3.5 bg-[#0e1628] border border-indigo-500/20 rounded-xl mt-4 font-mono text-[10px] text-indigo-300 leading-relaxed whitespace-pre-wrap select-text">
                    {aiOutput}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 13. SETTINGS */}
          {activeTab === "Settings" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                    <input type="text" defaultValue="Karthik Kumar" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                    <input type="text" defaultValue="karthik.marketing@buildcon.com" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Phone</label>
                    <input type="text" defaultValue="+91 98765 43210" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Role</label>
                    <input type="text" readOnly defaultValue="Digital Marketing Executive" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none bg-slate-900/10 cursor-not-allowed" />
                  </div>
                </div>
                <button onClick={() => alert("Profile saved successfully!")} className="bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 hover:bg-indigo-550 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-md transition mt-4">Update Profile</button>
              </div>

              {/* Preferences */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Preferences</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Email Notifications</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-650" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Task Reminders</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-650" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Lead Alerts</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-650" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weekly Reports</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-650" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Marketing Updates</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-650" />
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
