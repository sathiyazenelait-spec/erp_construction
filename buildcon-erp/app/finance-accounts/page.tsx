"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, CreditCard, Receipt, FileText, CheckSquare,
  AlertCircle, Bot, Settings, LogOut, Building2, Calendar,
  Filter, Plus, SendHorizontal, DollarSign, Wallet
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar
} from "recharts";

interface LedgerTransaction {
  id: string;
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
  const [dateFilter, setDateFilter] = useState("09 June 2026, Tuesday");

  // --- Stateful Data ---
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([
    { id: "TX-701", party: "Skyline Client (Invoice #04)", type: "Receivable", amount: 18000000, dueDate: "15 Jun 2026", status: "Pending" },
    { id: "TX-702", party: "Concrete Specialist Subcontractor", type: "Payable", amount: 1200000, dueDate: "10 Jun 2026", status: "Pending" },
    { id: "TX-703", party: "UltraTech Cement Ltd", type: "Payable", amount: 850000, dueDate: "05 Jun 2026", status: "Paid" },
    { id: "TX-704", party: "Aaditya Infra (Steel Vendor)", type: "Payable", amount: 2400000, dueDate: "01 Jun 2026", status: "Overdue" },
    { id: "TX-705", party: "Greenfield Client (Invoice #02)", type: "Receivable", amount: 25000000, dueDate: "28 May 2026", status: "Paid" }
  ]);

  const [newParty, setNewParty] = useState("");
  const [newType, setNewType] = useState<"Receivable" | "Payable">("Receivable");
  const [newAmount, setNewAmount] = useState("");

