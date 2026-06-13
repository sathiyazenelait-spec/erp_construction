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
  status: "Completed" | "Pending";
}

export default function SalesExecutiveDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard Overview");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("28 May 2025, Thursday");

  // --- 02. MY LEADS STATES ---
  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "Mr. Ramesh", source: "Google Ads", projectType: "Villa", location: "Chennai", budget: "₹60 L", status: "Hot", addedOn: "28 May 2025" },
    { id: "2", name: "Mr. Suresh", source: "Website", projectType: "Apartment", location: "OMR", budget: "₹48 L", status: "Warm", addedOn: "28 May 2025" },
    { id: "3", name: "ABC Developers", source: "Referral", projectType: "Commercial", location: "ECR", budget: "₹2 Cr", status: "Hot", addedOn: "27 May 2025" },
    { id: "4", name: "Mrs. Kavitha", source: "Instagram", projectType: "Villa", location: "ECR", budget: "₹75 L", status: "Warm", addedOn: "27 May 2025" },
    { id: "5", name: "Mr. Dinesh", source: "Facebook Ads", projectType: "Villa", location: "Tambaram", budget: "₹55 L", status: "Cold", addedOn: "26 May 2025" },
    { id: "6", name: "Mr. Prakash", source: "Google Ads", projectType: "Villa", location: "Chennai", budget: "₹90 L", status: "Hot", addedOn: "26 May 2025" },
    { id: "7", name: "Mr. Vivek", source: "Referral", projectType: "Villa", location: "Velachery", budget: "₹80 L", status: "Cold", addedOn: "25 May 2025" },
    { id: "8", name: "Mr. Karthik", source: "Website", projectType: "Commercial", location: "ECR", budget: "₹1.5 Cr", status: "Hot", addedOn: "25 May 2025" },
  ]);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadBudget, setNewLeadBudget] = useState("₹60 L");
  const [newLeadProj, setNewLeadProj] = useState("Villa");

  // --- 03. LEAD QUALIFICATION FORM STATE ---
  const [qualification, setQualification] = useState({
    leadName: "Mr. Ramesh",
    source: "Google Ads",
    projectType: "Villa Construction",
    location: "Chennai - Anna Nagar",
    budget: "₹60,00,000",
    timeline: "Within 6 Months",
    plotSize: "2400 Sq.Ft",
    floors: "G+1",
    requirements: "4 BHK, Modern Design",
    budgetFit: "Yes",
    decisionMaker: "Mr. Ramesh",
    timelineFit: "Yes",
    requirementClarity: "High",
    competition: "2 Companies",
    leadScore: 4,
    qualifiedStatus: "Hot Lead",
    remarks: "Interested in modern elevation and interior package."
  });

  // --- 05. PROPOSAL TRACKER STATES ---
  const [proposals, setProposals] = useState<Proposal[]>([
    { id: "1", leadName: "Mr. Ramesh", proposalNo: "BW/25-26/017", amount: "₹62,45,000", sentOn: "28 May 2025", status: "Under Review" },
    { id: "2", leadName: "Mr. Suresh", proposalNo: "BW/25-26/016", amount: "₹46,80,000", sentOn: "28 May 2025", status: "Negotiation" },
    { id: "3", leadName: "ABC Developers", proposalNo: "BW/25-26/015", amount: "₹2,15,00,000", sentOn: "27 May 2025", status: "Under Review" },
    { id: "4", leadName: "Mrs. Kavitha", proposalNo: "BW/25-26/014", amount: "₹72,30,000", sentOn: "26 May 2025", status: "Approved" },
    { id: "5", leadName: "Mr. Dinesh", proposalNo: "BW/25-26/013", amount: "₹58,20,000", sentOn: "26 May 2025", status: "Rejected" },
    { id: "6", leadName: "Mr. Prakash", proposalNo: "BW/25-26/012", amount: "₹41,50,000", sentOn: "25 May 2025", status: "Negotiation" },
  ]);

  // --- 06. CLIENT COMMUNICATION CHAT STATES ---
  const [chats, setChats] = useState<ClientChat[]>([
    {
      id: "1",
      name: "Mr. Ramesh",
      latest: "Thanks for the proposal...",
      time: "11:20 AM",
      unread: true,
      messages: [
        { id: "1", sender: "client", text: "Thanks for the proposal...", time: "11:20 AM" },
        { id: "2", sender: "executive", text: "Please let me know if you need any modifications.", time: "11:22 AM" },
        { id: "3", sender: "client", text: "Looks good. When can we schedule a site visit?", time: "11:30 AM" },
        { id: "4", sender: "executive", text: "Shall we fix it for tomorrow 11 AM?", time: "11:32 AM" },
      ]
    },
    { id: "2", name: "Mr. Suresh", latest: "Please share structural layouts.", time: "10:05 AM", unread: false, messages: [] },
    { id: "3", name: "Mrs. Kavitha", latest: "When can we visit the site?", time: "Yesterday", unread: false, messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState("1");
  const [chatInput, setChatInput] = useState("");

  // --- 09. DAILY ACTIVITY LOGS ---
  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: "1", activity: "Call", leadName: "Mr. Ramesh", type: "Call", time: "10:00 AM", status: "Completed" },
    { id: "2", activity: "Site Visit", leadName: "Mr. Suresh", type: "Visit", time: "12:00 PM", status: "Completed" },
    { id: "3", activity: "Meeting", leadName: "ABC Developers", type: "Meeting", time: "03:00 PM", status: "Completed" },
    { id: "4", activity: "Proposal Sent", leadName: "Mrs. Kavitha", type: "Proposal", time: "04:30 PM", status: "Completed" },
    { id: "5", activity: "Follow-up", leadName: "Mr. Dinesh", type: "WhatsApp", time: "05:30 PM", status: "Pending" },
  ]);

  // --- AI SALES ASSISTANT STATES ---
  const [aiAssistantTab, setAiAssistantTab] = useState<"Smart Insights" | "Lead Scoring" | "Next Best Action" | "Prediction">("Smart Insights");
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiMessages, setAiMessages] = useState<string[]>([
    "Mr. Ramesh is Highly Interested and likely to convert.",
    "Follow-up with ABC Developers within 2 days.",
    "Villa projects have higher conversion this month.",
    "You can achieve your monthly target if you close 2 more deals."
  ]);

  // --- REVENUE TRACKER DATA ---
  const revenueChartData = [
    { name: "Week 1", Target: 20, Achieved: 15 },
    { name: "Week 2", Target: 45, Achieved: 38 },
    { name: "Week 3", Target: 70, Achieved: 58 },
    { name: "Week 4", Target: 90, Achieved: 68 },
    { name: "Week 5", Target: 100, Achieved: 72.5 },
  ];

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
  const handleAddNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;
    const item: Lead = {
      id: Date.now().toString(),
      name: newLeadName,
      source: "Manual",
      projectType: newLeadProj,
      location: "Chennai",
      budget: newLeadBudget,
      status: "Hot",
      addedOn: "28 May 2025"
    };
    setLeads([item, ...leads]);
    setNewLeadName("");
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
              AK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Arjun Kumar</div>
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
            <p className="text-[10px] text-slate-400 mt-0.5">Welcome, Arjun! Track active leads, close estimations, and optimize target conversions.</p>
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
                <option value="Commercial Hub">Commercial Hub</option>
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

          {/* 01. DASHBOARD OVERVIEW */}
          {activeTab === "Dashboard Overview" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-4 text-xs">
                {[
                  { label: "Total Leads", val: "125", sub: "Month to date" },
                  { label: "Won Deals", val: "4", sub: "This month closed" },
                  { label: "Revenue Achieved", val: "₹72.5 L", sub: "Against target" },
                  { label: "Conversion Rate", val: "3.2%", sub: "Leads to sales" }
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
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: "Hot", value: 32, color: "#EF4444" },
                          { name: "Warm", value: 58, color: "#F59E0B" },
                          { name: "Cold", value: 35, color: "#3B82F6" }
                        ]} dataKey="value" innerRadius={28} outerRadius={46}>
                          <Cell fill="#EF4444" />
                          <Cell fill="#F59E0B" />
                          <Cell fill="#3B82F6" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-white font-mono">125</span>
                      <span className="text-[8px] text-slate-400 uppercase">Leads</span>
                    </div>
                  </div>
                </div>

                {/* Follow up schedules */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-3">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Upcoming Follow-ups</h3>
                  {[
                    { name: "Mr. Ramesh", time: "Today, 10:00 AM", type: "Call" },
                    { name: "Mr. Suresh", time: "Today, 04:00 PM", type: "Meeting" },
                    { name: "Mrs. Kavitha", time: "Tomorrow, 11:00 AM", type: "Site Visit" }
                  ].map((f, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-3 bg-[#0e1628] border border-slate-850 rounded-xl">
                      <div>
                        <div className="font-bold text-white">{f.name}</div>
                        <div className="text-[9px] text-slate-450 mt-0.5">{f.time}</div>
                      </div>
                      <span className="text-[10px] text-blue-400 font-bold border border-blue-500/20 px-2 py-0.5 rounded bg-blue-500/5">{f.type}</span>
                    </div>
                  ))}
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
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/10 transition">
                        <td className="p-4 font-bold text-white">{l.name}</td>
                        <td className="p-4 text-slate-350">{l.source}</td>
                        <td className="p-4 text-slate-350">{l.projectType}</td>
                        <td className="p-4 text-slate-400">{l.location}</td>
                        <td className="p-4 font-mono font-bold text-white">{l.budget}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                            l.status === "Hot" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            l.status === "Warm" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>{l.status}</span>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => setLeads(leads.filter(x => x.id !== l.id))} className="text-red-400 hover:text-red-300 p-1">
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

          {/* 03. LEAD QUALIFICATION */}
          {activeTab === "Lead Qualification" && (
            <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
              {/* Lead Details */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Lead Details</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400">Lead Name</label>
                    <div className="font-bold text-white mt-1">{qualification.leadName}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Source</label>
                    <div className="font-bold text-white mt-1">{qualification.source}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Location</label>
                    <div className="font-bold text-white mt-1">{qualification.location}</div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Budget</label>
                    <div className="font-bold text-white mt-1">{qualification.budget}</div>
                  </div>
                </div>
              </div>

              {/* Qualification Details form */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Qualification Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Budget Fit</span>
                    <select className="bg-[#0a1120] text-slate-100 border border-slate-850 p-1.5 rounded-md w-28 outline-none">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Decision Maker</span>
                    <input type="text" defaultValue={qualification.decisionMaker} className="bg-[#0a1120] text-slate-100 border border-slate-850 p-1.5 rounded-md w-28 text-center outline-none" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Timeline Fit</span>
                    <select className="bg-[#0a1120] text-slate-100 border border-slate-850 p-1.5 rounded-md w-28 outline-none">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <button onClick={() => alert("Lead Qualified!")} className="w-full bg-blue-650 hover:bg-blue-600 bg-blue-600 hover:bg-blue-550 text-white font-bold py-2 rounded-lg text-xs transition mt-2">
                    Save & Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 04. FOLLOW-UP CENTER */}
          {activeTab === "Follow-up Center" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-5 gap-4 text-center">
                {[
                  { label: "Pending Follow-ups", val: "18" },
                  { label: "Today's Follow-ups", val: "6" },
                  { label: "Negotiations", val: "3" },
                  { label: "Approved", val: "3" },
                  { label: "Rejected", val: "2" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 05. PROPOSAL TRACKER */}
          {activeTab === "Proposal Tracker" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 bg-[#0e1628]/40">
                      <th className="p-4">Lead Name</th>
                      <th className="p-4">Proposal No.</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Sent On</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {proposals.map((p) => (
                      <tr key={p.id}>
                        <td className="p-4 font-bold text-white">{p.leadName}</td>
                        <td className="p-4 text-slate-350">{p.proposalNo}</td>
                        <td className="p-4 font-mono font-bold text-white">{p.amount}</td>
                        <td className="p-4 font-mono text-slate-400">{p.sentOn}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            p.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" :
                            p.status === "Rejected" ? "bg-red-500/10 text-red-400" :
                            "bg-blue-500/10 text-blue-400"
                          }`}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              </div>

              {/* Chat View */}
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                  {currentChat?.messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "executive" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-xl max-w-xs text-xs ${
                        m.sender === "executive" ? "bg-blue-600 text-white" : "bg-[#0e1628] text-slate-200 border border-slate-850"
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
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
                  <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition">
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
                  <div className="text-xl font-bold mt-1 font-mono text-white">₹3,75,00,000</div>
                </div>
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Expected Close</span>
                  <div className="text-xl font-bold mt-1 font-mono text-white">₹1,80,00,000</div>
                </div>
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Conversion Rate</span>
                  <div className="text-xl font-bold mt-1 font-mono text-white">22.22%</div>
                </div>
              </div>

              {/* Horizontal Pipe funnel nodes */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Pipeline by Stage</h3>
                <div className="grid grid-cols-6 gap-2 text-center text-xs">
                  {[
                    { stage: "New Lead", count: "125 Leads", bg: "bg-blue-600" },
                    { stage: "Qualified", count: "45 Leads", bg: "bg-indigo-600" },
                    { stage: "Site Visit", count: "18 Leads", bg: "bg-purple-650 bg-purple-600" },
                    { stage: "Proposal Sent", count: "12 Leads", bg: "bg-violet-600" },
                    { stage: "Negotiation", count: "6 Leads", bg: "bg-amber-600" },
                    { stage: "Won", count: "4 Leads", bg: "bg-emerald-600" }
                  ].map((x, idx) => (
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
                    <div className="flex justify-between"><span>Monthly Target:</span> <span className="font-bold text-white font-mono">₹1,00,00,000</span></div>
                    <div className="flex justify-between"><span>Achieved Revenue:</span> <span className="text-emerald-450 text-emerald-450 text-emerald-400 font-bold font-mono">₹72,50,000</span></div>
                    <div className="flex justify-between"><span>Achievement Rate:</span> <span className="text-blue-450 text-blue-450 text-blue-400 font-bold font-mono">72.5%</span></div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Revenue Growth Trend</h3>
                  <div className="h-64">
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
                  <div className="w-full bg-blue-600/20 border border-blue-500/30 p-2.5 rounded text-center text-xs font-bold font-mono">New Leads: 125 (100%)</div>
                  <div className="w-[85%] mx-auto bg-indigo-650/20 bg-indigo-600/20 border border-indigo-500/30 p-2.5 rounded text-center text-xs font-bold font-mono text-indigo-300">Qualified: 45 (36%)</div>
                  <div className="w-[70%] mx-auto bg-purple-650/20 bg-purple-600/20 border border-purple-500/30 p-2.5 rounded text-center text-xs font-bold font-mono text-purple-300">Site Visit: 18 (14%)</div>
                  <div className="w-[55%] mx-auto bg-violet-600/20 border border-violet-500/30 p-2.5 rounded text-center text-xs font-bold font-mono text-violet-300">Proposal: 12 (9.6%)</div>
                  <div className="w-[40%] mx-auto bg-emerald-600/20 border border-emerald-500/30 p-2.5 rounded text-center text-xs font-bold font-mono text-emerald-300">Won: 4 (3.2%)</div>
                </div>
              </div>

              {/* Conversion by channels */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Conversion Share by Channel</h3>
                <div className="h-64 flex flex-col justify-center items-center">
                  <div className="h-44 w-44 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: "Google Ads", value: 40, color: "#3B82F6" },
                          { name: "Website", value: 25, color: "#10B981" },
                          { name: "Referral", value: 20, color: "#F59E0B" },
                          { name: "Instagram", value: 10, color: "#EC4899" },
                          { name: "Facebook Ads", value: 5, color: "#06B6D4" }
                        ]} innerRadius={28} outerRadius={46}>
                          <Cell fill="#3B82F6" />
                          <Cell fill="#10B981" />
                          <Cell fill="#F59E0B" />
                          <Cell fill="#EC4899" />
                          <Cell fill="#06B6D4" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. DAILY ACTIVITY */}
          {activeTab === "Daily Activity" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-5 gap-4 text-center">
                {[
                  { label: "Calls Made", val: "22" },
                  { label: "Meetings", val: "5" },
                  { label: "Site Visits", val: "3" },
                  { label: "Proposals Sent", val: "2" },
                  { label: "Follow-ups", val: "18" }
                ].map((s, idx) => (
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
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Recommended Actions</h4>
                <div className="space-y-3 text-xs">
                  {[
                    "Call Mr. Ramesh - Hot Lead",
                    "Send revised proposal to ABC Developers within 2 days",
                    "Schedule site visit for Mr. Prakash",
                    "Send testimonial video links to Mrs. Kavitha"
                  ].map((act, i) => (
                    <div key={i} className="p-3 bg-[#0e1628] border border-slate-850 rounded-xl flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{act}</span>
                      <ChevronRight className="h-4 w-4 text-blue-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 12. SETTINGS */}
          {activeTab === "Settings" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                    <input type="text" defaultValue="Arjun Kumar" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                    <input type="text" defaultValue="arjun.sales@buildcon.com" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Phone</label>
                    <input type="text" defaultValue="+91 98765 43210" className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Role</label>
                    <input type="text" readOnly defaultValue="Sales Executive" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none bg-slate-900/10 cursor-not-allowed" />
                  </div>
                </div>
                <button onClick={() => alert("Profile saved successfully!")} className="bg-blue-650 hover:bg-blue-600 bg-blue-600 hover:bg-blue-550 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-md transition mt-4">Update Profile</button>
              </div>

              {/* Preferences */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Preferences</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span>SMS Notifications</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Email Notifications</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>WhatsApp Alerts</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13. CALENDAR VIEW */}
          {activeTab === "Calendar View" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-6 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">Sales Calendar Schedules</h3>
              <div className="grid grid-cols-7 gap-2 text-center text-slate-400 text-[10px] font-bold mb-3 uppercase tracking-wider">
                <div>Mon 26</div>
                <div>Tue 27</div>
                <div>Wed 28</div>
                <div>Thu 29</div>
                <div>Fri 30</div>
                <div>Sat 31</div>
                <div>Sun 01</div>
              </div>
              <div className="grid grid-cols-7 gap-3 min-h-[300px]">
                {/* 7 columns representing the week */}
                {[
                  { name: "26 Mon", events: [{ title: "Proposal Call Dinesh", time: "11:00 AM", type: "Call" }] },
                  { name: "27 Tue", events: [{ title: "ABC Meeting", time: "03:00 PM", type: "Meeting" }] },
                  { name: "28 Wed", events: [{ title: "Ramesh Proposal discuss", time: "10:30 AM", type: "Proposal" }, { title: "Suresh Site Visit", time: "12:00 PM", type: "Visit" }] },
                  { name: "29 Thu", events: [{ title: "WhatsApp follow-up cold leads", time: "04:30 PM", type: "WhatsApp" }] },
                  { name: "30 Fri", events: [] },
                  { name: "31 Sat", events: [] },
                  { name: "01 Sun", events: [] }
                ].map((col, idx) => (
                  <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 min-h-[140px] flex flex-col justify-between hover:border-blue-500 transition">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{col.name}</span>
                    <div className="space-y-2.5 mt-2 flex-1">
                      {col.events.map((evt, i) => (
                        <div key={i} className="text-[8.5px] p-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-semibold truncate leading-tight">
                          <div>{evt.time}</div>
                          <div className="text-white mt-0.5">{evt.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
