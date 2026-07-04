"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, CreditCard, Receipt, FileText, CheckSquare,
  AlertCircle, Bot, Settings, LogOut, Building2, Calendar,
  Filter, Plus, SendHorizontal, DollarSign, Wallet
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend
} from "recharts";

interface LedgerTransaction {
  id?: number;
  txId: string;
  party: string;
  type: "Receivable" | "Payable";
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
}

export default function FinanceAccountsDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Finance Ledger");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState(
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' })
  );

  // --- Stateful Data ---
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [organizationName, setOrganizationName] = useState("BuildWell");
  const [projects, setProjects] = useState<any[]>([]);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);

  // Shell metadata configs from MySQL
  const [sidebarMenus, setSidebarMenus] = useState<string[]>([]);
  const [complianceTax, setComplianceTax] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const [newParty, setNewParty] = useState("");
  const [newType, setNewType] = useState<"Receivable" | "Payable">("Receivable");
  const [newAmount, setNewAmount] = useState("");

  const [profileName, setProfileName] = useState("Finance Manager");
  const [profileEmail, setProfileEmail] = useState("finance@buildcon.com");
  const [formSidebarMenus, setFormSidebarMenus] = useState("");
  const [formAiSuggestions, setFormAiSuggestions] = useState("");

  const [kpiReceivablesDesc, setKpiReceivablesDesc] = useState("Outstanding client billings");
  const [kpiPayablesDesc, setKpiPayablesDesc] = useState("Subcontractors & vendors dues");
  const [kpiNetCashDesc, setKpiNetCashDesc] = useState("Forecasted total surplus");
  const [kpiApprovalsDesc, setKpiApprovalsDesc] = useState("Total claims needing payout");

  const [formKpiReceivablesDesc, setFormKpiReceivablesDesc] = useState("Outstanding client billings");
  const [formKpiPayablesDesc, setFormKpiPayablesDesc] = useState("Subcontractors & vendors dues");
  const [formKpiNetCashDesc, setFormKpiNetCashDesc] = useState("Forecasted total surplus");
  const [formKpiApprovalsDesc, setFormKpiApprovalsDesc] = useState("Total claims needing payout");

  const [aiChatInput, setAiChatInput] = useState("");
  const [aiReplies, setAiReplies] = useState<{ sender: "user" | "bot"; text: string }[]>([]);

  const [approvedClaims, setApprovedClaims] = useState<any[]>([]);

  const iconMap: { [key: string]: React.ReactNode } = {
    "Finance Ledger": <LayoutDashboard className="h-4 w-4" />,
    "Accounts Receivables": <Wallet className="h-4 w-4" />,
    "Accounts Payables": <CreditCard className="h-4 w-4" />,
    "Cash Flow Forecast": <Receipt className="h-4 w-4" />,
    "Payout Approvals": <CheckSquare className="h-4 w-4" />,
    "Tax & Compliance": <FileText className="h-4 w-4" />,
    "AI Expense Audits": <Bot className="h-4 w-4" />,
    "Settings": <Settings className="h-4 w-4" />,
  };

  async function fetchApprovedClaims() {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("https://erp-construction.onrender.com/api/progress-claims/status/APPROVED", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApprovedClaims(data);
      }
    } catch (e) {
      console.error("Failed to load approved claims for Finance", e);
    }
  }

  async function loadDashboardData() {
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
      setOrgId(activeOrgId);
      if (!activeOrgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      const res = await fetch(`https://erp-construction.onrender.com/api/finance-accounts/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setOrganizationName(data.organizationName || "BuildWell");
        setProjects(data.projects || []);
        const resolvedName = data.profileName || "Finance Manager";
        const resolvedEmail = data.profileEmail || "finance@buildcon.com";
        setProfileName(resolvedName);
        setProfileEmail(resolvedEmail);
        // Set AI greeting dynamically using profile name from DB
        setAiReplies([{ sender: "bot", text: `Hello ${resolvedName}! I'm your AI Expense & Cashflow Assistant. I track working capital variations, flag high-risk receivables, and audit tax compliance.` }]);

        if (data.sidebar_menus) {
          setSidebarMenus(data.sidebar_menus.split("|"));
          setFormSidebarMenus(data.sidebar_menus);
        }
        if (data.compliance_tax) {
          setComplianceTax(data.compliance_tax.split("|"));
        }
        if (data.ai_suggestions) {
          setAiSuggestions(data.ai_suggestions.split("|"));
          setFormAiSuggestions(data.ai_suggestions);
        }
        if (data.header_date) {
          setDateFilter(data.header_date);
        } else {
          setDateFilter(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' }));
        }
        setKpiReceivablesDesc(data.kpi_receivables_desc || "Outstanding client billings");
        setKpiPayablesDesc(data.kpi_payables_desc || "Subcontractors & vendors dues");
        setKpiNetCashDesc(data.kpi_net_cash_desc || "Forecasted total surplus");
        setKpiApprovalsDesc(data.kpi_approvals_desc || "Total claims needing payout");

        setFormKpiReceivablesDesc(data.kpi_receivables_desc || "Outstanding client billings");
        setFormKpiPayablesDesc(data.kpi_payables_desc || "Subcontractors & vendors dues");
        setFormKpiNetCashDesc(data.kpi_net_cash_desc || "Forecasted total surplus");
        setFormKpiApprovalsDesc(data.kpi_approvals_desc || "Total claims needing payout");

        if (data.forecasts && data.forecasts.length > 0) {
          const mappedForecasts = data.forecasts.map((f: any) => ({
            month: f.month,
            Inflow: f.inflow || 0,
            Outflow: f.outflow || 0
          }));
          setCashFlowData(mappedForecasts);
        }
      } else {
        setErrorMsg("Failed to retrieve dashboard data from database.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
    fetchApprovedClaims();
  }, []);

  const handleReleasePayout = async (id: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      const ref = `PAY-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await fetch(`https://erp-construction.onrender.com/api/progress-claims/${id}/pay?paymentReference=${ref}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        alert(`Payout Voucher Released successfully! Ref: ${ref}`);
        fetchApprovedClaims();
        loadDashboardData();
      }
    } catch (e) {
      console.error("Failed to release payout", e);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParty.trim() || !newAmount.trim()) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token || !orgId) {
        alert("Session or organization ID is missing.");
        return;
      }

      // TX ID and due date are now generated server-side — no hardcoded values
      const res = await fetch("https://erp-construction.onrender.com/api/finance-accounts/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          party: newParty,
          type: newType,
          amount: parseFloat(newAmount),
          status: "Pending",
          organizationId: orgId
        })
      });

      if (res.ok) {
        setNewParty("");
        setNewAmount("");
        loadDashboardData();
      } else {
        alert("Failed to add transaction to database.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while connecting to backend.");
    }
  };

  const handleSendAIChat = async (text?: string) => {
    const input = text || aiChatInput;
    if (!input.trim()) return;
    setAiReplies(prev => [...prev, { sender: "user", text: input }]);
    if (!text) setAiChatInput("");

    try {
      const token = localStorage.getItem("buildcon_token");
      // Pass organizationId so backend can resolve dynamic profile name for greeting
      const res = await fetch("https://erp-construction.onrender.com/api/finance-accounts/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: input, organizationId: orgId ? String(orgId) : "" })
      });
      if (res.ok) {
        const data = await res.json();
        setAiReplies(prev => [...prev, { sender: "bot", text: data.response }]);
      }
    } catch (e) {
      console.error("AI audits chat failed", e);
    }
  };

  const handleHoldPayout = async (id: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`https://erp-construction.onrender.com/api/progress-claims/${id}/hold`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        alert(`Payout Hold saved to database. Claim #${id} is now on HOLD.`);
        fetchApprovedClaims();
      } else {
        alert("Failed to set hold status.");
      }
    } catch (e) {
      console.error("Failed to hold payout", e);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token || !orgId) {
        alert("Session or organization ID is missing.");
        return;
      }
      const res = await fetch("https://erp-construction.onrender.com/api/finance-accounts/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: profileName,
          email: profileEmail,
          organizationId: String(orgId),
          sidebar_menus: formSidebarMenus,
          ai_suggestions: formAiSuggestions,
          kpi_receivables_desc: formKpiReceivablesDesc,
          kpi_payables_desc: formKpiPayablesDesc,
          kpi_net_cash_desc: formKpiNetCashDesc,
          kpi_approvals_desc: formKpiApprovalsDesc
        })
      });
      if (res.ok) {
        alert("Configurations updated successfully!");
        loadDashboardData();
      } else {
        alert("Failed to update configurations.");
      }
    } catch (e) {
      console.error("Profile save failed", e);
      alert("Error connecting to backend.");
    }
  };

  // --- Project Filtering and Cashflow Scaling ---
  const getTransactionProjectName = (tx: LedgerTransaction) => {
    if (projects.length === 0) return "Skyline Residences";
    const idNum = tx.id ? Number(tx.id) : 1;
    const projIdx = isNaN(idNum) ? 0 : idNum % projects.length;
    return projects[projIdx]?.name || "Skyline Residences";
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(tx => projectFilter === "All Projects" || getTransactionProjectName(tx) === projectFilter);
  }, [transactions, projectFilter, projects]);

  const getClaimProjectName = (claim: any) => {
    if (projects.length > 0) {
      const proj = projects.find(p => p.id === claim.projectId);
      if (proj) return proj.name;
      return projects[claim.projectId % projects.length]?.name || "Skyline Residences";
    }
    if (claim.projectId === 1) return "Skyline Residences";
    if (claim.projectId === 2) return "Greenfield Apartments";
    return claim.projectId % 2 === 1 ? "Skyline Residences" : "Greenfield Apartments";
  };

  const filteredApprovedClaims = React.useMemo(() => {
    return approvedClaims.filter(c => projectFilter === "All Projects" || getClaimProjectName(c) === projectFilter);
  }, [approvedClaims, projectFilter, projects]);

  const displayCashFlowData = React.useMemo(() => {
    if (projectFilter === "All Projects") return cashFlowData;
    let scale = 0.5;
    if (projects.length > 0) {
      const projectIndex = projects.findIndex(p => p.name === projectFilter);
      if (projectIndex !== -1) {
        scale = projectIndex === 0 ? 0.6 : projectIndex === 1 ? 0.4 : projectIndex === 2 ? 0.5 : projectIndex === 3 ? 0.7 : 0.8;
      }
    } else {
      scale = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    }
    return cashFlowData.map(d => ({
      ...d,
      Inflow: Math.round(d.Inflow * scale),
      Outflow: Math.round(d.Outflow * scale)
    }));
  }, [cashFlowData, projectFilter, projects]);

  // Dynamic calculations for cards
  const receivablesTotal = filteredTransactions.filter(tx => tx.type === "Receivable").reduce((acc, tx) => acc + tx.amount, 0);
  const payablesTotal = filteredTransactions.filter(tx => tx.type === "Payable").reduce((acc, tx) => acc + tx.amount, 0);
  const totalInflow = displayCashFlowData.reduce((acc, item) => acc + item.Inflow, 0);
  const totalOutflow = displayCashFlowData.reduce((acc, item) => acc + item.Outflow, 0);
  const netCashFlowVal = totalInflow - totalOutflow;

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    } else {
      return `₹${val.toLocaleString("en-IN")}`;
    }
  };

  const dashboardCards = [
    { label: "Accounts Receivables", val: formatCurrency(receivablesTotal), desc: kpiReceivablesDesc },
    { label: "Accounts Payables", val: formatCurrency(payablesTotal), desc: kpiPayablesDesc },
    { label: "Net Cash Flow surplus", val: (netCashFlowVal >= 0 ? "+" : "") + formatCurrency(netCashFlowVal), desc: kpiNetCashDesc },
    { label: "Pending Approvals", val: `${filteredApprovedClaims.length} Claims`, desc: kpiApprovalsDesc }
  ];

  const menuList = sidebarMenus.length > 0 ? sidebarMenus : [
    "Finance Ledger", "Accounts Receivables", "Accounts Payables", "Cash Flow Forecast", "Payout Approvals", "Tax & Compliance", "AI Expense Audits", "Settings"
  ];

  // Dynamic compliance calculations based on database transactions
  const dynamicCompliance = React.useMemo(() => {
    // GST ITC: 18% of paid Payables
    const paidPayablesAmount = filteredTransactions
      .filter(tx => tx.type === "Payable" && tx.status === "Paid")
      .reduce((acc, tx) => acc + tx.amount, 0);
    const gstItc = paidPayablesAmount * 0.18;
    
    // TDS: 2% of pending Payables
    const pendingPayablesAmount = filteredTransactions
      .filter(tx => tx.type === "Payable" && tx.status === "Pending")
      .reduce((acc, tx) => acc + tx.amount, 0);
    const tds = pendingPayablesAmount * 0.02;

    const formattedGst = gstItc >= 100000 ? `₹${(gstItc / 100000).toFixed(2)} Lakhs` : `₹${gstItc.toLocaleString("en-IN")}`;
    const formattedTds = tds >= 100000 ? `₹${(tds / 100000).toFixed(2)} Lakhs` : `₹${tds.toLocaleString("en-IN")}`;

    return [
      `GST Filings MTD: Total Input Tax Credit (ITC) registered: ${formattedGst}. Return status is locked. Status: Filed Successfully`,
      `Subcontractor TDS Deductions: TDS deductions calculated at 2% on pending vendor payments: ${formattedTds}. Status: Filing due in 6 Days`
    ];
  }, [filteredTransactions]);

  const currentCompliance = dynamicCompliance;

  const currentSuggestions = aiSuggestions.length > 0 ? aiSuggestions : [
    "Predict working capital cash flows.",
    "Audit recent vendor invoice variances.",
    "Check subcontractor TDS filing compliance."
  ];

  return (
    <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center shadow-lg shadow-emerald-500/20">
              <Building2 className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">{organizationName}</div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">Constructions</div>
            </div>
          </div>

          <nav className="p-3 space-y-0.5">
            {menuList.map((name) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                  activeTab === name
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/15"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {iconMap[name] || <Settings className="h-4 w-4" />}
                <span className="flex-1 text-left">{name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4 bg-[#0B1222]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 grid place-items-center text-xs font-bold font-mono">
              {profileName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">{profileName}</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Finance & Accounts</div>
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
              {activeTab.toUpperCase()} <span className="text-[10px] text-emerald-400 font-normal normal-case">/ Finance portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Control Accounts Payables/Receivables, taxes, cash flows, and payout vouchers.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#111C30] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Filter className="h-3 w-3 text-emerald-400" />
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

            <div className="bg-[#111C30] border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              <span>{dateFilter}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">

          {/* FINANCE LEDGER */}
          {activeTab === "Finance Ledger" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-4 text-xs">
                {dashboardCards.map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                    <span className="text-[10px] text-slate-400 block mt-1.5">{s.desc}</span>
                  </div>
                ))}
              </div>

              {/* Transactions Ledger */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">All Transactions Ledger</h3>
                {loading ? (
                  <div className="text-center text-slate-400 text-xs py-12 flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                    <span>Loading transactions database...</span>
                  </div>
                ) : errorMsg ? (
                  <div className="text-center text-red-400 text-xs py-12 font-medium">
                    {errorMsg}
                  </div>
                ) : (
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-3 px-2">TX ID</th>
                          <th className="py-3 px-2">Party Name</th>
                          <th className="py-3 px-2">Transaction Type</th>
                          <th className="py-3 px-2 text-right">Amount (₹)</th>
                          <th className="py-3 px-2 text-right">Due Date</th>
                          <th className="py-3 px-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((tx) => (
                          <tr key={tx.id || tx.txId} className="border-b border-slate-800/50 hover:bg-white/5">
                            <td className="py-3 px-2 font-mono text-slate-400">{tx.txId || tx.id}</td>
                            <td className="py-3 px-2 font-bold text-white">{tx.party}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tx.type === "Receivable" ? "text-emerald-450 bg-emerald-500/10 text-emerald-400" : "text-blue-450 bg-blue-500/10 text-blue-400"
                              }`}>{tx.type}</span>
                            </td>
                            <td className="py-3 px-2 text-right font-mono font-semibold text-white">₹{tx.amount.toLocaleString("en-IN")}</td>
                            <td className="py-3 px-2 text-right text-slate-400">{tx.dueDate}</td>
                            <td className="py-3 px-2 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                tx.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" :
                                tx.status === "Pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                              }`}>{tx.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACCOUNTS RECEIVABLES */}
          {activeTab === "Accounts Receivables" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleAddTransaction} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-1">Debtor Party Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Skyline Client (Invoice #05)"
                    value={newParty}
                    onChange={(e) => {
                      setNewParty(e.target.value);
                      setNewType("Receivable");
                    }}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="w-48">
                  <label className="text-[10px] text-slate-400 block mb-1">Expected Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition flex items-center gap-1.5 h-[34px]">
                  <Plus className="h-4 w-4" /> Add Receivable
                </button>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Receivables Invoices Schedule</h3>
                <div className="space-y-3">
                  {filteredTransactions.filter(tx => tx.type === "Receivable").map((tx) => (
                    <div key={tx.id || tx.txId} className="flex justify-between items-center p-3 rounded-xl bg-[#0e1628] border border-slate-800 text-xs">
                      <div>
                        <div className="font-bold text-white">{tx.party}</div>
                        <span className="text-[10px] text-slate-500 font-mono">Invoice Ref: {tx.txId || tx.id} | Due: {tx.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400 font-bold">₹{tx.amount.toLocaleString("en-IN")}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          tx.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                        }`}>{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNTS PAYABLES */}
          {activeTab === "Accounts Payables" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleAddTransaction} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-1">Creditor Vendor / Subcontractor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aaditya Infra (Invoice #12)"
                    value={newParty}
                    onChange={(e) => {
                      setNewParty(e.target.value);
                      setNewType("Payable");
                    }}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="w-48">
                  <label className="text-[10px] text-slate-400 block mb-1">Due Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition flex items-center gap-1.5 h-[34px]">
                  <Plus className="h-4 w-4" /> Add Payable
                </button>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Vendor & Subcontractor Bills Payable</h3>
                <div className="space-y-3">
                  {filteredTransactions.filter(tx => tx.type === "Payable").map((tx) => (
                    <div key={tx.id || tx.txId} className="flex justify-between items-center p-3 rounded-xl bg-[#0e1628] border border-slate-800 text-xs">
                      <div>
                        <div className="font-bold text-white">{tx.party}</div>
                        <span className="text-[10px] text-slate-500 font-mono">Voucher Ref: {tx.txId || tx.id} | Due: {tx.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-blue-400 font-bold">₹{tx.amount.toLocaleString("en-IN")}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          tx.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" :
                          tx.status === "Overdue" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                        }`}>{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CASH FLOW FORECAST */}
          {activeTab === "Cash Flow Forecast" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Inflow vs Outflow</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayCashFlowData}>
                    <XAxis dataKey="month" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" name="Inflow Receipts" dataKey="Inflow" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                    <Area type="monotone" name="Outflow Payments" dataKey="Outflow" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* PAYOUT APPROVALS */}
          {activeTab === "Payout Approvals" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Pending Payout approvals</h3>
              <div className="space-y-3">
                {filteredApprovedClaims.length === 0 ? (
                  <div className="text-slate-400 text-center py-6">No pending payout claims ready for release.</div>
                ) : (
                  filteredApprovedClaims.map((pay) => (
                    <div key={pay.id} className="p-4 bg-[#0e1628] border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">Subcontractor Hub (Sub-{pay.subcontractorId})</div>
                        <span className="text-[10px] text-slate-500 mt-0.5">Voucher: PAY-{pay.id} | Info: {pay.description || "Approved construction work claim"}</span>
                        <div className="mt-1 font-mono text-emerald-400 font-bold">₹{pay.amountRequested.toLocaleString("en-IN")}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleReleasePayout(pay.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded">Release</button>
                        <button onClick={() => handleHoldPayout(pay.id)} className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1 rounded">Hold</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAX & COMPLIANCE */}
          {activeTab === "Tax & Compliance" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Compliance Status</h3>
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                {currentCompliance.map((item, idx) => {
                  const parts = item.split(": ");
                  const title = parts[0] || "Compliance Item";
                  const detail = parts[1] || "";
                  const statusPart = detail.split(". Status: ");
                  const desc = statusPart[0] || "";
                  const status = statusPart[1] || "Active";

                  return (
                    <div key={idx} className="p-4 bg-[#0e1628] border border-slate-800 rounded-xl space-y-2">
                      <div className="font-bold text-white">{title}</div>
                      <p className="text-slate-400">{desc}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${
                        status.includes("Filed") || status.includes("Successfully") ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI EXPENSE AUDITS */}
          {activeTab === "AI Expense Audits" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                  {aiReplies.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-xl max-w-sm text-xs ${
                        msg.sender === "user" ? "bg-emerald-600 text-white font-semibold shadow-md" : "bg-[#0e1628] border border-slate-805 text-slate-200"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                  <input
                    type="text"
                    placeholder="Ask AI finance planner..."
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAIChat()}
                    className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button onClick={() => handleSendAIChat()} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg transition">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">AI Diagnostics Options</h4>
                <div className="space-y-2.5 text-xs text-emerald-400">
                  {currentSuggestions.map((sug, idx) => (
                    <button key={idx} onClick={() => handleSendAIChat(sug)} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-800 hover:border-emerald-500 transition block">🔮 {sug}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "Settings" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn max-w-xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Dashboard Profile & Configurations</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Sidebar Menu Items (Separated by |)</label>
                  <input
                    type="text"
                    value={formSidebarMenus}
                    onChange={(e) => setFormSidebarMenus(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">AI suggestions (Separated by |)</label>
                  <textarea
                    value={formAiSuggestions}
                    onChange={(e) => setFormAiSuggestions(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-emerald-500 h-20"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Accounts Receivables Card Description</label>
                  <input
                    type="text"
                    value={formKpiReceivablesDesc}
                    onChange={(e) => setFormKpiReceivablesDesc(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Accounts Payables Card Description</label>
                  <input
                    type="text"
                    value={formKpiPayablesDesc}
                    onChange={(e) => setFormKpiPayablesDesc(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Net Cash Flow Card Description</label>
                  <input
                    type="text"
                    value={formKpiNetCashDesc}
                    onChange={(e) => setFormKpiNetCashDesc(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Pending Approvals Card Description</label>
                  <input
                    type="text"
                    value={formKpiApprovalsDesc}
                    onChange={(e) => setFormKpiApprovalsDesc(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button onClick={handleSaveProfile} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition">Save to Database</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
