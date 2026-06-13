"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, Package, FileSpreadsheet, Users, ShoppingCart,
  AlertTriangle, CheckSquare, Bot, Settings, LogOut, Building2,
  Calendar, Filter, Plus, SendHorizontal, Trash2, Check, Star
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minLimit: number;
  unit: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface RFQItem {
  id: string;
  material: string;
  quantity: string;
  status: "Draft" | "Sent" | "Bids Received" | "Awarded";
  bidsCount: number;
}

export default function ProcurementManagerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Inventory Overview");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("09 June 2026, Tuesday");

  // --- Stateful Data ---
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "1", name: "OPC 53 Grade Cement", category: "Binders", stock: 1200, minLimit: 500, unit: "Bags", status: "In Stock" },
    { id: "2", name: "TMT Steel Rebar (12mm)", category: "Structural", stock: 4.2, minLimit: 10.0, unit: "Tons", status: "Low Stock" },
    { id: "3", name: "Coarse Aggregate (20mm)", category: "Aggregates", stock: 80, minLimit: 100, unit: "m³", status: "Low Stock" },
    { id: "4", name: "River Sand / M-Sand", category: "Aggregates", stock: 250, minLimit: 80, unit: "m³", status: "In Stock" },
    { id: "5", name: "Solid Concrete Blocks", category: "Masonry", stock: 15, minLimit: 1000, unit: "Pcs", status: "Out of Stock" },
  ]);

  const [rfqs, setRfqs] = useState<RFQItem[]>([
    { id: "RFQ-102", material: "TMT Rebar 16mm Steel", quantity: "15 Tons", status: "Bids Received", bidsCount: 3 },
    { id: "RFQ-103", material: "Ready Mix Concrete (M30)", quantity: "450 m³", status: "Sent", bidsCount: 1 },
    { id: "RFQ-104", material: "Standard Vitrified Tiles", quantity: "2,200 sq.ft", status: "Draft", bidsCount: 0 },
  ]);

  const [newMaterial, setNewMaterial] = useState("");
  const [newQty, setNewQty] = useState("");

  const [aiChatInput, setAiChatInput] = useState("");
  const [aiReplies, setAiReplies] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Venkatesh! I'm your AI Procurement Assistant. I forecast steel & cement price trends and optimize procurement order cycles to prevent stockouts." }
  ]);

  // Chart datasets
  const stockChartData = inventory.map(item => ({
    name: item.name.substring(0, 12),
    Stock: item.stock,
    Limit: item.minLimit
  }));

  const vendorComparisonData = [
    { name: "UltraTech Cement", rating: 4.8, priceRating: "High", deliveryRating: "Exemplary" },
    { name: "JSW Steel", rating: 4.6, priceRating: "Moderate", deliveryRating: "Reliable" },
    { name: "Coromandel Aggregates", rating: 4.2, priceRating: "Low", deliveryRating: "Moderate Delay" },
  ];

  // Sidebar items
  const sidebarItems = [
    { name: "Inventory Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Stock Ledger", icon: <Package className="h-4 w-4" /> },
    { name: "RFQ Control Center", icon: <FileSpreadsheet className="h-4 w-4" /> },
    { name: "Vendor Management", icon: <Users className="h-4 w-4" /> },
    { name: "Purchase Requisitions", icon: <ShoppingCart className="h-4 w-4" /> },
    { name: "AI Procurement Assistant", icon: <Bot className="h-4 w-4" /> },
    { name: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const handleCreateRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.trim() || !newQty.trim()) return;
    setRfqs([...rfqs, {
      id: `RFQ-${Math.floor(100 + Math.random() * 900)}`,
      material: newMaterial,
      quantity: newQty,
      status: "Sent",
      bidsCount: 0
    }]);
    setNewMaterial("");
    setNewQty("");
  };

  const handleSendAIChat = (text?: string) => {
    const input = text || aiChatInput;
    if (!input.trim()) return;
    setAiReplies(prev => [...prev, { sender: "user", text: input }]);
    if (!text) setAiChatInput("");

    setTimeout(() => {
      let response = "I am processing current global and local market indexes. Commodity indices indicate relative stability this quarter.";
      if (input.toLowerCase().includes("steel") || input.toLowerCase().includes("price")) {
        response = "AI Alert: Steel prices are projected to rise by 4.2% next month due to scrap iron export duties. Recommend issuing RFQ-102 immediately to lock in rates.";
      } else if (input.toLowerCase().includes("cement")) {
        response = "Cement demands are holding steady. Suggest placing orders with UltraTech Cement (Rating 4.8) for optimal transit delivery times.";
      } else if (input.toLowerCase().includes("warning") || input.toLowerCase().includes("stock")) {
        response = "Inventory flags active: Solid Concrete Blocks are completely OUT OF STOCK. TMT Steel Rebar is below minimum safety threshold (4.2 Tons vs 10.0 Tons minimum).";
      }
      setAiReplies(prev => [...prev, { sender: "bot", text: response }]);
    }, 1000);
  };

  return (
    <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 grid place-items-center shadow-lg shadow-blue-500/20">
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
              VK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">Venkatesh K.</div>
              <div className="text-[10px] text-slate-400 font-medium truncate">Procurement Manager</div>
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
              {activeTab.toUpperCase()} <span className="text-[10px] text-blue-400 font-normal normal-case">/ Procurement portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Control vendor ratings, request quotes, approve indents, and monitor inventory levels.</p>
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

          {/* INVENTORY OVERVIEW */}
          {activeTab === "Inventory Overview" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-4 gap-4 text-xs">
                {[
                  { label: "Active Suppliers", val: "18 Vendors", desc: "4 Preferred Suppliers" },
                  { label: "Total PO Value MTD", val: "₹45.6 Lakhs", desc: "8 Purchase Orders issued" },
                  { label: "Low Stock Items", val: "2 Alerts", desc: "Rebar Steel, Aggregates" },
                  { label: "Out of Stock Items", val: "1 Critical", desc: "Concrete Solid Blocks" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 relative overflow-hidden">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">{s.label}</span>
                    <div className="text-xl font-bold mt-1 font-mono text-white">{s.val}</div>
                    <span className="text-[10px] text-slate-500 block mt-1.5">{s.desc}</span>
                  </div>
                ))}
              </div>

              {/* Warnings and Stock levels */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Stock Levels Chart</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stockChartData}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar name="Current Stock" dataKey="Stock" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar name="Threshold Limit" dataKey="Limit" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Critical Notifications</h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                      <div>
                        <div className="font-bold text-white">Out of Stock: Concrete Blocks</div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Slab and masonry work in Sector 4 is halted. Reorder immediately.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-white">Low Stock: TMT Steel Rebar</div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Stock at 4.2 Tons (Minimum required threshold: 10 Tons).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STOCK LEDGER */}
          {activeTab === "Stock Ledger" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Material Inventory Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-3 px-2">Material Name</th>
                      <th className="py-3 px-2">Category</th>
                      <th className="py-3 px-2 text-right">Available Stock</th>
                      <th className="py-3 px-2 text-right">Min Threshold</th>
                      <th className="py-3 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800/50 hover:bg-white/5">
                        <td className="py-3 px-2 font-bold text-white">{item.name}</td>
                        <td className="py-3 px-2 text-slate-400">{item.category}</td>
                        <td className="py-3 px-2 text-right font-mono">{item.stock} {item.unit}</td>
                        <td className="py-3 px-2 text-right font-mono text-slate-400">{item.minLimit} {item.unit}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            item.status === "In Stock" ? "bg-emerald-500/10 text-emerald-400" :
                            item.status === "Low Stock" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RFQ CONTROL CENTER */}
          {activeTab === "RFQ Control Center" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleCreateRFQ} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-1">Request Material</label>
                  <input
                    type="text"
                    placeholder="e.g. TMT Steel Rebar 20mm"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="w-32">
                  <label className="text-[10px] text-slate-400 block mb-1">Required Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Tons"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition flex items-center gap-1.5 h-[34px]">
                  <Plus className="h-4 w-4" /> Create RFQ
                </button>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active RFQs Logs</h3>
                <div className="space-y-3">
                  {rfqs.map((rfq) => (
                    <div key={rfq.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0e1628] border border-slate-850 text-xs">
                      <div>
                        <div className="font-bold text-white">{rfq.material}</div>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">RFQ ID: {rfq.id} | Quantity: {rfq.quantity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">{rfq.bidsCount} bids received</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          rfq.status === "Bids Received" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                          rfq.status === "Sent" ? "bg-amber-500/10 text-amber-400" : "bg-slate-850 text-slate-400"
                        }`}>{rfq.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VENDOR MANAGEMENT */}
          {activeTab === "Vendor Management" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Vendor Rating Matrix</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-3 px-2">Supplier Name</th>
                      <th className="py-3 px-2">Compliance Rating</th>
                      <th className="py-3 px-2">Price Index</th>
                      <th className="py-3 px-2">Delivery Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorComparisonData.map((v, idx) => (
                      <tr key={idx} className="border-b border-slate-800/50 hover:bg-white/5">
                        <td className="py-3 px-2 font-bold text-white">{v.name}</td>
                        <td className="py-3 px-2 text-yellow-400 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400" /> {v.rating} / 5
                        </td>
                        <td className="py-3 px-2 text-slate-300 font-semibold">{v.priceRating}</td>
                        <td className="py-3 px-2 text-emerald-400">{v.deliveryRating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PURCHASE REQUISITIONS */}
          {activeTab === "Purchase Requisitions" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Indent Approvals & Purchase Orders</h3>
              <div className="space-y-3">
                {[
                  { indent: "IND-905", material: "OPC 53 Cement (500 Bags)", requestedBy: "Vijay (Site supervisor)", status: "Approved" },
                  { indent: "IND-906", material: "Structural steel (12 Tons)", requestedBy: "Karthick (Senior Eng)", status: "Under Review" }
                ].map((ind, idx) => (
                  <div key={idx} className="p-4 bg-[#0e1628] border border-slate-855 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{ind.material}</div>
                      <span className="text-[10px] text-slate-500 mt-0.5">Indent: {ind.indent} | Raised by: {ind.requestedBy}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        ind.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400"
                      }`}>{ind.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI PROCUREMENT ASSISTANT */}
          {activeTab === "AI Procurement Assistant" && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[450px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                  {aiReplies.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-xl max-w-sm text-xs ${
                        msg.sender === "user" ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/10" : "bg-[#0e1628] border border-slate-850 text-slate-200"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-slate-800/80 pt-3">
                  <input
                    type="text"
                    placeholder="Ask AI procurement optimizer..."
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAIChat()}
                    className="flex-1 bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button onClick={() => handleSendAIChat()} className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Market Analysis Queries</h4>
                <div className="space-y-2.5 text-xs text-blue-400">
                  <button onClick={() => handleSendAIChat("Forecast steel price trends.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-blue-500 transition block">🔮 Forecast steel price trends.</button>
                  <button onClick={() => handleSendAIChat("Compare cement supplier delivery ratings.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-blue-500 transition block">🔮 Compare cement supplier delivery ratings.</button>
                  <button onClick={() => handleSendAIChat("Show low stock warnings.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-blue-500 transition block">🔮 Show low stock warnings.</button>
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
                  <input type="text" readOnly defaultValue="Venkatesh K." className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                  <input type="text" readOnly defaultValue="procurement@buildcon.com" className="w-full bg-[#0a1120] text-slate-350 border border-slate-800 rounded-lg p-2 outline-none cursor-not-allowed" />
                </div>
                <button onClick={() => alert("Configurations updated successfully!")} className="bg-blue-600 hover:bg-blue-550 text-white font-bold py-2 px-4 rounded-lg text-xs transition">Save configurations</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
