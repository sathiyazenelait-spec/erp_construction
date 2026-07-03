"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, Target, CheckSquare, Calendar, FileText, MessageSquare,
  TrendingUp, BarChart3, Users, DollarSign, Bot, Settings, LogOut,
  Building2, Bell, Filter, Plus, Check, Star, RefreshCw, SendHorizontal, Trash2
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

// --- Types & Mock Data ---
interface Lead {
  id: string;
  name: string;
  source: string;
  projectType: string;
  location: string;
  budget: string;
  status: "Hot" | "Warm" | "Cold";
  addedOn: string;
}

interface Proposal {
  id: string;
  leadName: string;
  proposalNo: string;
  amount: string;
  sentOn: string;
  status: "Under Review" | "Negotiation" | "Approved" | "Rejected";
}

interface ChatMessage {
  id: string;
  sender: "client" | "executive";
  text: string;
  time: string;
}

interface ClientChat {
  id: string;
  name: string;
  latest: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
}

interface ActivityLog {
  id: string;
  activity: string;
  leadName: string;
  type: string;
  time: string;
  date?: string;
  status: "Completed" | "Pending";
}

export default function SalesExecutiveDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard Overview");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("28 May 2025, Thursday");
  const [projects, setProjects] = useState<any[]>([]);

  // Session & UI States
  const [token, setToken] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [chats, setChats] = useState<ClientChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const [aiActions, setAiActions] = useState<string[]>([]);

  const [summaryStats, setSummaryStats] = useState({
    totalLeads: 0,
    wonDeals: 0,
    revenueAchieved: "₹0.0 L",
    conversionRate: "0.0%",
    pipelineValue: 0,
    hotCount: 0,
    warmCount: 0,
    coldCount: 0,
    monthlyTarget: "₹1,00,00,000",
    achievementRate: "0.0%",
  });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    smsNotifications: true,
    emailNotifications: true,
    whatsappAlerts: true
  });

  async function loadData(targetOrgId?: string, targetToken?: string, targetUsername?: string) {
    const activeOrgId = targetOrgId || orgId;
    const activeToken = targetToken || token;
    const activeUsername = targetUsername || username;

    if (!activeOrgId || !activeToken) return;

    try {
      setLoading(true);
      const headers = { "Authorization": `Bearer ${activeToken}` };

      // 1. Fetch projects
      const projRes = await fetch("http://localhost:8081/api/projects", { headers });
      const projData = await projRes.json();
      if (Array.isArray(projData)) setProjects(projData);

      // 2. Fetch summary stats
      const statsRes = await fetch(`http://localhost:8081/api/sales-executive/summary/org/${activeOrgId}`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setSummaryStats(statsData);
      }

      // 3. Fetch leads
      const leadsRes = await fetch(`http://localhost:8081/api/sales-executive/leads/org/${activeOrgId}`, { headers });
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData);
      }

      // 4. Fetch proposals
      const proposalsRes = await fetch(`http://localhost:8081/api/sales-executive/proposals/org/${activeOrgId}`, { headers });
      if (proposalsRes.ok) {
        const proposalsData = await proposalsRes.json();
        setProposals(proposalsData);
      }

      // 5. Fetch activities
      const activitiesRes = await fetch(`http://localhost:8081/api/sales-executive/activities/org/${activeOrgId}`, { headers });
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData);
      }

      // 6. Fetch chats
      const chatsRes = await fetch(`http://localhost:8081/api/sales-executive/chats/org/${activeOrgId}`, { headers });
      if (chatsRes.ok) {
        const chatsData = await chatsRes.json();
        setChats(chatsData);
        if (chatsData.length > 0 && !activeChatId) {
          setActiveChatId(chatsData[0].id);
        }
      }

      // 7. Fetch revenue trend data
      const revRes = await fetch(`http://localhost:8081/api/sales-executive/revenue/org/${activeOrgId}`, { headers });
      if (revRes.ok) {
        const revData = await revRes.json();
        setRevenueChartData(revData);
      }

      // 8. Fetch AI insights
      const aiRes = await fetch(`http://localhost:8081/api/sales-executive/ai-insights/org/${activeOrgId}`, { headers });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        if (aiData.insights) setAiMessages(aiData.insights);
        if (aiData.actions) setAiActions(aiData.actions);
      }

      // 9. Fetch Calendar
      const calRes = await fetch(`http://localhost:8081/api/sales-executive/calendar/org/${activeOrgId}`, { headers });
      if (calRes.ok) {
        const calData = await calRes.json();
        setCalendarDays(calData);
      }

      // 10. Fetch profile settings
      if (activeUsername) {
        const settingsRes = await fetch(`http://localhost:8081/api/sales-executive/settings/user/${activeUsername}`, { headers });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setProfile({
            name: settingsData.name || activeUsername,
            email: settingsData.email || "",
            phone: settingsData.phone || "",
            smsNotifications: settingsData.smsNotifications !== false,
            emailNotifications: settingsData.emailNotifications !== false,
            whatsappAlerts: settingsData.whatsappAlerts !== false,
          });
        }
      }

      setErrorMsg(null);
    } catch (err) {
      console.error("Error loading sales data:", err);
      setErrorMsg("Failed to load dashboard data from backend.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    const sessionStr = localStorage.getItem("buildcon_session");
    const t = localStorage.getItem("buildcon_token");
    if (sessionStr && t) {
      try {
        const session = JSON.parse(sessionStr);
        setOrgId(session.organizationId);
        setToken(t);
        setUsername(session.name);
        loadData(session.organizationId, t, session.name);
      } catch (err) {
        console.error("Error parsing session string:", err);
        setErrorMsg("Failed to parse active user session details.");
        setLoading(false);
      }
    } else {
      setErrorMsg("Session expired or missing authentication.");
      setLoading(false);
    }
  }, []);

  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadBudget, setNewLeadBudget] = useState("₹60 L");
  const [newLeadProj, setNewLeadProj] = useState("Villa");
  const [newLeadSource, setNewLeadSource] = useState("Manual");
  const [newLeadLocation, setNewLeadLocation] = useState("Chennai");
  const [newLeadStatus, setNewLeadStatus] = useState<"Hot" | "Warm" | "Cold">("Hot");
  const [showAddModal, setShowAddModal] = useState(false);

  // Dynamic Lead Qualification States
  const [selectedQualifyLeadId, setSelectedQualifyLeadId] = useState<string>("");
  const [qualifyBudgetFit, setQualifyBudgetFit] = useState("Yes");
  const [qualifyDecisionMaker, setQualifyDecisionMaker] = useState("");
  const [qualifyTimelineFit, setQualifyTimelineFit] = useState("Yes");
  const [qualifyTimeline, setQualifyTimeline] = useState("Within 6 Months");
  const [qualifyPlotSize, setQualifyPlotSize] = useState("2400 Sq.Ft");
  const [qualifyFloors, setQualifyFloors] = useState("G+1");
  const [qualifyRequirements, setQualifyRequirements] = useState("4 BHK, Modern Design");
  const [qualifyRequirementClarity, setQualifyRequirementClarity] = useState("High");
  const [qualifyCompetition, setQualifyCompetition] = useState("None");
  const [qualifyLeadScore, setQualifyLeadScore] = useState(3);
  const [qualifyStatus, setQualifyStatus] = useState("Warm Lead");
  const [qualifyRemarks, setQualifyRemarks] = useState("");

  // Dynamic Follow-up/Activity Scheduling States
  const [newActLeadName, setNewActLeadName] = useState("");
  const [newActActivity, setNewActActivity] = useState("");
  const [newActType, setNewActType] = useState("Call");
  const [newActTime, setNewActTime] = useState("");
  const [newActDate, setNewActDate] = useState("");
  const [showAddActModal, setShowAddActModal] = useState(false);

  // Dynamic Proposal Tracking States
  const [newPropLeadName, setNewPropLeadName] = useState("");
  const [newPropNo, setNewPropNo] = useState("");
  const [newPropAmount, setNewPropAmount] = useState("");
  const [showAddPropModal, setShowAddPropModal] = useState(false);

  const selectedQualifyLead = React.useMemo(() => {
    if (leads.length === 0) return null;
    if (!selectedQualifyLeadId) {
      const firstHot = leads.find(l => l.status === "Hot") || leads[0];
      return firstHot;
    }
    return leads.find(l => String(l.id) === selectedQualifyLeadId) || leads[0];
  }, [leads, selectedQualifyLeadId]);

  React.useEffect(() => {
    if (selectedQualifyLead) {
      setQualifyBudgetFit((selectedQualifyLead as any).budgetFit || "Yes");
      setQualifyDecisionMaker((selectedQualifyLead as any).decisionMaker || selectedQualifyLead.name || "");
      setQualifyTimelineFit((selectedQualifyLead as any).timelineFit || "Yes");
      setQualifyTimeline((selectedQualifyLead as any).timeline || "Within 6 Months");
      setQualifyPlotSize((selectedQualifyLead as any).plotSize || "2400 Sq.Ft");
      setQualifyFloors((selectedQualifyLead as any).floors || "G+1");
      setQualifyRequirements((selectedQualifyLead as any).requirements || "4 BHK, Modern Design");
      setQualifyRequirementClarity((selectedQualifyLead as any).requirementClarity || "High");
      setQualifyCompetition((selectedQualifyLead as any).competition || "None");
      setQualifyLeadScore((selectedQualifyLead as any).leadScore || 3);
      setQualifyStatus((selectedQualifyLead as any).qualifiedStatus || "Warm Lead");
      setQualifyRemarks((selectedQualifyLead as any).remarks || "");
    }
  }, [selectedQualifyLead]);

  const userInitials = React.useMemo(() => {
    const displayName = profile.name || username || "Arjun Kumar";
    return displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }, [profile.name, username]);

  const filteredLeads = React.useMemo(() => {
    return leads.filter((lead, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [leads, projectFilter, projects]);

  const filteredProposals = React.useMemo(() => {
    return proposals.filter(p => {
      if (projectFilter === "All Projects") return true;
      return filteredLeads.some(l => l.name === p.leadName);
    });
  }, [proposals, filteredLeads, projectFilter]);

  const filteredActivities = React.useMemo(() => {
    return activities.filter(a => {
      if (projectFilter === "All Projects") return true;
      return filteredLeads.some(l => l.name === a.leadName);
    });
  }, [activities, filteredLeads, projectFilter]);

  const dynamicPipelineValue = React.useMemo(() => {
    let val = 0;
    for (const lead of filteredLeads) {
      try {
        const valStr = lead.budget.replaceAll(/[^0-9]/g, "").trim();
        if (valStr) {
          const num = parseInt(valStr);
          if (lead.budget.includes("Cr")) {
            val += num * 10000000;
          } else if (lead.budget.includes("L")) {
            val += num * 100000;
          } else {
            val += num;
          }
        }
      } catch (e) {
        // Ignore
      }
    }
    return val;
  }, [filteredLeads]);

  const dynamicConversionRate = React.useMemo(() => {
    const totalLeads = filteredLeads.length;
    const wonDeals = filteredProposals.filter(p => p.status === "Approved").length;
    const cr = totalLeads > 0 ? (wonDeals * 100) / totalLeads : 0;
    return `${cr.toFixed(1)}%`;
  }, [filteredLeads, filteredProposals]);

  const dynamicExpectedClose = React.useMemo(() => {
    try {
      const crStr = dynamicConversionRate.replace("%", "").trim();
      const cr = parseFloat(crStr) || 0;
      return dynamicPipelineValue * (cr / 100);
    } catch(e) {
      return 0;
    }
  }, [dynamicPipelineValue, dynamicConversionRate]);

  const dynamicTotalLeads = React.useMemo(() => {
    return projectFilter === "All Projects" ? summaryStats.totalLeads : filteredLeads.length;
  }, [filteredLeads, summaryStats.totalLeads, projectFilter]);

  const dynamicWonDeals = React.useMemo(() => {
    return projectFilter === "All Projects" ? summaryStats.wonDeals : filteredProposals.filter(p => p.status === "Approved").length;
  }, [filteredProposals, summaryStats.wonDeals, projectFilter]);

  const dynamicDisplayConversionRate = React.useMemo(() => {
    return projectFilter === "All Projects" ? summaryStats.conversionRate : dynamicConversionRate;
  }, [dynamicConversionRate, summaryStats.conversionRate, projectFilter]);

  const dynamicHotCount = React.useMemo(() => {
    return projectFilter === "All Projects" ? summaryStats.hotCount : filteredLeads.filter(l => l.status === "Hot").length;
  }, [filteredLeads, summaryStats.hotCount, projectFilter]);

  const dynamicWarmCount = React.useMemo(() => {
    return projectFilter === "All Projects" ? summaryStats.warmCount : filteredLeads.filter(l => l.status === "Warm").length;
  }, [filteredLeads, summaryStats.warmCount, projectFilter]);

  const dynamicColdCount = React.useMemo(() => {
    return projectFilter === "All Projects" ? summaryStats.coldCount : filteredLeads.filter(l => l.status === "Cold").length;
  }, [filteredLeads, summaryStats.coldCount, projectFilter]);

  // qualification memo replaced with dynamic states

  const [aiAssistantTab, setAiAssistantTab] = useState<"Smart Insights" | "Lead Scoring" | "Next Best Action" | "Prediction">("Smart Insights");
  const [aiChatInput, setAiChatInput] = useState("");

  // --- Sidebar Items ---
  const sidebarItems = [
    { name: "Dashboard Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "My Leads", icon: <Target className="h-4 w-4" /> },
    { name: "Lead Qualification", icon: <CheckSquare className="h-4 w-4" /> },
    { name: "Follow-up Center", icon: <CheckSquare className="h-4 w-4" /> },
    { name: "Proposal Tracker", icon: <FileText className="h-4 w-4" /> },
    { name: "Client Communication", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Sales Pipeline", icon: <TrendingUp className="h-4 w-4" /> },
    { name: "Revenue Tracker", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Conversion Tracker", icon: <Users className="h-4 w-4" /> },
    { name: "Daily Activity", icon: <CheckSquare className="h-4 w-4" /> },
    { name: "AI Sales Assistant", icon: <Bot className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
    { name: "Calendar View", icon: <Calendar className="h-4 w-4" /> },
  ];

  // --- Handlers ---
  const handleAddNewLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !orgId) return;
    try {
      const res = await fetch("http://localhost:8081/api/sales-executive/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newLeadName,
          source: newLeadSource,
          projectType: newLeadProj,
          location: newLeadLocation,
          budget: newLeadBudget,
          status: newLeadStatus,
          organizationId: parseInt(orgId)
        })
      });
      if (res.ok) {
        setNewLeadName("");
        setNewLeadSource("Manual");
        setNewLeadProj("Villa");
        setNewLeadLocation("Chennai");
        setNewLeadBudget("₹60 L");
        setNewLeadStatus("Hot");
        setShowAddModal(false);
        loadData();
      } else {
        alert("Failed to save new lead.");
      }
    } catch (err) {
      console.error("Error creating new lead:", err);
    }
  };

  const handleQualifyLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQualifyLead || !token) return;
    try {
      const res = await fetch(`http://localhost:8081/api/sales-executive/leads/${selectedQualifyLead.id}/qualify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          budgetFit: qualifyBudgetFit,
          decisionMaker: qualifyDecisionMaker,
          timelineFit: qualifyTimelineFit,
          timeline: qualifyTimeline,
          plotSize: qualifyPlotSize,
          floors: qualifyFloors,
          requirements: qualifyRequirements,
          requirementClarity: qualifyRequirementClarity,
          competition: qualifyCompetition,
          leadScore: qualifyLeadScore,
          qualifiedStatus: qualifyStatus,
          remarks: qualifyRemarks
        })
      });
      if (res.ok) {
        alert("Lead qualified successfully!");
        loadData();
      } else {
        alert("Failed to qualify lead.");
      }
    } catch(err) {
      console.error("Error qualifying lead:", err);
      alert("An error occurred while qualifying lead.");
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActLeadName || !newActActivity || !orgId) return;
    try {
      const res = await fetch("http://localhost:8081/api/sales-executive/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          leadName: newActLeadName,
          activity: newActActivity,
          type: newActType,
          time: newActTime || "12:00 PM",
          date: newActDate || new Date().toISOString().split("T")[0],
          status: "Pending",
          organizationId: parseInt(orgId)
        })
      });
      if (res.ok) {
        setNewActLeadName("");
        setNewActActivity("");
        setNewActType("Call");
        setNewActTime("");
        setNewActDate("");
        setShowAddActModal(false);
        loadData();
      } else {
        alert("Failed to schedule activity.");
      }
    } catch(err) {
      console.error("Error creating activity:", err);
    }
  };

  const handleCompleteActivity = async (act: any) => {
    try {
      const res = await fetch("http://localhost:8081/api/sales-executive/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: act.id,
          leadName: act.leadName,
          activity: act.activity,
          type: act.type,
          time: act.time,
          date: act.date || new Date().toISOString().split("T")[0],
          status: "Completed",
          organizationId: parseInt(orgId || "4")
        })
      });
      if (res.ok) {
        loadData();
      } else {
        alert("Failed to update activity status.");
      }
    } catch(err) {
      console.error("Error updating activity:", err);
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropLeadName || !newPropNo || !newPropAmount || !orgId) return;
    try {
      const res = await fetch("http://localhost:8081/api/sales-executive/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          leadName: newPropLeadName,
          proposalNo: newPropNo,
          amount: newPropAmount,
          sentOn: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          status: "Under Review",
          organizationId: parseInt(orgId)
        })
      });
      if (res.ok) {
        setNewPropLeadName("");
        setNewPropNo("");
        setNewPropAmount("");
        setShowAddPropModal(false);
        loadData();
      } else {
        alert("Failed to create proposal.");
      }
    } catch (err) {
      console.error("Error creating proposal:", err);
    }
  };

  const handleUpdateProposalStatus = async (proposal: any, newStatus: string) => {
    try {
      const res = await fetch("http://localhost:8081/api/sales-executive/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: proposal.id,
          leadName: proposal.leadName,
          proposalNo: proposal.proposalNo,
          amount: proposal.amount,
          sentOn: proposal.sentOn,
          status: newStatus,
          organizationId: parseInt(orgId || "4")
        })
      });
      if (res.ok) {
        loadData();
      } else {
        alert("Failed to update proposal status.");
      }
    } catch (err) {
      console.error("Error updating proposal status:", err);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const activeChat = chats.find(c => c.id === activeChatId);
    if (!activeChat) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "executive",
      text: chatInput,
      time: "11:33 AM"
    };

    setChats(chats.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
          latest: chatInput,
          time: "11:33 AM"
        };
      }
      return c;
    }));
    setChatInput("");

    setTimeout(() => {
      const clientMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "client",
        text: "Thank you. Let me check and confirm.",
        time: "11:35 AM"
      };
      setChats(prevChats => prevChats.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, clientMsg],
            latest: "Thank you. Let me check and confirm.",
            time: "11:35 AM"
          };
        }
        return c;
      }));
    }, 1000);
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/sales-executive/leads/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      } else {
        alert("Failed to delete lead.");
      }
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    try {
      const res = await fetch(`http://localhost:8081/api/sales-executive/settings/user/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: profile.email,
          phone: profile.phone,
          smsNotifications: profile.smsNotifications,
          emailNotifications: profile.emailNotifications,
          whatsappAlerts: profile.whatsappAlerts
        })
      });
      if (res.ok) {
        alert("Profile settings updated successfully!");
        loadData();
      } else {
        alert("Failed to update profile settings.");
      }
    } catch(err) {
      console.error("Error updating profile settings:", err);
    }
  };

  const pipelineStages = React.useMemo(() => {
    const newLeadsCount = filteredLeads.length;
    const qualifiedCount = filteredLeads.filter(l => (l as any).qualifiedStatus && (l as any).qualifiedStatus !== "N/A").length;
    const siteVisitsCount = filteredActivities.filter(a => a.activity === "Site Visit" || a.type === "Visit").length;
    const proposalsCount = filteredProposals.length;
    const negotiationCount = filteredProposals.filter(p => p.status === "Negotiation").length;
    const wonCount = filteredProposals.filter(p => p.status === "Approved").length;

    return [
      { stage: "New Lead", count: `${newLeadsCount} Leads`, bg: "bg-blue-600" },
      { stage: "Qualified", count: `${qualifiedCount} Leads`, bg: "bg-indigo-600" },
      { stage: "Site Visit", count: `${siteVisitsCount} Visits`, bg: "bg-purple-600" },
      { stage: "Proposal Sent", count: `${proposalsCount} Proposals`, bg: "bg-violet-600" },
      { stage: "Negotiation", count: `${negotiationCount} Negotiating`, bg: "bg-amber-600" },
      { stage: "Won", count: `${wonCount} Won`, bg: "bg-emerald-600" }
    ];
  }, [filteredLeads, filteredActivities, filteredProposals]);

  const formattedPipelineValue = React.useMemo(() => {
    const val = dynamicPipelineValue || (projectFilter === "All Projects" ? summaryStats.pipelineValue : 0);
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    }
    return `₹${val}`;
  }, [dynamicPipelineValue, summaryStats.pipelineValue, projectFilter]);

  const formattedExpectedClose = React.useMemo(() => {
    const val = dynamicExpectedClose || (projectFilter === "All Projects" ? (summaryStats.pipelineValue * (parseFloat(summaryStats.conversionRate.replace("%", "")) || 0) / 100) : 0);
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    }
    return `₹${val.toFixed(0)}`;
  }, [dynamicExpectedClose, summaryStats.pipelineValue, summaryStats.conversionRate, projectFilter]);

  const conversionFunnel = React.useMemo(() => {
    const newLeads = filteredLeads.length;
    const qualified = filteredLeads.filter(l => (l as any).qualifiedStatus && (l as any).qualifiedStatus !== "N/A").length;
    const siteVisits = filteredActivities.filter(a => a.activity === "Site Visit" || a.type === "Visit").length;
    const props = filteredProposals.length;
    const won = filteredProposals.filter(p => p.status === "Approved").length;

    const getPct = (count: number) => {
      if (newLeads === 0) return "0.0%";
      return `${((count * 100) / newLeads).toFixed(1)}%`;
    };

    return [
      { label: "New Leads", count: newLeads, pct: "100%", width: "w-full", color: "text-white bg-blue-600/20 border-blue-500/30" },
      { label: "Qualified", count: qualified, pct: getPct(qualified), width: "w-[85%]", color: "text-indigo-300 bg-indigo-600/20 border-indigo-500/30" },
      { label: "Site Visit", count: siteVisits, pct: getPct(siteVisits), width: "w-[70%]", color: "text-purple-300 bg-purple-600/20 border-purple-500/30" },
      { label: "Proposal", count: props, pct: getPct(props), width: "w-[55%]", color: "text-violet-300 bg-violet-600/20 border-violet-500/30" },
      { label: "Won", count: won, pct: getPct(won), width: "w-[40%]", color: "text-emerald-300 bg-emerald-600/20 border-emerald-500/30" }
    ];
  }, [filteredLeads, filteredActivities, filteredProposals]);

  const channelShare = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    filteredLeads.forEach(l => {
      const src = l.source || "Other";
      counts[src] = (counts[src] || 0) + 1;
    });

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4", "#8B5CF6", "#64748B"];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length]
    }));
  }, [filteredLeads]);

  const activityStats = React.useMemo(() => {
    const calls = filteredActivities.filter(a => a.type === "Call" || a.activity.toLowerCase().includes("call")).length;
    const meetings = filteredActivities.filter(a => a.type === "Meeting" || a.activity.toLowerCase().includes("meet")).length;
    const visits = filteredActivities.filter(a => a.type === "Visit" || a.activity.toLowerCase().includes("visit")).length;
    const props = filteredProposals.length;
    const followUps = filteredActivities.filter(a => a.status === "Pending").length;

    return [
      { label: "Calls Made", val: String(calls) },
      { label: "Meetings", val: String(meetings) },
      { label: "Site Visits", val: String(visits) },
      { label: "Proposals Sent", val: String(props) },
      { label: "Follow-ups", val: String(followUps) }
    ];
  }, [filteredActivities, filteredProposals]);

  const currentChat = chats.find(c => c.id === activeChatId);

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

          {/* Navigation items */}
          <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-270px)]">
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
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{profile.name || username || "Arjun Kumar"}</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Sales Executive</div>
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
              {activeTab.toUpperCase()} <span className="text-[10px] text-blue-400 font-normal normal-case">/ Sales Executive Dashboard</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Welcome, {profile.name || username || "Arjun"}! Track active leads, close estimations, and optimize target conversions.</p>
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
                {projects.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span>{dateFilter}</span>
            </div>

            <button className="relative p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-350 hover:text-white transition-colors">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            </button>
          </div>
        </header>

        {/* CONTENTS SECTION */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-xs text-slate-400">Syncing sales workspace data...</span>
            </div>
          )}
          
          {!loading && errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-xs">
              ⚠️ {errorMsg}
            </div>
          )}

          {!loading && !errorMsg && (
            <>
              {/* 01. DASHBOARD OVERVIEW */}
              {activeTab === "Dashboard Overview" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-4 gap-4 text-xs">
                    {[
                      { label: "Total Leads", val: String(dynamicTotalLeads), sub: "Month to date" },
                      { label: "Won Deals", val: String(dynamicWonDeals), sub: "This month closed" },
                      { label: "Revenue Achieved", val: summaryStats.revenueAchieved, sub: "Against target" },
                      { label: "Conversion Rate", val: dynamicDisplayConversionRate, sub: "Leads to sales" }
                    ].map((s, idx) => (
                      <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">{s.label}</span>
                        <div className="text-xl font-bold mt-2 font-mono text-white">{s.val}</div>
                        <span className="text-[9px] text-slate-500 mt-1">{s.sub}</span>
                      </div>
                    ))}
                  </div>
 
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Leads status progress */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Leads Overview</h3>
                      <div className="h-44 relative flex justify-center items-center">
                        {dynamicTotalLeads > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={[
                                { name: "Hot", value: dynamicHotCount, color: "#EF4444" },
                                { name: "Warm", value: dynamicWarmCount, color: "#F59E0B" },
                                { name: "Cold", value: dynamicColdCount, color: "#3B82F6" }
                              ]} dataKey="value" innerRadius={28} outerRadius={46}>
                                <Cell fill="#EF4444" />
                                <Cell fill="#F59E0B" />
                                <Cell fill="#3B82F6" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-[10px] text-slate-500 text-center">No active leads</div>
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-bold text-white font-mono">{dynamicTotalLeads}</span>
                          <span className="text-[8px] text-slate-400 uppercase">Leads</span>
                        </div>
                      </div>
                    </div>
 
                    {/* Follow up schedules */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-3">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Upcoming Follow-ups</h3>
                      {activities.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex justify-between items-center text-xs p-3 bg-[#0e1628] border border-slate-850 rounded-xl">
                          <div>
                            <div className="font-bold text-white">{f.leadName}</div>
                            <div className="text-[9px] text-slate-450 mt-0.5">{f.time}</div>
                          </div>
                          <span className="text-[10px] text-blue-400 font-bold border border-blue-500/20 px-2 py-0.5 rounded bg-blue-500/5">{f.type || f.activity}</span>
                        </div>
                      ))}
                      {activities.length === 0 && (
                        <div className="text-xs text-slate-400 py-6 text-center">No upcoming follow-ups scheduled.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
 
              {/* 02. MY LEADS */}
              {activeTab === "My Leads" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">My Leads Listing</h3>
                      <p className="text-[10px] text-slate-400">Total Month Leads: {leads.length}</p>
                    </div>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-1.5 px-3 rounded-lg text-xs hover:from-blue-500 hover:to-indigo-500 transition shadow-md shadow-blue-500/15"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Lead</span>
                    </button>
                  </div>
 
                  {/* Lead Table */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                          <th className="p-4">Lead Name</th>
                          <th className="p-4">Source</th>
                          <th className="p-4">Project Type</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Budget</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {filteredLeads.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-800/10 transition">
                            <td className="p-4 font-bold text-white">{l.name}</td>
                            <td className="p-4 text-slate-350">{l.source}</td>
                            <td className="p-4 text-slate-350">{l.projectType}</td>
                            <td className="p-4 text-slate-400">{l.location}</td>
                            <td className="p-4 font-mono font-bold text-white">{l.budget}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                                l.status === "Hot" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                l.status === "Warm" ? "bg-amber-500/10 text-amber-450 text-amber-400" :
                                "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}>{l.status}</span>
                            </td>
                            <td className="p-4 text-center">
                              <button onClick={() => handleDeleteLead(l.id)} className="text-red-400 hover:text-red-300 p-1">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredLeads.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400">
                              No leads matching filters or registered.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Lead Modal */}
                  {showAddModal && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                      <div className="bg-[#111C30] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
                          Add New Sales Lead
                        </h3>
                        <form onSubmit={handleAddNewLead} className="space-y-4 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Lead Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Mr. Ramesh"
                              value={newLeadName}
                              onChange={(e) => setNewLeadName(e.target.value)}
                              className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
 
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Source</label>
                              <select
                                value={newLeadSource}
                                onChange={(e) => setNewLeadSource(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="Manual">Manual</option>
                                <option value="Google Ads">Google Ads</option>
                                <option value="Meta Ads">Meta Ads</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Facebook Ads">Facebook Ads</option>
                                <option value="Website">Website</option>
                                <option value="Referral">Referral</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Project Type</label>
                              <select
                                value={newLeadProj}
                                onChange={(e) => setNewLeadProj(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="Villa">Villa</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Commercial">Commercial</option>
                              </select>
                            </div>
                          </div>
 
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Location</label>
                              <input
                                type="text"
                                placeholder="e.g. Chennai"
                                value={newLeadLocation}
                                onChange={(e) => setNewLeadLocation(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Budget</label>
                              <input
                                type="text"
                                placeholder="e.g. ₹60 L or ₹2 Cr"
                                value={newLeadBudget}
                                onChange={(e) => setNewLeadBudget(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
 
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Lead Status</label>
                            <select
                              value={newLeadStatus}
                              onChange={(e) => setNewLeadStatus(e.target.value as any)}
                              className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Hot">Hot</option>
                              <option value="Warm">Warm</option>
                              <option value="Cold">Cold</option>
                            </select>
                          </div>
 
                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowAddModal(false)}
                              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-550 text-white font-semibold transition shadow-md shadow-blue-500/15"
                            >
                              Create Lead
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
 
              {/* 03. LEAD QUALIFICATION */}
              {activeTab === "Lead Qualification" && (
                <div className="space-y-6 animate-fadeIn text-xs">
                  {/* Lead Selector Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Lead Selection</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Select a lead to perform detail-level budget, timeline, and requirement qualification.</p>
                    </div>
                    {leads.length > 0 ? (
                      <select
                        className="bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer w-full sm:w-64"
                        value={selectedQualifyLeadId}
                        onChange={(e) => setSelectedQualifyLeadId(e.target.value)}
                      >
                        {leads.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} ({l.status})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg font-semibold">No active leads found</span>
                    )}
                  </div>

                  {selectedQualifyLead ? (
                    <form onSubmit={handleQualifyLead} className="grid lg:grid-cols-2 gap-6">
                      {/* Left: Lead Details & Requirements */}
                      <div className="space-y-6">
                        {/* Lead Info Card */}
                        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">Lead Demographics</h4>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <label className="text-[10px] text-slate-400">Lead Name</label>
                              <div className="font-bold text-white mt-1">{selectedQualifyLead.name}</div>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Source</label>
                              <div className="font-bold text-[#3B82F6] mt-1">{selectedQualifyLead.source}</div>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Location</label>
                              <div className="font-bold text-white mt-1">{selectedQualifyLead.location}</div>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Budget Estimate</label>
                              <div className="font-bold text-emerald-400 mt-1 font-mono">{selectedQualifyLead.budget}</div>
                            </div>
                          </div>
                        </div>

                        {/* Requirements Card */}
                        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">Technical Scope & Fit</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Expected Timeline</label>
                              <select
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyTimeline}
                                onChange={(e) => setQualifyTimeline(e.target.value)}
                              >
                                <option value="Immediate">Immediate (1 Month)</option>
                                <option value="Within 3 Months">Within 3 Months</option>
                                <option value="Within 6 Months">Within 6 Months</option>
                                <option value="6-12 Months">6-12 Months</option>
                                <option value="Over 12 Months">Over 12 Months</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Plot Size (Sq.Ft)</label>
                              <input
                                type="text"
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyPlotSize}
                                onChange={(e) => setQualifyPlotSize(e.target.value)}
                                placeholder="e.g. 2400 Sq.Ft"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Proposed Floors</label>
                              <input
                                type="text"
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyFloors}
                                onChange={(e) => setQualifyFloors(e.target.value)}
                                placeholder="e.g. G+1 or G+2"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Requirement Clarity</label>
                              <select
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyRequirementClarity}
                                onChange={(e) => setQualifyRequirementClarity(e.target.value)}
                              >
                                <option value="High">High Clarity</option>
                                <option value="Medium">Medium Clarity</option>
                                <option value="Low">Low / Unclear</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Requirements Description</label>
                            <textarea
                              className="w-full h-24 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                              value={qualifyRequirements}
                              onChange={(e) => setQualifyRequirements(e.target.value)}
                              placeholder="Describe structural layout, rooms configuration, architectural style..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Qualification Parameters & Status */}
                      <div className="space-y-6">
                        {/* Qualification Parameters Card */}
                        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">Qualification Matrix</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Budget Fit</label>
                              <select
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyBudgetFit}
                                onChange={(e) => setQualifyBudgetFit(e.target.value)}
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Timeline Fit</label>
                              <select
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyTimelineFit}
                                onChange={(e) => setQualifyTimelineFit(e.target.value)}
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Decision Maker</label>
                              <input
                                type="text"
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyDecisionMaker}
                                onChange={(e) => setQualifyDecisionMaker(e.target.value)}
                                placeholder="Primary stakeholder"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Competition / Other Builders</label>
                              <input
                                type="text"
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyCompetition}
                                onChange={(e) => setQualifyCompetition(e.target.value)}
                                placeholder="e.g. Apex Builders / None"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Lead Score (1-5)</label>
                              <select
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyLeadScore}
                                onChange={(e) => setQualifyLeadScore(parseInt(e.target.value))}
                              >
                                <option value={1}>1 - Low Interest</option>
                                <option value={2}>2 - Cold / Vague</option>
                                <option value={3}>3 - Warm / Interested</option>
                                <option value={4}>4 - Hot / High Intent</option>
                                <option value={5}>5 - Immediate Deal Close</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Qualified Lead Status</label>
                              <select
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                value={qualifyStatus}
                                onChange={(e) => setQualifyStatus(e.target.value)}
                              >
                                <option value="Cold Lead">Cold Lead</option>
                                <option value="Warm Lead">Warm Lead</option>
                                <option value="Hot Lead">Hot Lead</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Not Qualified">Not Qualified</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Remarks Card */}
                        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">Verification Remarks</h4>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Executive Notes & Observations</label>
                            <textarea
                              className="w-full h-20 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                              value={qualifyRemarks}
                              onChange={(e) => setQualifyRemarks(e.target.value)}
                              placeholder="Any specific negotiation notes, discount request details, reference schemes..."
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/10 active:scale-[0.98] uppercase tracking-wider"
                          >
                            Save Lead Qualification
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                      No active leads registered in this organization. Register a lead in the "My Leads" tab to perform qualification.
                    </div>
                  )}
                </div>
              )}
 
              {/* 04. FOLLOW-UP CENTER */}
              {activeTab === "Follow-up Center" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top Stats Row */}
                  <div className="grid grid-cols-5 gap-4 text-center text-xs">
                    {[
                      { label: "Pending Follow-ups", val: String(activities.filter(a => a.status === "Pending").length), color: "text-amber-450 text-amber-400" },
                      { label: "Completed Activities", val: String(activities.filter(a => a.status === "Completed").length), color: "text-emerald-400" },
                      { label: "Negotiations", val: String(proposals.filter(p => p.status === "Negotiation").length), color: "text-blue-400" },
                      { label: "Approved Contracts", val: String(proposals.filter(p => p.status === "Approved").length), color: "text-[#10B981]" },
                      { label: "Rejected/Lost", val: String(proposals.filter(p => p.status === "Rejected").length), color: "text-red-400" }
                    ].map((s, idx) => (
                      <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                        <div className={`text-xl font-bold mt-1 font-mono ${s.color}`}>{s.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Header Actions Row */}
                  <div className="flex justify-between items-center bg-[#111C30] border border-slate-800 rounded-xl p-4 text-xs">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Scheduled Follow-up Tasks</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Log site visits, calls, emails, or technical proposals in the active queue.</p>
                    </div>
                    <button
                      onClick={() => setShowAddActModal(true)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-semibold py-1.5 px-3 rounded-lg text-xs hover:brightness-110 transition shadow-md shadow-blue-500/15"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Schedule Follow-up</span>
                    </button>
                  </div>

                  {/* Activities Table */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                          <th className="p-4">Lead Name</th>
                          <th className="p-4">Activity Description</th>
                          <th className="p-4">Channel / Type</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Time</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {activities.map((a) => (
                          <tr key={a.id} className="hover:bg-slate-800/10 transition">
                            <td className="p-4 font-bold text-white">{a.leadName}</td>
                            <td className="p-4 text-slate-350">{a.activity}</td>
                            <td className="p-4">
                              <span className="text-[10px] text-blue-400 font-bold border border-blue-500/20 px-2 py-0.5 rounded bg-blue-500/5">
                                {a.type}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-slate-400">{a.date || "N/A"}</td>
                            <td className="p-4 font-mono text-slate-400">{a.time}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                                a.status === "Completed" ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-emerald-455 text-emerald-400" :
                                "bg-amber-500/10 text-amber-450 border border-amber-500/20 text-amber-400"
                              }`}>{a.status}</span>
                            </td>
                            <td className="p-4 text-center">
                              {a.status === "Pending" ? (
                                <button
                                  onClick={() => handleCompleteActivity(a)}
                                  className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/5 hover:bg-emerald-500/10 transition font-semibold"
                                >
                                  Complete
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-medium">✓ Closed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {activities.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400">
                              No scheduled activities or follow-up logs.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Activity Modal */}
                  {showAddActModal && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                      <div className="bg-[#111C30] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-xs">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
                          Schedule Follow-up Activity
                        </h3>
                        <form onSubmit={handleCreateActivity} className="space-y-4">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Select Lead</label>
                            {leads.length > 0 ? (
                              <select
                                required
                                value={newActLeadName}
                                onChange={(e) => setNewActLeadName(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                <option value="">-- Choose Lead --</option>
                                {leads.map((l) => (
                                  <option key={l.id} value={l.name}>{l.name}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                required
                                placeholder="Enter Lead Name manually"
                                value={newActLeadName}
                                onChange={(e) => setNewActLeadName(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            )}
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Activity / Task Details</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Discuss revised villa blueprint floor plan"
                              value={newActActivity}
                              onChange={(e) => setNewActActivity(e.target.value)}
                              className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Follow-up Type</label>
                              <select
                                value={newActType}
                                onChange={(e) => setNewActType(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                <option value="Call">Phone Call</option>
                                <option value="Visit">Site Visit</option>
                                <option value="Meeting">Meeting</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Proposal">Send Proposal</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Schedule Time</label>
                              <input
                                type="text"
                                placeholder="e.g. 10:30 AM or 4:00 PM"
                                value={newActTime}
                                onChange={(e) => setNewActTime(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Schedule Date</label>
                            <input
                              type="date"
                              value={newActDate}
                              onChange={(e) => setNewActDate(e.target.value)}
                              className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowAddActModal(false)}
                              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-550 text-white font-semibold transition shadow-md shadow-blue-500/15"
                            >
                              Schedule Task
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
 
              {/* 05. PROPOSAL TRACKER */}
              {activeTab === "Proposal Tracker" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Header Actions Row */}
                  <div className="flex justify-between items-center bg-[#111C30] border border-slate-800 rounded-xl p-4 text-xs">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Commercial Proposals</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Track submitted offers, review negotiation statuses, and record finalized contract approvals.</p>
                    </div>
                    <button
                      onClick={() => setShowAddPropModal(true)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-semibold py-1.5 px-3 rounded-lg text-xs hover:brightness-110 transition shadow-md shadow-blue-500/15"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create Proposal</span>
                    </button>
                  </div>

                  {/* Proposals Table */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                          <th className="p-4">Lead Name</th>
                          <th className="p-4">Proposal No.</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Sent On</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Status Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {proposals.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-800/10 transition">
                            <td className="p-4 font-bold text-white">{p.leadName}</td>
                            <td className="p-4 text-slate-350">{p.proposalNo}</td>
                            <td className="p-4 font-mono font-bold text-white">{p.amount}</td>
                            <td className="p-4 font-mono text-slate-450 text-slate-400">{p.sentOn}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                                p.status === "Approved" ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-emerald-400" :
                                p.status === "Negotiation" ? "bg-amber-500/10 text-amber-450 border border-amber-500/20 text-amber-400" :
                                p.status === "Rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}>{p.status}</span>
                            </td>
                            <td className="p-4 text-center space-x-1.5">
                              {p.status !== "Approved" && p.status !== "Rejected" ? (
                                <>
                                  <button
                                    onClick={() => handleUpdateProposalStatus(p, "Negotiation")}
                                    className="text-[10px] text-amber-400 hover:bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded bg-amber-500/5 transition font-semibold"
                                  >
                                    Negotiate
                                  </button>
                                  <button
                                    onClick={() => handleUpdateProposalStatus(p, "Approved")}
                                    className="text-[10px] text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/5 transition font-semibold"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleUpdateProposalStatus(p, "Rejected")}
                                    className="text-[10px] text-red-400 hover:bg-red-500/15 border border-red-500/30 px-1.5 py-0.5 rounded bg-red-500/5 transition font-semibold"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-medium">✓ Closed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {proposals.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">
                              No active proposals sent.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Proposal Modal */}
                  {showAddPropModal && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                      <div className="bg-[#111C30] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-xs">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
                          Create Commercial Proposal
                        </h3>
                        <form onSubmit={handleCreateProposal} className="space-y-4">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Select Lead Name</label>
                            {leads.length > 0 ? (
                              <select
                                required
                                value={newPropLeadName}
                                onChange={(e) => setNewPropLeadName(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                <option value="">-- Choose Lead --</option>
                                {leads.map((l) => (
                                  <option key={l.id} value={l.name}>{l.name}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                required
                                placeholder="Enter Lead Name manually"
                                value={newPropLeadName}
                                onChange={(e) => setNewPropLeadName(e.target.value)}
                                className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            )}
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Proposal Number</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Prop-2026-001"
                              value={newPropNo}
                              onChange={(e) => setNewPropNo(e.target.value)}
                              className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Estimated Contract Amount</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. ₹75 L or ₹2.5 Cr"
                              value={newPropAmount}
                              onChange={(e) => setNewPropAmount(e.target.value)}
                              className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowAddPropModal(false)}
                              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-550 text-white font-semibold transition shadow-md shadow-blue-500/15"
                            >
                              Create Proposal
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
 
              {/* 06. CLIENT COMMUNICATION */}
              {activeTab === "Client Communication" && (
                <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
                  {/* Chats List */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Recent Conversations</h3>
                    {chats.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveChatId(c.id)}
                        className={`w-full text-left p-3 rounded-xl border transition flex justify-between items-start ${
                          c.id === activeChatId ? "bg-blue-600/10 border-blue-500/40" : "bg-[#0e1628] border-slate-850"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white text-xs">{c.name}</div>
                          <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[140px]">{c.latest}</div>
                        </div>
                        <span className="text-[9px] text-slate-500">{c.time}</span>
                      </button>
                    ))}
                    {chats.length === 0 && (
                      <div className="text-xs text-slate-400 py-6 text-center">No active chats.</div>
                    )}
                  </div>
 
                  {/* Chat View */}
                  <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                      {currentChat?.messages?.map((m) => (
                        <div key={m.id} className={`flex ${m.sender === "executive" ? "justify-end" : "justify-start"}`}>
                          <div className={`p-3 rounded-xl max-w-xs text-xs ${
                            m.sender === "executive" ? "bg-blue-600 text-white" : "bg-[#0e1628] text-slate-200 border border-slate-850"
                          }`}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      {(!currentChat || !currentChat.messages || currentChat.messages.length === 0) && (
                        <div className="text-xs text-slate-400 py-12 text-center h-full flex items-center justify-center">
                          Select a conversation or type a message to begin.
                        </div>
                      )}
                    </div>
                    {/* Input box */}
                    <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                      <input
                        type="text"
                        placeholder="Type message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-550 text-white p-2.5 rounded-lg transition">
                        <SendHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
 
              {/* 07. SALES PIPELINE */}
              {activeTab === "Sales Pipeline" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Funnel Pipeline value row */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Pipeline Value</span>
                      <div className="text-xl font-bold mt-1 font-mono text-white">{formattedPipelineValue}</div>
                    </div>
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Expected Close</span>
                      <div className="text-xl font-bold mt-1 font-mono text-white">{formattedExpectedClose}</div>
                    </div>
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Conversion Rate</span>
                      <div className="text-xl font-bold mt-1 font-mono text-white">{summaryStats.conversionRate}</div>
                    </div>
                  </div>
 
                  {/* Horizontal Pipe funnel nodes */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Pipeline by Stage</h3>
                    <div className="grid grid-cols-6 gap-2 text-center text-xs">
                      {pipelineStages.map((x, idx) => (
                        <div key={idx} className={`${x.bg} text-white p-3 rounded-lg flex flex-col justify-between h-20`}>
                          <span className="font-bold text-[10px] uppercase">{x.stage}</span>
                          <span className="font-mono font-bold mt-2">{x.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
 
              {/* 08. REVENUE TRACKER */}
              {activeTab === "Revenue Tracker" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 col-span-1">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Revenue Overview</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between"><span>Monthly Target:</span> <span className="font-bold text-white font-mono">{summaryStats.monthlyTarget}</span></div>
                        <div className="flex justify-between"><span>Achieved Revenue:</span> <span className="text-emerald-400 font-bold font-mono">{summaryStats.revenueAchieved}</span></div>
                        <div className="flex justify-between"><span>Achievement Rate:</span> <span className="text-blue-400 font-bold font-mono">{summaryStats.achievementRate}</span></div>
                      </div>
                    </div>
 
                    <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Revenue Growth Trend</h3>
                      <div className="h-64">
                        {revenueChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueChartData}>
                              <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                              <YAxis stroke="#64748B" fontSize={10} />
                              <Tooltip />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              <Line type="monotone" name="Target" dataKey="Target" stroke="#64748B" strokeDasharray="3 3" />
                              <Line type="monotone" name="Achieved" dataKey="Achieved" stroke="#10B981" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-xs text-slate-400 text-center py-20">No revenue data logged.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
 
              {/* 09. CONVERSION TRACKER */}
              {activeTab === "Conversion Tracker" && (
                <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Conversion Funnel</h3>
                    <div className="space-y-3">
                      {conversionFunnel.map((item, idx) => (
                        <div key={idx} className={`${item.width} mx-auto bg-opacity-20 border p-2.5 rounded text-center text-xs font-bold font-mono ${item.color}`}>
                          {item.label}: {item.count} ({item.pct})
                        </div>
                      ))}
                    </div>
                  </div>
 
                  {/* Conversion by channels */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Conversion Share by Channel</h3>
                    <div className="h-64 flex flex-col justify-center items-center">
                      <div className="h-44 w-44 relative">
                        {channelShare.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={channelShare} dataKey="value" innerRadius={28} outerRadius={46}>
                                {channelShare.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-xs text-slate-400 text-center">No channel share data available.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
 
              {/* 10. DAILY ACTIVITY */}
              {activeTab === "Daily Activity" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-5 gap-4 text-center">
                    {activityStats.map((s, idx) => (
                      <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                        <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                      </div>
                    ))}
                  </div>
 
                  {/* Logs Table */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                          <th className="p-3">Activity</th>
                          <th className="p-3">Lead Name</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Time</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {activities.map((a) => (
                          <tr key={a.id}>
                            <td className="p-3 font-semibold text-white">{a.activity}</td>
                            <td className="p-3 text-slate-350">{a.leadName}</td>
                            <td className="p-3 text-slate-400 font-mono">{a.type}</td>
                            <td className="p-3 text-slate-400 font-mono">{a.time}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                a.status === "Completed" ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-emerald-450 text-emerald-400" : "bg-slate-800 text-slate-400"
                              }`}>{a.status}</span>
                            </td>
                          </tr>
                        ))}
                        {activities.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                              No daily activities logged.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
 
              {/* 11. AI SALES ASSISTANT */}
              {activeTab === "AI Sales Assistant" && (
                <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
                  <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                    <div>
                      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs mb-4">
                        {["Smart Insights", "Lead Scoring", "Next Best Action", "Prediction"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setAiAssistantTab(tab as any)}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                              aiAssistantTab === tab ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
 
                      <div className="space-y-3">
                        {aiMessages.map((msg, idx) => (
                          <div key={idx} className="p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 text-xs text-slate-200">
                            💡 {msg}
                          </div>
                        ))}
                        {aiMessages.length === 0 && (
                          <div className="text-xs text-slate-400 text-center py-6">No insights available. Add leads to generate insights.</div>
                        )}
                      </div>
                    </div>
 
                    <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                      <input
                        type="text"
                        placeholder="Ask AI sales coordinator..."
                        value={aiChatInput}
                        onChange={(e) => setAiChatInput(e.target.value)}
                        className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          if (!aiChatInput.trim()) return;
                          setAiMessages([...aiMessages, aiChatInput]);
                          setAiChatInput("");
                        }}
                        className="bg-blue-600 hover:bg-blue-550 text-white p-2.5 rounded-lg transition"
                      >
                        <SendHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
 
                  {/* Recommended Actions */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Recommended Actions</h4>
                    <div className="space-y-3 text-xs">
                      {aiActions.map((act, i) => (
                        <div key={i} className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{act}</span>
                          <ChevronRight className="h-4 w-4 text-blue-400" />
                        </div>
                      ))}
                      {aiActions.length === 0 && (
                        <div className="text-xs text-slate-450 text-slate-400 py-6 text-center">No pending actions.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
 
              {/* 12. SETTINGS */}
              {activeTab === "Settings" && (
                <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
                  <form onSubmit={handleUpdateProfile} className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Profile Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                        <input
                          type="text"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Phone</label>
                        <input
                          type="text"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Role</label>
                        <input type="text" readOnly defaultValue="Sales Executive" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none bg-slate-900/10 cursor-not-allowed" />
                      </div>
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-550 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-md transition mt-4">Update Profile</button>
                  </form>
 
                  {/* Preferences */}
                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Preferences</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span>SMS Notifications</span>
                        <input
                          type="checkbox"
                          checked={profile.smsNotifications}
                          onChange={(e) => setProfile({ ...profile, smsNotifications: e.target.checked })}
                          className="h-4 w-4 text-blue-600"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Email Notifications</span>
                        <input
                          type="checkbox"
                          checked={profile.emailNotifications}
                          onChange={(e) => setProfile({ ...profile, emailNotifications: e.target.checked })}
                          className="h-4 w-4 text-blue-600"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>WhatsApp Alerts</span>
                        <input
                          type="checkbox"
                          checked={profile.whatsappAlerts}
                          onChange={(e) => setProfile({ ...profile, whatsappAlerts: e.target.checked })}
                          className="h-4 w-4 text-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
 
              {/* 13. CALENDAR VIEW */}
              {activeTab === "Calendar View" && (
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-6 animate-fadeIn">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">Sales Calendar Schedules</h3>
                  <div className="grid grid-cols-7 gap-3 min-h-[300px]">
                    {calendarDays.map((col: any, idx) => (
                      <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 min-h-[140px] flex flex-col justify-between hover:border-blue-500 transition">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">{col.date}</span>
                        <div className="space-y-2.5 mt-2 flex-1">
                          {col.events?.map((evt: any, i: number) => (
                            <div key={i} className="text-[8.5px] p-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-semibold truncate leading-tight">
                              <div>{evt.time}</div>
                              <div className="text-white mt-0.5">{evt.title} ({evt.leadName})</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {calendarDays.length === 0 && (
                      <div className="col-span-7 text-xs text-slate-400 py-12 text-center bg-[#0e1628] border border-slate-800 rounded-lg">
                        No scheduled activities or calendar events.
                      </div>
                    )}
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

// Chevron Right custom icon reference if not defined
function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-slate-450"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
