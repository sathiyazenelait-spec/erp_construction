"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, Package, FileSpreadsheet, Users, ShoppingCart,
  AlertTriangle, CheckSquare, Bot, Settings, LogOut, Building2,
  Calendar, Filter, Plus, SendHorizontal, Trash2, Check, Star
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";

interface InventoryItem {
  id?: number;
  name: string;
  category: string;
  stock: number;
  minLimit: number;
  unit: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface RFQItem {
  id?: number;
  rfqId: string;
  material: string;
  quantity: string;
  status: "Draft" | "Sent" | "Bids Received" | "Awarded";
  bidsCount: number;
}

interface VendorItem {
  id?: number;
  name: string;
  rating: number;
  priceRating: string;
  deliveryRating: string;
}

interface RequisitionItem {
  id?: number;
  indentId: string;
  material: string;
  requestedBy: string;
  status: string;
}

export default function ProcurementManagerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Inventory Overview");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [dateFilter, setDateFilter] = useState("");

  // --- Dynamic State ---
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [rfqs, setRfqs] = useState<RFQItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [requisitions, setRequisitions] = useState<RequisitionItem[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [organizationName, setOrganizationName] = useState("BuildWell");
  const [profileName, setProfileName] = useState("Venkatesh K.");
  const [profileEmail, setProfileEmail] = useState("procurement@buildcon.com");

  const [kpis, setKpis] = useState({
    activeSuppliers: "0 Vendors",
    totalPOValueMTD: "₹0.0 Lakhs",
    lowStock: "0 Alerts",
    outOfStock: "0 Critical"
  });

  const [sidebarMenus, setSidebarMenus] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [formSidebarMenus, setFormSidebarMenus] = useState("");
  const [formAiSuggestions, setFormAiSuggestions] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  
  const [avatarInitials, setAvatarInitials] = useState("VK");
  const [kpiLowStockDesc, setKpiLowStockDesc] = useState("Materials below safety threshold");
  const [kpiOutOfStockDesc, setKpiOutOfStockDesc] = useState("Requires immediate replacement");
  const [kpiPoValueDesc, setKpiPoValueDesc] = useState("Seeded metric");
  const [formAvatarInitials, setFormAvatarInitials] = useState("VK");
  const [formKpiLowStockDesc, setFormKpiLowStockDesc] = useState("Materials below safety threshold");
  const [formKpiOutOfStockDesc, setFormKpiOutOfStockDesc] = useState("Requires immediate replacement");
  const [formKpiPoValueDesc, setFormKpiPoValueDesc] = useState("Seeded metric");
  const [poMaterial, setPoMaterial] = useState("");
  const [poQuantity, setPoQuantity] = useState("");
  const [poUnitPrice, setPoUnitPrice] = useState("");

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);

  // Forms state
  const [newMaterial, setNewMaterial] = useState("");
  const [newQty, setNewQty] = useState("");

  // Add Inventory form state
  const [addInvName, setAddInvName] = useState("");
  const [addInvCategory, setAddInvCategory] = useState("Binders");
  const [addInvStock, setAddInvStock] = useState("");
  const [addInvMin, setAddInvMin] = useState("");
  const [addInvUnit, setAddInvUnit] = useState("Bags");

  // Profile Form state
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");

