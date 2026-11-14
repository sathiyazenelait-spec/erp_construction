"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  Store, ShoppingCart, FileCheck2, CreditCard, Bot, Settings,
  LogOut, Plus, Search, Calendar, Send, CheckCircle2,
  Clock, AlertCircle, X, DollarSign
} from "lucide-react";

interface VendorBid {
  id?: number;
  rfqNumber: string;
  materialName: string;
  vendorName: string;
  quotedRate: number;
  unit: string;
  leadTimeDays: number;
  quoteDate: string;
  status: string;
  terms: string;
}

interface PurchaseOrder {
  id?: number;
  poNumber: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  status: string;
}

export default function VendorPortalDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [orgId, setOrgId] = useState<number>(1);
  const [profileName, setProfileName] = useState("Tata Tiscon Direct");
  const [profileEmail, setProfileEmail] = useState("vendor@tatatiscon.com");
  const [avatarInitials, setAvatarInitials] = useState("TT");

  const [bids, setBids] = useState<VendorBid[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [kpiStats, setKpiStats] = useState({
    totalBids: 2,
    acceptedBids: 1,
    openPosCount: 2
  });

  const [showBidModal, setShowBidModal] = useState(false);
  const [newBid, setNewBid] = useState({
    rfqNumber: "RFQ-2026-03",
    materialName: "TMT Rebar Fe500D (12mm)",
    quotedRate: 67200,
    unit: "MT",
    leadTimeDays: 3,
    terms: "F.O.R. site delivery within 72 hrs. Payment net 30 days post GRN."
  });

  // AI Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Welcome Supplier Partner! I am your AI Procurement & Vendor Assistant. I track RFQ bidding updates, purchase orders, and payment releases. How may I assist you?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrgId = localStorage.getItem("selected_login_org_id");
      const currentOrgId = savedOrgId ? parseInt(savedOrgId, 10) : 1;
      setOrgId(currentOrgId);
      fetchDashboard(currentOrgId);
    }
  }, []);

  async function fetchDashboard(id: number) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/vendor-portal/dashboard/org/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setProfileName(data.profileName || "Tata Tiscon Direct");
        setProfileEmail(data.profileEmail || "vendor@tatatiscon.com");
        setAvatarInitials(data.avatarInitials || "TT");
        setBids(data.bids || []);
        setPurchaseOrders(data.purchaseOrders || []);
        setKpiStats({
          totalBids: data.totalBids || 0,
          acceptedBids: data.acceptedBids || 0,
          openPosCount: data.openPosCount || 0
        });
      }
    } catch (e) {
      console.error("Vendor dashboard fetch failed:", e);
    }
  }

  async function handleAddBid(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("buildcon_token");
      const payload = { ...newBid, vendorName: profileName, organizationId: orgId };
      const res = await fetch("http://localhost:8081/api/vendor-portal/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowBidModal(false);
        fetchDashboard(orgId);
        setNewBid({ rfqNumber: "RFQ-2026-04", materialName: "OPC 53 Cement", quotedRate: 415, unit: "Bags", leadTimeDays: 2, terms: "Standard delivery terms." });
      }
    } catch (e) {
      console.error("Add bid error:", e);
    }
  }

  async function sendAiMessage(promptText?: string) {
    const textToSend = promptText || chatInput;
    if (!textToSend.trim()) return;

    const newMsgs = [...chatMessages, { sender: "user" as const, text: textToSend }];
    setChatMessages(newMsgs);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/vendor-portal/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ message: textToSend, organizationId: orgId })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages([...newMsgs, { sender: "ai", text: data.response }]);
      }
    } catch (e) {
      setChatMessages([...newMsgs, { sender: "ai", text: "Vendor Assistant: Live order coordination online." }]);
    } finally {
      setIsAiLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-[#0A1120] text-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 bg-[#0c1427] flex flex-col justify-between shrink-0">
        <div>
          {/* LOGO */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">BuildWell</div>
              <div className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">Supplier Portal</div>
            </div>
          </div>

          {/* NAV ITEMS */}
          <nav className="p-3 space-y-1">
            {[
              { name: "Overview", icon: Store },
              { name: "RFQ Quotations", icon: FileCheck2 },
              { name: "Purchase Orders", icon: ShoppingCart },
              { name: "Payments & Invoices", icon: CreditCard },
              { name: "AI Assistant", icon: Bot },
              { name: "Settings", icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* USER FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-[#090f1d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-xs">
              {avatarInitials}
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-xs font-semibold text-white truncate max-w-[110px]">{profileName}</div>
              <div className="text-[10px] text-indigo-400 font-mono">Supplier Partner</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/login/manager"); }}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* HEADER */}
        <header className="h-16 border-b border-slate-800 bg-[#0c1427]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-wide">{activeTab}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
              Verified Enterprise Supplier
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-2 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            {activeTab === "RFQ Quotations" && (
              <button
                onClick={() => setShowBidModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                <Plus className="h-3.5 w-3.5" /> Submit Bid
              </button>
            )}
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="p-6 space-y-6 flex-1">
          {/* TAB: OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Submitted Bids</span>
                    <FileCheck2 className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{kpiStats.totalBids} RFQ Quotes</div>
                  <div className="text-[11px] text-slate-400 mt-1">Across active procurement RFQs</div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Accepted Awards</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{kpiStats.acceptedBids} Approved</div>
                  <div className="text-[11px] text-slate-400 mt-1">Converted to active Purchase Orders</div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active PO Orders</span>
                    <ShoppingCart className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono">{purchaseOrders.length} In Progress</div>
                  <div className="text-[11px] text-slate-400 mt-1">Scheduled for site staging & delivery</div>
                </div>
              </div>

              {/* RECENT BIDS & PO PREVIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-indigo-400" /> Recent Quotation Bids
                    </h3>
                    <button onClick={() => setActiveTab("RFQ Quotations")} className="text-xs text-indigo-400 hover:underline">
                      View all ({bids.length})
                    </button>
                  </div>
                  <div className="space-y-3">
                    {bids.map((b, idx) => (
                      <div key={idx} className="p-3 bg-[#0c1427] border border-slate-800 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span className="font-mono text-indigo-400">{b.rfqNumber}</span>
                            <span>• {b.materialName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Rate: ₹{b.quotedRate.toLocaleString()}/{b.unit} | Lead Time: {b.leadTimeDays} days</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          b.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-emerald-400" /> Active Purchase Orders (POs)
                    </h3>
                    <button onClick={() => setActiveTab("Purchase Orders")} className="text-xs text-emerald-400 hover:underline">
                      View all ({purchaseOrders.length})
                    </button>
                  </div>
                  <div className="space-y-3">
                    {purchaseOrders.map((po, idx) => (
                      <div key={idx} className="p-3 bg-[#0c1427] border border-slate-800 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-emerald-400">{po.poNumber}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {po.status}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white">{po.itemDescription}</div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Qty: {po.quantity} • Rate: ₹{po.unitPrice}</span>
                          <span className="text-emerald-400 font-bold font-mono">Total: ₹{po.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RFQs */}
          {activeTab === "RFQ Quotations" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Submit competitive bids on open material requisitions released by Procurement Managers.</p>
                <button
                  onClick={() => setShowBidModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Submit New Quotation
                </button>
              </div>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c1427] text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">RFQ Number</th>
                      <th className="p-3.5">Material Specification</th>
                      <th className="p-3.5">Quoted Rate</th>
                      <th className="p-3.5">Delivery Lead Time</th>
                      <th className="p-3.5">Quote Date</th>
                      <th className="p-3.5">Commercial Terms</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {bids.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-mono text-indigo-400 font-bold">{b.rfqNumber}</td>
                        <td className="p-3.5 font-bold text-white">{b.materialName}</td>
                        <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                          ₹{b.quotedRate.toLocaleString()} / {b.unit}
                        </td>
                        <td className="p-3.5 text-slate-300 font-mono">{b.leadTimeDays} Days F.O.R.</td>
                        <td className="p-3.5 text-slate-400 font-mono">{b.quoteDate}</td>
                        <td className="p-3.5 text-slate-400 max-w-xs truncate">{b.terms}</td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            b.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: POs */}
          {activeTab === "Purchase Orders" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Legally binding Purchase Orders awarded by the enterprise procurement committee.</p>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c1427] text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">PO Number</th>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5">Order Qty</th>
                      <th className="p-3.5">Unit Rate</th>
                      <th className="p-3.5">Total Value (₹)</th>
                      <th className="p-3.5">Order Date</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {purchaseOrders.map((po, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">{po.poNumber}</td>
                        <td className="p-3.5 font-bold text-white">{po.itemDescription}</td>
                        <td className="p-3.5 font-mono text-slate-300">{po.quantity}</td>
                        <td className="p-3.5 font-mono text-slate-300">₹{po.unitPrice?.toLocaleString()}</td>
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">₹{po.totalAmount?.toLocaleString()}</td>
                        <td className="p-3.5 text-slate-400 font-mono">{po.orderDate}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PAYMENTS */}
          {activeTab === "Payments & Invoices" && (
            <div className="space-y-4">
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-400" /> Settlement & Payment Release Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Payment vouchers are approved on a net-30 schedule following site store GRN confirmation and QA/QC test clearance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Paid MTD</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono mt-1">₹45,60,000</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Cleared via RTGS / NEFT</div>
                  </div>
                  <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Under GRN Audit</div>
                    <div className="text-lg font-bold text-amber-400 font-mono mt-1">₹18,50,000</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Gate pass & weighing verification</div>
                  </div>
                  <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">TDS Deducted (Sec 194C)</div>
                    <div className="text-lg font-bold text-cyan-400 font-mono mt-1">₹91,200</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Form 16A quarterly cert</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI ASSISTANT */}
          {activeTab === "AI Assistant" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl h-[600px] flex flex-col overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-800 bg-[#0c1427] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-indigo-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Vendor Partner AI Concierge</div>
                    <div className="text-[10px] text-indigo-400">Order tracking, gate-pass logistics, and payment verification</div>
                  </div>
                </div>
              </div>

              {/* QUICK PROMPT CHIPS */}
              <div className="px-4 py-2.5 bg-[#090f1d] border-b border-slate-800/80 flex flex-wrap gap-2 text-xs">
                {[
                  "Check status of RFQ-2026-01 bid",
                  "What is payment turnaround post-GRN?",
                  "Recommended site unloading hours",
                  "TDS certificate release schedule"
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendAiMessage(chip)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-900/40 hover:text-indigo-300 text-slate-300 border border-slate-700/60 text-[11px] transition"
                  >
                    ✨ {chip}
                  </button>
                ))}
              </div>

              {/* CHAT MESSAGES */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none shadow-md"
                          : "bg-[#0c1427] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0c1427] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-indigo-400 flex items-center gap-2 font-mono">
                      <span className="animate-spin">⚙</span> Querying vendor order registers...
                    </div>
                  </div>
                )}
              </div>

              {/* INPUT BAR */}
              <div className="p-3 border-t border-slate-800 bg-[#0c1427] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendAiMessage()}
                  placeholder="Ask about purchase orders, GRN settlements, or quotation statuses..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => sendAiMessage()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
                >
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "Settings" && (
            <div className="max-w-xl bg-[#111C30] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-white">Supplier Company Profile Settings</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Company / Entity Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Business Contact Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("buildcon_token");
                    await fetch("http://localhost:8081/api/vendor-portal/profile/update", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ username: profileName, email: profileEmail, organizationId: orgId })
                    });
                    alert("Supplier profile updated successfully!");
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition"
                >
                  Save Profile to Database
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* BID MODAL */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Submit RFQ Quotation Bid</h3>
              <button onClick={() => setShowBidModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddBid} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">RFQ Reference</label>
                  <input
                    required
                    type="text"
                    value={newBid.rfqNumber}
                    onChange={(e) => setNewBid({ ...newBid, rfqNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Delivery Lead Time</label>
                  <input
                    required
                    type="number"
                    placeholder="Days"
                    value={newBid.leadTimeDays}
                    onChange={(e) => setNewBid({ ...newBid, leadTimeDays: parseInt(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Material Name & Spec</label>
                <input
                  required
                  type="text"
                  value={newBid.materialName}
                  onChange={(e) => setNewBid({ ...newBid, materialName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Quoted Rate (₹)</label>
                  <input
                    required
                    type="number"
                    value={newBid.quotedRate}
                    onChange={(e) => setNewBid({ ...newBid, quotedRate: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit</label>
                  <input
                    required
                    type="text"
                    value={newBid.unit}
                    onChange={(e) => setNewBid({ ...newBid, unit: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Payment & Commercial Terms</label>
                <textarea
                  rows={2}
                  value={newBid.terms}
                  onChange={(e) => setNewBid({ ...newBid, terms: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowBidModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold">Submit Quotation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

