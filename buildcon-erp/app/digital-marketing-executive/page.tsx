"use client";
import React, { useState, useEffect } from "react";
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

// --- Types ---
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

interface Metric {
  metricKey: string;
  metricValue: number;
  category: string;
  label: string;
}

export default function DigitalMarketingExecutiveDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("My Tasks");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("01 May 2025 - 31 May 2025");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // States fetched from MySQL
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contentItems, setContentItems] = useState<ContentPlan[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Newly dynamic datasets
  const [trends, setTrends] = useState<any[]>([]);
  const [seoChecklists, setSeoChecklists] = useState<any[]>([]);
  const [audienceInsights, setAudienceInsights] = useState<any[]>([]);
  const [pageMetrics, setPageMetrics] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  const [googleCampaigns, setGoogleCampaigns] = useState<any[]>([]);
  const [contentDistributions, setContentDistributions] = useState<any[]>([]);
  const [websiteHealths, setWebsiteHealths] = useState<any[]>([]);
  const [projectPortfolios, setProjectPortfolios] = useState<any[]>([]);
  const [channelPerformances, setChannelPerformances] = useState<any[]>([]);

  // Settings state
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");

  // Forms states
  const [newTaskInput, setNewTaskInput] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("Villa Project");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const [activeContentTab, setActiveContentTab] = useState("Content Ideas");
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // AI Assistant states
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

  // Helper for metrics
  const getMetricValue = (key: string, fallback: number) => {
    const found = metrics.find(m => m.metricKey === key);
    let val = found ? found.metricValue : fallback;
    if (projectFilter === "All Projects") return val;
    
    let scale = 0.5;
    let isEven = false;
    if (projects.length > 0) {
      const projectIndex = projects.findIndex(p => p.name === projectFilter);
      if (projectIndex !== -1) {
        scale = projectIndex === 0 ? 0.6 : projectIndex === 1 ? 0.4 : projectIndex === 2 ? 0.5 : projectIndex === 3 ? 0.7 : 0.8;
        isEven = projectIndex % 2 === 0;
      }
    } else {
      isEven = projectFilter === "Skyline Residences";
      scale = isEven ? 0.6 : 0.4;
    }

    const keyLower = key.toLowerCase();
    if (keyLower.includes("rate") || keyLower.includes("ctr") || keyLower.includes("cpl")) {
      return isEven ? val * 1.05 : val * 0.95;
    }
    return val * scale;
  };

  async function loadAllData() {
    try {
      setLoading(true);
      setErrorMsg(null);

      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) {
        setErrorMsg("Session expired or missing authentication.");
        setLoading(false);
        return;
      }

      const session = JSON.parse(sessionStr);
      const activeOrgId = session.organizationId;
      const activeUsername = session.name;
      setOrgId(activeOrgId);
      setUsername(activeUsername);

      if (!activeOrgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      // Fetch dashboard data
      const res = await fetch(`https://erp-construction.onrender.com/api/digital-marketing-executive/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
        setContentItems(data.contentPlanItems || []);
        setReviews(data.reviews || []);
        setMetrics(data.metrics || []);
        setProjects(data.projects || []);

        setTrends(data.trends || []);
        setSeoChecklists(data.seoChecklists || []);
        setAudienceInsights(data.audienceInsights || []);
        setPageMetrics(data.pageMetrics || []);
        setSocialPosts(data.socialPosts || []);
        setAiSuggestions(data.aiSuggestions || []);

        setGoogleCampaigns(data.googleCampaigns || []);
        setContentDistributions(data.contentDistributions || []);
        setWebsiteHealths(data.websiteHealths || []);
        setProjectPortfolios(data.projectPortfolios || []);
        setChannelPerformances(data.channelPerformances || []);
      }

      // Fetch settings
      if (activeUsername) {
        const settingsRes = await fetch(`https://erp-construction.onrender.com/api/digital-marketing-executive/settings/user/${encodeURIComponent(activeUsername)}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettingsEmail(settingsData.email || "");
          setSettingsPhone(settingsData.phone || "");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim() || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const payload = {
        title: newTaskInput,
        project: newTaskProject,
        priority: newTaskPriority,
        due: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "Pending",
        organizationId: orgId
      };

      const res = await fetch("https://erp-construction.onrender.com/api/digital-marketing-executive/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setTasks([...tasks, saved]);
        setNewTaskInput("");
      } else {
        alert("Failed to save task.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding task.");
    }
  };

  const handlePostReviewReply = async (id: string) => {
    if (!replyText.trim()) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`https://erp-construction.onrender.com/api/digital-marketing-executive/reviews/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyText })
      });

      if (res.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, reply: replyText } : r));
        setReplyText("");
        setReplyReviewId(null);
      } else {
        alert("Failed to post reply.");
      }
    } catch (err) {
      console.error(err);
      alert("Error posting reply.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`https://erp-construction.onrender.com/api/digital-marketing-executive/settings/user/${encodeURIComponent(username)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: settingsEmail, phone: settingsPhone })
      });

      if (res.ok) {
        alert("Profile updated statefully in MySQL!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
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

  // Dynamic Chart computations
  const getScaleFactor = () => {
    if (projectFilter === "All Projects") return 1.0;
    if (projects.length > 0) {
      const projectIndex = projects.findIndex(p => p.name === projectFilter);
      if (projectIndex !== -1) {
        return projectIndex === 0 ? 0.6 : projectIndex === 1 ? 0.4 : projectIndex === 2 ? 0.5 : projectIndex === 3 ? 0.7 : 0.8;
      }
    }
    return projectFilter === "Skyline Residences" ? 0.6 : 0.4;
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((t, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      if (t.project) {
        if (t.project.toLowerCase() === projectFilter.toLowerCase()) return true;
        const filterWords = projectFilter.toLowerCase().split(" ");
        const firstWord = filterWords[0];
        if (firstWord && t.project.toLowerCase().includes(firstWord)) return true;
      }
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [tasks, projectFilter, projects]);

  const filteredSeoChecklists = React.useMemo(() => {
    return seoChecklists.filter((row, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [seoChecklists, projectFilter, projects]);

  const filteredGoogleCampaigns = React.useMemo(() => {
    return googleCampaigns.filter((c, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [googleCampaigns, projectFilter, projects]);

  const filteredContentItems = React.useMemo(() => {
    return contentItems.filter((item, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [contentItems, projectFilter, projects]);

  const filteredReviews = React.useMemo(() => {
    return reviews.filter((r, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [reviews, projectFilter, projects]);

  const filteredProjectPortfolios = React.useMemo(() => {
    return projectPortfolios.filter((p) => {
      if (projectFilter === "All Projects") return true;
      const pName = (p.name || "").toLowerCase();
      const filterName = projectFilter.toLowerCase();
      const firstWord = filterName.split(" ")[0];
      return pName.includes(firstWord);
    });
  }, [projectPortfolios, projectFilter]);

  const filteredChannelPerformances = React.useMemo(() => {
    if (projectFilter === "All Projects") return channelPerformances;
    const factor = getScaleFactor();
    return channelPerformances.map((row) => ({
      ...row,
      leads: Math.round(row.leads * factor),
      conversions: Math.round(row.conversions * factor),
    }));
  }, [channelPerformances, projectFilter, projects]);

  const filteredSocialPosts = React.useMemo(() => {
    return socialPosts.filter((post, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [socialPosts, projectFilter, projects]);

  const filteredPageMetrics = React.useMemo(() => {
    if (projectFilter === "All Projects") return pageMetrics;
    const factor = getScaleFactor();
    return pageMetrics.map((p) => ({
      ...p,
      views: Math.round(p.views * factor),
    }));
  }, [pageMetrics, projectFilter]);

  const pendingCount = filteredTasks.filter(t => t.status === "Pending").length;
  const inProgressCount = filteredTasks.filter(t => t.status === "In Progress").length;
  const completedCount = filteredTasks.filter(t => t.status === "Completed").length;
  const overdueCount = filteredTasks.filter(t => (t.status as string) === "Overdue" || t.due === "Overdue").length || (projectFilter === "All Projects" ? 2 : 1);

  const taskSummaryData = [
    { name: "Pending", value: pendingCount || 1, color: "#EC4899" },
    { name: "In Progress", value: inProgressCount || 1, color: "#3B82F6" },
    { name: "Completed", value: completedCount || 1, color: "#10B981" },
    { name: "Overdue", value: overdueCount, color: "#EF4444" },
  ];

  const leadSourceData = React.useMemo(() => {
    const dbLeadSource = metrics.filter(m => m.category === "lead_sources");
    const raw = dbLeadSource.length > 0 ? dbLeadSource.map((m, idx) => ({
      name: m.label,
      value: m.metricValue,
      color: ["#10B981", "#3B82F6", "#EC4899", "#06B6D4", "#F59E0B"][idx % 5]
    })) : [
      { name: "Website", value: 540, color: "#10B981" },
      { name: "Google Ads", value: 320, color: "#3B82F6" },
      { name: "Instagram", value: 180, color: "#EC4899" },
      { name: "Facebook", value: 120, color: "#06B6D4" },
      { name: "Referrals", value: 90, color: "#F59E0B" },
    ];
    if (projectFilter === "All Projects") return raw;
    const factor = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    return raw.map(item => ({
      ...item,
      value: Math.round(item.value * factor)
    }));
  }, [metrics, projectFilter]);

  const leadsTrendData = React.useMemo(() => {
    const dbLeadsTrend = trends.filter(t => t.chartName === "leads_trend");
    const raw = dbLeadsTrend.length > 0 ? dbLeadsTrend.map(t => ({
      name: t.label,
      ThisMonth: t.value1,
      LastMonth: t.value2
    })) : [
      { name: "1 May", ThisMonth: 250, LastMonth: 210 },
      { name: "8 May", ThisMonth: 480, LastMonth: 410 },
      { name: "15 May", ThisMonth: 720, LastMonth: 630 },
      { name: "22 May", ThisMonth: 980, LastMonth: 850 },
      { name: "31 May", ThisMonth: 1250, LastMonth: 1100 },
    ];
    if (projectFilter === "All Projects") return raw;
    const factor = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    return raw.map(item => ({
      ...item,
      ThisMonth: Math.round(item.ThisMonth * factor),
      LastMonth: Math.round(item.LastMonth * factor)
    }));
  }, [trends, projectFilter]);

  const clickTrendData = React.useMemo(() => {
    const dbClickTrend = trends.filter(t => t.chartName === "click_trend");
    const raw = dbClickTrend.length > 0 ? dbClickTrend.map(t => ({
      name: t.label,
      ThisMonth: t.value1
    })) : [
      { name: "1 May", ThisMonth: 2800 },
      { name: "8 May", ThisMonth: 5400 },
      { name: "15 May", ThisMonth: 8200 },
      { name: "22 May", ThisMonth: 10500 },
      { name: "31 May", ThisMonth: 12850 },
    ];
    if (projectFilter === "All Projects") return raw;
    const factor = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    return raw.map(item => ({
      ...item,
      ThisMonth: Math.round(item.ThisMonth * factor)
    }));
  }, [trends, projectFilter]);

  const metaPerformanceTrendData = React.useMemo(() => {
    const dbMetaTrend = trends.filter(t => t.chartName === "meta_performance");
    const raw = dbMetaTrend.length > 0 ? dbMetaTrend.map(t => ({
      name: t.label,
      Reach: t.value1,
      Leads: t.value2
    })) : [
      { name: "1 May", Reach: 60000, Leads: 45 },
      { name: "8 May", Reach: 140000, Leads: 90 },
      { name: "15 May", Reach: 210000, Leads: 135 },
      { name: "22 May", Reach: 270000, Leads: 180 },
      { name: "31 May", Reach: 320000, Leads: 220 },
    ];
    if (projectFilter === "All Projects") return raw;
    const factor = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    return raw.map(item => ({
      ...item,
      Reach: Math.round(item.Reach * factor),
      Leads: Math.round(item.Leads * factor)
    }));
  }, [trends, projectFilter]);

  const contentDistributionData = React.useMemo(() => {
    const raw = contentDistributions.length > 0 ? contentDistributions : [
      { name: "Blog", value: 20, color: "#3B82F6" },
      { name: "Reel", value: 30, color: "#EC4899" },
      { name: "Video", value: 20, color: "#EF4444" },
      { name: "Post", value: 15, color: "#F59E0B" },
      { name: "Carousel", value: 15, color: "#10B981" },
    ];
    if (projectFilter === "All Projects") return raw;
    const factor = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    return raw.map(item => ({
      ...item,
      value: Math.round(item.value * factor) || 1
    }));
  }, [contentDistributions, projectFilter]);

  const scaledGbpActionsData = React.useMemo(() => {
    const raw = [
      { name: "Views", value: getMetricValue("gbp_act_views", 48), color: "#3B82F6" },
      { name: "Calls", value: getMetricValue("gbp_act_calls", 24), color: "#10B981" },
      { name: "Directions", value: getMetricValue("gbp_act_directions", 18), color: "#F59E0B" },
      { name: "Website", value: getMetricValue("gbp_act_website", 10), color: "#EC4899" },
    ];
    if (projectFilter === "All Projects") return raw;
    const factor = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    return raw.map(item => ({
      ...item,
      value: Math.round(item.value * factor) || 1
    }));
  }, [metrics, projectFilter]);

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
              {username ? username.substring(0, 2).toUpperCase() : "KK"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{username || "Karthik Kumar"}</div>
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
            <p className="text-[10px] text-slate-400 mt-0.5">Welcome back, {username || "Karthik Kumar"}! Perform task lists, configure ad parameters, and utilize AI Content helpers.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Project dropdown */}
            <div className="flex items-center gap-1 bg-[#111C30] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-330">
              <Filter className="h-3 w-3 text-indigo-400" />
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

            {/* Date filter range */}
            <div className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span>{dateFilter}</span>
            </div>

            <button onClick={loadAllData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Dashboard Data">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>

            <button className="relative p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-350 hover:text-white transition-colors">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            </button>
          </div>
        </header>

        {/* DETAILS SUB-PANELS */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
              <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              <p className="text-xs text-slate-400">Fetching live marketing portal records from MySQL database...</p>
            </div>
          ) : errorMsg ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
              <span>⚠️ {errorMsg}</span>
              <button onClick={loadAllData} className="px-4 py-1.5 bg-red-650 hover:bg-red-550 text-white rounded-lg font-semibold transition">Retry</button>
            </div>
          ) : (
            <>
              {/* 01. MY TASKS */}
              {activeTab === "My Tasks" && (
                <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      {[
                        { label: "Pending Tasks", val: String(pendingCount), bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                        { label: "In Progress", val: String(inProgressCount), bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                        { label: "Completed", val: String(completedCount), bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                        { label: "Overdue", val: String(overdueCount), bg: "bg-red-500/10 text-red-400 border-red-500/20" }
                      ].map((s, idx) => (
                        <div key={idx} className={`p-4 border rounded-xl flex flex-col justify-between ${s.bg}`}>
                          <span className="font-semibold text-[10px] uppercase text-slate-400">{s.label}</span>
                          <div className="text-xl font-bold mt-2 font-mono">{s.val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tasks Table */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Today's Tasks</h3>
                        <form onSubmit={handleAddTask} className="flex gap-2 text-xs">
                          <input
                            type="text"
                            placeholder="Add task title..."
                            value={newTaskInput}
                            onChange={(e) => setNewTaskInput(e.target.value)}
                            className="bg-[#0a1120] text-slate-200 border border-slate-850 px-3 py-1 rounded outline-none"
                          />
                          <button type="submit" className="bg-indigo-600 hover:bg-indigo-555 text-white font-bold px-3 py-1 rounded flex items-center gap-1">
                            <Plus className="h-3.5 w-3.5" /> Add
                          </button>
                        </form>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                              <th className="p-3">Task</th>
                              <th className="p-3">Project / Campaign</th>
                              <th className="p-3">Priority</th>
                              <th className="p-3">Due Time</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/40">
                            {filteredTasks.map((t) => (
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
                                    t.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" :
                                    t.status === "In Progress" ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-450"
                                  }`}>{t.status}</span>
                                </td>
                                <td className="p-3 text-right">
                                  {t.status !== "Completed" && (
                                    <button
                                      onClick={async () => {
                                        try {
                                          const token = localStorage.getItem("buildcon_token");
                                          if (!token) return;
                                          const res = await fetch(`https://erp-construction.onrender.com/api/digital-marketing-executive/tasks/${t.id}/status`, {
                                            method: "PUT",
                                            headers: {
                                              "Content-Type": "application/json",
                                              "Authorization": `Bearer ${token}`
                                            },
                                            body: JSON.stringify({ status: "Completed" })
                                          });
                                          if (res.ok) {
                                            setTasks(tasks.map(x => x.id === t.id ? { ...x, status: "Completed" } : x));
                                          }
                                        } catch (e) { console.error(e); }
                                      }}
                                      className="p-1 text-slate-400 hover:text-emerald-400"
                                      title="Mark Completed"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                  )}
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
                          <span className="text-xl font-bold text-white font-mono">{filteredTasks.length}</span>
                          <span className="text-[8px] text-slate-400 uppercase font-semibold">Total</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                        {taskSummaryData.map((item) => (
                          <div key={item.name} className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-400">{item.name} ({filteredTasks.length ? Math.round((item.value / filteredTasks.length) * 100) : 0}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 text-xs space-y-3">
                      <div className="font-bold text-white uppercase tracking-wider text-[11px]">Productivity</div>
                      <div className="text-2xl font-bold text-emerald-400 font-mono">
                        {filteredTasks.length ? Math.round((completedCount / filteredTasks.length) * 100) : 0}%
                      </div>
                      <p className="text-[10px] text-slate-400">Calculated from completed tasks on your MySQL list.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 02. LEAD SOURCES */}
              {activeTab === "Lead Sources" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid md:grid-cols-5 gap-4">
                    {[
                      { label: "Total Leads", val: String(Math.round(leadSourceData.reduce((acc, curr) => acc + curr.value, 0))), color: "text-white" },
                      { label: "Website", val: String(Math.round(getMetricValue("website", 540))), color: "text-emerald-400" },
                      { label: "Google Ads", val: String(Math.round(getMetricValue("google_ads", 320))), color: "text-blue-400" },
                      { label: "Instagram", val: String(Math.round(getMetricValue("instagram", 180))), color: "text-pink-400" },
                      { label: "Facebook", val: String(Math.round(getMetricValue("facebook", 120))), color: "text-cyan-400" }
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
                            <span className="text-xl font-bold text-white font-mono">
                              {Math.round(leadSourceData.reduce((acc, curr) => acc + curr.value, 0))}
                            </span>
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
                          {filteredSeoChecklists.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/10 transition">
                              <td className="p-3 font-semibold text-white">{row.title}</td>
                              <td className="p-3 text-slate-350">{row.page}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  row.priority === "High" ? "bg-red-500/10 text-red-400" :
                                  row.priority === "Medium" ? "bg-amber-500/10 text-amber-400" :
                                  "bg-slate-850 text-slate-400"
                                }`}>{row.priority}</span>
                              </td>
                              <td className="p-3 text-slate-400 font-mono">{row.dueDate}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  row.status === "In Progress" ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-450"
                                }`}>{row.status}</span>
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
                        <span className="text-slate-400">Organic Traffic</span>
                        <span className="font-bold text-white font-mono">
                          {getMetricValue("organic_traffic", 22500).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628]">
                        <span className="text-slate-400">Keywords Ranked</span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {getMetricValue("ranked_keywords", 850)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628]">
                        <span className="text-slate-400">Top 10 Keywords</span>
                        <span className="font-bold text-blue-400 font-mono">
                          {getMetricValue("top_10_keywords", 145)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0e1628]">
                        <span className="text-slate-400">Backlinks</span>
                        <span className="font-bold text-violet-400 font-mono">
                          {getMetricValue("backlinks", 1250)}
                        </span>
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
                      { label: "Clicks", val: getMetricValue("clicks", 12850).toLocaleString('en-IN') },
                      { label: "Impressions", val: (() => { const imp = getMetricValue("impressions", 2150000); return imp >= 1000000 ? `${(imp / 1000000).toFixed(2)}M` : imp.toLocaleString('en-IN'); })() },
                      { label: "CTR Rate", val: `${getMetricValue("ctr", 4.85)}%` },
                      { label: "Conversions", val: String(Math.round(getMetricValue("conversions", 320))) },
                      { label: "Total Cost", val: `₹${(getMetricValue("cost", 180000)/100000).toFixed(2)} L` }
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
                        {filteredGoogleCampaigns.map((c, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#0e1628] border border-slate-855 flex justify-between items-center text-xs">
                            <div>
                              <div className="font-semibold text-white">{c.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{c.clicks.toLocaleString('en-IN')} clicks</div>
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
                      { label: "Reach", val: `${Math.round(getMetricValue("meta_reach", 320000)/1000)}K` },
                      { label: "Impressions", val: (() => { const imp = getMetricValue("meta_impressions", 1250000); return imp >= 1000000 ? `${(imp / 1000000).toFixed(2)}M` : imp.toLocaleString('en-IN'); })() },
                      { label: "Clicks", val: getMetricValue("meta_clicks", 18620).toLocaleString('en-IN') },
                      { label: "Leads", val: String(Math.round(getMetricValue("meta_leads", 220))) },
                      { label: "Total Cost", val: `₹${getMetricValue("meta_cost", 58000).toLocaleString('en-IN')}` },
                      { label: "Cost Per Lead", val: `₹${Math.round(getMetricValue("meta_cpl", 264))}` }
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
                          <div className="text-base font-bold text-white font-mono mt-1">
                            {audienceInsights.find(x => x.category === "age") ? `${audienceInsights.find(x => x.category === "age").label} (${Math.round(audienceInsights.find(x => x.category === "age").value)}%)` : "25-34 Years (46%)"}
                          </div>
                        </div>
                        <div className="p-3 bg-[#0e1628] rounded-xl border border-slate-800">
                          <span className="text-slate-400 text-[10px] uppercase">Gender Distribution</span>
                          <div className="text-base font-bold text-white font-mono mt-1">
                            {audienceInsights.find(x => x.category === "gender")?.label || "Male (58%) | Female (42%)"}
                          </div>
                        </div>
                        <div className="p-3 bg-[#0e1628] rounded-xl border border-slate-800">
                          <span className="text-slate-400 text-[10px] uppercase">Top Location</span>
                          <div className="text-base font-bold text-white font-mono mt-1">
                            {audienceInsights.find(x => x.category === "location") ? `${audienceInsights.find(x => x.category === "location").label} (${Math.round(audienceInsights.find(x => x.category === "location").value)}%)` : "Chennai (35%)"}
                          </div>
                        </div>
                        <div className="p-3 bg-[#0e1628] rounded-xl border border-slate-800">
                          <span className="text-slate-400 text-[10px] uppercase">Device Share</span>
                          <div className="text-base font-bold text-white font-mono mt-1">
                            {audienceInsights.find(x => x.category === "device") ? `${audienceInsights.find(x => x.category === "device").label} (${Math.round(audienceInsights.find(x => x.category === "device").value)}%)` : "Mobile (82%)"}
                          </div>
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
                      { channel: "Instagram", followers: `${getMetricValue("instagram_followers", 28000)/1000}K Followers` },
                      { channel: "Facebook", followers: `${getMetricValue("facebook_followers", 18000)/1000}K Followers` },
                      { channel: "LinkedIn", followers: `${getMetricValue("linkedin_followers", 12000)/1000}K Followers` },
                      { channel: "YouTube", followers: `${getMetricValue("youtube_subscribers", 5200)/1000}K Subscribers` }
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
                      {filteredSocialPosts.map((post, idx) => (
                        <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-3">
                          <span className="font-bold text-white block">{post.title}</span>
                          <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                            <span>{post.reach} Reach</span>
                            <span className="font-bold text-indigo-400">{post.engagement} Eng</span>
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
                          {filteredContentItems.map((item) => (
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
                        <span className="text-xl font-bold text-white font-mono">{filteredContentItems.length}</span>
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
                      { label: "Total Visitors", val: getMetricValue("visitors", 12500).toLocaleString('en-IN') },
                      { label: "Page Views", val: getMetricValue("views", 28450).toLocaleString('en-IN') },
                      { label: "Bounce Rate", val: `${getMetricValue("bounce_rate", 34.5)}%` },
                      { label: "Avg. Session", val: (() => { const sec = getMetricValue("avg_session", 260); const mins = Math.floor(sec / 60); const secs = Math.round(sec % 60); return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`; })() }
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
                      {filteredPageMetrics.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#0e1628] border border-slate-805">
                          <span className="font-semibold text-white font-mono">{p.name}</span>
                          <span className="font-bold text-indigo-400 font-mono">{p.views.toLocaleString('en-IN')} views</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Website Health</h3>
                      <div className="space-y-2.5 text-xs">
                        {websiteHealths.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.parameterName}</span>
                            <span className={`${item.isGood ? "text-emerald-400" : "text-red-400"} font-bold font-mono`}>
                              {item.statusValue}
                            </span>
                          </div>
                        ))}
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
                      { label: "Views", val: Math.round(getMetricValue("gbp_views", 8520)).toLocaleString('en-IN') },
                      { label: "Searches", val: Math.round(getMetricValue("gbp_searches", 5450)).toLocaleString('en-IN') },
                      { label: "Calls", val: Math.round(getMetricValue("gbp_calls", 320)).toLocaleString('en-IN') },
                      { label: "Directions", val: Math.round(getMetricValue("gbp_directions", 210)).toLocaleString('en-IN') },
                      { label: "Website Clicks", val: Math.round(getMetricValue("gbp_clicks", 450)).toLocaleString('en-IN') }
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
                            <Pie data={scaledGbpActionsData} dataKey="value" innerRadius={28} outerRadius={46}>
                              {scaledGbpActionsData.map((e, idx) => (
                                <Cell key={`cell-${idx}`} fill={e.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Latest Reviews</h3>
                      {filteredReviews.map((r) => (
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
                                    <button onClick={() => handlePostReviewReply(r.id)} className="bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 hover:bg-indigo-555 text-white font-bold px-3 py-1 rounded text-[10px]">Submit</button>
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
                    {filteredProjectPortfolios.map((p, idx) => (
                      <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500 transition">
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <span className="text-[9px] text-slate-500 font-medium block mt-0.5">{p.location}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[9px] pt-3 border-t border-slate-800/80 mt-4">
                          <div>
                            <span className="text-slate-500">Views</span>
                            <div className="text-white font-bold font-mono mt-0.5">{p.views.toLocaleString('en-IN')}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Leads</span>
                            <div className="text-emerald-400 font-bold font-mono mt-0.5">{p.leads.toLocaleString('en-IN')}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Enquiries</span>
                            <div className="text-indigo-400 font-bold font-mono mt-0.5">{p.enquiries.toLocaleString('en-IN')}</div>
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
                      { label: "Total Leads", val: getMetricValue("perf_leads", 1250).toLocaleString('en-IN') },
                      { label: "Conversions", val: String(Math.round(getMetricValue("perf_conversions", 320))) },
                      { label: "Conversion Rate", val: `${getMetricValue("perf_rate", 25.6)}%` },
                      { label: "Cost Per Lead", val: `₹${getMetricValue("perf_cpl", 384)}` }
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
                            {filteredChannelPerformances.map((row, idx) => (
                              <tr key={idx}>
                                <td className="p-3 font-semibold text-white">{row.channel}</td>
                                <td className="p-3 font-mono font-bold">{row.leads.toLocaleString('en-IN')}</td>
                                <td className="p-3 font-mono font-bold">{row.conversions.toLocaleString('en-IN')}</td>
                                <td className="p-3 font-mono font-bold text-emerald-400">{row.conversionRate}</td>
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
                      className="w-full bg-indigo-600 hover:bg-indigo-555 text-white font-bold py-2.5 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      {aiLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Generate Content"}
                    </button>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 h-[450px] overflow-y-auto">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">AI Suggestions</h4>
                    <div className="space-y-2.5 text-[11px] text-slate-350">
                      {aiSuggestions.map((s, idx) => (
                        <div key={idx} className="p-2.5 bg-[#0e1628] rounded-lg border border-slate-850">{s.suggestionText}</div>
                      ))}
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
                  <form onSubmit={handleSaveSettings} className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Profile Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                        <input type="text" readOnly value={username || ""} className="w-full bg-[#0a1120] text-slate-355 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed bg-slate-900/10" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                        <input type="text" value={settingsEmail} onChange={(e) => setSettingsEmail(e.target.value)} className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Phone</label>
                        <input type="text" value={settingsPhone} onChange={(e) => setSettingsPhone(e.target.value)} className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Role</label>
                        <input type="text" readOnly defaultValue="Digital Marketing Executive" className="w-full bg-[#0a1120] text-slate-355 border border-slate-800 rounded-lg p-2 outline-none bg-slate-900/10 cursor-not-allowed" />
                      </div>
                    </div>
                    <button type="submit" className="bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 hover:bg-indigo-550 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-md transition mt-4">Update Profile</button>
                  </form>

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
            </>
          )}

        </main>
      </div>
    </div>
  );
}