  // AI chat
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiReplies, setAiReplies] = useState<{ sender: "user" | "bot"; text: string }[]>([]);

  const iconMap: { [key: string]: React.ReactNode } = {
    "Inventory Overview": <LayoutDashboard className="h-4 w-4" />,
    "Stock Ledger": <Package className="h-4 w-4" />,
    "RFQ Control Center": <FileSpreadsheet className="h-4 w-4" />,
    "Vendor Management": <Users className="h-4 w-4" />,
    "Purchase Requisitions": <ShoppingCart className="h-4 w-4" />,
    "AI Procurement Assistant": <Bot className="h-4 w-4" />,
    "Settings": <Settings className="h-4 w-4" />,
  };

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

      const res = await fetch(`https://erp-construction.onrender.com/api/procurement-manager/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory || []);
        setRfqs(data.rfqs || []);
        setVendors(data.vendors || []);
        setRequisitions(data.requisitions || []);
        setProjects(data.projects || []);
        setOrganizationName(data.organizationName || "BuildWell");
        setProfileName(data.profileName || "Venkatesh K.");
        setProfileEmail(data.profileEmail || "procurement@buildcon.com");
        setFormUsername(data.profileName || "");
        setFormEmail(data.profileEmail || "");
        setFormSidebarMenus(data.sidebar_menus || "");
        setFormAiSuggestions(data.ai_suggestions || "");
        setAvatarInitials(data.avatarInitials || "VK");
        setFormAvatarInitials(data.avatarInitials || "VK");
        setKpiLowStockDesc(data.kpi_low_stock_desc || "Materials below safety threshold");
        setKpiOutOfStockDesc(data.kpi_out_of_stock_desc || "Requires immediate replacement");
        setKpiPoValueDesc(data.kpi_po_value_desc || "Seeded metric");
        setFormKpiLowStockDesc(data.kpi_low_stock_desc || "Materials below safety threshold");
        setFormKpiOutOfStockDesc(data.kpi_out_of_stock_desc || "Requires immediate replacement");
        setFormKpiPoValueDesc(data.kpi_po_value_desc || "Seeded metric");

        setKpis({
          activeSuppliers: data.kpiActiveSuppliers || "0 Vendors",
          totalPOValueMTD: data.kpiTotalPOValueMTD || "₹0.0 Lakhs",
          lowStock: data.kpiLowStock || "0 Alerts",
          outOfStock: data.kpiOutOfStock || "0 Critical"
        });

        setDateFilter(data.header_date || "");
        if (data.sidebar_menus) {
          setSidebarMenus(data.sidebar_menus.split("|"));
        }
        if (data.ai_suggestions) {
          setAiSuggestions(data.ai_suggestions.split("|"));
        }

        // Fetch Purchase Orders
        try {
          const poRes = await fetch(`https://erp-construction.onrender.com/api/procurement-manager/po/org/${activeOrgId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (poRes.ok) {
            const poData = await poRes.json();
            setPurchaseOrders(poData || []);
          }
        } catch (err) {
          console.error("Failed to fetch purchase orders", err);
        }

        // Fetch AI suggestions from Python service
        try {
          const aiRes = await fetch("http://localhost:8001/api/ai/procurement-suggestions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": "BuildconERPSecretKeyForSecurityAuthenticationJWT"
            },
            body: JSON.stringify({ organizationId: activeOrgId })
          });
          if (aiRes.ok) {
            const aiData = await aiRes.json();
            if (aiData.suggestions && aiData.suggestions.length > 0) {
              setAiSuggestions(aiData.suggestions);
            }
          }
        } catch (err) {
          console.error("Failed to fetch AI suggestions from Python AI service", err);
        }

        // Initialize chat suggestions and greeting
        const userGreeting = `Hello ${data.profileName || "Venkatesh K."}! I'm your AI Procurement Assistant. I forecast steel & cement price trends and optimize procurement order cycles to prevent stockouts.`;
        setAiReplies([
          { sender: "bot", text: userGreeting }
        ]);

      } else {
        setErrorMsg("Failed to load dashboard data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Network error trying to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.trim() || !newQty.trim() || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("https://erp-construction.onrender.com/api/procurement-manager/rfq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          material: newMaterial,
          quantity: newQty,
          organizationId: orgId
        })
      });

      if (res.ok) {
        setNewMaterial("");
        setNewQty("");
        loadDashboardData();
      } else {
        alert("Failed to create RFQ.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating RFQ.");
    }
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addInvName.trim() || !addInvStock || !addInvMin || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("https://erp-construction.onrender.com/api/procurement-manager/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: addInvName,
          category: addInvCategory,
          stock: parseFloat(addInvStock),
          minLimit: parseFloat(addInvMin),
          unit: addInvUnit,
          organizationId: orgId
        })
      });

      if (res.ok) {
        setAddInvName("");
        setAddInvStock("");
        setAddInvMin("");
        loadDashboardData();
      } else {
        alert("Failed to add inventory item.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding inventory item.");
    }
  };

  const handleAddPurchaseOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poMaterial.trim() || !poQuantity || !poUnitPrice || !orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("https://erp-construction.onrender.com/api/procurement-manager/po", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          materialName: poMaterial,
          quantity: parseFloat(poQuantity),
          unitPrice: parseFloat(poUnitPrice),
          organizationId: orgId
        })
      });

      if (res.ok) {
        setPoMaterial("");
        setPoQuantity("");
        setPoUnitPrice("");
        loadDashboardData();
      } else {
        alert("Failed to add Purchase Order.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding Purchase Order.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("https://erp-construction.onrender.com/api/procurement-manager/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formUsername,
          email: formEmail,
          organizationId: orgId.toString(),
          sidebar_menus: formSidebarMenus,
          ai_suggestions: formAiSuggestions,
          avatarInitials: formAvatarInitials,
          kpi_low_stock_desc: formKpiLowStockDesc,
          kpi_out_of_stock_desc: formKpiOutOfStockDesc,
          kpi_po_value_desc: formKpiPoValueDesc
        })
      });

      if (res.ok) {
        alert("Configurations updated successfully!");
        loadDashboardData();
      } else {
        alert("Failed to update configurations.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating configurations.");
    }
  };

  const handleSendAIChat = async (text?: string) => {
    const input = text || aiChatInput;
    if (!input.trim() || !orgId) return;

    setAiReplies(prev => [...prev, { sender: "user", text: input }]);
    if (!text) setAiChatInput("");

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("https://erp-construction.onrender.com/api/procurement-manager/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          organizationId: orgId.toString()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiReplies(prev => [...prev, { sender: "bot", text: data.response }]);
      } else {
        setAiReplies(prev => [...prev, { sender: "bot", text: "Error communicating with AI assistant." }]);
      }
    } catch (err) {
      console.error(err);
      setAiReplies(prev => [...prev, { sender: "bot", text: "Failed to connect to AI server." }]);
    }
  };

  // --- Project Filtering and KPI Recalculation ---
  const filteredInventory = React.useMemo(() => {
    return inventory.filter((item, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [inventory, projectFilter, projects]);

  const filteredRfqs = React.useMemo(() => {
    return rfqs.filter((item, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [rfqs, projectFilter, projects]);

  const filteredRequisitions = React.useMemo(() => {
    return requisitions.filter((item, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [requisitions, projectFilter, projects]);

  const filteredPurchaseOrders = React.useMemo(() => {
    return purchaseOrders.filter((item, idx) => {
      if (projectFilter === "All Projects") return true;
      if (projects.length === 0) return false;
      const projIdx = idx % projects.length;
      return projects[projIdx]?.name === projectFilter;
    });
  }, [purchaseOrders, projectFilter, projects]);

  const filteredKpis = React.useMemo(() => {
    if (projectFilter === "All Projects") return kpis;
    
    const lowStockCount = filteredInventory.filter(item => item.status === "Low Stock" && item.stock > 0).length;
    const outOfStockCount = filteredInventory.filter(item => item.status === "Out of Stock" || item.stock <= 0).length;
    
    let totalPOValue = 0;
    filteredPurchaseOrders.forEach(po => {
      totalPOValue += po.quantity * po.unitPrice;
    });
    const poValLakhs = (totalPOValue / 100000).toFixed(1);
    
    let suppliersCount = 5;
    try {
      const match = kpis.activeSuppliers.match(/([0-9.]+)/);
      if (match) suppliersCount = parseInt(match[1]);
    } catch(e){}
    
    let scale = 0.5;
    if (projects.length > 0) {
      const projectIndex = projects.findIndex(p => p.name === projectFilter);
      if (projectIndex !== -1) {
        scale = projectIndex === 0 ? 0.6 : projectIndex === 1 ? 0.4 : projectIndex === 2 ? 0.5 : projectIndex === 3 ? 0.7 : 0.8;
      }
    } else {
      scale = projectFilter === "Skyline Residences" ? 0.6 : 0.4;
    }
    const scaledSuppliers = Math.max(1, Math.round(suppliersCount * scale));

    return {
      activeSuppliers: `${scaledSuppliers} Vendors`,
      totalPOValueMTD: `₹${poValLakhs} Lakhs`,
      lowStock: `${lowStockCount} Alerts`,
      outOfStock: `${outOfStockCount} Critical`
    };
  }, [projectFilter, kpis, filteredInventory, filteredPurchaseOrders, projects]);

  // Recharts chart data
  const stockChartData = filteredInventory.map(item => ({
    name: item.name.substring(0, 12),
    Stock: item.stock,
    Limit: item.minLimit
  }));

  const tabsList = sidebarMenus.length > 0 ? sidebarMenus : [
    "Inventory Overview",
    "Stock Ledger",
    "RFQ Control Center",
    "Vendor Management",
    "Purchase Requisitions",
    "AI Procurement Assistant",
    "Settings"
  ];

  if (loading) {
    return (
      <div className="flex bg-[#0A1120] text-slate-100 min-h-screen items-center justify-center">
        <div className="text-sm font-semibold animate-pulse">Loading Procurement Portal...</div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex bg-[#0A1120] text-slate-100 min-h-screen items-center justify-center flex-col gap-4">
        <div className="text-red-400 font-bold">{errorMsg}</div>
        <button
          onClick={() => {
            logout();
            router.push("/login/manager");
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg text-xs"
        >
          Go to Login
        </button>
      </div>
    );
  }

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
              <div className="font-bold text-white tracking-wide">{organizationName}</div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">Constructions</div>
            </div>
          </div>

          <nav className="p-3 space-y-0.5">
            {tabsList.map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                  activeTab === tabName
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/15"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {iconMap[tabName] || <LayoutDashboard className="h-4 w-4" />}
                <span className="flex-1 text-left">{tabName}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4 bg-[#0B1222]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 grid place-items-center text-xs font-bold font-mono">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate font-sans">{profileName}</div>
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
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.name}>{proj.name}</option>
                ))}
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
                  { label: "Active Suppliers", val: filteredKpis.activeSuppliers, desc: `${vendors.length} Registered Suppliers` },
                  { label: "Total PO Value MTD", val: filteredKpis.totalPOValueMTD, desc: kpiPoValueDesc },
                  { label: "Low Stock Items", val: filteredKpis.lowStock, desc: kpiLowStockDesc },
                  { label: "Out of Stock Items", val: filteredKpis.outOfStock, desc: kpiOutOfStockDesc }
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
                    {stockChartData.length > 0 ? (
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
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">No inventory data to display.</div>
                    )}
                  </div>
                </div>

                <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Critical Notifications</h3>
                  <div className="space-y-3 text-xs">
                    {filteredInventory.filter(item => item.status === "Out of Stock" || item.stock <= 0).map((item) => (
                      <div key={item.id} className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                        <div>
                          <div className="font-bold text-white">Out of Stock: {item.name}</div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Stock has hit 0 {item.unit}. Reorder immediately to prevent halt.</p>
                        </div>
                      </div>
                    ))}
                    {filteredInventory.filter(item => item.status === "Low Stock" && item.stock > 0).map((item) => (
                      <div key={item.id} className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                        <div>
                          <div className="font-bold text-white">Low Stock: {item.name}</div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Stock at {item.stock} {item.unit} (Minimum threshold: {item.minLimit} {item.unit}).</p>
                        </div>
                      </div>
                    ))}
                    {filteredInventory.filter(item => item.status === "In Stock").length === filteredInventory.length && (
                      <div className="text-xs text-slate-400 text-center py-4">No critical inventory warnings. All levels normal.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STOCK LEDGER */}
          {activeTab === "Stock Ledger" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleAddInventory} className="bg-[#111C30] border border-slate-800 rounded-xl p-4 grid grid-cols-5 gap-3 items-end">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Material Name</label>
                  <input
                    type="text"
                    placeholder="e.g. TMT Steel 16mm"
                    value={addInvName}
                    onChange={(e) => setAddInvName(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Category</label>
                  <select
                    value={addInvCategory}
                    onChange={(e) => setAddInvCategory(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Binders">Binders</option>
                    <option value="Structural">Structural</option>
                    <option value="Aggregates">Aggregates</option>
                    <option value="Masonry">Masonry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Current Stock</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 500"
                    value={addInvStock}
                    onChange={(e) => setAddInvStock(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Min Threshold</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 100"
                    value={addInvMin}
                    onChange={(e) => setAddInvMin(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 block mb-1">Unit</label>
                    <input
                      type="text"
                      placeholder="Bags, Tons, m³"
                      value={addInvUnit}
                      onChange={(e) => setAddInvUnit(e.target.value)}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-550 text-white font-bold py-2 px-3 rounded-lg text-xs transition flex items-center gap-1 h-[34px]">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
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
                      {filteredInventory.map((item) => (
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
                <button type="submit" className="bg-blue-600 hover:bg-blue-550 text-white font-bold py-2 px-4 rounded-lg text-xs transition flex items-center gap-1.5 h-[34px]">
                  <Plus className="h-4 w-4" /> Create RFQ
                </button>
              </form>

              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active RFQs Logs</h3>
                <div className="space-y-3">
                  {filteredRfqs.map((rfq) => (
                    <div key={rfq.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0e1628] border border-slate-850 text-xs">
                      <div>
                        <div className="font-bold text-white">{rfq.material}</div>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">RFQ ID: {rfq.rfqId} | Quantity: {rfq.quantity}</span>
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
                    {vendors.map((v, idx) => (
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
            <div className="space-y-6">
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Indent Approvals</h3>
                <div className="space-y-3">
                  {filteredRequisitions.map((ind, idx) => (
                    <div key={idx} className="p-4 bg-[#0e1628] border border-slate-855 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">{ind.material}</div>
                        <span className="text-[10px] text-slate-500 mt-0.5">Indent: {ind.indentId} | Raised by: {ind.requestedBy}</span>
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

              {/* Purchase Orders Section */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Purchase Orders (POs)</h3>
                
                {/* Form to Add PO */}
                <form onSubmit={handleAddPurchaseOrder} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 grid grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Material Name</label>
                    <input
                      type="text"
                      placeholder="e.g. OPC 53 Cement"
                      value={poMaterial}
                      onChange={(e) => setPoMaterial(e.target.value)}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Quantity</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={poQuantity}
                      onChange={(e) => setPoQuantity(e.target.value)}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Unit Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 450"
                      value={poUnitPrice}
                      onChange={(e) => setPoUnitPrice(e.target.value)}
                      className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-550 text-white font-bold py-2 px-3 rounded-lg text-xs transition h-[34px]">
                    Create Purchase Order
                  </button>
                </form>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-3 px-2">PO Number</th>
                        <th className="py-3 px-2">Material Name</th>
                        <th className="py-3 px-2 text-right">Quantity</th>
                        <th className="py-3 px-2 text-right">Unit Price</th>
                        <th className="py-3 px-2 text-right">Total Amount</th>
                        <th className="py-3 px-2">Date</th>
                        <th className="py-3 px-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchaseOrders.map((po) => (
                        <tr key={po.id} className="border-b border-slate-800/50 hover:bg-white/5">
                           <td className="py-3 px-2 font-mono text-blue-450 font-bold">{po.poNumber}</td>
                          <td className="py-3 px-2 font-bold text-white">{po.materialName}</td>
                          <td className="py-3 px-2 text-right font-mono">{po.quantity}</td>
                          <td className="py-3 px-2 text-right font-mono">₹{po.unitPrice?.toLocaleString()}</td>
                          <td className="py-3 px-2 text-right font-mono font-bold text-emerald-400">₹{po.totalAmount?.toLocaleString()}</td>
                          <td className="py-3 px-2 font-mono text-slate-400">{po.poDate}</td>
                          <td className="py-3 px-2 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400">
                              {po.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredPurchaseOrders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-slate-500">No Purchase Orders logged.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                  <button onClick={() => handleSendAIChat()} className="bg-blue-600 hover:bg-blue-550 text-white p-2.5 rounded-lg transition">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-sans">Market Analysis Queries</h4>
                <div className="space-y-2.5 text-xs text-blue-400">
                  {aiSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendAIChat(sug)}
                      className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-blue-500 transition block text-slate-300"
                    >
                      🔮 {sug}
                    </button>
                  ))}
                  {aiSuggestions.length === 0 && (
                    <>
                      <button onClick={() => handleSendAIChat("Forecast steel price trends.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-blue-500 transition block">🔮 Forecast steel price trends.</button>
                      <button onClick={() => handleSendAIChat("Compare cement supplier delivery ratings.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-blue-500 transition block">🔮 Compare cement supplier delivery ratings.</button>
                      <button onClick={() => handleSendAIChat("Show low stock warnings.")} className="w-full text-left p-2.5 bg-[#0e1628] rounded-lg border border-slate-850 hover:border-blue-500 transition block">🔮 Show low stock warnings.</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "Settings" && (
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn max-w-xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Dashboard Profile & Configurations</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Sidebar Menu Items (Separated by |)</label>
                  <input
                    type="text"
                    value={formSidebarMenus}
                    onChange={(e) => setFormSidebarMenus(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">AI suggestions (Separated by |)</label>
                  <textarea
                    value={formAiSuggestions}
                    onChange={(e) => setFormAiSuggestions(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500 h-20"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Avatar Initials</label>
                  <input
                    type="text"
                    value={formAvatarInitials}
                    onChange={(e) => setFormAvatarInitials(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                    maxLength={3}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Total PO Value KPI Description</label>
                  <input
                    type="text"
                    value={formKpiPoValueDesc}
                    onChange={(e) => setFormKpiPoValueDesc(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Low Stock KPI Description</label>
                  <input
                    type="text"
                    value={formKpiLowStockDesc}
                    onChange={(e) => setFormKpiLowStockDesc(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Out of Stock KPI Description</label>
                  <input
                    type="text"
                    value={formKpiOutOfStockDesc}
                    onChange={(e) => setFormKpiOutOfStockDesc(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-550 text-white font-bold py-2 px-4 rounded-lg text-xs transition">Save configurations</button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
