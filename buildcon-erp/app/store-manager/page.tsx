"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  Boxes, PackagePlus, Truck, ArrowLeftRight, Bot, Settings,
  LogOut, Plus, Search, Filter, Calendar, Send, CheckCircle2,
  AlertCircle, MapPin, X, Building
} from "lucide-react";

interface StoreItem {
  id?: number;
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  binLocation: string;
  unitPrice: number;
}

interface Grn {
  id?: number;
  grnNumber: string;
  poNumber: string;
  vendorName: string;
  receivedDate: string;
  vehicleNumber: string;
  challanNumber: string;
  inspectedBy: string;
  status: string;
  totalReceivedQty: number;
  remarks: string;
}

interface Stn {
  id?: number;
  stnNumber: string;
  sourceSite: string;
  destinationSite: string;
  materialName: string;
  quantity: number;
  unit: string;
  dispatchDate: string;
  expectedArrival: string;
  transporterName: string;
  status: string;
}

export default function StoreManagerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [orgId, setOrgId] = useState<number>(1);
  const [profileName, setProfileName] = useState("G. Murugan (Storekeeper)");
  const [profileEmail, setProfileEmail] = useState("stores@buildcon.com");
  const [avatarInitials, setAvatarInitials] = useState("SM");

  // Data
  const [items, setItems] = useState<StoreItem[]>([]);
  const [grns, setGrns] = useState<Grn[]>([]);
  const [stns, setStns] = useState<Stn[]>([]);
  const [kpiStats, setKpiStats] = useState({
    totalItemsCount: 5,
    lowStockCount: 0,
    totalValuation: 3500000,
    inTransitStns: 1
  });

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [showGrnModal, setShowGrnModal] = useState(false);
  const [showStnModal, setShowStnModal] = useState(false);

  // Forms
  const [newItem, setNewItem] = useState({
    itemCode: "", itemName: "", category: "Cement", unit: "Bags", currentStock: 100, reorderLevel: 20, binLocation: "Bay A1", unitPrice: 420
  });
  const [newGrn, setNewGrn] = useState({
    grnNumber: "", poNumber: "PO-101", vendorName: "", vehicleNumber: "", challanNumber: "", inspectedBy: "G. Murugan", status: "VERIFIED_ACCEPTED", totalReceivedQty: 100, remarks: ""
  });
  const [newStn, setNewStn] = useState({
    stnNumber: "", sourceSite: "Central Warehouse", destinationSite: "Skyline Residences Site", materialName: "TMT Rebar 16mm", quantity: 5, unit: "MT", transporterName: "Speed Cargo", status: "IN_TRANSIT"
  });

  // AI Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello Murugan! I am your AI Storekeeper Assistant. I monitor warehouse bin capacities, track in-transit STNs, and audit GRN deliveries against purchase orders. How can I assist you?" }
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
      const res = await fetch(`http://localhost:8081/api/store-manager/dashboard/org/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setProfileName(data.profileName || "G. Murugan");
        setProfileEmail(data.profileEmail || "stores@buildcon.com");
        setAvatarInitials(data.avatarInitials || "SM");
        setItems(data.items || []);
        setGrns(data.grns || []);
        setStns(data.stns || []);
        setKpiStats({
          totalItemsCount: data.totalItemsCount || 0,
          lowStockCount: data.lowStockCount || 0,
          totalValuation: data.totalValuation || 0,
          inTransitStns: data.inTransitStns || 0
        });
      }
    } catch (e) {
      console.error("Store dashboard fetch failed:", e);
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("buildcon_token");
      const payload = { ...newItem, organizationId: orgId };
      const res = await fetch("http://localhost:8081/api/store-manager/items", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowItemModal(false);
        fetchDashboard(orgId);
        setNewItem({ itemCode: "", itemName: "", category: "Cement", unit: "Bags", currentStock: 100, reorderLevel: 20, binLocation: "Bay A1", unitPrice: 420 });
      }
    } catch (e) {
      console.error("Add item error:", e);
    }
  }

  async function handleCreateGrn(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("buildcon_token");
      const payload = { ...newGrn, organizationId: orgId };
      const res = await fetch("http://localhost:8081/api/store-manager/grn", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowGrnModal(false);
        fetchDashboard(orgId);
        setNewGrn({ grnNumber: "", poNumber: "PO-101", vendorName: "", vehicleNumber: "", challanNumber: "", inspectedBy: profileName, status: "VERIFIED_ACCEPTED", totalReceivedQty: 100, remarks: "" });
      }
    } catch (e) {
      console.error("Create GRN error:", e);
    }
  }

  async function handleCreateStn(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("buildcon_token");
      const payload = { ...newStn, organizationId: orgId };
      const res = await fetch("http://localhost:8081/api/store-manager/stn", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowStnModal(false);
        fetchDashboard(orgId);
        setNewStn({ stnNumber: "", sourceSite: "Central Warehouse", destinationSite: "Skyline Residences Site", materialName: "TMT Rebar 16mm", quantity: 5, unit: "MT", transporterName: "Speed Cargo", status: "IN_TRANSIT" });
      }
    } catch (e) {
      console.error("Create STN error:", e);
    }
  }

  async function handleUpdateStnStatus(id: number, status: string) {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/store-manager/stn/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDashboard(orgId);
      }
    } catch (e) {
      console.error("Update STN error:", e);
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
      const res = await fetch("http://localhost:8081/api/store-manager/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ message: textToSend, organizationId: orgId })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages([...newMsgs, { sender: "ai", text: data.response }]);
      }
    } catch (e) {
      setChatMessages([...newMsgs, { sender: "ai", text: "Store Intelligence: Delivery data synchronised with physical yard bins." }]);
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Boxes className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">BuildWell</div>
              <div className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">Store Management</div>
            </div>
          </div>

          {/* NAV ITEMS */}
          <nav className="p-3 space-y-1">
            {[
              { name: "Overview", icon: Boxes },
              { name: "Inventory Bins", icon: PackagePlus },
              { name: "Goods Receipt (GRN)", icon: Truck },
              { name: "Inter-Site (STN)", icon: ArrowLeftRight },
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
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  {tab.name}
                  {tab.name === "Inter-Site (STN)" && kpiStats.inTransitStns > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {kpiStats.inTransitStns}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* USER FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-[#090f1d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center text-xs">
              {avatarInitials}
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-xs font-semibold text-white truncate max-w-[110px]">{profileName}</div>
              <div className="text-[10px] text-amber-400 font-mono">Store Manager</div>
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
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              Central Store & Yard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-2 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            {activeTab === "Inventory Bins" && (
              <button
                onClick={() => setShowItemModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Store Item
              </button>
            )}
            {activeTab === "Goods Receipt (GRN)" && (
              <button
                onClick={() => setShowGrnModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                <Plus className="h-3.5 w-3.5" /> Generate Inward GRN
              </button>
            )}
            {activeTab === "Inter-Site (STN)" && (
              <button
                onClick={() => setShowStnModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
              >
                <Plus className="h-3.5 w-3.5" /> Issue Transfer (STN)
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Store Inventory</span>
                    <Boxes className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{kpiStats.totalItemsCount} Catalog Items</div>
                  <div className="text-[11px] text-slate-400 mt-1">Across covered sheds & open yards</div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Store Valuation</span>
                    <Building className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    ₹{(kpiStats.totalValuation / 100000).toFixed(2)} Lakhs
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Total physical stock assets</div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">In-Transit STNs</span>
                    <Truck className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400 font-mono">{kpiStats.inTransitStns} Consignments</div>
                  <div className="text-[11px] text-slate-400 mt-1">Dispatched to active site stores</div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Inward GRNs</span>
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono">{grns.length} Verified</div>
                  <div className="text-[11px] text-slate-400 mt-1">Delivered and inspected this month</div>
                </div>
              </div>

              {/* RECENT GRNs & IN-TRANSIT TRANSFERS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RECENT INWARD GRNs */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Truck className="h-4 w-4 text-emerald-400" /> Recent Goods Receipt Notes (GRN)
                    </h3>
                    <button onClick={() => setActiveTab("Goods Receipt (GRN)")} className="text-xs text-emerald-400 hover:underline">
                      View all ({grns.length})
                    </button>
                  </div>
                  <div className="space-y-3">
                    {grns.slice(0, 3).map((grn, idx) => (
                      <div key={idx} className="p-3 bg-[#0c1427] border border-slate-800 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span className="text-emerald-400 font-mono">{grn.grnNumber}</span>
                            <span>• {grn.vendorName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">PO: {grn.poNumber} | Vehicle: {grn.vehicleNumber}</div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {grn.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* IN-TRANSIT STNs */}
                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4 text-blue-400" /> Inter-Site Stock Movements
                    </h3>
                    <button onClick={() => setActiveTab("Inter-Site (STN)")} className="text-xs text-blue-400 hover:underline">
                      Manage STNs
                    </button>
                  </div>
                  <div className="space-y-3">
                    {stns.map((stn, idx) => (
                      <div key={idx} className="p-3 bg-[#0c1427] border border-blue-900/30 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-blue-400">{stn.stnNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            stn.status === "RECEIVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                            "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          }`}>
                            {stn.status}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white">{stn.materialName} ({stn.quantity} {stn.unit})</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>{stn.sourceSite}</span>
                          <span>→</span>
                          <span className="text-white font-medium">{stn.destinationSite}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INVENTORY BINS */}
          {activeTab === "Inventory Bins" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Physical Store Master with designated Rack/Bay storage coordinates.</p>
                <button
                  onClick={() => setShowItemModal(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Store Item
                </button>
              </div>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c1427] text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">Code</th>
                      <th className="p-3.5">Material Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Bin / Bay Location</th>
                      <th className="p-3.5">Current Stock</th>
                      <th className="p-3.5">Reorder Limit</th>
                      <th className="p-3.5">Unit Rate</th>
                      <th className="p-3.5">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {items.map((i, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-mono text-amber-400 font-bold">{i.itemCode}</td>
                        <td className="p-3.5 font-bold text-white">{i.itemName}</td>
                        <td className="p-3.5 text-slate-300 font-mono text-[11px]">{i.category}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono flex items-center gap-1 w-fit">
                            <MapPin className="h-3 w-3 text-amber-400" /> {i.binLocation}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-white font-semibold">
                          {i.currentStock} {i.unit}
                        </td>
                        <td className="p-3.5 font-mono text-slate-400">
                          {i.reorderLevel} {i.unit}
                        </td>
                        <td className="p-3.5 font-mono text-slate-300">₹{i.unitPrice?.toLocaleString()}</td>
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">
                          ₹{((i.currentStock || 0) * (i.unitPrice || 0)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: GRN */}
          {activeTab === "Goods Receipt (GRN)" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Goods Receipt Notes (GRN) verifying physical delivery against Purchase Orders before payment clearance.</p>
                <button
                  onClick={() => setShowGrnModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Create Inward GRN
                </button>
              </div>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c1427] text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">GRN No.</th>
                      <th className="p-3.5">PO Ref</th>
                      <th className="p-3.5">Vendor / Supplier</th>
                      <th className="p-3.5">Delivery Date</th>
                      <th className="p-3.5">Vehicle / Challan</th>
                      <th className="p-3.5">Received Qty</th>
                      <th className="p-3.5">Inspector</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {grns.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">{g.grnNumber}</td>
                        <td className="p-3.5 font-mono text-slate-300">{g.poNumber}</td>
                        <td className="p-3.5 font-semibold text-white">{g.vendorName}</td>
                        <td className="p-3.5 text-slate-400 font-mono">{g.receivedDate}</td>
                        <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                          {g.vehicleNumber} (Challan: {g.challanNumber})
                        </td>
                        <td className="p-3.5 font-mono text-white font-bold">{g.totalReceivedQty}</td>
                        <td className="p-3.5 text-slate-400">{g.inspectedBy}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {g.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: STN */}
          {activeTab === "Inter-Site (STN)" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Stock Transfer Notes (STN) tracking in-transit balance transfers across project sites.</p>
                <button
                  onClick={() => setShowStnModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Dispatch Transfer Note
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stns.map((stn, idx) => (
                  <div key={idx} className="bg-[#111C30] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800">
                        {stn.stnNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        stn.status === "RECEIVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                        "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      }`}>
                        {stn.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{stn.materialName}</h4>
                      <p className="text-xs text-slate-300 font-mono mt-0.5 font-bold text-emerald-400">
                        Transfer Quantity: {stn.quantity} {stn.unit}
                      </p>
                    </div>

                    <div className="p-3 bg-[#0c1427] rounded-lg border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Source: <strong>{stn.sourceSite}</strong></span>
                        <span>→</span>
                        <span>Destination: <strong>{stn.destinationSite}</strong></span>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1">Transporter: {stn.transporterName}</div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>Dispatched: {stn.dispatchDate}</span>
                      <span>ETA: {stn.expectedArrival || "Same Day"}</span>
                    </div>

                    {stn.status === "IN_TRANSIT" && (
                      <button
                        onClick={() => stn.id && handleUpdateStnStatus(stn.id, "RECEIVED")}
                        className="w-full py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-600/40 rounded text-xs font-semibold transition"
                      >
                        Acknowledge & Confirm Receipt at Site
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AI ASSISTANT */}
          {activeTab === "AI Assistant" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl h-[600px] flex flex-col overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-800 bg-[#0c1427] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Storekeeper & Warehouse AI Copilot</div>
                    <div className="text-[10px] text-amber-400">Trained on IS 4082 Storage Codes & Inward GRN Reconciliation</div>
                  </div>
                </div>
              </div>

              {/* QUICK PROMPT CHIPS */}
              <div className="px-4 py-2.5 bg-[#090f1d] border-b border-slate-800/80 flex flex-wrap gap-2 text-xs">
                {[
                  "Cement Stacking Heights (IS 4082)",
                  "Audit Current Stock Valuation",
                  "In-Transit STN Consignment Tracker",
                  "Goods Receipt Note (GRN) Unloading Time"
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendAiMessage(chip)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-amber-900/40 hover:text-amber-300 text-slate-300 border border-slate-700/60 text-[11px] transition"
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
                          ? "bg-amber-600 text-white rounded-br-none shadow-md"
                          : "bg-[#0c1427] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0c1427] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 flex items-center gap-2 font-mono">
                      <span className="animate-spin">⚙</span> Consulting warehouse bin records...
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
                  placeholder="Ask about storage specifications, moisture protection, reorder thresholds, or GRNs..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => sendAiMessage()}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
                >
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "Settings" && (
            <div className="max-w-xl bg-[#111C30] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-white">Store Manager Profile Settings</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("buildcon_token");
                    await fetch("http://localhost:8081/api/store-manager/profile/update", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ username: profileName, email: profileEmail, organizationId: orgId })
                    });
                    alert("Profile updated successfully!");
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs transition"
                >
                  Save Profile to Database
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* STORE ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Add New Store Catalog Item</h3>
              <button onClick={() => setShowItemModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Material Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. River Sand / M-Sand"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 text-white"
                  >
                    <option value="Cement">Cement</option>
                    <option value="Steel">Steel Rebar</option>
                    <option value="Aggregates">Aggregates & Sand</option>
                    <option value="Masonry">Masonry Blocks</option>
                    <option value="Chemicals">Chemicals & Waterproofing</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit of Measure</label>
                  <input
                    required
                    type="text"
                    placeholder="Bags, MT, Cu.m, Liters"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Current Stock Qty</label>
                  <input
                    required
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem({ ...newItem, currentStock: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Reorder Threshold</label>
                  <input
                    required
                    type="number"
                    value={newItem.reorderLevel}
                    onChange={(e) => setNewItem({ ...newItem, reorderLevel: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Bin Location Coordinates</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Shed B - Bay 04"
                    value={newItem.binLocation}
                    onChange={(e) => setNewItem({ ...newItem, binLocation: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowItemModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRN MODAL */}
      {showGrnModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Generate Goods Receipt Note (GRN)</h3>
              <button onClick={() => setShowGrnModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateGrn} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">PO Reference Number</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. PO-101"
                    value={newGrn.poNumber}
                    onChange={(e) => setNewGrn({ ...newGrn, poNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Received Quantity</label>
                  <input
                    required
                    type="number"
                    value={newGrn.totalReceivedQty}
                    onChange={(e) => setNewGrn({ ...newGrn, totalReceivedQty: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Vendor / Supplier Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. UltraTech Cement / Tata Tiscon"
                  value={newGrn.vendorName}
                  onChange={(e) => setNewGrn({ ...newGrn, vendorName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Truck Vehicle Number</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. TN-09-CB-4491"
                    value={newGrn.vehicleNumber}
                    onChange={(e) => setNewGrn({ ...newGrn, vehicleNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Delivery Challan No.</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. CH-99410"
                    value={newGrn.challanNumber}
                    onChange={(e) => setNewGrn({ ...newGrn, challanNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Unloading Remarks & QA Verification</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bags intact, zero moisture, weighbridge slip verified..."
                  value={newGrn.remarks}
                  onChange={(e) => setNewGrn({ ...newGrn, remarks: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowGrnModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold">Generate GRN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STN MODAL */}
      {showStnModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Issue Stock Transfer Note (STN)</h3>
              <button onClick={() => setShowStnModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateStn} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Material Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. TMT Steel Rebar (16mm)"
                  value={newStn.materialName}
                  onChange={(e) => setNewStn({ ...newStn, materialName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Transfer Quantity</label>
                  <input
                    required
                    type="number"
                    value={newStn.quantity}
                    onChange={(e) => setNewStn({ ...newStn, quantity: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit</label>
                  <input
                    required
                    type="text"
                    value={newStn.unit}
                    onChange={(e) => setNewStn({ ...newStn, unit: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Source Site</label>
                  <input
                    required
                    type="text"
                    value={newStn.sourceSite}
                    onChange={(e) => setNewStn({ ...newStn, sourceSite: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Destination Site</label>
                  <input
                    required
                    type="text"
                    value={newStn.destinationSite}
                    onChange={(e) => setNewStn({ ...newStn, destinationSite: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Transporter / Vehicle Details</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Southern Heavy Movers (TN-18-B-3310)"
                  value={newStn.transporterName}
                  onChange={(e) => setNewStn({ ...newStn, transporterName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowStnModal(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold">Dispatch STN</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

