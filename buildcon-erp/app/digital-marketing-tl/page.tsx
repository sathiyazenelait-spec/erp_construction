"use client";
import React, { useState, useEffect } from "react";
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

// --- Types ---
interface Campaign {
  id: string;
  name: string;
  platform: string;
  leads: number;
  cost: number;
  roi: number;
  status: string;
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
  channel: string;
  status: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  quality: string;
  status: string;
  date: string;
}

interface Metric {
  id?: number;
  metricKey: string;
  metricValue: number;
  category: string;
  label: string;
}

export default function DigitalMarketingTLDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Executive Summary");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("01 May 2025 - 31 May 2025");
  const [projects, setProjects] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // --- Dynamic Config State ---
  const [organizationName, setOrganizationName] = useState("BuildWell");
  const [profileName, setProfileName] = useState("Priya Sharma");
  const [profileEmail, setProfileEmail] = useState("priya.sharma@buildcon.com");
  const [avatarInitials, setAvatarInitials] = useState("PS");
  const [sidebarMenus, setSidebarMenus] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Baselines configuration
  const [baselineLeads, setBaselineLeads] = useState(2084);
  const [baselineQualified, setBaselineQualified] = useState(424);
  const [baselineSpend, setBaselineSpend] = useState(547320);
  const [baselineCpl, setBaselineCpl] = useState(212);
  const [baselineRoi, setBaselineRoi] = useState(3.5);
  const [baselineCompareDate, setBaselineCompareDate] = useState("vs Apr 2025");

  // AI insights
  const [aiInsightRec, setAiInsightRec] = useState("Campaign conversion ROI increased. Shift ₹30k from brand awareness to Google Search Villa Campaign immediately.");
  const [aiInsightOpp, setAiInsightOpp] = useState("Villa Campaign is performing 27% better than other campaigns. Consider switching more budget.");
  const [aiInsightAlert, setAiInsightAlert] = useState("Increase budget for Google Ads - high ROI detected and search volumes are surging.");
  const [aiInsightDiag, setAiInsightDiag] = useState("Lead quality improved by 18% compared to last month. SEO push on Coimbatore Hub contributed 410 Leads.");

  // Calendar
  const [calendarHeader, setCalendarHeader] = useState("Content Calendar (May 2025)");
  const [calendarDateLabel, setCalendarDateLabel] = useState("Target Date (Day of May)");
  const [calendarEmptyCells, setCalendarEmptyCells] = useState(3);
  const [calendarTotalDays, setCalendarTotalDays] = useState(31);

  // SEO
  const [seoTrafficSub, setSeoTrafficSub] = useState("↑ 15.6% vs last month");
  const [seoKeywordsSub, setSeoKeywordsSub] = useState("↑ 12.3% active keywords");
  const [seoTop10Sub, setSeoTop10Sub] = useState("↑ 8.7% index movement");
  const [seoAuthoritySub, setSeoAuthoritySub] = useState("Stable domain weight");

  // Competitor Mapping
  const [competitorMapping, setCompetitorMapping] = useState("luxury flats in chennai:Competitor A|builders in coimbatore:Competitor B");

  // Alert Limits and Settings
  const [alertThreshold, setAlertThreshold] = useState(450);
  const [notificationEmails, setNotificationEmails] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [leadScoringMin, setLeadScoringMin] = useState(65);

  // Settings form states
  const [formProfileName, setFormProfileName] = useState("Priya Sharma");
  const [formProfileEmail, setFormProfileEmail] = useState("priya.sharma@buildcon.com");
  const [formAvatarInitials, setFormAvatarInitials] = useState("PS");
  const [formSidebarMenus, setFormSidebarMenus] = useState("");
  const [formAiSuggestions, setFormAiSuggestions] = useState("");
  const [formHeaderDate, setFormHeaderDate] = useState("01 May 2025 - 31 May 2025");

  // Extended Settings form states
  const [formBaselineLeads, setFormBaselineLeads] = useState("2084");
  const [formBaselineQualified, setFormBaselineQualified] = useState("424");
  const [formBaselineSpend, setFormBaselineSpend] = useState("547320");
  const [formBaselineCpl, setFormBaselineCpl] = useState("212");
  const [formBaselineRoi, setFormBaselineRoi] = useState("3.5");
  const [formBaselineCompareDate, setFormBaselineCompareDate] = useState("vs Apr 2025");

  const [formAiInsightRec, setFormAiInsightRec] = useState("");
  const [formAiInsightOpp, setFormAiInsightOpp] = useState("");
  const [formAiInsightAlert, setFormAiInsightAlert] = useState("");
  const [formAiInsightDiag, setFormAiInsightDiag] = useState("");

  const [formCalendarHeader, setFormCalendarHeader] = useState("");
  const [formCalendarDateLabel, setFormCalendarDateLabel] = useState("");
  const [formCalendarEmptyCells, setFormCalendarEmptyCells] = useState("3");
  const [formCalendarTotalDays, setFormCalendarTotalDays] = useState("31");

  const [formSeoTrafficSub, setFormSeoTrafficSub] = useState("");
  const [formSeoKeywordsSub, setFormSeoKeywordsSub] = useState("");
  const [formSeoTop10Sub, setFormSeoTop10Sub] = useState("");
  const [formSeoAuthoritySub, setFormSeoAuthoritySub] = useState("");

  const [formCompetitorMapping, setFormCompetitorMapping] = useState("");

  const [formAlertThreshold, setFormAlertThreshold] = useState("450");
  const [formNotificationEmails, setFormNotificationEmails] = useState(true);
  const [formWeeklyReports, setFormWeeklyReports] = useState(true);
  const [formLeadScoringMin, setFormLeadScoringMin] = useState("65");

  // --- Social Media Metrics Form States ---
  const [formIgFollowers, setFormIgFollowers] = useState("28000");
  const [formIgGrowth, setFormIgGrowth] = useState("12");
  const [formIgEng, setFormIgEng] = useState("6.8");
  const [formFbFollowers, setFormFbFollowers] = useState("18000");
  const [formFbGrowth, setFormFbGrowth] = useState("8");
  const [formFbEng, setFormFbEng] = useState("5.4");
  const [formLiFollowers, setFormLiFollowers] = useState("12000");
  const [formLiGrowth, setFormLiGrowth] = useState("15");
  const [formLiEng, setFormLiEng] = useState("4.8");
  const [formYtFollowers, setFormYtFollowers] = useState("5200");
  const [formYtGrowth, setFormYtGrowth] = useState("10");
  const [formYtEng, setFormYtEng] = useState("7.2");

  // --- Competitors & Budget Limit Form States ---
  const [formCompATraffic, setFormCompATraffic] = useState("18400");
  const [formCompBTraffic, setFormCompBTraffic] = useState("15300");
  const [formCompCTraffic, setFormCompCTraffic] = useState("9800");
  const [formBudgetLimit, setFormBudgetLimit] = useState("700000");

  // --- Add New Item Form States ---
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamRole, setNewTeamRole] = useState("Executive");
  const [newTeamTasks, setNewTeamTasks] = useState("0");
  const [newTeamCompleted, setNewTeamCompleted] = useState("0");
  const [newTeamLeads, setNewTeamLeads] = useState("0");
  const [newTeamAvatar, setNewTeamAvatar] = useState("");

  const [newSeoKw, setNewSeoKw] = useState("");
  const [newSeoPos, setNewSeoPos] = useState("1");
  const [newSeoVol, setNewSeoVol] = useState("1000");
  const [newSeoDir, setNewSeoDir] = useState("0");

  const [newGapKw, setNewGapKw] = useState("");
  const [newGapOur, setNewGapOur] = useState("5");
  const [newGapTheir, setNewGapTheir] = useState("1");
  const [newGapPriority, setNewGapPriority] = useState("0");

  const [newBudgetCat, setNewBudgetCat] = useState("");
  const [newBudgetVal, setNewBudgetVal] = useState("50000");

  const [newTrendLabel, setNewTrendLabel] = useState("");
  const [newTrendLeads, setNewTrendLeads] = useState("100");
  const [newTrendQualified, setNewTrendQualified] = useState("20");

  // --- Stateful Data ---
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [trends, setTrends] = useState<any[]>([]);

  // --- Form States ---
  const [newCampaign, setNewCampaign] = useState({ name: "", platform: "Google Ads", leads: 50, cost: 20000, roi: 3.0, status: "Good" });
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", source: "Google Ads", quality: "High", status: "New" });
  const [newEvent, setNewEvent] = useState({ title: "", date: 15, channel: "Instagram", status: "Draft" });
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Priya! I'm your AI Marketing Assistant. I can help analyze your campaigns, budget shifts, and optimize leads. Ask me anything!" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSyncChannels = async () => {
    if (!orgId) return;
    try {
      setSyncing(true);
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/digital-marketing-tl/sync-external", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ organizationId: orgId })
      });
      if (res.ok) {
        alert("Synced Google Ads, Meta Ads, GA4, GBP & SEO search keyword metrics successfully!");
        await loadData();
      } else {
        alert("Failed to sync external channels.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };


  async function loadData() {
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

      const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
        setTeamMembers(data.teamMembers || []);
        setCalendarEvents(data.calendarEvents || []);
        setLeads(data.leads || []);
        setMetrics(data.metrics || []);
        setTrends(data.trends || []);

        setOrganizationName(data.organizationName || "BuildWell");
        const resolvedName = data.profileName || "Priya Sharma";
        setProfileName(resolvedName);
        setProfileEmail(data.profileEmail || "priya.sharma@buildcon.com");
        setAvatarInitials(data.avatarInitials || "PS");
        setDateFilter(data.header_date || "01 May 2025 - 31 May 2025");

        setFormProfileName(resolvedName);
        setFormProfileEmail(data.profileEmail || "priya.sharma@buildcon.com");
        setFormAvatarInitials(data.avatarInitials || "PS");
        setFormHeaderDate(data.header_date || "01 May 2025 - 31 May 2025");

        setChatMessages([
          { sender: "bot", text: `Hello ${resolvedName}! I'm your AI Marketing Assistant. I can help analyze your campaigns, budget shifts, and optimize leads. Ask me anything!` }
        ]);

        if (data.sidebar_menus) {
          setSidebarMenus(data.sidebar_menus.split("|"));
          setFormSidebarMenus(data.sidebar_menus);
        }
        if (data.ai_suggestions) {
          setAiSuggestions(data.ai_suggestions.split("|"));
          setFormAiSuggestions(data.ai_suggestions);
        }

        // Baselines config mapping
        setBaselineLeads(Number(data.baselines_leads || 2084));
        setBaselineQualified(Number(data.baselines_qualified || 424));
        setBaselineSpend(Number(data.baselines_spend || 547320));
        setBaselineCpl(Number(data.baselines_cpl || 212));
        setBaselineRoi(Number(data.baselines_roi || 3.5));
        setBaselineCompareDate(data.baselines_compare_date || "vs Apr 2025");

        setFormBaselineLeads(data.baselines_leads || "2084");
        setFormBaselineQualified(data.baselines_qualified || "424");
        setFormBaselineSpend(data.baselines_spend || "547320");
        setFormBaselineCpl(data.baselines_cpl || "212");
        setFormBaselineRoi(data.baselines_roi || "3.5");
        setFormBaselineCompareDate(data.baselines_compare_date || "vs Apr 2025");

        // AI insights mapping
        setAiInsightRec(data.ai_insight_recommendation || "Campaign conversion ROI increased. Shift ₹30k from brand awareness to Google Search Villa Campaign immediately.");
        setAiInsightOpp(data.ai_insight_opportunity || "Villa Campaign is performing 27% better than other campaigns. Consider switching more budget.");
        setAiInsightAlert(data.ai_insight_critical_alert || "Increase budget for Google Ads - high ROI detected and search volumes are surging.");
        setAiInsightDiag(data.ai_insight_weekly_diagnosis || "Lead quality improved by 18% compared to last month. SEO push on Coimbatore Hub contributed 410 Leads.");

        setFormAiInsightRec(data.ai_insight_recommendation || "Campaign conversion ROI increased. Shift ₹30k from brand awareness to Google Search Villa Campaign immediately.");
        setFormAiInsightOpp(data.ai_insight_opportunity || "Villa Campaign is performing 27% better than other campaigns. Consider switching more budget.");
        setFormAiInsightAlert(data.ai_insight_critical_alert || "Increase budget for Google Ads - high ROI detected and search volumes are surging.");
        setFormAiInsightDiag(data.ai_insight_weekly_diagnosis || "Lead quality improved by 18% compared to last month. SEO push on Coimbatore Hub contributed 410 Leads.");

        // Calendar setup mapping
        setCalendarHeader(data.calendar_header || "Content Calendar (May 2025)");
        setCalendarDateLabel(data.calendar_date_label || "Target Date (Day of May)");
        setCalendarEmptyCells(Number(data.calendar_empty_cells || 3));
        setCalendarTotalDays(Number(data.calendar_total_days || 31));

        setFormCalendarHeader(data.calendar_header || "Content Calendar (May 2025)");
        setFormCalendarDateLabel(data.calendar_date_label || "Target Date (Day of May)");
        setFormCalendarEmptyCells(data.calendar_empty_cells || "3");
        setFormCalendarTotalDays(data.calendar_total_days || "31");

        // SEO sub-labels mapping
        setSeoTrafficSub(data.seo_traffic_sub || "↑ 15.6% vs last month");
        setSeoKeywordsSub(data.seo_keywords_sub || "↑ 12.3% active keywords");
        setSeoTop10Sub(data.seo_top10_sub || "↑ 8.7% index movement");
        setSeoAuthoritySub(data.seo_authority_sub || "Stable domain weight");

        setFormSeoTrafficSub(data.seo_traffic_sub || "↑ 15.6% vs last month");
        setFormSeoKeywordsSub(data.seo_keywords_sub || "↑ 12.3% active keywords");
        setFormSeoTop10Sub(data.seo_top10_sub || "↑ 8.7% index movement");
        setFormSeoAuthoritySub(data.seo_authority_sub || "Stable domain weight");

        // Competitor mapping string
        setCompetitorMapping(data.competitor_mapping || "luxury flats in chennai:Competitor A|builders in coimbatore:Competitor B");
        setFormCompetitorMapping(data.competitor_mapping || "luxury flats in chennai:Competitor A|builders in coimbatore:Competitor B");

        // Alert limits and thresholds
        setAlertThreshold(Number(data.alert_threshold || 450));
        setNotificationEmails(data.notification_emails === "true" || data.notification_emails === undefined);
        setWeeklyReports(data.weekly_reports === "true" || data.weekly_reports === undefined);
        setLeadScoringMin(Number(data.lead_scoring_min || 65));

        setFormAlertThreshold(data.alert_threshold || "450");
        setFormNotificationEmails(data.notification_emails === "true" || data.notification_emails === undefined);
        setFormWeeklyReports(data.weekly_reports === "true" || data.weekly_reports === undefined);
        setFormLeadScoringMin(data.lead_scoring_min || "65");

        const metricsList: Metric[] = data.metrics || [];
        const findMetricVal = (key: string, fallback: string) => {
          const found = metricsList.find(m => m.metricKey === key);
          return found !== undefined ? String(found.metricValue) : fallback;
        };

        setFormIgFollowers(findMetricVal("Instagram Followers", "28000"));
        setFormIgGrowth(findMetricVal("Instagram Growth", "12"));
        setFormIgEng(findMetricVal("Instagram Engagement", "6.8"));
        
        setFormFbFollowers(findMetricVal("Facebook Followers", "18000"));
        setFormFbGrowth(findMetricVal("Facebook Growth", "8"));
        setFormFbEng(findMetricVal("Facebook Engagement", "5.4"));
        
        setFormLiFollowers(findMetricVal("LinkedIn Followers", "12000"));
        setFormLiGrowth(findMetricVal("LinkedIn Growth", "15"));
        setFormLiEng(findMetricVal("LinkedIn Engagement", "4.8"));
        
        setFormYtFollowers(findMetricVal("YouTube Followers", "5200"));
        setFormYtGrowth(findMetricVal("YouTube Growth", "10"));
        setFormYtEng(findMetricVal("YouTube Engagement", "7.2"));

        setFormCompATraffic(findMetricVal("Competitor A Traffic", "18400"));
        setFormCompBTraffic(findMetricVal("Competitor B Traffic", "15300"));
        setFormCompCTraffic(findMetricVal("Competitor C Traffic", "9800"));

        setFormBudgetLimit(findMetricVal("Marketing Budget Limit", "700000"));

        const projRes = await fetch("http://localhost:8081/api/projects", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (projRes.ok) {
          const projData = await projRes.json();
          setProjects(projData || []);
        }
      } else {
        setErrorMsg("Failed to retrieve dashboard data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/digital-marketing-tl/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formProfileName,
          email: formProfileEmail,
          organizationId: orgId.toString(),
          sidebar_menus: formSidebarMenus,
          ai_suggestions: formAiSuggestions,
          avatarInitials: formAvatarInitials,
          header_date: formHeaderDate,

          baselines_leads: formBaselineLeads,
          baselines_qualified: formBaselineQualified,
          baselines_spend: formBaselineSpend,
          baselines_cpl: formBaselineCpl,
          baselines_roi: formBaselineRoi,
          baselines_compare_date: formBaselineCompareDate,

          ai_insight_recommendation: formAiInsightRec,
          ai_insight_opportunity: formAiInsightOpp,
          ai_insight_critical_alert: formAiInsightAlert,
          ai_insight_weekly_diagnosis: formAiInsightDiag,

          calendar_header: formCalendarHeader,
          calendar_date_label: formCalendarDateLabel,
          calendar_empty_cells: formCalendarEmptyCells,
          calendar_total_days: formCalendarTotalDays,

          seo_traffic_sub: formSeoTrafficSub,
          seo_keywords_sub: formSeoKeywordsSub,
          seo_top10_sub: formSeoTop10Sub,
          seo_authority_sub: formSeoAuthoritySub,

          competitor_mapping: formCompetitorMapping,

          alert_threshold: formAlertThreshold,
          notification_emails: String(formNotificationEmails),
          weekly_reports: String(formWeeklyReports),
          lead_scoring_min: formLeadScoringMin
        })
      });

      if (res.ok) {
        const saveOrUpdateMetric = async (key: string, value: number, category: string, label: string) => {
          const existing = metrics.find(m => m.metricKey === key);
          const payload = {
            metricKey: key,
            metricValue: value,
            category: category,
            label: label,
            organizationId: orgId
          };
          const method = existing ? "PUT" : "POST";
          const url = existing 
            ? `http://localhost:8081/api/digital-marketing-tl/metrics/${existing.id}` 
            : "http://localhost:8081/api/digital-marketing-tl/metrics";
          
          await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
        };

        await Promise.all([
          saveOrUpdateMetric("Instagram Followers", Number(formIgFollowers), "tl_social_media", "Instagram Followers"),
          saveOrUpdateMetric("Instagram Growth", Number(formIgGrowth), "tl_social_media", "Instagram Growth"),
          saveOrUpdateMetric("Instagram Engagement", Number(formIgEng), "tl_social_media", "Instagram Engagement"),
          
          saveOrUpdateMetric("Facebook Followers", Number(formFbFollowers), "tl_social_media", "Facebook Followers"),
          saveOrUpdateMetric("Facebook Growth", Number(formFbGrowth), "tl_social_media", "Facebook Growth"),
          saveOrUpdateMetric("Facebook Engagement", Number(formFbEng), "tl_social_media", "Facebook Engagement"),
          
          saveOrUpdateMetric("LinkedIn Followers", Number(formLiFollowers), "tl_social_media", "LinkedIn Followers"),
          saveOrUpdateMetric("LinkedIn Growth", Number(formLiGrowth), "tl_social_media", "LinkedIn Growth"),
          saveOrUpdateMetric("LinkedIn Engagement", Number(formLiEng), "tl_social_media", "LinkedIn Engagement"),
          
          saveOrUpdateMetric("YouTube Followers", Number(formYtFollowers), "tl_social_media", "YouTube Followers"),
          saveOrUpdateMetric("YouTube Growth", Number(formYtGrowth), "tl_social_media", "YouTube Growth"),
          saveOrUpdateMetric("YouTube Engagement", Number(formYtEng), "tl_social_media", "YouTube Engagement"),

          saveOrUpdateMetric("Competitor A Traffic", Number(formCompATraffic), "tl_competitors", "Competitor A"),
          saveOrUpdateMetric("Competitor B Traffic", Number(formCompBTraffic), "tl_competitors", "Competitor B"),
          saveOrUpdateMetric("Competitor C Traffic", Number(formCompCTraffic), "tl_competitors", "Competitor C"),

          saveOrUpdateMetric("Marketing Budget Limit", Number(formBudgetLimit), "tl_budget_summary", "Total Budget Limit")
        ]);

        alert("Configurations and metrics updated successfully!");
        loadData();
      } else {
        alert("Failed to update configurations.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating configurations.");
    }
  };

  // --- Handlers ---
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const payload = {
        name: newTeamName,
        role: newTeamRole,
        tasksAssigned: Number(newTeamTasks),
        tasksCompleted: Number(newTeamCompleted),
        leadsGenerated: Number(newTeamLeads),
        avatar: newTeamAvatar || newTeamName.split(" ").map(n => n.charAt(0)).join("").toUpperCase().substring(0, 2),
        organizationId: orgId
      };

      const res = await fetch("http://localhost:8081/api/digital-marketing-tl/team-members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNewTeamName("");
        setNewTeamAvatar("");
        setNewTeamTasks("0");
        setNewTeamCompleted("0");
        setNewTeamLeads("0");
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/team-members/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSeoKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeoKw || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const slug = newSeoKw.toLowerCase().replace(/[^a-z0-9]/g, "_");

      const p1 = { metricKey: `kw_${slug}_pos`, metricValue: Number(newSeoPos), category: "tl_seo_keywords", label: newSeoKw, organizationId: orgId };
      const p2 = { metricKey: `kw_${slug}_vol`, metricValue: Number(newSeoVol), category: "tl_seo_keywords_vol", label: newSeoKw, organizationId: orgId };
      const p3 = { metricKey: `kw_${slug}_dir`, metricValue: Number(newSeoDir), category: "tl_seo_keywords_dir", label: newSeoKw, organizationId: orgId };

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      await Promise.all([
        fetch("http://localhost:8081/api/digital-marketing-tl/metrics", { method: "POST", headers, body: JSON.stringify(p1) }),
        fetch("http://localhost:8081/api/digital-marketing-tl/metrics", { method: "POST", headers, body: JSON.stringify(p2) }),
        fetch("http://localhost:8081/api/digital-marketing-tl/metrics", { method: "POST", headers, body: JSON.stringify(p3) })
      ]);

      setNewSeoKw("");
      setNewSeoPos("1");
      setNewSeoVol("1000");
      setNewSeoDir("0");
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSeoKeyword = async (kwLabel: string) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const targets = metrics.filter(m => m.label === kwLabel && (m.category === "tl_seo_keywords" || m.category === "tl_seo_keywords_vol" || m.category === "tl_seo_keywords_dir"));

      await Promise.all(targets.map(t => 
        fetch(`http://localhost:8081/api/digital-marketing-tl/metrics/${t.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
      ));

      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCompetitorGap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGapKw || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const slug = newGapKw.toLowerCase().replace(/[^a-z0-9]/g, "_");

      const p1 = { metricKey: `gap_${slug}_our`, metricValue: Number(newGapOur), category: "tl_competitor_gaps_our", label: newGapKw, organizationId: orgId };
      const p2 = { metricKey: `gap_${slug}_their`, metricValue: Number(newGapTheir), category: "tl_competitor_gaps_their", label: newGapKw, organizationId: orgId };
      const p3 = { metricKey: `gap_${slug}_priority`, metricValue: Number(newGapPriority), category: "tl_competitor_gaps_priority", label: newGapKw, organizationId: orgId };

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      await Promise.all([
        fetch("http://localhost:8081/api/digital-marketing-tl/metrics", { method: "POST", headers, body: JSON.stringify(p1) }),
        fetch("http://localhost:8081/api/digital-marketing-tl/metrics", { method: "POST", headers, body: JSON.stringify(p2) }),
        fetch("http://localhost:8081/api/digital-marketing-tl/metrics", { method: "POST", headers, body: JSON.stringify(p3) })
      ]);

      setNewGapKw("");
      setNewGapOur("5");
      setNewGapTheir("1");
      setNewGapPriority("0");
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCompetitorGap = async (kwLabel: string) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const targets = metrics.filter(m => m.label === kwLabel && (m.category === "tl_competitor_gaps_our" || m.category === "tl_competitor_gaps_their" || m.category === "tl_competitor_gaps_priority"));

      await Promise.all(targets.map(t => 
        fetch(`http://localhost:8081/api/digital-marketing-tl/metrics/${t.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
      ));

      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBudgetCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetCat || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const payload = {
        metricKey: newBudgetCat,
        metricValue: Number(newBudgetVal),
        category: "tl_budget_breakdown",
        label: newBudgetCat,
        organizationId: orgId
      };

      const res = await fetch("http://localhost:8081/api/digital-marketing-tl/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNewBudgetCat("");
        setNewBudgetVal("50000");
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBudgetCategory = async (id: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/metrics/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTrendPoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrendLabel || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const payload = {
        chartName: "leads_vs_qualified",
        label: newTrendLabel,
        value1: Number(newTrendLeads),
        value2: Number(newTrendQualified),
        organizationId: orgId
      };

      const res = await fetch("http://localhost:8081/api/digital-marketing-tl/trends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNewTrendLabel("");
        setNewTrendLeads("100");
        setNewTrendQualified("20");
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTrendPoint = async (id: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/trends/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCalendarEvent = async (id: string) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/calendar-events/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const payload = {
        name: newCampaign.name,
        platform: newCampaign.platform,
        leads: Number(newCampaign.leads),
        cost: Number(newCampaign.cost),
        roi: Number(newCampaign.roi),
        status: newCampaign.status,
        cpl: String(Math.round(Number(newCampaign.cost) / Number(newCampaign.leads))),
        organizationId: orgId
      };

      const res = await fetch("http://localhost:8081/api/digital-marketing-tl/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setCampaigns([...campaigns, saved]);
        setNewCampaign({ name: "", platform: "Google Ads", leads: 50, cost: 20000, roi: 3.0, status: "Good" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/campaigns/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setCampaigns(campaigns.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const payload = {
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone || "+91 99999 88888",
        source: newLead.source,
        quality: newLead.quality,
        status: newLead.status,
        date: new Date().toISOString().split("T")[0],
        organizationId: orgId
      };

      const res = await fetch("http://localhost:8081/api/digital-marketing-tl/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setLeads([saved, ...leads]);
        setNewLead({ name: "", email: "", phone: "", source: "Google Ads", quality: "High", status: "New" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/leads/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/leads/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const payload = {
        title: newEvent.title,
        date: Number(newEvent.date),
        channel: newEvent.channel,
        status: newEvent.status,
        organizationId: orgId
      };

      const res = await fetch("http://localhost:8081/api/digital-marketing-tl/calendar-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setCalendarEvents([...calendarEvents, saved]);
        setNewEvent({ title: "", date: 15, channel: "Instagram", status: "Draft" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/digital-marketing-tl/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
      }
    } catch (e) {
      console.error(e);
      setChatMessages((prev) => [...prev, { sender: "bot", text: "Failed to connect to AI engine." }]);
    }
  };

  // --- Project Filtering and KPI Calculations ---
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

  const filteredCampaigns = React.useMemo(() => {
    return campaigns.filter((c, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [campaigns, projectFilter, projects]);

  const filteredLeads = React.useMemo(() => {
    return leads.filter((l, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [leads, projectFilter, projects]);

  const filteredCalendarEvents = React.useMemo(() => {
    return calendarEvents.filter((e, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [calendarEvents, projectFilter, projects]);

  // --- Dynamic Stats calculation ---
  const totalLeads = React.useMemo(() => {
    return filteredCampaigns.reduce((acc, curr) => acc + curr.leads, 0);
  }, [filteredCampaigns]);

  const qualifiedLeadsCount = React.useMemo(() => {
    return filteredLeads.filter(l => l.status === "Qualified").length;
  }, [filteredLeads]);

  const disqualifiedLeadsCount = React.useMemo(() => {
    return filteredLeads.filter(l => l.status === "Disqualified").length;
  }, [filteredLeads]);

  const nurturingLeadsCount = React.useMemo(() => {
    return filteredLeads.filter(l => l.status === "Nurturing").length;
  }, [filteredLeads]);

  const marketingSpendTotal = React.useMemo(() => {
    return filteredCampaigns.reduce((acc, curr) => acc + curr.cost, 0);
  }, [filteredCampaigns]);

  const averageCpl = React.useMemo(() => {
    return Math.round(marketingSpendTotal / (totalLeads || 1));
  }, [marketingSpendTotal, totalLeads]);

  const averageRoi = React.useMemo(() => {
    const totalCost = filteredCampaigns.reduce((acc, curr) => acc + curr.cost, 0);
    const totalRevenue = filteredCampaigns.reduce((acc, curr) => acc + (curr.cost * curr.roi), 0);
    return totalCost > 0 ? Number((totalRevenue / totalCost).toFixed(1)) : 0.0;
  }, [filteredCampaigns]);

  const scale = getScaleFactor();

  const baselines = {
    leads: baselineLeads,
    qualified: baselineQualified,
    spend: baselineSpend,
    cpl: baselineCpl,
    roi: baselineRoi
  };

  const leadsChangeText = React.useMemo(() => {
    const diff = totalLeads - baselines.leads;
    const pct = ((diff / (baselines.leads || 1)) * 100).toFixed(1);
    return `${diff >= 0 ? "↑" : "↓"} ${Math.abs(Number(pct))}% ${baselineCompareDate}`;
  }, [totalLeads, baselineLeads, baselineCompareDate]);

  const qualifiedChangeText = React.useMemo(() => {
    const diff = qualifiedLeadsCount - baselines.qualified;
    const pct = ((diff / (baselines.qualified || 1)) * 100).toFixed(1);
    return `${diff >= 0 ? "↑" : "↓"} ${Math.abs(Number(pct))}% ${baselineCompareDate}`;
  }, [qualifiedLeadsCount, baselineQualified, baselineCompareDate]);

  const spendChangeText = React.useMemo(() => {
    const diff = marketingSpendTotal - baselines.spend;
    const pct = ((diff / (baselines.spend || 1)) * 100).toFixed(1);
    return `${diff >= 0 ? "↑" : "↓"} ${Math.abs(Number(pct))}% ${baselineCompareDate}`;
  }, [marketingSpendTotal, baselineSpend, baselineCompareDate]);

  const cplChangeText = React.useMemo(() => {
    const diff = averageCpl - baselines.cpl;
    const pct = ((diff / (baselines.cpl || 1)) * 100).toFixed(1);
    return `${diff >= 0 ? "↑" : "↓"} ${Math.abs(Number(pct))}% ${baselineCompareDate}`;
  }, [averageCpl, baselineCpl, baselineCompareDate]);

  const roiChangeText = React.useMemo(() => {
    const diff = averageRoi - baselines.roi;
    const pct = ((diff / (baselines.roi || 1)) * 100).toFixed(1);
    return `${diff >= 0 ? "↑" : "↓"} ${Math.abs(Number(pct))}% ${baselineCompareDate}`;
  }, [averageRoi, baselineRoi, baselineCompareDate]);


  const iconMap: { [key: string]: React.ReactNode } = {
    "Executive Summary": <LayoutDashboard className="h-4 w-4" />,
    "Lead Generation Center": <Target className="h-4 w-4" />,
    "Campaign Management": <Activity className="h-4 w-4" />,
    "Ad Performance": <Search className="h-4 w-4" />,
    "SEO Performance": <Compass className="h-4 w-4" />,
    "Social Media Overview": <Share2 className="h-4 w-4" />,
    "Content Calendar": <Calendar className="h-4 w-4" />,
    "Team Performance": <Users className="h-4 w-4" />,
    "Marketing Budget": <DollarSign className="h-4 w-4" />,
    "Lead Quality Analysis": <CheckSquare className="h-4 w-4" />,
    "Competitor Monitoring": <LineChart className="h-4 w-4" />,
    "AI Marketing Assistant": <Bot className="h-4 w-4" />,
    "Settings": <Settings className="h-4 w-4" />,
  };

  const menuList = sidebarMenus.length > 0 ? sidebarMenus : [
    "Executive Summary",
    "Lead Generation Center",
    "Campaign Management",
    "Ad Performance",
    "SEO Performance",
    "Social Media Overview",
    "Content Calendar",
    "Team Performance",
    "Marketing Budget",
    "Lead Quality Analysis",
    "Competitor Monitoring",
    "AI Marketing Assistant",
    "Settings"
  ];

  // --- Chart Data mapping ---
  const dbLeadTrend = trends.filter(t => t.chartName === "leads_vs_qualified");
  const leadTrendData = dbLeadTrend.length > 0 ? dbLeadTrend.map(t => ({
    m: t.label,
    Leads: t.value1,
    Qualified: t.value2
  })) : [];

  const displayLeadTrendData = React.useMemo(() => {
    const scale = getScaleFactor();
    return leadTrendData.map(d => ({
      ...d,
      Leads: Math.round(d.Leads * scale),
      Qualified: Math.round(d.Qualified * scale)
    }));
  }, [projectFilter, leadTrendData, projects]);

  const dbLeadSources = metrics.filter(m => m.category === "tl_lead_sources");
  const leadSourceData = dbLeadSources.length > 0 ? dbLeadSources.map((m, idx) => ({
    name: m.label,
    value: m.metricValue,
    color: ["#3B82F6", "#10B981", "#8B5CF6", "#EC4899", "#F59E0B", "#64748B"][idx % 6]
  })) : [];

  const displayLeadSourceData = React.useMemo(() => {
    const scale = getScaleFactor();
    return leadSourceData.map(d => ({
      ...d,
      value: Math.round(d.value * scale)
    }));
  }, [projectFilter, leadSourceData, projects]);

  const displayAdPerformanceData = React.useMemo(() => {
    const gClicks = metrics.find(m => m.metricKey === "Google Ads Clicks")?.metricValue ?? 0;
    const gConv = metrics.find(m => m.metricKey === "Google Ads Conv")?.metricValue ?? 0;
    const gCost = metrics.find(m => m.metricKey === "Google Ads Cost")?.metricValue ?? 0;
    const gCtr = metrics.find(m => m.metricKey === "Google Ads CTR")?.metricValue ?? 0;

    const mClicks = metrics.find(m => m.metricKey === "Meta Ads Clicks")?.metricValue ?? 0;
    const mConv = metrics.find(m => m.metricKey === "Meta Ads Conv")?.metricValue ?? 0;
    const mCost = metrics.find(m => m.metricKey === "Meta Ads Cost")?.metricValue ?? 0;
    const mCtr = metrics.find(m => m.metricKey === "Meta Ads CTR")?.metricValue ?? 0;

    const scale = getScaleFactor();

    return [
      {
        name: "Google Ads",
        clicks: Math.round(gClicks * scale),
        conversions: Math.round(gConv * scale),
        ctr: `${gCtr.toFixed(2)}%`,
        cost: `₹${((gCost * scale) / 100000).toFixed(2)} L`
      },
      {
        name: "Meta Ads",
        clicks: Math.round(mClicks * scale),
        conversions: Math.round(mConv * scale),
        ctr: `${mCtr.toFixed(2)}%`,
        cost: `₹${((mCost * scale) / 100000).toFixed(2)} L`
      }
    ];
  }, [metrics, projectFilter, projects]);

  const seoStats = React.useMemo(() => {
    const rawTraffic = metrics.find(m => m.metricKey === "SEO Traffic")?.metricValue ?? 0;
    const rawKeywords = metrics.find(m => m.metricKey === "SEO Keywords")?.metricValue ?? 0;
    const rawAuthority = metrics.find(m => m.metricKey === "SEO Authority")?.metricValue ?? 0;
    const rawTop10 = metrics.find(m => m.metricKey === "SEO Top 10 Keywords")?.metricValue ?? 0;

    const scale = getScaleFactor();
    const trafficVal = Math.round(rawTraffic * scale);
    const keywordsVal = Math.round(rawKeywords * scale);
    const authorityVal = Math.round(rawAuthority * scale);
    const top10Val = Math.round(rawTop10 * scale);

    return {
      traffic: trafficVal >= 1000 ? `${(trafficVal / 1000).toFixed(1)}K` : String(trafficVal),
      keywords: keywordsVal,
      authority: authorityVal,
      top10: top10Val
    };
  }, [metrics, projectFilter, projects]);

  const seoKeywords = React.useMemo(() => {
    const keywordMetrics = metrics.filter(m => m.category === "tl_seo_keywords");
    return keywordMetrics.map(km => {
      const kw = km.label;
      const pos = km.metricValue;
      const vol = metrics.find(m => m.category === "tl_seo_keywords_vol" && m.label === kw)?.metricValue ?? 0;
      const dirVal = metrics.find(m => m.category === "tl_seo_keywords_dir" && m.label === kw)?.metricValue ?? 0;

      let dirText = "Stable";
      if (dirVal > 0) {
        dirText = `↑ Up ${Math.round(dirVal)} spot${Math.round(dirVal) > 1 ? "s" : ""}`;
      } else if (dirVal < 0) {
        dirText = `↓ Down ${Math.round(Math.abs(dirVal))} spot${Math.round(Math.abs(dirVal)) > 1 ? "s" : ""}`;
      }

      return {
        kw,
        pos: `Position ${Math.round(pos)}`,
        vol,
        dir: dirText
      };
    });
  }, [metrics]);

  const competitorShareData = React.useMemo(() => {
    const rawTraffic = metrics.find(m => m.metricKey === "SEO Traffic")?.metricValue ?? 0;
    const scale = getScaleFactor();
    const buildwellTraffic = Math.round(rawTraffic * scale);

    const list = [{ name: organizationName, traffic: buildwellTraffic }];

    const comps = metrics.filter(m => m.category === "tl_competitors");
    comps.forEach(c => {
      list.push({
        name: c.label,
        traffic: Math.round(c.metricValue * scale)
      });
    });

    return list;
  }, [metrics, projectFilter, projects]);

  const keywordGaps = React.useMemo(() => {
    const ourGaps = metrics.filter(m => m.category === "tl_competitor_gaps_our");

    const mapObj: { [key: string]: string } = {};
    competitorMapping.split("|").forEach(item => {
      const parts = item.split(":");
      if (parts.length === 2) {
        mapObj[parts[0].trim()] = parts[1].trim();
      }
    });

    return ourGaps.map(km => {
      const kw = km.label;
      const ourRank = km.metricValue;
      const theirRank = metrics.find(m => m.category === "tl_competitor_gaps_their" && m.label === kw)?.metricValue ?? 0;
      const priorityVal = metrics.find(m => m.category === "tl_competitor_gaps_priority" && m.label === kw)?.metricValue ?? 0;

      let priorityText = "Normal Priority";
      let priorityColor = "text-slate-400";

      if (priorityVal === 1) {
        priorityText = "High Gap priority";
        priorityColor = "text-amber-400";
      } else if (priorityVal === 2) {
        priorityText = "Market Dominance";
        priorityColor = "text-emerald-400";
      }

      const competitorName = mapObj[kw] || "Competitor B";

      return {
        kw,
        ourRank,
        theirRank,
        competitorName,
        priorityText,
        priorityColor
      };
    });
  }, [metrics, competitorMapping]);

  const socialStats = React.useMemo(() => {
    const scale = getScaleFactor();
    const getVal = (key: string, fallback: number) => {
      const val = metrics.find(m => m.metricKey === key)?.metricValue;
      return val !== undefined ? val : fallback;
    };

    const igFollowers = Math.round(getVal("Instagram Followers", 0) * scale);
    const fbFollowers = Math.round(getVal("Facebook Followers", 0) * scale);
    const liFollowers = Math.round(getVal("LinkedIn Followers", 0) * scale);
    const ytFollowers = Math.round(getVal("YouTube Followers", 0) * scale);

    const igGrowth = getVal("Instagram Growth", 0);
    const fbGrowth = getVal("Facebook Growth", 0);
    const liGrowth = getVal("LinkedIn Growth", 0);
    const ytGrowth = getVal("YouTube Growth", 0);

    const igEng = getVal("Instagram Engagement", 0);
    const fbEng = getVal("Facebook Engagement", 0);
    const liEng = getVal("LinkedIn Engagement", 0);
    const ytEng = getVal("YouTube Engagement", 0);

    return {
      igFollowers: igFollowers >= 1000 ? `${(igFollowers/1000).toFixed(1)}K` : String(igFollowers),
      fbFollowers: fbFollowers >= 1000 ? `${(fbFollowers/1000).toFixed(1)}K` : String(fbFollowers),
      liFollowers: liFollowers >= 1000 ? `${(liFollowers/1000).toFixed(1)}K` : String(liFollowers),
      ytFollowers: ytFollowers >= 1000 ? `${(ytFollowers/1000).toFixed(1)}K` : String(ytFollowers),
      igGrowth: `↑ ${igGrowth}% growth`,
      fbGrowth: `↑ ${fbGrowth}% growth`,
      liGrowth: `↑ ${liGrowth}% growth`,
      ytGrowth: `↑ ${ytGrowth}% growth`,
      engagement: [
        { name: "Instagram", rate: igEng },
        { name: "Facebook", rate: fbEng },
        { name: "LinkedIn", rate: liEng },
        { name: "YouTube", rate: ytEng },
      ]
    };
  }, [metrics, projectFilter, projects]);

  const budgetLimit = React.useMemo(() => {
    const scale = getScaleFactor();
    const rawBudget = metrics.find(m => m.metricKey === "Marketing Budget Limit")?.metricValue ?? 0;
    return Math.round(rawBudget * scale);
  }, [metrics, projectFilter, projects]);

  const highQualityCount = React.useMemo(() => {
    return filteredLeads.filter(l => l.quality === "High").length;
  }, [filteredLeads]);

  const mediumQualityCount = React.useMemo(() => {
    return filteredLeads.filter(l => l.quality === "Medium").length;
  }, [filteredLeads]);

  const lowQualityCount = React.useMemo(() => {
    return filteredLeads.filter(l => l.quality === "Low").length;
  }, [filteredLeads]);

  const dbBudget = metrics.filter(m => m.category === "tl_budget_breakdown");
  const budgetBreakdownData = dbBudget.length > 0 ? dbBudget.map(m => ({
    name: m.label,
    value: m.metricValue
  })) : [];

  const displayBudgetBreakdownData = React.useMemo(() => {
    const scale = getScaleFactor();
    return budgetBreakdownData.map(d => ({
      ...d,
      value: Math.round(d.value * scale)
    }));
  }, [projectFilter, budgetBreakdownData, projects]);

  const displayPlatformShareData = React.useMemo(() => {
    const platformMap: { [key: string]: { spend: number, leads: number } } = {};

    // Seed default platforms so they always render in the chart even if empty
    platformMap["Google Ads"] = { spend: 0, leads: 0 };
    platformMap["Meta Ads"] = { spend: 0, leads: 0 };
    platformMap["SEO Organic"] = { spend: 0, leads: 0 };

    filteredCampaigns.forEach(c => {
      const platform = c.platform || "Others";
      if (!platformMap[platform]) {
        platformMap[platform] = { spend: 0, leads: 0 };
      }
      platformMap[platform].spend += (c.cost || 0) / 100000.0; // convert to Lakhs
      platformMap[platform].leads += (c.leads || 0);
    });

    return Object.entries(platformMap).map(([name, data]) => ({
      name,
      spend: Number(data.spend.toFixed(2)),
      leads: data.leads
    }));
  }, [filteredCampaigns]);

  const totalTasksAssigned = React.useMemo(() => {
    return teamMembers.reduce((acc, curr) => acc + (curr.tasksAssigned || 0), 0);
  }, [teamMembers]);

  const totalTasksCompleted = React.useMemo(() => {
    return teamMembers.reduce((acc, curr) => acc + (curr.tasksCompleted || 0), 0);
  }, [teamMembers]);

  const pendingApprovalsCount = React.useMemo(() => {
    return calendarEvents.filter(e => e.status === "Draft").length;
  }, [calendarEvents]);


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
              <div className="font-bold text-white tracking-wide">{organizationName}</div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">Constructions</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {menuList.map((tabName) => {
              const active = activeTab === tabName;
              return (
                <button
                  key={tabName}
                  onClick={() => setActiveTab(tabName)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-250 ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-semibold shadow-md shadow-blue-500/15"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {iconMap[tabName] || <LayoutDashboard className="h-4 w-4" />}
                  <span className="flex-1 text-left">{tabName}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Widgets & Profile */}
        <div className="p-4 border-t border-slate-800 space-y-4 bg-[#0B1222]">
          <div className="bg-[#111C30]/50 border border-slate-800/80 rounded-xl p-3 text-[11px] space-y-2.5">
            <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1.5 flex justify-between">
              <span>Today's Overview</span>
              <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono">MTD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tasks</span>
              <span className="text-white font-semibold font-mono">
                {String(totalTasksCompleted).padStart(2, '0')} / {String(totalTasksAssigned).padStart(2, '0')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">New Leads</span>
              <span className="text-emerald-400 font-semibold font-mono">+{leads.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pending Approvals</span>
              <span className="text-yellow-400 font-semibold font-mono">
                {String(pendingApprovalsCount).padStart(2, '0')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Budget Used</span>
              <span className="text-indigo-400 font-semibold font-mono">{Math.round((marketingSpendTotal / (budgetLimit || 1))*100)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="h-9 w-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 grid place-items-center text-xs font-bold shadow-inner font-mono">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{profileName}</div>
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
            <p className="text-[10px] text-slate-400 mt-0.5">Welcome back, {profileName}! Manage campaigns, SEO targets, content calendar, and marketing budget.</p>
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

            <button
              onClick={handleSyncChannels}
              disabled={syncing}
              className="bg-indigo-650 hover:bg-indigo-600 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
            >
              {syncing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : "Sync External Channels"}
            </button>

            <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Dashboard Data">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>

            <button className="relative p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-350 hover:text-white transition-colors">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            </button>
          </div>
        </header>

        {/* TAB CONTENTS CONTAINER */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
              <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
              <p className="text-xs text-slate-400">Fetching live TL dashboard records from MySQL...</p>
            </div>
          ) : errorMsg ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
              <span>⚠️ {errorMsg}</span>
              <button onClick={loadData} className="px-4 py-1.5 bg-red-650 hover:bg-red-550 text-white rounded-lg font-semibold transition">Retry</button>
            </div>
          ) : (
            <>
              {/* 1. EXECUTIVE SUMMARY */}
              {activeTab === "Executive Summary" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      { title: "Monthly Leads", val: totalLeads.toLocaleString('en-IN'), change: leadsChangeText, color: "#3B82F6", sub: "leadsTrend" },
                      { title: "Qualified Leads", val: qualifiedLeadsCount.toLocaleString('en-IN'), change: qualifiedChangeText, color: "#10B981", sub: "leadsTrend" },
                      { title: "Marketing Spend", val: `₹${(marketingSpendTotal/100000).toFixed(2)} L`, change: spendChangeText, color: "#8B5CF6", sub: "spendTrend" },
                      { title: "Cost Per Lead", val: `₹${averageCpl}`, change: cplChangeText, color: "#F59E0B", sub: "spendTrend" },
                      { title: "ROI", val: `${averageRoi}X`, change: roiChangeText, color: "#06B6D4", sub: "leadsTrend" }
                    ].map((c, i) => (
                      <div key={i} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
                        <div className="z-10">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{c.title}</span>
                          <div className="text-xl font-bold text-white mt-1 font-mono">{c.val}</div>
                        </div>
                        <div className="z-10 text-[9px] font-semibold mt-auto flex items-center gap-1" style={{ color: c.color }}>
                          {c.change}
                        </div>
                        <div className="absolute right-0 bottom-0 left-0 h-10 opacity-20">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={displayLeadTrendData}>
                              <Area type="monotone" dataKey={c.sub === "leadsTrend" ? "Leads" : "Qualified"} stroke={c.color} fill={c.color} strokeWidth={1} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Funnel & Campaigns & Donut */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    
                    {/* Funnel */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Lead Generation Funnel</h3>
                        <p className="text-[9px] text-slate-400 mb-4">Total lead tracking from initial clicks to conversions</p>
                      </div>
                      <div className="space-y-3">
                        <div className="relative">
                          <div className="w-full bg-blue-600/25 border border-blue-500/40 text-center py-2.5 rounded-lg text-xs font-bold font-mono">
                            Total Leads: {totalLeads}
                          </div>
                        </div>
                        <div className="relative flex justify-center">
                          <div className="w-[85%] bg-emerald-600/25 border border-emerald-500/40 text-center py-2.5 rounded-lg text-xs font-bold font-mono">
                            Qualified Leads: {qualifiedLeadsCount} ({totalLeads > 0 ? Math.round((qualifiedLeadsCount/totalLeads)*100) : 0}%)
                          </div>
                        </div>
                        <div className="relative flex justify-center">
                          <div className="w-[70%] bg-amber-600/25 border border-amber-500/40 text-center py-2.5 rounded-lg text-xs font-bold font-mono text-amber-200">
                            Disqualified Leads: {disqualifiedLeadsCount} ({totalLeads > 0 ? Math.round((disqualifiedLeadsCount/totalLeads)*100) : 0}%)
                          </div>
                        </div>
                        <div className="relative flex justify-center">
                          <div className="w-[55%] bg-purple-600/25 border border-purple-500/40 text-center py-2.5 rounded-lg text-xs font-bold font-mono text-purple-200">
                            Nurturing Leads: {nurturingLeadsCount} ({totalLeads > 0 ? Math.round((nurturingLeadsCount/totalLeads)*100) : 0}%)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campaigns Overview */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Campaign Performance Overview</h3>
                        <button onClick={() => setActiveTab("Campaign Management")} className="text-[10px] text-blue-400 font-semibold hover:underline flex items-center gap-0.5">
                          View All <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="space-y-3 overflow-y-auto max-h-56">
                        {filteredCampaigns.slice(0, 4).map((c) => (
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

                    {/* Lead Donut */}
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
                            <span className="text-lg font-bold text-white font-mono">{filteredLeads.length}</span>
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

                  {/* Previews */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Ad Performance overview */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Ad Performance</h3>
                        <button onClick={() => setActiveTab("Ad Performance")} className="text-[10px] text-blue-400 font-semibold hover:underline">Details</button>
                      </div>
                      {displayAdPerformanceData.map((platform, idx) => (
                        <div key={idx} className="p-3 bg-[#0e1628] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold text-slate-100">{platform.name}</div>
                            <div className="text-[9px] text-slate-400 mt-1">Cost: {platform.cost} | CTR: {platform.ctr}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-400 font-mono">{platform.clicks.toLocaleString()} Clicks</div>
                            <div className="text-[10px] text-emerald-400 font-bold font-mono">{platform.conversions.toLocaleString()} Conv</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* SEO Overview */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">SEO Organic Stats</h3>
                        <button onClick={() => setActiveTab("SEO Performance")} className="text-[10px] text-blue-400 font-semibold hover:underline">Analytics</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-[#0e1628] border border-slate-800 rounded-lg">
                          <span className="text-[9px] text-slate-400 uppercase">Traffic</span>
                          <div className="text-sm font-bold text-white font-mono mt-1">{seoStats.traffic}</div>
                        </div>
                        <div className="p-2 bg-[#0e1628] border border-slate-800 rounded-lg">
                          <span className="text-[9px] text-slate-400 uppercase">Keywords</span>
                          <div className="text-sm font-bold text-emerald-400 font-mono mt-1">{seoStats.keywords}</div>
                        </div>
                        <div className="p-2 bg-[#0e1628] border border-slate-800 rounded-lg">
                          <span className="text-[9px] text-slate-400 uppercase">Authority</span>
                          <div className="text-sm font-bold text-blue-400 font-mono mt-1">{seoStats.authority}</div>
                        </div>
                      </div>
                      <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={displayLeadTrendData}>
                            <XAxis dataKey="m" stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC", fontSize: 9 }} />
                            <Area type="monotone" dataKey="Leads" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Team Activity */}
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
                              <span className="text-[9px] font-bold text-slate-350">{Math.round((item.tasksCompleted/(item.tasksAssigned || 1))*100)}% Tasks</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation banner */}
                  <div className="p-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/40 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-xl grid place-items-center">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">AI Marketing Insights Recommendation</h4>
                        <p className="text-[10px] text-slate-300 mt-0.5">{aiInsightRec}</p>
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
                      <div className="text-lg font-bold text-white font-mono">{filteredLeads.length}</div>
                    </div>
                  </div>

                  {/* Form */}
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
                      <span className="text-[10px] text-blue-400 font-semibold">{filteredLeads.length > 100 ? "Showing top 100 of " + filteredLeads.length : filteredLeads.length} Records Shown</span>
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
                          {filteredLeads.slice(0, 100).map((l) => (
                            <tr key={l.id} className="hover:bg-slate-800/10 transition">
                              <td className="p-4 font-semibold text-white">{l.name}</td>
                              <td className="p-4">
                                <div>{l.email}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{l.phone}</div>
                              </td>
                              <td className="p-4 text-slate-350">{l.source}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                  l.quality === "High" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                  l.quality === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                  "bg-red-500/10 text-red-400 border-red-500/20"
                                }`}>
                                  {l.quality}
                                </span>
                              </td>
                              <td className="p-4">
                                <select
                                  value={l.status}
                                  onChange={(e) => handleStatusChange(l.id, e.target.value)}
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
                                  onClick={() => handleDeleteLead(l.id)}
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

                  {/* Form */}
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

                  {/* Campaigns Table */}
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
                        {filteredCampaigns.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-800/10 transition">
                            <td className="p-4 font-bold text-white">{c.name}</td>
                            <td className="p-4 text-slate-350">{c.platform}</td>
                            <td className="p-4 font-mono font-bold text-white">{c.leads}</td>
                            <td className="p-4 font-mono font-bold text-white">₹{c.cost.toLocaleString()}</td>
                            <td className="p-4 font-mono text-slate-350">₹{Math.round(c.cost / (c.leads || 1))}</td>
                            <td className="p-4 font-mono font-bold text-emerald-400">{c.roi}x</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                c.status === "Excellent" || c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                c.status === "Good" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteCampaign(c.id)}
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
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Click CTR Trends MTD</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={displayLeadTrendData}>
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

                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Ad Spend Allocations & Lead Acquisition</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={displayPlatformShareData}>
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

                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Platform Level Ad Details</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {displayAdPerformanceData.map((x, i) => (
                        <div key={i} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-2">
                          <div className="font-bold text-white flex justify-between">
                            <span>{x.name}</span>
                            <span className="text-[10px] text-blue-400 font-mono">{x.cost} Spend</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-2 border-t border-slate-800/80">
                            <div>
                              <span className="text-slate-400">Clicks</span>
                              <div className="text-white font-bold mt-1 font-mono">{x.clicks.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-slate-400">CTR</span>
                              <div className="text-emerald-400 font-bold mt-1 font-mono">{x.ctr}</div>
                            </div>
                            <div>
                              <span className="text-slate-400">Conversions</span>
                              <div className="text-blue-400 font-bold mt-1 font-mono">{x.conversions.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-slate-400">Conv. Rate</span>
                              <div className="text-white font-bold mt-1 font-mono">{(x.conversions / x.clicks * 100).toFixed(2)}%</div>
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
                      { title: "Organic Traffic MTD", val: seoStats.traffic, desc: seoTrafficSub },
                      { title: "Keywords Ranked", val: seoStats.keywords.toLocaleString(), desc: seoKeywordsSub },
                      { title: "Top 10 Keywords", val: seoStats.top10.toLocaleString(), desc: seoTop10Sub },
                      { title: "Domain Authority", val: seoStats.authority.toString(), desc: seoAuthoritySub }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                        <span className="text-[9px] text-slate-400 uppercase font-semibold">{item.title}</span>
                        <div className="text-xl font-bold text-white mt-1 font-mono">{item.val}</div>
                        <span className="text-[9px] text-emerald-400 block mt-1">{item.desc}</span>
                      </div>
                    ))}
                  </div>

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
                          {seoKeywords.map((row, idx) => {
                            return (
                              <tr key={idx} className="hover:bg-slate-800/10 transition">
                                <td className="py-3 font-semibold text-slate-200">{row.kw}</td>
                                <td className="py-3 text-white font-semibold font-mono">{row.pos}</td>
                                <td className="py-3 font-mono font-bold">{Math.round(row.vol).toLocaleString()}</td>
                                <td className="py-3 font-semibold text-emerald-400">{row.dir}</td>
                              </tr>
                            );
                          })}
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
                      { name: "Instagram", followers: `${socialStats.igFollowers} Followers`, growth: socialStats.igGrowth },
                      { name: "Facebook", followers: `${socialStats.fbFollowers} Followers`, growth: socialStats.fbGrowth },
                      { name: "LinkedIn", followers: `${socialStats.liFollowers} Followers`, growth: socialStats.liGrowth },
                      { name: "YouTube", followers: `${socialStats.ytFollowers} Subscribers`, growth: socialStats.ytGrowth }
                    ].map((social, i) => (
                      <div key={i} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                        <span className="text-xs font-bold text-white">{social.name}</span>
                        <div className="text-lg font-bold text-blue-400 mt-2 font-mono">{social.followers}</div>
                        <div className="text-[10px] text-emerald-400 mt-1">{social.growth}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Average Engagement Rate MTD</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={socialStats.engagement}>
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
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{calendarHeader}</h3>
                      <p className="text-[10px] text-slate-400">Schedule multi-channel social media creatives, blog posts, and site reels</p>
                    </div>
                  </div>

                  {/* Form */}
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
                      <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">{calendarDateLabel}</label>
                      <input
                        type="number"
                        min="1"
                        max={calendarTotalDays}
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

                  {/* Calendar Grid */}
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
                      {Array.from({ length: calendarEmptyCells }, (_, i) => (
                        <div key={`empty-${i}`} className="bg-slate-900/10 rounded-lg border border-slate-900/10 p-2"></div>
                      ))}
                      
                      {Array.from({ length: calendarTotalDays }, (_, i) => {
                        const day = i + 1;
                        const dayEvents = filteredCalendarEvents.filter((e) => e.date === day);
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
                                    "bg-amber-500/10 text-amber-400 border border-amber-500/20"
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

                  <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-sans">Assign Direct Team Tasks</h4>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const targetId = (e.target as any).targetMember.value;
                        const desc = (e.target as any).elements[1].value;
                        try {
                          const token = localStorage.getItem("buildcon_token");
                          const res = await fetch(`http://localhost:8081/api/digital-marketing-tl/team-members/${targetId}/assign-task`, {
                            method: "PUT",
                            headers: {
                              "Authorization": `Bearer ${token}`
                            }
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setTeamMembers(teamMembers.map(m => String(m.id) === String(targetId) ? updated : m));
                            alert(`Task assigned successfully to the selected digital executive!\nTask: ${desc}`);
                            (e.target as any).elements[1].value = "";
                          } else {
                            alert("Failed to assign task in database.");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("Error connecting to server.");
                        }
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
                            <span className="text-lg font-bold text-white font-mono">{Math.round((marketingSpendTotal / (budgetLimit || 1)) * 100)}%</span>
                            <span className="text-[8px] text-slate-400 uppercase">Used</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-[10px]">
                        <div className="flex justify-between"><span>Total Budget Limit:</span> <span className="text-white font-bold font-mono">₹{budgetLimit.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Total Active Spends:</span> <span className="text-blue-400 font-bold font-mono">₹{marketingSpendTotal.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Remaining Reserves:</span> <span className="text-emerald-450 text-emerald-400 font-bold font-mono">₹{(budgetLimit - marketingSpendTotal).toLocaleString()}</span></div>
                      </div>
                    </div>

                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 col-span-2">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Budget Spends Analysis by Channel</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={displayBudgetBreakdownData}>
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
                        <div className="text-2xl font-bold text-white mt-1 font-mono">{filteredLeads.length}</div>
                      </div>
                      <div className="p-4 bg-[#0e1628] rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">High Quality (MQL)</span>
                        <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{highQualityCount}</div>
                        <span className="text-[9px] text-slate-500 font-semibold block mt-1">
                          {filteredLeads.length > 0 ? Math.round((highQualityCount / filteredLeads.length) * 100) : 0}% Conversion Rate
                        </span>
                      </div>
                      <div className="p-4 bg-[#0e1628] rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Medium Quality</span>
                        <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">{mediumQualityCount}</div>
                        <span className="text-[9px] text-slate-500 font-semibold block mt-1">
                          {filteredLeads.length > 0 ? Math.round((mediumQualityCount / filteredLeads.length) * 100) : 0}% Qualified Rate
                        </span>
                      </div>
                      <div className="p-4 bg-[#0e1628] rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Low Quality / Junk</span>
                        <div className="text-2xl font-bold text-red-400 mt-1 font-mono">{lowQualityCount}</div>
                        <span className="text-[9px] text-slate-500 font-semibold block mt-1">
                          {filteredLeads.length > 0 ? Math.round((lowQualityCount / filteredLeads.length) * 100) : 0}% Disqualified Rate
                        </span>
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
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Competitor Organic Traffic Share</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={competitorShareData}>
                            <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                            <YAxis stroke="#64748B" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: "#0E1726" }} />
                            <Bar dataKey="traffic" fill="#10B981" radius={[4, 4, 0, 0]}>
                              {competitorShareData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? "#3B82F6" : "#64748B"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Keyword Gap Overlaps</h4>
                      <div className="space-y-3">
                        {keywordGaps.map((gap, idx) => (
                          <div key={idx} className="p-3 bg-[#0e1628] border border-slate-800 rounded-lg flex justify-between items-center text-xs">
                            <div>
                              <span className="font-semibold text-white">{gap.kw}</span>
                              <div className="text-[9px] text-slate-400 mt-0.5">
                                BuildWell rank: #{Math.round(gap.ourRank)} | {gap.competitorName} rank: #{Math.round(gap.theirRank)}
                              </div>
                            </div>
                            <span className={`${gap.priorityColor} font-semibold text-[10px]`}>{gap.priorityText}</span>
                          </div>
                        ))}
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

                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 h-[450px] overflow-y-auto">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Automated Insights & Recommendations</h4>
                      <div className="space-y-3 text-xs">
                        {[
                          { type: "Opportunity", text: aiInsightOpp, color: "text-emerald-400", border: "border-emerald-500/20 bg-emerald-500/5" },
                          { type: "Critical Alert", text: aiInsightAlert, color: "text-blue-400", border: "border-blue-500/20 bg-blue-500/5" },
                          { type: "Weekly Diagnosis", text: aiInsightDiag, color: "text-purple-400", border: "border-purple-500/20 bg-purple-500/5" }
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
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      
                      {/* Section 1: Profile Details */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">Profile Details</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Full Name</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formProfileName} onChange={(e) => setFormProfileName(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Email</label>
                            <input type="email" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formProfileEmail} onChange={(e) => setFormProfileEmail(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Avatar Initials</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formAvatarInitials} onChange={(e) => setFormAvatarInitials(e.target.value)} maxLength={2} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Header Date Filter Range</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formHeaderDate} onChange={(e) => setFormHeaderDate(e.target.value)} required />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Card Baselines */}
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">Card Baselines & Comparison</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Baseline Leads</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formBaselineLeads} onChange={(e) => setFormBaselineLeads(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Baseline Qualified</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formBaselineQualified} onChange={(e) => setFormBaselineQualified(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Baseline Spend (₹)</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formBaselineSpend} onChange={(e) => setFormBaselineSpend(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Baseline CPL (₹)</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formBaselineCpl} onChange={(e) => setFormBaselineCpl(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Baseline ROI (X)</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formBaselineRoi} onChange={(e) => setFormBaselineRoi(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Comparison Timeframe</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formBaselineCompareDate} onChange={(e) => setFormBaselineCompareDate(e.target.value)} required />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: AI Recommendations & Insights */}
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">AI Insights Texts</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Recommendation Banner</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formAiInsightRec} onChange={(e) => setFormAiInsightRec(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Opportunity Insight</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formAiInsightOpp} onChange={(e) => setFormAiInsightOpp(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Critical Alert Insight</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formAiInsightAlert} onChange={(e) => setFormAiInsightAlert(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Weekly Diagnosis Insight</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formAiInsightDiag} onChange={(e) => setFormAiInsightDiag(e.target.value)} required />
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Content Calendar Setup */}
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">Content Calendar Setup</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Calendar Header Title</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formCalendarHeader} onChange={(e) => setFormCalendarHeader(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Date Input Label</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formCalendarDateLabel} onChange={(e) => setFormCalendarDateLabel(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Start Day Empty Grid Cells (0-6)</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formCalendarEmptyCells} onChange={(e) => setFormCalendarEmptyCells(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Total Days in Month</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formCalendarTotalDays} onChange={(e) => setFormCalendarTotalDays(e.target.value)} required />
                          </div>
                        </div>
                      </div>

                      {/* Section 5: SEO Stats Sub-labels */}
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">SEO Stats Sub-labels</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Traffic Trend Label</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formSeoTrafficSub} onChange={(e) => setFormSeoTrafficSub(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Keywords Trend Label</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formSeoKeywordsSub} onChange={(e) => setFormSeoKeywordsSub(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Top 10 Keywords Trend Label</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formSeoTop10Sub} onChange={(e) => setFormSeoTop10Sub(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Domain Authority Trend Label</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formSeoAuthoritySub} onChange={(e) => setFormSeoAuthoritySub(e.target.value)} required />
                          </div>
                        </div>
                      </div>

                      {/* Section 6: Competitor Keyword Mapping */}
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">Competitor Keyword Mapping</h4>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Mapping rules (e.g. keyword:Competitor|keyword:Competitor)</label>
                          <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formCompetitorMapping} onChange={(e) => setFormCompetitorMapping(e.target.value)} required />
                        </div>
                      </div>

                      {/* Section 7: Alert Limits and Shell Menus */}
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">Alert Limits & Menus</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Lead Scoring min threshold</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formLeadScoringMin} onChange={(e) => setFormLeadScoringMin(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">MQL alert spikes threshold</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formAlertThreshold} onChange={(e) => setFormAlertThreshold(e.target.value)} required />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-2 text-xs">
                          <label className="flex items-center gap-2 text-slate-350 cursor-pointer">
                            <input type="checkbox" checked={formNotificationEmails} onChange={(e) => setFormNotificationEmails(e.target.checked)} className="h-4 w-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500" />
                            Receive instant updates on daily MQL spikes
                          </label>
                          <label className="flex items-center gap-2 text-slate-350 cursor-pointer">
                            <input type="checkbox" checked={formWeeklyReports} onChange={(e) => setFormWeeklyReports(e.target.checked)} className="h-4 w-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500" />
                            Receive campaign ROI diagnostic reports directly
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">Shell Menus & ChatGPT Prompts</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Sidebar Menu Items (Separated by |)</label>
                            <input type="text" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formSidebarMenus} onChange={(e) => setFormSidebarMenus(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">AI Chat Suggestions (Separated by |)</label>
                            <textarea className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500 h-16" value={formAiSuggestions} onChange={(e) => setFormAiSuggestions(e.target.value)} required />
                          </div>
                        </div>
                      </div>

                      {/* Section: Social Media Performance Metrics */}
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">Social Media Channels Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Instagram Followers</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formIgFollowers} onChange={(e) => setFormIgFollowers(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Instagram Growth (%)</label>
                            <input type="number" step="0.1" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formIgGrowth} onChange={(e) => setFormIgGrowth(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Instagram Engagement (%)</label>
                            <input type="number" step="0.1" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formIgEng} onChange={(e) => setFormIgEng(e.target.value)} required />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Facebook Followers</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formFbFollowers} onChange={(e) => setFormFbFollowers(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Facebook Growth (%)</label>
                            <input type="number" step="0.1" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formFbGrowth} onChange={(e) => setFormFbGrowth(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Facebook Engagement (%)</label>
                            <input type="number" step="0.1" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formFbEng} onChange={(e) => setFormFbEng(e.target.value)} required />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">LinkedIn Followers</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formLiFollowers} onChange={(e) => setFormLiFollowers(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">LinkedIn Growth (%)</label>
                            <input type="number" step="0.1" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formLiGrowth} onChange={(e) => setFormLiGrowth(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">LinkedIn Engagement (%)</label>
                            <input type="number" step="0.1" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formLiEng} onChange={(e) => setFormLiEng(e.target.value)} required />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">YouTube Followers</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formYtFollowers} onChange={(e) => setFormYtFollowers(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">YouTube Growth (%)</label>
                            <input type="number" step="0.1" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formYtGrowth} onChange={(e) => setFormYtGrowth(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">YouTube Engagement (%)</label>
                            <input type="number" step="0.1" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formYtEng} onChange={(e) => setFormYtEng(e.target.value)} required />
                          </div>
                        </div>
                      </div>

                      {/* Section: Competitors Traffic Stats */}
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">Competitors Traffic Volume</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Competitor A Traffic</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formCompATraffic} onChange={(e) => setFormCompATraffic(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Competitor B Traffic</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formCompBTraffic} onChange={(e) => setFormCompBTraffic(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Competitor C Traffic</label>
                            <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formCompCTraffic} onChange={(e) => setFormCompCTraffic(e.target.value)} required />
                          </div>
                        </div>
                      </div>

                      {/* Section: Marketing Budget Summary */}
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans border-b border-slate-800 pb-2">Marketing Budget Limit Summary</h4>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Total Budget Limit (₹)</label>
                          <input type="number" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={formBudgetLimit} onChange={(e) => setFormBudgetLimit(e.target.value)} required />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-850">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg text-xs shadow-md transition"
                        >
                          Save Settings & Shell Config
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Section 9: Dynamic Lists Management Container */}
                  <div className="space-y-6 max-w-4xl mt-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Dynamic Dashboard Lists</h3>
                    
                    {/* 1. Team Members Management */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Manage Team Members</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-800">
                              <th className="pb-2">Avatar</th>
                              <th className="pb-2">Name</th>
                              <th className="pb-2">Role</th>
                              <th className="pb-2">Tasks Assigned</th>
                              <th className="pb-2">Tasks Completed</th>
                              <th className="pb-2">Leads Generated</th>
                              <th className="pb-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {teamMembers.map(tm => (
                              <tr key={tm.id} className="hover:bg-slate-800/20 text-slate-300 animate-fadeIn">
                                <td className="py-2">
                                  <div className="h-7 w-7 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                                    {tm.avatar}
                                  </div>
                                </td>
                                <td className="py-2 font-semibold text-slate-100">{tm.name}</td>
                                <td className="py-2">{tm.role}</td>
                                <td className="py-2 font-mono">{tm.tasksAssigned}</td>
                                <td className="py-2 font-mono">{tm.tasksCompleted}</td>
                                <td className="py-2 font-mono">{tm.leadsGenerated}</td>
                                <td className="py-2">
                                  <button onClick={() => handleDeleteTeamMember(Number(tm.id))} className="text-red-400 hover:text-red-300 hover:underline">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {teamMembers.length === 0 && (
                              <tr>
                                <td colSpan={7} className="py-4 text-center text-slate-500 italic">No team members loaded. Add one below.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      <form onSubmit={handleAddTeamMember} className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-[#0a1120]/50 p-3 rounded-lg border border-slate-850">
                        <div>
                          <input type="text" placeholder="Name" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} required />
                        </div>
                        <div>
                          <input type="text" placeholder="Role (e.g. Executive)" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newTeamRole} onChange={(e) => setNewTeamRole(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="Tasks Assigned" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newTeamTasks} onChange={(e) => setNewTeamTasks(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="Completed" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newTeamCompleted} onChange={(e) => setNewTeamCompleted(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="Leads" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newTeamLeads} onChange={(e) => setNewTeamLeads(e.target.value)} required />
                        </div>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Initials (e.g. RM)" className="w-16 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newTeamAvatar} onChange={(e) => setNewTeamAvatar(e.target.value)} maxLength={2} />
                          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-lg text-xs flex items-center justify-center grow">
                            <Plus className="h-4 w-4" /> Add
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* 2. SEO Keywords Management */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Manage SEO Keywords</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-800">
                              <th className="pb-2">Keyword</th>
                              <th className="pb-2">SERP Position</th>
                              <th className="pb-2">Monthly Volume</th>
                              <th className="pb-2">Rank Direction</th>
                              <th className="pb-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {seoKeywords.map((kw, idx) => (
                              <tr key={idx} className="hover:bg-slate-800/20 text-slate-300 animate-fadeIn">
                                <td className="py-2 font-semibold text-slate-100">{kw.kw}</td>
                                <td className="py-2 font-mono font-semibold">{kw.pos}</td>
                                <td className="py-2 font-mono">{Number(kw.vol).toLocaleString()}</td>
                                <td className="py-2 font-semibold text-emerald-400">{kw.dir}</td>
                                <td className="py-2">
                                  <button onClick={() => handleDeleteSeoKeyword(kw.kw)} className="text-red-400 hover:text-red-300 hover:underline">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {seoKeywords.length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-4 text-center text-slate-500 italic">No search keywords loaded. Add one below.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      <form onSubmit={handleAddSeoKeyword} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-[#0a1120]/50 p-3 rounded-lg border border-slate-850">
                        <div className="md:col-span-2">
                          <input type="text" placeholder="Keyword Search Term" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newSeoKw} onChange={(e) => setNewSeoKw(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="SERP Position (e.g. 1)" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newSeoPos} onChange={(e) => setNewSeoPos(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="Monthly Volume" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newSeoVol} onChange={(e) => setNewSeoVol(e.target.value)} required />
                        </div>
                        <div className="flex gap-2">
                          <input type="number" placeholder="Direction (+/-)" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newSeoDir} onChange={(e) => setNewSeoDir(e.target.value)} required />
                          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-lg text-xs flex items-center justify-center shrink-0">
                            <Plus className="h-4 w-4" /> Add
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* 3. Competitor Keyword Gaps */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Manage Competitor Gaps</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-800">
                              <th className="pb-2">Keyword Gap</th>
                              <th className="pb-2">Our Rank</th>
                              <th className="pb-2">Their Rank</th>
                              <th className="pb-2">Competitor</th>
                              <th className="pb-2">Priority Tier</th>
                              <th className="pb-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {keywordGaps.map((gap, idx) => (
                              <tr key={idx} className="hover:bg-slate-800/20 text-slate-300 animate-fadeIn">
                                <td className="py-2 font-semibold text-slate-100">{gap.kw}</td>
                                <td className="py-2 font-mono">Rank {gap.ourRank}</td>
                                <td className="py-2 font-mono">Rank {gap.theirRank}</td>
                                <td className="py-2 font-semibold text-yellow-400">{gap.competitorName}</td>
                                <td className="py-2"><span className={`font-semibold ${gap.priorityColor}`}>{gap.priorityText}</span></td>
                                <td className="py-2">
                                  <button onClick={() => handleDeleteCompetitorGap(gap.kw)} className="text-red-400 hover:text-red-300 hover:underline">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {keywordGaps.length === 0 && (
                              <tr>
                                <td colSpan={6} className="py-4 text-center text-slate-500 italic">No competitor gaps loaded. Add one below.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      <form onSubmit={handleAddCompetitorGap} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-[#0a1120]/50 p-3 rounded-lg border border-slate-850">
                        <div className="md:col-span-2">
                          <input type="text" placeholder="Gap Keyword Term" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newGapKw} onChange={(e) => setNewGapKw(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="Our Rank" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newGapOur} onChange={(e) => setNewGapOur(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="Their Rank" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newGapTheir} onChange={(e) => setNewGapTheir(e.target.value)} required />
                        </div>
                        <div className="flex gap-2">
                          <select className="bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500 grow" value={newGapPriority} onChange={(e) => setNewGapPriority(e.target.value)}>
                            <option value="0">Normal Priority</option>
                            <option value="1">High Gap Priority</option>
                            <option value="2">Market Dominance</option>
                          </select>
                          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-lg text-xs flex items-center justify-center shrink-0">
                            <Plus className="h-4 w-4" /> Add
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* 4. Marketing Budget Breakdown */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Manage Budget Categories</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-800">
                              <th className="pb-2">Budget Category</th>
                              <th className="pb-2">Allocated Budget (₹)</th>
                              <th className="pb-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {budgetBreakdownData.map((b, idx) => (
                              <tr key={idx} className="hover:bg-slate-800/20 text-slate-300 animate-fadeIn">
                                <td className="py-2 font-semibold text-slate-100">{b.name}</td>
                                <td className="py-2 font-mono font-semibold">₹{Number(b.value).toLocaleString()}</td>
                                <td className="py-2">
                                  <button onClick={() => handleDeleteBudgetCategory(Number(metrics.find(m => m.label === b.name && m.category === "tl_budget_breakdown")?.id))} className="text-red-400 hover:text-red-300 hover:underline">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {budgetBreakdownData.length === 0 && (
                              <tr>
                                <td colSpan={3} className="py-4 text-center text-slate-500 italic">No budget allocations loaded. Add one below.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      <form onSubmit={handleAddBudgetCategory} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0a1120]/50 p-3 rounded-lg border border-slate-850">
                        <div>
                          <input type="text" placeholder="Category Name (e.g. Google Ads)" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newBudgetCat} onChange={(e) => setNewBudgetCat(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="Allocated Amount" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newBudgetVal} onChange={(e) => setNewBudgetVal(e.target.value)} required />
                        </div>
                        <div>
                          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-lg text-xs flex items-center justify-center w-full">
                            <Plus className="h-4 w-4" /> Add Allocation
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* 5. Lead Trends Graph Points */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Manage Leads Graph Trends</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-800">
                              <th className="pb-2">Timeframe Label (X-Axis)</th>
                              <th className="pb-2">Total Leads</th>
                              <th className="pb-2">Qualified Leads</th>
                              <th className="pb-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {leadTrendData.map((pt, idx) => (
                              <tr key={idx} className="hover:bg-slate-800/20 text-slate-300 animate-fadeIn">
                                <td className="py-2 font-semibold text-slate-100">{pt.m}</td>
                                <td className="py-2 font-mono">{pt.Leads}</td>
                                <td className="py-2 font-mono text-emerald-400 font-semibold">{pt.Qualified}</td>
                                <td className="py-2">
                                  <button onClick={() => handleDeleteTrendPoint(Number(trends.find(t => t.label === pt.m)?.id))} className="text-red-400 hover:text-red-300 hover:underline">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {leadTrendData.length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-4 text-center text-slate-500 italic">No trend points loaded. Add one below.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      <form onSubmit={handleAddTrendPoint} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#0a1120]/50 p-3 rounded-lg border border-slate-850">
                        <div>
                          <input type="text" placeholder="Label (e.g. 15 May)" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newTrendLabel} onChange={(e) => setNewTrendLabel(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="Total Leads" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newTrendLeads} onChange={(e) => setNewTrendLeads(e.target.value)} required />
                        </div>
                        <div>
                          <input type="number" placeholder="Qualified Leads" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" value={newTrendQualified} onChange={(e) => setNewTrendQualified(e.target.value)} required />
                        </div>
                        <div>
                          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-lg text-xs flex items-center justify-center w-full">
                            <Plus className="h-4 w-4" /> Add Trend Point
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* 6. Content Calendar Events */}
                    <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Manage Content Calendar Events</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-800">
                              <th className="pb-2">Event Title</th>
                              <th className="pb-2">Date (Day of Month)</th>
                              <th className="pb-2">Channel</th>
                              <th className="pb-2">Status</th>
                              <th className="pb-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {calendarEvents.map(evt => (
                              <tr key={evt.id} className="hover:bg-slate-800/20 text-slate-300 animate-fadeIn">
                                <td className="py-2 font-semibold text-slate-100">{evt.title}</td>
                                <td className="py-2 font-mono">Day {evt.date}</td>
                                <td className="py-2">{evt.channel}</td>
                                <td className="py-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    evt.status === "Published" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                    evt.status === "Scheduled" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                  }`}>
                                    {evt.status}
                                  </span>
                                </td>
                                <td className="py-2">
                                  <button onClick={() => handleDeleteCalendarEvent(String(evt.id))} className="text-red-400 hover:text-red-300 hover:underline">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {calendarEvents.length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-4 text-center text-slate-500 italic">No calendar events loaded. Create one in the Content Calendar tab.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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