  const [aiChatInput, setAiChatInput] = React.useState("");
  const [aiReplies, setAiReplies] = React.useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Ramesh! I'm your AI Expense & Cashflow Assistant. I track working capital variations, flag high-risk receivables, and audit tax compliance." }
  ]);

  const [approvedClaims, setApprovedClaims] = React.useState<any[]>([]);

  async function fetchApprovedClaims() {
    try {
      const res = await fetch("http://localhost:8081/api/progress-claims/status/APPROVED");
      if (res.ok) {
        const data = await res.json();
        setApprovedClaims(data);
      }
    } catch (e) {
      console.error("Failed to load approved claims for Finance", e);
    }
  }

  React.useEffect(() => {
    fetchApprovedClaims();
  }, []);

  const handleReleasePayout = async (id: number) => {
    try {
      const ref = `PAY-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await fetch(`http://localhost:8081/api/progress-claims/${id}/pay?paymentReference=${ref}`, {
        method: "POST"
      });
      if (res.ok) {
        alert(`Payout Voucher Released successfully! Ref: ${ref}`);
        fetchApprovedClaims();
      }
    } catch (e) {
      console.error("Failed to release payout", e);
    }
  };

  // Chart datasets
  const cashFlowData = [
    { month: "Jan", Inflow: 25000000, Outflow: 18000000 },
    { month: "Feb", Inflow: 32000000, Outflow: 21000000 },
    { month: "Mar", Inflow: 28000000, Outflow: 24000000 },
    { month: "Apr", Inflow: 40000000, Outflow: 29000000 },
    { month: "May", Inflow: 35000000, Outflow: 31000000 },
  ];

  const sidebarItems = [
    { name: "Finance Ledger", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Accounts Receivables", icon: <Wallet className="h-4 w-4" /> },
    { name: "Accounts Payables", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Cash Flow Forecast", icon: <Receipt className="h-4 w-4" /> },
    { name: "Payout Approvals", icon: <CheckSquare className="h-4 w-4" /> },
    { name: "Tax & Compliance", icon: <FileText className="h-4 w-4" /> },
    { name: "AI Expense Audits", icon: <Bot className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParty.trim() || !newAmount.trim()) return;
    setTransactions([
      {
        id: `TX-${Math.floor(700 + Math.random() * 200)}`,
        party: newParty,
        type: newType,
        amount: parseFloat(newAmount),
        dueDate: "20 Jun 2026",
        status: "Pending"
      },
      ...transactions
    ]);
    setNewParty("");
    setNewAmount("");
  };

  const handleSendAIChat = async (text?: string) => {
    const input = text || aiChatInput;
    if (!input.trim()) return;
    setAiReplies(prev => [...prev, { sender: "user", text: input }]);
    if (!text) setAiChatInput("");

    try {
      const res = await fetch("http://localhost:8081/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          role: "finance-accounts"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiReplies(prev => [...prev, { sender: "bot", text: data.response }]);
      }
    } catch (e) {
      console.error("AI audits chat failed", e);
    }
  };

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
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/15"
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
            <div className="h-9 w-9 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 grid place-items-center text-xs font-bold font-mono">
              RI
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">Ramesh Iyer</div>
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
                <option value="Skyline Residences">Skyline Residences</option>
                <option value="Greenfield Apartments">Greenfield Apartments</option>
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
                {[
                  { label: "Accounts Receivables", val: "₹2.80 Cr", desc: "Outstanding client billings" },
                  { label: "Accounts Payables", val: "₹1.60 Cr", desc: "Subcontractors & vendors dues" },
                  { label: "Net Cash Flow MTD", val: "+₹42.5 Lakhs", desc: "Receipts vs expenses surplus" },
                  { label: "Pending Approvals", val: "4 Claims", desc: "Total value: ₹18.5 Lakhs" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                    <span className="text-[10px] text-slate-550 text-slate-400 block mt-1.5">{s.desc}</span>
                  </div>
                ))}
              </div>

              {/* Transactions Ledger */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">All Transactions Ledger</h3>
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
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-white/5">
                          <td className="py-3 px-2 font-mono text-slate-400">{tx.id}</td>
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
                  {transactions.filter(tx => tx.type === "Receivable").map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0e1628] border border-slate-850 text-xs">
                      <div>
                        <div className="font-bold text-white">{tx.party}</div>
                        <span className="text-[10px] text-slate-500 font-mono">Invoice Ref: {tx.id} | Due: {tx.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400 font-bold">₹{tx.amount.toLocaleString("en-IN")}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          tx.status === "Paid" ? "bg-emerald-500/10 text-emerald-450" : "bg-amber-500/10 text-amber-400"
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
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Vendor & Subcontractor Bills Payable</h3>
                <div className="space-y-3">
                  {transactions.filter(tx => tx.type === "Payable").map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0e1628] border border-slate-850 text-xs">
                      <div>
                        <div className="font-bold text-white">{tx.party}</div>
                        <span className="text-[10px] text-slate-500 font-mono">Voucher Ref: {tx.id} | Due: {tx.dueDate}</span>
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
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">5-Month Inflow vs Outflow</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData}>
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
                {approvedClaims.length === 0 ? (
                  <div className="text-slate-400 text-center py-6">No pending payout claims ready for release.</div>
                ) : (
                  approvedClaims.map((pay) => (
                    <div key={pay.id} className="p-4 bg-[#0e1628] border border-slate-855 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">Subcontractor Hub (Sub-{pay.subcontractorId})</div>
                        <span className="text-[10px] text-slate-500 mt-0.5">Voucher: PAY-{pay.id} | Info: {pay.description || "Approved construction work claim"}</span>
                        <div className="mt-1 font-mono text-emerald-450 text-emerald-400 font-bold">₹{pay.amountRequested.toLocaleString("en-IN")}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleReleasePayout(pay.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded">Release</button>
                        <button onClick={() => alert("Payout Hold Logged.")} className="bg-amber-600 text-white font-bold px-3 py-1 rounded">Hold</button>
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
                <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl space-y-2">
                  <div className="font-bold text-white">GST Filings MTD</div>
                  <p className="text-slate-400">Total Input Tax Credit (ITC) registered: ₹8.4 Lakhs. Return status is locked.</p>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded inline-block">Filed Successfully</span>
                </div>
                <div className="p-4 bg-[#0e1628] border border-slate-850 rounded-xl space-y-2">
                  <div className="font-bold text-white">Subcontractor TDS Deductions</div>
                  <p className="text-slate-400">TDS deductions calculated at 1% / 2% on verified vendor payment certificates.</p>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded inline-block">Filing due in 6 Days</span>
                </div>
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
                        msg.sender === "user" ? "bg-emerald-600 text-white font-semibold shadow-md" : "bg-[#0e1628] border border-slate-850 text-slate-200"
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
                <div className="space-y-2.5 text-xs text-emerald-450 text-emerald-400">
                  <button onClick={() => handleSendAIChat("Predict working capital cash flows.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-emerald-500 transition block">🔮 Predict working capital cash flows.</button>
                  <button onClick={() => handleSendAIChat("Audit recent vendor invoice variances.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-emerald-500 transition block">🔮 Audit recent vendor invoice variances.</button>
                  <button onClick={() => handleSendAIChat("Check subcontractor TDS filing compliance.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-emerald-500 transition block">🔮 Check subcontractor TDS filing compliance.</button>
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
                  <input type="text" readOnly defaultValue="Ramesh Iyer" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                  <input type="text" readOnly defaultValue="finance@buildcon.com" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <button onClick={() => alert("Configurations updated successfully!")} className="bg-emerald-600 hover:bg-emerald-555 text-white font-bold py-2 px-4 rounded-lg text-xs transition">Save configurations</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
